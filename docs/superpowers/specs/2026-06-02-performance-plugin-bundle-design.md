# Performance Plugin Bundle — Design Spec

**Date:** 2026-06-02  
**Stack:** Next.js 15 · React 19 · Payload CMS 3 (SQLite) · Self-hosted VPS  
**Approach:** Approach A — single `performancePlugin.ts` entry with `performance/` sub-folder  
**Supersedes:** `2026-05-28-performance-plugins-design.md` (original spec, revised after codebase audit)

---

## Context

The site needs full-stack performance optimization (LCP, image load, JS bundle, Payload queries). All improvements are packaged as a single reusable plugin following the patterns already established in `src/plugins/`. The plugin is fully toggleable from the Payload admin panel under **Plugins → Performance**.

### Key decisions made during design

| Question | Decision | Reason |
|---|---|---|
| Admin settings | Payload Global with all feature toggles | Matches `LanguageSettingsGlobal`, `ChatbotGlobal` patterns |
| Code splitting | `SuspenseSection` only (no `LazyBlock`) | Most blocks are Server Components; `next/dynamic` only splits client code |
| Caching | `unstable_cache` (cross-request) + React `cache()` (per-render dedup) | Existing `payload.ts` already uses `unstable_cache`; both layers complement each other |
| nginx | Documentation-only (`performance.conf` + `README.md`) | Build-time concern; auto-deploy requires ops permissions not in the deploy script |
| Enable/disable | Master toggle in Global (runtime) + `enabled` option in `withPerformance` (build-time) | `withPerformance` runs at build time so cannot read the DB |

---

## File Structure

### Files to create

```
src/plugins/
  performancePlugin.ts                        ← Payload Plugin entry point
  performance/
    PerformanceSettingsGlobal.ts               ← Payload Global (admin toggles)
    withPerformance.ts                         ← Next.js config wrapper
    createCachedFetch.ts                       ← dual-layer caching utility
    components/
      SuspenseSection.tsx                      ← <Suspense> boundary wrapper
      OptimizedHero.tsx                        ← next/image + priority + LCP preload
      SectionSkeleton.tsx                      ← animated pulse fallback
      index.ts                                 ← barrel export
    nginx/
      performance.conf                         ← nginx brotli/gzip/proxy-cache snippet
      README.md                                ← manual apply instructions
```

### Files to modify

```
src/payload.config.ts          ← add performancePlugin() to plugins array
next.config.ts                 ← wrap nextConfig with withPerformance()
src/lib/payload.ts             ← apply createCachedFetch to page-level queries
src/lib/layout-renderer.tsx    ← wrap *ServerSection blocks with SuspenseSection
```

### Exports from `performancePlugin.ts`

```ts
export { performancePlugin }      // Payload Plugin — for payload.config.ts
export { withPerformance }        // Next.js wrapper — for next.config.ts
export { createCachedFetch }      // Caching utility — for src/lib/payload.ts
export {
  SuspenseSection,
  OptimizedHero,
  SectionSkeleton,
} from './performance/components'
```

---

## Plugin 1 — `performancePlugin.ts` (Payload CMS Entry)

### Responsibility

- Registers `PerformanceSettingsGlobal` into the Payload config
- On `onInit`: self-seeds into the `plugins` collection with all features listed
- On `onInit`: injects `index: true` onto `slug`, `updatedAt`, `locale`, `_status` fields for every collection in `indexedCollections` (when `sqliteIndexesEnabled` is true in settings)
- Skips all seeding during `NEXT_PHASE === 'phase-production-build'`

### Interface

```ts
export interface PerformancePluginOptions {
  indexedCollections?: string[]
  // default: ['pages', 'posts', 'portfolio', 'media', 'categories']
}

export const performancePlugin = (options?: PerformancePluginOptions): Plugin
```

### Self-seed metadata

```
name:        'Performance Plugin'
slug:        'performance'
pluginType:  'built-in'
category:    'utility'
status:      'active'
autoActivate: true
features:
  - Image Optimization (hook)
  - Smart Cache Headers (hook)
  - Streaming SSR / SuspenseSection (hook)
  - Payload Query Caching (hook)
  - SQLite Auto-Indexing (collection)
  - Optimized Hero Component (field)
  - nginx Config Template (script)
```

### SQLite index injection

Runs at config-build time inside the plugin function (not `onInit`). Iterates `incomingConfig.collections` and for each collection in `indexedCollections`, maps over fields and adds `index: true` to fields named `slug`, `updatedAt`, `locale`, or `_status`. Fields already marked `index: true` are untouched. No migration is generated — Payload's SQLite adapter applies indexes on next schema sync.

---

## Plugin 2 — `PerformanceSettingsGlobal.ts`

### Admin placement

```ts
admin: {
  group: 'Plugins',
  label: 'Performance',
  description: 'Full-stack performance optimization settings.',
}
```

This places the global under **Plugins → Performance** in the sidebar.

### `afterChange` hook

Fires `revalidateTag('perf-settings')` on every save so `createCachedFetch` picks up new settings immediately.

### Fields

**Master toggle (always visible):**
- `pluginEnabled` — checkbox, default `true`. When `false`, all 5 sections below grey out via `admin.condition` and all runtime features no-op.

**Section 1 — Image Optimization** (`admin.condition: data.pluginEnabled`)
- `imageOptimizationEnabled` — checkbox, default `true`
- `imageFormats` — select-multiple `['webp', 'avif']`, default `['webp']`
- `imageDeviceSizes` — text (comma-separated px), default `'360,640,750,828,1080,1200,1920'`

**Section 2 — HTML Cache Headers** (`admin.condition: data.pluginEnabled`)
- `cacheHeadersEnabled` — checkbox, default `true`
- `htmlCacheTtl` — number (seconds), default `60` — the `s-maxage` value
- `staleWhileRevalidate` — number (seconds), default `600`

**Section 3 — Streaming SSR** (`admin.condition: data.pluginEnabled`)
- `streamingEnabled` — checkbox, default `true`
- `skeletonRows` — number, default `3`

**Section 4 — Payload Query Cache** (`admin.condition: data.pluginEnabled`)
- `queryCacheEnabled` — checkbox, default `true`
- `queryCacheTtl` — number (seconds), default `60`
- `queryCacheTags` — text (tag prefix), default `'perf'`

**Section 5 — SQLite Indexes** (`admin.condition: data.pluginEnabled`)
- `sqliteIndexesEnabled` — checkbox, default `true`
- `indexedCollections` — array of text fields, default `['pages','posts','portfolio','media','categories']`

---

## Plugin 3 — `withPerformance.ts` (Next.js Config Wrapper)

### Interface

```ts
export interface WithPerformanceOptions {
  enabled?: boolean             // default: true — build-time killswitch
  imageOptimization?: boolean   // default: true
  fixCacheHeaders?: boolean     // default: true
  htmlCacheTtl?: number         // default: 60
  staleWhileRevalidate?: number // default: 600
}

export function withPerformance(
  config: NextConfig,
  options?: WithPerformanceOptions,
): NextConfig
```

When `enabled: false`, returns `config` unchanged (passthrough).

### Usage in `next.config.ts`

```ts
import { withPayload } from '@payloadcms/next/withPayload'
import { withPerformance } from './src/plugins/performancePlugin'

export default withPayload(
  withPerformance(nextConfig, {
    enabled: process.env.PERFORMANCE_PLUGIN !== 'false',
    imageOptimization: true,
    fixCacheHeaders: true,
  })
)
```

### Patch 1 — Image optimization

Sets `images.unoptimized = false` when `imageOptimization: true`. The `remotePatterns` and `sharp` dependency are already in place.

### Patch 2 — Cache headers

Replaces the existing `no-cache, no-store, must-revalidate` rule for non-static routes. The security headers block (`defaultSecurityHeaders`) is preserved untouched — only the `Cache-Control` value changes.

| Route | Before | After |
|---|---|---|
| HTML pages | `no-cache, no-store, must-revalidate` | `no-cache, s-maxage=<ttl>, stale-while-revalidate=<swr>` |
| `_next/static/*` | `public, max-age=31536000, immutable` | unchanged |
| API routes | `no-store` | `no-store` (unchanged) |

`no-cache` means the browser always revalidates (prevents ChunkLoadError after deploys). `s-maxage` lets the nginx proxy serve cached HTML — repeat visitors bypass Node entirely for 60 s.

---

## Plugin 4 — `createCachedFetch.ts` (Dual-Layer Caching)

### Two layers

| Layer | API | Scope | Purpose |
|---|---|---|---|
| Outer | `unstable_cache` | Cross-request, server-persistent | Avoid hitting Payload DB on every request |
| Inner | React `cache()` | Per-request, render-tree | Dedup if same query called multiple times in one render |

### Factory function

```ts
export function createCachedFetch(payload: Payload, settings: PerformanceSettings) {
  const { queryCacheEnabled, queryCacheTtl = 60 } = settings

  const withCache = <T>(fn: () => Promise<T>, tags: string[]): Promise<T> =>
    queryCacheEnabled
      ? unstable_cache(fn, tags, { revalidate: queryCacheTtl, tags })()
      : fn()

  return {
    findBySlug: cache((collection: string, slug: string) =>
      withCache(
        () => payload.find({ collection, where: { slug: { equals: slug } }, limit: 1 }),
        [`perf:${collection}:${slug}`]
      )
    ),
    findFrontpage: cache((locale: string) =>
      withCache(
        () => payload.find({
          collection: 'pages',
          where: { isFrontpage: { equals: true }, status: { equals: 'published' } },
          locale: locale as any,
          limit: 1,
        }),
        [`perf:frontpage:${locale}`]
      )
    ),
    findGlobal: cache((slug: string, locale?: string) =>
      withCache(
        () => payload.findGlobal({ slug, locale: locale as any }),
        [`perf:global:${slug}`]
      )
    ),
    findMany: cache((collection: string, opts?: { limit?: number; locale?: string }) =>
      withCache(
        () => payload.find({ collection, limit: opts?.limit ?? 20, locale: opts?.locale as any }),
        [`perf:${collection}:list`]
      )
    ),
  }
}
```

### Integration into `src/lib/payload.ts`

`getFrontpage`, `getPage`, `getNavigation`, `getBlockTemplates` are updated to use `createCachedFetch` when `pluginEnabled` and `queryCacheEnabled` are true. Existing function signatures are unchanged — all callers (`page.tsx` files) need no modifications.

Cache invalidation: existing `revalidate = 60` on page components remains the primary TTL. `revalidateTag('perf:pages:home')` etc. can be called from `afterChange` hooks for instant invalidation on content save.

---

## Plugin 5 — `SuspenseSection.tsx` + `SectionSkeleton.tsx`

### `SuspenseSection`

```ts
interface SuspenseSectionProps {
  children: React.ReactNode
  fallback?: React.ReactNode  // defaults to <SectionSkeleton rows={3} />
  className?: string
}
```

Reads `streamingEnabled` from the performance settings Global (cached with `unstable_cache`). When `false` or when `pluginEnabled` is `false`, renders `children` directly — zero React overhead.

### `SectionSkeleton`

```ts
interface SectionSkeletonProps {
  rows?: number       // default: 3
  className?: string
}
```

Pure Tailwind `animate-pulse`. No external dependency. Renders `rows` grey rounded bars.

### Blocks wrapped in `layout-renderer.tsx`

Only the `*ServerSection` variants that perform their own Payload queries — these benefit from streaming because they resolve independently of page data:

- `FAQSectionServerSection`
- `FAQMainServerSection`
- `TestimonialsSectionServerSection`
- `ArticleGridServerSection`
- `ArticleFeaturedServerSection`
- `ProjectGridServerSection`
- `JobsListSection`

---

## Plugin 6 — `OptimizedHero.tsx`

Drop-in replacement for `<Image>` on above-the-fold hero images. Always sets `priority` (emits `<link rel="preload">` for LCP) and `sizes="100vw"` for full-width images. Accepts all standard `next/image` props.

Not gated by any plugin setting — it's a component primitive, always active once imported.

---

## Plugin 7 — nginx Doc (`performance.conf` + `README.md`)

`performance.conf` is a composable include snippet (not a full server block):
- Brotli compression with gzip fallback
- Proxy cache zone (`perf_cache`, 256MB)
- `proxy_cache_bypass` on Cookie / Authorization headers
- Upstream keep-alive (`keepalive 16`)
- HTTP/2 note (comment only — must be set on `listen` directive)

`README.md` covers: where to copy the file on the UAT server, how to `include` it in the nginx site config, how to verify with `nginx -t`, and how to reload with `systemctl reload nginx`.

---

## Enable / Disable Matrix

| Feature | Runtime toggle (Global) | Build-time toggle | No-op behavior |
|---|---|---|---|
| Image optimization | `pluginEnabled` + `imageOptimizationEnabled` | `withPerformance({ imageOptimization: false })` | `unoptimized: true` restored |
| Cache headers | `pluginEnabled` + `cacheHeadersEnabled` | `withPerformance({ fixCacheHeaders: false })` | `no-store` restored |
| Streaming SSR | `pluginEnabled` + `streamingEnabled` | — | children rendered directly |
| Query cache | `pluginEnabled` + `queryCacheEnabled` | — | raw Payload calls, no cache |
| SQLite indexes | `pluginEnabled` + `sqliteIndexesEnabled` | — | fields not modified at build |
| Entire plugin | `pluginEnabled: false` | `withPerformance({ enabled: false })` | full passthrough |

---

## Verification Plan

1. **SQLite indexes** — after first server start, run `sqlite3 data/payload.db ".schema"` and confirm `CREATE INDEX` entries appear on `slug` / `updatedAt` columns.
2. **Image optimization** — DevTools Network → filter Img → confirm responses are `image/webp` not `image/png`.
3. **Cache headers** — `curl -I https://uat.atech.software/` → confirm `Cache-Control: no-cache, s-maxage=60, stale-while-revalidate=600`.
4. **Streaming SSR** — DevTools Network → Doc tab → confirm HTML streams in chunks (chunked transfer encoding).
5. **Query cache** — add `console.log` to `getFrontpage` → confirm it fires once per TTL interval, not on every request.
6. **Admin toggle** — toggle `pluginEnabled` off → confirm `SuspenseSection` renders children without Suspense, query cache bypasses `unstable_cache`.
7. **Build passthrough** — set `PERFORMANCE_PLUGIN=false` → confirm `next build` produces `unoptimized: true` and `no-store` headers.
8. **TypeScript** — `npx tsc --noEmit` must pass with zero errors.
9. **Build** — `npm run build` must complete with no errors.

---

## Composition Diagram

```
Request
  │
  ├─ nginx (performance.conf — manual apply)
  │     brotli compress · proxy cache HTML 60s · HTTP/2 · keep-alive
  │
  └─► Next.js (withPerformance wraps nextConfig)
        image optimization (sharp) · s-maxage cache headers
        │
        └─► Payload (performancePlugin)
              SQLite indexes · PerformanceSettingsGlobal
              │
              └─► Server Components (createCachedFetch)
                    unstable_cache (cross-request) · React cache() (per-render dedup)
                    │
                    └─► layout-renderer.tsx
                          SuspenseSection → streaming SSR for *ServerSection blocks
                          OptimizedHero  → LCP preload on hero images
```

Each layer is independently removable. Removing `withPerformance` does not break `performancePlugin`. Disabling streaming does not break query caching.

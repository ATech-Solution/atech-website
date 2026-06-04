# Performance Plugins — Design Spec

**Date:** 2026-05-28  
**Stack:** Next.js 15.3.4 · React 19 · Payload CMS 3.33.0 (SQLite) · Self-hosted VPS  
**Depends on:** [Full-Stack Performance Optimization spec](./2026-05-28-performance-optimization-design.md)

---

## Context

The full-stack performance optimization plan covers 4 layers. Rather than applying these changes as one-off edits scattered across the codebase, this spec packages each layer as a **reusable, drop-in plugin** following the patterns already established in `src/plugins/`. The goal is that future projects (or a fresh clone of this one) can opt into all optimizations with a handful of import lines.

---

## Plugins Overview

| Plugin | Layer | File(s) |
|---|---|---|
| `performancePlugin` | Payload CMS — indexes, select, cache | `src/plugins/performancePlugin.ts` |
| `withPerformance` | Next.js config wrapper | `src/plugins/withPerformance.ts` |
| `LazyBlock` / `SuspenseSection` / `OptimizedHero` | React UI components | `src/plugins/performance/components/` |
| `nginx-performance.conf` | Infrastructure template | `config/nginx/performance.conf` |

All four are independent — they can be adopted one at a time.

---

## Plugin 1 — `performancePlugin` (Payload CMS)

### What it does
- Auto-injects `index: true` onto `slug`, `updatedAt`, `locale`, and `_status` fields for every collection listed in `indexedCollections`.
- Exports a `createCachedFetch(payload)` factory that wraps common queries with React 19's `cache()` for request deduplication within a single render tree.
- Self-seeds into the `plugins` collection on first server start (same as every other plugin in this repo).

### Interface
```ts
export interface PerformancePluginOptions {
  /** Collection slugs to add SQLite indexes to. Default: all collections. */
  indexedCollections?: string[]
  /** Per-collection field selection presets applied to find() calls via createCachedFetch. */
  selectDefaults?: Record<string, Record<string, true>>
}

export const performancePlugin = (options?: PerformancePluginOptions): Plugin
```

### How it modifies Payload config
The plugin iterates `incomingConfig.collections` and for each collection in `indexedCollections`, it maps over its `fields` array and adds `index: true` to any field named `slug`, `updatedAt`, `locale`, or `_status`. Fields already marked `index: true` are untouched. This runs at config-build time — no runtime overhead.

### `createCachedFetch` utility
Exported separately from the plugin itself so it can be used in Server Components regardless of whether the plugin is registered:
```ts
// src/plugins/performance/createCachedFetch.ts
import { cache } from 'react'
import type { Payload } from 'payload'

export function createCachedFetch(payload: Payload) {
  return {
    findBySlug: cache((collection: string, slug: string, select?: Record<string, true>) =>
      payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, select })
    ),
    findMany: cache((collection: string, opts?: { limit?: number; select?: Record<string, true> }) =>
      payload.find({ collection, limit: opts?.limit ?? 20, select: opts?.select })
    ),
  }
}
```

Pages call `getPayload()` once at the top, wrap it with `createCachedFetch`, then pass the result to layout builder blocks — eliminating duplicate Payload calls within the same render tree.

### Self-seed features declared
- `Auto SQLite Indexing` (type: `collection`)
- `Cached Fetch Utilities` (type: `hook`)

---

## Plugin 2 — `withPerformance` (Next.js Config Wrapper)

### What it does
Wraps `nextConfig` before `withPayload`, patching three areas:
1. **Image optimization** — removes `unoptimized: true` in production and ensures `sharp` is expected as a dependency.
2. **Cache headers** — replaces the blanket `no-cache, no-store` on HTML with a two-tier strategy: browser gets `no-cache` (revalidates on every request), CDN/nginx proxy gets `s-maxage=60, stale-while-revalidate=600`. `_next/static` remains `immutable`.
3. **PPR flag** — optionally enables `experimental.ppr = true`.

### Interface
```ts
export interface WithPerformanceOptions {
  /** Re-enable Next.js image optimization via sharp. Default: true */
  imageOptimization?: boolean
  /** Fix HTML cache headers for CDN-aware caching. Default: true */
  fixCacheHeaders?: boolean
  /** Enable Partial Pre-rendering (Next.js 15 experimental). Default: false */
  ppr?: boolean
}

export function withPerformance(config: NextConfig, options?: WithPerformanceOptions): NextConfig
```

### Usage in next.config.ts
```ts
import { withPayload } from '@payloadcms/next/withPayload'
import { withPerformance } from './src/plugins/withPerformance'

export default withPayload(withPerformance(nextConfig, {
  imageOptimization: true,
  fixCacheHeaders: true,
  ppr: false,         // enable per-page via export const experimental_ppr = true
}))
```

### Cache header strategy (detail)
The current `no-store` was added to prevent `ChunkLoadError` — a valid concern. The fix is not to remove all caching but to separate browser caching from proxy caching:

| Route | Browser | CDN / nginx proxy |
|---|---|---|
| HTML pages | `no-cache` (revalidates, never stores stale) | `s-maxage=60, stale-while-revalidate=600` |
| `_next/static/*` | `public, max-age=31536000, immutable` | same |
| API routes | `no-store` | `no-store` |

`no-cache` prevents the browser from serving stale chunks after a deploy. `s-maxage` lets the nginx proxy cache HTML for 60 s — repeat visitors are served from the proxy, not from Node.

---

## Plugin 3 — UI Performance Components

### Location
`src/plugins/performance/components/`

### Components

#### `LazyBlock`
A higher-order component that wraps any layout builder block with `next/dynamic`. Used in the block renderer to code-split every block that isn't above the fold.
```ts
// Usage in block renderer
const HeroSection     = LazyBlock(() => import('@/components/block/Advance/HeroSection'))
const ContactSection  = LazyBlock(() => import('@/components/block/Advance/ContactSection'))
```
Signature: `function LazyBlock<T>(loader: () => Promise<{ default: ComponentType<T> }>): ComponentType<T>`  
Internally calls `next/dynamic(loader, { loading: () => <BlockSkeleton /> })`.

#### `SuspenseSection`
Wraps a layout builder section with a `<Suspense>` boundary. Enables streaming SSR — the section's data can resolve independently without blocking the rest of the page.
```tsx
<SuspenseSection fallback={<SectionSkeleton rows={3} />}>
  <ContactStatsSection {...props} />
</SuspenseSection>
```
Props: `children`, `fallback` (optional — defaults to a neutral grey skeleton), `className`.

#### `OptimizedHero`
A thin wrapper around `next/image` that:
- Always sets `priority` (emits `<link rel="preload">` for LCP)
- Sets sensible `sizes` for full-width hero images (`100vw`)
- Accepts all standard `<Image>` props and passes them through
```tsx
<OptimizedHero src="/media/hero.jpg" alt="Hero" fill />
```

### BlockSkeleton / SectionSkeleton
Simple animated pulse skeletons used as fallbacks. Stored alongside the components. No external dependency — pure Tailwind `animate-pulse`.

---

## Plugin 4 — nginx Config Template

### Location
`config/nginx/performance.conf`

### What it contains
A composable nginx snippet (not a full server block — designed to be `include`d):
- Brotli compression directives (with graceful fallback comment for distros without `ngx_brotli`)
- gzip fallback (`gzip on; gzip_comp_level 5; gzip_types ...`)
- Proxy cache zone definition (`perf_cache`, 256 MB)
- `proxy_cache_bypass` rules (bypass on `Cookie`, `Authorization`, `X-Bypass-Cache` header)
- Upstream keep-alive (`keepalive 16`)
- HTTP/2 note (must be set on the `listen` directive, not include-able — documented as a comment)

### Usage
```nginx
# /etc/nginx/sites-available/atech
include /path/to/config/nginx/performance.conf;

server {
  listen 443 ssl http2;
  ...
}
```

---

## Composition — How All Four Work Together

```
Request
  │
  ├─ nginx (performance.conf)
  │     brotli compress, proxy cache HTML 60s, HTTP/2
  │
  └─► Next.js (withPerformance wraps nextConfig)
        image optimization, fixed cache headers, PPR
        │
        └─► Payload (performancePlugin)
              indexed collections, cached fetch deduplication
              │
              └─► React tree
                    LazyBlock (code split), SuspenseSection (streaming),
                    OptimizedHero (LCP preload)
```

Each layer is independently removable. Removing `withPerformance` doesn't break `performancePlugin`. Removing `LazyBlock` doesn't break `withPerformance`.

---

## Files to Create

```
src/plugins/
  performancePlugin.ts              ← Payload plugin (Plugin interface)
  withPerformance.ts                ← Next.js config wrapper
  performance/
    createCachedFetch.ts            ← cache() utility (usable standalone)
    components/
      LazyBlock.tsx
      SuspenseSection.tsx
      OptimizedHero.tsx
      BlockSkeleton.tsx
      SectionSkeleton.tsx
      index.ts                      ← barrel export

config/
  nginx/
    performance.conf                ← nginx include snippet
```

## Files to Modify

```
next.config.ts                      ← add withPerformance() wrapper
src/payload.config.ts               ← add performancePlugin() to plugins array
```

## Optional (post-analyzer pass)
```
src/app/(frontend)/*/page.tsx       ← wrap sections in <SuspenseSection>
src/components/block/Advance/*.tsx  ← swap heavy imports for LazyBlock
```

---

## Verification Plan

1. **`performancePlugin` indexes** — run `next build` and inspect the SQLite schema (`sqlite3 data/payload.db .schema`) — confirm index entries appear on slug/updatedAt columns.
2. **`withPerformance` cache headers** — `curl -I https://yoursite.com/` — confirm response includes `Cache-Control: no-cache` (browser) and `X-Cache` header from nginx (proxy hit on second request).
3. **Image optimization** — open DevTools Network → filter by `Img` → confirm responses are `webp` or `avif` content-type instead of `jpeg/png`.
4. **`LazyBlock` code splitting** — run `ANALYZE=true next build` — confirm heavy blocks appear as separate chunks, not bundled into `main`.
5. **`SuspenseSection` streaming** — open DevTools → Network → `Doc` tab → check that the HTML response streams in chunks (Content-Type: `text/html; charset=utf-8` with chunked transfer).
6. **Lighthouse baseline vs after** — run Lighthouse mobile (throttled 4G) before and after. Target: LCP < 2.5 s, Score > 85 on the homepage and a content-heavy page.

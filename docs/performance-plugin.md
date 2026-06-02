# Performance Plugin

> Full-stack performance bundle for Payload CMS 3.x + Next.js 15 (App Router). SQLite auto-indexing, dual-layer query caching, smart HTML cache headers, Next.js image optimization, and streaming SSR — all togglable from the admin panel.

---

## Overview

| Item | Value |
|---|---|
| Plugin slug | `performance` |
| Payload Global | `performance-settings` |
| Admin nav | Plugins → Performance |
| Next.js wrapper | `withPerformance(nextConfig, options)` |
| Cache utility | `withPerfCache(fn, keys, options)` |
| Components | `SuspenseSection`, `OptimizedHero`, `SectionSkeleton` |
| nginx doc | `src/plugins/performance/nginx/performance.conf` |

---

## File Structure

```
src/
├── plugins/
│   ├── performancePlugin.ts                    # Plugin entry: seeding, SQLite indexes, Global registration
│   └── performance/
│       ├── PerformanceSettingsGlobal.ts         # Payload Global — all admin toggles
│       ├── withPerformance.ts                   # Next.js config wrapper
│       ├── createCachedFetch.ts                 # withPerfCache dual-layer cache utility
│       └── components/
│           ├── SuspenseSection.tsx              # Async RSC Suspense boundary
│           ├── OptimizedHero.tsx                # next/image LCP wrapper
│           ├── SectionSkeleton.tsx              # Tailwind pulse skeleton
│           └── index.ts                         # Barrel export
├── plugins/performance/nginx/
│   ├── performance.conf                         # nginx brotli/gzip/proxy-cache snippet
│   └── README.md                                # Manual apply instructions
```

---

## Features

### 1. SQLite Auto-Indexing

Injects `index: true` onto the `slug` field of configured collections at config-construction time (before server start). Recurses into `tabs`, `group`, `collapsible`, `array`, and `row` nested field containers so no slug is missed.

```ts
performancePlugin({
  indexedCollections: ['pages', 'posts', 'portfolio', 'media', 'categories'],
})
```

**Admin toggle:** SQLite Auto-Indexing section → Enable SQLite Auto-Indexing  
**Effect:** Requires server restart to take effect (build-time config change)

---

### 2. Payload Query Caching (`withPerfCache`)

Wraps async Payload fetch functions with two caching layers:

| Layer | API | Scope |
|---|---|---|
| Cross-request | `unstable_cache` | Persists on server across all requests |
| Per-render dedup | React `cache()` | Deduplicates within one render tree |

```ts
import { withPerfCache } from '@/plugins/performancePlugin'

export const getFrontpage = withPerfCache(
  async (locale: string = 'en') => {
    const payload = await getPayloadClient()
    const result = await payload.find({ collection: 'pages', where: { isFrontpage: { equals: true } }, locale, limit: 1 })
    return result.docs[0] ?? null
  },
  ['perf:frontpage'],
  { revalidate: 60, tags: ['perf:frontpage', 'perf:pages'] }
)
```

Cache invalidation — add to collection `afterChange` hooks:
```ts
// src/collections/Pages.ts
afterChange: [async () => {
  const { revalidateTag } = await import('next/cache')
  revalidateTag('perf:pages')
}]
```

**Admin toggle:** Payload Query Cache section → Enable Query Caching  
**Effect:** Changing this toggle takes effect after server restart

---

### 3. Next.js Image Optimization (`withPerformance`)

Removes `unoptimized: true` from the `images` config in production, enabling `sharp` to generate WebP/AVIF output and responsive srcsets.

```ts
// next.config.ts
import { withPerformance } from '@/plugins/performancePlugin'

export default withPayload(
  withPerformance(nextConfig, {
    enabled: process.env.PERFORMANCE_PLUGIN !== 'false',
    imageOptimization: true,
  })
)
```

**Admin toggle:** Image Optimization section → Enable Next.js Image Optimization  
**Note:** The admin field is informational — actual changes require updating `next.config.ts` and restarting.

---

### 4. Smart HTML Cache Headers (`withPerformance`)

Replaces the blanket `no-store` HTML cache header with a two-tier strategy:

| Route | Browser | CDN / nginx proxy |
|---|---|---|
| HTML pages | `no-cache` (always revalidates) | `s-maxage=60, stale-while-revalidate=600` |
| `_next/static/*` | `public, max-age=31536000, immutable` | same |
| API routes | `no-store` | `no-store` |
| `/admin/*` | `no-cache` | excluded from s-maxage |

`no-cache` prevents the browser from serving stale chunks after deploy (prevents ChunkLoadError).  
`s-maxage=60` lets the nginx proxy cache HTML — repeat visitors skip Node entirely for 60 s.

**Killswitch:** `PERFORMANCE_PLUGIN=false` in `.env` → full passthrough, reverts to `no-store`.

---

### 5. Streaming SSR (`SuspenseSection`)

Wraps data-heavy Server Component blocks in a `<Suspense>` boundary for streaming HTML delivery. Reads `streamingEnabled` from the admin settings at runtime — toggling it off renders children directly.

```tsx
import { SuspenseSection } from '@/plugins/performancePlugin'

// In layout renderer or page:
<SuspenseSection>
  <TestimonialsSectionServerSection data={data} />
</SuspenseSection>
```

**Admin toggle:** Streaming SSR section → Enable Streaming SSR (takes effect immediately, no restart needed)

---

### 6. OptimizedHero

Drop-in for `<Image>` on above-the-fold hero images. Always sets `priority` (emits `<link rel="preload">`) and `sizes="100vw"` for LCP.

```tsx
import { OptimizedHero } from '@/plugins/performancePlugin'

<OptimizedHero src="/media/hero.jpg" alt="Hero" fill />
```

---

### 7. nginx Config Template

`src/plugins/performance/nginx/performance.conf` — composable nginx include snippet:
- Brotli compression + gzip fallback
- Proxy cache zone `perf_cache` (256 MB)
- `proxy_cache_bypass` on Cookie / Authorization headers
- Upstream keep-alive (`keepalive 16`)

See `src/plugins/performance/nginx/README.md` for apply instructions.

---

## Admin Panel

Navigate to **Plugins → Performance** in the Payload admin sidebar.

All five sections are gated by the master **Plugin Enabled** toggle at the top. Turning it off instantly no-ops all runtime features (streaming, query cache) without a restart. Build-time features (image opt, cache headers) require a restart.

| Section | Runtime toggle | Build-time only |
|---|---|---|
| Image Optimization | — | ✓ (restart required) |
| HTML Cache Headers | — | ✓ (restart required) |
| Streaming SSR | ✓ (instant) | — |
| Payload Query Cache | — | ✓ (restart required) |
| SQLite Auto-Indexing | — | ✓ (restart required) |

---

## Installation

See `plugins/plugin-performance.zip` → `INSTALL.md` for step-by-step instructions.

---

## Enable / Disable

### Full runtime disable (no restart needed)
In Payload admin → Plugins → Performance → uncheck **Plugin Enabled** → Save.

### Full build-time disable
Add to `.env`:
```
PERFORMANCE_PLUGIN=false
```
Then restart the server.

---

## Cache Invalidation Reference

| Cache tag | Busted by | Covers |
|---|---|---|
| `perf:frontpage` | `Pages.afterChange` | `getFrontpage()` |
| `perf:pages` | `Pages.afterChange` | `getFrontpage()`, `getPage()`, `getBlockTemplates()` |
| `perf:page` | `Pages.afterChange` | `getPage()` |
| `perf:navigation` | `Navigation.afterChange` | `getNavigation()` |
| `perf:block-templates` | `Blocks.afterChange` | `getBlockTemplates()` |
| `perf-settings` | `PerformanceSettingsGlobal.afterChange` | `getPerformanceSettings()` |

---

## Verification

```bash
# 1. Cache headers
curl -I https://uat.atech.software/ | grep cache-control
# → cache-control: no-cache, s-maxage=60, stale-while-revalidate=600

# 2. Static chunks still immutable
curl -I https://uat.atech.software/_next/static/chunks/main.js | grep cache-control
# → cache-control: public, max-age=31536000, immutable

# 3. Admin routes excluded from s-maxage
curl -I https://uat.atech.software/admin | grep cache-control
# → no s-maxage

# 4. Images optimized (in production)
# DevTools → Network → filter Img → confirm image/webp responses

# 5. TypeScript clean
npx tsc --noEmit

# 6. e2e tests
npm run test:e2e -- --grep "Performance Plugin"
```

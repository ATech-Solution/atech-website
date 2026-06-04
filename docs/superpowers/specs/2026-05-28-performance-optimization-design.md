# Performance Optimization — Full Stack Design

**Date:** 2026-05-28  
**Stack:** Next.js 15.3.4 · React 19 · Payload CMS 3.33.0 (SQLite) · Self-hosted VPS  
**Scope:** All four performance layers — Infrastructure, Next.js Config, React/Frontend Code, Payload CMS/Data

---

## Context

The site runs on a self-hosted VPS with `output: 'standalone'`. Images are currently set to `unoptimized: true`, HTML pages are served with `no-cache, no-store` headers (prevents ChunkLoadError but kills repeat-visit speed), no dynamic imports are in use, and Payload queries fetch full documents without field selection or indexes. The goal is measurable improvement across Core Web Vitals (LCP, FID/INP, CLS) and perceived load speed on first and repeat visits.

---

## Layer 1 — Infrastructure (nginx + VPS)

**Goal:** Reduce payload size and request latency before any code runs.

### Changes
1. **Brotli compression** — install `ngx_brotli` module on nginx and enable for text/html, JS, CSS, JSON, SVG. Fallback: `gzip_comp_level 5`. Brotli is ~20% smaller than gzip on average.
2. **HTTP/2** — enable in the nginx server block (`listen 443 ssl http2`). Eliminates request queuing; multiple assets load in parallel over one connection.
3. **nginx proxy cache for HTML** — add a proxy cache zone (256MB) in front of the Next.js Node server. Cache HTML responses for 60s with `stale-while-revalidate`. Bypass on cookies (authenticated users) and the `X-Bypass-Cache` header (ISR purge flow).
4. **Upstream keep-alive** — add `keepalive 16` to the upstream block so nginx reuses connections to the Node process instead of opening a new TCP connection per request.
5. **Cloudflare free CDN** — point DNS through Cloudflare. Serves `_next/static` from edge PoPs globally. Reduces origin load and adds DDoS margin. Zero code change required.

### Expected gain
- 20–30% smaller payloads (brotli)
- Repeat HTML visits: near-instant (nginx proxy cache)
- Global latency reduction for static assets (Cloudflare edge)

---

## Layer 2 — Next.js Config

**Goal:** Fix broken or missing optimization knobs in `next.config.ts`.

### Changes
1. **Re-enable image optimization** — remove `images: { unoptimized: true }`. The `standalone` output runs a Node server that handles `/_next/image` natively. Install `sharp` as a production dependency — Next.js uses it automatically for WebP/AVIF conversion and responsive sizing.
2. **Fix HTML cache headers** — remove `Cache-Control: no-cache, no-store` from HTML page responses. Replace with `s-maxage=60, stale-while-revalidate=600` for the nginx proxy cache / Cloudflare layer. ISR already manages content freshness; the `no-store` header is redundant and harmful.
3. **Add `next/font`** — replace any CDN-loaded Google Fonts with `next/font/google`. Fonts are subsetted, self-hosted, and injected as `<link rel="preload">` automatically, eliminating the render-blocking CDN request.
4. **Enable PPR (Partial Pre-rendering)** — turn on `experimental.ppr = true` in `next.config.ts`. Mark the static shell of pages as `export const experimental_ppr = true`. Dynamic sections (e.g. personalised content, real-time counters) use `<Suspense>` boundaries and stream in independently.
5. **Bundle analyzer** — add `@next/bundle-analyzer` as a dev dependency. Run once (`ANALYZE=true next build`) to identify large client-side packages before cutting them.

### Expected gain
- LCP improvement from WebP/AVIF images and `priority` prop on hero images
- Repeat HTML visits faster (cache header fix)
- Zero layout shift from fonts (next/font)
- Page shell renders instantly with PPR on suitable pages

---

## Layer 3 — React / Frontend Code

**Goal:** Reduce initial JS bundle and enable streaming.

### Changes
1. **Dynamic imports for off-screen components** — wrap layout builder blocks, carousels, map embeds, and any component that doesn't appear above the fold with `next/dynamic`. They are code-split automatically and only loaded when needed.
   ```ts
   const HeavyBlock = dynamic(() => import('@/components/block/Advance/HeavyBlock'), { ssr: false })
   ```
2. **LCP image preload** — add `priority` prop to the hero `<Image>` on every page. Next.js emits a `<link rel="preload">` in `<head>` so the LCP image is fetched in parallel with the HTML.
3. **Suspense boundaries on layout builder sections** — wrap each section in `<Suspense fallback={<SectionSkeleton />}>`. This enables streaming SSR: the HTML shell arrives immediately, sections stream in as their data resolves.
4. **Remove unused JS (post-analyzer)** — after the bundle analyzer pass, identify and remove or replace the largest unused packages. Common culprits: full icon libraries (import only used icons), date libraries with all locales, Payload field components leaked to the client bundle.

### Expected gain
- 30–50% reduction in initial JS bundle (dynamic imports)
- LCP image loads in parallel with HTML (priority prop)
- Page shell visible immediately even on slow connections (Suspense + streaming)

---

## Layer 4 — Payload CMS / Data

**Goal:** Faster database queries and fewer redundant fetches.

### Changes
1. **Field selection on list queries** — add `select: { title: true, slug: true, ... }` to all Payload `find()` calls that are used for navigation, listing, or linking. Avoids fetching large `content` / `layout` fields when only the slug is needed.
2. **SQLite indexes** — add indexes on the fields used in `where` clauses and ISR revalidation:
   - `slug` on all content collections
   - `updatedAt` on all collections
   - `locale` on localised collections
   - Any field used in `status` / `publishedAt` filters
3. **`cache()` deduplication** — wrap Payload fetch utility functions with React 19's `cache()`. Multiple layout builder blocks that request the same document within one render tree will share the result.
   ```ts
   import { cache } from 'react'
   export const getPage = cache(async (slug: string) => { ... })
   ```
4. **Consolidate N+1 patterns** — audit layout builder rendering. If each block independently fetches related data, refactor to a single query at the page level and pass data down as props or via Context.

### Expected gain
- 2–5x faster CMS queries on collections with many documents
- No duplicate Payload calls within the same render tree
- Reduced SQLite I/O on list and navigation queries

---

## Verification Plan

1. **Before starting:** Run Lighthouse (mobile, throttled 4G) on 3 representative pages — record LCP, TBT, CLS, Score.
2. **After Layer 2 (image + cache fix):** Re-run Lighthouse — LCP and repeat-visit scores should improve.
3. **After Layer 3 (dynamic imports):** Run `ANALYZE=true next build` — confirm bundle reduction. Check for JS errors in console (dynamic import misconfiguration shows up here).
4. **After Layer 4 (Payload):** Check Payload query logs or add `console.time` around key fetches — confirm query time reduction.
5. **Final check:** Run Lighthouse again on all 3 pages. Compare against baseline. Target: LCP < 2.5s on mobile, Score > 85.

---

## Files to Modify

| Layer | File(s) |
|---|---|
| Infrastructure | nginx config (outside repo) |
| Next.js Config | `next.config.ts` |
| Fonts | `src/app/layout.tsx` (or root layout) |
| Dynamic imports | `src/components/block/Advance/*.tsx`, layout builder render logic |
| Suspense | `src/app/(frontend)/*/page.tsx` |
| Payload queries | `src/` — any file with `payload.find()` / `payload.findByID()` calls |
| SQLite indexes | `src/collections/*.ts` (add `indexes` field) |
| cache() wrapping | Payload data fetch utilities |

# Performance Plugin Bundle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single reusable `performancePlugin` bundle that adds SQLite indexing, dual-layer Payload query caching, smart HTML cache headers, image optimization, streaming SSR via SuspenseSection, and a Payload admin settings panel under Plugins → Performance.

**Architecture:** Approach A — `src/plugins/performancePlugin.ts` is the Payload Plugin entry that registers `PerformanceSettingsGlobal` and seeds the plugins collection. A `performance/` sub-folder holds all internals: `withPerformance.ts` (Next.js config wrapper), `createCachedFetch.ts` (caching utility), React components, and nginx docs. Runtime features read settings from the Global; build-time features (`withPerformance`) read code-level options.

**Tech Stack:** Next.js 15, React 19 RSC, Payload CMS 3 (SQLite), `unstable_cache` + React `cache()`, Playwright for e2e tests, TypeScript strict mode.

**Spec:** `docs/superpowers/specs/2026-06-02-performance-plugin-bundle-design.md`

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `src/plugins/performancePlugin.ts` | Payload Plugin entry: Global registration, SQLite indexing, seeding |
| Create | `src/plugins/performance/PerformanceSettingsGlobal.ts` | Payload GlobalConfig with all admin toggles |
| Create | `src/plugins/performance/withPerformance.ts` | Next.js config wrapper: image opt + cache headers |
| Create | `src/plugins/performance/createCachedFetch.ts` | `withPerfCache` utility: `unstable_cache` + React `cache()` |
| Create | `src/plugins/performance/components/SectionSkeleton.tsx` | Tailwind pulse skeleton fallback |
| Create | `src/plugins/performance/components/SuspenseSection.tsx` | Async RSC Suspense boundary with settings check |
| Create | `src/plugins/performance/components/OptimizedHero.tsx` | `next/image` wrapper with `priority` for LCP |
| Create | `src/plugins/performance/components/index.ts` | Barrel export |
| Create | `src/plugins/performance/nginx/performance.conf` | nginx brotli/gzip/proxy-cache snippet |
| Create | `src/plugins/performance/nginx/README.md` | Manual apply instructions |
| Create | `tests/e2e/performance.spec.ts` | Playwright e2e tests for plugin features |
| Modify | `src/payload.config.ts` | Add `performancePlugin()` to plugins array |
| Modify | `next.config.ts` | Wrap `nextConfig` with `withPerformance()` |
| Modify | `src/lib/payload.ts` | Add `getPerformanceSettings`, wrap page queries with `withPerfCache` |
| Modify | `src/lib/layout-renderer.tsx` | Wrap `*ServerSection` blocks with `<SuspenseSection>` |

---

## Task 1: `PerformanceSettingsGlobal.ts`

**Files:**
- Create: `src/plugins/performance/PerformanceSettingsGlobal.ts`

- [ ] **Step 1.1: Create the file**

```ts
// src/plugins/performance/PerformanceSettingsGlobal.ts
import type { GlobalConfig } from 'payload'

export const PerformanceSettingsGlobal: GlobalConfig = {
  slug: 'performance-settings',
  label: 'Performance',
  admin: {
    group: 'Plugins',
    description: 'Full-stack performance optimization. All toggles take effect immediately on save.',
  },
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
  },
  hooks: {
    afterChange: [
      async () => {
        try {
          const { revalidateTag } = await import('next/cache')
          revalidateTag('perf-settings')
        } catch {
          // Ignore in non-Next.js contexts
        }
      },
    ],
  },
  fields: [
    // ── Master toggle ────────────────────────────────────────────────────────
    {
      name: 'pluginEnabled',
      type: 'checkbox',
      label: 'Plugin Enabled',
      defaultValue: true,
      admin: {
        description: 'Master switch. Disabling this no-ops all runtime features instantly.',
      },
    },

    // ── 1. Image Optimization ─────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Image Optimization',
      admin: {
        initCollapsed: false,
        condition: (data) => !!data.pluginEnabled,
      },
      fields: [
        {
          name: 'imageOptimizationEnabled',
          type: 'checkbox',
          label: 'Enable Next.js Image Optimization',
          defaultValue: true,
          admin: {
            description: 'Removes unoptimized: true in production. Requires sharp. Apply via withPerformance in next.config.ts.',
          },
        },
        {
          name: 'imageFormats',
          type: 'select',
          label: 'Output Formats',
          hasMany: true,
          defaultValue: ['webp'],
          options: [
            { label: 'WebP', value: 'webp' },
            { label: 'AVIF', value: 'avif' },
          ],
          admin: {
            condition: (data) => !!data.imageOptimizationEnabled,
            description: 'Formats Next.js will generate. AVIF gives better compression but slower encoding.',
          },
        },
        {
          name: 'imageDeviceSizes',
          type: 'text',
          label: 'Device Sizes (px, comma-separated)',
          defaultValue: '360,640,750,828,1080,1200,1920',
          admin: {
            condition: (data) => !!data.imageOptimizationEnabled,
            description: 'Breakpoints used when generating responsive image srcsets.',
          },
        },
      ],
    },

    // ── 2. HTML Cache Headers ─────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'HTML Cache Headers',
      admin: {
        initCollapsed: false,
        condition: (data) => !!data.pluginEnabled,
      },
      fields: [
        {
          name: 'cacheHeadersEnabled',
          type: 'checkbox',
          label: 'Enable Smart Cache Headers',
          defaultValue: true,
          admin: {
            description: 'Replaces no-store with no-cache + s-maxage for proxy caching. Apply via withPerformance.',
          },
        },
        {
          name: 'htmlCacheTtl',
          type: 'number',
          label: 'HTML Cache TTL (seconds)',
          defaultValue: 60,
          admin: {
            condition: (data) => !!data.cacheHeadersEnabled,
            description: 's-maxage value. nginx/CDN serves cached HTML for this many seconds before revalidating.',
          },
        },
        {
          name: 'staleWhileRevalidate',
          type: 'number',
          label: 'Stale-While-Revalidate (seconds)',
          defaultValue: 600,
          admin: {
            condition: (data) => !!data.cacheHeadersEnabled,
            description: 'How long the proxy serves stale content while fetching fresh in the background.',
          },
        },
      ],
    },

    // ── 3. Streaming SSR ──────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Streaming SSR (SuspenseSection)',
      admin: {
        initCollapsed: false,
        condition: (data) => !!data.pluginEnabled,
      },
      fields: [
        {
          name: 'streamingEnabled',
          type: 'checkbox',
          label: 'Enable Streaming SSR',
          defaultValue: true,
          admin: {
            description: 'Wraps data-heavy blocks in <Suspense> for streaming HTML delivery.',
          },
        },
        {
          name: 'skeletonRows',
          type: 'number',
          label: 'Skeleton Rows',
          defaultValue: 3,
          admin: {
            condition: (data) => !!data.streamingEnabled,
            description: 'Number of animated grey bars shown while a streamed block loads.',
          },
        },
      ],
    },

    // ── 4. Payload Query Cache ────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Payload Query Cache',
      admin: {
        initCollapsed: false,
        condition: (data) => !!data.pluginEnabled,
      },
      fields: [
        {
          name: 'queryCacheEnabled',
          type: 'checkbox',
          label: 'Enable Query Caching',
          defaultValue: true,
          admin: {
            description: 'Caches page/navigation Payload queries across requests using unstable_cache.',
          },
        },
        {
          name: 'queryCacheTtl',
          type: 'number',
          label: 'Query Cache TTL (seconds)',
          defaultValue: 60,
          admin: {
            condition: (data) => !!data.queryCacheEnabled,
            description: 'How long page queries are cached before Payload is re-queried.',
          },
        },
        {
          name: 'queryCacheTags',
          type: 'text',
          label: 'Cache Tag Prefix',
          defaultValue: 'perf',
          admin: {
            condition: (data) => !!data.queryCacheEnabled,
            description: 'Prefix for cache tags. Used with revalidateTag() for instant invalidation on content save.',
          },
        },
      ],
    },

    // ── 5. SQLite Indexes ─────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'SQLite Auto-Indexing',
      admin: {
        initCollapsed: true,
        condition: (data) => !!data.pluginEnabled,
      },
      fields: [
        {
          name: 'sqliteIndexesEnabled',
          type: 'checkbox',
          label: 'Enable SQLite Auto-Indexing',
          defaultValue: true,
          admin: {
            description: 'Adds index: true to slug/updatedAt/locale/_status fields at config-build time. Requires restart.',
          },
        },
        {
          name: 'indexedCollections',
          type: 'array',
          label: 'Indexed Collections',
          defaultValue: [
            { slug: 'pages' },
            { slug: 'posts' },
            { slug: 'portfolio' },
            { slug: 'media' },
            { slug: 'categories' },
          ],
          admin: {
            condition: (data) => !!data.sqliteIndexesEnabled,
            description: 'Collection slugs that receive auto-indexes.',
          },
          fields: [
            {
              name: 'slug',
              type: 'text',
              label: 'Collection Slug',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
```

- [ ] **Step 1.2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors related to `PerformanceSettingsGlobal.ts`.

- [ ] **Step 1.3: Commit**

```bash
git add src/plugins/performance/PerformanceSettingsGlobal.ts
git commit -m "feat(performance): add PerformanceSettingsGlobal with all admin toggles"
```

---

## Task 2: `performancePlugin.ts` (Payload Entry)

**Files:**
- Create: `src/plugins/performancePlugin.ts`

- [ ] **Step 2.1: Create the entry file**

```ts
// src/plugins/performancePlugin.ts
import type { Config, Plugin } from 'payload'
import { PerformanceSettingsGlobal } from './performance/PerformanceSettingsGlobal'

export { withPerformance } from './performance/withPerformance'
export { createCachedFetch, withPerfCache } from './performance/createCachedFetch'
export {
  SuspenseSection,
  OptimizedHero,
  SectionSkeleton,
} from './performance/components'

const PLUGIN_NAME        = 'Performance Plugin'
const PLUGIN_SLUG        = 'performance'
const PLUGIN_VERSION     = '1.0.0'
const PLUGIN_AUTHOR      = 'ATech'
const PLUGIN_DESCRIPTION =
  'Full-stack performance bundle: SQLite auto-indexing, dual-layer query caching, ' +
  'smart HTML cache headers, Next.js image optimization, and streaming SSR via SuspenseSection.'

export interface PerformancePluginOptions {
  /** Collection slugs to add SQLite indexes to. Default: pages, posts, portfolio, media, categories */
  indexedCollections?: string[]
}

const INDEX_FIELDS = new Set(['slug', 'updatedAt', 'locale', '_status'])

export const performancePlugin =
  (options: PerformancePluginOptions = {}): Plugin =>
  (incomingConfig: Config): Config => {
    const {
      indexedCollections = ['pages', 'posts', 'portfolio', 'media', 'categories'],
    } = options

    // ── Build-time: inject SQLite indexes ──────────────────────────────────────
    // Runs at config-construction time — no runtime overhead.
    const collections = (incomingConfig.collections ?? []).map((col) => {
      if (!indexedCollections.includes(col.slug)) return col
      return {
        ...col,
        fields: col.fields.map((field: any) => {
          if ('name' in field && INDEX_FIELDS.has(field.name) && !field.index) {
            return { ...field, index: true }
          }
          return field
        }),
      }
    })

    return {
      ...incomingConfig,
      collections,
      globals: [...(incomingConfig.globals ?? []), PerformanceSettingsGlobal],

      onInit: async (payload) => {
        if (incomingConfig.onInit) await incomingConfig.onInit(payload)
        if (process.env.NEXT_PHASE === 'phase-production-build') return

        // ── Self-seed into Plugins collection ────────────────────────────────
        try {
          const existing = await payload.find({
            collection: 'plugins',
            where: { slug: { equals: PLUGIN_SLUG } },
            limit: 1,
          })

          if (existing.totalDocs === 0) {
            await payload.create({
              collection: 'plugins',
              data: {
                name:         PLUGIN_NAME,
                slug:         PLUGIN_SLUG,
                pluginType:   'built-in',
                category:     'utility',
                status:       'active',
                version:      PLUGIN_VERSION,
                author:       PLUGIN_AUTHOR,
                description:  PLUGIN_DESCRIPTION,
                autoActivate: true,
                features: [
                  { featureName: 'Image Optimization',        featureDescription: 'Removes unoptimized:true; enables sharp in production', featureType: 'hook' },
                  { featureName: 'Smart Cache Headers',       featureDescription: 'no-cache + s-maxage for nginx proxy, immutable for static chunks', featureType: 'hook' },
                  { featureName: 'Streaming SSR',             featureDescription: 'SuspenseSection wraps data-heavy blocks for chunked HTML delivery', featureType: 'hook' },
                  { featureName: 'Payload Query Caching',     featureDescription: 'unstable_cache + React cache() deduplication on all page queries', featureType: 'hook' },
                  { featureName: 'SQLite Auto-Indexing',      featureDescription: 'Injects index:true on slug/updatedAt/locale/_status at config time', featureType: 'collection' },
                  { featureName: 'OptimizedHero Component',   featureDescription: 'next/image wrapper with priority+preload for LCP images', featureType: 'field' },
                  { featureName: 'nginx Config Template',     featureDescription: 'Brotli/gzip/proxy-cache snippet at src/plugins/performance/nginx/', featureType: 'script' },
                ],
              },
            })
            payload.logger.info(`✅ ${PLUGIN_NAME} seeded into Plugins collection.`)
          }
        } catch (err) {
          payload.logger.warn(`⚠ ${PLUGIN_NAME} seed skipped: ${(err as Error).message}`)
        }
      },
    }
  }
```

- [ ] **Step 2.2: Verify TypeScript (will fail — withPerformance/createCachedFetch/components not created yet)**

```bash
npx tsc --noEmit 2>&1 | grep "performancePlugin\|performance/" | head -10
```

Expected: errors about missing modules `./performance/withPerformance`, `./performance/createCachedFetch`, `./performance/components`. These are resolved in Tasks 4, 6, 8–11.

- [ ] **Step 2.3: Commit**

```bash
git add src/plugins/performancePlugin.ts
git commit -m "feat(performance): add performancePlugin entry with SQLite indexing and self-seeding"
```

---

## Task 3: Register Plugin in `payload.config.ts`

**Files:**
- Modify: `src/payload.config.ts`

- [ ] **Step 3.1: Add import and register**

Open `src/payload.config.ts`. Find the existing plugin imports (near line 13–18):

```ts
import { layoutBuilderPlugin } from './plugins/layoutBuilderPlugin'
import { backupRestorePlugin } from './plugins/backupRestorePlugin'
```

Add after the last plugin import:

```ts
import { performancePlugin } from './plugins/performancePlugin'
```

Then find the `plugins: [` array in `buildConfig(...)`. It currently looks like:

```ts
plugins: [
  seoPlugin({ ... }),
  layoutBuilderPlugin({ ... }),
  backupRestorePlugin(),
  chatbotPlugin(),
  securityPlugin({ ... }),
  exportImportPlugin(),
  multilanguagePlugin(),
  siteTestingPlugin(),
],
```

Add `performancePlugin()` as the **last entry**:

```ts
plugins: [
  seoPlugin({ ... }),
  layoutBuilderPlugin({ ... }),
  backupRestorePlugin(),
  chatbotPlugin(),
  securityPlugin({ ... }),
  exportImportPlugin(),
  multilanguagePlugin(),
  siteTestingPlugin(),
  performancePlugin({
    indexedCollections: ['pages', 'posts', 'portfolio', 'media', 'categories'],
  }),
],
```

- [ ] **Step 3.2: Regenerate Payload types**

```bash
npm run generate:types 2>&1 | tail -5
```

Expected: `✓ types generated` (or similar success message). This makes `'performance-settings'` a valid slug in Payload type-safe calls.

- [ ] **Step 3.3: Commit**

```bash
git add src/payload.config.ts src/payload-types.ts
git commit -m "feat(performance): register performancePlugin in payload.config.ts"
```

---

## Task 4: `withPerformance.ts` (Next.js Config Wrapper)

**Files:**
- Create: `src/plugins/performance/withPerformance.ts`

- [ ] **Step 4.1: Create the file**

```ts
// src/plugins/performance/withPerformance.ts
import type { NextConfig } from 'next'

export interface WithPerformanceOptions {
  /** Master switch. When false, returns config unchanged. Default: true */
  enabled?: boolean
  /** Remove unoptimized: true in production. Default: true */
  imageOptimization?: boolean
  /** Replace no-store with no-cache + s-maxage for proxy caching. Default: true */
  fixCacheHeaders?: boolean
  /** s-maxage TTL in seconds. Default: 60 */
  htmlCacheTtl?: number
  /** stale-while-revalidate in seconds. Default: 600 */
  staleWhileRevalidate?: number
}

export function withPerformance(
  config: NextConfig,
  options: WithPerformanceOptions = {},
): NextConfig {
  const {
    enabled            = true,
    imageOptimization  = true,
    fixCacheHeaders    = true,
    htmlCacheTtl       = 60,
    staleWhileRevalidate = 600,
  } = options

  if (!enabled) return config

  let patched: NextConfig = { ...config }

  // ── Patch 1: Image optimization ────────────────────────────────────────────
  // Removes unoptimized: true so sharp is used in production for WebP/AVIF output.
  if (imageOptimization) {
    patched = {
      ...patched,
      images: {
        ...patched.images,
        unoptimized: false,
      },
    }
  }

  // ── Patch 2: Cache headers ─────────────────────────────────────────────────
  // Appends a headers rule that overrides Cache-Control for HTML pages.
  // Security headers (from security/headers.ts) are NOT touched — they live on
  // a separate source pattern and a different header key.
  // API routes are excluded so they keep no-store behavior.
  if (fixCacheHeaders) {
    const originalHeaders = config.headers
    patched = {
      ...patched,
      headers: async () => {
        const existing = originalHeaders ? await originalHeaders() : []
        return [
          ...existing,
          {
            // Matches all routes EXCEPT _next/static, _next/image, and /api/
            source: '/((?!_next/static|_next/image|api/).*)',
            headers: [
              {
                key: 'Cache-Control',
                value: `no-cache, s-maxage=${htmlCacheTtl}, stale-while-revalidate=${staleWhileRevalidate}`,
              },
            ],
          },
        ]
      },
    }
  }

  return patched
}
```

- [ ] **Step 4.2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "withPerformance" | head -5
```

Expected: no errors for `withPerformance.ts`.

- [ ] **Step 4.3: Commit**

```bash
git add src/plugins/performance/withPerformance.ts
git commit -m "feat(performance): add withPerformance Next.js config wrapper"
```

---

## Task 5: Apply `withPerformance` in `next.config.ts`

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 5.1: Add import**

Open `next.config.ts`. Find the existing import at the top:

```ts
import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import { defaultSecurityHeaders } from './src/plugins/security/headers'
```

Add after those imports:

```ts
import { withPerformance } from './src/plugins/performance/withPerformance'
```

- [ ] **Step 5.2: Wrap nextConfig**

Find the export at the bottom:

```ts
export default withPayload(nextConfig)
```

Replace with:

```ts
export default withPayload(
  withPerformance(nextConfig, {
    enabled: process.env.PERFORMANCE_PLUGIN !== 'false',
    imageOptimization: true,
    fixCacheHeaders: true,
    htmlCacheTtl: 60,
    staleWhileRevalidate: 600,
  })
)
```

- [ ] **Step 5.3: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "next.config\|withPerformance" | head -5
```

Expected: no errors.

- [ ] **Step 5.4: Commit**

```bash
git add next.config.ts
git commit -m "feat(performance): apply withPerformance wrapper in next.config.ts"
```

---

## Task 6: `createCachedFetch.ts` (Dual-Layer Cache Utility)

**Files:**
- Create: `src/plugins/performance/createCachedFetch.ts`

- [ ] **Step 6.1: Create the utility**

```ts
// src/plugins/performance/createCachedFetch.ts
import { cache } from 'react'
import { unstable_cache } from 'next/cache'

/**
 * Wraps an async function with two caching layers:
 *   1. unstable_cache — persists across requests on the server (cross-request cache)
 *   2. React cache()  — deduplicates within a single render tree (per-request dedup)
 *
 * Usage:
 *   export const getFrontpage = withPerfCache(
 *     async (locale: string) => { ... return data },
 *     ['perf:frontpage'],
 *     { revalidate: 60, tags: ['perf:frontpage', 'perf:pages'] }
 *   )
 */
export function withPerfCache<TArgs extends readonly unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  keyPrefix: string[],
  options: { revalidate?: number; tags?: string[] } = {},
): (...args: TArgs) => Promise<TReturn> {
  const revalidate = options.revalidate ?? 60
  const tags       = options.tags ?? keyPrefix

  // unstable_cache uses keyPrefix + serialised args as the full cache key
  const crossRequestCached = unstable_cache(fn, keyPrefix, { revalidate, tags })

  // React cache() deduplicates within one render tree on top of unstable_cache
  return cache(crossRequestCached as (...args: TArgs) => Promise<TReturn>)
}

// Re-export for convenience so callers only import from performancePlugin
export { createCachedFetch } from './createCachedFetch'
```

Wait — the last line would cause a circular self-import. Remove it and just export `withPerfCache`. The `performancePlugin.ts` re-export handles the public API.

Replace the file content with:

```ts
// src/plugins/performance/createCachedFetch.ts
import { cache } from 'react'
import { unstable_cache } from 'next/cache'

/**
 * Wraps an async function with two caching layers:
 *   1. unstable_cache — persists across requests on the server
 *   2. React cache()  — deduplicates within a single render tree
 *
 * Usage:
 *   export const getFrontpage = withPerfCache(
 *     async (locale: string) => payload.find(...),
 *     ['perf:frontpage'],
 *     { revalidate: 60, tags: ['perf:frontpage', 'perf:pages'] }
 *   )
 */
export function withPerfCache<TArgs extends readonly unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  keyPrefix: string[],
  options: { revalidate?: number; tags?: string[] } = {},
): (...args: TArgs) => Promise<TReturn> {
  const revalidate = options.revalidate ?? 60
  const tags       = options.tags ?? keyPrefix

  const crossRequestCached = unstable_cache(fn, keyPrefix, { revalidate, tags })
  return cache(crossRequestCached as (...args: TArgs) => Promise<TReturn>)
}

// Alias for backwards-compat with spec reference
export const createCachedFetch = withPerfCache
```

- [ ] **Step 6.2: Fix the re-export in `performancePlugin.ts`**

Open `src/plugins/performancePlugin.ts`. The export line currently reads:

```ts
export { createCachedFetch, withPerfCache } from './performance/createCachedFetch'
```

This is already correct. Verify it matches.

- [ ] **Step 6.3: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "createCachedFetch\|withPerfCache" | head -5
```

Expected: no errors.

- [ ] **Step 6.4: Commit**

```bash
git add src/plugins/performance/createCachedFetch.ts
git commit -m "feat(performance): add withPerfCache dual-layer caching utility"
```

---

## Task 7: Update `src/lib/payload.ts` — Add Settings Fetch + Wrap Page Queries

**Files:**
- Modify: `src/lib/payload.ts`

- [ ] **Step 7.1: Add `withPerfCache` import**

Open `src/lib/payload.ts`. After the existing imports at the top:

```ts
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { cookies } from 'next/headers'
import config from '@payload-config'
```

Add:

```ts
import { withPerfCache } from '@/plugins/performance/createCachedFetch'
```

- [ ] **Step 7.2: Add `getPerformanceSettings` function**

After the existing `getLanguageSettings` export (around line 90), add:

```ts
/** Fetch performance plugin settings (cached; bust with revalidateTag('perf-settings')) */
export const getPerformanceSettings = unstable_cache(
  async () => {
    try {
      const payload = await getPayloadClient()
      return payload.findGlobal({ slug: 'performance-settings' as any }).catch(() => null)
    } catch {
      return null
    }
  },
  ['perf-settings'],
  { tags: ['perf-settings'], revalidate: 60 },
)
```

- [ ] **Step 7.3: Convert `getFrontpage` to `withPerfCache`**

Find and replace the existing `getFrontpage` function:

```ts
// BEFORE
export async function getFrontpage(locale: string = 'en') {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      where: { isFrontpage: { equals: true }, status: { equals: 'published' } },
      locale: locale as any,
      limit: 1,
    })
    return result.docs[0] ?? null
  } catch {
    return null
  }
}
```

```ts
// AFTER
export const getFrontpage = withPerfCache(
  async (locale: string = 'en') => {
    try {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'pages',
        where: { isFrontpage: { equals: true }, status: { equals: 'published' } },
        locale: locale as any,
        limit: 1,
      })
      return result.docs[0] ?? null
    } catch {
      return null
    }
  },
  ['perf:frontpage'],
  { revalidate: 60, tags: ['perf:frontpage', 'perf:pages'] },
)
```

- [ ] **Step 7.4: Convert `getPage` to `withPerfCache`**

Find and replace `getPage`:

```ts
// BEFORE
export async function getPage(slug: string, locale: string = 'en') {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      locale: locale as any,
      limit: 1,
    })
    return result.docs[0] ?? null
  } catch {
    return null
  }
}
```

```ts
// AFTER
export const getPage = withPerfCache(
  async (slug: string, locale: string = 'en') => {
    try {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'pages',
        where: { slug: { equals: slug } },
        locale: locale as any,
        limit: 1,
      })
      return result.docs[0] ?? null
    } catch {
      return null
    }
  },
  ['perf:page'],
  { revalidate: 60, tags: ['perf:page', 'perf:pages'] },
)
```

- [ ] **Step 7.5: Convert `getNavigation` to `withPerfCache`**

Find and replace `getNavigation`:

```ts
// BEFORE
export async function getNavigation(locale: string = 'en') {
  try {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'navigation', locale: locale as any })
  } catch {
    return null
  }
}
```

```ts
// AFTER
export const getNavigation = withPerfCache(
  async (locale: string = 'en') => {
    try {
      const payload = await getPayloadClient()
      return payload.findGlobal({ slug: 'navigation', locale: locale as any })
    } catch {
      return null
    }
  },
  ['perf:navigation'],
  { revalidate: 60, tags: ['perf:navigation'] },
)
```

- [ ] **Step 7.6: Convert `getBlockTemplates` to `withPerfCache`**

Find the `getBlockTemplates` function (around line 243). Replace:

```ts
// BEFORE
export async function getBlockTemplates(ids: string[], locale: string = 'en'): Promise<Record<string, any>> {
  try {
    const payload = await getPayloadClient()
    // ... existing implementation
  } catch {
    return {}
  }
}
```

```ts
// AFTER — wrap with withPerfCache, preserving existing implementation body
export const getBlockTemplates = withPerfCache(
  async (ids: string[], locale: string = 'en'): Promise<Record<string, any>> => {
    try {
      const payload = await getPayloadClient()
      // ... existing implementation (keep unchanged)
    } catch {
      return {}
    }
  },
  ['perf:block-templates'],
  { revalidate: 60, tags: ['perf:block-templates', 'perf:pages'] },
)
```

> **Note:** Preserve the entire existing body of `getBlockTemplates` — only wrap it with `withPerfCache`. Do not rewrite the inner logic.

- [ ] **Step 7.7: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "payload.ts\|withPerfCache\|getFrontpage\|getPage\|getNav\|getBlock" | head -20
```

Expected: no errors.

- [ ] **Step 7.8: Commit**

```bash
git add src/lib/payload.ts
git commit -m "feat(performance): apply withPerfCache to page queries in payload.ts"
```

---

## Task 8: `SectionSkeleton.tsx`

**Files:**
- Create: `src/plugins/performance/components/SectionSkeleton.tsx`

- [ ] **Step 8.1: Create the component**

```tsx
// src/plugins/performance/components/SectionSkeleton.tsx

interface SectionSkeletonProps {
  rows?: number
  className?: string
}

export function SectionSkeleton({ rows = 3, className }: SectionSkeletonProps) {
  return (
    <div className={`w-full animate-pulse py-8 px-4 ${className ?? ''}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="mb-4 h-6 rounded-md bg-gray-200 dark:bg-gray-700"
          style={{ width: `${85 - i * 10}%` }}
        />
      ))}
    </div>
  )
}
```

- [ ] **Step 8.2: Commit**

```bash
git add src/plugins/performance/components/SectionSkeleton.tsx
git commit -m "feat(performance): add SectionSkeleton animated pulse fallback"
```

---

## Task 9: `SuspenseSection.tsx`

**Files:**
- Create: `src/plugins/performance/components/SuspenseSection.tsx`

- [ ] **Step 9.1: Create the async RSC component**

```tsx
// src/plugins/performance/components/SuspenseSection.tsx
import { Suspense } from 'react'
import { SectionSkeleton } from './SectionSkeleton'
import { getPerformanceSettings } from '@/lib/payload'

interface SuspenseSectionProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

/**
 * Async Server Component that wraps children in a <Suspense> boundary
 * for streaming SSR. Reads streamingEnabled from PerformanceSettingsGlobal
 * at runtime — when disabled, renders children directly with zero overhead.
 */
export async function SuspenseSection({
  children,
  fallback,
  className,
}: SuspenseSectionProps) {
  const settings = await getPerformanceSettings()
  const enabled =
    settings?.pluginEnabled !== false && (settings as any)?.streamingEnabled !== false

  if (!enabled) return <>{children}</>

  const skeletonRows = (settings as any)?.skeletonRows ?? 3

  return (
    <div className={className}>
      <Suspense fallback={fallback ?? <SectionSkeleton rows={skeletonRows} />}>
        {children}
      </Suspense>
    </div>
  )
}
```

- [ ] **Step 9.2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "SuspenseSection\|SectionSkeleton" | head -5
```

Expected: no errors.

- [ ] **Step 9.3: Commit**

```bash
git add src/plugins/performance/components/SuspenseSection.tsx
git commit -m "feat(performance): add SuspenseSection async RSC streaming boundary"
```

---

## Task 10: `OptimizedHero.tsx`

**Files:**
- Create: `src/plugins/performance/components/OptimizedHero.tsx`

- [ ] **Step 10.1: Create the component**

```tsx
// src/plugins/performance/components/OptimizedHero.tsx
import Image, { type ImageProps } from 'next/image'

/**
 * Drop-in replacement for <Image> on above-the-fold hero images.
 * Always sets priority (emits <link rel="preload">) and sizes="100vw"
 * for full-width hero images to improve LCP score.
 */
export function OptimizedHero(props: ImageProps) {
  return (
    <Image
      sizes={props.sizes ?? '100vw'}
      {...props}
      priority
    />
  )
}
```

- [ ] **Step 10.2: Commit**

```bash
git add src/plugins/performance/components/OptimizedHero.tsx
git commit -m "feat(performance): add OptimizedHero next/image wrapper with LCP priority"
```

---

## Task 11: `components/index.ts` Barrel Export

**Files:**
- Create: `src/plugins/performance/components/index.ts`

- [ ] **Step 11.1: Create the barrel**

```ts
// src/plugins/performance/components/index.ts
export { SuspenseSection } from './SuspenseSection'
export { OptimizedHero }   from './OptimizedHero'
export { SectionSkeleton } from './SectionSkeleton'
```

- [ ] **Step 11.2: Verify full TypeScript compile — all plugin files now exist**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: zero errors. All previously-missing modules are now created.

- [ ] **Step 11.3: Commit**

```bash
git add src/plugins/performance/components/index.ts
git commit -m "feat(performance): add components barrel export"
```

---

## Task 12: Wrap `*ServerSection` Blocks in `layout-renderer.tsx`

**Files:**
- Modify: `src/lib/layout-renderer.tsx`

- [ ] **Step 12.1: Add `SuspenseSection` import**

Open `src/lib/layout-renderer.tsx`. Find the existing imports block at the top. After the last `import` statement, add:

```tsx
import { SuspenseSection } from '@/plugins/performance/components'
```

- [ ] **Step 12.2: Wrap `TestimonialsSectionServerSection` (2 occurrences)**

Find (first occurrence, around line 862):
```tsx
case 'testimonials':
  return wrapAdvanced(
    (data as any).testimonialsContentSource === 'collection'
      ? <TestimonialsSectionServerSection data={data} />
      : <TestimonialsSection data={data} />
  )
```

Replace with:
```tsx
case 'testimonials':
  return wrapAdvanced(
    (data as any).testimonialsContentSource === 'collection'
      ? <SuspenseSection><TestimonialsSectionServerSection data={data} /></SuspenseSection>
      : <TestimonialsSection data={data} />
  )
```

Find second occurrence (around line 903, `case 'home-testimonials'`):
```tsx
case 'home-testimonials':
  return wrapAdvanced(
    (data as any).testimonialsContentSource === 'collection'
      ? <TestimonialsSectionServerSection data={data} />
      : <TestimonialsSection data={data} />
  )
```

Replace with:
```tsx
case 'home-testimonials':
  return wrapAdvanced(
    (data as any).testimonialsContentSource === 'collection'
      ? <SuspenseSection><TestimonialsSectionServerSection data={data} /></SuspenseSection>
      : <TestimonialsSection data={data} />
  )
```

- [ ] **Step 12.3: Wrap `FAQSectionServerSection`**

Find:
```tsx
case 'faq-section':
  return wrapAdvanced(
    (data as any).faqContentSource === 'collection'
      ? <FAQSectionServerSection data={data} />
      : <FAQSection data={data} />
  )
```

Replace with:
```tsx
case 'faq-section':
  return wrapAdvanced(
    (data as any).faqContentSource === 'collection'
      ? <SuspenseSection><FAQSectionServerSection data={data} /></SuspenseSection>
      : <FAQSection data={data} />
  )
```

- [ ] **Step 12.4: Wrap `FAQMainServerSection`**

Find:
```tsx
case 'faq-main':
  return wrapAdvanced(<FAQMainServerSection data={data} />)
```

Replace with:
```tsx
case 'faq-main':
  return wrapAdvanced(<SuspenseSection><FAQMainServerSection data={data} /></SuspenseSection>)
```

- [ ] **Step 12.5: Wrap `FAQAboutServerSection`**

Find:
```tsx
case 'faq-about':
  return wrapAdvanced(
    (data as any).faqContentSource === 'collection'
      ? <FAQAboutServerSection data={data as any} />
      : <FAQAboutSection data={data as any} />
  )
```

Replace with:
```tsx
case 'faq-about':
  return wrapAdvanced(
    (data as any).faqContentSource === 'collection'
      ? <SuspenseSection><FAQAboutServerSection data={data as any} /></SuspenseSection>
      : <FAQAboutSection data={data as any} />
  )
```

- [ ] **Step 12.6: Wrap `ProjectGridServerSection`**

Find:
```tsx
case 'project-grid':
  return wrapAdvanced(<ProjectGridServerSection data={data} />)
```

Replace with:
```tsx
case 'project-grid':
  return wrapAdvanced(<SuspenseSection><ProjectGridServerSection data={data} /></SuspenseSection>)
```

- [ ] **Step 12.7: Wrap `ArticleGridServerSection`**

Find:
```tsx
case 'article-grid':
  return wrapAdvanced(<ArticleGridServerSection data={data} />)
```

Replace with:
```tsx
case 'article-grid':
  return wrapAdvanced(<SuspenseSection><ArticleGridServerSection data={data} /></SuspenseSection>)
```

- [ ] **Step 12.8: Wrap `ArticleFeaturedServerSection`**

Find:
```tsx
case 'article-featured':
  return wrapAdvanced(<ArticleFeaturedServerSection data={data} />)
```

Replace with:
```tsx
case 'article-featured':
  return wrapAdvanced(<SuspenseSection><ArticleFeaturedServerSection data={data} /></SuspenseSection>)
```

- [ ] **Step 12.9: Wrap `JobsListServerSection`**

Find:
```tsx
case 'jobs-list':
  return wrapAdvanced(
    (data as any).jobSource === 'collection'
      ? <JobsListServerSection data={data} />
      : <JobsListSection data={data} />
  )
```

Replace with:
```tsx
case 'jobs-list':
  return wrapAdvanced(
    (data as any).jobSource === 'collection'
      ? <SuspenseSection><JobsListServerSection data={data} /></SuspenseSection>
      : <JobsListSection data={data} />
  )
```

- [ ] **Step 12.10: Wrap `PortfolioMainServerSection`**

Find:
```tsx
return wrapAdvanced(<PortfolioMainServerSection data={data} />)
```

Replace with:
```tsx
return wrapAdvanced(<SuspenseSection><PortfolioMainServerSection data={data} /></SuspenseSection>)
```

- [ ] **Step 12.11: Wrap `ArticleMainGridServerSection`**

Find:
```tsx
? <ArticleMainGridServerSection data={data as any} />
```

Replace with:
```tsx
? <SuspenseSection><ArticleMainGridServerSection data={data as any} /></SuspenseSection>
```

- [ ] **Step 12.12: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: zero errors.

- [ ] **Step 12.13: Commit**

```bash
git add src/lib/layout-renderer.tsx
git commit -m "feat(performance): wrap ServerSection blocks with SuspenseSection for streaming SSR"
```

---

## Task 13: nginx Documentation

**Files:**
- Create: `src/plugins/performance/nginx/performance.conf`
- Create: `src/plugins/performance/nginx/README.md`

- [ ] **Step 13.1: Create `performance.conf`**

```nginx
# src/plugins/performance/nginx/performance.conf
# ─────────────────────────────────────────────────────────────────────────────
# ATech Performance nginx include snippet
# Apply: include /path/to/performance.conf; inside your http {} block
# See README.md for step-by-step instructions.
# ─────────────────────────────────────────────────────────────────────────────

# ── Brotli compression ────────────────────────────────────────────────────────
# Requires ngx_brotli module. Check with: nginx -V 2>&1 | grep brotli
# If not available, the gzip block below provides a fallback.
brotli            on;
brotli_comp_level 6;
brotli_types
  text/plain text/css text/javascript application/javascript
  application/json application/xml image/svg+xml font/woff2;

# ── gzip fallback ─────────────────────────────────────────────────────────────
gzip              on;
gzip_comp_level   5;
gzip_vary         on;
gzip_proxied      any;
gzip_types
  text/plain text/css text/javascript application/javascript
  application/json application/xml image/svg+xml font/woff2;

# ── Proxy cache zone ──────────────────────────────────────────────────────────
# Caches HTML pages that have s-maxage in their Cache-Control header.
# withPerformance sets s-maxage=60 on all HTML routes.
proxy_cache_path
  /var/cache/nginx/perf_cache
  levels=1:2
  keys_zone=perf_cache:10m
  max_size=256m
  inactive=10m
  use_temp_path=off;

# ── Upstream keep-alive ───────────────────────────────────────────────────────
upstream atech_node {
  server 127.0.0.1:3000;
  keepalive 16;
}

# ── Proxy cache bypass rules ──────────────────────────────────────────────────
# Bypass cache when the request carries auth or an explicit bypass header.
# Add these inside your server {} block after including this file:
#
#   proxy_cache            perf_cache;
#   proxy_cache_valid      200 60s;
#   proxy_cache_use_stale  error timeout updating http_500 http_502 http_503;
#   proxy_cache_bypass     $cookie_payload_token $http_authorization $http_x_bypass_cache;
#   proxy_no_cache         $cookie_payload_token $http_authorization;
#   add_header             X-Cache-Status $upstream_cache_status;

# ── HTTP/2 ────────────────────────────────────────────────────────────────────
# HTTP/2 must be enabled on the listen directive, not in an include:
#   listen 443 ssl http2;
# This cannot be set via include — add it manually to your server block.
```

- [ ] **Step 13.2: Create `README.md`**

```markdown
# nginx Performance Config — Apply Instructions

This snippet adds brotli/gzip compression and proxy caching to your nginx setup.

## Prerequisites

- nginx 1.18+
- ngx_brotli module (check: `nginx -V 2>&1 | grep brotli`)
  - If missing, the brotli block can be commented out — gzip fallback still applies

## Step 1 — Copy the file to the server

```bash
scp src/plugins/performance/nginx/performance.conf \
  deploy@143.198.80.149:/home/deploy/nginx-perf.conf
```

## Step 2 — Include in nginx http block

Edit `/etc/nginx/nginx.conf` (or your site config) and add inside the `http {}` block:

```nginx
http {
  include /home/deploy/nginx-perf.conf;
  ...
}
```

## Step 3 — Add proxy cache directives to your server block

Inside your `server {}` block for uat.atech.software:

```nginx
location / {
  proxy_pass             http://atech_node;
  proxy_cache            perf_cache;
  proxy_cache_valid      200 60s;
  proxy_cache_use_stale  error timeout updating http_500 http_502 http_503;
  proxy_cache_bypass     $cookie_payload_token $http_authorization $http_x_bypass_cache;
  proxy_no_cache         $cookie_payload_token $http_authorization;
  add_header             X-Cache-Status $upstream_cache_status always;
  proxy_set_header       Host $host;
  proxy_set_header       X-Real-IP $remote_addr;
}
```

## Step 4 — Test and reload

```bash
sudo nginx -t          # must say: configuration file ... test is successful
sudo systemctl reload nginx
```

## Step 5 — Verify

```bash
# First request — cache MISS
curl -sI https://uat.atech.software/ | grep -i "x-cache-status"
# → X-Cache-Status: MISS

# Second request — cache HIT
curl -sI https://uat.atech.software/ | grep -i "x-cache-status"
# → X-Cache-Status: HIT
```
```

- [ ] **Step 13.3: Commit**

```bash
git add src/plugins/performance/nginx/
git commit -m "docs(performance): add nginx performance.conf and apply README"
```

---

## Task 14: Playwright e2e Tests

**Files:**
- Create: `tests/e2e/performance.spec.ts`

- [ ] **Step 14.1: Create the test file**

```ts
// tests/e2e/performance.spec.ts
import { test, expect } from '@playwright/test'

// ── Cache header tests ────────────────────────────────────────────────────────

test.describe('Performance Plugin — Cache Headers', () => {
  test('HTML pages have s-maxage cache header', async ({ request }) => {
    const res = await request.get('/en')
    const cacheControl = res.headers()['cache-control'] ?? ''
    // Should have no-cache (browser) + s-maxage (proxy)
    expect(cacheControl).toContain('no-cache')
    expect(cacheControl).toContain('s-maxage')
    expect(cacheControl).not.toContain('no-store')
  })

  test('Static chunks keep immutable cache header', async ({ request }) => {
    // Load homepage to discover a real static chunk URL
    const page = await (await request.newContext()).newPage()
    await page.goto('/en', { waitUntil: 'domcontentloaded' })

    const staticChunks: string[] = []
    page.on('response', (res) => {
      if (res.url().includes('/_next/static/')) staticChunks.push(res.url())
    })
    await page.goto('/en', { waitUntil: 'networkidle' })
    await page.close()

    if (staticChunks.length === 0) {
      test.skip()
      return
    }

    const chunkRes = await request.get(staticChunks[0])
    const cc = chunkRes.headers()['cache-control'] ?? ''
    expect(cc).toContain('immutable')
    expect(cc).toContain('max-age=31536000')
  })

  test('API routes keep no-store cache header', async ({ request }) => {
    const res = await request.get('/api/users/me')
    const cacheControl = res.headers()['cache-control'] ?? ''
    // API routes must not be proxy-cached
    expect(cacheControl).not.toContain('s-maxage')
  })
})

// ── Image optimization tests ──────────────────────────────────────────────────

test.describe('Performance Plugin — Image Optimization', () => {
  test('Homepage loads without image errors', async ({ page }) => {
    const imageErrors: string[] = []
    page.on('response', (res) => {
      if (
        res.request().resourceType() === 'image' &&
        res.status() >= 400
      ) {
        imageErrors.push(`${res.status()} ${res.url()}`)
      }
    })
    await page.goto('/en', { waitUntil: 'networkidle' })
    expect(imageErrors, `Image load errors: ${imageErrors.join(', ')}`).toHaveLength(0)
  })

  test('Media images return 200 from UAT', async ({ request }) => {
    // Spot-check a few committed media files
    const images = ['app_badge.png', 'comm1.png', 'portfolio1.png']
    for (const img of images) {
      const res = await request.get(`/media/${img}`)
      expect(res.status(), `Expected 200 for /media/${img}`).toBe(200)
    }
  })
})

// ── Streaming SSR tests ───────────────────────────────────────────────────────

test.describe('Performance Plugin — Streaming SSR', () => {
  test('Pages with ServerSection blocks render content', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))

    // FAQ page uses FAQSectionServerSection
    await page.goto('/en/faq', { waitUntil: 'domcontentloaded' })
    const criticalErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('ResizeObserver'),
    )
    expect(criticalErrors, `JS errors on /en/faq`).toHaveLength(0)
    await expect(page.locator('body')).not.toBeEmpty()
  })

  test('Insight/Article page renders without errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))

    // Insights page uses ArticleGridServerSection / ArticleFeaturedServerSection
    await page.goto('/en/insight', { waitUntil: 'domcontentloaded' })
    const criticalErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('ResizeObserver'),
    )
    expect(criticalErrors, `JS errors on /en/insight`).toHaveLength(0)
    await expect(page.locator('body')).not.toBeEmpty()
  })

  test('Portfolio page renders without errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))

    await page.goto('/en/portfolio', { waitUntil: 'domcontentloaded' })
    const criticalErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('ResizeObserver'),
    )
    expect(criticalErrors, `JS errors on /en/portfolio`).toHaveLength(0)
    await expect(page.locator('body')).not.toBeEmpty()
  })
})

// ── Admin panel tests ─────────────────────────────────────────────────────────

test.describe('Performance Plugin — Admin Panel', () => {
  test('Performance settings page exists under Plugins group', async ({ page }) => {
    const res = await page.goto('/admin/globals/performance-settings', {
      waitUntil: 'domcontentloaded',
    })
    // Should redirect to login (401) or load the page (200) — not a 404
    expect(res?.status(), 'Performance settings global should exist').not.toBe(404)
  })

  test('Performance plugin appears in Plugins collection', async ({ page }) => {
    const res = await page.goto('/admin/collections/plugins', {
      waitUntil: 'domcontentloaded',
    })
    expect(res?.status()).toBeLessThan(400)
  })
})
```

- [ ] **Step 14.2: Run e2e tests against local dev server**

Make sure the dev server is running (`npm run dev` in another terminal), then:

```bash
npm run test:e2e -- --grep "Performance Plugin" 2>&1 | tail -30
```

Expected: tests pass. If cache header tests fail, it may be because the dev server doesn't apply `withPerformance` headers — those tests will pass on UAT (production build). Mark them in context.

- [ ] **Step 14.3: Commit**

```bash
git add tests/e2e/performance.spec.ts
git commit -m "test(performance): add Playwright e2e tests for cache headers, images, streaming, and admin"
```

---

## Task 15: TypeScript Check + Full Build Verification

**Files:** None created — verification only.

- [ ] **Step 15.1: Full TypeScript check**

```bash
npx tsc --noEmit 2>&1
```

Expected: zero errors. If errors appear, fix them before proceeding.

- [ ] **Step 15.2: Full production build**

```bash
npm run build 2>&1 | tail -20
```

Expected:
```
✓ Compiled successfully
Route (app) ...
...
○ (Static)  prerendered as static content
```

No errors. If the build fails, check the error output — common issues:
- `Cannot find module` → missing import or typo in path
- `Type error` → TypeScript mismatch in the wrapped functions

- [ ] **Step 15.3: Generate importmap after build**

```bash
npm run generate:importmap 2>&1 | tail -5
```

Expected: success message.

- [ ] **Step 15.4: Run full e2e smoke test**

```bash
npm run test:e2e -- --grep "Performance Plugin|Smoke" 2>&1 | tail -30
```

Expected: all tests pass.

- [ ] **Step 15.5: Final commit**

```bash
git add -A
git status  # Review — should only be any generated files
git commit -m "chore(performance): verify build and e2e tests pass for performance plugin bundle"
```

- [ ] **Step 15.6: Push to dev**

```bash
git push origin dev
```

Expected: GitHub Actions build + deploy to UAT succeeds. Monitor at:
`https://github.com/ATech-Solution/atech-website/actions`

---

## Summary

| Task | What it builds | Key output |
|---|---|---|
| 1 | `PerformanceSettingsGlobal` | All admin toggles under Plugins → Performance |
| 2 | `performancePlugin.ts` | Payload entry: seeding, SQLite indexes, Global registration |
| 3 | `payload.config.ts` | Plugin registered, types regenerated |
| 4 | `withPerformance.ts` | Next.js config wrapper: image opt + cache headers |
| 5 | `next.config.ts` | Build-time patches applied |
| 6 | `createCachedFetch.ts` | `withPerfCache` dual-layer cache utility |
| 7 | `payload.ts` | Page queries wrapped with `withPerfCache` |
| 8 | `SectionSkeleton.tsx` | Tailwind pulse fallback |
| 9 | `SuspenseSection.tsx` | Async RSC Suspense boundary |
| 10 | `OptimizedHero.tsx` | `next/image` LCP wrapper |
| 11 | `components/index.ts` | Barrel export |
| 12 | `layout-renderer.tsx` | 11 ServerSection blocks wrapped for streaming |
| 13 | nginx docs | `performance.conf` + `README.md` |
| 14 | `performance.spec.ts` | Playwright tests for all 4 feature areas |
| 15 | Verification | TypeScript clean, build passes, e2e green |

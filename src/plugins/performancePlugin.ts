// src/plugins/performancePlugin.ts
import type { Config, Plugin, Field } from 'payload'
import { PerformanceSettingsGlobal } from './performance/PerformanceSettingsGlobal'

export { withPerformance } from './performance/withPerformance'
export { createCachedFetch, withPerfCache } from './performance/createCachedFetch'
export {
  SuspenseSection,
  OptimizedHero,
  SectionSkeleton,
} from './performance/components'

const PLUGIN_NAME = 'Performance Plugin'
const PLUGIN_SLUG = 'performance'
const PLUGIN_VERSION = '1.0.0'
const PLUGIN_AUTHOR = 'ATech'
const PLUGIN_DESCRIPTION =
  'Full-stack performance bundle: SQLite auto-indexing, dual-layer query caching, ' +
  'smart HTML cache headers, Next.js image optimization, and streaming SSR via SuspenseSection.'

export interface PerformancePluginOptions {
  /** Collection slugs to add SQLite indexes to. Default: pages, posts, portfolio, media, categories */
  indexedCollections?: string[]
}

// Only 'slug' is a user-defined field that benefits from explicit indexing.
// updatedAt / locale / _status are adapter-managed — not present in col.fields.
const INDEX_FIELDS = new Set(['slug'])

function injectIndexesRecursive(fields: Field[]): Field[] {
  return fields.map((field): Field => {
    if (field.type === 'tabs') {
      return {
        ...field,
        tabs: field.tabs.map((tab) => ({
          ...tab,
          fields: injectIndexesRecursive((tab.fields ?? []) as Field[]),
        })),
      } as Field
    }
    if (
      (field.type === 'group' || field.type === 'collapsible' || field.type === 'array') &&
      Array.isArray((field as any).fields)
    ) {
      return { ...field, fields: injectIndexesRecursive((field as any).fields as Field[]) } as Field
    }
    if (field.type === 'row' && Array.isArray((field as any).fields)) {
      return { ...field, fields: injectIndexesRecursive((field as any).fields as Field[]) } as Field
    }
    if ('name' in field && INDEX_FIELDS.has((field as any).name) && !(field as any).index) {
      return { ...field, index: true } as Field
    }
    return field
  })
}

export const performancePlugin =
  (options: PerformancePluginOptions = {}): Plugin =>
  (incomingConfig: Config): Config => {
    const {
      indexedCollections = ['pages', 'posts', 'portfolio', 'media', 'categories'],
    } = options

    // NOTE: The PerformanceSettingsGlobal's sqliteIndexesEnabled and indexedCollections
    // fields are informational — they show the active index config in the admin UI.
    // Actual indexing is driven by the plugin's code-level options (resolved at server start)
    // because Payload reads the full config before the DB is available.

    // ── Build-time: inject SQLite indexes ──────────────────────────────────────
    // Runs at config-construction time — no runtime overhead.
    const collections = (incomingConfig.collections ?? []).map((col) => {
      if (!indexedCollections.includes(col.slug)) return col
      return {
        ...col,
        fields: injectIndexesRecursive(col.fields as Field[]),
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
                  { featureName: 'SQLite Auto-Indexing',      featureDescription: 'Injects index:true on the slug field of configured collections at config time', featureType: 'collection' },
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

import type { Config, Plugin } from 'payload'
import { searchPlugin as payloadSearchPlugin } from '@payloadcms/plugin-search'

// ─── Types ────────────────────────────────────────────────────────────────────

type SearchOverrides = Parameters<typeof payloadSearchPlugin>[0]['searchOverrides']

// ─── Options ─────────────────────────────────────────────────────────────────

export interface SearchPluginOptions {
  /** Unique slug used to identify this plugin in the Plugins collection. Default: 'search' */
  slug?: string
  /** Display name shown in the Plugins collection. Default: 'Search' */
  name?: string
  /** Semantic version string. Default: '1.0.0' */
  version?: string
  /** Author / organization name. Default: 'ATech' */
  author?: string
  /** Human-readable description shown in the admin. */
  description?: string
  /** Collections to index in search. Default: ['posts', 'pages'] */
  collections?: string[]
  /** Default search priority per collection slug. */
  defaultPriorities?: Record<string, number>
  /** Override or extend the search collection's field definitions. */
  searchOverrides?: SearchOverrides
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

/**
 * Search Plugin for Payload CMS
 *
 * Wraps @payloadcms/plugin-search and registers itself into the
 * `plugins` collection on first server start.
 *
 * Usage:
 *   import { searchPlugin } from '@/plugins/searchPlugin'
 *
 *   export default buildConfig({
 *     plugins: [
 *       searchPlugin({
 *         collections: ['posts', 'pages'],
 *         defaultPriorities: { posts: 10, pages: 20 },
 *       }),
 *     ],
 *   })
 *
 * Requires: npm install @payloadcms/plugin-search
 *
 * Query search results:
 *   GET /api/search?q=<term>   or   /api/search-results?q=<term>
 */
export const searchPlugin = (options: SearchPluginOptions = {}): Plugin =>
  (incomingConfig: Config): Config => {
    const {
      slug               = 'search',
      name               = 'Search',
      version            = '1.0.0',
      author             = 'ATech',
      description        = 'Full-text search index across selected collections. Creates a "search-results" collection and exposes a query endpoint. Automatically re-indexes documents on save.',
      collections        = ['posts', 'pages'],
      defaultPriorities  = { posts: 10, pages: 20 },
      searchOverrides    = {
        fields: ({ defaultFields }: { defaultFields: any[] }) => [
          ...defaultFields,
          {
            name: 'excerpt',
            type: 'textarea',
            label: 'Excerpt',
          },
        ],
        admin: {
          // Always hidden from default nav — SearchNavLink in afterNavLinks handles
          // visibility based on plugin activation status.
          hidden: () => true,
        },
      },
    } = options

    // Apply the underlying Payload search plugin first.
    const configWithSearch = payloadSearchPlugin({
      collections,
      defaultPriorities,
      searchOverrides,
    })(incomingConfig)

    return {
      ...configWithSearch,

      onInit: async (payload) => {
        // Chain the previous onInit (from other plugins or the base config).
        if (configWithSearch.onInit) {
          await configWithSearch.onInit(payload)
        }

        if (process.env.NEXT_PHASE === 'phase-production-build') return

        try {
          const existing = await payload.find({
            collection: 'plugins',
            where: { slug: { equals: slug } },
            limit: 1,
          })

          if (existing.totalDocs === 0) {
            await payload.create({
              collection: 'plugins',
              data: {
                name,
                slug,
                pluginType: 'built-in',
                category: 'utility',
                status: 'active',
                version,
                author,
                description,
                autoActivate: true,
                features: [
                  {
                    featureName: 'Search Results Collection',
                    featureDescription: 'Indexed search documents across configured collections, queryable by keyword',
                    featureType: 'collection',
                  },
                  {
                    featureName: 'Auto-indexing Hook',
                    featureDescription: 'Re-indexes documents automatically on create/update/delete',
                    featureType: 'hook',
                  },
                ],
              },
            })

            payload.logger.info(`✅ ${name} seeded into Plugins collection.`)
          }
        } catch (err) {
          payload.logger.warn(`⚠ ${name} seed skipped: ${(err as Error).message}`)
        }
      },
    }
  }

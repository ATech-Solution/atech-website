import type { Config, Plugin } from 'payload'

const PLUGIN_METADATA = {
  name: 'Export & Import',
  slug: 'export-import',
  version: '1.0.0',
  description: 'Export collections to ZIP (JSON + CSV + media) and import them back.',
}

export const EXPORTABLE_COLLECTIONS = [
  'posts',
  'pages',
  'portfolio',
  'job-vacancies',
  'testimonials',
  'faqs',
  'faq-categories',
  'categories',
  'portfolio-categories',
  'media',
]

export const EXPORTABLE_GLOBALS = ['navigation', 'settings', 'theme']

export const exportImportPlugin =
  (): Plugin =>
  (incomingConfig: Config): Config => {
    const config: Config = {
      ...incomingConfig,

      // ── Seed plugin on init ──────────────────────────────────────────────
      onInit: async (payload) => {
        if (incomingConfig.onInit) await incomingConfig.onInit(payload)

        if (process.env.NEXT_PHASE === 'phase-production-build') return

        try {
          const existing = await payload.find({
            collection: 'plugins',
            where: { slug: { equals: PLUGIN_METADATA.slug } },
            limit: 1,
          })

          if (existing.totalDocs === 0) {
            await payload.create({
              collection: 'plugins',
              data: {
                name: PLUGIN_METADATA.name,
                slug: PLUGIN_METADATA.slug,
                pluginType: 'built-in',
                category: 'utility',
                status: 'active',
                version: PLUGIN_METADATA.version,
                author: 'ATech',
                description: PLUGIN_METADATA.description,
                autoActivate: false,
                features: [
                  {
                    featureName: 'Collection Export',
                    featureDescription: 'Export selected collections to a ZIP (JSON + CSV + media)',
                    featureType: 'script',
                  },
                  {
                    featureName: 'Collection Import',
                    featureDescription: 'Import content from a previously exported ZIP file',
                    featureType: 'script',
                  },
                  {
                    featureName: 'Globals Export/Import',
                    featureDescription: 'Export and import Navigation, Settings, and Theme globals',
                    featureType: 'script',
                  },
                ],
              },
            })
            payload.logger.info('✅ Export & Import plugin seeded into Plugins collection.')
          }
        } catch (err) {
          payload.logger.warn(
            `⚠ Export & Import plugin seed skipped: ${(err as Error).message}`,
          )
        }
      },

      // ── Inject quick-export button into content collection list views ────
      collections: (incomingConfig.collections ?? []).map((collection) => {
        if (!EXPORTABLE_COLLECTIONS.includes(collection.slug)) return collection

        return {
          ...collection,
          admin: {
            ...collection.admin,
            components: {
              ...collection.admin?.components,
              views: {
                ...(collection.admin?.components as any)?.views,
                list: {
                  ...(collection.admin?.components as any)?.views?.list,
                  actions: [
                    ...((collection.admin?.components as any)?.views?.list?.actions ?? []),
                    '@/components/admin/CollectionExportButton#CollectionExportButton',
                  ],
                },
              },
            },
          },
        }
      }),
    }

    return config
  }

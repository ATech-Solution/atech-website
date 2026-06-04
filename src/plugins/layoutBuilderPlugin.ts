import type { Config, Plugin } from 'payload'

export interface LayoutBuilderPluginOptions {
  /** Unique slug used to identify this plugin in the Plugins collection. Default: 'layout-builder' */
  slug?: string
  /** Display name shown in the Plugins collection. Default: 'Layout Builder Plugin' */
  name?: string
  /** Semantic version string. Default: '1.0.0' */
  version?: string
  /** Author / organization name. Default: 'ATech' */
  author?: string
  /** Human-readable description shown in the admin. */
  description?: string
  /** Additional features to declare beyond the two built-in ones. */
  extraFeatures?: Array<{
    featureName: string
    featureDescription?: string
    featureType?: 'field' | 'collection' | 'hook' | 'script'
  }>
}

/**
 * Layout Builder Plugin for Payload CMS
 *
 * Registers itself into the `plugins` collection on first server start.
 * Pass options to customise the plugin metadata for your project.
 *
 * Usage:
 *   import { layoutBuilderPlugin } from '@/plugins/layoutBuilderPlugin'
 *
 *   export default buildConfig({
 *     plugins: [
 *       layoutBuilderPlugin({ author: 'My Company', version: '2.0.0' }),
 *     ],
 *   })
 */
export const layoutBuilderPlugin = (options: LayoutBuilderPluginOptions = {}): Plugin =>
  (incomingConfig: Config): Config => {
    const {
      slug        = 'layout-builder',
      name        = 'Layout Builder Plugin',
      version     = '1.0.0',
      author      = 'ATech',
      description = 'Visual drag-and-drop page builder with an infinite-nesting block canvas, reusable block library, and per-page style overrides.',
      extraFeatures = [],
    } = options

    return {
      ...incomingConfig,

      onInit: async (payload) => {
        if (incomingConfig.onInit) {
          await incomingConfig.onInit(payload)
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
                category: 'layout',
                status: 'active',
                version,
                author,
                description,
                autoActivate: true,
                features: [
                  {
                    featureName: 'Layout Builder',
                    featureDescription: 'Drag-and-drop visual page layout editor with infinite container nesting',
                    featureType: 'field',
                  },
                  {
                    featureName: 'Blocks Collection',
                    featureDescription: 'Reusable block template library with Content / Style / Advanced properties',
                    featureType: 'collection',
                  },
                  ...extraFeatures,
                ],
              },
            })

            payload.logger.info(`✅ ${name} seeded into Plugins collection.`)
          }
        } catch (err) {
          payload.logger.warn(`⚠ Layout Builder Plugin seed skipped: ${(err as Error).message}`)
        }
      },
    }
  }

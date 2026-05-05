import type { Config, Plugin } from 'payload'

/**
 * Layout Builder Plugin
 *
 * Registers itself into the Plugins collection on first server start.
 * The plugin entry controls:
 *   - Visibility of the Blocks collection in admin
 *   - Visibility of the layoutBuilder field in Pages
 *
 * Slug: "layout-builder" (reserved)
 */
export const layoutBuilderPlugin = (): Plugin => (incomingConfig: Config): Config => {
  return {
    ...incomingConfig,

    onInit: async (payload) => {
      // Chain with any existing onInit
      if (incomingConfig.onInit) {
        await incomingConfig.onInit(payload)
      }

      if (process.env.NEXT_PHASE === 'phase-production-build') return

      try {
        const existing = await payload.find({
          collection: 'plugins',
          where: { slug: { equals: 'layout-builder' } },
          limit: 1,
        })

        if (existing.totalDocs === 0) {
          await payload.create({
            collection: 'plugins',
            data: {
              name: 'Layout Builder Plugin',
              slug: 'layout-builder',
              pluginType: 'built-in',
              category: 'layout',
              status: 'active',
              version: '1.0.0',
              author: 'ATech',
              description:
                'Visual drag-and-drop page builder with an infinite-nesting block canvas, reusable block library, and per-page style overrides.',
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
              ],
            },
          })

          payload.logger.info('✅ Layout Builder Plugin seeded into Plugins collection.')
        }
      } catch (err) {
        payload.logger.warn(`⚠ Layout Builder Plugin seed skipped: ${(err as Error).message}`)
      }
    },
  }
}

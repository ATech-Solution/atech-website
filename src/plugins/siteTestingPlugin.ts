import type { Config, Plugin } from 'payload'
import { PLUGIN_METADATA } from './site-testing/index'

export const siteTestingPlugin = (): Plugin =>
  (incomingConfig: Config): Config => {
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
                    featureName: 'Smoke Tests',
                    featureDescription: 'HTTP checks on all pages, API endpoints, and assets',
                    featureType: 'hook',
                  },
                  {
                    featureName: 'Playwright E2E',
                    featureDescription: 'Browser-based tests for nav, forms, mobile, and blocks',
                    featureType: 'script',
                  },
                  {
                    featureName: 'Deploy Checklist',
                    featureDescription: 'Pre-deploy checklist covering build, UI, and API health',
                    featureType: 'hook',
                  },
                ],
              },
            })
            payload.logger.info('✅ Site Testing plugin seeded into Plugins collection.')
          }
        } catch (err) {
          payload.logger.warn(`⚠ Site Testing plugin seed skipped: ${(err as Error).message}`)
        }
      },
    }
  }

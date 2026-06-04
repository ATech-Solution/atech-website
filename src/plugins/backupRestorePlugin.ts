import type { Config, Plugin } from 'payload'
import { PLUGIN_METADATA } from './backup-restore/index'

export const backupRestorePlugin = (): Plugin =>
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
                    featureName: 'Database Backup',
                    featureDescription: 'Snapshot the SQLite .db file to backups/db/',
                    featureType: 'script',
                  },
                  {
                    featureName: 'Media Backup',
                    featureDescription: 'Archive public/media/ as a .tar.gz to backups/files/',
                    featureType: 'script',
                  },
                  {
                    featureName: 'Project Backup',
                    featureDescription: 'Archive project source (excluding build/runtime folders) to backups/project/',
                    featureType: 'script',
                  },
                  {
                    featureName: 'Google Drive Upload',
                    featureDescription: 'Upload backups to Google Drive via OAuth2',
                    featureType: 'hook',
                  },
                ],
              },
            })

            payload.logger.info('✅ Backup & Restore plugin seeded into Plugins collection.')
          }
        } catch (err) {
          payload.logger.warn(
            `⚠ Backup & Restore plugin seed skipped: ${(err as Error).message}`,
          )
        }
      },
    }
  }

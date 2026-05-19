import type { Config, Plugin } from 'payload'
import { generateSeoContent } from './seo/generateSeoContent'

interface SeoPluginOptions {
  collections?: string[]
}

const name        = 'SEO Plugin'
const slug        = 'seo'
const version     = '1.0.0'
const author      = 'ATech'
const description = 'Traditional SEO + LLM SEO in one bundle. Sitemap, robots.txt, llms.txt, JSON-LD, Open Graph, and AI-assisted humanized content generation.'

export const seoPlugin = (options: SeoPluginOptions = {}): Plugin =>
  (incomingConfig: Config): Config => {
    const { collections = ['pages', 'posts', 'portfolio', 'job-vacancies'] } = options

    return {
      ...incomingConfig,

      onInit: async (payload) => {
        if (incomingConfig.onInit) await incomingConfig.onInit(payload)
        if (process.env.NEXT_PHASE === 'phase-production-build') return

        // ── Self-seed into Plugins collection ──────────────────────────────
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
                name, slug, pluginType: 'built-in', category: 'utility',
                status: 'active', version, author, description,
                autoActivate: true,
                features: [
                  { featureName: 'Meta Title & Description', featureType: 'field' },
                  { featureName: 'Open Graph / Social Cards', featureType: 'field' },
                  { featureName: 'JSON-LD Structured Data', featureType: 'script' },
                  { featureName: 'Dynamic Sitemap', featureType: 'hook' },
                  { featureName: 'Dynamic robots.txt', featureType: 'hook' },
                  { featureName: 'llms.txt', featureType: 'hook' },
                  { featureName: 'AI Content Generation', featureType: 'hook' },
                  { featureName: 'Humanizer Post-processing', featureType: 'hook' },
                ],
              },
            })
            payload.logger.info(`✅ ${name} seeded into Plugins collection.`)
          }
        } catch (err) {
          payload.logger.warn(`⚠ ${name} seed skipped: ${(err as Error).message}`)
        }

        // ── Auto-fill afterChange hook per collection ──────────────────────
        if (!process.env.ANTHROPIC_API_KEY) return

        for (const collectionSlug of collections) {
          payload.config.collections
            ?.filter((c) => c.slug === collectionSlug)
            .forEach((col) => {
              const existing = col.hooks?.afterChange ?? []
              col.hooks = {
                ...col.hooks,
                afterChange: [
                  ...existing,
                  async ({ doc, operation }) => {
                    if (operation !== 'create') return doc
                    const needsFill =
                      !doc.meta?.title && !doc.meta?.description && !doc.seo?.llmsEntry
                    if (!needsFill) return doc

                    try {
                      const [title, description, llmsEntry] = await Promise.all([
                        generateSeoContent({ field: 'meta.title', doc, collectionSlug }),
                        generateSeoContent({ field: 'meta.description', doc, collectionSlug }),
                        generateSeoContent({ field: 'seo.llmsEntry', doc, collectionSlug }),
                      ])

                      await payload.update({
                        collection: collectionSlug as any,
                        id: doc.id,
                        data: {
                          meta: { title, description },
                          seo: { llmsEntry },
                        },
                      })
                    } catch (err) {
                      payload.logger.warn(`SEO auto-fill failed for ${collectionSlug}/${doc.id}: ${(err as Error).message}`)
                    }

                    return doc
                  },
                ],
              }
            })
        }
      },
    }
  }

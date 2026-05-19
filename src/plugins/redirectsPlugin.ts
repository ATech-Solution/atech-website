import type { Config, Plugin } from 'payload'
import { redirectsPlugin as payloadRedirectsPlugin } from '@payloadcms/plugin-redirects'

// ─── Options ─────────────────────────────────────────────────────────────────

export interface RedirectsPluginOptions {
  /** Unique slug used to identify this plugin in the Plugins collection. Default: 'redirects' */
  slug?: string
  /** Display name shown in the Plugins collection. Default: 'Redirects' */
  name?: string
  /** Semantic version string. Default: '1.0.0' */
  version?: string
  /** Author / organization name. Default: 'ATech' */
  author?: string
  /** Human-readable description shown in the admin. */
  description?: string
  /** Collections that get a "redirects" relationship field. Default: ['pages', 'posts'] */
  collections?: string[]
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

/**
 * Redirects Plugin for Payload CMS
 *
 * Wraps @payloadcms/plugin-redirects and registers itself into the
 * `plugins` collection on first server start.
 *
 * Usage:
 *   import { redirectsPlugin } from '@/plugins/redirectsPlugin'
 *
 *   export default buildConfig({
 *     plugins: [
 *       redirectsPlugin({ collections: ['pages', 'posts'] }),
 *     ],
 *   })
 *
 * Requires: npm install @payloadcms/plugin-redirects
 *
 * Next.js middleware integration:
 *   Query /api/redirects?where[from][equals]=<path> and apply the result
 *   as a Next.js redirect in your middleware.ts file.
 */
export const redirectsPlugin = (options: RedirectsPluginOptions = {}): Plugin =>
  (incomingConfig: Config): Config => {
    const {
      slug        = 'redirects',
      name        = 'Redirects',
      version     = '1.0.0',
      author      = 'ATech',
      description = 'Manage 301/302 URL redirects. Adds a "redirects" collection and a relationship field on selected collections. Integrate with Next.js middleware to apply redirects at the edge.',
      collections = ['pages', 'posts'],
    } = options

    // Always hidden from default nav — RedirectsNavLink in afterNavLinks handles
    // visibility based on plugin activation status.
    const configWithRedirects = payloadRedirectsPlugin({
      collections,
      overrides: {
        admin: { hidden: () => true },
      },
    })(incomingConfig)

    return {
      ...configWithRedirects,

      onInit: async (payload) => {
        // Chain the previous onInit (from other plugins or the base config).
        if (configWithRedirects.onInit) {
          await configWithRedirects.onInit(payload)
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
                    featureName: 'Redirects Collection',
                    featureDescription: 'Map old URLs to new destinations with 301 or 302 status codes',
                    featureType: 'collection',
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

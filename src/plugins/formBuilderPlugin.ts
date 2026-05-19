import type { Config, Plugin } from 'payload'
import { formBuilderPlugin as payloadFormBuilderPlugin } from '@payloadcms/plugin-form-builder'

// ─── Options ─────────────────────────────────────────────────────────────────

export interface FormBuilderPluginOptions {
  /** Unique slug used to identify this plugin in the Plugins collection. Default: 'form-builder' */
  slug?: string
  /** Display name shown in the Plugins collection. Default: 'Form Builder' */
  name?: string
  /** Semantic version string. Default: '1.0.0' */
  version?: string
  /** Author / organization name. Default: 'ATech' */
  author?: string
  /** Human-readable description shown in the admin. */
  description?: string
  /** Admin email to send form submissions to. Falls back to ADMIN_EMAIL env var. */
  defaultToEmail?: string
  /** Toggle individual field types for the form builder. */
  fields?: {
    text?: boolean
    textarea?: boolean
    select?: boolean
    email?: boolean
    state?: boolean
    country?: boolean
    checkbox?: boolean
    number?: boolean
    message?: boolean
    payment?: boolean
  }
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

/**
 * Form Builder Plugin for Payload CMS
 *
 * Wraps @payloadcms/plugin-form-builder and registers itself into the
 * `plugins` collection on first server start.
 *
 * Usage:
 *   import { formBuilderPlugin } from '@/plugins/formBuilderPlugin'
 *
 *   export default buildConfig({
 *     plugins: [
 *       formBuilderPlugin({ defaultToEmail: 'admin@example.com' }),
 *     ],
 *   })
 *
 * Requires: npm install @payloadcms/plugin-form-builder
 */
export const formBuilderPlugin = (options: FormBuilderPluginOptions = {}): Plugin =>
  (incomingConfig: Config): Config => {
    const {
      slug           = 'form-builder',
      name           = 'Form Builder',
      version        = '1.0.0',
      author         = 'ATech',
      description    = 'Drag-and-drop form builder with configurable field types. Creates a "forms" collection and a "formSubmissions" collection for storing user responses.',
      defaultToEmail = process.env.ADMIN_EMAIL ?? 'dev@atech.software',
      fields         = {
        text:     true,
        textarea: true,
        select:   true,
        email:    true,
        state:    false,
        country:  false,
        checkbox: true,
        number:   true,
        message:  true,
        payment:  false,
      },
    } = options

    // Always hidden from default nav — custom FormsNavLink / FormSubmissionsNavLink
    // in afterNavLinks handle visibility based on plugin activation status.
    const configWithForms = payloadFormBuilderPlugin({
      fields,
      defaultToEmail,
      formOverrides: {
        admin: { hidden: () => true },
      },
      formSubmissionOverrides: {
        admin: { hidden: () => true },
      },
    })(incomingConfig)

    return {
      ...configWithForms,

      onInit: async (payload) => {
        // Always chain the previous onInit (from other plugins or the base config).
        if (configWithForms.onInit) {
          await configWithForms.onInit(payload)
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
                    featureName: 'Forms Collection',
                    featureDescription: 'Drag-and-drop form builder with configurable field types',
                    featureType: 'collection',
                  },
                  {
                    featureName: 'Form Submissions Collection',
                    featureDescription: 'Stores all form submission data with per-field values',
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

import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from './plugins/seoPlugin'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { formBuilderPlugin } from './plugins/formBuilderPlugin'
import { redirectsPlugin } from './plugins/redirectsPlugin'
import { searchPlugin } from './plugins/searchPlugin'
import { stripePlugin } from '@payloadcms/plugin-stripe'
import nodemailer from 'nodemailer'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'
// import { payloadEmailAdapter } from './lib/email'
// import { withPruning } from '../src/utils/injectPruneButton'

import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import { Portfolio } from './collections/Portfolio'
import { PortfolioCategories } from './collections/PortfolioCategories'
import { FAQCategories } from './collections/FAQCategories'
import { FAQs } from './collections/FAQs'
import { Testimonials } from './collections/Testimonials'
import { JobVacancies } from './collections/JobVacancies'
import { Users } from './collections/Users'
import { Plugins } from './collections/Plugins'
import { Blocks } from './collections/Blocks'
import { Navigation } from './collections/Navigation'
import { Settings } from './collections/Settings'
import { Theme } from './collections/Theme'
import { layoutBuilderPlugin } from './plugins/layoutBuilderPlugin'
import { backupRestorePlugin } from './plugins/backupRestorePlugin'
import { securityPlugin } from './plugins/securityPlugin'
import { AiContentFeature } from './features/aiContent/feature.server'
import { AuditLogs } from './collections/AuditLogs'
import { SecurityEvents } from './collections/SecurityEvents'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

function envUrl(key: string): string {
  const suffix = process.env.NODE_ENV === 'production' ? '_PROD' : '_DEV'
  return process.env[`${key}${suffix}`] || process.env[key] || ''
}

// Normalize a URL to a bare origin: strip trailing slashes, add https if no protocol.
// Payload's CSRF check does an exact string match against the browser's Origin header,
// so 'https://uat.atech.software' and 'https://uat.atech.software/' are different.
function normalizeOrigin(url: string): string {
  if (!url) return ''
  const trimmed = url.replace(/\/+$/, '')                      // strip trailing slashes
  if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}` // add https if missing
  return trimmed
}

const rawSiteUrl    = envUrl('NEXT_PUBLIC_SITE_URL')       || 'http://localhost:3000'
const rawServerUrl  = envUrl('PAYLOAD_PUBLIC_SERVER_URL')  || rawSiteUrl
const siteUrl       = normalizeOrigin(rawSiteUrl)
const payloadServerUrl = normalizeOrigin(rawServerUrl)

// Include both https and http variants so a misconfigured secret (wrong protocol)
// doesn't lock out the admin panel. The cookie extractor checks Origin header against
// this list — any mismatch silently drops req.user, causing 403 "not allowed".
function originVariants(url: string): string[] {
  if (!url) return []
  const n = normalizeOrigin(url)
  return Array.from(new Set([
    n,
    n.replace(/^https:\/\//i, 'http://'),
    n.replace(/^http:\/\//i,  'https://'),
  ]))
}

const localDevUrls = ['http://localhost:3000', 'http://127.0.0.1:3000']
const allowedOrigins = Array.from(new Set([
  ...originVariants(payloadServerUrl),
  ...originVariants(siteUrl),
  ...localDevUrls,
]))

// Resilient email adapter — send failures are logged but never thrown,
// so auth operations (forgot-password, user create+verify) never return "Something went wrong"
// due to an email transport error.
const buildEmailAdapter = async () => {
  const fromAddress = process.env.EMAIL_FROM || 'noreply@uat.atech.software'
  const fromName = process.env.EMAIL_FROM_NAME || 'Atech Software'

  const smtpPort = parseInt(process.env.AWS_SES_SMTP_PORT || '465')
  const transport = process.env.AWS_SES_SMTP_USER
    ? nodemailer.createTransport({
        host: process.env.AWS_SES_SMTP_HOST || 'email-smtp.ap-southeast-1.amazonaws.com',
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: process.env.AWS_SES_SMTP_USER,
          pass: process.env.AWS_SES_SMTP_PASSWORD,
        },
      })
    : nodemailer.createTransport({ jsonTransport: true })

  return () => ({
    name: 'nodemailer',
    defaultFromAddress: fromAddress,
    defaultFromName: fromName,
    sendEmail: async (message: nodemailer.SendMailOptions) => {
      try {
        await transport.sendMail({ from: `${fromName} <${fromAddress}>`, ...message })
      } catch (err) {
        console.error('[Email] Failed to send to', message.to, err instanceof Error ? err.message : String(err))
        // Intentionally swallowed — prevents transport errors from breaking forgot-password / user-verify
      }
    },
  })
}

// ── Server URL — resolved from NODE_ENV ────────────────────────────────────
const serverURL =
  process.env.NODE_ENV === 'production'
    ? (process.env.PAYLOAD_PUBLIC_SERVER_URL_PROD
        ?? process.env.PAYLOAD_PUBLIC_SERVER_URL
        ?? 'http://localhost:3000')
    : (process.env.PAYLOAD_PUBLIC_SERVER_URL_DEV
        ?? process.env.PAYLOAD_PUBLIC_SERVER_URL
        ?? 'http://localhost:3000')

export default buildConfig({
  serverURL,
  // ── Email (AWS SES) ────────────────────────────────────────────────────────
  // sendEmail() is a no-op when AWS_SES_SMTP_USER is not set (bypass/dev mode).
  // email: payloadEmailAdapter,
  email: buildEmailAdapter(),
  // ── Admin panel ────────────────────────────────────────────────────────────
  admin: {
    user: 'users',            // which collection handles auth
    suppressHydrationWarning: true,
    components: {
      graphics: {
        Logo: '@/components/admin/AdminLogo#AdminLogo',
        Icon: '@/components/admin/AdminLogo#AdminLogo',
      },
      afterNavLinks: [
        '@/components/admin/PluginNavLink#PluginNavLink',
        '@/components/admin/SeoNavLink#SeoNavLink',
        '@/components/admin/FormsNavLink#FormsNavLink',
        '@/components/admin/FormSubmissionsNavLink#FormSubmissionsNavLink',
        '@/components/admin/RedirectsNavLink#RedirectsNavLink',
        '@/components/admin/SearchNavLink#SearchNavLink',
        '@/components/admin/BlocksNavLink#BlocksNavLink',
        '@/components/admin/BackupNavLink#BackupNavLink',
        '@/components/admin/SecurityNavLink#SecurityNavLink',
      ],
    },
    // autoLogin: process.env.NODE_ENV !== 'production'
    //   ? { email: 'tan@atech.software', prefillOnly: false }
    //   : false,
    meta: {
      titleSuffix: ' — ATech Admin',
      icons: [{ url: '/images/favicon-.png' }],
    },
    // ── Live Preview (works for any frontend URL) ──────────────────────────
    livePreview: {
      breakpoints: [
        { label: 'Mobile',  name: 'mobile',  width: 375,  height: 812 },
        { label: 'Tablet',  name: 'tablet',  width: 768,  height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
    importMap: {
      baseDir: '@', // or path.resolve(__dirname)
    },
  },

  // CORS & CSRF origins (top-level, not inside admin)
  cors: allowedOrigins,
  csrf: allowedOrigins,

  // ── Collections ────────────────────────────────────────────────────────────
  collections: [Users, Pages, Posts, Categories, Portfolio, PortfolioCategories, FAQCategories, FAQs, Testimonials, JobVacancies, Media, Plugins, Blocks, AuditLogs, SecurityEvents],

  // ── Globals ────────────────────────────────────────────────────────────────
  globals: [Navigation, Settings, Theme],

  // collections: withPruning([
  //   Users, Pages, Posts, Categories, Media, Plugins, Blocks
  // ]),
  // globals: withPruning([
  //   Navigation, Settings, Theme
  // ]),

  // ── Rich text editor ───────────────────────────────────────────────────────
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      AiContentFeature(),
    ],
  }),

  // ── Localization ───────────────────────────────────────────────────────────
  // Fields marked `localized: true` get a copy per locale
  localization: {
    locales: [
      { label: 'English',    code: 'en' },
      { label: 'Indonesian', code: 'id' },
    ],
    defaultLocale: 'en',
    fallback: true, // fall back to default locale when translation missing
  },

  // ── Image processing ───────────────────────────────────────────────────────
  sharp,

  // ── GraphQL API ────────────────────────────────────────────────────────────
  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
  },

  // ── Database ───────────────────────────────────────────────────────────────
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:./data/payload.db',
    },
    migrationDir: path.resolve(dirname, 'migrations'),
    push: false,
  }),

  // ── Secret ─────────────────────────────────────────────────────────────────
  secret: process.env.PAYLOAD_SECRET || 'CHANGE_THIS_SECRET',

  // ── TypeScript output ──────────────────────────────────────────────────────
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // ── Upload limits ──────────────────────────────────────────────────────────
  upload: {
    limits: {
      fileSize: 10_000_000, // 10 MB
    },
  },

  // ── Plugins ────────────────────────────────────────────────────────────────
  plugins: [
    // Security Plugin — brute-force, 2FA, upload security, audit log, IP filter, rate limit
    securityPlugin(),

    // Layout Builder — seeds itself into the Plugins collection on first run
    layoutBuilderPlugin(),

    // Backup & Restore — seeds itself into the Plugins collection on first run
    backupRestorePlugin(),

    // 1. SEO ─────────────────────────────────────────────────────────────────
    // Traditional SEO + LLM SEO bundle
    // Replaces @payloadcms/plugin-seo — see src/plugins/seoPlugin.ts
    seoPlugin(),

    // 2. Form Builder ─────────────────────────────────────────────────────────
    // Reusable plugin wrapper — see src/plugins/formBuilderPlugin.ts
    // Creates "forms" + "formSubmissions" collections and seeds into Plugin Manager.
    formBuilderPlugin(),

    // 3. Nested Docs ──────────────────────────────────────────────────────────
    // Adds a "parent" relationship field to Pages and Categories
    // Automatically generates breadcrumbs + full URL path
    nestedDocsPlugin({
      collections: ['pages', 'categories'],
      generateLabel: (_, doc) => doc.title as string,
      generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
    }),

    // 4. Redirects ────────────────────────────────────────────────────────────
    // Reusable plugin wrapper — see src/plugins/redirectsPlugin.ts
    // Creates "redirects" collection and seeds into Plugin Manager.
    redirectsPlugin(),

    // 5. Search ───────────────────────────────────────────────────────────────
    // Reusable plugin wrapper — see src/plugins/searchPlugin.ts
    // Creates "search-results" collection and seeds into Plugin Manager.
    searchPlugin(),

    // 6. Stripe ───────────────────────────────────────────────────────────────
    // Syncs Payload documents with Stripe objects (products, customers, etc.)
    // Set STRIPE_SECRET_KEY in .env to activate
    stripePlugin({
      stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? '',
      isTestKey: !process.env.STRIPE_SECRET_KEY?.startsWith('sk_live'),
      stripeWebhooksEndpointSecret: process.env.STRIPE_WEBHOOK_SECRET ?? '',
      logs: true,
      webhooks: {
        // Handle Stripe events here, e.g.:
        // 'customer.subscription.created': ({ event, payload }) => { ... }
      },
    }),

  ],

  // endpoints: [
  //   {
  //     path: '/prune-versions',
  //     method: 'post',
  //     handler: async (req) => {
  //       const { searchParams } = new URL(req.url)
  //       const slug = searchParams.get('slug')
  //       const type = searchParams.get('type')
  //       const id = searchParams.get('id')

  //       try {
  //         await req.payload.db.deleteVersions({
  //           [type as string]: slug,
  //           // For collections, only delete versions of THIS specific record
  //           // For globals, delete all versions
  //           where: type === 'collection' ? { parent: { equals: id } } : { id: { exists: true } },
  //         } as any)

  //         return Response.json({ success: true })
  //       } catch (err: any) {
  //         return Response.json({ error: err.message }, { status: 500 })
  //       }
  //     },
  //   },
  // ],

})

import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { searchPlugin } from '@payloadcms/plugin-search'
import { stripePlugin } from '@payloadcms/plugin-stripe'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'
import { payloadEmailAdapter } from './lib/email'

import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import { Users } from './collections/Users'
import { Plugins } from './collections/Plugins'
import { Blocks } from './collections/Blocks'
import { Navigation } from './collections/Navigation'
import { Settings } from './collections/Settings'
import { Theme } from './collections/Theme'
import { layoutBuilderPlugin } from './plugins/layoutBuilderPlugin'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

function envUrl(key: string): string {
  const suffix = process.env.NODE_ENV === 'production' ? '_PROD' : '_DEV'
  return process.env[`${key}${suffix}`] || process.env[key] || ''
}

const siteUrl = envUrl('NEXT_PUBLIC_SITE_URL') || 'http://localhost:3000'
const payloadServerUrl = envUrl('PAYLOAD_PUBLIC_SERVER_URL') || siteUrl
const localDevUrls = ['http://localhost:3000', 'http://127.0.0.1:3000']
const allowedOrigins = Array.from(new Set([payloadServerUrl, siteUrl, ...localDevUrls]))

// ── Server URL — resolved from NODE_ENV ────────────────────────────────────
// Priority: env-specific override → shared fallback → localhost default
// const serverURL =
//   process.env.NODE_ENV === 'production'
//     ? (process.env.PAYLOAD_PUBLIC_SERVER_URL_PROD
//         ?? process.env.PAYLOAD_PUBLIC_SERVER_URL
//         ?? 'http://localhost:3000')
//     : (process.env.PAYLOAD_PUBLIC_SERVER_URL_DEV
//         ?? process.env.PAYLOAD_PUBLIC_SERVER_URL
//         ?? 'http://localhost:3000')

export default buildConfig({
  // serverURL,
  // ── Email (AWS SES) ────────────────────────────────────────────────────────
  // sendEmail() is a no-op when AWS_SES_SMTP_USER is not set (bypass/dev mode).
  email: payloadEmailAdapter,
  // server: "standalone",
  // ── Admin panel ────────────────────────────────────────────────────────────
  admin: {
    user: 'users',            // which collection handles auth
    suppressHydrationWarning: true,
    // autoLogin: process.env.NODE_ENV !== 'production'
    //   ? { email: 'dev@atech.software', prefillOnly: false }
    //   : false,
    autoLogin: { email: 'dev@atech.software', prefillOnly: false },
    meta: {
      titleSuffix: '— ATech Admin',
    },
    // ── Live Preview (works for any frontend URL) ──────────────────────────
    livePreview: {
      breakpoints: [
        { label: 'Mobile',  name: 'mobile',  width: 375,  height: 812 },
        { label: 'Tablet',  name: 'tablet',  width: 768,  height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },

  // CORS & CSRF origins (top-level, not inside admin)
  cors: allowedOrigins,
  csrf: allowedOrigins,

  // ── Collections ────────────────────────────────────────────────────────────
  collections: [Users, Pages, Posts, Categories, Media, Plugins, Blocks],

  // ── Globals ────────────────────────────────────────────────────────────────
  globals: [Navigation, Settings, Theme],

  // ── Rich text editor ───────────────────────────────────────────────────────
  editor: lexicalEditor({}),

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
    // Layout Builder — seeds itself into the Plugins collection on first run
    layoutBuilderPlugin(),


    // 1. SEO ─────────────────────────────────────────────────────────────────
    // Adds a "Meta" tab to Pages and Posts with title, description, OG image
    // Shows a real-time SEO score panel in the admin UI
    seoPlugin({
      collections: ['pages', 'posts'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `${doc.title} | ATech`,
      generateDescription: ({ doc }) => doc.excerpt ?? doc.title,
    }),

    // 2. Form Builder ─────────────────────────────────────────────────────────
    // Creates a "forms" collection in admin; each form is a drag-and-drop
    // builder with field types: text, email, textarea, select, checkbox, etc.
    // Submissions are stored in a "formSubmissions" collection automatically.
    formBuilderPlugin({
      fields: {
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
      // Email sent to admin on form submission
      defaultToEmail: process.env.ADMIN_EMAIL ?? 'tan@atech.software.com',
    }),

    // 3. Nested Docs ──────────────────────────────────────────────────────────
    // Adds a "parent" relationship field to Pages and Categories
    // Automatically generates breadcrumbs + full URL path
    nestedDocsPlugin({
      collections: ['pages', 'categories'],
      generateLabel: (_, doc) => doc.title as string,
      generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
    }),

    // 4. Redirects ────────────────────────────────────────────────────────────
    // Adds a "redirects" collection: map old URLs to new ones (301/302)
    // Use in Next.js middleware to check and apply redirects
    redirectsPlugin({
      collections: ['pages', 'posts'],
    }),

    // 5. Search ───────────────────────────────────────────────────────────────
    // Adds a "search" collection that indexes content from pages and posts
    // Query /api/search?q=term to find results across collections
    searchPlugin({
      collections: ['posts', 'pages'],
      defaultPriorities: {
        posts: 10,
        pages: 20,
      },
      searchOverrides: {
        fields: ({ defaultFields }) => [
          ...defaultFields,
          {
            name: 'excerpt',
            type: 'textarea',
            label: 'Excerpt',
          },
        ],
      },
    }),

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
})

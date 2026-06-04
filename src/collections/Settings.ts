import type { GlobalConfig } from 'payload'

const COLLECTIONS = [
  { label: 'Pages',      value: 'pages' },
  { label: 'Posts',      value: 'posts' },
  { label: 'Categories', value: 'categories' },
  { label: 'Media',      value: 'media' },
  { label: 'Users',      value: 'users' },
  { label: 'Navigation', value: 'navigation' },
  { label: 'Blocks',     value: 'blocks' },
]

const ROLES = [
  { label: 'Admin',  value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Viewer', value: 'viewer' },
]

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Site Settings',
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
  },
  versions: { 
    max: 3,
    drafts: true,
 },
//  hooks: {
//     afterChange: [
//       async ({ req }) => {
//         const MAX_VERSIONS = 10 // Your desired limit
//         const globalSlug = 'settings'

//         try {
//           // 1. Fetch existing versions for this global using the Local API
//           const versions = await req.payload.findVersions({
//             global: globalSlug,
//             limit: 100,
//             sort: '-createdAt', // Newest first
//             depth: 0,
//           })

//           // 2. If versions exceed your limit, prune the oldest ones
//           if (versions.totalDocs > MAX_VERSIONS) {
//             const versionsToDelete = versions.docs.slice(MAX_VERSIONS)

//             for (const v of versionsToDelete) {
//               await req.payload.db.deleteVersions({
//                 collection: globalSlug,
//                 where: { id: { equals: v.id } },
//               })
//             }
//           }
//         } catch (err) {
//           req.payload.logger.error(`Manual prune failed for ${globalSlug}: ${err.message}`)
//         }
//       },
//     ],
//   },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ── General ──────────────────────────────────────────────────────────
        {
          label: 'General',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              defaultValue: 'ATech',
              label: 'Site Name',
              localized: true,
            },
            {
              name: 'siteDescription',
              type: 'textarea',
              label: 'Site Description (default SEO)',
              localized: true,
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Default OG Image',
            },
            // ── Maintenance Mode ──────────────────────────────────────────
            {
              type: 'collapsible',
              label: 'Maintenance Mode',
              admin: { initCollapsed: true },
              fields: [
                {
                  name: 'maintenanceMode',
                  type: 'checkbox',
                  label: 'Enable Maintenance Mode',
                  defaultValue: false,
                  admin: {
                    description:
                      'When enabled, all frontend pages redirect to the maintenance page.',
                  },
                },
                {
                  name: 'maintenanceTitle',
                  type: 'text',
                  label: 'Maintenance Page Title',
                  defaultValue: 'Under Construction.',
                  localized: true,
                  admin: {
                    condition: (_, siblingData) => Boolean(siblingData?.maintenanceMode),
                  },
                },
                {
                  name: 'maintenanceMessage',
                  type: 'textarea',
                  label: 'Maintenance Message',
                  defaultValue:
                    "We're rebuilding something great. Our systems are temporarily offline while we upgrade — we'll be back shortly.",
                  localized: true,
                  admin: {
                    condition: (_, siblingData) => Boolean(siblingData?.maintenanceMode),
                  },
                },
                {
                  name: 'maintenanceStatusLabel',
                  type: 'text',
                  label: 'Status Badge Text',
                  defaultValue: 'System upgrade in progress',
                  localized: true,
                  admin: {
                    condition: (_, siblingData) => Boolean(siblingData?.maintenanceMode),
                  },
                },
                {
                  name: 'maintenanceEstimate',
                  type: 'text',
                  label: 'Estimated Completion (shown in stats)',
                  defaultValue: 'Soon',
                  localized: true,
                  admin: {
                    condition: (_, siblingData) => Boolean(siblingData?.maintenanceMode),
                  },
                },
              ],
            },
          ],
        },

        // ── Email ─────────────────────────────────────────────────────────────
        {
          label: 'Email',
          fields: [
            {
              name: 'fromName',
              type: 'text',
              label: 'From Name',
              defaultValue: 'ATech',
            },
            {
              name: 'fromEmail',
              type: 'email',
              label: 'From Email',
              defaultValue: 'noreply@atech.com',
            },
            {
              name: 'adminNotificationEmail',
              type: 'email',
              label: 'Admin Notification Email',
            },
            // ── SMTP Transport Config ─────────────────────────────────────
            {
              type: 'collapsible',
              label: 'SMTP Transport Configuration',
              admin: { initCollapsed: false },
              fields: [
                {
                  name: 'smtpEnabled',
                  type: 'checkbox',
                  label: 'Use Settings SMTP (overrides environment variables)',
                  defaultValue: false,
                  admin: {
                    description:
                      'When enabled, the values below are used instead of SMTP_HOST / SMTP_USER env vars.',
                  },
                },
                {
                  name: 'smtpHost',
                  type: 'text',
                  label: 'SMTP Host',
                  admin: {
                    placeholder: 'e.g. email-smtp.ap-southeast-1.amazonaws.com',
                    condition: (_, siblingData) => Boolean(siblingData?.smtpEnabled),
                  },
                },
                {
                  name: 'smtpPort',
                  type: 'number',
                  label: 'SMTP Port',
                  defaultValue: 465,
                  admin: {
                    condition: (_, siblingData) => Boolean(siblingData?.smtpEnabled),
                  },
                },
                {
                  name: 'smtpSecure',
                  type: 'checkbox',
                  label: 'Use TLS (secure)',
                  defaultValue: true,
                  admin: {
                    description: 'Enable for port 465. Disable (STARTTLS) for port 587.',
                    condition: (_, siblingData) => Boolean(siblingData?.smtpEnabled),
                  },
                },
                {
                  name: 'smtpUser',
                  type: 'text',
                  label: 'SMTP Username',
                  admin: {
                    condition: (_, siblingData) => Boolean(siblingData?.smtpEnabled),
                  },
                },
                {
                  name: 'smtpPassword',
                  type: 'text',
                  label: 'SMTP Password',
                  admin: {
                    description: 'Stored encrypted. Leave blank to keep existing value.',
                    condition: (_, siblingData) => Boolean(siblingData?.smtpEnabled),
                  },
                },
              ],
            },
          ],
        },

        // ── Access Control ────────────────────────────────────────────────────
        {
          label: 'Access Control',
          fields: [
            {
              name: 'accessControl',
              type: 'array',
              label: 'Role Permissions',
              admin: {
                description:
                  'Define which roles can perform each action on each collection. Admin role always has full access.',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'collection',
                  type: 'select',
                  label: 'Collection / Resource',
                  required: true,
                  options: COLLECTIONS,
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'canRead',
                      type: 'select',
                      label: 'Can Read',
                      hasMany: true,
                      options: ROLES,
                      defaultValue: ['admin', 'editor', 'viewer'],
                      admin: { width: '33%' },
                    },
                    {
                      name: 'canCreate',
                      type: 'select',
                      label: 'Can Create',
                      hasMany: true,
                      options: ROLES,
                      defaultValue: ['admin', 'editor'],
                      admin: { width: '33%' },
                    },
                    {
                      name: 'canUpdate',
                      type: 'select',
                      label: 'Can Update',
                      hasMany: true,
                      options: ROLES,
                      defaultValue: ['admin', 'editor'],
                      admin: { width: '33%' },
                    },
                  ],
                },
                {
                  name: 'canDelete',
                  type: 'select',
                  label: 'Can Delete',
                  hasMany: true,
                  options: ROLES,
                  defaultValue: ['admin'],
                },
              ],
            },
          ],
        },

        // ── Integrations ──────────────────────────────────────────────────────
        {
          label: 'Integrations',
          fields: [
            {
              name: 'googleAnalyticsId',
              type: 'text',
              label: 'Google Analytics ID',
              admin: { description: 'e.g. G-XXXXXXXXXX' },
            },
            {
              name: 'stripeEnabled',
              type: 'checkbox',
              label: 'Enable Stripe',
              defaultValue: false,
            },
          ],
        },

        // ── Security ─────────────────────────────────────────────────────────
        {
          label: 'Security',
          fields: [
            // ── Admin Login Protection ──────────────────────────────────────
            {
              type: 'collapsible',
              label: 'Login Protection',
              admin: { initCollapsed: false },
              fields: [
                {
                  name: 'loginMaxAttempts',
                  type: 'number',
                  label: 'Max Failed Login Attempts',
                  defaultValue: 5,
                  admin: {
                    description: 'Number of failed attempts before lockout.',
                  },
                },
                {
                  name: 'loginLockoutMinutes',
                  type: 'number',
                  label: 'Lockout Duration (minutes)',
                  defaultValue: 15,
                  admin: {
                    description: 'How long the lockout lasts. 0 = permanent until manually unlocked.',
                  },
                },
                {
                  name: 'requireTwoFactor',
                  type: 'select',
                  label: 'Require Two-Factor Authentication',
                  defaultValue: 'disabled',
                  options: [
                    { label: 'Disabled (optional per user)', value: 'disabled' },
                    { label: 'Required for Admins',          value: 'admins-only' },
                    { label: 'Required for All Users',       value: 'all-users' },
                  ],
                  admin: {
                    description: 'When enforced, users must enroll 2FA on next login.',
                  },
                },
              ],
            },
            // ── IP Filtering ───────────────────────────────────────────────
            {
              type: 'collapsible',
              label: 'IP Filtering',
              admin: { initCollapsed: true },
              fields: [
                {
                  name: 'ipFilterEnabled',
                  type: 'checkbox',
                  label: 'Enable IP Filtering',
                  defaultValue: false,
                  admin: {
                    description: 'When enabled, blocklist and allowlist rules are enforced on /admin.',
                  },
                },
                {
                  name: 'ipBlocklist',
                  type: 'array',
                  label: 'IP Blocklist',
                  admin: {
                    description: 'IPs that are always denied access to /admin.',
                    condition: (_, siblingData) => Boolean(siblingData?.ipFilterEnabled),
                  },
                  fields: [
                    { name: 'ip',     type: 'text', required: true, label: 'IP Address' },
                    { name: 'reason', type: 'text', label: 'Reason (optional)' },
                  ],
                },
                {
                  name: 'ipAllowlist',
                  type: 'array',
                  label: 'IP Allowlist',
                  admin: {
                    description: 'If non-empty, only these IPs can access /admin. Leave empty to allow all non-blocked IPs.',
                    condition: (_, siblingData) => Boolean(siblingData?.ipFilterEnabled),
                  },
                  fields: [
                    { name: 'ip', type: 'text', required: true, label: 'IP Address' },
                  ],
                },
              ],
            },
            // ── API Rate Limiting ──────────────────────────────────────────
            {
              type: 'collapsible',
              label: 'API Rate Limiting',
              admin: { initCollapsed: true },
              fields: [
                {
                  name: 'apiRateLimitEnabled',
                  type: 'checkbox',
                  label: 'Enable API Rate Limiting',
                  defaultValue: true,
                },
                {
                  name: 'apiRateLimitMax',
                  type: 'number',
                  label: 'Max Requests per Minute (per IP)',
                  defaultValue: 60,
                  admin: {
                    condition: (_, siblingData) => Boolean(siblingData?.apiRateLimitEnabled),
                  },
                },
              ],
            },
            // ── Security Headers ───────────────────────────────────────────
            {
              type: 'collapsible',
              label: 'Security Headers',
              admin: { initCollapsed: true },
              fields: [
                {
                  name: 'cspEnabled',
                  type: 'checkbox',
                  label: 'Enable Content Security Policy (CSP)',
                  defaultValue: true,
                },
                {
                  name: 'cspReportOnly',
                  type: 'checkbox',
                  label: 'CSP Report-Only Mode',
                  defaultValue: false,
                  admin: {
                    description: 'Log violations instead of blocking — useful when first rolling out CSP.',
                    condition: (_, siblingData) => Boolean(siblingData?.cspEnabled),
                  },
                },
                {
                  name: 'hstsEnabled',
                  type: 'checkbox',
                  label: 'Enable HSTS (Strict-Transport-Security)',
                  defaultValue: true,
                  admin: {
                    description: 'Only enable on HTTPS deployments.',
                  },
                },
              ],
            },
          ],
        },

        // ── SEO Settings ─────────────────────────────────────────────────────
        {
          label: 'SEO',
          fields: [
            {
              name: 'canonicalDomain',
              type: 'text',
              label: 'Canonical Domain',
              defaultValue: 'https://atech.software',
              admin: {
                description: 'Base URL used for canonical tags and sitemap. No trailing slash.',
              },
            },
            {
              name: 'robotsDisallow',
              type: 'array',
              label: 'robots.txt Disallow Paths',
              admin: {
                description: 'Paths crawlers should not index, e.g. /admin, /api',
              },
              fields: [
                { name: 'path', type: 'text', required: true },
              ],
            },
            {
              name: 'crawlDelay',
              type: 'number',
              label: 'Crawl Delay (seconds)',
              admin: {
                description: 'Optional crawl delay directive for robots.txt',
              },
            },
            {
              name: 'llmsTxtEnabled',
              type: 'checkbox',
              label: 'Enable /llms.txt',
              defaultValue: true,
              admin: {
                description: 'Serve a machine-readable /llms.txt for AI assistants',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'translatePanel',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/admin/TranslateDocButton#TranslateDocButton',
        },
      },
    },
  ],
}

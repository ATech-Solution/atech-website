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
  versions: { max: 3 },
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
            },
            {
              name: 'siteDescription',
              type: 'textarea',
              label: 'Site Description (default SEO)',
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
                  admin: {
                    condition: (_, siblingData) => Boolean(siblingData?.maintenanceMode),
                  },
                },
                {
                  name: 'maintenanceStatusLabel',
                  type: 'text',
                  label: 'Status Badge Text',
                  defaultValue: 'System upgrade in progress',
                  admin: {
                    condition: (_, siblingData) => Boolean(siblingData?.maintenanceMode),
                  },
                },
                {
                  name: 'maintenanceEstimate',
                  type: 'text',
                  label: 'Estimated Completion (shown in stats)',
                  defaultValue: 'Soon',
                  admin: {
                    condition: (_, siblingData) => Boolean(siblingData?.maintenanceMode),
                  },
                },
              ],
            },
          ],
        },

        // ── Social ────────────────────────────────────────────────────────────
        {
          label: 'Social',
          fields: [
            { name: 'twitter',   type: 'text', label: 'Twitter/X URL' },
            { name: 'facebook',  type: 'text', label: 'Facebook URL' },
            { name: 'instagram', type: 'text', label: 'Instagram URL' },
            { name: 'linkedin',  type: 'text', label: 'LinkedIn URL' },
            { name: 'github',    type: 'text', label: 'GitHub URL' },
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
      ],
    },
  ],
}

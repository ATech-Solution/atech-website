import type { GlobalConfig } from 'payload'

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
          ],
        },
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
          ],
        },
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

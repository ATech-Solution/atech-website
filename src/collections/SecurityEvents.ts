import type { CollectionConfig } from 'payload'

export const SecurityEvents: CollectionConfig = {
  slug: 'security-events',
  labels: { singular: 'Security Event', plural: 'Security Events' },
  admin: {
    useAsTitle: 'eventType',
    defaultColumns: ['eventType', 'ip', 'count', 'expiresAt', 'resolved', 'createdAt'],
    hidden: ({ user }) => (user as any)?.email !== 'tan@atech.software',
  },
  access: {
    read: ({ req }) => req.user?.role === 'admin',
    create: () => false,
    update: () => false,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  timestamps: true,
  fields: [
    {
      name: 'eventType',
      type: 'select',
      required: true,
      options: [
        { label: 'Failed Login',    value: 'failed-login' },
        { label: 'Rate Limit Hit',  value: 'rate-limit-hit' },
        { label: 'IP Blocked',      value: 'ip-blocked' },
        { label: 'Upload Rejected', value: 'upload-rejected' },
      ],
    },
    {
      name: 'ip',
      type: 'text',
      label: 'IP Address',
      index: true,
    },
    {
      name: 'userId',
      type: 'text',
      label: 'User ID',
    },
    {
      name: 'endpoint',
      type: 'text',
      label: 'Endpoint',
    },
    {
      name: 'count',
      type: 'number',
      label: 'Event Count',
      defaultValue: 1,
    },
    {
      name: 'expiresAt',
      type: 'date',
      label: 'Expires At',
      admin: {
        description: 'When this lockout/block expires (null = permanent)',
      },
    },
    {
      name: 'resolved',
      type: 'checkbox',
      label: 'Resolved',
      defaultValue: false,
    },
  ],
}

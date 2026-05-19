import type { CollectionConfig } from 'payload'

export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  labels: { singular: 'Audit Log', plural: 'Audit Logs' },
  admin: {
    useAsTitle: 'action',
    defaultColumns: ['action', 'collection', 'user', 'ip', 'createdAt'],
    hidden: true,
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
      name: 'action',
      type: 'select',
      required: true,
      options: [
        { label: 'Login',        value: 'login' },
        { label: 'Logout',       value: 'logout' },
        { label: 'Failed Login', value: 'failed-login' },
        { label: 'Create',       value: 'create' },
        { label: 'Update',       value: 'update' },
        { label: 'Delete',       value: 'delete' },
        { label: 'IP Blocked',   value: 'ip-blocked' },
        { label: '2FA Enabled',  value: '2fa-enabled' },
        { label: '2FA Verified', value: '2fa-verified' },
        { label: 'IP Unlocked',  value: 'ip-unlocked' },
      ],
    },
    {
      name: 'collection',
      type: 'text',
      label: 'Collection / Resource',
    },
    {
      name: 'documentId',
      type: 'text',
      label: 'Document ID',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: 'User',
    },
    {
      name: 'ip',
      type: 'text',
      label: 'IP Address',
    },
    {
      name: 'userAgent',
      type: 'text',
      label: 'User Agent',
    },
    {
      name: 'details',
      type: 'json',
      label: 'Details',
    },
  ],
}

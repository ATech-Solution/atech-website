import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    // Built-in auth: login, logout, forgot/reset password, verify email
    useAPIKey: true,          // API key auth for machine-to-machine
    tokenExpiration: 7200,    // 2-hour JWT expiry
    verify: false,            // set true to require email verification
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'role', 'createdAt'],
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return false
    },
    create: () => true, // allow self-registration; tighten in prod
    update: ({ req, id }) => {
      if (!req.user) return false
      if (req.user.role === 'admin') return true
      return req.user.id === id // users can only edit themselves
    },
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      label: 'First Name',
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Last Name',
    },
    {
      name: 'role',
      type: 'select',
      label: 'Role',
      defaultValue: 'editor',
      required: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Viewer', value: 'viewer' },
      ],
      access: {
        // only admins can change roles
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
  ],
  // Hooks example — runs after every user creation
  hooks: {
    afterChange: [
      ({ doc, operation }) => {
        if (operation === 'create') {
          console.log(`[Hook] New user created: ${doc.email}`)
        }
      },
    ],
  },
}

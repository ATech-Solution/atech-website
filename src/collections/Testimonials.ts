import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'clientName',
    defaultColumns: ['clientName', 'clientCompany', 'rating', 'updatedAt'],
    group: 'Content',
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Avatar Photo',
    },
    {
      name: 'clientName',
      type: 'text',
      required: true,
      label: 'Name',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'clientRole',
          type: 'text',
          label: 'Role / Title',
        },
        {
          name: 'clientCompany',
          type: 'text',
          label: 'Company',
        },
      ],
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      label: 'Quote',
      localized: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'rating',
          type: 'number',
          label: 'Rating (1–5)',
          min: 1,
          max: 5,
          defaultValue: 5,
        },
        {
          name: 'order',
          type: 'number',
          label: 'Display Order',
          defaultValue: 0,
          admin: { description: 'Lower numbers appear first.' },
        },
      ],
    },
  ],
}

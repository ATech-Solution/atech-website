import type { CollectionConfig } from 'payload'

export const FAQCategories: CollectionConfig = {
  slug: 'faq-categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: 'Category Name',
      admin: { description: 'Sidebar label, e.g. "General"' },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Category Title',
      admin: { description: 'Heading shown in main content area, e.g. "General FAQs"' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        description: 'URL-friendly identifier, e.g. "general"',
        components: {
          Field: '@/components/admin/SlugField#SlugField',
        },
        custom: {
          watchField: 'name',
          urlPrefix: '/faq/',
        },
      },
    },
  ],
}

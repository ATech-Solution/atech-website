import type { CollectionConfig } from 'payload'

export const PortfolioCategories: CollectionConfig = {
  slug: 'portfolio-categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'parent'],
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
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        description: 'URL-friendly identifier, auto-generated from category name.',
        components: {
          Field: '@/components/admin/SlugField#SlugField',
        },
        custom: {
          watchField: 'name',
          urlPrefix: '/portfolio/category/',
        },
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'portfolio-categories',
      label: 'Parent Category',
      admin: {
        description: 'Optional parent category for hierarchical grouping (e.g. "Web Apps" under "Digital Products").',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: 'Description',
    },
  ],
}

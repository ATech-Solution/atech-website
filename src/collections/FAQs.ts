import type { CollectionConfig } from 'payload'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'faq-categories',
      required: true,
      label: 'Category',
      admin: { description: 'The FAQ category this question belongs to.' },
    },
    {
      name: 'question',
      type: 'text',
      required: true,
      localized: true,
      label: 'Question',
    },
    {
      name: 'answer',
      type: 'textarea',
      localized: true,
      label: 'Answer',
    },
    {
      name: 'order',
      type: 'number',
      label: 'Display Order',
      defaultValue: 0,
      admin: { description: 'Lower numbers appear first within a category.' },
    },
  ],
}

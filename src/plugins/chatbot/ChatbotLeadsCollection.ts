import type { CollectionConfig } from 'payload'

export const ChatbotLeadsCollection: CollectionConfig = {
  slug: 'chatbot-leads',
  labels: { singular: 'Chatbot Lead', plural: 'Chatbot Leads' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'question', 'page', 'createdAt'],
    group: 'Chatbot',
    description: 'Contact form submissions captured by the chatbot widget',
  },
  access: {
    read: ({ req }) => (req.user as any)?.role === 'admin',
    create: () => true,
    update: ({ req }) => (req.user as any)?.role === 'admin',
    delete: ({ req }) => (req.user as any)?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email',
    },
    {
      name: 'question',
      type: 'text',
      label: 'Question',
      admin: { description: 'Node label that triggered the contact form' },
    },
    {
      name: 'conversationPath',
      type: 'text',
      label: 'Conversation Path',
      admin: { description: 'Full breadcrumb of nodes the user clicked through' },
    },
    {
      name: 'page',
      type: 'text',
      label: 'Page URL',
      admin: { description: 'Page the user was on when they submitted the form' },
    },
  ],
  timestamps: true,
}

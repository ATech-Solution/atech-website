import type { CollectionConfig } from 'payload'

export const ChatbotEventsCollection: CollectionConfig = {
  slug: 'chatbot-events',
  labels: { singular: 'Chatbot Event', plural: 'Chatbot Events' },
  admin: {
    useAsTitle: 'nodeLabel',
    defaultColumns: ['eventType', 'nodeLabel', 'page', 'createdAt'],
    group: 'Chatbot',
    description: 'Analytics — tracks widget opens, node clicks, WhatsApp taps, and lead submissions',
  },
  access: {
    read: ({ req }) => (req.user as any)?.role === 'admin',
    create: () => true,
    update: () => false,
    delete: ({ req }) => (req.user as any)?.role === 'admin',
  },
  fields: [
    {
      name: 'eventType',
      type: 'select',
      required: true,
      label: 'Event Type',
      options: [
        { label: 'Widget Opened',       value: 'widget_opened' },
        { label: 'Node Selected',       value: 'node_selected' },
        { label: 'Answer Viewed',       value: 'answer_viewed' },
        { label: 'WhatsApp Clicked',    value: 'whatsapp_clicked' },
        { label: 'Contact Form Shown',  value: 'contact_form_shown' },
        { label: 'Lead Submitted',      value: 'lead_submitted' },
        { label: 'Widget Closed',       value: 'widget_closed' },
        { label: 'Back Navigated',      value: 'back_navigated' },
      ],
    },
    {
      name: 'nodeLabel',
      type: 'text',
      label: 'Node Label',
    },
    {
      name: 'conversationPath',
      type: 'text',
      label: 'Conversation Path',
      admin: { description: 'Breadcrumb of nodes clicked, e.g. "Services > Web Dev > Cost"' },
    },
    {
      name: 'page',
      type: 'text',
      label: 'Page URL',
    },
    {
      name: 'sessionId',
      type: 'text',
      label: 'Session ID',
      admin: { description: 'Anonymous session ID from localStorage' },
    },
  ],
  timestamps: true,
}

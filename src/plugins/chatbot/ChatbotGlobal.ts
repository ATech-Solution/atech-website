import type { GlobalConfig, Field } from 'payload'

// ── Node field builder ────────────────────────────────────────────────────────
// Two levels of nesting supported in the admin UI:
//   nodes[] → children[]
// SQLite/Drizzle requires uniquely named relation fields across nested arrays,
// so depth-2 children are named "subChildren" to avoid a collision.
const nodeBaseFields: Field[] = [
  {
    name: 'label',
    type: 'text',
    required: true,
    label: 'Button Label',
    admin: { description: 'Text shown to user as a clickable option' },
  },
  {
    name: 'answer',
    type: 'textarea',
    label: 'Answer',
    admin: {
      description: 'Bot reply when user picks this option. Leave empty if using sub-questions.',
      rows: 4,
    },
  },
  {
    name: 'showContactForm',
    type: 'checkbox',
    label: 'Show contact form after answer',
    defaultValue: false,
    admin: {
      description: 'Shows name + email form 3 seconds after answer is displayed',
    },
  },
  {
    name: 'showWhatsapp',
    type: 'checkbox',
    label: 'Show WhatsApp button',
    defaultValue: true,
  },
  {
    name: 'whatsappUrl',
    type: 'text',
    label: 'WhatsApp URL override',
    admin: { description: 'Leave empty to use the global default WhatsApp URL' },
  },
]

// Depth-2 fields (inside children): same as base but named "subChildren" for sub-sub-questions
const depth2Fields: Field[] = [
  ...nodeBaseFields,
  {
    name: 'subChildren',
    type: 'array',
    label: 'Nested sub-questions (level 3)',
    admin: { description: 'Optional further follow-up questions' },
    fields: nodeBaseFields,
  },
]

// Root node fields: base + children array using depth-2 fields
const rootNodeFields: Field[] = [
  ...nodeBaseFields,
  {
    name: 'children',
    type: 'array',
    label: 'Sub-questions',
    admin: { description: 'Optional follow-up questions shown after this option is selected' },
    fields: depth2Fields,
  },
]

export const ChatbotGlobal: GlobalConfig = {
  slug: 'chatbot-settings',
  label: 'Chatbot Settings',
  admin: {
    group: 'System',
    description: 'Configure the chatbot widget — greeting, Q&A tree, WhatsApp, visibility',
  },
  access: {
    read: () => true,
    update: ({ req }) => (req.user as any)?.role === 'admin',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ── General ──────────────────────────────────────────────────────────
        {
          label: 'General',
          fields: [
            {
              name: 'active',
              type: 'checkbox',
              label: 'Widget Active',
              defaultValue: true,
              admin: { description: 'Toggle to show/hide the chatbot widget on the frontend' },
            },
            {
              name: 'botName',
              type: 'text',
              label: 'Bot Name',
              defaultValue: 'ATech Assistant',
            },
            {
              name: 'greetingMessage',
              type: 'textarea',
              label: 'Greeting Message',
              defaultValue:
                'Hello, what can I help you with? Please enter a number of the following options:',
            },
            {
              name: 'defaultWhatsappUrl',
              type: 'text',
              label: 'Default WhatsApp URL',
              defaultValue: 'https://wa.me/85297496042',
              admin: { description: 'Fallback used when a node has no WhatsApp URL override' },
            },
            {
              name: 'contactFormTitle',
              type: 'text',
              label: 'Contact Form Title',
              defaultValue:
                'Please leave your name and email. Our team will contact you shortly.',
            },
            {
              name: 'notifyEmail',
              type: 'text',
              label: 'Lead Notification Email',
              admin: {
                description:
                  'Email address to notify when a contact form is submitted. Leave empty to disable.',
              },
            },
          ],
        },

        // ── Q&A Tree ─────────────────────────────────────────────────────────
        {
          label: 'Q&A Tree',
          fields: [
            {
              name: 'nodes',
              type: 'array',
              label: 'Questions & Answers',
              admin: {
                description:
                  'Root-level options shown after the greeting. Each option can have sub-questions (3 levels deep via admin; unlimited depth is supported programmatically).',
              },
              fields: rootNodeFields,
            },
          ],
        },

        // ── Visibility ───────────────────────────────────────────────────────
        {
          label: 'Visibility',
          fields: [
            {
              name: 'showOnAllPages',
              type: 'checkbox',
              label: 'Show on All Pages',
              defaultValue: true,
              admin: {
                description:
                  'When enabled, widget appears on every frontend page. Disable to use the whitelist.',
              },
            },
            {
              name: 'pageWhitelist',
              type: 'array',
              label: 'Page Whitelist',
              admin: {
                description:
                  'Only active when "Show on All Pages" is off. Use exact paths, e.g. "/" for home, "/contact".',
                condition: (data) => !data?.showOnAllPages,
              },
              fields: [
                {
                  name: 'path',
                  type: 'text',
                  required: true,
                  label: 'Page Path (e.g. /contact)',
                },
              ],
            },
          ],
        },

        // ── Availability ─────────────────────────────────────────────────────
        {
          label: 'Availability',
          fields: [
            {
              name: 'availabilityEnabled',
              type: 'checkbox',
              label: 'Enable Availability Hours',
              defaultValue: false,
              admin: {
                description: 'Show an offline message outside of business hours (HKT timezone)',
              },
            },
            {
              name: 'availabilityStart',
              type: 'number',
              label: 'Business hours start (24h HKT)',
              defaultValue: 9,
              admin: { condition: (data) => data?.availabilityEnabled },
            },
            {
              name: 'availabilityEnd',
              type: 'number',
              label: 'Business hours end (24h HKT)',
              defaultValue: 17,
              admin: { condition: (data) => data?.availabilityEnabled },
            },
            {
              name: 'availabilityMessage',
              type: 'text',
              label: 'Offline Message',
              defaultValue:
                "We're currently offline (Mon–Fri, 9am–5pm HKT). Leave a message or reach us on WhatsApp.",
              admin: { condition: (data) => data?.availabilityEnabled },
            },
          ],
        },
      ],
    },
  ],
}

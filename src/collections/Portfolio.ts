import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildSeoFields } from '@/plugins/seo/fields'

export const Portfolio: CollectionConfig = {
  slug: 'portfolio',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'client', 'year', 'updatedAt'],
    livePreview: {
      url: ({ data }) =>
        `${process.env.PAYLOAD_PUBLIC_SERVER_URL ?? process.env.NEXT_PUBLIC_DOMAIN ?? 'http://localhost:3000'}/portfolio/${data?.slug ?? ''}`,
    },
  },
  access: {
    read: async ({ req }) => {
      if (!req.user) return { status: { equals: 'published' } }
      if (req.user.role === 'admin') return true
      return { status: { equals: 'published' } }
    },
    create: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  versions: {
    maxPerDoc: 20,
  },
  fields: [
    // ── Core identity ──────────────────────────────────────────────────────
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Project Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        description: 'URL-friendly identifier, e.g. "payflow-banking"',
        components: {
          Field: '@/components/admin/SlugField#SlugField',
        },
        custom: {
          watchField: 'title',
          urlPrefix: '/portfolio/',
        },
      },
    },

    // ── Media ─────────────────────────────────────────────────────────────
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Featured Image',
    },

    // ── Taxonomy ─────────────────────────────────────────────────────────
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'portfolio-categories',
      hasMany: true,
      label: 'Portfolio Categories',
      admin: {
        description: 'Select one or more categories. The first category becomes the primary tag on grid cards.',
      },
    },

    // ── Summary ───────────────────────────────────────────────────────────
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      label: 'Short Description',
      admin: {
        description: 'Brief summary shown on portfolio grid cards (1–2 sentences).',
      },
    },

    // ── Detail page content ────────────────────────────────────────────────
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({}),
      localized: true,
      label: 'Project Overview Content',
      admin: {
        description: 'Full project overview shown on the portfolio detail page (left column).',
      },
    },

    // ── Key Metrics sidebar ────────────────────────────────────────────────
    {
      name: 'keyMetrics',
      type: 'array',
      label: 'Key Metrics',
      admin: {
        description: 'Stats shown in the sidebar on portfolio detail pages (e.g. "500K+ Active Users").',
      },
      fields: [
        { name: 'metricValue', type: 'text', label: 'Value (e.g. "500K+")' },
        { name: 'metricLabel', type: 'text', label: 'Label (e.g. "Active Users")' },
      ],
    },

    // ── Project details ────────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'client',
          type: 'text',
          label: 'Client Name',
        },
        {
          name: 'duration',
          type: 'text',
          label: 'Duration',
          admin: { placeholder: 'e.g. 6 months' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'year',
          type: 'text',
          label: 'Year',
          admin: { placeholder: 'e.g. 2024' },
        },
        {
          name: 'teamSize',
          type: 'text',
          label: 'Team Size',
          admin: { placeholder: 'e.g. 8 people' },
        },
      ],
    },

    // ── Tabs ──────────────────────────────────────────────────────────────
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Publishing',
          fields: [
            {
              name: 'publishedAt',
              type: 'date',
              label: 'Publish Date',
              admin: { date: { pickerAppearance: 'dayAndTime' } },
            },
            {
              name: 'status',
              type: 'select',
              options: [
                { label: 'Draft',     value: 'draft' },
                { label: 'Published', value: 'published' },
              ],
              defaultValue: 'draft',
              required: true,
              label: 'Status',
            },
          ],
        },
        {
          label: 'Related',
          fields: [
            {
              name: 'relatedProjects',
              type: 'relationship',
              relationTo: 'portfolio',
              hasMany: true,
              label: 'Related Projects',
            },
          ],
        },
      ],
    },
    buildSeoFields('portfolio'),
    {
      name: 'translatePanel',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/admin/TranslateDocButton#TranslateDocButton',
        },
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }
        return data
      },
    ],
  },
}

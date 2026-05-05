import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { getPageTemplateOptions } from '@/lib/page-templates'
import { settingsAccess } from '@/lib/access'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
  },
  access: {
    // Public visitors can read published pages; authenticated users are controlled by Settings
    read: async ({ req }) => {
      if (!req.user) return { status: { equals: 'published' } }
      if (req.user.role === 'admin') return true
      return settingsAccess('pages', 'read')({ req })
    },
    create: settingsAccess('pages', 'create'),
    update: settingsAccess('pages', 'update'),
    delete: settingsAccess('pages', 'delete'),
  },
  // ── Versioning ─────────────────────────────────────────────────────────────
  versions: {
    maxPerDoc: 10,
  },
  fields: [
    // ── Tabs ────────────────────────────────────────────────────────────────
    {
      type: 'tabs',
      tabs: [
        // ── Tab 1: Content ─────────────────────────────────────────────────
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: true,
              label: 'Page Title',
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              label: 'Slug',
              admin: {
                description: 'URL-friendly identifier. Use "home" for the root page.',
                components: {
                  Field: '@/components/admin/SlugField#SlugField',
                },
                custom: {
                  watchField: 'title',
                  urlPrefix: '/',
                },
              },
            },
            {
              name: 'excerpt',
              type: 'textarea',
              localized: true,
              label: 'Excerpt',
              admin: {
                description: 'Short description shown in search results and SEO.',
              },
            },
            // Visual Layout Builder (primary, plugin-powered)
            {
              name: 'layoutBuilder',
              type: 'json',
              label: 'Layout Builder',
              defaultValue: [],
              admin: {
                description: 'Visual drag-and-drop page builder. Activate the Layout Builder plugin in Plugins to use.',
                components: {
                  Field: '@/components/LayoutBuilder/LayoutBuilderField#LayoutBuilderField',
                },
              },
            },
            // Classic Blocks (fallback when Layout Builder is empty)
            {
              name: 'layout',
              type: 'blocks',
              label: 'Classic Blocks (fallback)',
              admin: {
                description: 'Classic block editor — visible when Layout Builder has no blocks. Useful for simple pages.',
                condition: (data) => {
                  const lb = data?.layoutBuilder
                  return !Array.isArray(lb) || lb.length === 0
                },
              },
              blocks: [
                // ── Hero ────────────────────────────────────────────────────
                {
                  slug: 'hero',
                  labels: { singular: 'Hero', plural: 'Heroes' },
                  fields: [
                    { name: 'heading',    type: 'text',     localized: true },
                    { name: 'subheading', type: 'textarea', localized: true },
                    { name: 'image',      type: 'upload',   relationTo: 'media' },
                    { name: 'ctaLabel',   type: 'text',     label: 'Button Label' },
                    { name: 'ctaUrl',     type: 'text',     label: 'Button URL' },
                  ],
                },
                // ── Rich Text ────────────────────────────────────────────────
                {
                  slug: 'richText',
                  labels: { singular: 'Rich Text', plural: 'Rich Text Blocks' },
                  fields: [
                    {
                      name: 'content',
                      type: 'richText',
                      editor: lexicalEditor({}),
                      localized: true,
                    },
                  ],
                },
                // ── Media ────────────────────────────────────────────────────
                {
                  slug: 'mediaBlock',
                  labels: { singular: 'Media', plural: 'Media Blocks' },
                  fields: [
                    { name: 'media',   type: 'upload',  relationTo: 'media' },
                    { name: 'caption', type: 'text',    localized: true },
                  ],
                },
                // ── CTA ──────────────────────────────────────────────────────
                {
                  slug: 'cta',
                  labels: { singular: 'Call To Action', plural: 'Call To Actions' },
                  fields: [
                    { name: 'heading', type: 'text',     localized: true },
                    { name: 'body',    type: 'textarea', localized: true },
                    { name: 'label',   type: 'text',     label: 'Button Label' },
                    { name: 'url',     type: 'text',     label: 'Button URL' },
                  ],
                },
                // ── Cards Grid ────────────────────────────────────────────────
                {
                  slug: 'cardsGrid',
                  labels: { singular: 'Cards Grid', plural: 'Cards Grids' },
                  fields: [
                    { name: 'heading',    type: 'text',     localized: true },
                    { name: 'subheading', type: 'textarea', localized: true },
                    {
                      name: 'cards',
                      type: 'array',
                      label: 'Cards',
                      fields: [
                        { name: 'image',   type: 'upload',   relationTo: 'media' },
                        { name: 'heading', type: 'text',      localized: true, required: true },
                        { name: 'body',    type: 'textarea',  localized: true },
                        { name: 'label',   type: 'text',      label: 'Link Label' },
                        { name: 'url',     type: 'text',      label: 'Link URL' },
                      ],
                    },
                  ],
                },
                // ── Testimonials ──────────────────────────────────────────────
                {
                  slug: 'testimonials',
                  labels: { singular: 'Testimonials', plural: 'Testimonials' },
                  fields: [
                    { name: 'heading', type: 'text', localized: true },
                    {
                      name: 'items',
                      type: 'array',
                      label: 'Testimonials',
                      fields: [
                        { name: 'quote',  type: 'textarea', localized: true, required: true },
                        { name: 'author', type: 'text',     required: true },
                        { name: 'role',   type: 'text',     label: 'Role / Company' },
                        { name: 'avatar', type: 'upload',   relationTo: 'media' },
                      ],
                    },
                  ],
                },
                // ── Stats ─────────────────────────────────────────────────────
                {
                  slug: 'stats',
                  labels: { singular: 'Stats', plural: 'Stats' },
                  fields: [
                    { name: 'heading', type: 'text', localized: true },
                    {
                      name: 'items',
                      type: 'array',
                      label: 'Stats',
                      fields: [
                        { name: 'number', type: 'text', required: true, label: 'Number (e.g. "10k+")' },
                        { name: 'label',  type: 'text', required: true, localized: true },
                      ],
                    },
                  ],
                },
                // ── FAQ ───────────────────────────────────────────────────────
                {
                  slug: 'faq',
                  labels: { singular: 'FAQ', plural: 'FAQs' },
                  fields: [
                    { name: 'heading', type: 'text', localized: true },
                    {
                      name: 'items',
                      type: 'array',
                      label: 'Questions',
                      fields: [
                        { name: 'question', type: 'text',     required: true, localized: true },
                        { name: 'answer',   type: 'textarea', required: true, localized: true },
                      ],
                    },
                  ],
                },
                // ── Video ─────────────────────────────────────────────────────
                {
                  slug: 'video',
                  labels: { singular: 'Video', plural: 'Videos' },
                  fields: [
                    { name: 'url',     type: 'text',   required: true, label: 'YouTube or Vimeo URL' },
                    { name: 'caption', type: 'text',   localized: true },
                    { name: 'poster',  type: 'upload', relationTo: 'media', label: 'Poster Image' },
                  ],
                },
                // ── Form ──────────────────────────────────────────────────────
                {
                  slug: 'formBlock',
                  labels: { singular: 'Form', plural: 'Forms' },
                  fields: [
                    { name: 'heading',    type: 'text',     localized: true },
                    { name: 'subheading', type: 'textarea', localized: true },
                    {
                      name: 'form',
                      type: 'relationship',
                      relationTo: 'forms' as any,
                      required: true,
                      label: 'Select Form',
                    },
                  ],
                },
                // ── Banner ────────────────────────────────────────────────────
                {
                  slug: 'banner',
                  labels: { singular: 'Banner', plural: 'Banners' },
                  fields: [
                    { name: 'message', type: 'text', required: true, localized: true },
                    {
                      name: 'type',
                      type: 'select',
                      defaultValue: 'info',
                      options: [
                        { label: 'Info',    value: 'info' },
                        { label: 'Success', value: 'success' },
                        { label: 'Warning', value: 'warning' },
                        { label: 'Error',   value: 'error' },
                      ],
                    },
                    { name: 'dismissible', type: 'checkbox', defaultValue: true },
                  ],
                },
                // ── Code Block ────────────────────────────────────────────────
                {
                  slug: 'code',
                  labels: { singular: 'Code Block', plural: 'Code Blocks' },
                  fields: [
                    {
                      name: 'language',
                      type: 'select',
                      defaultValue: 'typescript',
                      options: [
                        { label: 'TypeScript', value: 'typescript' },
                        { label: 'JavaScript', value: 'javascript' },
                        { label: 'Bash',       value: 'bash' },
                        { label: 'JSON',       value: 'json' },
                        { label: 'CSS',        value: 'css' },
                        { label: 'HTML',       value: 'html' },
                        { label: 'Python',     value: 'python' },
                        { label: 'SQL',        value: 'sql' },
                      ],
                    },
                    { name: 'code',    type: 'textarea', required: true },
                    { name: 'caption', type: 'text',  localized: true },
                  ],
                },
              ],
            },
          ],
        },

        // ── Tab 2: Publishing ──────────────────────────────────────────────
        {
          label: 'Publishing',
          fields: [
            {
              name: 'publishedAt',
              type: 'date',
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
            },
          ],
        },
      ],
    },
    // ── Sidebar: Page Template ───────────────────────────────────────────────
    {
      name: 'pageTemplate',
      type: 'select',
      label: 'Page Template',
      admin: {
        position: 'sidebar',
        description: 'Frontend template that renders this page.',
      },
      options: getPageTemplateOptions(),
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

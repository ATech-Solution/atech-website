import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { settingsAccess } from '@/lib/access'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt', 'updatedAt'],
    livePreview: {
      url: ({ data }) =>
        `${process.env.PAYLOAD_PUBLIC_SERVER_URL ?? process.env.NEXT_PUBLIC_DOMAIN ?? 'http://localhost:3000'}/posts/${data?.slug ?? ''}`,
    },
  },
  access: {
    read: async ({ req }) => {
      if (!req.user) return { status: { equals: 'published' } }
      if (req.user.role === 'admin') return true
      return settingsAccess('posts', 'read')({ req })
    },
    create: settingsAccess('posts', 'create'),
    update: settingsAccess('posts', 'update'),
    delete: settingsAccess('posts', 'delete'),
  },
  // ── Versioning (history only — publish control via `status` field) ─────────
  versions: {
    maxPerDoc: 20,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      // ── Localization ──────────────────────────────────────────────────
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        description: 'URL-friendly identifier, e.g. "my-first-post"',
        components: {
          Field: '@/components/admin/SlugField#SlugField',
        },
        custom: {
          watchField: 'title',
          urlPrefix: '/posts/',
        },
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      label: 'Author',
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      label: 'Categories',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Featured Image',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      label: 'Excerpt',
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({}),
      localized: true,
      label: 'Content',
    },
    // ── Tabs — group fields into tabs in admin UI ─────────────────────
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
              admin: {
                date: { pickerAppearance: 'dayAndTime' },
              },
            },
            {
              name: 'status',
              type: 'select',
              options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Published', value: 'published' },
              ],
              defaultValue: 'draft',
              required: true,
              label: 'Status',
            },
          ],
        },
        {
          label: 'Relations',
          fields: [
            {
              name: 'relatedPosts',
              type: 'relationship',
              relationTo: 'posts',
              hasMany: true,
              label: 'Related Posts',
            },
          ],
        },
      ],
    },
  ],
  // ── Hooks ─────────────────────────────────────────────────────────────
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Auto-set publishedAt on first publish
        if (operation === 'create' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }
        return data
      },
    ],
    afterChange: [
      ({ doc, operation }) => {
        console.log(`[Hook] Post ${operation}: "${doc.title}"`)
      },
    ],
  },
}

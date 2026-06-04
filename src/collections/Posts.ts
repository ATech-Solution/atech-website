import type { CollectionConfig, PayloadRequest } from 'payload'
import { settingsAccess } from '@/lib/access'
import { buildSeoFields } from '@/plugins/seo/fields'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt', 'updatedAt'],
    livePreview: {
      url: ({ data }) =>
        `${process.env.PAYLOAD_PUBLIC_SERVER_URL ?? process.env.NEXT_PUBLIC_DOMAIN ?? 'http://localhost:3000'}/article/${data?.slug ?? ''}`,
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
  // ── Custom endpoints ───────────────────────────────────────────────────────
  endpoints: [
    // Payload v3 dropped /:id/versions — admin UI still calls it in some builds.
    // Proxy to /versions?where[parent][equals]=:id so it returns the correct data.
    {
      method: 'get',
      path: '/:id/versions',
      handler: async (req: PayloadRequest) => {
        const id = req.routeParams?.id as string
        const searchParams = new URL(req.url).searchParams
        searchParams.set('where[parent][equals]', id)
        const versionsUrl = new URL(
          `/api/posts/versions?${searchParams.toString()}`,
          req.payload.config.serverURL || 'http://localhost:3000',
        )
        return fetch(versionsUrl.toString(), {
          headers: { Authorization: req.headers.get('Authorization') ?? '' },
        })
      },
    },
  ],
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
          urlPrefix: '/article/',
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
      label: 'Short Description',
      admin: {
        description: 'A brief summary shown on article cards and grid listings (2–3 sentences).',
      },
    },
    {
      name: 'content',
      type: 'richText',
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
            {
              name: 'featured',
              type: 'checkbox',
              label: 'Featured Article',
              defaultValue: false,
              admin: {
                description:
                  'Mark this post as featured. The Article Feature block (in Collection mode) shows the featured post for the active category filter.',
              },
            },
          ],
        },
      ],
    },
    buildSeoFields('posts'),
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

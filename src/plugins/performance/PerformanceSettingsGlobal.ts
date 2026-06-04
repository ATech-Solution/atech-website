import type { GlobalConfig } from 'payload'

export const PerformanceSettingsGlobal: GlobalConfig = {
  slug: 'performance-settings',
  label: 'Performance',
  admin: {
    group: 'System',
    description: 'Full-stack performance optimization. All toggles take effect immediately on save.',
  },
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
  },
  hooks: {
    afterChange: [
      async () => {
        try {
          const { revalidateTag } = await import('next/cache')
          revalidateTag('perf-settings')
        } catch {
          // Ignore in non-Next.js contexts
        }
      },
    ],
  },
  fields: [
    // ── Master toggle ────────────────────────────────────────────────────────
    {
      name: 'pluginEnabled',
      type: 'checkbox',
      label: 'Plugin Enabled',
      defaultValue: true,
      admin: {
        description: 'Master switch. Disabling this no-ops all runtime features instantly.',
      },
    },

    // ── 1. Image Optimization ─────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Image Optimization',
      admin: {
        initCollapsed: false,
        condition: (data) => !!data.pluginEnabled,
      },
      fields: [
        {
          name: 'imageOptimizationEnabled',
          type: 'checkbox',
          label: 'Enable Next.js Image Optimization',
          defaultValue: true,
          admin: {
            description: 'Removes unoptimized: true in production. Requires sharp. Apply via withPerformance in next.config.ts.',
          },
        },
        {
          name: 'imageFormats',
          type: 'select',
          label: 'Output Formats',
          hasMany: true,
          defaultValue: ['webp'],
          options: [
            { label: 'WebP', value: 'webp' },
            { label: 'AVIF', value: 'avif' },
          ],
          admin: {
            condition: (data) => !!data.imageOptimizationEnabled,
            description: 'Formats Next.js will generate. AVIF gives better compression but slower encoding. Changes take effect only after a server restart.',
          },
        },
        {
          name: 'imageDeviceSizes',
          type: 'text',
          label: 'Device Sizes (px, comma-separated)',
          defaultValue: '360,640,750,828,1080,1200,1920',
          validate: (value: string | null | undefined) => {
            if (!value) return true
            const valid = /^\d+(,\s*\d+)*$/.test(value.trim())
            return valid || 'Must be comma-separated integers, e.g. 360,640,1200'
          },
          admin: {
            condition: (data) => !!data.imageOptimizationEnabled,
            description: 'Breakpoints used when generating responsive image srcsets. Changes take effect only after a server restart.',
          },
        },
      ],
    },

    // ── 2. HTML Cache Headers ─────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'HTML Cache Headers',
      admin: {
        initCollapsed: false,
        condition: (data) => !!data.pluginEnabled,
      },
      fields: [
        {
          name: 'cacheHeadersEnabled',
          type: 'checkbox',
          label: 'Enable Smart Cache Headers',
          defaultValue: true,
          admin: {
            description: 'Replaces no-store with no-cache + s-maxage for proxy caching. Applied via withPerformance at server start — changes take effect after restart.',
          },
        },
        {
          name: 'htmlCacheTtl',
          type: 'number',
          label: 'HTML Cache TTL (seconds)',
          defaultValue: 60,
          min: 1,
          admin: {
            condition: (data) => !!data.cacheHeadersEnabled,
            description: 's-maxage value. nginx/CDN serves cached HTML for this many seconds. Changes take effect after server restart.',
          },
        },
        {
          name: 'staleWhileRevalidate',
          type: 'number',
          label: 'Stale-While-Revalidate (seconds)',
          defaultValue: 600,
          min: 1,
          admin: {
            condition: (data) => !!data.cacheHeadersEnabled,
            description: 'How long the proxy serves stale content while fetching fresh. Changes take effect after server restart.',
          },
        },
      ],
    },

    // ── 3. Streaming SSR ──────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Streaming SSR (SuspenseSection)',
      admin: {
        initCollapsed: false,
        condition: (data) => !!data.pluginEnabled,
      },
      fields: [
        {
          name: 'streamingEnabled',
          type: 'checkbox',
          label: 'Enable Streaming SSR',
          defaultValue: true,
          admin: {
            description: 'Wraps data-heavy blocks in <Suspense> for streaming HTML delivery.',
          },
        },
        {
          name: 'skeletonRows',
          type: 'number',
          label: 'Skeleton Rows',
          defaultValue: 3,
          min: 1,
          admin: {
            condition: (data) => !!data.streamingEnabled,
            description: 'Number of animated grey bars shown while a streamed block loads.',
          },
        },
      ],
    },

    // ── 4. Payload Query Cache ────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Payload Query Cache',
      admin: {
        initCollapsed: false,
        condition: (data) => !!data.pluginEnabled,
      },
      fields: [
        {
          name: 'queryCacheEnabled',
          type: 'checkbox',
          label: 'Enable Query Caching',
          defaultValue: true,
          admin: {
            description: 'Caches page/navigation Payload queries across requests using unstable_cache. Changes take effect after server restart.',
          },
        },
        {
          name: 'queryCacheTtl',
          type: 'number',
          label: 'Query Cache TTL (seconds)',
          defaultValue: 60,
          min: 1,
          admin: {
            condition: (data) => !!data.queryCacheEnabled,
            description: 'How long page queries are cached before Payload is re-queried. Changes take effect after server restart.',
          },
        },
        {
          name: 'queryCacheTags',
          type: 'text',
          label: 'Cache Tag Prefix',
          defaultValue: 'perf',
          admin: {
            condition: (data) => !!data.queryCacheEnabled,
            description: 'Prefix for cache tags. Used with revalidateTag() for instant invalidation on content save.',
          },
        },
      ],
    },

    // ── 5. SQLite Indexes ─────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'SQLite Auto-Indexing',
      admin: {
        initCollapsed: true,
        condition: (data) => !!data.pluginEnabled,
      },
      fields: [
        {
          name: 'sqliteIndexesEnabled',
          type: 'checkbox',
          label: 'Enable SQLite Auto-Indexing',
          defaultValue: true,
          admin: {
            description: 'Adds index: true to slug fields of configured collections. Requires server restart and schema sync to take effect.',
          },
        },
        {
          name: 'indexedCollections',
          type: 'array',
          label: 'Indexed Collections',
          defaultValue: [
            { slug: 'pages' },
            { slug: 'posts' },
            { slug: 'portfolio' },
            { slug: 'media' },
            { slug: 'categories' },
          ],
          admin: {
            condition: (data) => !!data.sqliteIndexesEnabled,
            description: 'Collection slugs that receive auto-indexes.',
          },
          fields: [
            {
              name: 'slug',
              type: 'text',
              label: 'Collection Slug',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}

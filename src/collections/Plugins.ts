import type { CollectionConfig } from 'payload'

export const Plugins: CollectionConfig = {
  slug: 'plugins',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'pluginType', 'status', 'version', 'updatedAt'],
    group: 'System',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    // ── Identity ─────────────────────────────────────────────────────────────
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Plugin Name',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        description: 'Unique identifier. Built-in plugins use reserved slugs (e.g. "layout-builder").',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    // ── Type & Category ───────────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'pluginType',
          type: 'select',
          label: 'Plugin Type',
          defaultValue: 'utility',
          options: [
            { label: 'Built-in',           value: 'built-in' },
            { label: 'Frontend Script',    value: 'frontend-script' },
            { label: 'Block Extension',    value: 'block-extension' },
            { label: 'Third-party Embed',  value: 'third-party-embed' },
            { label: 'Integration',        value: 'integration' },
            { label: 'Utility',            value: 'utility' },
          ],
        },
        {
          name: 'category',
          type: 'select',
          label: 'Category',
          defaultValue: 'utility',
          options: [
            { label: 'Layout',      value: 'layout' },
            { label: 'Content',     value: 'content' },
            { label: 'Media',       value: 'media' },
            { label: 'Analytics',   value: 'analytics' },
            { label: 'SEO',         value: 'seo' },
            { label: 'Ecommerce',   value: 'ecommerce' },
            { label: 'Utility',     value: 'utility' },
          ],
        },
      ],
    },
    // ── Status & Version ──────────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'status',
          type: 'select',
          label: 'Status',
          defaultValue: 'inactive',
          required: true,
          options: [
            { label: 'Active',   value: 'active' },
            { label: 'Inactive', value: 'inactive' },
          ],
        },
        {
          name: 'version',
          type: 'text',
          label: 'Version',
        },
        {
          name: 'author',
          type: 'text',
          label: 'Author',
        },
      ],
    },
    // ── Icon ──────────────────────────────────────────────────────────────────
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      label: 'Plugin Icon',
    },
    // ── Script / Embed Code ───────────────────────────────────────────────────
    {
      name: 'scriptCode',
      type: 'textarea',
      label: 'Script / Embed Code',
      admin: {
        description: 'Inline HTML/JS code to inject into the frontend (for frontend-script and third-party-embed types).',
        condition: (data) =>
          data.pluginType === 'frontend-script' || data.pluginType === 'third-party-embed',
      },
    },
    // ── Plugin File Upload ────────────────────────────────────────────────────
    {
      name: 'pluginFile',
      type: 'upload',
      relationTo: 'media',
      label: 'Plugin File',
      admin: {
        description: 'Upload a plugin file (.zip, .js, .ts) for block-extension plugins.',
        condition: (data) => data.pluginType === 'block-extension',
      },
    },
    // ── Settings JSON ─────────────────────────────────────────────────────────
    {
      name: 'settings',
      type: 'json',
      label: 'Settings',
      admin: {
        description: 'Plugin-specific configuration as key-value pairs.',
      },
    },
    // ── Features (built-in plugins declare what they provide) ─────────────────
    {
      name: 'features',
      type: 'array',
      label: 'Included Features',
      admin: {
        description: 'Features provided by this plugin.',
      },
      fields: [
        {
          name: 'featureName',
          type: 'text',
          label: 'Feature Name',
          required: true,
        },
        {
          name: 'featureDescription',
          type: 'text',
          label: 'Description',
        },
        {
          name: 'featureType',
          type: 'select',
          label: 'Type',
          options: [
            { label: 'Collection', value: 'collection' },
            { label: 'Field',      value: 'field' },
            { label: 'Hook',       value: 'hook' },
            { label: 'Script',     value: 'script' },
          ],
        },
      ],
    },
    // ── Auto-activate ─────────────────────────────────────────────────────────
    {
      name: 'autoActivate',
      type: 'checkbox',
      label: 'Auto-activate on install',
      defaultValue: false,
    },
  ],
}

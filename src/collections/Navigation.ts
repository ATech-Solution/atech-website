import type { GlobalConfig } from 'payload'
// import { pruneVersionsHook } from '../utils/injectPruneButton'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
  },
  versions: {
    drafts: true,
    max: 3,
  },
  fields: [
    // ── Main Menu Items ──────────────────────────────────────────────────────
    {
      name: 'menuItems',
      type: 'array',
      label: 'Menu Items',
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        {
          name: 'url',
          type: 'text',
          label: 'URL (leave empty if using mega menu only)',
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          label: 'Open in New Tab',
          defaultValue: false,
        },
        // ── Mega Menu Toggle ───────────────────────────────────────────────
        {
          name: 'megaMenu',
          type: 'checkbox',
          label: 'Enable Mega Menu Dropdown',
          defaultValue: false,
        },
        // ── Mega Menu Style (shown when megaMenu = true) ───────────────────
        {
          name: 'megaMenuStyle',
          type: 'select',
          label: 'Mega Menu Style',
          defaultValue: 'with-description',
          options: [
            { label: 'With Short Description', value: 'with-description' },
            { label: 'Category Grid (column headers + icons)', value: 'category-grid' },
            { label: 'No Icon (plain text list)', value: 'no-icon' },
          ],
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.megaMenu),
            description: 'Visual layout for the mega menu dropdown.',
          },
        },
        // ── Mega Menu Columns (shown when megaMenu = true) ─────────────────
        {
          name: 'columns',
          type: 'array',
          label: 'Mega Menu Columns',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.megaMenu),
            description: 'Add columns of links that appear in the dropdown panel.',
          },
          fields: [
            {
              name: 'columnTitle',
              type: 'text',
              label: 'Column Heading',
              localized: true,
            },
            {
              name: 'links',
              type: 'array',
              label: 'Links',
              fields: [
                { name: 'label',       type: 'text', required: true, localized: true },
                { name: 'url',         type: 'text', required: true },
                {
                  name: 'description',
                  type: 'text',
                  label: 'Short description (optional)',
                  localized: true,
                },
                {
                  name: 'icon',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Icon Image (optional)',
                },
              ],
            },
          ],
        },
        // ── Featured Card (shown when megaMenu = true) ─────────────────────
        {
          name: 'featured',
          type: 'group',
          label: 'Featured Card (right side of mega menu)',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.megaMenu),
            description: 'Optional promotional card shown on the right side of the mega menu.',
          },
          fields: [
            { name: 'title',       type: 'text',   label: 'Card Title',        localized: true },
            { name: 'description', type: 'text',   label: 'Card Description',  localized: true },
            { name: 'url',         type: 'text',   label: 'Card Link URL' },
            { name: 'cta',         type: 'text',   label: 'CTA Button Label',  defaultValue: 'Learn More', localized: true },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Card Image',
            },
          ],
        },
      ],
    },
    // ── CTA Button ───────────────────────────────────────────────────────────
    {
      name: 'ctaLabel',
      type: 'text',
      label: 'Header CTA Button Label',
      defaultValue: 'Get a Quote',
      localized: true,
    },
    {
      name: 'ctaUrl',
      type: 'text',
      label: 'Header CTA Button URL',
      defaultValue: '/static/contact',
    },
    // ── Footer Columns ────────────────────────────────────────────────────────
    {
      name: 'footerColumns',
      type: 'array',
      label: 'Footer Link Columns',
      fields: [
        { name: 'heading', type: 'text', required: true, label: 'Column Heading', localized: true },
        {
          name: 'links',
          type: 'array',
          label: 'Links',
          fields: [
            { name: 'label', type: 'text', required: true, localized: true },
            { name: 'url',   type: 'text', required: true },
          ],
        },
      ],
    },
    // ── Footer Copyright Menu ─────────────────────────────────────────────────
    {
      name: 'footerCopyrightMenu',
      type: 'array',
      label: 'Footer Copyright Menu',
      admin: {
        description: 'Links shown in the footer bottom bar (e.g. Privacy Policy, Terms of Service).',
      },
      fields: [
        { name: 'label', type: 'text', required: true, label: 'Label', localized: true },
        { name: 'url',   type: 'text', required: true, label: 'URL'   },
      ],
    },
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
}

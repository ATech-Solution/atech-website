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
    {
      name: 'siteTitle',
      type: 'text',
      required: true,
      label: 'Site Title',
      defaultValue: 'ATech',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
    },
    // ── Main Menu Items ──────────────────────────────────────────────────────
    {
      name: 'menuItems',
      type: 'array',
      label: 'Menu Items',
      fields: [
        { name: 'label', type: 'text', required: true },
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
            },
            {
              name: 'links',
              type: 'array',
              label: 'Links',
              fields: [
                { name: 'label',       type: 'text', required: true },
                { name: 'url',         type: 'text', required: true },
                {
                  name: 'description',
                  type: 'text',
                  label: 'Short description (optional)',
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
            { name: 'title',       type: 'text',   label: 'Card Title' },
            { name: 'description', type: 'text',   label: 'Card Description' },
            { name: 'url',         type: 'text',   label: 'Card Link URL' },
            { name: 'cta',         type: 'text',   label: 'CTA Button Label', defaultValue: 'Learn More' },
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
    },
    {
      name: 'ctaUrl',
      type: 'text',
      label: 'Header CTA Button URL',
      defaultValue: '/static/contact',
    },
    // ── Footer ───────────────────────────────────────────────────────────────
    {
      name: 'footerText',
      type: 'text',
      label: 'Footer Copyright Text',
      defaultValue: '© 2026 ATech. All rights reserved.',
    },
    // ── Footer Columns ────────────────────────────────────────────────────────
    {
      name: 'footerColumns',
      type: 'array',
      label: 'Footer Link Columns',
      fields: [
        { name: 'heading', type: 'text', required: true, label: 'Column Heading' },
        {
          name: 'links',
          type: 'array',
          label: 'Links',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'url',   type: 'text', required: true },
          ],
        },
      ],
    },
  ],
}

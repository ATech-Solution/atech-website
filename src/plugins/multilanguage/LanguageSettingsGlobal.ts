import type { GlobalConfig } from 'payload'

export const LanguageSettingsGlobal: GlobalConfig = {
  slug: 'language-settings',
  label: 'Language Settings',
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
  },
  admin: {
    group: 'System',
    description: 'Configure multilanguage routing, switcher, and active locales.',
  },
  fields: [
    // ── Active Locales ────────────────────────────────────────────────────────
    {
      name: 'activeLocales',
      type: 'array',
      label: 'Active Locales',
      admin: {
        description:
          'Enable or disable specific locales. Adding a new locale here requires adding it to payload.config.ts first.',
      },
      defaultValue: [
        { code: 'en',    label: 'English',             enabled: true },
        { code: 'zh-hk', label: 'Traditional Chinese', enabled: true },
        { code: 'zh-cn', label: 'Simplified Chinese',  enabled: true },
        { code: 'id',    label: 'Indonesian',           enabled: true },
      ],
      fields: [
        {
          name: 'code',
          type: 'text',
          label: 'Locale Code',
          required: true,
          admin: { description: 'e.g. en, id, zh — must match a code in payload.config.ts localization.locales' },
        },
        {
          name: 'label',
          type: 'text',
          label: 'Display Label',
          required: true,
          admin: { description: 'e.g. English, Indonesian' },
        },
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Enabled',
          defaultValue: true,
        },
      ],
    },
    // ── Detection & Routing ───────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'defaultLocale',
          type: 'text',
          label: 'Default Locale',
          defaultValue: 'en',
          admin: {
            description: 'Locale used when none is detected. Must be in activeLocales.',
            width: '50%',
          },
        },
        {
          name: 'autoDetect',
          type: 'checkbox',
          label: 'Auto-detect from Browser',
          defaultValue: true,
          admin: {
            description:
              'Read Accept-Language header and redirect visitors to their preferred locale.',
            width: '50%',
          },
        },
      ],
    },
    // ── Switcher UI ───────────────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'showSwitcher',
          type: 'checkbox',
          label: 'Show Language Switcher',
          defaultValue: true,
          admin: {
            description: 'Display the locale toggle in the header.',
            width: '50%',
          },
        },
        {
          name: 'switcherPosition',
          type: 'select',
          label: 'Switcher Position',
          defaultValue: 'header',
          options: [
            { label: 'Header', value: 'header' },
            { label: 'Footer', value: 'footer' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    // ── SEO ───────────────────────────────────────────────────────────────────
    {
      name: 'hreflangEnabled',
      type: 'checkbox',
      label: 'Inject hreflang Tags',
      defaultValue: true,
      admin: {
        description:
          'Add <link rel="alternate" hreflang="..."> tags to every page for multilanguage SEO.',
      },
    },
  ],
}

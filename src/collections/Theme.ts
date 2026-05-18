import type { GlobalConfig } from 'payload'

export const Theme: GlobalConfig = {
  slug: 'theme',
  label: 'Site Theme',
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
  },
  versions: { max: 5 },
  hooks: {
    afterChange: [
      async () => {
        try {
          const { revalidateTag } = await import('next/cache')
          revalidateTag('theme')
        } catch {
          // not in Next.js context (e.g. CLI seed) — skip
        }
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ── BRANDING ─────────────────────────────────────────────────────────
        {
          label: 'Branding',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              defaultValue: 'ATech',
              label: 'Site Name',
            },
            {
              name: 'siteTagline',
              type: 'text',
              label: 'Site Tagline',
              admin: { placeholder: 'Engineering Tomorrow\'s Software' },
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo',
              admin: { description: 'Used in header and footer. Recommended: SVG or PNG, max 200×60px.' },
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              label: 'Favicon',
              admin: { description: 'Browser tab icon. Recommended: 32×32 or 64×64 PNG.' },
            },
          ],
        },

        // ── COLORS ───────────────────────────────────────────────────────────
        {
          label: 'Colors',
          fields: [
            // Color Scheme Preset selector
            {
              name: 'colorPreset',
              type: 'select',
              label: 'Color Scheme Preset',
              defaultValue: 'dark-default',
              options: [
                { label: '🌑 Dark Default',     value: 'dark-default'    },
                { label: '☀️ Light Default',    value: 'light-default'   },
                { label: '🌊 Ocean Blue',        value: 'ocean-blue'      },
                { label: '🌙 Midnight Navy',     value: 'midnight-navy'   },
                { label: '🌿 Forest Green',      value: 'forest-green'    },
                { label: '🏢 Corporate Light',   value: 'corporate-light' },
                { label: '🌅 Sunset Orange',     value: 'sunset-orange'   },
                { label: '🎨 Custom Colors',     value: 'custom'          },
              ],
              admin: {
                description: 'Pick a preset palette or choose "Custom Colors" to set individual values below.',
              },
            },

            // Preserve colorScheme for dark/light baseline when preset = custom
            {
              name: 'colorScheme',
              type: 'select',
              label: 'Base Scheme (when Custom is selected)',
              defaultValue: 'dark',
              options: [
                { label: 'Dark', value: 'dark'  },
                { label: 'Light', value: 'light' },
              ],
              admin: {
                description: 'Used as default baseline when "Custom Colors" is selected above.',
                condition: (data) => data.colorPreset === 'custom',
              },
            },

            // ── Custom color fields (shown only when preset = custom) ─────────
            {
              type: 'row',
              admin: {
                condition: (data) => data.colorPreset === 'custom',
              },
              fields: [
                {
                  name: 'primaryColor',
                  type: 'text',
                  label: 'Primary / Accent Color',
                  defaultValue: '#ffd369',
                  admin: {
                    placeholder: '#ffd369',
                    description: 'Buttons, links, highlights',
                    components: {
                      Field: '@/components/admin/ColorPickerField#ColorPickerField',
                    },
                  },
                },
                {
                  name: 'secondaryColor',
                  type: 'text',
                  label: 'Secondary Color',
                  defaultValue: '#ffb347',
                  admin: {
                    placeholder: '#ffb347',
                    description: 'Gradients, badges',
                    components: {
                      Field: '@/components/admin/ColorPickerField#ColorPickerField',
                    },
                  },
                },
              ],
            },
            {
              type: 'row',
              admin: {
                condition: (data) => data.colorPreset === 'custom',
              },
              fields: [
                {
                  name: 'bgColor',
                  type: 'text',
                  label: 'Page Background',
                  defaultValue: '#292929',
                  admin: {
                    placeholder: '#292929',
                    components: {
                      Field: '@/components/admin/ColorPickerField#ColorPickerField',
                    },
                  },
                },
                {
                  name: 'surfaceColor',
                  type: 'text',
                  label: 'Card / Surface Color',
                  defaultValue: '#2f2f2f',
                  admin: {
                    placeholder: '#2f2f2f',
                    components: {
                      Field: '@/components/admin/ColorPickerField#ColorPickerField',
                    },
                  },
                },
              ],
            },
            {
              type: 'row',
              admin: {
                condition: (data) => data.colorPreset === 'custom',
              },
              fields: [
                {
                  name: 'textColor',
                  type: 'text',
                  label: 'Body Text Color',
                  defaultValue: '#fafafa',
                  admin: {
                    placeholder: '#fafafa',
                    components: {
                      Field: '@/components/admin/ColorPickerField#ColorPickerField',
                    },
                  },
                },
                {
                  name: 'mutedColor',
                  type: 'text',
                  label: 'Muted Text Color',
                  defaultValue: '#525252',
                  admin: {
                    placeholder: '#525252',
                    components: {
                      Field: '@/components/admin/ColorPickerField#ColorPickerField',
                    },
                  },
                },
              ],
            },
            {
              type: 'row',
              admin: {
                condition: (data) => data.colorPreset === 'custom',
              },
              fields: [
                {
                  name: 'borderColor',
                  type: 'text',
                  label: 'Border Color',
                  defaultValue: '#383838',
                  admin: {
                    placeholder: '#383838',
                    components: {
                      Field: '@/components/admin/ColorPickerField#ColorPickerField',
                    },
                  },
                },
                {
                  name: 'testimonialsBg',
                  type: 'text',
                  label: 'Testimonials Section Background',
                  admin: {
                    placeholder: '#ffd369',
                    description: 'Background for the testimonials section',
                    components: {
                      Field: '@/components/admin/ColorPickerField#ColorPickerField',
                    },
                  },
                },
              ],
            },

            // ── Preset preview (shown when a preset is selected) ──────────────
            {
              name: 'presetPreviewNote',
              type: 'text',
              label: ' ',
              admin: {
                readOnly: true,
                description: 'A preset palette is active. Switch to "Custom Colors" above to edit individual values.',
                condition: (data) => !!data.colorPreset && data.colorPreset !== 'custom',
              },
            },
          ],
        },

        // ── TYPOGRAPHY ───────────────────────────────────────────────────────
        {
          label: 'Typography',
          fields: [
            {
              name: 'headingFont',
              type: 'select',
              label: 'Heading Font',
              defaultValue: 'syne',
              options: [
                { label: 'Syne (current)', value: 'syne' },
                { label: 'Raleway',        value: 'raleway' },
                { label: 'Poppins',        value: 'poppins' },
                { label: 'Playfair Display', value: 'playfair' },
                { label: 'Inter',          value: 'inter' },
              ],
            },
            {
              name: 'bodyFont',
              type: 'select',
              label: 'Body Font',
              defaultValue: 'dm-sans',
              options: [
                { label: 'DM Sans (current)', value: 'dm-sans' },
                { label: 'Inter',             value: 'inter' },
                { label: 'Source Sans 3',     value: 'source-sans' },
                { label: 'Nunito',            value: 'nunito' },
              ],
            },
          ],
        },

        // ── FOOTER ───────────────────────────────────────────────────────────
        {
          label: 'Footer',
          fields: [
            {
              name: 'footerDescription',
              type: 'textarea',
              label: 'Brand Description',
              localized: true,
              defaultValue: 'Engineering robust software solutions for startups and enterprises. Headquartered in Hong Kong.',
            },
            {
              name: 'footerCopyright',
              type: 'text',
              label: 'Copyright Text',
              defaultValue: 'ATech Solutions Limited. All rights reserved.',
            },
            // ── Get Started column ────────────────────────────────────────────
            {
              name: 'getStartedTitle',
              type: 'text',
              label: 'Get Started — Title',
              defaultValue: 'Get Started',
            },
            {
              name: 'getStartedDesc',
              type: 'textarea',
              label: 'Get Started — Description',
              defaultValue: 'Ready to transform your business with technology?',
            },
            {
              name: 'getStartedButtonLabel',
              type: 'text',
              label: 'Get Started — Button Label',
              defaultValue: 'Send us a Message',
            },
            {
              name: 'getStartedButtonUrl',
              type: 'text',
              label: 'Get Started — Button URL',
              defaultValue: '/static/contact',
            },
          ],
        },

        // ── CUSTOM CSS ───────────────────────────────────────────────────────
        {
          label: 'Custom CSS',
          fields: [
            {
              name: 'customCSS',
              type: 'textarea',
              label: 'Custom CSS',
              admin: {
                description: 'Raw CSS injected into <head> on every frontend page. Overrides any theme variables. Use sparingly.',
                placeholder: '/* Custom overrides */\n.my-section {\n  background: red;\n}',
              },
            },
          ],
        },
      ],
    },
  ],
}

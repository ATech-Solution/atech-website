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

        // ── HOMEPAGE ─────────────────────────────────────────────────────────
        {
          label: 'Homepage',
          fields: [
            // Hero
            {
              type: 'collapsible',
              label: 'Hero Section',
              fields: [
                {
                  name: 'heroBadge',
                  type: 'text',
                  label: 'Hero Badge Text',
                  localized: true,
                  defaultValue: 'Welcome to ATech Solutions',
                },
                {
                  name: 'heroHeading',
                  type: 'text',
                  label: 'Hero Heading',
                  localized: true,
                  defaultValue: 'Build Software That Scales Your Business Forward',
                },
                {
                  name: 'heroBody',
                  type: 'textarea',
                  label: 'Hero Body Text',
                  localized: true,
                  defaultValue: 'We build robust, scalable, and intelligent software solutions for startups and enterprises.',
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'heroCtaPrimaryLabel',
                      type: 'text',
                      label: 'Primary CTA Label',
                      defaultValue: 'Explore Services',
                    },
                    {
                      name: 'heroCtaPrimaryUrl',
                      type: 'text',
                      label: 'Primary CTA URL',
                      defaultValue: '/services',
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'heroCtaSecondaryLabel',
                      type: 'text',
                      label: 'Secondary CTA Label',
                      defaultValue: 'Client Testimonials',
                    },
                    {
                      name: 'heroCtaSecondaryUrl',
                      type: 'text',
                      label: 'Secondary CTA URL',
                      defaultValue: '/testimonials',
                    },
                  ],
                },
                {
                  name: 'heroImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Hero Image (right column)',
                  admin: { description: 'Used when heroLayout is set to "Image"' },
                },
                {
                  name: 'heroLayout',
                  type: 'select',
                  label: 'Right Column Layout',
                  defaultValue: 'services-grid',
                  options: [
                    { label: 'Services Grid', value: 'services-grid' },
                    { label: 'Code Editor',   value: 'code-editor' },
                    { label: 'Image',         value: 'image' },
                  ],
                },
              ],
            },

            // Stats
            {
              type: 'collapsible',
              label: 'Stats Bar',
              fields: [
                {
                  name: 'stats',
                  type: 'array',
                  label: 'Stats',
                  fields: [
                    { name: 'value', type: 'text', required: true, label: 'Value (e.g. "250+")' },
                    { name: 'label', type: 'text', required: true, label: 'Label', localized: true },
                  ],
                },
              ],
            },

            // About
            {
              type: 'collapsible',
              label: 'About Section',
              fields: [
                {
                  name: 'aboutHeading',
                  type: 'text',
                  label: 'Heading',
                  localized: true,
                  defaultValue: 'About ATech Solutions',
                },
                {
                  name: 'aboutDescription',
                  type: 'textarea',
                  label: 'Description',
                  localized: true,
                },
                {
                  name: 'aboutPillars',
                  type: 'array',
                  label: 'Pillars',
                  fields: [
                    {
                      name: 'icon',
                      type: 'select',
                      label: 'Icon',
                      options: [
                        { label: 'Lightbulb (Innovation)', value: 'lightbulb' },
                        { label: 'Star (Expertise)',       value: 'star' },
                        { label: 'Handshake (Partnership)', value: 'handshake' },
                        { label: 'Globe',                  value: 'globe' },
                        { label: 'Code',                   value: 'code' },
                        { label: 'Shield',                 value: 'shield' },
                      ],
                    },
                    { name: 'title',       type: 'text',     required: true, localized: true },
                    { name: 'description', type: 'textarea', localized: true },
                  ],
                },
              ],
            },

            // Services
            {
              type: 'collapsible',
              label: 'Services Section',
              fields: [
                {
                  name: 'servicesHeading',
                  type: 'text',
                  label: 'Heading',
                  localized: true,
                  defaultValue: 'Our Services',
                },
                {
                  name: 'servicesSubheading',
                  type: 'text',
                  label: 'Subheading',
                  localized: true,
                },
                {
                  name: 'servicesBgStyle',
                  type: 'select',
                  label: 'Section Background',
                  defaultValue: 'light',
                  options: [
                    { label: 'Light / White', value: 'light' },
                    { label: 'Dark',          value: 'dark' },
                    { label: 'Subtle',        value: 'subtle' },
                  ],
                },
                {
                  name: 'services',
                  type: 'array',
                  label: 'Service Cards',
                  fields: [
                    {
                      name: 'icon',
                      type: 'select',
                      label: 'Icon',
                      options: [
                        { label: 'QA / Check Badge', value: 'check-badge' },
                        { label: 'Globe / Web',      value: 'globe' },
                        { label: 'Mobile / Device',  value: 'device' },
                        { label: 'Users / HR',       value: 'users' },
                        { label: 'Consultancy Box',  value: 'consult' },
                        { label: 'Code',             value: 'code' },
                        { label: 'Lightbulb',        value: 'lightbulb' },
                        { label: 'Shield',           value: 'shield' },
                      ],
                    },
                    { name: 'title',       type: 'text',     required: true, localized: true },
                    { name: 'description', type: 'textarea', localized: true },
                    { name: 'href',        type: 'text',     defaultValue: '#' },
                  ],
                },
                // Custom Solution CTA
                {
                  name: 'customSolutionHeading',
                  type: 'text',
                  label: 'Custom Solution Banner — Heading',
                  localized: true,
                  defaultValue: 'Need Custom Solution?',
                },
                {
                  name: 'customSolutionBody',
                  type: 'text',
                  label: 'Custom Solution Banner — Body',
                  localized: true,
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'customSolutionCtaLabel',
                      type: 'text',
                      label: 'CTA Label',
                      defaultValue: 'Chat with us',
                    },
                    {
                      name: 'customSolutionCtaUrl',
                      type: 'text',
                      label: 'CTA URL',
                      defaultValue: '/static/contact',
                    },
                  ],
                },
              ],
            },

            // Testimonials
            {
              type: 'collapsible',
              label: 'Testimonials Section',
              fields: [
                {
                  name: 'testimonialsHeading',
                  type: 'text',
                  label: 'Heading',
                  localized: true,
                  defaultValue: 'Client Testimonials',
                },
                {
                  name: 'testimonialsSubheading',
                  type: 'text',
                  label: 'Subheading',
                  localized: true,
                  defaultValue: 'What our clients say about working with us.',
                },
                {
                  name: 'testimonialsBgStyle',
                  type: 'select',
                  label: 'Section Background Style',
                  defaultValue: 'yellow',
                  options: [
                    { label: 'Yellow / Gold', value: 'yellow' },
                    { label: 'Dark',          value: 'dark' },
                    { label: 'Light',         value: 'light' },
                    { label: 'Custom Color',  value: 'custom' },
                  ],
                },
                {
                  name: 'testimonialsBgColor',
                  type: 'text',
                  label: 'Custom Background Color',
                  admin: {
                    placeholder: '#f5c500',
                    condition: (data) => data.testimonialsBgStyle === 'custom',
                  },
                },
                {
                  name: 'testimonials',
                  type: 'array',
                  label: 'Testimonials',
                  fields: [
                    { name: 'name',    type: 'text',     required: true },
                    { name: 'role',    type: 'text' },
                    { name: 'company', type: 'text' },
                    { name: 'quote',   type: 'textarea', required: true, localized: true },
                    { name: 'avatar',  type: 'upload',   relationTo: 'media' },
                    {
                      name: 'rating',
                      type: 'number',
                      label: 'Rating (1–5)',
                      defaultValue: 5,
                      admin: { step: 1 },
                    },
                  ],
                },
              ],
            },

            // Contact
            {
              type: 'collapsible',
              label: 'Contact Section',
              fields: [
                {
                  name: 'contactHeading',
                  type: 'text',
                  label: 'Heading',
                  localized: true,
                  defaultValue: 'Get in Touch',
                },
                {
                  name: 'contactSubheading',
                  type: 'text',
                  label: 'Subheading',
                  localized: true,
                  defaultValue: 'Ready to start your next project? Let\'s discuss how we can help.',
                },
                {
                  name: 'contactEmail',
                  type: 'text',
                  label: 'Contact Email',
                  defaultValue: 'hello@atech.software',
                },
                {
                  name: 'contactPhone',
                  type: 'text',
                  label: 'Contact Phone',
                  defaultValue: '+852 1234 5678',
                },
                {
                  name: 'contactLocation',
                  type: 'text',
                  label: 'Location',
                  defaultValue: 'Central, Hong Kong',
                },
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
            {
              name: 'footerColumns',
              type: 'array',
              label: 'Footer Link Columns',
              admin: {
                description: 'Each column appears in the footer grid. Max 3 columns recommended.',
              },
              fields: [
                { name: 'heading', type: 'text', required: true, localized: true },
                {
                  name: 'links',
                  type: 'array',
                  label: 'Links',
                  fields: [
                    { name: 'label', type: 'text', required: true, localized: true },
                    { name: 'href',  type: 'text', required: true },
                  ],
                },
              ],
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

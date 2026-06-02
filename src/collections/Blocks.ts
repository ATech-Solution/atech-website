import type { CollectionConfig } from 'payload'
import homeEn from '@/components/language/home.json'

const h = homeEn.home

// ── Block type options ────────────────────────────────────────────────────────
const BASIC_BLOCK_TYPES = [
  { label: 'Container',    value: 'container' },
  { label: 'Grid',         value: 'grid' },
  { label: 'Heading',      value: 'heading' },
  { label: 'Text Editor',  value: 'text-editor' },
  { label: 'Image',        value: 'image' },
  { label: 'Video',        value: 'video' },
  { label: 'Button',       value: 'button' },
  { label: 'Divider',      value: 'divider' },
  { label: 'Spacer',       value: 'spacer' },
  { label: 'Google Map',   value: 'google-map' },
  { label: 'Icon',         value: 'icon' },
]

const HOME_SECTION_TYPES = [
  { label: 'Home — Hero',         value: 'home-hero' },
  { label: 'Home — About',        value: 'home-about' },
  { label: 'Home — Services',     value: 'home-services' },
  { label: 'Home — Testimonials', value: 'home-testimonials' },
  { label: 'Home — Contact',      value: 'home-contact' },
]

const ABOUT_SECTION_TYPES = [
  { label: 'About — Hero',             value: 'about-hero' },
  { label: 'About — Company',          value: 'about-company' },
  { label: 'About — Mission & Vision', value: 'about-mission-vision' },
  { label: 'About — Leadership',       value: 'about-leadership' },
  { label: 'About — FAQ',              value: 'about-faq' },
  { label: 'About — Contact',          value: 'about-contact' },
]

const SERVICE_SECTION_TYPES = [
  { label: 'Service — Hero',          value: 'web-dev-hero' },
  { label: 'Service — Cards',         value: 'service-cards' },
  { label: 'Service — Process Steps', value: 'process-steps' },
  { label: 'Service — CTA Banner',    value: 'cta-banner' },
  { label: 'HR — Expertise Tiles',    value: 'hr-recruit-expertise' },
]

const CONTACT_SECTION_TYPES = [
  { label: 'Contact — Hero',      value: 'contact-hero' },
  { label: 'Contact — Stats',     value: 'contact-stats' },
  { label: 'Contact — Locations', value: 'contact-locations' },
]

const CONTENT_SECTION_TYPES = [
  { label: 'Insight — Hero',     value: 'insight-hero' },
  { label: 'Insight — Articles', value: 'insight-articles' },
  { label: 'Article — Hero',     value: 'article-hero' },
  { label: 'Article — Featured', value: 'article-featured' },
  { label: 'Article — Grid',     value: 'article-grid' },
  { label: 'Portfolio — Hero',       value: 'portfolio-hero'       },
  { label: 'Portfolio — Statistics', value: 'portfolio-statistics' },
  { label: 'Portfolio — Main Grid',  value: 'portfolio-main'       },
  { label: 'Portfolio — Grid',       value: 'project-grid'         },
  { label: 'FAQ — Main',             value: 'faq-main'             },
]

const GET_INVOLVED_SECTION_TYPES = [
  { label: 'Get Involved — Hero',       value: 'get-involved-hero' },
  { label: 'Get Involved — Quote',      value: 'get-involved-quote' },
  { label: 'Get Involved — Jobs',       value: 'get-involved-jobs' },
  { label: 'Get Involved — Culture',    value: 'get-involved-culture' },
  { label: 'Get Involved — CTA',        value: 'get-involved-cta' },
  { label: 'Community — Hero',          value: 'community-hero' },
  { label: 'Community — Channels',      value: 'community-channels' },
  { label: 'Community — Ambassador',    value: 'community-ambassador' },
  { label: 'Community — Programs',      value: 'community-programs' },
]

const WHO_WE_SERVE_SECTION_TYPES = [
  { label: 'Who We Serve — Hero',       value: 'who-we-serve-hero' },
  { label: 'Who We Serve — Industries', value: 'who-we-serve-industries' },
  { label: 'Who We Serve — Why Us',     value: 'who-we-serve-why' },
]

const PORTFOLIO_SECTION_TYPES = [
  { label: 'Portfolio — Detail Top',      value: 'portfolio-detail-top'      },
  { label: 'Portfolio — Featured Image',  value: 'portfolio-featured-image'  },
  { label: 'Portfolio — Detail Overview', value: 'portfolio-detail-overview' },
]

const ARTICLE_SECTION_TYPES = [
  { label: 'Article — Detail Hero',    value: 'article-detail-hero'    },
  { label: 'Article — Detail Content', value: 'article-detail-content' },
  { label: 'Article — Related',        value: 'article-related'        },
]

const FORM_BLOCK_TYPES = [
  { label: 'Dynamic Form', value: 'dynamic-form' },
  { label: 'Form',         value: 'form'         },
]

const GENERAL_BLOCK_TYPES = [
  { label: 'Tabs',                 value: 'tabs' },
  { label: 'Accordion',            value: 'accordion' },
  { label: 'Image Box',            value: 'image-box' },
  { label: 'Icon Box',             value: 'icon-box' },
  { label: 'Image Carousel',       value: 'image-carousel' },
  { label: 'Basic Gallery',        value: 'basic-gallery' },
  { label: 'Icon List',            value: 'icon-list' },
  { label: 'Counter',              value: 'counter' },
  { label: 'Progress Bar',         value: 'progress-bar' },
  { label: 'Testimonial',          value: 'testimonial' },
  { label: 'Social Icons',         value: 'social-icons' },
  { label: 'Alert',                value: 'alert' },
  { label: 'HTML',                 value: 'html' },
  { label: 'Hero Section',         value: 'hero-section' },
  { label: 'Services Section',     value: 'services-section' },
  { label: 'Testimonials Section', value: 'testimonials-section' },
  { label: 'Contact Section',      value: 'contact-section' },
]

// Block types that have no text content (hide title/subtitle/button fields)
const NO_TEXT_TYPES = ['divider', 'spacer', 'image', 'video', 'google-map']

// Block types that have items array
const ITEMS_TYPES = [
  'tabs', 'accordion', 'icon-list', 'image-carousel',
  'basic-gallery', 'counter', 'progress-bar', 'testimonial', 'social-icons',
  'hero-section', 'services-section', 'testimonials-section', 'contact-section',
]

export const Blocks: CollectionConfig = {
  slug: 'blocks',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'blockType', 'category', 'updatedAt'],
    hidden: () => true,
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  hooks: {
    afterChange: [
      async () => {
        try {
          const { revalidateTag } = await import('next/cache')
          revalidateTag('perf:block-templates')
          revalidateTag('perf:pages')
        } catch {
          // Ignore in non-Next.js contexts
        }
      },
    ],
  },
  fields: [
    // ── Identity ───────────────────────────────────────────────────────────
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Block Name',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'blockType',
          type: 'select',
          label: 'Block Type',
          required: true,
          options: [
            {
              label: '── Basic ──',
              value: '__basic_header__',
            },
            ...BASIC_BLOCK_TYPES,
            {
              label: '── General ──',
              value: '__general_header__',
            },
            ...GENERAL_BLOCK_TYPES,
            {
              label: '── Home Page ──',
              value: '__home_header__',
            },
            ...HOME_SECTION_TYPES,
            {
              label: '── About Us ──',
              value: '__about_header__',
            },
            ...ABOUT_SECTION_TYPES,
            {
              label: '── Service Pages ──',
              value: '__service_header__',
            },
            ...SERVICE_SECTION_TYPES,
            {
              label: '── Contact ──',
              value: '__contact_header__',
            },
            ...CONTACT_SECTION_TYPES,
            {
              label: '── Content Pages ──',
              value: '__content_header__',
            },
            ...CONTENT_SECTION_TYPES,
            {
              label: '── Get Involved ──',
              value: '__get_involved_header__',
            },
            ...GET_INVOLVED_SECTION_TYPES,
            {
              label: '── Who We Serve ──',
              value: '__who_we_serve_header__',
            },
            ...WHO_WE_SERVE_SECTION_TYPES,
            {
              label: '── Portfolio Detail ──',
              value: '__portfolio_detail_header__',
            },
            ...PORTFOLIO_SECTION_TYPES,
            {
              label: '── Article Detail ──',
              value: '__article_detail_header__',
            },
            ...ARTICLE_SECTION_TYPES,
            {
              label: '── Forms ──',
              value: '__forms_header__',
            },
            ...FORM_BLOCK_TYPES,
          ],
        },
        {
          name: 'category',
          type: 'select',
          label: 'Category',
          required: true,
          defaultValue: 'basic',
          options: [
            { label: 'Basic',              value: 'basic' },
            { label: 'General',            value: 'general' },
            { label: 'Home Sections',      value: 'home-sections' },
            { label: 'About Sections',     value: 'about-sections' },
            { label: 'Service Sections',   value: 'service-sections' },
            { label: 'Contact Sections',   value: 'contact-sections' },
            { label: 'Content Sections',   value: 'content-sections' },
            { label: 'Get Involved',       value: 'get-involved-sections' },
            { label: 'Who We Serve',       value: 'who-we-serve-sections' },
            { label: 'Portfolio Sections', value: 'portfolio-sections' },
            { label: 'Article Sections',   value: 'article-sections'   },
            { label: 'Forms',              value: 'form-sections'       },
          ],
        },
      ],
    },

    // ── Tabs: Content / Style / Advanced ──────────────────────────────────
    {
      type: 'tabs',
      tabs: [
        // ── CONTENT TAB ─────────────────────────────────────────────────
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              localized: true,
              admin: {
                condition: (data) => !NO_TEXT_TYPES.includes(data.blockType),
              },
            },
            {
              name: 'subtitle',
              type: 'textarea',
              label: 'Subtitle',
              localized: true,
              admin: {
                condition: (data) =>
                  !NO_TEXT_TYPES.includes(data.blockType) &&
                  !['button', 'icon', 'divider', 'spacer'].includes(data.blockType),
              },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Image',
              admin: {
                condition: (data) =>
                  ['image', 'image-box', 'icon-box', 'hero', 'portfolio-featured-image'].includes(data.blockType),
              },
            },
            {
              name: 'videoUrl',
              type: 'text',
              label: 'Video URL',
              admin: {
                description: 'YouTube or Vimeo URL',
                condition: (data) => data.blockType === 'video',
              },
            },
            {
              name: 'buttonLabel',
              type: 'text',
              label: 'Button Label',
              admin: {
                condition: (data) =>
                  ['button', 'heading', 'image-box', 'icon-box',
                   'hero-section', 'services-section', 'testimonials-section', 'contact-section',
                   'cta-banner',
                  ].includes(data.blockType),
              },
            },
            {
              name: 'buttonUrl',
              type: 'text',
              label: 'Button URL',
              admin: {
                condition: (data) =>
                  ['button', 'heading', 'image-box', 'icon-box',
                   'hero-section', 'services-section', 'testimonials-section', 'contact-section',
                   'cta-banner',
                  ].includes(data.blockType),
              },
            },
            {
              name: 'htmlContent',
              type: 'textarea',
              label: 'HTML Content / Badge Text',
              admin: {
                description: 'Raw HTML markup (html block) — or badge/CTA heading text for section blocks',
                condition: (data) =>
                  ['html', 'hero-section', 'services-section'].includes(data.blockType),
              },
            },
            {
              name: 'mapEmbedUrl',
              type: 'text',
              label: 'Google Maps Embed URL',
              admin: {
                description: 'Paste the embed URL from Google Maps → Share → Embed a map',
                condition: (data) => data.blockType === 'google-map',
              },
            },
            {
              name: 'iconName',
              type: 'text',
              label: 'Icon Name / SVG',
              admin: {
                description: 'Icon identifier or inline SVG string',
                condition: (data) => ['icon', 'icon-box'].includes(data.blockType),
              },
            },
            // ── Grid columns config ──────────────────────────────────────
            {
              name: 'columns',
              type: 'select',
              label: 'Columns',
              defaultValue: '3',
              options: [
                { label: '1 Column',  value: '1' },
                { label: '2 Columns', value: '2' },
                { label: '3 Columns', value: '3' },
                { label: '4 Columns', value: '4' },
                { label: '6 Columns', value: '6' },
              ],
              admin: {
                condition: (data) => data.blockType === 'grid',
              },
            },
            // ── Alert type ───────────────────────────────────────────────
            {
              name: 'alertType',
              type: 'select',
              label: 'Alert Type',
              defaultValue: 'info',
              options: [
                { label: 'Info',    value: 'info' },
                { label: 'Success', value: 'success' },
                { label: 'Warning', value: 'warning' },
                { label: 'Error',   value: 'error' },
              ],
              admin: {
                condition: (data) => data.blockType === 'alert',
              },
            },
            // ── Items array (multi-item blocks) ──────────────────────────
            {
              name: 'items',
              type: 'array',
              label: 'Items',
              admin: {
                condition: (data) => ITEMS_TYPES.includes(data.blockType),
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Label / Title',
                  localized: true,
                },
                {
                  name: 'content',
                  type: 'textarea',
                  label: 'Content / Description',
                  localized: true,
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Image',
                },
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Icon',
                },
                {
                  name: 'value',
                  type: 'text',
                  label: 'Value (counter / progress)',
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'URL / Link',
                },
              ],
            },

          // ── HOME HERO fields ─────────────────────────────────────────────
          {
            name: 'badge',
            type: 'text',
            label: 'Badge Text',
            defaultValue: h.hero.badge,
            admin: { condition: (data) => ['home-hero', 'about-hero', 'web-dev-hero', 'article-detail-hero'].includes(data.blockType) },
          },
          {
            name: 'heading',
            type: 'text',
            label: 'Heading',
            localized: true,
            defaultValue: h.hero.heading,
            admin: { condition: (data) => [...HOME_SECTION_TYPES.map(t => t.value), 'web-dev-hero', 'service-cards', 'cta-banner', 'article-related'].includes(data.blockType) },
          },
          {
            name: 'body',
            type: 'textarea',
            label: 'Body Text',
            localized: true,
            defaultValue: h.hero.body,
            admin: { condition: (data) => ['home-hero', 'web-dev-hero'].includes(data.blockType) },
          },
          {
            type: 'row',
            admin: { condition: (data) => ['home-hero', 'web-dev-hero'].includes(data.blockType) },
            fields: [
              { name: 'ctaPrimaryLabel', type: 'text', label: 'Primary CTA Label',  defaultValue: h.hero.cta.primary.label },
              { name: 'ctaPrimaryUrl',   type: 'text', label: 'Primary CTA URL',    defaultValue: h.hero.cta.primary.url   },
            ],
          },
          {
            type: 'row',
            admin: { condition: (data) => ['home-hero', 'web-dev-hero'].includes(data.blockType) },
            fields: [
              { name: 'ctaSecondaryLabel', type: 'text', label: 'Secondary CTA Label', defaultValue: h.hero.cta.secondary.label },
              { name: 'ctaSecondaryUrl',   type: 'text', label: 'Secondary CTA URL',   defaultValue: h.hero.cta.secondary.url   },
            ],
          },
          {
            name: 'heroImage',
            type: 'upload',
            relationTo: 'media',
            label: 'Hero Image',
            admin: { condition: (data) => ['home-hero', 'web-dev-hero'].includes(data.blockType) },
          },
          {
            name: 'heroStats',
            type: 'array',
            label: 'Stats',
            defaultValue: h.hero.stats.map((s) => ({ statValue: s.value, statLabel: s.label })),
            admin: { condition: (data) => ['home-hero', 'cta-banner'].includes(data.blockType) },
            fields: [
              { name: 'statValue', type: 'text', label: 'Value (e.g. "250+")' },
              { name: 'statLabel', type: 'text', label: 'Label (e.g. "Projects Delivered")' },
            ],
          },
          {
            name: 'floatingCards',
            type: 'array',
            label: 'Floating Cards',
            defaultValue: h.hero.floatingCards.map((c) => ({ cardText: c.text, cardPosition: c.position })),
            admin: { condition: (data) => data.blockType === 'home-hero' },
            fields: [
              { name: 'cardText', type: 'text', label: 'Card Text' },
              {
                name: 'cardPosition',
                type: 'select',
                label: 'Position',
                defaultValue: 'top-right',
                options: [
                  { label: 'Top Right',    value: 'top-right' },
                  { label: 'Bottom Left',  value: 'bottom-left' },
                  { label: 'Top Left',     value: 'top-left' },
                  { label: 'Bottom Right', value: 'bottom-right' },
                ],
              },
              {
                name: 'cardIcon',
                type: 'upload',
                relationTo: 'media',
                label: 'Card Icon',
              },
            ],
          },

          // ── HOME ABOUT fields ────────────────────────────────────────────
          {
            name: 'description',
            type: 'textarea',
            label: 'Description',
            localized: true,
            defaultValue: h.about.description,
            admin: { condition: (data) => data.blockType === 'home-about' },
          },
          {
            name: 'pillars',
            type: 'array',
            label: 'Pillars',
            defaultValue: h.about.pillars.map((p) => ({ pillarTitle: p.title, pillarDesc: p.description })),
            admin: { condition: (data) => data.blockType === 'home-about' },
            fields: [
              {
                name: 'pillarIcon',
                type: 'upload',
                relationTo: 'media',
                label: 'Icon (SVG / PNG)',
              },
              { name: 'pillarTitle', type: 'text',     label: 'Title',       localized: true },
              { name: 'pillarDesc',  type: 'textarea', label: 'Description', localized: true },
            ],
          },

          // ── HOME SERVICES fields ─────────────────────────────────────────
          {
            name: 'subheading',
            type: 'textarea',
            label: 'Subheading',
            localized: true,
            defaultValue: h.services.subheading,
            admin: {
              condition: (data) =>
                data.blockType === 'home-services' || data.blockType === 'home-testimonials',
            },
          },
          {
            name: 'serviceItems',
            type: 'array',
            label: 'Service Items',
            defaultValue: h.services.items.map((s) => ({
              serviceTitle: s.title,
              serviceDesc:  s.description,
              serviceHref:  s.href,
            })),
            admin: { condition: (data) => data.blockType === 'home-services' },
            fields: [
              {
                name: 'serviceIcon',
                type: 'upload',
                relationTo: 'media',
                label: 'Icon',
              },
              { name: 'serviceTitle', type: 'text',     label: 'Title',       localized: true },
              { name: 'serviceDesc',  type: 'textarea', label: 'Description', localized: true },
              { name: 'serviceHref',  type: 'text',     label: 'Link URL' },
            ],
          },
          {
            name: 'customSolutionHeading',
            type: 'text',
            label: 'Custom Solution — Heading',
            localized: true,
            defaultValue: h.services.customSolution.heading,
            admin: { condition: (data) => data.blockType === 'home-services' },
          },
          {
            name: 'customSolutionBody',
            type: 'textarea',
            label: 'Custom Solution — Body',
            localized: true,
            defaultValue: h.services.customSolution.body,
            admin: { condition: (data) => data.blockType === 'home-services' },
          },
          {
            type: 'row',
            admin: { condition: (data) => data.blockType === 'home-services' },
            fields: [
              { name: 'customSolutionCtaLabel', type: 'text', label: 'Custom Solution CTA Label', defaultValue: h.services.customSolution.cta.label },
              { name: 'customSolutionCtaUrl',   type: 'text', label: 'Custom Solution CTA URL',   defaultValue: h.services.customSolution.cta.url   },
            ],
          },

          // ── HOME TESTIMONIALS fields ─────────────────────────────────────
          {
            name: 'testimonialsContentSource',
            type: 'select',
            label: 'Content Source',
            defaultValue: 'manual',
            options: [
              { label: 'Testimonials Collection (CMS)', value: 'collection' },
              { label: 'Manual Items',                  value: 'manual'     },
            ],
            admin: { condition: (data) => data.blockType === 'home-testimonials' },
          },
          {
            name: 'testimonialsLimit',
            type: 'number',
            label: 'Items Limit',
            defaultValue: 9,
            admin: {
              description: 'Max testimonials to load from the collection.',
              condition: (data) =>
                data.blockType === 'home-testimonials' &&
                data.testimonialsContentSource === 'collection',
            },
          },
          {
            name: 'enableCarousel',
            type: 'checkbox',
            label: 'Enable Slide Carousel',
            defaultValue: false,
            admin: { condition: (data) => data.blockType === 'home-testimonials' },
          },
          {
            name: 'testimonialItems',
            type: 'array',
            label: 'Testimonials',
            defaultValue: h.testimonials.items.map((t) => ({
              clientName:    t.name,
              clientRole:    t.role,
              clientCompany: t.company,
              quote:         t.quote,
              rating:        t.rating,
            })),
            admin: {
              condition: (data) =>
                data.blockType === 'home-testimonials' &&
                (data.testimonialsContentSource ?? 'manual') !== 'collection',
            },
            fields: [
              { name: 'clientName',    type: 'text',     label: 'Name' },
              { name: 'clientRole',    type: 'text',     label: 'Role' },
              { name: 'clientCompany', type: 'text',     label: 'Company' },
              { name: 'quote',         type: 'textarea', label: 'Quote', localized: true },
              { name: 'rating',        type: 'number',   label: 'Rating (1–5)', min: 1, max: 5, defaultValue: 5 },
              {
                name: 'avatar',
                type: 'upload',
                relationTo: 'media',
                label: 'Avatar (optional)',
              },
            ],
          },

          // ── CONTACT fields (home-contact + about-contact) ────────────────
          {
            name: 'contactSubheading',
            type: 'textarea',
            label: 'Subheading',
            localized: true,
            defaultValue: h.contact.subheading,
            admin: { condition: (data) => ['home-contact', 'about-contact'].includes(data.blockType) },
          },
          {
            name: 'formHeading',
            type: 'text',
            label: 'Form Heading',
            localized: true,
            defaultValue: h.contact.form.heading,
            admin: { condition: (data) => ['home-contact', 'about-contact'].includes(data.blockType) },
          },
          {
            name: 'submitLabel',
            type: 'text',
            label: 'Submit Button Label',
            localized: true,
            defaultValue: h.contact.form.submitLabel,
            admin: { condition: (data) => ['home-contact', 'about-contact'].includes(data.blockType) },
          },
          {
            name: 'infoHeading',
            type: 'text',
            label: 'Contact Info Heading',
            localized: true,
            defaultValue: h.contact.info.heading,
            admin: { condition: (data) => ['home-contact', 'about-contact'].includes(data.blockType) },
          },
          {
            type: 'row',
            admin: { condition: (data) => ['home-contact', 'about-contact'].includes(data.blockType) },
            fields: [
              { name: 'contactEmail', type: 'email', label: 'Email', defaultValue: h.contact.info.email },
              { name: 'contactPhone', type: 'text',  label: 'Phone', defaultValue: h.contact.info.phone },
            ],
          },
          {
            name: 'contactLocation',
            type: 'text',
            label: 'Location',
            defaultValue: h.contact.info.location,
            admin: { condition: (data) => ['home-contact', 'about-contact'].includes(data.blockType) },
          },

          // ── ABOUT HERO fields ────────────────────────────────────────────
          {
            name: 'badgeIcon',
            type: 'upload',
            relationTo: 'media',
            label: 'Badge Icon',
            admin: { condition: (data) => data.blockType === 'about-hero' },
          },
          {
            name: 'aboutHeroHeading',
            type: 'text',
            label: 'Heading',
            localized: true,
            admin: { condition: (data) => data.blockType === 'about-hero' },
          },
          {
            name: 'aboutHeroSubheading',
            type: 'textarea',
            label: 'Subheading',
            localized: true,
            admin: { condition: (data) => data.blockType === 'about-hero' },
          },
          {
            name: 'aboutHeroVideoUrl',
            type: 'text',
            label: 'Video URL (optional)',
            admin: { condition: (data) => data.blockType === 'about-hero' },
          },

          // ── ABOUT COMPANY fields ─────────────────────────────────────────
          {
            name: 'aboutCompanyHeading',
            type: 'text',
            label: 'Heading',
            localized: true,
            admin: { condition: (data) => data.blockType === 'about-company' },
          },
          {
            name: 'body1',
            type: 'textarea',
            label: 'Body Paragraph 1',
            localized: true,
            admin: { condition: (data) => data.blockType === 'about-company' },
          },
          {
            name: 'body2',
            type: 'textarea',
            label: 'Body Paragraph 2',
            localized: true,
            admin: { condition: (data) => data.blockType === 'about-company' },
          },
          {
            name: 'companyStats',
            type: 'array',
            label: 'Stats',
            admin: { condition: (data) => data.blockType === 'about-company' },
            fields: [
              { name: 'statValue', type: 'text', label: 'Value (e.g. "500+")' },
              { name: 'statLabel', type: 'text', label: 'Label',              localized: true },
            ],
          },
          {
            name: 'companyImage',
            type: 'upload',
            relationTo: 'media',
            label: 'Company Image (optional)',
            admin: { condition: (data) => data.blockType === 'about-company' },
          },

          // ── ABOUT MISSION & VISION fields ────────────────────────────────
          {
            name: 'missionIcon',
            type: 'upload',
            relationTo: 'media',
            label: 'Mission Icon',
            admin: { condition: (data) => data.blockType === 'about-mission-vision' },
          },
          {
            name: 'missionHeading',
            type: 'text',
            label: 'Mission Heading',
            localized: true,
            admin: { condition: (data) => data.blockType === 'about-mission-vision' },
          },
          {
            name: 'missionBody',
            type: 'textarea',
            label: 'Mission Body',
            localized: true,
            admin: { condition: (data) => data.blockType === 'about-mission-vision' },
          },
          {
            name: 'visionIcon',
            type: 'upload',
            relationTo: 'media',
            label: 'Vision Icon',
            admin: { condition: (data) => data.blockType === 'about-mission-vision' },
          },
          {
            name: 'visionHeading',
            type: 'text',
            label: 'Vision Heading',
            localized: true,
            admin: { condition: (data) => data.blockType === 'about-mission-vision' },
          },
          {
            name: 'visionBody',
            type: 'textarea',
            label: 'Vision Body',
            localized: true,
            admin: { condition: (data) => data.blockType === 'about-mission-vision' },
          },
          {
            name: 'valuesHeading',
            type: 'text',
            label: 'Values Section Heading',
            localized: true,
            admin: { condition: (data) => data.blockType === 'about-mission-vision' },
          },
          {
            name: 'values',
            type: 'array',
            label: 'Values',
            admin: { condition: (data) => data.blockType === 'about-mission-vision' },
            fields: [
              {
                name: 'valueIcon',
                type: 'upload',
                relationTo: 'media',
                label: 'Icon',
              },
              { name: 'valueTitle', type: 'text',     label: 'Title',       localized: true },
              { name: 'valueDesc',  type: 'textarea', label: 'Description', localized: true },
            ],
          },

          // ── ABOUT LEADERSHIP fields ──────────────────────────────────────
          {
            name: 'leadershipHeading',
            type: 'text',
            label: 'Heading',
            localized: true,
            admin: { condition: (data) => data.blockType === 'about-leadership' },
          },
          {
            name: 'leadershipSubheading',
            type: 'textarea',
            label: 'Subheading',
            localized: true,
            admin: { condition: (data) => data.blockType === 'about-leadership' },
          },
          {
            name: 'teamMembers',
            type: 'array',
            label: 'Team Members',
            admin: { condition: (data) => data.blockType === 'about-leadership' },
            fields: [
              {
                name: 'avatar',
                type: 'upload',
                relationTo: 'media',
                label: 'Avatar Photo',
              },
              { name: 'memberName', type: 'text',     label: 'Name' },
              { name: 'memberRole', type: 'text',     label: 'Role / Title' },
              { name: 'memberBio',  type: 'textarea', label: 'Bio',          localized: true },
            ],
          },

          // ── FAQ fields (about-faq, faq-section, faq-main) ─────────────────
          {
            name: 'faqContentSource',
            type: 'select',
            label: 'Content Source',
            defaultValue: 'manual',
            options: [
              { label: 'FAQ Collection (CMS)', value: 'collection' },
              { label: 'Manual Items',         value: 'manual'     },
            ],
            admin: {
              condition: (data) => ['faq-section', 'faq-main'].includes(data.blockType),
            },
          },
          {
            name: 'faqCategorySlug',
            type: 'text',
            label: 'Filter by Category Slug',
            admin: {
              description: 'Optional: load only FAQs from this category slug (faq-section only).',
              condition: (data) =>
                data.blockType === 'faq-section' && data.faqContentSource === 'collection',
            },
          },
          {
            name: 'faqLimit',
            type: 'number',
            label: 'Items Limit',
            defaultValue: 20,
            admin: {
              description: 'Max FAQ items to load from the collection.',
              condition: (data) =>
                ['faq-section', 'faq-main'].includes(data.blockType) &&
                data.faqContentSource === 'collection',
            },
          },
          {
            name: 'faqBackLabel',
            type: 'text',
            label: 'Back Link Label',
            admin: {
              placeholder: 'Back to about us',
              condition: (data) => data.blockType === 'faq-main',
            },
          },
          {
            name: 'faqBackUrl',
            type: 'text',
            label: 'Back Link URL',
            admin: {
              placeholder: '/about',
              condition: (data) => data.blockType === 'faq-main',
            },
          },
          {
            name: 'faqHeading',
            type: 'text',
            label: 'Heading',
            localized: true,
            admin: {
              condition: (data) => ['about-faq', 'faq-section'].includes(data.blockType),
            },
          },
          {
            name: 'faqSubheading',
            type: 'textarea',
            label: 'Subheading',
            localized: true,
            admin: {
              condition: (data) => ['about-faq', 'faq-section'].includes(data.blockType),
            },
          },
          {
            name: 'faqItems',
            type: 'array',
            label: 'FAQ Items (Manual Mode)',
            admin: {
              condition: (data) =>
                ['about-faq', 'faq-section', 'faq-main'].includes(data.blockType) &&
                (data.blockType === 'about-faq' || data.faqContentSource !== 'collection'),
            },
            fields: [
              { name: 'question', type: 'text',     label: 'Question', localized: true },
              { name: 'answer',   type: 'textarea', label: 'Answer',   localized: true },
            ],
          },

          // ── SERVICE HERO (web-dev-hero) fields ───────────────────────────
          {
            name: 'badgeIconSrc',
            type: 'text',
            label: 'Badge Icon URL',
            admin: { condition: (data) => data.blockType === 'web-dev-hero' },
          },
          {
            name: 'breadcrumbItems',
            type: 'array',
            label: 'Breadcrumb',
            admin: { condition: (data) => ['web-dev-hero', 'article-detail-hero'].includes(data.blockType) },
            fields: [
              { name: 'breadcrumbLabel', type: 'text', label: 'Label', required: true },
              { name: 'breadcrumbUrl',   type: 'text', label: 'URL (leave empty for current page)' },
            ],
          },

          // ── SERVICE CARDS (service-cards) fields ─────────────────────────
          {
            name: 'cardItems',
            type: 'array',
            label: 'Service Cards',
            admin: { condition: (data) => data.blockType === 'service-cards' },
            fields: [
              { name: 'cardIconSrc',     type: 'text',     label: 'Icon URL' },
              { name: 'cardTitle',       type: 'text',     label: 'Title', required: true },
              { name: 'cardDescription', type: 'textarea', label: 'Description' },
              {
                name: 'cardFeatures',
                type: 'textarea',
                label: 'Features (one per line)',
                admin: { description: 'Enter each feature on a new line' },
              },
            ],
          },

          // ── PROJECT GRID (project-grid) fields ───────────────────────────
          // Non-localized fields FIRST (must precede localized fields to render)
          {
            name: 'showCategoryFilter',
            type: 'select',
            label: 'Show Category Filter Tabs',
            defaultValue: 'yes',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No',  value: 'no'  },
            ],
            admin: { condition: (data) => data.blockType === 'project-grid' || data.blockType === 'portfolio-main' },
          },
          {
            name: 'projectContentSource',
            type: 'select',
            label: 'Content Source',
            defaultValue: 'manual',
            options: [
              { label: 'Portfolio Collection (CMS)', value: 'collection' },
              { label: 'Manual Items',               value: 'manual'     },
            ],
            admin: { condition: (data) => data.blockType === 'project-grid' || data.blockType === 'portfolio-main' },
          },
          {
            name: 'projectLimit',
            type: 'number',
            label: 'Items Limit',
            defaultValue: 9,
            admin: {
              description: 'Max portfolio items to load from the collection.',
              condition: (data) => (data.blockType === 'project-grid' || data.blockType === 'portfolio-main') && data.projectContentSource === 'collection',
            },
          },
          {
            name: 'projectCategory',
            type: 'text',
            label: 'Filter by Category Slug',
            admin: {
              description: 'Optional: show only items from this portfolio-category slug.',
              condition: (data) => (data.blockType === 'project-grid' || data.blockType === 'portfolio-main') && data.projectContentSource === 'collection',
            },
          },
          {
            name: 'projectOrderBy',
            type: 'select',
            label: 'Sort Order',
            defaultValue: 'publishedAt_desc',
            options: [
              { label: 'Newest First', value: 'publishedAt_desc' },
              { label: 'Oldest First', value: 'publishedAt_asc'  },
            ],
            admin: {
              condition: (data) => (data.blockType === 'project-grid' || data.blockType === 'portfolio-main') && data.projectContentSource === 'collection',
            },
          },
          // Localized fields AFTER non-localized
          {
            name: 'projectHeading',
            type: 'text',
            label: 'Heading',
            localized: true,
            admin: { condition: (data) => data.blockType === 'project-grid' || data.blockType === 'portfolio-main' },
          },
          {
            name: 'projectSubheading',
            type: 'textarea',
            label: 'Subheading',
            localized: true,
            admin: { condition: (data) => data.blockType === 'project-grid' || data.blockType === 'portfolio-main' },
          },
          {
            name: 'projectItems',
            type: 'array',
            label: 'Project Items (Manual Mode)',
            admin: {
              condition: (data) => data.blockType === 'project-grid' && data.projectContentSource !== 'collection',
            },
            fields: [
              {
                name: 'projectImage',
                type: 'upload',
                relationTo: 'media',
                label: 'Project Image',
              },
              { name: 'projectTag',   type: 'text',     label: 'Primary Category / Tag' },
              { name: 'projectType',  type: 'text',     label: 'Project Type (second badge)' },
              { name: 'projectTitle', type: 'text',     label: 'Project Title', required: true },
              { name: 'projectDesc',  type: 'textarea', label: 'Short Description' },
              {
                name: 'projectCta',
                type: 'text',
                label: 'CTA Label',
                admin: { placeholder: 'View Case Study' },
              },
              { name: 'projectUrl', type: 'text', label: 'Project URL' },
            ],
          },

          // ── PORTFOLIO DETAIL TOP (portfolio-detail-top) fields ───────────
          {
            name: 'backLabel',
            type: 'text',
            label: 'Back Link Label',
            admin: {
              placeholder: 'Back to Portfolio',
              condition: (data) => data.blockType === 'portfolio-detail-top',
            },
          },
          {
            name: 'backUrl',
            type: 'text',
            label: 'Back Link URL',
            admin: {
              placeholder: '/static/portfolio',
              condition: (data) => data.blockType === 'portfolio-detail-top',
            },
          },
          {
            name: 'tags',
            type: 'array',
            label: 'Category Tags',
            admin: { condition: (data) => data.blockType === 'portfolio-detail-top' },
            fields: [
              { name: 'tagLabel', type: 'text', label: 'Tag Label', required: true },
            ],
          },
          {
            name: 'pdTitle',
            type: 'text',
            label: 'Project Title',
            localized: true,
            admin: { condition: (data) => data.blockType === 'portfolio-detail-top' },
          },
          {
            name: 'pdDescription',
            type: 'textarea',
            label: 'Project Description',
            localized: true,
            admin: { condition: (data) => data.blockType === 'portfolio-detail-top' },
          },
          {
            name: 'pdClient',
            type: 'text',
            label: 'Client',
            admin: { condition: (data) => data.blockType === 'portfolio-detail-top' },
          },
          {
            name: 'pdDuration',
            type: 'text',
            label: 'Duration',
            admin: {
              placeholder: 'e.g. 6 Months',
              condition: (data) => data.blockType === 'portfolio-detail-top',
            },
          },
          {
            name: 'pdYear',
            type: 'text',
            label: 'Year',
            admin: {
              placeholder: 'e.g. 2025',
              condition: (data) => data.blockType === 'portfolio-detail-top',
            },
          },
          {
            name: 'pdTeamSize',
            type: 'text',
            label: 'Team Size',
            admin: {
              placeholder: 'e.g. 12 Members',
              condition: (data) => data.blockType === 'portfolio-detail-top',
            },
          },

          // ── PORTFOLIO FEATURED IMAGE (portfolio-featured-image) fields ───
          {
            name: 'pdCaption',
            type: 'text',
            label: 'Image Caption / Alt Text',
            admin: { condition: (data) => data.blockType === 'portfolio-featured-image' },
          },

          // ── PORTFOLIO DETAIL OVERVIEW (portfolio-detail-overview) fields ─
          {
            name: 'pdSectionTitle',
            type: 'text',
            label: 'Section Title',
            localized: true,
            admin: {
              placeholder: 'Project Overview',
              condition: (data) => data.blockType === 'portfolio-detail-overview',
            },
          },
          {
            name: 'pdContent',
            type: 'textarea',
            label: 'Overview Content',
            localized: true,
            admin: {
              description: 'Separate paragraphs with a blank line.',
              condition: (data) => data.blockType === 'portfolio-detail-overview',
            },
          },
          {
            name: 'pdMetricsTitle',
            type: 'text',
            label: 'Metrics Sidebar Title',
            admin: {
              placeholder: 'Key Metrics',
              condition: (data) => data.blockType === 'portfolio-detail-overview',
            },
          },
          {
            name: 'pdMetrics',
            type: 'array',
            label: 'Key Metrics',
            admin: { condition: (data) => data.blockType === 'portfolio-detail-overview' },
            fields: [
              { name: 'pdMetricValue', type: 'text', label: 'Value (e.g. "500K+")' },
              { name: 'pdMetricLabel', type: 'text', label: 'Label (e.g. "Active Users")' },
            ],
          },

          // ── PORTFOLIO HERO (portfolio-hero) fields ───────────────────────
          {
            name: 'portfolioHeroBadge',
            type: 'text',
            label: 'Badge Text',
            defaultValue: 'Our Work',
            admin: { condition: (data) => data.blockType === 'portfolio-hero' },
          },
          {
            name: 'portfolioHeroHeading',
            type: 'text',
            label: 'Heading',
            localized: true,
            defaultValue: 'Our Portfolio',
            admin: { condition: (data) => data.blockType === 'portfolio-hero' },
          },
          {
            name: 'portfolioHeroSubheading',
            type: 'textarea',
            label: 'Subheading',
            localized: true,
            defaultValue: 'Explore our collection of successful projects across industries. From startups to enterprises, we deliver exceptional digital solutions that drive results.',
            admin: { condition: (data) => data.blockType === 'portfolio-hero' },
          },
          {
            type: 'row',
            admin: { condition: (data) => data.blockType === 'portfolio-hero' },
            fields: [
              { name: 'portfolioHeroCtaPrimaryLabel', type: 'text', label: 'Primary CTA Label', defaultValue: 'View Projects' },
              { name: 'portfolioHeroCtaPrimaryUrl',   type: 'text', label: 'Primary CTA URL',   defaultValue: '#projects' },
            ],
          },
          {
            type: 'row',
            admin: { condition: (data) => data.blockType === 'portfolio-hero' },
            fields: [
              { name: 'portfolioHeroCtaSecondaryLabel', type: 'text', label: 'Secondary CTA Label', defaultValue: 'Start Your Project' },
              { name: 'portfolioHeroCtaSecondaryUrl',   type: 'text', label: 'Secondary CTA URL',   defaultValue: '/static/contact' },
            ],
          },

          // ── PORTFOLIO STATISTICS (portfolio-statistics) fields ──────────────
          {
            name: 'portfolioStats',
            type: 'array',
            label: 'Statistics',
            admin: { condition: (data) => data.blockType === 'portfolio-statistics' },
            fields: [
              { name: 'statValue', type: 'text', label: 'Value (e.g. "150+")' },
              { name: 'statLabel', type: 'text', label: 'Label',              localized: true },
            ],
          },

          // ── ARTICLE FEATURED (article-featured) fields ───────────────────
          {
            name: 'featContentSource',
            type: 'select',
            label: 'Content Source',
            defaultValue: 'manual',
            options: [
              { label: 'Posts Collection', value: 'collection' },
              { label: 'Manual',           value: 'manual'     },
            ],
            admin: { condition: (data) => data.blockType === 'article-featured' },
          },
          {
            name: 'featPostSlug',
            type: 'text',
            label: 'Post Slug',
            admin: {
              description: 'Slug of the post to feature (e.g. "my-first-post").',
              condition: (data) =>
                data.blockType === 'article-featured' && data.featContentSource === 'collection',
            },
          },

          // ── DYNAMIC FORM fields ──────────────────────────────────────────
          {
            name: 'formRef',
            type: 'relationship',
            relationTo: 'forms',
            label: 'Form',
            admin: {
              description: 'Select the form to render on this page.',
              condition: (data) => data.blockType === 'dynamic-form',
            },
          },
          {
            name: 'formSubmitLabel',
            type: 'text',
            label: 'Submit Button Label',
            admin: {
              placeholder: 'Submit',
              condition: (data) => data.blockType === 'dynamic-form',
            },
          },

          // ── FORM block fields ──────────────────────────────────────────────
          {
            name: 'surveyFormRef',
            type: 'relationship',
            relationTo: 'forms',
            label: 'Form',
            admin: {
              description: 'Select the form to display inside this styled section.',
              condition: (data) => data.blockType === 'form',
            },
          },
          ],
        },

        // ── STYLE TAB ────────────────────────────────────────────────────
        {
          label: 'Style',
          fields: [
            {
              name: 'textAlign',
              type: 'select',
              label: 'Text Alignment',
              defaultValue: 'left',
              options: [
                { label: 'Left',    value: 'left' },
                { label: 'Center',  value: 'center' },
                { label: 'Right',   value: 'right' },
                { label: 'Justify', value: 'justify' },
              ],
            },
            // ── Typography ───────────────────────────────────────────────
            {
              type: 'collapsible',
              label: 'Typography',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'fontFamily',     type: 'text', label: 'Font Family' },
                    { name: 'fontSize',       type: 'text', label: 'Font Size',       admin: { placeholder: '16px' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'fontWeight',     type: 'text', label: 'Font Weight',     admin: { placeholder: '400' } },
                    { name: 'lineHeight',     type: 'text', label: 'Line Height',     admin: { placeholder: '1.5' } },
                  ],
                },
                {
                  name: 'letterSpacing',
                  type: 'text',
                  label: 'Letter Spacing',
                  admin: { placeholder: '0em' },
                },
                {
                  name: 'paragraphSpacing',
                  type: 'text',
                  label: 'Paragraph Spacing',
                  admin: { placeholder: '16px' },
                },
              ],
            },
            // ── Text Shadow ──────────────────────────────────────────────
            {
              type: 'collapsible',
              label: 'Text Shadow',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'textShadowX',     type: 'text', label: 'X', admin: { placeholder: '0px' } },
                    { name: 'textShadowY',     type: 'text', label: 'Y', admin: { placeholder: '0px' } },
                    { name: 'textShadowBlur',  type: 'text', label: 'Blur', admin: { placeholder: '0px' } },
                  ],
                },
                { name: 'textShadowColor', type: 'text', label: 'Color', admin: { placeholder: '#000000' } },
              ],
            },
            // ── Colors ───────────────────────────────────────────────────
            {
              type: 'collapsible',
              label: 'Colors',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'textColorNormal', type: 'text', label: 'Text Color',       admin: { placeholder: '#000000' } },
                    { name: 'textColorHover',  type: 'text', label: 'Text Color Hover', admin: { placeholder: '#000000' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'linkColorNormal', type: 'text', label: 'Link Color',       admin: { placeholder: '#0000EE' } },
                    { name: 'linkColorHover',  type: 'text', label: 'Link Color Hover', admin: { placeholder: '#0000EE' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'backgroundColor', type: 'text', label: 'Background Color', admin: { placeholder: 'transparent' } },
                    { name: 'borderRadius',     type: 'text', label: 'Border Radius',    admin: { placeholder: '0px' } },
                  ],
                },
              ],
            },
            // ── Custom CSS ───────────────────────────────────────────────
            {
              name: 'customCSS',
              type: 'textarea',
              label: 'Custom CSS',
              admin: {
                description: 'Additional CSS rules for this block',
                placeholder: '.my-block { ... }',
              },
            },
          ],
        },

        // ── ADVANCED TAB ─────────────────────────────────────────────────
        {
          label: 'Advanced',
          fields: [
            // ── Spacing ──────────────────────────────────────────────────
            {
              type: 'collapsible',
              label: 'Padding',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'paddingTop',    type: 'text', label: 'Top',    admin: { placeholder: '0px' } },
                    { name: 'paddingRight',  type: 'text', label: 'Right',  admin: { placeholder: '0px' } },
                    { name: 'paddingBottom', type: 'text', label: 'Bottom', admin: { placeholder: '0px' } },
                    { name: 'paddingLeft',   type: 'text', label: 'Left',   admin: { placeholder: '0px' } },
                  ],
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Margin',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'marginTop',    type: 'text', label: 'Top',    admin: { placeholder: '0px' } },
                    { name: 'marginRight',  type: 'text', label: 'Right',  admin: { placeholder: '0px' } },
                    { name: 'marginBottom', type: 'text', label: 'Bottom', admin: { placeholder: '0px' } },
                    { name: 'marginLeft',   type: 'text', label: 'Left',   admin: { placeholder: '0px' } },
                  ],
                },
              ],
            },
            // ── Layout ───────────────────────────────────────────────────
            {
              type: 'row',
              fields: [
                { name: 'width',    type: 'text',   label: 'Width',    admin: { placeholder: '100%' } },
                { name: 'position', type: 'select', label: 'Position', defaultValue: 'relative',
                  options: [
                    { label: 'Static',   value: 'static' },
                    { label: 'Relative', value: 'relative' },
                    { label: 'Absolute', value: 'absolute' },
                    { label: 'Fixed',    value: 'fixed' },
                    { label: 'Sticky',   value: 'sticky' },
                  ],
                },
                { name: 'zIndex', type: 'number', label: 'Z-Index', admin: { placeholder: '0' } },
              ],
            },
            // ── Identity ─────────────────────────────────────────────────
            {
              type: 'row',
              fields: [
                { name: 'cssClassName', type: 'text', label: 'CSS Class',   admin: { placeholder: 'my-block' } },
                { name: 'htmlId',       type: 'text', label: 'HTML ID',     admin: { placeholder: 'section-id' } },
              ],
            },
            // ── Responsive visibility ────────────────────────────────────
            {
              type: 'collapsible',
              label: 'Responsive Visibility',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'hideOnMobile',  type: 'checkbox', label: 'Hide on Mobile',  defaultValue: false },
                    { name: 'hideOnTablet',  type: 'checkbox', label: 'Hide on Tablet',  defaultValue: false },
                    { name: 'hideOnDesktop', type: 'checkbox', label: 'Hide on Desktop', defaultValue: false },
                  ],
                },
              ],
            },
          ],
        },
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

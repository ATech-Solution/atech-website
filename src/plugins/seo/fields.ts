import type { Field } from 'payload'

export function buildSeoFields(_collectionSlug: string): Field {
  return {
    type: 'tabs',
    tabs: [
      {
        label: 'SEO',
        fields: [
          // ── Traditional SEO ─────────────────────────────────────────────────
          {
            name: 'meta',
            type: 'group',
            label: 'Search Engine',
            fields: [
              {
                name: 'title',
                type: 'text',
                label: 'Meta Title',
                localized: true,
                admin: {
                  description: 'Recommended 50–60 characters',
                  components: {
                    afterInput: [`@/components/admin/SeoGenerateButton#SeoGenerateButton`],
                  },
                },
              },
              {
                name: 'description',
                type: 'textarea',
                label: 'Meta Description',
                localized: true,
                admin: {
                  description: 'Recommended 150–160 characters',
                  components: {
                    afterInput: [`@/components/admin/SeoGenerateButton#SeoGenerateButton`],
                  },
                },
              },
              {
                name: 'image',
                type: 'upload',
                label: 'OG Image',
                relationTo: 'media',
              },
              {
                name: 'noIndex',
                type: 'checkbox',
                label: 'Hide from search engines (noindex)',
                defaultValue: false,
                admin: {
                  description: 'Excludes this page from sitemap and sets noindex/nofollow',
                },
              },
              {
                name: 'canonical',
                type: 'text',
                label: 'Canonical URL',
                admin: {
                  description: 'Leave blank to auto-generate from page URL',
                  placeholder: 'https://atech.software/custom-path',
                },
              },
              {
                name: 'ogTitle',
                type: 'text',
                label: 'Social Title',
                localized: true,
                admin: {
                  description: 'Used for Facebook/LinkedIn sharing (defaults to Meta Title if blank)',
                  components: {
                    afterInput: [`@/components/admin/SeoGenerateButton#SeoGenerateButton`],
                  },
                },
              },
              {
                name: 'ogDescription',
                type: 'textarea',
                label: 'Social Description',
                localized: true,
                admin: {
                  description: 'Used for social sharing cards (defaults to Meta Description if blank)',
                  components: {
                    afterInput: [`@/components/admin/SeoGenerateButton#SeoGenerateButton`],
                  },
                },
              },
            ],
          },

          // ── LLM SEO ─────────────────────────────────────────────────────────
          {
            name: 'seo',
            type: 'group',
            label: 'AI & LLM',
            fields: [
              {
                name: 'llmsEntry',
                type: 'textarea',
                label: 'llms.txt Summary',
                localized: true,
                admin: {
                  description: 'One plain-English sentence describing this page for AI tools (ChatGPT, Perplexity, Claude)',
                  components: {
                    afterInput: [`@/components/admin/SeoGenerateButton#SeoGenerateButton`],
                  },
                },
              },
              {
                name: 'topics',
                type: 'array',
                label: 'Topic Clusters',
                admin: {
                  description: 'Semantic topic tags for AI crawlers and internal search',
                },
                fields: [
                  {
                    name: 'topic',
                    type: 'text',
                    required: true,
                  },
                ],
              },
              {
                name: 'contentType',
                type: 'select',
                label: 'Content Type',
                options: [
                  { label: 'Landing Page', value: 'landing' },
                  { label: 'Article / Blog Post', value: 'article' },
                  { label: 'Job Listing', value: 'job' },
                  { label: 'Portfolio / Case Study', value: 'portfolio' },
                  { label: 'FAQ', value: 'faq' },
                ],
              },
              {
                name: 'targetAudience',
                type: 'text',
                label: 'Target Audience',
                admin: {
                  description: 'Brief description of intended reader, e.g. "CTOs at Series A startups"',
                },
              },
            ],
          },
        ],
      },
    ],
  }
}

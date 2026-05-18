import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const JobVacancies: CollectionConfig = {
  slug: 'job-vacancies',
  labels: { singular: 'Job Vacancy', plural: 'Job Vacancies' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'positionType', 'category', 'status', 'updatedAt'],
    group: 'Content',
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    // ── Title / Position ───────────────────────────────────────────────────
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Job Title / Position',
    },

    {
      type: 'row',
      fields: [
        // ── Position Type ────────────────────────────────────────────────────
        {
          name: 'positionType',
          type: 'select',
          required: true,
          label: 'Position Type',
          defaultValue: 'full-time',
          options: [
            { label: 'Full-time',  value: 'full-time'  },
            { label: 'Part-time',  value: 'part-time'  },
            { label: 'Contract',   value: 'contract'   },
            { label: 'Remote',     value: 'remote'     },
            { label: 'Internship', value: 'internship' },
            { label: 'Freelance',  value: 'freelance'  },
          ],
        },

        // ── Vacancy Category ─────────────────────────────────────────────────
        {
          name: 'category',
          type: 'text',
          label: 'Vacancy Category',
          admin: {
            placeholder: 'e.g. Engineering, Design, Marketing',
          },
        },
      ],
    },

    // ── Location ───────────────────────────────────────────────────────────
    {
      name: 'location',
      type: 'text',
      label: 'Location',
      admin: {
        placeholder: 'e.g. Hong Kong, Remote',
      },
    },

    // ── Excerpt (shown in block listing) ───────────────────────────────────
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Short Description (shown in job listing block)',
      admin: {
        description: 'One or two lines shown in the jobs-list block. Keep it brief.',
        placeholder: 'We are looking for a talented engineer to join our team…',
      },
    },

    // ── Full Description (rich text) ───────────────────────────────────────
    {
      name: 'description',
      type: 'richText',
      label: 'Full Job Description',
      editor: lexicalEditor({}),
    },

    // ── Apply CTA ─────────────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'applyLabel',
          type: 'text',
          label: 'Apply Button Label',
          defaultValue: 'Apply Now',
        },
        {
          name: 'applyUrl',
          type: 'text',
          label: 'Apply Button URL',
          admin: { placeholder: 'https://forms.google.com/…' },
        },
      ],
    },

    // ── Status ────────────────────────────────────────────────────────────
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Status',
      defaultValue: 'active',
      options: [
        { label: 'Active',  value: 'active'  },
        { label: 'Closed',  value: 'closed'  },
      ],
      admin: {
        position: 'sidebar',
      },
    },

    // ── Sort Order ────────────────────────────────────────────────────────
    {
      name: 'order',
      type: 'number',
      label: 'Display Order',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first in the listing.',
      },
    },
  ],
}

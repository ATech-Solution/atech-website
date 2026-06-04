import type { CollectionConfig } from 'payload'

export const QuoteRequests: CollectionConfig = {
  slug: 'quote-requests',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['firstName', 'lastName', 'email', 'serviceType', 'calculatedCost', 'createdAt'],
    group: 'CRM',
  },
  access: {
    read:   ({ req }) => !!req.user,
    create: () => true,   // API submits without auth
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    // ── Contact info ───────────────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        { name: 'firstName',  type: 'text',  required: true,  label: 'First Name' },
        { name: 'lastName',   type: 'text',  required: false, label: 'Last Name' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email',  type: 'email', required: true,  label: 'Email' },
        { name: 'phone',  type: 'text',  required: false, label: 'Phone' },
      ],
    },
    { name: 'company', type: 'text', required: false, label: 'Company' },

    // ── Service selections ─────────────────────────────────────────────────────
    {
      name: 'serviceType',
      type: 'select',
      label: 'Service Type',
      options: [
        { label: 'Web Development',    value: 'Web Development' },
        { label: 'Mobile Development', value: 'Mobile Development' },
        { label: 'IT Consulting',      value: 'IT Consulting' },
        { label: 'HR Recruitment',     value: 'HR Recruitment' },
        { label: 'Cloud Solutions',    value: 'Cloud Solutions' },
      ],
    },
    { name: 'serviceSelected', type: 'text', label: 'Service Sub-type' },
    {
      name: 'developmentTime',
      type: 'select',
      label: 'Development Timeline',
      options: [
        { label: '1–3 months',  value: '1–3 months' },
        { label: '3–6 months',  value: '3–6 months' },
        { label: '6–12 months', value: '6–12 months' },
        { label: '12+ months',  value: '12+ months' },
      ],
    },

    // ── Calculated estimate ────────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        { name: 'itemsCount',        type: 'number', label: 'Items (deliverables)' },
        { name: 'calculatedCost',    type: 'number', label: 'Estimated Cost (HKD)' },
        { name: 'maintenanceFee',    type: 'number', label: 'Monthly Maintenance (HKD)' },
      ],
    },

    // ── Project details ────────────────────────────────────────────────────────
    {
      name: 'projectDetails',
      type: 'textarea',
      required: true,
      label: 'Project Details',
    },

    // ── Internal status ────────────────────────────────────────────────────────
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      label: 'Status',
      options: [
        { label: 'New',         value: 'new' },
        { label: 'Reviewing',   value: 'reviewing' },
        { label: 'Quoted',      value: 'quoted' },
        { label: 'Won',         value: 'won' },
        { label: 'Lost',        value: 'lost' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Internal Notes',
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
}

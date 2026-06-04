import type { Block, Config, Field, Plugin } from 'payload'
import { formBuilderPlugin as payloadFormBuilderPlugin } from '@payloadcms/plugin-form-builder'

// ─── Options ─────────────────────────────────────────────────────────────────

export interface FormBuilderPluginOptions {
  /** Unique slug used to identify this plugin in the Plugins collection. Default: 'form-builder' */
  slug?: string
  /** Display name shown in the Plugins collection. Default: 'Form Builder' */
  name?: string
  /** Semantic version string. Default: '1.0.0' */
  version?: string
  /** Author / organization name. Default: 'ATech' */
  author?: string
  /** Human-readable description shown in the admin. */
  description?: string
  /** Admin email to send form submissions to. Falls back to ADMIN_EMAIL env var. */
  defaultToEmail?: string
  /** Toggle individual field types for the form builder. */
  fields?: {
    text?: boolean
    textarea?: boolean
    select?: boolean
    email?: boolean
    state?: boolean
    country?: boolean
    checkbox?: boolean
    number?: boolean
    message?: boolean
    payment?: boolean
  }
}

// ─── Lead scoring helper ──────────────────────────────────────────────────────

function calcScore(
  submissionData: Array<{ field: string; value: string }>,
  scoring: {
    enabled: boolean
    completenessWeight?: number
    fieldWeights?: Array<{ fieldName: string; matchValue: string; points: number }>
  },
): { score: number; breakdown: string } {
  if (!scoring.enabled) return { score: 0, breakdown: '' }

  const total    = submissionData.length
  const filled   = submissionData.filter((d) => d.value?.trim()).length
  const cWeight  = scoring.completenessWeight ?? 10
  const completenessScore = total > 0 ? Math.round((filled / total) * cWeight) : 0

  let fieldWeightScore = 0
  const rulesMatched: string[] = []
  for (const rule of scoring.fieldWeights ?? []) {
    const hit = submissionData.find((d) => d.field === rule.fieldName && d.value === rule.matchValue)
    if (hit) {
      fieldWeightScore += rule.points ?? 0
      rulesMatched.push(`${rule.fieldName}="${rule.matchValue}" +${rule.points}pts`)
    }
  }

  const score = Math.min(100, completenessScore + fieldWeightScore)
  const breakdown = JSON.stringify({
    completenessScore,
    fieldWeightScore,
    completenessRatio: total > 0 ? (filled / total).toFixed(2) : '0',
    rulesMatched,
  })

  return { score, breakdown }
}

// ─── Custom form field block types ───────────────────────────────────────────

const STEP_SEPARATOR_BLOCK: Block = {
  slug: 'stepSeparator',
  labels: { singular: 'Step Break', plural: 'Step Breaks' },
  fields: [
    { name: 'stepLabel',       type: 'text', label: 'Step Title',               required: true  },
    { name: 'stepDescription', type: 'text', label: 'Step Description (optional)'                },
  ],
}

const SCALE_BLOCK: Block = {
  slug: 'scale',
  labels: { singular: 'Scale / NPS Field', plural: 'Scale / NPS Fields' },
  fields: [
    { name: 'name',        type: 'text',     label: 'Field Name (unique)',          required: true  },
    { name: 'label',       type: 'text',     label: 'Question Label'                               },
    { name: 'required',    type: 'checkbox', label: 'Required',                    defaultValue: true },
    { name: 'scaleMin',    type: 'number',   label: 'Min Value',                   defaultValue: 0   },
    { name: 'scaleMax',    type: 'number',   label: 'Max Value',                   defaultValue: 10  },
    { name: 'minLabel',    type: 'text',     label: 'Min Label',                   defaultValue: 'Not at all' },
    { name: 'maxLabel',    type: 'text',     label: 'Max Label',                   defaultValue: 'Extremely likely' },
    { name: 'scoreWeight', type: 'number',   label: 'Score Weight (multiplier)',   defaultValue: 1, min: 0 },
    { name: 'width',       type: 'number',   label: 'Width (%)',                   defaultValue: 100 },
  ],
}

// ─── Additional fields injected into `forms` ─────────────────────────────────

const SCORING_FIELDS: Field[] = [
  {
    name: 'scoring',
    type: 'group',
    label: 'Lead Scoring',
    fields: [
      {
        name: 'enabled',
        type: 'checkbox',
        label: 'Enable Lead Scoring',
        defaultValue: false,
      },
      {
        name: 'completenessWeight',
        type: 'number',
        label: 'Completeness Weight (max 30 pts)',
        defaultValue: 10,
        min: 0,
        max: 30,
        admin: {
          description: 'Points awarded when all fields are filled in (pro-rated)',
        },
      },
      {
        name: 'fieldWeights',
        type: 'array',
        label: 'Field Weight Rules',
        admin: {
          description: 'Award extra points when a field matches a specific value',
        },
        fields: [
          { name: 'fieldName',  type: 'text',   label: 'Field Name',   required: true },
          { name: 'matchValue', type: 'text',   label: 'Match Value',  required: true },
          { name: 'points',     type: 'number', label: 'Points (0–50)', min: 0, max: 50, defaultValue: 10 },
        ],
      },
    ],
  },
]

// ─── Additional fields injected into `form-submissions` ──────────────────────

const SUBMISSION_EXTRA_FIELDS: Field[] = [
  {
    name: 'status',
    type: 'select',
    label: 'Status',
    defaultValue: 'new',
    options: [
      { label: 'New',       value: 'new'       },
      { label: 'In Review', value: 'in-review' },
      { label: 'Contacted', value: 'contacted' },
      { label: 'Closed',    value: 'closed'    },
    ],
    admin: { position: 'sidebar' },
  },
  {
    name: 'statusUpdatedAt',
    type: 'date',
    label: 'Status Updated At',
    admin: { readOnly: true, position: 'sidebar' },
  },
  {
    name: 'score',
    type: 'number',
    label: 'Lead Score',
    min: 0,
    max: 100,
    admin: { readOnly: true, description: 'Auto-calculated (0–100)', position: 'sidebar' },
  },
  {
    name: 'scoreBreakdown',
    type: 'textarea',
    label: 'Score Breakdown',
    admin: { readOnly: true, description: 'Scoring detail (JSON)', position: 'sidebar' },
  },
]

// ─── beforeChange hook injected into `form-submissions` ──────────────────────

const submissionBeforeChange = async ({ data, req, operation, originalDoc }: any) => {
  // Status timestamp
  if (data.status && data.status !== (originalDoc?.status ?? 'new')) {
    data.statusUpdatedAt = new Date().toISOString()
  }

  // Lead scoring — only on create
  if (operation === 'create') {
    const formId = typeof data.form === 'object' ? (data.form as any)?.id : data.form
    if (formId) {
      try {
        const form = await req.payload.findByID({ collection: 'forms', id: String(formId), depth: 1 })
        const scoring = (form as any)?.scoring
        if (scoring) {
          const { score, breakdown } = calcScore(data.submissionData ?? [], scoring)
          if (score > 0) {
            data.score         = score
            data.scoreBreakdown = breakdown
          }
        }
      } catch {
        // non-fatal — scoring failure never blocks a submission
      }
    }
  }

  return data
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export const formBuilderPlugin = (options: FormBuilderPluginOptions = {}): Plugin =>
  (incomingConfig: Config): Config => {
    const {
      slug           = 'form-builder',
      name           = 'Form Builder',
      version        = '1.0.0',
      author         = 'ATech',
      description    = 'Drag-and-drop form builder with scoring, status tracking, and analytics.',
      defaultToEmail = process.env.ADMIN_EMAIL ?? 'dev@atech.software',
      fields         = {
        text:     true,
        textarea: true,
        select:   true,
        email:    true,
        state:    false,
        country:  false,
        checkbox: true,
        number:   true,
        message:  true,
        payment:  false,
      },
    } = options

    // Base Payload form builder plugin
    const configWithForms = payloadFormBuilderPlugin({
      fields,
      defaultToEmail,
    })(incomingConfig)

    // ── Post-process generated collections to inject extra fields + hooks ──
    const patchedCollections = (configWithForms.collections ?? []).map((col) => {
      if (col.slug === 'forms') {
        // Inject stepSeparator + scale block types into the plugin-managed 'fields' blocks array
        const patchedFormFields = (col.fields ?? []).map((f: any) => {
          if (f.name === 'fields' && f.type === 'blocks') {
            return { ...f, blocks: [...(f.blocks ?? []), STEP_SEPARATOR_BLOCK, SCALE_BLOCK] }
          }
          return f
        })
        return {
          ...col,
          fields: [...patchedFormFields, ...SCORING_FIELDS],
        }
      }

      if (col.slug === 'form-submissions') {
        return {
          ...col,
          fields: [...(col.fields ?? []), ...SUBMISSION_EXTRA_FIELDS],
          hooks: {
            ...col.hooks,
            beforeChange: [
              ...(col.hooks?.beforeChange ?? []),
              submissionBeforeChange,
            ],
          },
        }
      }

      return col
    })

    return {
      ...configWithForms,
      collections: patchedCollections,

      onInit: async (payload) => {
        if (configWithForms.onInit) await configWithForms.onInit(payload)

        if (process.env.NEXT_PHASE === 'phase-production-build') return

        try {
          const existing = await payload.find({
            collection: 'plugins',
            where: { slug: { equals: slug } },
            limit: 1,
          })

          if (existing.totalDocs === 0) {
            await payload.create({
              collection: 'plugins',
              data: {
                name,
                slug,
                pluginType: 'built-in',
                category: 'utility',
                status: 'active',
                version,
                author,
                description,
                autoActivate: true,
                features: [
                  {
                    featureName: 'Forms Collection',
                    featureDescription: 'Drag-and-drop form builder with configurable field types',
                    featureType: 'collection',
                  },
                  {
                    featureName: 'Form Submissions Collection',
                    featureDescription: 'Stores all form submission data with per-field values',
                    featureType: 'collection',
                  },
                  {
                    featureName: 'Lead Scoring',
                    featureDescription: 'Auto-scores submissions based on completeness + field-value rules',
                    featureType: 'script',
                  },
                  {
                    featureName: 'Submission Status Tracking',
                    featureDescription: 'New → In Review → Contacted → Closed pipeline',
                    featureType: 'script',
                  },
                ],
              },
            })

            payload.logger.info(`✅ ${name} seeded into Plugins collection.`)
          }
        } catch (err) {
          payload.logger.warn(`⚠ ${name} seed skipped: ${(err as Error).message}`)
        }
      },
    }
  }

/**
 * Seed script: Website Satisfaction Survey (10 NPS questions, 6 steps)
 * Run: npx tsx src/scripts/seed-satisfaction-survey.ts
 */

import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// @ts-ignore — NODE_ENV assignment needed for script context
;(process.env as any).NODE_ENV = 'development'
process.env.PAYLOAD_CONFIG_PATH = path.resolve(__dirname, '../payload.config.ts')

import payload from 'payload'
import configPromise from '../payload.config.js'

async function seed() {
  await payload.init({ config: configPromise })

  const SLUG = 'website-satisfaction-survey'

  // Skip if already exists
  const existing = await payload.find({ collection: 'forms', where: { slug: { equals: SLUG } }, limit: 1 }).catch(() => null)
  if ((existing?.totalDocs ?? 0) > 0) {
    console.log('✅ Satisfaction survey already exists — skipping.')
    process.exit(0)
  }

  // Build fields array
  // Pattern: stepSeparator first (labels step 1), then scale fields, repeat
  const fields: any[] = [
    // ── Step 1: Overall Experience ────────────────────────────────────────────
    {
      blockType:       'stepSeparator',
      stepLabel:       'Overall Experience',
      stepDescription: 'Share your overall impression of working with ATech.',
    },
    {
      blockType:    'scale',
      name:         'nps_recommend',
      label:        'How likely are you to recommend ATech to a friend or colleague?',
      required:     true,
      scaleMin:     0,
      scaleMax:     10,
      minLabel:     'Not at all likely',
      maxLabel:     'Extremely likely',
      scoreWeight:  1,
      width:        100,
    },
    {
      blockType:    'scale',
      name:         'nps_overall',
      label:        'How satisfied are you with your overall experience with ATech?',
      required:     true,
      scaleMin:     0,
      scaleMax:     10,
      minLabel:     'Very dissatisfied',
      maxLabel:     'Very satisfied',
      scoreWeight:  1,
      width:        100,
    },

    // ── Step 2: Design & Usability ────────────────────────────────────────────
    {
      blockType:       'stepSeparator',
      stepLabel:       'Design & Usability',
      stepDescription: 'Tell us about the look and feel of our website.',
    },
    {
      blockType:    'scale',
      name:         'nps_design',
      label:        'How visually appealing is our website?',
      required:     true,
      scaleMin:     0,
      scaleMax:     10,
      minLabel:     'Not at all',
      maxLabel:     'Extremely appealing',
      scoreWeight:  1,
      width:        100,
    },
    {
      blockType:    'scale',
      name:         'nps_navigation',
      label:        'How easy was it to navigate and find information on our website?',
      required:     true,
      scaleMin:     0,
      scaleMax:     10,
      minLabel:     'Very difficult',
      maxLabel:     'Very easy',
      scoreWeight:  1,
      width:        100,
    },

    // ── Step 3: Content & Information ─────────────────────────────────────────
    {
      blockType:       'stepSeparator',
      stepLabel:       'Content & Information',
      stepDescription: 'Help us understand how well our content serves you.',
    },
    {
      blockType:    'scale',
      name:         'nps_content',
      label:        'How clear and informative is the content on our website?',
      required:     true,
      scaleMin:     0,
      scaleMax:     10,
      minLabel:     'Very unclear',
      maxLabel:     'Very clear',
      scoreWeight:  1,
      width:        100,
    },
    {
      blockType:    'scale',
      name:         'nps_services',
      label:        'How well does our website communicate the services we offer?',
      required:     true,
      scaleMin:     0,
      scaleMax:     10,
      minLabel:     'Poorly',
      maxLabel:     'Extremely well',
      scoreWeight:  1,
      width:        100,
    },

    // ── Step 4: Performance ───────────────────────────────────────────────────
    {
      blockType:       'stepSeparator',
      stepLabel:       'Performance',
      stepDescription: 'Rate the technical performance of our website.',
    },
    {
      blockType:    'scale',
      name:         'nps_speed',
      label:        'How satisfied are you with the website loading speed?',
      required:     true,
      scaleMin:     0,
      scaleMax:     10,
      minLabel:     'Very slow',
      maxLabel:     'Lightning fast',
      scoreWeight:  1,
      width:        100,
    },
    {
      blockType:    'scale',
      name:         'nps_mobile',
      label:        'How well does the website perform on your device?',
      required:     true,
      scaleMin:     0,
      scaleMax:     10,
      minLabel:     'Poorly',
      maxLabel:     'Perfectly',
      scoreWeight:  1,
      width:        100,
    },

    // ── Step 5: Support & Contact ─────────────────────────────────────────────
    {
      blockType:       'stepSeparator',
      stepLabel:       'Support & Contact',
      stepDescription: "Let us know how we're doing on accessibility and response.",
    },
    {
      blockType:    'scale',
      name:         'nps_contact',
      label:        'How easy is it to find our contact information?',
      required:     true,
      scaleMin:     0,
      scaleMax:     10,
      minLabel:     'Very hard',
      maxLabel:     'Very easy',
      scoreWeight:  1,
      width:        100,
    },
    {
      blockType:    'scale',
      name:         'nps_response',
      label:        'How satisfied are you with our communication and response time?',
      required:     true,
      scaleMin:     0,
      scaleMax:     10,
      minLabel:     'Very dissatisfied',
      maxLabel:     'Very satisfied',
      scoreWeight:  1,
      width:        100,
    },

    // ── Step 6: Your Details ──────────────────────────────────────────────────
    {
      blockType:       'stepSeparator',
      stepLabel:       'Your Details',
      stepDescription: "Almost done! Leave your info so we can follow up if needed.",
    },
    {
      blockType:    'text',
      name:         'fullName',
      label:        'Full Name',
      required:     true,
      width:        100,
    },
    {
      blockType:    'email',
      name:         'email',
      label:        'Email Address',
      required:     true,
      width:        100,
    },
    {
      blockType:    'textarea',
      name:         'comment',
      label:        'Any additional comments? (optional)',
      required:     false,
      width:        100,
    },
  ]

  const form = await payload.create({
    collection: 'forms',
    data: {
      title:              'Website Satisfaction Survey',
      submitButtonLabel:  'Submit Survey',
      confirmationType:   'message',
      confirmationMessage: {
        root: {
          type: 'root',
          children: [{
            type: 'paragraph',
            version: 1,
            children: [{ type: 'text', text: "Thank you for your valuable feedback! We'll use it to keep improving." }],
          }],
          direction: 'ltr', format: '', indent: 0, version: 1,
        },
      },
      fields,
      scoring: {
        enabled:             true,
        completenessWeight:  20,
        fieldWeights:        [],
      },
    } as any,
  })

  console.log(`✅ Satisfaction survey created — ID: ${form.id}`)
  process.exit(0)
}

seed().catch(err => { console.error(err); process.exit(1) })

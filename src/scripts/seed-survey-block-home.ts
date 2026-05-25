/**
 * Seed script: Add SurveySection block to home page layoutBuilder
 * Run: npx tsx src/scripts/seed-survey-block-home.ts
 */

import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// @ts-ignore
;(process.env as any).NODE_ENV = 'development'
process.env.PAYLOAD_CONFIG_PATH = path.resolve(__dirname, '../payload.config.ts')

import payload from 'payload'
import configPromise from '../payload.config.js'

async function seed() {
  await payload.init({ config: configPromise })

  const page = await payload.findByID({ collection: 'pages', id: 1 })

  const layoutBuilder: any[] = Array.isArray((page as any).layoutBuilder)
    ? (page as any).layoutBuilder
    : []

  // Skip if survey-section already present
  if (layoutBuilder.some((b: any) => b.blockType === 'survey-section')) {
    console.log('✅ survey-section already on home page — skipping.')
    process.exit(0)
  }

  const surveyBlock = {
    id:        `survey-section-home`,
    blockType: 'survey-section',
    title:     'How are we doing?',
    subtitle:  'Rate your experience with ATech. Your feedback shapes everything we build — and takes less than 3 minutes.',
  }

  await payload.update({
    collection: 'pages',
    id:         1,
    data:       { layoutBuilder: [...layoutBuilder, surveyBlock] } as any,
  })

  console.log('✅ survey-section block added to home page.')
  process.exit(0)
}

seed().catch(err => { console.error(err); process.exit(1) })

import archiver from 'archiver'
import fs from 'fs'
import path from 'path'
import type { Payload } from 'payload'
import { buildWhereFilter } from '../utils/buildWhereFilter'
import { docsToCsv } from '../utils/csvConverter'

interface Filter {
  status?: string
  dateFrom?: string
  dateTo?: string
}

interface ExportOptions {
  payload: Payload
  collections: string[]
  globals: string[]
  filters?: Record<string, Filter>
  includeMedia?: boolean
}

const MEDIA_DIR = path.resolve(process.cwd(), 'public/media')

// Recursively collect filename strings from a Payload document
function collectMediaFilenames(doc: any, filenames: Set<string>) {
  if (!doc || typeof doc !== 'object') return

  if (Array.isArray(doc)) {
    for (const item of doc) collectMediaFilenames(item, filenames)
    return
  }

  for (const [key, value] of Object.entries(doc)) {
    if (key === 'filename' && typeof value === 'string') {
      filenames.add(value)
    } else {
      collectMediaFilenames(value, filenames)
    }
  }
}

export async function exportCollections(opts: ExportOptions): Promise<Buffer> {
  const { payload, collections, globals, filters = {}, includeMedia = true } = opts

  const allDocsMap: Record<string, any[]> = {}
  const allGlobalsMap: Record<string, any> = {}
  const mediaFilenames = new Set<string>()

  // ── Fetch collections ─────────────────────────────────────────────────────
  for (const slug of collections) {
    try {
      const where = buildWhereFilter(filters[slug])
      const result = await payload.find({
        collection: slug as any,
        where,
        limit: 0, // 0 = no limit (Payload returns all)
        depth: 1,
      })
      allDocsMap[slug] = result.docs
      if (includeMedia) {
        for (const doc of result.docs) collectMediaFilenames(doc, mediaFilenames)
      }
    } catch (err) {
      payload.logger.warn(`[Export] Skipping collection "${slug}": ${(err as Error).message}`)
      allDocsMap[slug] = []
    }
  }

  // ── Fetch globals ─────────────────────────────────────────────────────────
  for (const slug of globals) {
    try {
      const doc = await payload.findGlobal({ slug: slug as any, depth: 1 })
      allGlobalsMap[slug] = doc
      if (includeMedia) collectMediaFilenames(doc, mediaFilenames)
    } catch (err) {
      payload.logger.warn(`[Export] Skipping global "${slug}": ${(err as Error).message}`)
    }
  }

  // ── Build ZIP ─────────────────────────────────────────────────────────────
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    const archive = archiver('zip', { zlib: { level: 6 } })

    archive.on('data', (chunk: Buffer) => chunks.push(chunk))
    archive.on('end', () => resolve(Buffer.concat(chunks)))
    archive.on('error', reject)

    // manifest.json
    const manifest = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      collections: Object.keys(allDocsMap).map((slug) => ({
        slug,
        count: allDocsMap[slug].length,
      })),
      globals: Object.keys(allGlobalsMap),
    }
    archive.append(JSON.stringify(manifest, null, 2), { name: 'manifest.json' })

    // json/{slug}.json
    for (const [slug, docs] of Object.entries(allDocsMap)) {
      archive.append(JSON.stringify(docs, null, 2), { name: `json/${slug}.json` })
    }

    // csv/{slug}.csv
    for (const [slug, docs] of Object.entries(allDocsMap)) {
      if (docs.length > 0) {
        archive.append(docsToCsv(docs), { name: `csv/${slug}.csv` })
      }
    }

    // json/globals/{slug}.json
    for (const [slug, data] of Object.entries(allGlobalsMap)) {
      archive.append(JSON.stringify(data, null, 2), { name: `json/globals/${slug}.json` })
    }

    // media files
    if (includeMedia && mediaFilenames.size > 0) {
      for (const filename of mediaFilenames) {
        const filePath = path.join(MEDIA_DIR, filename)
        if (fs.existsSync(filePath)) {
          archive.file(filePath, { name: `media/${filename}` })
        }
      }
    }

    archive.finalize()
  })
}

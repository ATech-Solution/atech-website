import AdmZip from 'adm-zip'
import fs from 'fs'
import path from 'path'
import type { Payload } from 'payload'

interface ImportResult {
  imported: Record<string, number>
  errors: string[]
}

const MEDIA_DIR = path.resolve(process.cwd(), 'public/media')

async function upsertDoc(payload: Payload, collection: string, doc: any): Promise<void> {
  const { id, ...rest } = doc
  try {
    await payload.update({ collection: collection as any, id, data: rest })
  } catch {
    // Document not found — create it
    await payload.create({ collection: collection as any, data: doc })
  }
}

export async function importZip(opts: {
  payload: Payload
  zipBuffer: Buffer
}): Promise<ImportResult> {
  const { payload, zipBuffer } = opts
  const imported: Record<string, number> = {}
  const errors: string[] = []

  let zip: AdmZip
  try {
    zip = new AdmZip(zipBuffer)
  } catch {
    throw new Error('Invalid or corrupted ZIP file')
  }

  // ── Read manifest ─────────────────────────────────────────────────────────
  const manifestEntry = zip.getEntry('manifest.json')
  if (!manifestEntry) throw new Error('ZIP is missing manifest.json')

  let manifest: { version: string; collections: { slug: string }[]; globals: string[] }
  try {
    manifest = JSON.parse(manifestEntry.getData().toString('utf8'))
  } catch {
    throw new Error('manifest.json is not valid JSON')
  }

  // ── Copy media files ──────────────────────────────────────────────────────
  fs.mkdirSync(MEDIA_DIR, { recursive: true })

  for (const entry of zip.getEntries()) {
    if (!entry.entryName.startsWith('media/') || entry.isDirectory) continue
    const filename = path.basename(entry.entryName)
    const destPath = path.join(MEDIA_DIR, filename)

    // Path traversal guard
    if (!destPath.startsWith(MEDIA_DIR)) continue

    try {
      const fileData = entry.getData()
      if (fs.existsSync(destPath)) {
        const existing = fs.statSync(destPath)
        if (existing.size === fileData.length) continue // same size — skip
      }
      fs.writeFileSync(destPath, fileData)
    } catch (err) {
      errors.push(`media/${filename}: ${(err as Error).message}`)
    }
  }

  // ── Helper: import a collection's JSON ────────────────────────────────────
  const importCollection = async (slug: string) => {
    const entry = zip.getEntry(`json/${slug}.json`)
    if (!entry) return

    let docs: any[]
    try {
      docs = JSON.parse(entry.getData().toString('utf8'))
    } catch {
      errors.push(`json/${slug}.json: invalid JSON`)
      return
    }

    imported[slug] = 0
    for (const doc of docs) {
      try {
        await upsertDoc(payload, slug, doc)
        imported[slug]++
      } catch (err) {
        errors.push(`${slug}[${doc.id}]: ${(err as Error).message}`)
      }
    }
  }

  // ── Import media first ────────────────────────────────────────────────────
  if (manifest.collections.some((c) => c.slug === 'media')) {
    await importCollection('media')
  }

  // ── Import content collections ────────────────────────────────────────────
  for (const { slug } of manifest.collections) {
    if (slug === 'media') continue // already done
    await importCollection(slug)
  }

  // ── Import globals ────────────────────────────────────────────────────────
  for (const slug of manifest.globals ?? []) {
    const entry = zip.getEntry(`json/globals/${slug}.json`)
    if (!entry) continue

    try {
      const data = JSON.parse(entry.getData().toString('utf8'))
      const { id: _id, createdAt: _c, updatedAt: _u, globalType: _g, ...rest } = data
      await payload.updateGlobal({ slug: slug as any, data: rest })
      imported[`global:${slug}`] = 1
    } catch (err) {
      errors.push(`global:${slug}: ${(err as Error).message}`)
    }
  }

  return { imported, errors }
}

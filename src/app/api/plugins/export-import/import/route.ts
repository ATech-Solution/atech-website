import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import payloadConfig from '@payload-config'
import { importZip } from '@/plugins/export-import/handlers/importHandler'

const MAX_SIZE = 100 * 1024 * 1024 // 100 MB

export async function POST(req: NextRequest) {
  const payload = await getPayload({ config: payloadConfig })

  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid multipart data' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large (max 100 MB)' }, { status: 413 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const zipBuffer = Buffer.from(arrayBuffer)

  try {
    const result = await importZip({ payload, zipBuffer })
    return NextResponse.json(result)
  } catch (err) {
    console.error('[Import]', err)
    return NextResponse.json({ error: (err as Error).message ?? 'Import failed' }, { status: 400 })
  }
}


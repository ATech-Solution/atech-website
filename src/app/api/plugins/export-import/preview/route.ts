import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import payloadConfig from '@payload-config'
import AdmZip from 'adm-zip'

export async function POST(req: NextRequest) {
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: 'No file' }, { status: 400 })
  }

  try {
    const buf = Buffer.from(await file.arrayBuffer())
    const zip = new AdmZip(buf)
    const entry = zip.getEntry('manifest.json')
    if (!entry) return NextResponse.json({ manifest: null })

    const manifest = JSON.parse(entry.getData().toString('utf8'))
    return NextResponse.json({ manifest })
  } catch {
    return NextResponse.json({ manifest: null })
  }
}

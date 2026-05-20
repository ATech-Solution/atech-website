import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { exportCollections } from '@/plugins/export-import/handlers/exportHandler'
import { EXPORTABLE_COLLECTIONS, EXPORTABLE_GLOBALS } from '@/plugins/exportImportPlugin'

interface ExportBody {
  collections?: string[]
  globals?: string[]
  filters?: Record<string, { status?: string; dateFrom?: string; dateTo?: string }>
  includeMedia?: boolean
}

export async function POST(req: NextRequest) {
  const payload = await getPayload({ config })

  // Auth check — must be logged-in admin
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: ExportBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const collections = (body.collections ?? []).filter((s) => EXPORTABLE_COLLECTIONS.includes(s))
  const globals = (body.globals ?? []).filter((s) => EXPORTABLE_GLOBALS.includes(s))

  if (collections.length === 0 && globals.length === 0) {
    return NextResponse.json(
      { error: 'Select at least one collection or global to export' },
      { status: 400 },
    )
  }

  try {
    const zipBuffer = await exportCollections({
      payload,
      collections,
      globals,
      filters: body.filters ?? {},
      includeMedia: body.includeMedia !== false,
    })

    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    return new NextResponse(zipBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="export-${ts}.zip"`,
        'Content-Length': String(zipBuffer.length),
      },
    })
  } catch (err) {
    console.error('[Export]', err)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}

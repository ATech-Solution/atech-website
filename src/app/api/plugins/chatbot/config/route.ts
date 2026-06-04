import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'chatbot-settings' as any, depth: 5 })
    return NextResponse.json(settings)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch chatbot config' }, { status: 500 })
  }
}

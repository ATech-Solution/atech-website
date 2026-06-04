import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventType, nodeLabel, conversationPath, page, sessionId } = body

    if (!eventType) {
      return NextResponse.json({ error: 'eventType is required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    await payload.create({
      collection: 'chatbot-events' as any,
      data: { eventType, nodeLabel, conversationPath, page, sessionId } as any,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to record event' }, { status: 500 })
  }
}

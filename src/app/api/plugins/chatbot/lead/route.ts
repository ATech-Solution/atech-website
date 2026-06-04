import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, question, conversationPath, page, _honey } = body

    // Honeypot — bots fill hidden fields, humans don't
    if (_honey) {
      return NextResponse.json({ success: true }) // silent discard
    }

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    await payload.create({
      collection: 'chatbot-leads' as any,
      data: { name: name.trim(), email: email.trim(), question, conversationPath, page } as any,
    })

    // ── Email notification ─────────────────────────────────────────────────
    try {
      const settings = await payload.findGlobal({ slug: 'chatbot-settings' as any })
      const notifyEmail = (settings as any)?.notifyEmail
      if (notifyEmail) {
        await (payload as any).sendEmail({
          to: notifyEmail,
          subject: `New chatbot lead: ${name}`,
          html: `
            <h2>New lead from chatbot widget</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Question:</strong> ${question || 'N/A'}</p>
            <p><strong>Conversation path:</strong> ${conversationPath || 'N/A'}</p>
            <p><strong>Page:</strong> ${page || 'N/A'}</p>
          `,
        })
      }
    } catch {
      // Email failure must not break the lead save
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
  }
}

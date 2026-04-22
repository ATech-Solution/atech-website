import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, message } = body

    if (!firstName || !email || !message) {
      return NextResponse.json(
        { error: 'firstName, email, and message are required.' },
        { status: 400 },
      )
    }

    // Get admin notification email from settings
    let adminEmail = process.env.ADMIN_EMAIL ?? 'tan@atech.software'
    try {
      const payload = await getPayload({ config: configPromise })
      const settings = await payload.findGlobal({ slug: 'settings' }) as any
      if (settings?.adminNotificationEmail) {
        adminEmail = settings.adminNotificationEmail
      }
    } catch {
      // Fall through to env default
    }

    const fullName = [firstName, lastName].filter(Boolean).join(' ')
    const subject  = `New contact form submission from ${fullName}`

    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8" /></head>
      <body style="margin:0;padding:0;background:#f5f5f5;font-family:'DM Sans',Helvetica,Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
          <tr>
            <td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;border-top:3px solid #034F98;overflow:hidden;">
                <tr>
                  <td style="padding:40px 48px 32px;">
                    <h2 style="margin:0 0 24px;font-size:20px;font-weight:700;color:#0d1117;">New Contact Form Submission</h2>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#6b7280;font-size:14px;width:120px;">Name</td>
                        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#0d1117;font-size:14px;">${fullName}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#6b7280;font-size:14px;">Email</td>
                        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;"><a href="mailto:${email}" style="color:#034F98;">${email}</a></td>
                      </tr>
                      ${phone ? `
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#6b7280;font-size:14px;">Phone</td>
                        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#0d1117;font-size:14px;">${phone}</td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="padding:10px 0;color:#6b7280;font-size:14px;vertical-align:top;">Message</td>
                        <td style="padding:10px 0;color:#0d1117;font-size:14px;line-height:1.6;">${message.replace(/\n/g, '<br>')}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="background:#f9fafb;padding:16px 48px;border-top:1px solid #e5e7eb;">
                    <p style="margin:0;font-size:12px;color:#9ca3af;">ATech Contact Form — atech.software</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `

    await sendEmail({
      to:      adminEmail,
      subject,
      html,
      replyTo: email,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[contact] Error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

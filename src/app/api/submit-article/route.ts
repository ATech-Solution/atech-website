import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, content, authorName, email, recaptchaToken } = body

    if (!title || !content || !authorName || !email) {
      return NextResponse.json(
        { error: 'title, content, authorName, and email are required.' },
        { status: 400 },
      )
    }

    // ── reCAPTCHA verification ─────────────────────────────────────────────────
    const secretKey = process.env.RECAPTCHA_SECRET_KEY
    if (secretKey) {
      if (!recaptchaToken) {
        return NextResponse.json({ error: 'reCAPTCHA token is required.' }, { status: 400 })
      }
      const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${secretKey}&response=${recaptchaToken}`,
      })
      const verifyData = await verifyRes.json()
      if (!verifyData.success) {
        return NextResponse.json({ error: 'reCAPTCHA verification failed. Please try again.' }, { status: 400 })
      }
    }

    // ── Get admin notification email ───────────────────────────────────────────
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

    const subject = `New article submission: "${title}" from ${authorName}`

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
                    <h2 style="margin:0 0 24px;font-size:20px;font-weight:700;color:#0d1117;">New Article Submission</h2>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#6b7280;font-size:14px;width:130px;vertical-align:top;">Author</td>
                        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#0d1117;font-size:14px;">${authorName}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#6b7280;font-size:14px;vertical-align:top;">Email</td>
                        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;"><a href="mailto:${email}" style="color:#034F98;">${email}</a></td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#6b7280;font-size:14px;vertical-align:top;">Title</td>
                        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#0d1117;font-size:14px;font-weight:600;">${title}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;color:#6b7280;font-size:14px;vertical-align:top;">Content</td>
                        <td style="padding:10px 0;color:#0d1117;font-size:14px;line-height:1.7;white-space:pre-wrap;">${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="background:#f9fafb;padding:16px 48px;border-top:1px solid #e5e7eb;">
                    <p style="margin:0;font-size:12px;color:#9ca3af;">ATech Article Submission — atech.software</p>
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
      to: adminEmail,
      subject,
      html,
      replyTo: email,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[submit-article] Error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

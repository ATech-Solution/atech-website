import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { verifyRecaptcha } from '@/lib/recaptcha'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, recaptchaToken } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: 'name and email are required.' },
        { status: 400 },
      )
    }

    if (!(await verifyRecaptcha(recaptchaToken ?? ''))) {
      return NextResponse.json({ error: 'reCAPTCHA verification failed.' }, { status: 400 })
    }

    // Resolve admin notification email from Settings global, fall back to env
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

    // ── Admin notification email ───────────────────────────────────────────
    await sendEmail({
      to:      adminEmail,
      subject: `New Partnership Inquiry from ${name}`,
      replyTo: email,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8" /></head>
        <body style="margin:0;padding:0;background:#f5f5f5;font-family:'DM Sans',Helvetica,Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;border-top:4px solid #ffd369;overflow:hidden;">
                  <tr>
                    <td style="padding:40px 48px 32px;">
                      <div style="display:inline-block;background:#ffd369;border-radius:8px;padding:8px 16px;margin-bottom:24px;">
                        <span style="font-size:12px;font-weight:700;color:#171717;letter-spacing:0.08em;text-transform:uppercase;">Partnership Inquiry</span>
                      </div>
                      <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0d1117;">New Partnership Request</h2>
                      <p style="margin:0 0 28px;font-size:14px;color:#6b7280;">Submitted via the Partnership Opportunities form</p>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;color:#6b7280;font-size:14px;width:140px;font-weight:600;">Name</td>
                          <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;color:#0d1117;font-size:14px;">${name}</td>
                        </tr>
                        <tr>
                          <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;color:#6b7280;font-size:14px;font-weight:600;">Email</td>
                          <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-size:14px;">
                            <a href="mailto:${email}" style="color:#034F98;text-decoration:none;">${email}</a>
                          </td>
                        </tr>
                        ${phone ? `
                        <tr>
                          <td style="padding:12px 0;color:#6b7280;font-size:14px;font-weight:600;">Phone</td>
                          <td style="padding:12px 0;color:#0d1117;font-size:14px;">${phone}</td>
                        </tr>
                        ` : ''}
                      </table>
                      <div style="margin-top:28px;padding:16px 20px;background:#fffbeb;border-radius:6px;border-left:3px solid #ffd369;">
                        <p style="margin:0;font-size:13px;color:#92400e;">Reply directly to this email to respond to ${name}.</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="background:#f9fafb;padding:16px 48px;border-top:1px solid #e5e7eb;">
                      <p style="margin:0;font-size:12px;color:#9ca3af;">ATech Partnership Form — atech.software</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    })

    // ── Confirmation email to submitter ────────────────────────────────────
    await sendEmail({
      to:      email,
      subject: 'We received your partnership inquiry — ATech',
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8" /></head>
        <body style="margin:0;padding:0;background:#f5f5f5;font-family:'DM Sans',Helvetica,Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;border-top:4px solid #ffd369;">
                  <tr>
                    <td style="padding:48px 48px 32px;text-align:center;">
                      <div style="display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:50%;background:#ffd369;margin-bottom:24px;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12l5 5 9-10" stroke="#171717" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                      <h2 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#0d1117;">Thanks, ${name}!</h2>
                      <p style="margin:0 0 28px;font-size:15px;color:#6b7280;line-height:1.6;max-width:400px;margin-left:auto;margin-right:auto;">
                        We've received your partnership inquiry and our team will review it shortly. We typically respond within 1–2 business days.
                      </p>
                      <div style="background:#f9fafb;border-radius:8px;padding:20px 24px;text-align:left;margin-bottom:28px;">
                        <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#9ca3af;letter-spacing:0.08em;text-transform:uppercase;">Your submission</p>
                        <p style="margin:0 0 4px;font-size:14px;color:#374151;"><strong>Name:</strong> ${name}</p>
                        <p style="margin:0 0 4px;font-size:14px;color:#374151;"><strong>Email:</strong> ${email}</p>
                        ${phone ? `<p style="margin:0;font-size:14px;color:#374151;"><strong>Phone:</strong> ${phone}</p>` : ''}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="background:#171717;padding:24px 48px;text-align:center;">
                      <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#ffd369;">ATech Software</p>
                      <p style="margin:0;font-size:12px;color:#9ca3af;">atech.software · Building the future, together.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[partnership] Error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

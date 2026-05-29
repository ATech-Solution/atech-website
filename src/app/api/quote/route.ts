import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { verifyRecaptcha } from '@/lib/recaptcha'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      serviceType,
      serviceSelected,
      developmentTime,
      projectDetails,
      recaptchaToken,
      // Calculated fields from the client-side calculator
      itemsCount,
      calculatedCost,
      maintenanceFee,
    } = body

    if (!firstName || !email || !projectDetails) {
      return NextResponse.json(
        { error: 'firstName, email, and projectDetails are required.' },
        { status: 400 },
      )
    }

    if (!(await verifyRecaptcha(recaptchaToken ?? ''))) {
      return NextResponse.json({ error: 'reCAPTCHA verification failed.' }, { status: 400 })
    }

    // ── Persist to Payload collection ─────────────────────────────────────────
    const payload = await getPayload({ config: configPromise })
    try {
      await payload.create({
        collection: 'quote-requests',
        data: {
          firstName,
          lastName:        lastName   ?? '',
          email,
          phone:           phone      ?? '',
          company:         company    ?? '',
          serviceType:     serviceType     ?? '',
          serviceSelected: serviceSelected ?? '',
          developmentTime: developmentTime ?? '',
          itemsCount:      itemsCount     ? Number(itemsCount)     : undefined,
          calculatedCost:  calculatedCost  ? Number(calculatedCost)  : undefined,
          maintenanceFee:  maintenanceFee  ? Number(maintenanceFee)  : undefined,
          projectDetails,
          status: 'new',
        },
      })
    } catch (saveErr) {
      console.warn('[quote] Could not save to DB:', saveErr)
      // Non-fatal — continue to send email anyway
    }

    // ── Get admin notification email from settings ──────────────────────────
    let adminEmail = process.env.ADMIN_EMAIL ?? 'tan@atech.software'
    try {
      const settings = await payload.findGlobal({ slug: 'settings' }) as any
      if (settings?.adminNotificationEmail) {
        adminEmail = settings.adminNotificationEmail
      }
    } catch {
      // Fall through to env default
    }

    const fullName = [firstName, lastName].filter(Boolean).join(' ')
    const subject  = `New quote request from ${fullName}`

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
                    <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0d1117;">New Quote Request</h2>
                    <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">Submitted via the Get a Custom Quote form</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#6b7280;font-size:14px;width:160px;">Name</td>
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
                      ${company ? `
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#6b7280;font-size:14px;">Company</td>
                        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#0d1117;font-size:14px;">${company}</td>
                      </tr>
                      ` : ''}
                      ${serviceType ? `
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#6b7280;font-size:14px;">Service Type</td>
                        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#0d1117;font-size:14px;">${serviceType}</td>
                      </tr>
                      ` : ''}
                      ${serviceSelected ? `
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#6b7280;font-size:14px;">Service Plan</td>
                        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#0d1117;font-size:14px;">${serviceSelected}</td>
                      </tr>
                      ` : ''}
                      ${developmentTime ? `
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#6b7280;font-size:14px;">Timeline</td>
                        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#0d1117;font-size:14px;">${developmentTime}</td>
                      </tr>
                      ` : ''}
                      ${(itemsCount || calculatedCost || maintenanceFee) ? `
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#6b7280;font-size:14px;">Estimate</td>
                        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#0d1117;font-size:14px;">
                          Items: ${itemsCount ?? '—'} &nbsp;|&nbsp;
                          Cost: HKD ${calculatedCost ? Number(calculatedCost).toLocaleString() : '—'} &nbsp;|&nbsp;
                          Maintenance: HKD ${maintenanceFee ? Number(maintenanceFee).toLocaleString() : '—'}/mo
                        </td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="padding:10px 0;color:#6b7280;font-size:14px;vertical-align:top;">Project Details</td>
                        <td style="padding:10px 0;color:#0d1117;font-size:14px;line-height:1.6;">${projectDetails.replace(/\n/g, '<br>')}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="background:#f9fafb;padding:16px 48px;border-top:1px solid #e5e7eb;">
                    <p style="margin:0;font-size:12px;color:#9ca3af;">ATech Quote Form — atech.software</p>
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
    console.error('[quote] Error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

/**
 * Email utility — SMTP via nodemailer (AWS SES or any SMTP provider)
 *
 * Bypass mode: when SMTP_USER is not set, all send calls are
 * silently skipped and logged to stdout instead of throwing.
 * This keeps local development and CI working without any credentials.
 */

import nodemailer from 'nodemailer'
import type { Transporter, SendMailOptions } from 'nodemailer'
import type { EmailAdapter } from 'payload'

// ── Config ─────────────────────────────────────────────────────────────────
// Supports generic SMTP env vars (SMTP_*) with AWS SES fallback names

const SMTP_HOST    = process.env.SMTP_HOST     ?? process.env.AWS_SES_SMTP_HOST     ?? 'email-smtp.ap-southeast-1.amazonaws.com'
const SMTP_PORT    = parseInt(process.env.SMTP_PORT ?? process.env.AWS_SES_SMTP_PORT ?? '465', 10)
const SMTP_USER    = process.env.SMTP_USER     ?? process.env.AWS_SES_SMTP_USER     ?? ''
const SMTP_PASS    = process.env.SMTP_PASSWORD ?? process.env.AWS_SES_SMTP_PASSWORD ?? ''
const FROM_ADDRESS = process.env.EMAIL_FROM    ?? 'noreply@atech.com'
const FROM_NAME    = process.env.EMAIL_FROM_NAME ?? 'ATech'

/** True when SMTP credentials are present — emails are actually sent. */
export const emailEnabled = Boolean(SMTP_USER && SMTP_PASS)

// ── Transporter (lazy singleton) ───────────────────────────────────────────

let _transporter: Transporter | null = null

function getTransporter(): Transporter {
  if (_transporter) return _transporter

  _transporter = nodemailer.createTransport({
    host:   SMTP_HOST,
    port:   SMTP_PORT,
    secure: SMTP_PORT === 465,       // TLS on 465, STARTTLS on 587
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })

  return _transporter
}

// ── Public API ─────────────────────────────────────────────────────────────

export interface EmailOptions {
  to:       string | string[]
  subject:  string
  html:     string
  text?:    string
  replyTo?: string
  cc?:      string | string[]
  bcc?:     string | string[]
}

/**
 * Send an email via AWS SES.
 * When email is disabled (no SES credentials) the call is a no-op —
 * the payload is logged instead so devs can inspect it.
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!emailEnabled) {
    console.log('[email] ⚠️  SMTP not configured — email bypassed.')
    console.log('[email] Would have sent:', {
      to:      options.to,
      subject: options.subject,
    })
    return false
  }

  const mailOptions: SendMailOptions = {
    from:    `"${FROM_NAME}" <${FROM_ADDRESS}>`,
    to:      options.to,
    subject: options.subject,
    html:    options.html,
    text:    options.text ?? stripHtml(options.html),
    replyTo: options.replyTo,
    cc:      options.cc,
    bcc:     options.bcc,
  }

  try {
    const info = await getTransporter().sendMail(mailOptions)
    console.log(`[email] ✅ Sent — messageId: ${info.messageId}`)
    return true
  } catch (err) {
    console.error('[email] ❌ Failed to send email:', err)
    return false
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────

/** Naive HTML → plain-text strip for the `text` fallback. */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

// ── Payload CMS email adapter ──────────────────────────────────────────────
// Conforms to Payload v3 EmailAdapter<T> = ({ payload }) => { name, defaultFromAddress, defaultFromName, sendEmail }
// Pass directly to the `email:` field inside buildConfig().

export const payloadEmailAdapter: EmailAdapter = () => ({
  name:               'atech-ses',
  defaultFromAddress: FROM_ADDRESS,
  defaultFromName:    FROM_NAME,

  sendEmail: async (message) => {
    if (!emailEnabled) {
      console.log('[email] ⚠️  SMTP not configured — email bypassed.')
      console.log('[email] Would have sent:', { to: message.to, subject: message.subject })
      return
    }

    const info = await getTransporter().sendMail({
      from: message.from ?? `"${FROM_NAME}" <${FROM_ADDRESS}>`,
      ...message,
    })
    console.log(`[email] ✅ Sent — messageId: ${info.messageId}`)
  },
})

/**
 * Email utility — SMTP via nodemailer
 *
 * Priority order for SMTP config:
 *   1. Settings global in DB (when smtpEnabled = true)
 *   2. Environment variables (SMTP_* / AWS_SES_SMTP_*)
 *
 * Bypass mode: when no credentials are found, all send calls are
 * logged to stdout and skipped rather than throwing.
 */

import nodemailer from 'nodemailer'
import type { Transporter, SendMailOptions } from 'nodemailer'
import type { EmailAdapter } from 'payload'

// ── Environment-variable defaults ─────────────────────────────────────────────

const ENV_HOST    = process.env.SMTP_HOST     ?? process.env.AWS_SES_SMTP_HOST     ?? 'email-smtp.ap-southeast-1.amazonaws.com'
const ENV_PORT    = parseInt(process.env.SMTP_PORT ?? process.env.AWS_SES_SMTP_PORT ?? '465', 10)
const ENV_USER    = process.env.SMTP_USER     ?? process.env.AWS_SES_SMTP_USER     ?? ''
const ENV_PASS    = process.env.SMTP_PASSWORD ?? process.env.AWS_SES_SMTP_PASSWORD ?? ''
const ENV_FROM    = process.env.EMAIL_FROM      ?? 'noreply@atech.com'
const ENV_FROM_NAME = process.env.EMAIL_FROM_NAME ?? 'ATech'

export const emailEnabled = Boolean(ENV_USER && ENV_PASS)

// ── Transporter cache (one per config signature) ──────────────────────────────

let _transporter: Transporter | null = null
let _transporterKey = ''

interface SmtpConfig {
  host:     string
  port:     number
  secure:   boolean
  user:     string
  pass:     string
  fromAddr: string
  fromName: string
}

function buildTransporter(cfg: SmtpConfig): Transporter {
  const key = `${cfg.host}:${cfg.port}:${cfg.user}`
  if (_transporter && _transporterKey === key) return _transporter

  _transporter = nodemailer.createTransport({
    host:   cfg.host,
    port:   cfg.port,
    secure: cfg.secure,
    auth:   { user: cfg.user, pass: cfg.pass },
  })
  _transporterKey = key
  return _transporter
}

// ── Resolve SMTP config (DB takes priority over env) ─────────────────────────

export async function resolveSmtpConfig(): Promise<SmtpConfig | null> {
  // Try DB settings first (avoids circular import by lazy-requiring payload)
  try {
    // Dynamic import so this module is still usable in edge/non-Node contexts
    const { getPayload } = await import('payload')
    const { default: configPromise } = await import('@payload-config')
    const payload = await getPayload({ config: configPromise })
    const settings = await payload.findGlobal({ slug: 'settings' }) as any

    if (settings?.smtpEnabled && settings?.smtpUser && settings?.smtpPassword) {
      return {
        host:     settings.smtpHost    || ENV_HOST,
        port:     settings.smtpPort    || ENV_PORT,
        secure:   settings.smtpSecure  ?? true,
        user:     settings.smtpUser,
        pass:     settings.smtpPassword,
        fromAddr: settings.fromEmail   || ENV_FROM,
        fromName: settings.fromName    || ENV_FROM_NAME,
      }
    }
  } catch {
    // DB not available — fall through to env vars
  }

  if (!ENV_USER || !ENV_PASS) return null

  return {
    host:     ENV_HOST,
    port:     ENV_PORT,
    secure:   ENV_PORT === 465,
    user:     ENV_USER,
    pass:     ENV_PASS,
    fromAddr: ENV_FROM,
    fromName: ENV_FROM_NAME,
  }
}

// ── Public send API ───────────────────────────────────────────────────────────

export interface EmailOptions {
  to:       string | string[]
  subject:  string
  html:     string
  text?:    string
  replyTo?: string
  cc?:      string | string[]
  bcc?:     string | string[]
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const cfg = await resolveSmtpConfig()

  if (!cfg) {
    console.log('[email] ⚠️  No SMTP credentials — email bypassed.')
    console.log('[email] Would have sent:', { to: options.to, subject: options.subject })
    return false
  }

  const transporter = buildTransporter(cfg)
  const mailOptions: SendMailOptions = {
    from:    `"${cfg.fromName}" <${cfg.fromAddr}>`,
    to:      options.to,
    subject: options.subject,
    html:    options.html,
    text:    options.text ?? stripHtml(options.html),
    replyTo: options.replyTo,
    cc:      options.cc,
    bcc:     options.bcc,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log(`[email] ✅ Sent — messageId: ${info.messageId}`)
    return true
  } catch (err) {
    console.error('[email] ❌ Failed to send email:', err)
    return false
  }
}

// ── Payload CMS email adapter ─────────────────────────────────────────────────

export const payloadEmailAdapter: EmailAdapter = () => ({
  name:               'atech-smtp',
  defaultFromAddress: ENV_FROM,
  defaultFromName:    ENV_FROM_NAME,

  sendEmail: async (message) => {
    const cfg = await resolveSmtpConfig()

    if (!cfg) {
      console.log('[email] ⚠️  No SMTP credentials — email bypassed.')
      console.log('[email] Would have sent:', { to: message.to, subject: message.subject })
      return
    }

    const transporter = buildTransporter(cfg)
    const info = await transporter.sendMail({
      from: message.from ?? `"${cfg.fromName}" <${cfg.fromAddr}>`,
      ...message,
    })
    console.log(`[email] ✅ Sent — messageId: ${info.messageId}`)
  },
})

// ── Helpers ───────────────────────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

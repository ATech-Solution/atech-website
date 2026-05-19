import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import crypto from 'crypto'

export interface TotpSetup {
  secret: string
  otpauthUrl: string
  qrDataUrl: string
}

export async function generateSecret(email: string, issuer = 'ATech'): Promise<TotpSetup> {
  const generated = speakeasy.generateSecret({
    name: `${issuer}:${email}`,
    issuer,
    length: 32,
  })

  const secret = generated.base32!
  const otpauthUrl = generated.otpauth_url!
  const qrDataUrl = await QRCode.toDataURL(otpauthUrl)

  return { secret, otpauthUrl, qrDataUrl }
}

export function verifyToken(secret: string, token: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1,  // allow 1 step tolerance (±30 seconds)
  })
}

export function generateBackupCodes(count = 8): string[] {
  return Array.from({ length: count }, () =>
    crypto.randomBytes(4).toString('hex').toUpperCase(),
  )
}

export function hashCode(code: string): string {
  return crypto.createHash('sha256').update(code.toUpperCase()).digest('hex')
}

export function verifyBackupCode(code: string, hashes: string[]): { valid: boolean; index: number } {
  const h = hashCode(code)
  const index = hashes.indexOf(h)
  return { valid: index !== -1, index }
}

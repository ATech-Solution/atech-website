import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { verifyToken, verifyBackupCode, hashCode } from '@/plugins/security/twoFactor'
import { logEvent } from '@/plugins/security/auditLogger'

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const payload = await getPayload({ config })
    const body = await req.json()
    const { token } = body as { token: string }

    if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 })

    const { user } = await payload.auth({ headers: req.headers })
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const fullUser = await payload.findByID({
      collection: 'users',
      id: user.id as any,
    }) as any

    const secret: string = fullUser?.twoFactorSecret
    if (!secret) return NextResponse.json({ error: '2FA not configured' }, { status: 400 })

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

    // Try TOTP token first
    if (verifyToken(secret, token)) {
      await logEvent({ action: '2fa-verified', userId: user.id, ip, payload })
      const res = NextResponse.json({ success: true })
      res.cookies.set('2fa-verified', '1', {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 8 * 60 * 60,  // 8 hours, matches token expiration
        path: '/',
      })
      return res
    }

    // Try backup code
    const storedCodes: Array<{ code: string }> = fullUser?.twoFactorBackupCodes ?? []
    const hashes = storedCodes.map((c) => c.code)
    const { valid, index } = verifyBackupCode(token, hashes)

    if (valid) {
      // Invalidate used backup code
      const updated = storedCodes.filter((_, i) => i !== index)
      await payload.update({
        collection: 'users',
        id: user.id as any,
        data: { twoFactorBackupCodes: updated } as any,
      })
      await logEvent({ action: '2fa-verified', userId: user.id, ip, details: { method: 'backup-code' }, payload })
      const res = NextResponse.json({ success: true })
      res.cookies.set('2fa-verified', '1', { httpOnly: true, sameSite: 'lax', maxAge: 8 * 60 * 60, path: '/' })
      return res
    }

    return NextResponse.json({ error: 'Invalid code' }, { status: 401 })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

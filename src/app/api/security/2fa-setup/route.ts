import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { generateSecret, generateBackupCodes, hashCode } from '@/plugins/security/twoFactor'
import { logEvent } from '@/plugins/security/auditLogger'

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const payload = await getPayload({ config })

    // Authenticate via cookie/bearer
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const setup = await generateSecret(user.email ?? String(user.id))
    const backupCodes = generateBackupCodes(8)
    const hashedCodes = backupCodes.map(hashCode)

    // Save secret + hashed backup codes to user (hidden fields)
    await payload.update({
      collection: 'users',
      id: user.id as any,
      data: {
        twoFactorSecret: setup.secret,
        twoFactorBackupCodes: hashedCodes.map((code) => ({ code })),
      } as any,
    })

    await logEvent({
      action: '2fa-enabled',
      userId: user.id,
      ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown',
      payload,
    })

    return NextResponse.json({
      qrDataUrl: setup.qrDataUrl,
      otpauthUrl: setup.otpauthUrl,
      backupCodes,  // shown once — user must save these
    })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { clearLockout } from '@/plugins/security/loginProtection'
import { logEvent } from '@/plugins/security/auditLogger'

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: req.headers })

    if (!user || (user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 })
    }

    const body = await req.json()
    const { ip } = body as { ip: string }
    if (!ip) return NextResponse.json({ error: 'IP required' }, { status: 400 })

    await clearLockout(ip, payload)
    await logEvent({
      action: 'ip-unlocked',
      userId: user.id,
      ip,
      details: { unlockedBy: user.id, targetIp: ip },
      payload,
    })

    return NextResponse.json({ success: true, message: `Lockout for ${ip} cleared.` })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

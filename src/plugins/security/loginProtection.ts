import type { Payload } from 'payload'
import { logEvent } from './auditLogger'

export interface LockoutSettings {
  loginMaxAttempts: number
  loginLockoutMinutes: number
}

export async function recordFailedLogin(
  ip: string,
  userId: string | undefined,
  payload: Payload,
): Promise<void> {
  try {
    const existing = await payload.find({
      collection: 'security-events' as any,
      where: {
        and: [
          { eventType: { equals: 'failed-login' } },
          { ip: { equals: ip } },
          { resolved: { equals: false } },
        ],
      },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      const record = existing.docs[0]
      await (payload as any).db.drizzle
        .update((payload as any).db.tables['security_events'])
        .set({ count: ((record as any).count ?? 1) + 1 })
        .where((payload as any).db.drizzle.eq(
          (payload as any).db.tables['security_events'].id,
          record.id,
        ))
        .catch(() => {
          // fallback: use payload update
          payload.update({
            collection: 'security-events' as any,
            id: record.id as any,
            data: { count: ((record as any).count ?? 1) + 1 },
          }).catch(() => {})
        })
    } else {
      await payload.create({
        collection: 'security-events' as any,
        data: {
          eventType: 'failed-login',
          ip,
          userId: userId ?? null,
          count: 1,
          resolved: false,
        },
      })
    }

    await logEvent({ action: 'failed-login', userId, ip, payload })
  } catch {
    // Non-fatal
  }
}

export async function checkLockout(
  ip: string,
  settings: LockoutSettings,
  payload: Payload,
): Promise<{ locked: boolean; remainingMs: number; count: number }> {
  try {
    const record = await payload.find({
      collection: 'security-events' as any,
      where: {
        and: [
          { eventType: { equals: 'failed-login' } },
          { ip: { equals: ip } },
          { resolved: { equals: false } },
        ],
      },
      limit: 1,
    })

    if (record.totalDocs === 0) return { locked: false, remainingMs: 0, count: 0 }

    const doc = record.docs[0] as any
    const count = doc.count ?? 1
    const maxAttempts = settings.loginMaxAttempts ?? 5
    const lockoutMs = (settings.loginLockoutMinutes ?? 15) * 60 * 1000

    if (count < maxAttempts) return { locked: false, remainingMs: 0, count }

    // Check if lockout has expired
    const updatedAt = new Date(doc.updatedAt ?? doc.createdAt).getTime()
    const expiresAt = updatedAt + lockoutMs
    const now = Date.now()

    if (now >= expiresAt) {
      // Auto-clear expired lockout
      await clearLockout(ip, payload)
      return { locked: false, remainingMs: 0, count: 0 }
    }

    return { locked: true, remainingMs: expiresAt - now, count }
  } catch {
    return { locked: false, remainingMs: 0, count: 0 }
  }
}

export async function clearLockout(ip: string, payload: Payload): Promise<void> {
  try {
    const records = await payload.find({
      collection: 'security-events' as any,
      where: {
        and: [
          { eventType: { equals: 'failed-login' } },
          { ip: { equals: ip } },
        ],
      },
      limit: 100,
    })
    for (const doc of records.docs) {
      await payload.update({
        collection: 'security-events' as any,
        id: doc.id as any,
        data: { resolved: true },
      })
    }
  } catch {
    // Non-fatal
  }
}

// Registers afterOperation login/logout audit hooks on users collection
export function buildLoginHooks(payload: Payload, settings: LockoutSettings) {
  const col = payload.config.collections?.find((c) => c.slug === 'users')
  if (!col) return

  const existing = col.hooks?.afterOperation ?? []
  col.hooks = {
    ...col.hooks,
    afterOperation: [
      ...existing,
      async ({ operation, result, req }) => {
        if (operation !== 'login') return result
        const ip = req.headers?.get?.('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
        await clearLockout(ip, payload)
        await logEvent({ action: 'login', userId: (result as any)?.id, ip, payload })
        return result
      },
    ],
  }
}

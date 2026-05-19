import type { Payload } from 'payload'

interface LogEventOptions {
  action: 'login' | 'logout' | 'failed-login' | 'create' | 'update' | 'delete' | 'ip-blocked' | '2fa-enabled' | '2fa-verified' | 'ip-unlocked'
  collection?: string
  documentId?: string | number
  userId?: string | number
  ip?: string
  userAgent?: string
  details?: Record<string, unknown>
  payload: Payload
}

export async function logEvent(opts: LogEventOptions): Promise<void> {
  const { action, collection, documentId, userId, ip, userAgent, details, payload } = opts
  try {
    await payload.create({
      collection: 'audit-logs' as any,
      data: {
        action,
        collection: collection ?? null,
        documentId: documentId ? String(documentId) : null,
        user: userId ?? null,
        ip: ip ?? null,
        userAgent: userAgent ?? null,
        details: details ?? null,
      } as any,
    })
  } catch {
    // Audit log failure is non-fatal — never block the main operation
  }
}

// Registers afterOperation hooks on the given collection slugs to log create/update/delete
export function buildAuditHooks(payload: Payload, collectionSlug: string) {
  const col = payload.config.collections?.find((c) => c.slug === collectionSlug)
  if (!col) return

  const existing = col.hooks?.afterOperation ?? []
  col.hooks = {
    ...col.hooks,
    afterOperation: [
      ...existing,
      async ({ operation, result, req }) => {
        if (!['create', 'update', 'delete'].includes(operation)) return result
        const ip = req.headers?.get?.('x-forwarded-for')?.split(',')[0]?.trim()
          ?? req.headers?.get?.('x-real-ip')
          ?? 'unknown'
        const userAgent = req.headers?.get?.('user-agent') ?? undefined
        await logEvent({
          action: operation as 'create' | 'update' | 'delete',
          collection: collectionSlug,
          documentId: (result as any)?.id,
          userId: req.user?.id,
          ip,
          userAgent,
          payload,
        })
        return result
      },
    ],
  }
}

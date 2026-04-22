/**
 * Resolves collection-level CRUD permissions from the Settings global.
 *
 * Admins always have full access regardless of Settings.
 * Falls back to a permissive default if Settings can't be loaded.
 */

import type { Access } from 'payload'

type Operation = 'read' | 'create' | 'update' | 'delete'

// Defaults applied when no rule is found for the collection
const DEFAULTS: Record<Operation, string[]> = {
  read:   ['admin', 'editor', 'viewer'],
  create: ['admin', 'editor'],
  update: ['admin', 'editor'],
  delete: ['admin'],
}

async function getAllowedRoles(collectionSlug: string, operation: Operation): Promise<string[]> {
  try {
    const { getPayload } = await import('payload')
    const { default: configPromise } = await import('@payload-config')
    const payload = await getPayload({ config: configPromise })
    const settings = await payload.findGlobal({ slug: 'settings' }) as any
    const rules: any[] = settings?.accessControl ?? []
    const rule = rules.find((r: any) => r.collection === collectionSlug)

    if (!rule) return DEFAULTS[operation]

    const fieldMap: Record<Operation, string> = {
      read:   'canRead',
      create: 'canCreate',
      update: 'canUpdate',
      delete: 'canDelete',
    }

    const allowed = rule[fieldMap[operation]]
    return Array.isArray(allowed) && allowed.length > 0 ? allowed : DEFAULTS[operation]
  } catch {
    return DEFAULTS[operation]
  }
}

/**
 * Returns a Payload Access function that checks the Settings-driven role list.
 *
 * Usage:
 *   access: {
 *     read:   settingsAccess('pages', 'read'),
 *     create: settingsAccess('pages', 'create'),
 *     ...
 *   }
 */
export function settingsAccess(collectionSlug: string, operation: Operation): Access {
  return async ({ req }) => {
    if (!req.user) return false

    // Admins always have full access
    if (req.user.role === 'admin') return true

    const allowed = await getAllowedRoles(collectionSlug, operation)
    return allowed.includes(req.user.role)
  }
}

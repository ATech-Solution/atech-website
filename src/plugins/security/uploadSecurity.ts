import type { Payload } from 'payload'
import { logEvent } from './auditLogger'

const BLOCKED_MIMES = new Set([
  'application/x-msdownload',
  'application/x-sh',
  'application/x-php',
  'application/x-perl',
  'application/x-python-code',
  'application/x-ruby',
  'application/x-bat',
  'application/x-msdos-program',
])

const BLOCKED_EXTENSIONS = new Set([
  '.exe', '.sh', '.php', '.php3', '.php4', '.php5', '.phtml',
  '.pl', '.py', '.rb', '.bat', '.cmd', '.com', '.vbs', '.jar',
  '.war', '.ear', '.jsp', '.asp', '.aspx', '.htaccess',
])

export interface UploadValidationResult {
  ok: boolean
  reason?: string
}

export function sanitizeFilename(name: string): string {
  return name
    .replace(/\.\./g, '')          // path traversal
    .replace(/\0/g, '')            // null bytes
    .replace(/[<>:"|?*]/g, '')     // Windows-illegal chars
    .replace(/\s+/g, '-')          // spaces → dashes
    .toLowerCase()
}

function hasDoubleExtension(filename: string): boolean {
  const parts = filename.split('.')
  if (parts.length < 3) return false
  const secondLast = `.${parts[parts.length - 2].toLowerCase()}`
  return BLOCKED_EXTENSIONS.has(secondLast)
}

export function sanitizeSvg(content: string): string {
  return content
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/&#(x?)[0-9a-fA-F]+;/g, '')
}

export function validateUpload(
  mimeType: string,
  filename: string,
): UploadValidationResult {
  const ext = filename.includes('.')
    ? `.${filename.split('.').pop()!.toLowerCase()}`
    : ''

  if (BLOCKED_MIMES.has(mimeType)) {
    return { ok: false, reason: `File type "${mimeType}" is not allowed.` }
  }

  if (BLOCKED_EXTENSIONS.has(ext)) {
    return { ok: false, reason: `File extension "${ext}" is not allowed.` }
  }

  if (hasDoubleExtension(filename)) {
    return { ok: false, reason: 'Double-extension filenames are not allowed.' }
  }

  return { ok: true }
}

export function registerUploadHooks(payload: Payload) {
  const col = payload.config.collections?.find((c) => c.slug === 'media')
  if (!col) return

  const existingBefore = col.hooks?.beforeOperation ?? []
  col.hooks = {
    ...col.hooks,
    beforeOperation: [
      ...existingBefore,
      async ({ operation, args, req }) => {
        if (operation !== 'create') return args

        const file = req.file ?? (args as any)?.file
        if (!file) return args

        const mime = file.mimetype ?? ''
        const filename = file.name ?? ''

        const result = validateUpload(mime, filename)
        if (!result.ok) {
          const ip = req.headers?.get?.('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
          await logEvent({
            action: 'create',
            collection: 'media',
            ip,
            details: { blocked: true, reason: result.reason, filename, mime },
            payload,
          })
          await payload.create({
            collection: 'security-events' as any,
            data: {
              eventType: 'upload-rejected',
              ip,
              userId: req.user?.id ? String(req.user.id) : null,
              endpoint: '/api/media',
              count: 1,
              resolved: false,
            },
          }).catch(() => {})
          throw new Error(result.reason)
        }

        // Sanitize filename
        if (file.name) {
          file.name = sanitizeFilename(filename)
        }

        // Sanitize SVG content
        if (mime === 'image/svg+xml' && file.data) {
          const original = file.data.toString('utf8')
          const sanitized = sanitizeSvg(original)
          file.data = Buffer.from(sanitized, 'utf8')
          file.size = file.data.length
        }

        return args
      },
    ],
  }
}

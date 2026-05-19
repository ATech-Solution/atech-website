import type { Config, Plugin } from 'payload'
import { registerUploadHooks } from './security/uploadSecurity'
import { buildLoginHooks, checkLockout, recordFailedLogin } from './security/loginProtection'
import { buildAuditHooks } from './security/auditLogger'
import { registerIpFilterHook, seedIpCache } from './security/ipFilter'

const name        = 'Security Plugin'
const slug        = 'security'
const version     = '1.0.0'
const author      = 'ATech'
const description = 'Full-stack security bundle: brute-force protection, 2FA, upload security, audit logs, IP filtering, API rate limiting, and security headers.'

export interface SecurityPluginOptions {
  auditCollections?: string[]
}

export const securityPlugin = (options: SecurityPluginOptions = {}): Plugin =>
  (incomingConfig: Config): Config => {
    const {
      auditCollections = ['pages', 'posts', 'portfolio', 'media', 'users', 'job-vacancies'],
    } = options

    return {
      ...incomingConfig,

      onInit: async (payload) => {
        if (incomingConfig.onInit) await incomingConfig.onInit(payload)
        if (process.env.NEXT_PHASE === 'phase-production-build') return

        // ── Self-seed into Plugins collection ──────────────────────────────
        try {
          const existing = await payload.find({
            collection: 'plugins',
            where: { slug: { equals: slug } },
            limit: 1,
          })
          if (existing.totalDocs === 0) {
            await payload.create({
              collection: 'plugins',
              data: {
                name, slug, pluginType: 'built-in', category: 'utility',
                status: 'active', version, author, description,
                autoActivate: true,
                features: [
                  { featureName: 'Login Brute-Force Protection', featureType: 'hook' },
                  { featureName: 'Two-Factor Authentication (TOTP)', featureType: 'field' },
                  { featureName: 'Upload Security (MIME + SVG)', featureType: 'hook' },
                  { featureName: 'Full Audit Log', featureType: 'hook' },
                  { featureName: 'IP Allowlist / Blocklist', featureType: 'hook' },
                  { featureName: 'API Rate Limiting', featureType: 'hook' },
                  { featureName: 'HTTP Security Headers', featureType: 'hook' },
                  { featureName: 'Security Dashboard', featureType: 'hook' },
                ],
              },
            })
            payload.logger.info(`✅ ${name} seeded into Plugins collection.`)
          }
        } catch (err) {
          payload.logger.warn(`⚠ ${name} seed skipped: ${(err as Error).message}`)
        }

        // ── Seed IP cache file from current settings ────────────────────────
        await seedIpCache(payload)

        // ── Load security settings ──────────────────────────────────────────
        let loginSettings = { loginMaxAttempts: 5, loginLockoutMinutes: 15 }
        try {
          const settings = await payload.findGlobal({ slug: 'settings' }) as any
          loginSettings = {
            loginMaxAttempts:   settings?.loginMaxAttempts   ?? 5,
            loginLockoutMinutes: settings?.loginLockoutMinutes ?? 15,
          }
        } catch {
          // Use defaults if settings not available
        }

        // ── Register upload security hooks ──────────────────────────────────
        registerUploadHooks(payload)

        // ── Register login protection hooks ─────────────────────────────────
        buildLoginHooks(payload, loginSettings)

        // ── Register audit log hooks ────────────────────────────────────────
        for (const colSlug of auditCollections) {
          buildAuditHooks(payload, colSlug)
        }

        // ── Register IP filter hook (refreshes cache on settings change) ────
        registerIpFilterHook(payload)

        // ── Patch login endpoint to check lockout before auth ───────────────
        const usersCol = payload.config.collections?.find((c) => c.slug === 'users')
        if (usersCol) {
          const existingBefore = usersCol.hooks?.beforeOperation ?? []
          usersCol.hooks = {
            ...usersCol.hooks,
            beforeOperation: [
              ...existingBefore,
              async ({ operation, args, req }) => {
                if (operation !== 'login') return args
                const ip = req.headers?.get?.('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
                const { locked, remainingMs } = await checkLockout(ip, loginSettings, payload)
                if (locked) {
                  const mins = Math.ceil(remainingMs / 60_000)
                  throw new Error(
                    `Too many failed login attempts. Please try again in ${mins} minute${mins !== 1 ? 's' : ''}.`,
                  )
                }
                return args
              },
            ],
          }

          // Record failed login attempts
          const existingAfterOp = usersCol.hooks?.afterOperation ?? []
          usersCol.hooks = {
            ...usersCol.hooks,
            afterOperation: [
              ...existingAfterOp,
              async ({ operation, result, req, args }) => {
                if (operation !== 'login') return result
                const ip = req.headers?.get?.('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
                // If result is null/undefined, login failed
                if (!result || !(result as any).token) {
                  await recordFailedLogin(ip, undefined, payload)
                }
                return result
              },
            ],
          }
        }
      },
    }
  }

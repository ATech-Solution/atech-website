import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkRateLimitSync } from '@/plugins/security/rateLimiter'

// Admin and infra paths always bypass maintenance checks
const ADMIN_PREFIXES = ['/admin', '/api', '/_next', '/favicon']

function isAdminPath(pathname: string): boolean {
  return ADMIN_PREFIXES.some((p) => pathname.startsWith(p))
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

interface LocaleConfig {
  isActive: boolean
  autoDetect: boolean
  defaultLocale: string
  activeLocales: { code: string; label: string }[]
}

async function getLocaleConfig(request: NextRequest): Promise<LocaleConfig> {
  try {
    // Always use the actual request origin so local dev calls localhost, not a remote URL
    const origin = request.nextUrl.origin

    const res = await fetch(`${origin}/api/plugins/multilanguage/settings`, {
      cache: 'no-store',
    })

    if (res.ok) return res.json()
  } catch {
    // Fail open — serve default locale silently
  }
  return { isActive: false, autoDetect: false, defaultLocale: 'en', activeLocales: [] }
}

async function isMaintenanceEnabled(request: NextRequest): Promise<boolean> {
  try {
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL_PROD ??
      process.env.NEXT_PUBLIC_SITE_URL_DEV ??
      process.env.NEXT_PUBLIC_SITE_URL ??
      request.nextUrl.origin

    const res = await fetch(`${origin}/api/maintenance-status`, {
      next: { revalidate: 30 },
    })

    if (res.ok) {
      const data = await res.json()
      return Boolean(data?.maintenanceMode)
    }
  } catch {
    // Fail open — never block real traffic on a network/DB error
  }
  return false
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = getClientIp(request)

  // ── 1. Custom admin URL ─────────────────────────────────────────────────────
  // Only activate when ADMIN_PATH is explicitly set to a path OTHER than /admin.
  // When ADMIN_PATH=/admin (the default), both conditions would match the same
  // prefix and every /admin/* route would return 404.
  const customAdminPath = process.env.ADMIN_PATH
  if (customAdminPath && customAdminPath !== '/admin') {
    // Block the default /admin path → 404
    if (pathname.startsWith('/admin')) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    }
    // Rewrite the custom path to the real /admin
    if (pathname.startsWith(customAdminPath)) {
      const rewritten = pathname.replace(customAdminPath, '/admin')
      return NextResponse.rewrite(new URL(rewritten, request.url))
    }
  }

  // ── 2. API rate limiting (edge-safe in-memory) ──────────────────────────────
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/maintenance-status')) {
    const maxReq = parseInt(process.env.API_RATE_LIMIT_MAX ?? '60', 10)
    // Key by pathname so each endpoint gets its own quota; prevents admin-panel
    // page-load bursts (which hit ~10 different endpoints at once) from exhausting
    // a single shared bucket and triggering false 429s.
    const result = checkRateLimitSync(ip, pathname, maxReq)
    if (!result.allowed) {
      return NextResponse.json(
        { error: 'Too Many Requests' },
        {
          status: 429,
          headers: {
            'Retry-After': String(result.retryAfter),
            'X-RateLimit-Limit': String(maxReq),
            'X-RateLimit-Remaining': '0',
          },
        },
      )
    }
  }

  // ── 3. 2FA gate (cookie check — no DB, edge-safe) ──────────────────────────
  if (
    pathname.startsWith('/admin') &&
    !pathname.startsWith('/admin/verify-2fa') &&
    !pathname.startsWith('/admin/login')
  ) {
    const payloadToken = request.cookies.get('payload-token')?.value
    if (payloadToken) {
      try {
        const [, payloadB64] = payloadToken.split('.')
        if (payloadB64) {
          const pad = payloadB64.length % 4
          const padded = pad ? payloadB64 + '='.repeat(4 - pad) : payloadB64
          const claims = JSON.parse(
            Buffer.from(padded, 'base64').toString('utf8'),
          )
          const twoFactorEnabled: boolean = claims?.twoFactorEnabled ?? false
          const verified = request.cookies.get('2fa-verified')?.value === '1'
          if (twoFactorEnabled && !verified) {
            return NextResponse.redirect(new URL('/admin/verify-2fa', request.url))
          }
        }
      } catch {
        // Malformed JWT — let Payload handle auth
      }
    }
  }

  // ── Pass admin / API through ─────────────────────────────────────────────────
  if (isAdminPath(pathname)) return NextResponse.next()

  // ── Locale routing (frontend only) ───────────────────────────────────────────
  // Skip the /maintenance special path and any file requests
  if (!pathname.startsWith('/maintenance') && !pathname.match(/\.[^/]+$/)) {
    const localeConfig = await getLocaleConfig(request)

    // Build supported locales dynamically from CMS settings
    const defaultLocale = localeConfig.defaultLocale || 'en'
    const supportedLocales =
      localeConfig.isActive && localeConfig.activeLocales.length > 0
        ? [...new Set([defaultLocale, ...localeConfig.activeLocales.map((l) => l.code)])]
        : [defaultLocale]

    const firstSegment = pathname.split('/').filter(Boolean)[0] ?? ''

    if (!supportedLocales.includes(firstSegment)) {
      if (localeConfig.isActive) {
        // Detect locale: NEXT_LOCALE cookie > Accept-Language > defaultLocale
        let locale = defaultLocale

        const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
        if (cookieLocale && supportedLocales.includes(cookieLocale)) {
          locale = cookieLocale
        } else if (localeConfig.autoDetect) {
          const acceptLang = request.headers.get('accept-language') ?? ''
          const preferred = acceptLang
            .split(',')
            .map((l) => l.split(';')[0]?.trim().slice(0, 2).toLowerCase())
            .find((c) => c && supportedLocales.includes(c))
          if (preferred) locale = preferred
        }

        // If the path starts with an unrecognised locale-like segment (e.g. /fr/about),
        // strip that segment so we redirect to /{locale}/about instead of /{locale}/fr/about.
        const segments = pathname.split('/').filter(Boolean)
        const strippedPath =
          segments.length > 0 && /^[a-z]{2}(-[a-z]{2,4})?$/.test(segments[0] ?? '')
            ? '/' + segments.slice(1).join('/')
            : pathname
        const localePath = strippedPath === '/' || strippedPath === '' ? '' : strippedPath
        const redirectUrl = new URL(`/${locale}${localePath}`, request.url)
        redirectUrl.search = request.nextUrl.search
        return NextResponse.redirect(redirectUrl, 307)
      } else {
        // Plugin inactive: rewrite to default locale prefix without a visible redirect
        const rewriteUrl = new URL(`/${defaultLocale}${pathname}`, request.url)
        rewriteUrl.search = request.nextUrl.search
        return NextResponse.rewrite(rewriteUrl)
      }
    }
  }

  // ── Maintenance check (frontend only) ────────────────────────────────────────
  const maintenance = await isMaintenanceEnabled(request)

  if (pathname.startsWith('/maintenance')) {
    return maintenance
      ? NextResponse.next()
      : NextResponse.redirect(new URL('/', request.url))
  }

  if (maintenance) {
    return NextResponse.rewrite(new URL('/maintenance', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

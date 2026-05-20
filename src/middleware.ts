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

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Admin and infra paths always bypass maintenance checks
const ADMIN_PREFIXES = ['/admin', '/api', '/_next', '/favicon']

function isAdminPath(pathname: string): boolean {
  return ADMIN_PREFIXES.some((p) => pathname.startsWith(p))
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

  // Admin, API, and Next.js internals pass through unconditionally
  if (isAdminPath(pathname)) return NextResponse.next()

  const maintenance = await isMaintenanceEnabled(request)

  // /maintenance page: show when ON, redirect home when OFF
  if (pathname.startsWith('/maintenance')) {
    return maintenance
      ? NextResponse.next()
      : NextResponse.redirect(new URL('/', request.url))
  }

  // All other frontend pages: rewrite to maintenance page when ON
  if (maintenance) {
    return NextResponse.rewrite(new URL('/maintenance', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

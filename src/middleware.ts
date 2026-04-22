import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Paths that always bypass maintenance mode
const EXCLUDED_PREFIXES = ['/admin', '/api', '/maintenance', '/_next', '/favicon']

function isExcluded(pathname: string): boolean {
  return EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow excluded paths through unconditionally
  if (isExcluded(pathname)) return NextResponse.next()

  // 1. Fast path — env var toggle (instant, no network)
  const envMaintenance = process.env.MAINTENANCE_MODE === 'true'
  if (envMaintenance) {
    return NextResponse.rewrite(new URL('/maintenance', request.url))
  }

  // 2. DB-backed toggle — fetch our lightweight API endpoint
  //    Use absolute URL so it works in both server and edge runtimes
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
      if (data?.maintenanceMode) {
        return NextResponse.rewrite(new URL('/maintenance', request.url))
      }
    }
  } catch {
    // Fail open — if the API is unreachable, never block real traffic
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

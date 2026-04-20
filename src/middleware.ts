import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isUnderConstruction = process.env.MAINTENANCE_MODE === 'true'

  if (isUnderConstruction) {
    const { pathname } = request.nextUrl

    // Allow through: admin panel, API routes, the maintenance page itself, and static assets
    const isExcluded =
      pathname.startsWith('/admin') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/maintenance') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/favicon')

    if (!isExcluded) {
      return NextResponse.rewrite(new URL('/maintenance', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static  (static files)
     * - _next/image   (image optimization)
     * - favicon.ico
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

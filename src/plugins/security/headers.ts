// Security headers for Next.js next.config.ts headers() function.
// CSP is intentionally permissive for Payload admin (unsafe-inline required).

export function buildCsp(): string {
  const directives: Record<string, string> = {
    'default-src':     "'self'",
    'script-src':      "'self' 'unsafe-inline' 'unsafe-eval'",  // Payload admin needs these
    'style-src':       "'self' 'unsafe-inline'",
    'img-src':         "'self' data: blob: https:",
    'font-src':        "'self' data:",
    'connect-src':     "'self' https:",
    'media-src':       "'self' blob:",
    'object-src':      "'none'",
    'base-uri':        "'self'",
    'form-action':     "'self'",
    'frame-ancestors': "'self'",
    'upgrade-insecure-requests': '',
  }

  return Object.entries(directives)
    .map(([key, val]) => (val ? `${key} ${val}` : key))
    .join('; ')
}

export interface SecurityHeadersOptions {
  cspEnabled?: boolean
  cspReportOnly?: boolean
  hstsEnabled?: boolean
}

export function buildSecurityHeaders(
  opts: SecurityHeadersOptions = {},
): Array<{ key: string; value: string }> {
  const { cspEnabled = true, cspReportOnly = false, hstsEnabled = true } = opts

  const headers: Array<{ key: string; value: string }> = [
    { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
    { key: 'X-Content-Type-Options',    value: 'nosniff' },
    { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=(), payment=()' },
    { key: 'X-DNS-Prefetch-Control',    value: 'on' },
  ]

  if (hstsEnabled) {
    headers.push({
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubDomains; preload',
    })
  }

  if (cspEnabled) {
    const cspKey = cspReportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy'
    headers.push({ key: cspKey, value: buildCsp() })
  }

  return headers
}

// Static export — used directly in next.config.ts before DB is available
export const defaultSecurityHeaders = buildSecurityHeaders({
  cspEnabled: true,
  cspReportOnly: false,
  hstsEnabled: true,
})

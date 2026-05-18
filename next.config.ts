import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

// ── Resolve server URL based on NODE_ENV (mirrors payload.config.ts) ────────
const serverURL =
  process.env.NODE_ENV === 'production'
    ? (process.env.PAYLOAD_PUBLIC_SERVER_URL_PROD
        ?? process.env.PAYLOAD_PUBLIC_SERVER_URL
        ?? 'http://localhost:3000')
    : (process.env.PAYLOAD_PUBLIC_SERVER_URL_DEV
        ?? process.env.PAYLOAD_PUBLIC_SERVER_URL
        ?? 'http://localhost:3000')

// Extract hostname from serverURL for Next.js image remotePatterns
function toRemotePattern(url: string) {
  try {
    const parsed = new URL(url)
    return {
      protocol: parsed.protocol.replace(':', '') as 'http' | 'https',
      hostname: parsed.hostname,
      ...(parsed.port ? { port: parsed.port } : {}),
    }
  } catch {
    return null
  }
}

const serverPattern = toRemotePattern(serverURL)

const nextConfig: NextConfig = {
  output: 'standalone', // Critical for self-hosting
  transpilePackages: ['file-type'],

  // ── Rewrites: clean URLs for static pages ──────────────────────────────────
  // Maps /page-name → /static/page-name so CMS slugs and static pages
  // can share the same clean URL space without conflicting.
  async rewrites() {
    const staticPages = [
      'about-us',
      'app-dev-service',
      'contact',
      'faq',
      'forgot-password',
      'get-involved',
      'get-involved-community',
      'hr-recruitment',
      'insight',
      'it-consulting',
      'portfolio',
      'product-development',
      'qa-testing',
      'reset-password',
      'web-dev-service',
      'who-we-serve',
    ]
    return [
      // Simple pages
      ...staticPages.map((slug) => ({
        source: `/${slug}`,
        destination: `/static/${slug}`,
      })),
      // Nested slugs (article/:slug, portfolio/:slug)
      { source: '/article',          destination: '/static/article'          },
      { source: '/article/:slug',    destination: '/static/article/:slug'    },
      { source: '/portfolio/:slug',  destination: '/static/portfolio/:slug'  },
    ]
  },

  // ── Cache headers ────────────────────────────────────────────────────────────
  // HTML pages: never cache — ensures the browser always fetches fresh HTML with
  // current chunk hashes, preventing ChunkLoadError after a new deployment.
  // _next/static chunks: cache forever — safe because filenames are content-hashed.
  async headers() {
    return [
      {
        source: '/((?!_next/static).*)',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },

  images: {
    unoptimized: process.env.NODE_ENV === 'production',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'www.figma.com',
      },
      // Allow images served from the configured server (for media uploads)
      ...(serverPattern ? [serverPattern] : []),
    ],
  },
  experimental: {
    optimizeCss: false,
    turbo: {
      // Configure custom rules or loaders
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
      // Set path aliases
      resolveAlias: {
        'underscore': 'lodash',
      },
    }
  },
  webpack: (config) => {
    console.error('next.config.ts webpack hook running - minimizers:', config.optimization.minimizer?.map((m: any) => m?.constructor?.name));
    // Disable CSS minimization to avoid SCSS parser issues during build
    config.optimization.minimizer = config.optimization.minimizer?.filter(
      (minimizer: any) => minimizer?.constructor?.name !== 'CssMinimizerPlugin'
    ) ?? []
    return config
  },
}

export default withPayload(nextConfig)

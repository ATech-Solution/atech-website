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
  images: {
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

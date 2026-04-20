// Page Template : Product Development

import type { Metadata } from 'next'

export const revalidate = 60
import Link from 'next/link'

export const metadata: Metadata = {
  title:       'Product Development Services',
  description:
    'From ideation to launch, our product development team turns your vision into market-ready software products.',
}

export default function ProductDevelopmentPage() {
  return (
    <div style={{ background: '#ffffff' }}>
      {/* ── Breadcrumb ──────────────────────────────────────────────────────── */}
      <div className="px-6 md:px-10 py-6" style={{ background: '#ffffff' }}>
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <nav className="flex items-center gap-2 flex-wrap" aria-label="Breadcrumb">
            <Link
              href="/"
              className="text-sm font-normal hover:text-[#171717] transition-colors"
              style={{ color: '#737373', fontFamily: 'var(--font-work-sans, sans-serif)' }}
            >
              Home
            </Link>
            <span style={{ color: '#d4d4d4', fontSize: '0.75rem' }}>›</span>
            <Link
              href="#"
              className="text-sm font-normal hover:text-[#171717] transition-colors"
              style={{ color: '#737373', fontFamily: 'var(--font-work-sans, sans-serif)' }}
            >
              What We Do
            </Link>
            <span style={{ color: '#d4d4d4', fontSize: '0.75rem' }}>›</span>
            <span
              className="text-sm font-normal"
              style={{ color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}
            >
              Product Development
            </span>
          </nav>
        </div>
      </div>

      {/* ── Coming Soon ─────────────────────────────────────────────────────── */}
      <section className="py-32 px-6 md:px-10" style={{ background: '#ffffff' }}>
        <div
          className="mx-auto flex flex-col items-center text-center"
          style={{ maxWidth: '640px' }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{ background: '#f5f5f5', border: '1px solid #e5e5e5' }}
          >
            <span
              className="text-xs font-normal tracking-[0.6px] uppercase"
              style={{ color: '#525252', fontFamily: 'var(--font-work-sans, sans-serif)' }}
            >
              Product Development
            </span>
          </div>

          <h1
            className="mb-6"
            style={{
              fontFamily:    'var(--font-work-sans, sans-serif)',
              fontSize:      'clamp(2rem, 4vw, 3rem)',
              fontWeight:    400,
              color:         '#171717',
              letterSpacing: '-1.2px',
              lineHeight:    1.1,
            }}
          >
            Coming Soon
          </h1>

          <p
            className="mb-10"
            style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize:   '1.125rem',
              color:      '#525252',
              lineHeight: '1.625',
            }}
          >
            We&apos;re putting the finishing touches on our Product Development page.
            In the meantime, feel free to reach out and we&apos;ll be happy to discuss how we can bring your product vision to life.
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-normal transition-opacity duration-200 hover:opacity-80"
            style={{
              background: '#171717',
              color:      '#ffffff',
              fontFamily: 'var(--font-work-sans, sans-serif)',
            }}
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  )
}

// CTA Banner Section — Layout Builder variant (Advance)
// Used by: cta-banner block type

import Link from 'next/link'

function ArrowRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

interface Stat {
  statValue: string
  statLabel: string
}

export interface CTABannerSectionData {
  heading?:     string
  subtitle?:    string
  buttonLabel?: string
  buttonUrl?:   string
  heroStats?:   Stat[]
}

export default function CTABannerSection({ data }: { data: CTABannerSectionData }) {
  const stats = data.heroStats ?? []

  return (
    <section className="py-24 px-6 md:px-10" style={{ background: '#171717' }}>
      <div
        className="mx-auto flex flex-col items-center text-center"
        style={{ maxWidth: '896px' }}
      >
        {data.heading && (
          <h2
            className="mb-6"
            style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize:   'clamp(1.75rem, 3vw, 2.25rem)',
              fontWeight: 400,
              color:      '#ffffff',
              lineHeight: '40px',
            }}
          >
            {data.heading}
          </h2>
        )}

        {data.subtitle && (
          <p
            className="mb-10 max-w-2xl"
            style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize:   '1.125rem',
              color:      '#a3a3a3',
              lineHeight: '1.75',
            }}
          >
            {data.subtitle}
          </p>
        )}

        {data.buttonLabel && data.buttonUrl && (
          <Link
            href={data.buttonUrl}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-normal mb-16 transition-opacity duration-200 hover:opacity-90"
            style={{ background: '#ffffff', color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}
          >
            {data.buttonLabel}
            <ArrowRight />
          </Link>
        )}

        {stats.length > 0 && (
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full pt-10"
            style={{ borderTop: '1px solid #ffcd37' }}
          >
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span
                  style={{
                    fontFamily: 'var(--font-work-sans, sans-serif)',
                    fontSize:   '1.875rem',
                    fontWeight: 400,
                    color:      '#ffcd37',
                    lineHeight: '36px',
                  }}
                >
                  {stat.statValue}
                </span>
                <span
                  className="uppercase tracking-[0.6px]"
                  style={{
                    fontFamily: 'var(--font-work-sans, sans-serif)',
                    fontSize:   '0.75rem',
                    color:      '#ffffff',
                    lineHeight: '16px',
                  }}
                >
                  {stat.statLabel}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

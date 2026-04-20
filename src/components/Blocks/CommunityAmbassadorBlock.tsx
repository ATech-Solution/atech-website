// Community Ambassador — Figma node 1:30812
// White background card, 2-col: left = content; right = illustration placeholder

import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────
interface AmbassadorBenefit {
  iconSrc:     string
  title:       string
  description: string
}

interface CommunityAmbassadorData {
  heading:     string
  description: string
  benefits:    AmbassadorBenefit[]
  ctaLabel:    string
  ctaUrl:      string
}

// ─── CommunityAmbassadorBlock ─────────────────────────────────────────────────
export default function CommunityAmbassadorBlock({ data }: { data: CommunityAmbassadorData }) {
  const { heading, description, benefits, ctaLabel, ctaUrl } = data

  return (
    <section className="py-16 px-6 md:px-10" style={{ background: '#171717' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>
        <div className="p-12" style={{ background: '#ffffff' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="flex flex-col gap-5">
              <h2
                style={{
                  fontFamily:    'var(--font-work-sans, sans-serif)',
                  fontSize:      '1.875rem',
                  fontWeight:    400,
                  color:         '#171717',
                  lineHeight:    '36px',
                }}
              >
                {heading}
              </h2>
              <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', color: '#525252', lineHeight: '1.625' }}>
                {description}
              </p>

              {/* Benefits */}
              <div className="flex flex-col gap-4">
                {benefits.map((b) => (
                  <div key={b.title} className="flex items-start gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={b.iconSrc} alt="" className="object-contain flex-shrink-0 mt-0.5" style={{ width: '20px', height: '20px' }} />
                    <div className="flex flex-col gap-1">
                      <span style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem', fontWeight: 400, color: '#171717' }}>{b.title}</span>
                      <span style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem', color: '#525252' }}>{b.description}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={ctaUrl}
                className="inline-flex items-center justify-center px-8 py-4 text-base font-normal transition-opacity duration-200 hover:opacity-80 self-start mt-2"
                style={{ background: '#171717', color: '#ffffff', fontFamily: 'var(--font-work-sans, sans-serif)' }}
              >
                {ctaLabel}
              </Link>
            </div>

            {/* Illustration placeholder */}
            <div className="flex items-center justify-center" style={{ height: '400px', background: '#f5f5f5' }}>
              <span style={{ color: '#525252', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem' }}>
                Ambassador Program
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

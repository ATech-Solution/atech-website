// Get Involved Hero — Figma node 1:30513
// White background, 2-col: left = badge + heading + subheading + 2 CTAs; right = dark illustration card

import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────
interface GetInvolvedHeroData {
  badge:        string
  badgeIconSrc: string
  heading:      string
  subheading:   string
  cta:          { primary: { label: string; url: string }; secondary: { label: string; url: string } }
  ctaArrowSrc:  string
}

// ─── GetInvolvedHeroBlock ─────────────────────────────────────────────────────
export default function GetInvolvedHeroBlock({ data }: { data: GetInvolvedHeroData }) {
  const { badge, badgeIconSrc, heading, subheading, cta, ctaArrowSrc } = data

  return (
    <section className="px-6 md:px-10 py-24" style={{ background: '#ffffff' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: content */}
          <div className="flex flex-col gap-6">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 self-start"
              style={{ background: '#f5f5f5', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={badgeIconSrc} alt="" className="object-contain flex-shrink-0" style={{ width: '24px', height: '24px' }} />
              <span className="text-sm font-normal tracking-[0.35px] uppercase" style={{ color: '#000000', fontFamily: 'var(--font-work-sans, sans-serif)' }}>
                {badge}
              </span>
            </div>

            {/* Heading */}
            <h1
              style={{
                fontFamily:    'var(--font-work-sans, sans-serif)',
                fontSize:      'clamp(2.5rem, 5vw, 4.5rem)',
                fontWeight:    400,
                color:         '#000000',
                letterSpacing: '-1.5px',
                lineHeight:    1,
              }}
            >
              {heading}
            </h1>

            {/* Subheading */}
            <p
              className="max-w-xl"
              style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.25rem', color: '#000000', lineHeight: '1.625' }}
            >
              {subheading}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={cta.primary.url}
                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-normal transition-opacity duration-200 hover:opacity-80"
                style={{ background: '#efefef', color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}
              >
                {cta.primary.label}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ctaArrowSrc} alt="" className="object-contain" style={{ width: '14px', height: '16px' }} />
              </Link>
              <Link
                href={cta.secondary.url}
                className="inline-flex items-center px-8 py-4 text-sm font-normal transition-opacity duration-200 hover:opacity-70"
                style={{ border: '2px solid #ffffff', color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}
              >
                {cta.secondary.label}
              </Link>
            </div>
          </div>

          {/* Right: illustration card */}
          <div
            className="flex items-center justify-center"
            style={{ height: '450px', background: '#262626', border: '1px solid #404040' }}
          >
            <span style={{ color: '#a3a3a3', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', textAlign: 'center' }}>
              Community Collaboration Illustration
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

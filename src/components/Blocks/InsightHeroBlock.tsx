// Insight Hero — Figma node 1:31039
// White background, centered badge + heading + subheading + 2 CTAs

import Link from 'next/link'

// ─── Figma asset URLs ─────────────────────────────────────────────────────────
const CTA_ARROW = 'https://www.figma.com/api/mcp/asset/4bb2ae5b-279f-4593-9f57-b17772617cd0'

// ─── Types ────────────────────────────────────────────────────────────────────
interface InsightHeroData {
  badge:        string
  badgeIconSrc: string
  heading:      string
  subheading:   string
  cta:          { primary: { label: string; url: string }; secondary: { label: string; url: string } }
}

// ─── InsightHeroBlock ─────────────────────────────────────────────────────────
export default function InsightHeroBlock({ data }: { data: InsightHeroData }) {
  const { badge, badgeIconSrc, heading, subheading, cta } = data

  return (
    <section className="px-6 md:px-10 py-24" style={{ background: '#ffffff' }}>
      <div className="mx-auto flex flex-col items-center text-center gap-6" style={{ maxWidth: '896px' }}>
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ background: '#f5f5f5', border: '1px solid #e5e5e5' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={badgeIconSrc} alt="" className="object-contain flex-shrink-0" style={{ width: '9px', height: '12px' }} />
          <span className="text-xs font-normal tracking-[0.6px] uppercase" style={{ color: '#525252', fontFamily: 'var(--font-work-sans, sans-serif)' }}>
            {badge}
          </span>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily:    'var(--font-work-sans, sans-serif)',
            fontSize:      'clamp(2.5rem, 5vw, 3.75rem)',
            fontWeight:    400,
            color:         '#171717',
            letterSpacing: '-1.2px',
            lineHeight:    1,
          }}
        >
          {heading}
        </h1>

        {/* Subheading */}
        <p className="max-w-2xl" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', color: '#525252', lineHeight: '1.625' }}>
          {subheading}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          <Link
            href={cta.primary.url}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-normal transition-opacity duration-200 hover:opacity-80"
            style={{ background: '#171717', color: '#ffffff', fontFamily: 'var(--font-work-sans, sans-serif)' }}
          >
            {cta.primary.label}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={CTA_ARROW} alt="" className="object-contain" style={{ width: '12px', height: '14px' }} />
          </Link>
          <Link
            href={cta.secondary.url}
            className="inline-flex items-center px-8 py-4 rounded-md text-sm font-normal transition-opacity duration-200 hover:opacity-70"
            style={{ background: '#ffffff', border: '1px solid #d4d4d4', color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}
          >
            {cta.secondary.label}
          </Link>
        </div>
      </div>
    </section>
  )
}

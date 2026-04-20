// Contact Stats — Figma node 1:30273
// White background, 2-col: left = heading + subheading + CTA buttons; right = 4-stat grid

import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────
interface StatItem  { value: string; label: string }
interface CtaItem   { label: string; url: string; primary: boolean }

interface ContactStatsData {
  heading:    string
  subheading: string
  cta:        CtaItem[]
  items:      StatItem[]
}

// ─── ContactStatsBlock ────────────────────────────────────────────────────────
export default function ContactStatsBlock({ data }: { data: ContactStatsData }) {
  const { heading, subheading, cta, items } = data

  return (
    <section className="py-24 px-6 md:px-10" style={{ background: '#ffffff', borderTop: '1px solid #e5e5e5' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: content */}
          <div className="flex flex-col gap-6">
            <h2
              style={{
                fontFamily:    'var(--font-work-sans, sans-serif)',
                fontSize:      'clamp(1.75rem, 3.5vw, 2.5rem)',
                fontWeight:    400,
                color:         '#171717',
                letterSpacing: '-0.8px',
                lineHeight:    1.1,
              }}
            >
              {heading}
            </h2>
            <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', color: '#525252', lineHeight: '1.75' }}>
              {subheading}
            </p>
            <div className="flex flex-wrap gap-4">
              {cta.map((btn) => (
                <Link
                  key={btn.label}
                  href={btn.url}
                  className="inline-flex items-center justify-center px-8 py-4 text-sm font-normal transition-opacity duration-200 hover:opacity-80 rounded-lg"
                  style={
                    btn.primary
                      ? { background: '#171717', color: '#ffffff', fontFamily: 'var(--font-work-sans, sans-serif)' }
                      : { background: '#ffffff', border: '1px solid #d4d4d4', color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }
                  }
                >
                  {btn.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: stats grid */}
          <div className="grid grid-cols-2 gap-6">
            {items.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center p-8 rounded-xl" style={{ background: '#f5f5f5' }}>
                <span style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '2.25rem', fontWeight: 400, color: '#171717', lineHeight: 1 }}>
                  {stat.value}
                </span>
                <span className="text-center mt-2" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#737373' }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

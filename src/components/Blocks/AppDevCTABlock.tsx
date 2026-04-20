// App Dev CTA — Figma node 1:27265
// Dark (#171717) background, centered CTA button, 3-stat row with yellow top border
// Differs from ITConsultingCTABlock: stat values and border are #ffcd37

import Link from 'next/link'

// ─── Figma asset URL ──────────────────────────────────────────────────────────
const ARROW_ICON = 'https://www.figma.com/api/mcp/asset/5448e409-1582-4d60-9188-1110c448bac5'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Stat {
  value: string
  label: string
}

interface AppDevCTAData {
  heading:    string
  subheading: string
  button:     { label: string; url: string }
  stats:      Stat[]
}

// ─── AppDevCTABlock ───────────────────────────────────────────────────────────
export default function AppDevCTABlock({ data }: { data: AppDevCTAData }) {
  const { heading, subheading, button, stats } = data

  return (
    <section className="py-24 px-6 md:px-10" style={{ background: '#171717' }}>
      <div
        className="mx-auto flex flex-col items-center text-center"
        style={{ maxWidth: '896px' }}
      >
        {/* Heading */}
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
          {heading}
        </h2>

        {/* Subheading */}
        <p
          className="mb-10 max-w-2xl"
          style={{
            fontFamily: 'var(--font-work-sans, sans-serif)',
            fontSize:   '1.125rem',
            color:      '#a3a3a3',
            lineHeight: '1.75',
          }}
        >
          {subheading}
        </p>

        {/* CTA Button */}
        <Link
          href={button.url}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-normal mb-16 transition-opacity duration-200 hover:opacity-90"
          style={{
            background: '#ffffff',
            color:      '#171717',
            fontFamily: 'var(--font-work-sans, sans-serif)',
          }}
        >
          {button.label}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ARROW_ICON} alt="" className="object-contain" style={{ width: '12px', height: '14px' }} />
        </Link>

        {/* Stats row — yellow top border + yellow values */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full pt-10"
          style={{ borderTop: '1px solid #ffcd37' }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span
                style={{
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize:   '1.875rem',
                  fontWeight: 400,
                  color:      '#ffcd37',
                  lineHeight: '36px',
                }}
              >
                {stat.value}
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
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

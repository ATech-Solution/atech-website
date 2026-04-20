// QA CTA + Stats — Figma node 1:27045
// Dark (#171717) background, centered heading, white CTA button, yellow stats row

import Link from 'next/link'

// ─── Figma asset URL ──────────────────────────────────────────────────────────
const CTA_ARROW = 'https://www.figma.com/api/mcp/asset/b5ee0a6e-b76b-4078-950a-5b042ca1e768'

// ─── Types ────────────────────────────────────────────────────────────────────
interface StatItem { value: string; label: string }

interface QACTAData {
  heading:    string
  subheading: string
  button:     { label: string; url: string }
  stats:      StatItem[]
}

// ─── QACTABlock ───────────────────────────────────────────────────────────────
export default function QACTABlock({ data }: { data: QACTAData }) {
  const { heading, subheading, button, stats } = data

  return (
    <section
      className="py-20"
      style={{
        background: '#171717',
        paddingLeft:  'clamp(1.5rem, 8vw, 17rem)',
        paddingRight: 'clamp(1.5rem, 8vw, 17rem)',
      }}
    >
      <div className="mx-auto flex flex-col items-center text-center" style={{ maxWidth: '896px' }}>
        {/* Heading */}
        <h2
          className="mb-5"
          style={{
            fontFamily: 'var(--font-work-sans, sans-serif)',
            fontSize:   'clamp(1.75rem, 3.5vw, 2.25rem)',
            fontWeight: 400,
            color:      '#ffffff',
            lineHeight: '40px',
          }}
        >
          {heading}
        </h2>

        {/* Subheading */}
        <p
          className="mb-8"
          style={{
            fontFamily: 'var(--font-work-sans, sans-serif)',
            fontSize:   '1.125rem',
            color:      '#d4d4d4',
            lineHeight: '28px',
            maxWidth:   '672px',
          }}
        >
          {subheading}
        </p>

        {/* CTA Button */}
        <div className="pb-8">
          <Link
            href={button.url}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-base font-normal transition-opacity duration-200 hover:opacity-80"
            style={{
              background: '#ffffff',
              color:      '#171717',
              fontFamily: 'var(--font-work-sans, sans-serif)',
            }}
          >
            {button.label}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={CTA_ARROW} alt="" className="object-contain" style={{ width: '14px', height: '16px' }} />
          </Link>
        </div>

        {/* Stats row — gold top border divider */}
        <div
          className="flex flex-wrap items-start justify-center gap-8 w-full pt-8"
          style={{ borderTop: '1px solid #ffcd37' }}
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <span
                style={{
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize:   '1.5rem',
                  fontWeight: 400,
                  color:      '#ffd369',
                  lineHeight: '32px',
                }}
              >
                {stat.value}
              </span>
              <span
                className="text-xs tracking-[0.6px] uppercase"
                style={{
                  fontFamily: 'var(--font-work-sans, sans-serif)',
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

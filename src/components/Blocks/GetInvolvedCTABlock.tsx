// Get Involved CTA — Figma node 1:30513
// Black background, centered heading + subheading + single button

import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────
interface GetInvolvedCTAData {
  heading:    string
  subheading: string
  button:     { label: string; url: string }
}

// ─── GetInvolvedCTABlock ──────────────────────────────────────────────────────
export default function GetInvolvedCTABlock({ data }: { data: GetInvolvedCTAData }) {
  const { heading, subheading, button } = data

  return (
    <section className="py-20 px-6 md:px-10" style={{ background: '#000000' }}>
      <div className="mx-auto flex flex-col items-center text-center gap-6" style={{ maxWidth: '768px' }}>
        <h2
          style={{
            fontFamily:    'var(--font-work-sans, sans-serif)',
            fontSize:      'clamp(1.75rem, 3vw, 2.25rem)',
            fontWeight:    400,
            color:         '#ffffff',
            letterSpacing: '-0.5px',
            lineHeight:    '40px',
          }}
        >
          {heading}
        </h2>
        <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.25rem', color: '#d4d4d4', lineHeight: '1.75' }}>
          {subheading}
        </p>
        <Link
          href={button.url}
          className="inline-flex items-center justify-center px-8 py-4 text-base font-normal transition-opacity duration-200 hover:opacity-80 rounded-lg"
          style={{ background: '#ffffff', color: '#000000', fontFamily: 'var(--font-work-sans, sans-serif)' }}
        >
          {button.label}
        </Link>
      </div>
    </section>
  )
}

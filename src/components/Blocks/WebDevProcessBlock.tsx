// Web Dev Process steps — Figma node 1:28082
// White background, 4-step horizontal flow with yellow numbered circles

import SectionHeader from '@/components/ui/SectionHeader'

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProcessStep {
  number:      string
  title:       string
  description: string
}

interface WebDevProcessData {
  heading:    string
  subheading: string
  steps:      ProcessStep[]
}

// ─── Single process step ──────────────────────────────────────────────────────
function ProcessStep({ number, title, description }: ProcessStep) {
  return (
    <div className="flex flex-col items-center text-center">
      {/* Yellow numbered circle */}
      <div
        className="flex items-center justify-center rounded-full mb-5 flex-shrink-0"
        style={{
          background: '#ffcd37',
          width:      '64px',
          height:     '64px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-work-sans, sans-serif)',
            fontSize:   '1.25rem',
            fontWeight: 400,
            color:      '#000000',
            lineHeight: '28px',
          }}
        >
          {number}
        </span>
      </div>

      {/* Title */}
      <h3
        className="mb-2"
        style={{
          fontFamily: 'var(--font-work-sans, sans-serif)',
          fontSize:   '1.125rem',
          fontWeight: 400,
          color:      '#171717',
          lineHeight: '28px',
        }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontFamily: 'var(--font-work-sans, sans-serif)',
          fontSize:   '0.875rem',
          color:      '#525252',
          lineHeight: '20px',
        }}
      >
        {description}
      </p>
    </div>
  )
}

// ─── WebDevProcessBlock ───────────────────────────────────────────────────────
export default function WebDevProcessBlock({ data }: { data: WebDevProcessData }) {
  const { heading, subheading, steps } = data

  return (
    <section className="py-24" style={{ background: '#ffffff' }}>
      <div className="mx-auto px-6 md:px-10" style={{ maxWidth: '1280px' }}>
        {/* Section heading */}
        <div className="mb-16 flex justify-center">
          <div style={{ maxWidth: '768px', width: '100%' }}>
            <SectionHeader
              heading={heading}
              subheading={subheading}
              align="center"
              headingColor="#171717"
              subheadingColor="#525252"
            />
          </div>
        </div>

        {/* 4-column steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {steps.map((step) => (
            <ProcessStep key={step.number} {...step} />
          ))}
        </div>
      </div>
    </section>
  )
}

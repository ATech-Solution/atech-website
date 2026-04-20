// Process Steps Section — Layout Builder variant (Advance)
// Used by: process-steps block type
// White bg, numbered yellow circles, 4-column grid

import SectionHeader from '@/components/ui/SectionHeader'

interface StepItem {
  stepNumber?: string
  stepTitle?:  string
  stepDesc?:   string
}

export interface ProcessStepsSectionData {
  heading?:      string
  subheading?:   string
  processSteps?: StepItem[]
}

function StepCard({ stepNumber, stepTitle, stepDesc }: StepItem) {
  return (
    <div className="flex flex-col items-center text-center">
      <div
        className="flex items-center justify-center rounded-full mb-5 flex-shrink-0"
        style={{ background: '#ffd369', width: '64px', height: '64px' }}
      >
        <span
          style={{
            fontFamily: 'var(--font-work-sans, sans-serif)',
            fontSize:   '1.25rem',
            fontWeight: 400,
            color:      '#171717',
            lineHeight: '20px',
          }}
        >
          {stepNumber}
        </span>
      </div>

      {stepTitle && (
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
          {stepTitle}
        </h3>
      )}

      {stepDesc && (
        <p
          style={{
            fontFamily: 'var(--font-work-sans, sans-serif)',
            fontSize:   '0.875rem',
            color:      '#525252',
            lineHeight: '20px',
          }}
        >
          {stepDesc}
        </p>
      )}
    </div>
  )
}

export default function ProcessStepsSection({ data }: { data: ProcessStepsSectionData }) {
  const steps = data.processSteps ?? []

  return (
    <section className="py-24" style={{ background: '#ffffff' }}>
      <div className="mx-auto px-6 md:px-10" style={{ maxWidth: '1280px' }}>
        {(data.heading || data.subheading) && (
          <div className="mb-16 flex justify-center">
            <div style={{ maxWidth: '768px', width: '100%' }}>
              <SectionHeader
                heading={data.heading ?? ''}
                subheading={data.subheading}
                align="center"
                headingColor="#171717"
                subheadingColor="#525252"
              />
            </div>
          </div>
        )}

        {steps.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {steps.map((step, idx) => (
              <StepCard key={idx} {...step} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

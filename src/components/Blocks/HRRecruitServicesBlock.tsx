// HR Recruit Services grid — Figma node 1:28203 (services section)
// Dark (#292929) background, yellow heading, 3×2 white service cards (no feature lists)

import SectionHeader from '@/components/ui/SectionHeader'

// ─── Types ────────────────────────────────────────────────────────────────────
interface ServiceItem {
  iconSrc:     string
  title:       string
  description: string
}

interface HRRecruitServicesData {
  heading:    string
  subheading: string
  items:      ServiceItem[]
}

// ─── Single service card ──────────────────────────────────────────────────────
function ServiceCard({ iconSrc, title, description }: ServiceItem) {
  return (
    <div
      className="flex flex-col p-8 rounded-2xl"
      style={{ background: '#ffffff', border: '1px solid #e5e5e5' }}
    >
      {/* Icon badge */}
      <div
        className="flex items-center justify-center rounded-lg mb-6 flex-shrink-0"
        style={{ background: '#f5f5f5', width: '48px', height: '48px' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconSrc} alt="" className="object-contain" style={{ maxWidth: '26px', maxHeight: '22px' }} />
      </div>

      {/* Title */}
      <h3
        className="mb-3"
        style={{
          fontFamily: 'var(--font-work-sans, sans-serif)',
          fontSize:   '1.25rem',
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
          lineHeight: '1.625',
        }}
      >
        {description}
      </p>
    </div>
  )
}

// ─── HRRecruitServicesBlock ───────────────────────────────────────────────────
export default function HRRecruitServicesBlock({ data }: { data: HRRecruitServicesData }) {
  const { heading, subheading, items } = data

  return (
    <section className="py-24" style={{ background: '#292929' }}>
      <div className="mx-auto px-6 md:px-10" style={{ maxWidth: '1280px' }}>
        <div className="mb-16 flex justify-center">
          <div style={{ maxWidth: '768px', width: '100%' }}>
            <SectionHeader
              heading={heading}
              subheading={subheading}
              align="center"
              headingColor="#ffcd37"
              subheadingColor="#ffffff"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ServiceCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}

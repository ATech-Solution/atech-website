// Who We Serve Startups grid — Figma node 1:28634 (services section)
// Light (#fafafa) background, centered heading, 3×2 white service cards with feature lists

import SectionHeader from '@/components/ui/SectionHeader'

// ─── Figma asset URLs ─────────────────────────────────────────────────────────
const CHECK_ICON = 'https://www.figma.com/api/mcp/asset/2d6d88c0-26b7-445b-a50a-255185c5bbc2'

// ─── Types ────────────────────────────────────────────────────────────────────
interface ServiceItem {
  iconSrc:     string
  title:       string
  description: string
  features:    string[]
}

interface WhoWeServeStartupsData {
  heading:    string
  subheading: string
  items:      ServiceItem[]
}

// ─── Single service card ──────────────────────────────────────────────────────
function ServiceCard({ iconSrc, title, description, features }: ServiceItem) {
  return (
    <div className="relative flex flex-col p-8 rounded-2xl" style={{ background: '#ffffff', border: '1px solid #e5e5e5' }}>
      {/* Icon badge */}
      <div
        className="flex items-center justify-center rounded-2xl mb-6 flex-shrink-0"
        style={{ background: '#f5f5f5', border: '1px solid #e5e5e5', width: '56px', height: '56px' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconSrc} alt="" className="object-contain" style={{ maxWidth: '24px', maxHeight: '20px' }} />
      </div>

      {/* Title */}
      <h3 className="mb-3" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.25rem', fontWeight: 400, color: '#171717', lineHeight: '28px' }}>
        {title}
      </h3>

      {/* Description */}
      <p className="mb-5" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#525252', lineHeight: '1.625' }}>
        {description}
      </p>

      {/* Feature list */}
      <ul className="flex flex-col gap-2 mt-auto">
        {features.map((feat, idx) => (
          <li key={idx} className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={CHECK_ICON} alt="" className="flex-shrink-0 object-contain" style={{ width: '10.5px', height: '12px' }} />
            <span className="text-sm font-normal" style={{ color: '#525252', fontFamily: 'var(--font-work-sans, sans-serif)' }}>
              {feat}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── WhoWeServeStartupsBlock ──────────────────────────────────────────────────
export default function WhoWeServeStartupsBlock({ data }: { data: WhoWeServeStartupsData }) {
  const { heading, subheading, items } = data

  return (
    <section className="py-24" style={{ background: '#fafafa' }}>
      <div className="mx-auto px-6 md:px-10" style={{ maxWidth: '1280px' }}>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ServiceCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}

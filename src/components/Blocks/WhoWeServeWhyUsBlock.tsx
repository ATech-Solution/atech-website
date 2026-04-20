// Who We Serve — Why Us section — Figma node 1:28634
// White background, centered heading, 2×2 icon+title+body cards

import SectionHeader from '@/components/ui/SectionHeader'

// ─── Types ────────────────────────────────────────────────────────────────────
interface WhyUsItem {
  iconSrc:     string
  title:       string
  description: string
}

interface WhoWeServeWhyUsData {
  heading: string
  items:   WhyUsItem[]
}

// ─── WhoWeServeWhyUsBlock ─────────────────────────────────────────────────────
export default function WhoWeServeWhyUsBlock({ data }: { data: WhoWeServeWhyUsData }) {
  const { heading, items } = data

  return (
    <section className="py-24" style={{ background: '#ffffff' }}>
      <div className="mx-auto px-6 md:px-10" style={{ maxWidth: '1280px' }}>
        <div className="mb-16 flex justify-center">
          <div style={{ maxWidth: '768px', width: '100%' }}>
            <SectionHeader
              heading={heading}
              subheading=""
              align="center"
              headingColor="#171717"
              subheadingColor="#525252"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map((item) => (
            <div key={item.title} className="flex gap-5 p-8 rounded-2xl" style={{ background: '#f5f5f5' }}>
              {/* Icon */}
              <div
                className="flex items-center justify-center rounded-lg flex-shrink-0"
                style={{ background: '#ffffff', border: '1px solid #e5e5e5', width: '48px', height: '48px' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.iconSrc} alt="" className="object-contain" style={{ maxWidth: '24px', maxHeight: '24px' }} />
              </div>
              {/* Content */}
              <div className="flex flex-col">
                <h3
                  className="mb-2"
                  style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', fontWeight: 400, color: '#171717', lineHeight: '28px' }}
                >
                  {item.title}
                </h3>
                <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#525252', lineHeight: '1.625' }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

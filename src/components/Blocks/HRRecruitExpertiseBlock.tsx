// HR Recruit Expertise section — Figma node 1:28203 (expertise section)
// Yellow (#ffd369) background, 4×2 white icon+label tiles grid

import SectionHeader from '@/components/ui/SectionHeader'

// ─── Types ────────────────────────────────────────────────────────────────────
interface ExpertiseTile {
  iconSrc: string
  label:   string
}

interface HRRecruitExpertiseData {
  heading:    string
  subheading: string
  tiles:      ExpertiseTile[]
}

// ─── Single expertise tile ────────────────────────────────────────────────────
function ExpertiseTile({ iconSrc, label }: ExpertiseTile) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 p-6 rounded-2xl"
      style={{ background: '#ffffff', border: '1px solid #e5e5e5' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={iconSrc} alt="" className="object-contain" style={{ width: '32px', height: '32px' }} />
      <span
        className="text-center text-sm font-normal"
        style={{
          color:      '#171717',
          fontFamily: 'var(--font-work-sans, sans-serif)',
          lineHeight: '20px',
        }}
      >
        {label}
      </span>
    </div>
  )
}

// ─── HRRecruitExpertiseBlock ──────────────────────────────────────────────────
export default function HRRecruitExpertiseBlock({ data }: { data: HRRecruitExpertiseData }) {
  const { heading, subheading, tiles } = data

  return (
    <section className="py-24" style={{ background: '#ffd369' }}>
      <div className="mx-auto px-6 md:px-10" style={{ maxWidth: '1280px' }}>
        <div className="mb-16 flex justify-center">
          <div style={{ maxWidth: '768px', width: '100%' }}>
            <SectionHeader
              heading={heading}
              subheading={subheading}
              align="center"
              headingColor="#171717"
              subheadingColor="#292929"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {tiles.map((tile) => (
            <ExpertiseTile key={tile.label} {...tile} />
          ))}
        </div>
      </div>
    </section>
  )
}

// About Mission & Vision — Figma node 1:29780
// White background: 2-col mission/vision cards + yellow values bar

import SectionHeader from '@/components/ui/SectionHeader'

// ─── Types ────────────────────────────────────────────────────────────────────
interface ValueItem {
  iconSrc:     string
  title:       string
  description: string
}

interface AboutMissionVisionData {
  missionIconSrc:  string
  missionHeading:  string
  missionBody:     string
  visionIconSrc:   string
  visionHeading:   string
  visionBody:      string
  valuesHeading:   string
  values:          ValueItem[]
}

// ─── AboutMissionVisionBlock ──────────────────────────────────────────────────
export default function AboutMissionVisionBlock({ data }: { data: AboutMissionVisionData }) {
  const { missionIconSrc, missionHeading, missionBody, visionIconSrc, visionHeading, visionBody, valuesHeading, values } = data

  return (
    <section className="py-24 px-6 md:px-10" style={{ background: '#ffffff' }}>
      <div className="mx-auto flex flex-col gap-12" style={{ maxWidth: '1280px' }}>
        {/* Heading */}
        <SectionHeader
          heading="Our Mission & Vision"
          subheading=""
          align="center"
          headingColor="#171717"
          subheadingColor="#525252"
        />

        {/* Mission / Vision cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Mission */}
          <div className="flex flex-col gap-4 p-8 rounded-xl" style={{ background: '#fafafa' }}>
            <div
              className="flex items-center justify-center rounded-lg flex-shrink-0"
              style={{ background: '#000000', width: '64px', height: '64px' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={missionIconSrc} alt="" className="object-contain" style={{ maxWidth: '24px', maxHeight: '24px' }} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.5rem', fontWeight: 400, color: '#000000', lineHeight: '32px' }}>
              {missionHeading}
            </h3>
            <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', color: '#525252', lineHeight: '28px' }}>
              {missionBody}
            </p>
          </div>

          {/* Vision */}
          <div className="flex flex-col gap-4 p-8 rounded-xl" style={{ background: '#fafafa' }}>
            <div
              className="flex items-center justify-center rounded-lg flex-shrink-0"
              style={{ background: '#000000', width: '64px', height: '64px' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={visionIconSrc} alt="" className="object-contain" style={{ maxWidth: '27px', maxHeight: '24px' }} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.5rem', fontWeight: 400, color: '#000000', lineHeight: '32px' }}>
              {visionHeading}
            </h3>
            <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', color: '#525252', lineHeight: '28px' }}>
              {visionBody}
            </p>
          </div>
        </div>

        {/* Values bar */}
        <div className="p-8 rounded-xl" style={{ background: '#ffd369' }}>
          <h3
            className="text-center mb-8"
            style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.5rem', fontWeight: 400, color: '#000000', lineHeight: '32px' }}
          >
            {valuesHeading}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {values.map((val) => (
              <div key={val.title} className="flex flex-col items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={val.iconSrc} alt="" className="object-contain" style={{ width: '30px', height: '30px' }} />
                <h4 className="text-center" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', fontWeight: 400, color: '#000000', lineHeight: '28px' }}>
                  {val.title}
                </h4>
                <p className="text-center" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#000000', lineHeight: '20px' }}>
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

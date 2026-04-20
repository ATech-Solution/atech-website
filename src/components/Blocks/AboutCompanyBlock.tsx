// About Company section — Figma node 1:29747
// Dark (#292929) background, 2-col: left = yellow heading + body + 2×2 stats | right = image

import SectionHeader from '@/components/ui/SectionHeader'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Stat { value: string; label: string }

interface AboutCompanyData {
  heading: string
  body1:   string
  body2:   string
  stats:   Stat[]
}

// ─── AboutCompanyBlock ────────────────────────────────────────────────────────
export default function AboutCompanyBlock({ data }: { data: AboutCompanyData }) {
  const { heading, body1, body2, stats } = data

  return (
    <section className="py-24 px-6 md:px-10" style={{ background: '#292929' }}>
      <div
        className="mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        style={{ maxWidth: '1280px' }}
      >
        {/* Left — content */}
        <div className="flex flex-col gap-6">
          <SectionHeader
            heading={heading}
            subheading=""
            align="left"
            headingColor="#ffcd37"
            subheadingColor="#ffffff"
          />

          <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', color: '#ffffff', lineHeight: '28px' }}>
            {body1}
          </p>
          <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', color: '#ffffff', lineHeight: '28px' }}>
            {body2}
          </p>

          {/* Stats 2×2 grid */}
          <div className="grid grid-cols-2 gap-8 pt-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2">
                <span style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.875rem', fontWeight: 400, color: '#ffcd37', lineHeight: '36px' }}>
                  {stat.value}
                </span>
                <span
                  className="text-center"
                  style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem', color: '#ffffff', lineHeight: '24px' }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — timeline placeholder */}
        <div
          className="hidden lg:flex items-center justify-center rounded-xl"
          style={{ background: '#d4d4d4', height: '384px' }}
        >
          <span style={{ color: '#525252', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem' }}>
            Company History Timeline
          </span>
        </div>
      </div>
    </section>
  )
}

// Contact Stats Section — 2-col: left = heading + subheading + CTAs; right = 4-stat grid
// Supports style='light' (white bg) and style='dark' (black bg, Figma 230:28185)

import Link from 'next/link'

const FONT = 'var(--font-work-sans, "Work Sans", sans-serif)'

interface ContactStatItem {
  contactStatValue?: string
  contactStatLabel?: string
}

interface ContactCtaItem {
  contactCtaLabel?:   string
  contactCtaUrl?:     string
  contactCtaPrimary?: boolean
}

interface ContactStatsData {
  contactStatsStyle?: 'light' | 'dark'
  heading?:           string
  subheading?:        string
  contactStatCtas?:   ContactCtaItem[]
  contactStatItems?:  ContactStatItem[]
}

export default function ContactStatsSection({ data }: { data: ContactStatsData }) {
  const { contactStatsStyle = 'light', heading, subheading, contactStatCtas = [], contactStatItems = [] } = data
  const dark = contactStatsStyle === 'dark'

  if (dark) {
    return (
      <section style={{ background: '#000000', padding: '112px 0' }}>
        <div className="mx-auto px-6 md:px-[80px]" style={{ maxWidth: '1280px' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '64px', alignItems: 'center' }}>

            {/* Left */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {heading && (
                <h2 style={{
                  fontFamily: FONT,
                  fontSize: 'clamp(2rem, 4vw, 48px)',
                  fontWeight: 400,
                  color: '#ffffff',
                  lineHeight: 1,
                  margin: 0,
                }}>
                  {heading}
                </h2>
              )}
              {subheading && (
                <p style={{
                  fontFamily: FONT,
                  fontSize: '20px',
                  color: '#d4d4d4',
                  lineHeight: '32.5px',
                  margin: 0,
                  maxWidth: '576px',
                }}>
                  {subheading}
                </p>
              )}
              {contactStatCtas.length > 0 && (
                <div className="flex flex-wrap" style={{ gap: '16px', paddingTop: '8px' }}>
                  {contactStatCtas.map((btn, i) => (
                    <Link
                      key={i}
                      href={btn.contactCtaUrl ?? '#'}
                      className="inline-flex items-center justify-center transition-opacity duration-200 hover:opacity-80"
                      style={
                        btn.contactCtaPrimary
                          ? { background: '#ffffff', color: '#171717', fontFamily: FONT, fontSize: '18px', lineHeight: '28px', padding: '20px 48px', borderRadius: '8px', textDecoration: 'none' }
                          : { background: 'transparent', border: '1px solid #ffffff', color: '#ffffff', fontFamily: FONT, fontSize: '16px', lineHeight: '24px', padding: '20px 33px', borderRadius: '8px', textDecoration: 'none' }
                      }
                    >
                      {btn.contactCtaLabel}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Right: stats grid */}
            {contactStatItems.length > 0 && (
              <div className="grid grid-cols-2" style={{ gap: '24px' }}>
                {contactStatItems.map((stat, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,255,255,0.1)',
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}>
                    <span style={{ fontFamily: FONT, fontSize: '48px', fontWeight: 400, color: '#ffffff', lineHeight: '48px' }}>
                      {stat.contactStatValue}
                    </span>
                    <span style={{ fontFamily: FONT, fontSize: '16px', color: '#d4d4d4', lineHeight: '24px' }}>
                      {stat.contactStatLabel}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 px-6 md:px-10" style={{ background: '#ffffff', borderTop: '1px solid #e5e5e5' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="flex flex-col gap-6">
            {heading && (
              <h2
                style={{ fontFamily: FONT, fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 400, color: '#171717', letterSpacing: '-0.8px', lineHeight: 1.1 }}
              >
                {heading}
              </h2>
            )}
            {subheading && (
              <p style={{ fontFamily: FONT, fontSize: '1.125rem', color: '#525252', lineHeight: '1.75' }}>
                {subheading}
              </p>
            )}
            {contactStatCtas.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {contactStatCtas.map((btn, i) => (
                  <Link
                    key={i}
                    href={btn.contactCtaUrl ?? '#'}
                    className="inline-flex items-center justify-center px-8 py-4 text-sm font-normal transition-opacity duration-200 hover:opacity-80 rounded-lg"
                    style={
                      btn.contactCtaPrimary
                        ? { background: '#171717', color: '#ffffff', fontFamily: FONT }
                        : { background: '#ffffff', border: '1px solid #d4d4d4', color: '#171717', fontFamily: FONT }
                    }
                  >
                    {btn.contactCtaLabel}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right: stats grid */}
          {contactStatItems.length > 0 && (
            <div className="grid grid-cols-2 gap-6">
              {contactStatItems.map((stat, i) => (
                <div key={i} className="flex flex-col items-center p-8 rounded-xl" style={{ background: '#f5f5f5' }}>
                  <span style={{ fontFamily: FONT, fontSize: '2.25rem', fontWeight: 400, color: '#171717', lineHeight: 1 }}>
                    {stat.contactStatValue}
                  </span>
                  <span className="text-center mt-2" style={{ fontFamily: FONT, fontSize: '0.875rem', color: '#737373' }}>
                    {stat.contactStatLabel}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

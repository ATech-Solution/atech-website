// Company Stats Section — Layout Builder (Advance)
// Dark (#292929) bg, 2-col: left = yellow heading + body + stats grid | right = image

interface Stat { statValue: string; statLabel: string }

interface CompanyStatsSectionProps {
  data: {
    aboutCompanyHeading?: string
    body1?: string
    body2?: string
    companyStats?: Stat[]
    companyImage?: { url: string; alt?: string } | null
  }
}

export default function CompanyStatsSection({ data }: CompanyStatsSectionProps) {
  const { aboutCompanyHeading, body1, body2, companyStats = [], companyImage } = data

  return (
    <section className="py-24 px-6 md:px-10" style={{ background: 'var(--section-bg, #292929)' }}>
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center" style={{ maxWidth: '1280px' }}>
        <div className="flex flex-col gap-6">
          {aboutCompanyHeading && (
            <h2 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 400, color: '#ffcd37', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
              {aboutCompanyHeading}
            </h2>
          )}

          {body1 && (
            <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', color: '#ffffff', lineHeight: '28px' }}>
              {body1}
            </p>
          )}
          {body2 && (
            <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', color: '#ffffff', lineHeight: '28px' }}>
              {body2}
            </p>
          )}

          {companyStats.length > 0 && (
            <div className="grid grid-cols-2 gap-8 pt-4">
              {companyStats.map((stat, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <span style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.875rem', fontWeight: 400, color: '#ffcd37', lineHeight: '36px' }}>
                    {stat.statValue}
                  </span>
                  <span className="text-center" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem', color: '#ffffff', lineHeight: '24px' }}>
                    {stat.statLabel}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="hidden lg:flex items-center justify-center rounded-xl overflow-hidden" style={{ height: '384px', background: '#d4d4d4' }}>
          {companyImage?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={companyImage.url} alt={companyImage.alt ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ color: '#525252', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem' }}>
              Company Image
            </span>
          )}
        </div>
      </div>
    </section>
  )
}

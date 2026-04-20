// Page Hero Section — reusable centered or left-aligned hero with badge + heading + subheading + CTAs + optional stats

import Link from 'next/link'

interface PageHeroStat { statValue: string; statLabel: string }

interface PageHeroData {
  badge?:             string
  badgeIconSrc?:      string
  heading?:           string
  subheading?:        string
  ctaPrimaryLabel?:   string
  ctaPrimaryUrl?:     string
  ctaSecondaryLabel?: string
  ctaSecondaryUrl?:   string
  heroStats?:         PageHeroStat[]
  pageHeroAlign?:     'left' | 'center'
  pageHeroDark?:      boolean
}

export default function PageHeroSection({ data }: { data: PageHeroData }) {
  const {
    badge, badgeIconSrc, heading, subheading,
    ctaPrimaryLabel, ctaPrimaryUrl, ctaSecondaryLabel, ctaSecondaryUrl,
    heroStats,
    pageHeroAlign = 'center',
    pageHeroDark  = false,
  } = data

  const bg          = pageHeroDark ? '#171717' : '#ffffff'
  const headingColor = pageHeroDark ? '#ffffff' : '#171717'
  const bodyColor    = pageHeroDark ? '#d4d4d4' : '#525252'
  const statValColor = pageHeroDark ? '#ffffff' : '#171717'
  const statLblColor = pageHeroDark ? '#a3a3a3' : '#737373'
  const dividerColor = pageHeroDark ? 'rgba(255,255,255,0.1)' : '#e5e5e5'
  const isCenter     = pageHeroAlign === 'center'

  return (
    <section className="px-6 md:px-10 py-24" style={{ background: bg }}>
      <div
        className={`mx-auto flex flex-col gap-6 ${isCenter ? 'items-center text-center' : 'items-start'}`}
        style={{ maxWidth: isCenter ? '896px' : '1280px' }}
      >
        {/* Badge */}
        {badge && (
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ background: pageHeroDark ? 'rgba(255,255,255,0.08)' : '#f5f5f5', border: `1px solid ${pageHeroDark ? 'rgba(255,255,255,0.15)' : '#e5e5e5'}` }}
          >
            {badgeIconSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={badgeIconSrc} alt="" className="object-contain flex-shrink-0" style={{ width: '12px', height: '12px' }} />
            )}
            <span className="text-xs font-normal tracking-[0.6px] uppercase" style={{ color: bodyColor, fontFamily: 'var(--font-work-sans, sans-serif)' }}>
              {badge}
            </span>
          </div>
        )}

        {/* Heading */}
        {heading && (
          <h1
            style={{
              fontFamily:    'var(--font-work-sans, sans-serif)',
              fontSize:      'clamp(2.5rem, 5vw, 3.75rem)',
              fontWeight:    400,
              color:         headingColor,
              letterSpacing: '-1.2px',
              lineHeight:    1,
            }}
          >
            {heading}
          </h1>
        )}

        {/* Subheading */}
        {subheading && (
          <p
            className={isCenter ? 'max-w-2xl' : 'max-w-2xl'}
            style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', color: bodyColor, lineHeight: '1.625' }}
          >
            {subheading}
          </p>
        )}

        {/* CTAs */}
        {(ctaPrimaryLabel || ctaSecondaryLabel) && (
          <div className={`flex flex-wrap items-center gap-4 mt-2 ${isCenter ? 'justify-center' : ''}`}>
            {ctaPrimaryLabel && ctaPrimaryUrl && (
              <Link
                href={ctaPrimaryUrl}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-normal transition-opacity duration-200 hover:opacity-80"
                style={{ background: pageHeroDark ? '#ffffff' : '#171717', color: pageHeroDark ? '#171717' : '#ffffff', fontFamily: 'var(--font-work-sans, sans-serif)' }}
              >
                {ctaPrimaryLabel}
              </Link>
            )}
            {ctaSecondaryLabel && ctaSecondaryUrl && (
              <Link
                href={ctaSecondaryUrl}
                className="inline-flex items-center px-8 py-4 rounded-md text-sm font-normal transition-opacity duration-200 hover:opacity-70"
                style={{ background: 'transparent', border: `1px solid ${pageHeroDark ? 'rgba(255,255,255,0.3)' : '#d4d4d4'}`, color: headingColor, fontFamily: 'var(--font-work-sans, sans-serif)' }}
              >
                {ctaSecondaryLabel}
              </Link>
            )}
          </div>
        )}

        {/* Stats row */}
        {heroStats && heroStats.length > 0 && (
          <div
            className={`grid gap-8 w-full mt-8 pt-8 ${heroStats.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : heroStats.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}
            style={{ borderTop: `1px solid ${dividerColor}` }}
          >
            {heroStats.map((stat, i) => (
              <div key={i} className={`flex flex-col ${isCenter ? 'items-center' : 'items-start'} gap-1`}>
                <span style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.875rem', fontWeight: 400, color: statValColor, lineHeight: '36px' }}>
                  {stat.statValue}
                </span>
                <span style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.75rem', color: statLblColor, lineHeight: '16px' }}>
                  {stat.statLabel}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

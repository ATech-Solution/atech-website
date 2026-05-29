// Page Hero Section — reusable centered or left-aligned hero with badge + heading + subheading + CTAs + optional stats

import Link from 'next/link'

interface PageHeroStat { statValue: string; statLabel: string }

interface PageHeroData {
  badge?:                string
  badgeIcon?:            { url: string } | null
  badgeIconSrc?:         string
  heading?:              string
  subheading?:           string
  ctaPrimaryLabel?:      string
  ctaPrimaryUrl?:        string
  ctaPrimaryIcon?:       { url: string } | null
  ctaPrimaryIconPos?:    'left' | 'right'
  ctaPrimaryIconFill?:   boolean
  ctaSecondaryLabel?:    string
  ctaSecondaryUrl?:      string
  ctaSecondaryIcon?:     { url: string } | null
  ctaSecondaryIconPos?:  'left' | 'right'
  ctaSecondaryIconFill?: boolean
  heroStats?:            PageHeroStat[]
  pageHeroAlign?:        'left' | 'center'
  pageHeroDark?:         boolean
  pageHeroCtaStyle?:     'rounded' | 'square'
  pageHeroStatsBg?:      boolean
}

function BtnIcon({ src, fill }: { src: string; fill?: boolean }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" width={14} height={14} style={{ objectFit: fill ? 'fill' : 'contain', display: 'inline-block', verticalAlign: 'middle' }} />
}

export default function PageHeroSection({ data }: { data: PageHeroData }) {
  const {
    badge, badgeIcon, badgeIconSrc, heading, subheading,
    ctaPrimaryLabel, ctaPrimaryUrl, ctaPrimaryIcon, ctaPrimaryIconPos, ctaPrimaryIconFill,
    ctaSecondaryLabel, ctaSecondaryUrl, ctaSecondaryIcon, ctaSecondaryIconPos, ctaSecondaryIconFill,
    heroStats,
    pageHeroAlign    = 'center',
    pageHeroDark     = false,
    pageHeroCtaStyle = 'rounded',
    pageHeroStatsBg  = false,
  } = data

  const btnRadius = pageHeroCtaStyle === 'square' ? '' : 'rounded-md'

  const resolvedBadgeIconSrc = badgeIcon?.url ?? badgeIconSrc
  const primaryIconPos       = ctaPrimaryIconPos   ?? 'right'
  const secondaryIconPos     = ctaSecondaryIconPos ?? 'right'

  const bg           = pageHeroDark ? '#171717' : '#ffffff'
  const headingColor = pageHeroDark ? '#ffffff' : '#171717'
  const bodyColor    = pageHeroDark ? '#d4d4d4' : '#525252'
  const statValColor = pageHeroDark ? '#ffffff' : '#171717'
  const statLblColor = pageHeroDark ? '#a3a3a3' : '#737373'
  const dividerColor = pageHeroDark ? 'rgba(255,255,255,0.1)' : '#e5e5e5'
  const isCenter     = pageHeroAlign === 'center'

  const hasStats = heroStats && heroStats.length > 0

  // Stats column count matches Figma grid
  const statsCols =
    (heroStats?.length ?? 0) >= 4 ? 4
    : (heroStats?.length ?? 0) === 3 ? 3
    : 2

  return (
    <>
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
              {resolvedBadgeIconSrc && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={resolvedBadgeIconSrc} alt="" className="object-contain flex-shrink-0" style={{ width: '12px', height: '12px' }} />
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
              className="max-w-2xl"
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
                  className={`inline-flex items-center gap-2 px-8 py-4 ${btnRadius} text-sm font-normal transition-opacity duration-200 hover:opacity-80`}
                  style={{ background: pageHeroDark ? '#ffffff' : '#171717', color: pageHeroDark ? '#171717' : '#ffffff', fontFamily: 'var(--font-work-sans, sans-serif)' }}
                >
                  {ctaPrimaryIcon?.url && primaryIconPos === 'left' && <BtnIcon src={ctaPrimaryIcon.url} fill={ctaPrimaryIconFill} />}
                  {ctaPrimaryLabel}
                  {ctaPrimaryIcon?.url && primaryIconPos === 'right' && <BtnIcon src={ctaPrimaryIcon.url} fill={ctaPrimaryIconFill} />}
                </Link>
              )}
              {ctaSecondaryLabel && ctaSecondaryUrl && (
                <Link
                  href={ctaSecondaryUrl}
                  className={`inline-flex items-center gap-2 px-8 py-4 ${btnRadius} text-sm font-normal transition-opacity duration-200 hover:opacity-70`}
                  style={{ background: 'transparent', border: `1px solid ${pageHeroDark ? 'rgba(255,255,255,0.3)' : '#d4d4d4'}`, color: headingColor, fontFamily: 'var(--font-work-sans, sans-serif)' }}
                >
                  {ctaSecondaryIcon?.url && secondaryIconPos === 'left' && <BtnIcon src={ctaSecondaryIcon.url} fill={ctaSecondaryIconFill} />}
                  {ctaSecondaryLabel}
                  {ctaSecondaryIcon?.url && secondaryIconPos === 'right' && <BtnIcon src={ctaSecondaryIcon.url} fill={ctaSecondaryIconFill} />}
                </Link>
              )}
            </div>
          )}

          {/* Stats — inline mode (no background band) */}
          {hasStats && !pageHeroStatsBg && (
            <div
              className={`grid gap-8 w-full mt-8 pt-8`}
              style={{
                gridTemplateColumns: `repeat(${statsCols}, minmax(0, 1fr))`,
                borderTop: `1px solid ${dividerColor}`,
              }}
            >
              {heroStats!.map((stat, i) => (
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

      {/* Stats — background band mode: full-width #f5f5f5 strip, Figma node 1-29144 */}
      {hasStats && pageHeroStatsBg && (
        <div
          style={{
            background:   '#f5f5f5',
            borderTop:    '1px solid #e5e5e5',
            borderBottom: '1px solid #e5e5e5',
            padding:      '49px 104px',
          }}
        >
          <div
            style={{
              maxWidth: '1280px',
              margin:   '0 auto',
              display:  'grid',
              gridTemplateColumns: `repeat(${statsCols}, minmax(0, 1fr))`,
              gap:      '32px',
            }}
          >
            {heroStats!.map((stat, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-work-sans, sans-serif)',
                    fontSize:   '36px',
                    fontWeight: 400,
                    color:      '#171717',
                    lineHeight: '40px',
                    textAlign:  'center',
                  }}
                >
                  {stat.statValue}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-work-sans, sans-serif)',
                    fontSize:   '14px',
                    fontWeight: 400,
                    color:      '#525252',
                    lineHeight: '20px',
                    textAlign:  'center',
                  }}
                >
                  {stat.statLabel}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

// Hero Section — Layout Builder variant (Advance)
// Used by: home-hero block type

import Link from 'next/link'

interface HeroStat         { statValue: string; statLabel: string }
interface FloatingCard     { cardText: string; cardPosition: string; cardIcon?: { url: string } }
interface HeroSectionData {
  badge?:              string
  heading?:            string
  body?:               string
  ctaPrimaryLabel?:    string
  ctaPrimaryUrl?:      string
  ctaSecondaryLabel?:  string
  ctaSecondaryUrl?:    string
  heroImage?:          { url: string; alt?: string }
  heroStats?:          HeroStat[]
  floatingCards?:      FloatingCard[]
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StatItem({ statValue, statLabel, hasBorder }: HeroStat & { hasBorder: boolean }) {
  return (
    <div
      className="flex-1"
      style={hasBorder ? { paddingLeft: '1.5rem', borderLeft: '1px solid #e5e5e5' } : {}}
    >
      <p
        className="leading-none mb-1"
        style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.875rem', fontWeight: 700, color: '#ffd369' }}
      >
        {statValue}
      </p>
      <p
        className="text-xs tracking-wider uppercase"
        style={{ color: '#ffd369', fontFamily: 'var(--font-work-sans, sans-serif)', opacity: 0.85 }}
      >
        {statLabel}
      </p>
    </div>
  )
}

function FloatingBadgeCard({ cardText, cardIcon, className }: { cardText: string; cardIcon?: { url: string }; className?: string }) {
  return (
    <div
      className={`absolute flex items-center gap-3 rounded-xl px-4 py-3 z-10 ${className ?? ''}`}
      style={{
        background: '#ffffff',
        border: '1px solid #e5e5e5',
        boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)',
        minWidth: '180px',
      }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: '#ffcd37' }}
      >
        {cardIcon?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cardIcon.url} alt="" className="w-4 h-4 object-contain" />
        ) : (
          <span style={{ fontSize: '16px' }}>✓</span>
        )}
      </div>
      <p
        className="text-sm font-medium leading-tight"
        style={{ color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}
      >
        {cardText}
      </p>
    </div>
  )
}

export default function HeroSection({ data }: { data: HeroSectionData }) {
  const stats        = data.heroStats      ?? []
  const cards        = data.floatingCards  ?? []
  const topCard      = cards.find((c) => c.cardPosition === 'top-right')
  const bottomCard   = cards.find((c) => c.cardPosition === 'bottom-left')
  const topLeftCard  = cards.find((c) => c.cardPosition === 'top-left')
  const botRightCard = cards.find((c) => c.cardPosition === 'bottom-right')

  return (
    <section className="relative overflow-hidden" style={{ background: 'var(--color-bg, #292929)' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0) 100%)' }}
      />

      <div
        className="relative mx-auto px-6 md:px-10 py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        style={{ maxWidth: '1280px' }}
      >
        {/* ── Left ── */}
        <div className="flex flex-col">
          {data.badge && (
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 self-start"
              style={{ background: '#ffffff', border: '1px solid #e5e5e5' }}
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#171717' }} />
              <span
                className="text-xs font-normal tracking-widest uppercase"
                style={{ color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}
              >
                {data.badge}
              </span>
            </div>
          )}

          {data.heading && (
            <h1
              className="leading-tight mb-6"
              style={{
                fontFamily: 'var(--font-work-sans, sans-serif)',
                fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                fontWeight: 700,
                color: 'var(--color-text, #fafafa)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              {data.heading}
            </h1>
          )}

          {data.body && (
            <p
              className="leading-relaxed mb-10 max-w-lg"
              style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', color: '#525252', lineHeight: '1.625' }}
            >
              {data.body}
            </p>
          )}

          {(data.ctaPrimaryLabel || data.ctaSecondaryLabel) && (
            <div className="flex flex-wrap gap-4 mb-14">
              {data.ctaPrimaryLabel && data.ctaPrimaryUrl && (
                <Link
                  href={data.ctaPrimaryUrl}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-md text-base font-normal transition-opacity duration-200 hover:opacity-90"
                  style={{ background: '#ffffff', color: '#000000', fontFamily: 'var(--font-work-sans, sans-serif)' }}
                >
                  {data.ctaPrimaryLabel}
                  <Arrow />
                </Link>
              )}
              {data.ctaSecondaryLabel && data.ctaSecondaryUrl && (
                <Link
                  href={data.ctaSecondaryUrl}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-md text-base font-normal transition-opacity duration-200 hover:opacity-80"
                  style={{ background: '#41403f', color: '#ffffff', border: '1px solid #e5e5e5', fontFamily: 'var(--font-work-sans, sans-serif)' }}
                >
                  {data.ctaSecondaryLabel}
                </Link>
              )}
            </div>
          )}

          {stats.length > 0 && (
            <div className="flex items-start pt-8 gap-0" style={{ borderTop: '1px solid #e5e5e5' }}>
              {stats.map((stat, i) => (
                <StatItem key={i} {...stat} hasBorder={i > 0} />
              ))}
            </div>
          )}
        </div>

        {/* ── Right — image + floating cards ── */}
        {data.heroImage?.url && (
          <div className="relative w-full hidden lg:block" style={{ height: '580px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.heroImage.url}
              alt={data.heroImage.alt ?? ''}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {topCard    && <FloatingBadgeCard {...topCard}    className="top-[174px] -right-3" />}
            {bottomCard && <FloatingBadgeCard {...bottomCard} className="bottom-[144px] left-[-24px]" />}
            {topLeftCard  && <FloatingBadgeCard {...topLeftCard}  className="top-[174px] -left-3" />}
            {botRightCard && <FloatingBadgeCard {...botRightCard} className="bottom-[144px] -right-3" />}
          </div>
        )}
      </div>
    </section>
  )
}

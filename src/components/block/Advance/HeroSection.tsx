// Hero Section — Layout Builder variant (Advance)
// Used by: hero block type

import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'

function CtaWrap({ href, className, style, children }: { href?: string; className?: string; style?: CSSProperties; children: ReactNode }) {
  if (href) return <Link href={href} className={className} style={style}>{children}</Link>
  return <span className={className} style={style}>{children}</span>
}

interface HeroStat         { statValue: string; statLabel: string }
interface FloatingCard     { cardText: string; cardPosition: string; cardIcon?: { url: string } }
interface HeroSectionData {
  badge?:                 string
  badgeIcon?:             { url: string } | null
  heading?:               string
  headingSub?:            string
  body?:                  string
  ctaPrimaryLabel?:       string
  ctaPrimaryUrl?:         string
  ctaPrimaryIcon?:        { url: string } | null
  ctaPrimaryIconPos?:     'left' | 'right'
  ctaPrimaryIconFill?:    boolean
  ctaSecondaryLabel?:     string
  ctaSecondaryUrl?:       string
  ctaSecondaryIcon?:      { url: string } | null
  ctaSecondaryIconPos?:   'left' | 'right'
  ctaSecondaryIconFill?:  boolean
  heroImage?:             { url: string; alt?: string }
  backgroundImage?:       { url: string; alt?: string } | null
  heroImagePadding?:      boolean
  heroStats?:             HeroStat[]
  floatingCards?:         FloatingCard[]
}

function BtnIcon({ src, size = 14, fill }: { src: string; size?: number; fill?: boolean }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" width={size} height={size} style={{ objectFit: fill ? 'fill' : 'contain', display: 'inline-block', verticalAlign: 'middle' }} />
}

function ArrowDefault() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StatItem({ statValue, statLabel }: HeroStat) {
  return (
    <div className="flex-1">
      <p
        className="mb-1"
        style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.875rem', fontWeight: 400, color: '#ffd369', lineHeight: '36px' }}
      >
        {statValue}
      </p>
      <p
        className="text-xs tracking-wider uppercase"
        style={{ color: '#fff', fontFamily: 'var(--font-work-sans, sans-serif)', letterSpacing: '0.6px' }}
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
        background: 'var(--badge-bg, #ffffff)',
        border: '1px solid #e5e5e5',
        boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)',        
      }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: 'var(--color-accent, #ffcd37)' }}
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
        style={{ color: 'var(--badge-text, #171717)', fontFamily: 'var(--font-work-sans, sans-serif)' }}
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

  const primaryIconPos   = data.ctaPrimaryIconPos   ?? 'right'
  const secondaryIconPos = data.ctaSecondaryIconPos ?? 'right'

  const hasHeroImage = !!data.heroImage?.url
  const hasBgImage   = !!data.backgroundImage?.url
  // Full-bleed Figma layout (content on the left half, background showing through on
  // the right half) whenever there is no right-column hero image. With a hero image,
  // keep the original split layout.
  const fullBleed = !hasHeroImage

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: 'var(--color-bg, #292929)',
        minHeight: '90.1vh',
      }}
    >
      {/* minHeight: 'var(--section-min-height, auto)', */}

      {/* Full-bleed background image + left-to-right dark gradient (Figma hero) */}
      {hasBgImage ? (
        <div className="absolute inset-0 pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.backgroundImage!.url}
            alt={data.backgroundImage!.alt ?? ''}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 100%)' }}
          />
        </div>
      ) : (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0) 100%)' }}
        />
      )}

      <div
        className={`relative mx-auto flex flex-col lg:flex-row ${fullBleed ? 'items-center min-h-[90.1vh]' : 'items-stretch'}`}
        style={{ maxWidth: '1470px' }}
      >
        {/* maxWidth: 'var(--content-max-width, 1280px)' */}
        {/* ── Left ── */}
        {/* flex-1 */}
        <div className={`w-full flex flex-col ${fullBleed ? 'lg:w-1/2 lg:flex-none lg:justify-center' : 'lg:flex-1'}`}>
          {data.badge && (
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 self-start"
              style={{
                background: 'var(--badge-bg, rgba(255,255,255,0.08))',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 'var(--badge-radius, 100px)',
              }}
            >
              {data.badgeIcon?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.badgeIcon.url} alt="" className="w-4 h-4 object-contain flex-shrink-0" />
              ) : (
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--color-accent, #ffd369)' }} />
              )}
              <span
                className="text-xs font-normal tracking-widest uppercase"
                style={{ color: 'var(--badge-text, #fafafa)', fontFamily: 'var(--font-work-sans, sans-serif)' }}
              >
                {data.badge}
              </span>
            </div>
          )}
          <span className={`lg:mt-5 px-6 md:px-10 py-20 lg:py-24 lg:pl-24 ${data.heroImage?.url ? 'lg:pr-16' : 'lg:px-0 lg:pr-0'}`}>
          {(data.heading || data.headingSub) && (
            <h1
              className="mb-6"
              style={{
                fontFamily: 'var(--font-work-sans, sans-serif)',
                color: '#ffffff',
                paddingRight: '30px'
              }}
            >
              {data.heading && (
                <span className="text-4xl sm:text-6xl md:text-[64px]" style={{fontWeight: 700, lineHeight: '1.1', display: 'block' }}>
                  {data.heading}{data.headingSub ? ' ' : ''}
                </span>
              )}
              {data.headingSub && (
                <span className="text-2xl sm:text-4xl md:text-[48px]" style={{fontWeight: 400, lineHeight: '1.2' }}>
                  {data.headingSub}
                </span>
              )}
            </h1>
          )}

          {data.body && (
            <p
              className={`leading-relaxed mb-10 ${data.heroImage?.url ? 'max-w-lg' : 'max-w-xl'}`}
              style={{
                fontFamily: 'var(--font-work-sans, sans-serif)',
                fontSize: 'var(--body-font-size, 1.125rem)',
                color: '#E5E7EB',
                lineHeight: '1.625',
              }}
            >
              {data.body}
            </p>
          )}

          {(data.ctaPrimaryLabel || data.ctaSecondaryLabel) && (
            <div className="flex flex-wrap gap-4 mb-14">
              {data.ctaPrimaryLabel && (
                <CtaWrap
                  href={data.ctaPrimaryUrl}
                  className="w-full sm:w-[350px] md:w-auto inline-flex items-center gap-2 transition-opacity duration-200 hover:opacity-90"
                  style={{
                    background: '#ffffff',
                    color: '#000000',
                    fontFamily: 'var(--font-work-sans, sans-serif)',
                    fontSize: '16px',
                    fontWeight: 400,
                    padding: '16px 32px',
                    borderRadius: '6px',
                  }}
                >
                  {data.ctaPrimaryIcon?.url && primaryIconPos === 'left' && (
                    <BtnIcon src={data.ctaPrimaryIcon.url} fill={data.ctaPrimaryIconFill} />
                  )}
                  {data.ctaPrimaryLabel}
                  {data.ctaPrimaryIcon?.url && primaryIconPos === 'right' ? (
                    <BtnIcon src={data.ctaPrimaryIcon.url} fill={data.ctaPrimaryIconFill} />
                  ) : data.ctaPrimaryIcon === undefined ? (
                    <ArrowDefault />
                  ) : null}
                </CtaWrap>
              )}
              {data.ctaSecondaryLabel && (
                <CtaWrap
                  href={data.ctaSecondaryUrl}
                  className="w-full sm:w-[350px] md:w-auto inline-flex items-center gap-2.5 transition-opacity duration-200 hover:opacity-80"
                  style={{
                    background: '#41403f',
                    color: '#ffffff',
                    border: '1px solid #e5e5e5',
                    fontFamily: 'var(--font-work-sans, sans-serif)',
                    fontSize: '16px',
                    fontWeight: 400,
                    padding: '16px 33px',
                    borderRadius: '6px',
                  }}
                >
                  {data.ctaSecondaryIcon?.url && secondaryIconPos === 'left' && (
                    <BtnIcon src={data.ctaSecondaryIcon.url} fill={data.ctaSecondaryIconFill} />
                  )}
                  {data.ctaSecondaryLabel}
                  {data.ctaSecondaryIcon?.url && secondaryIconPos === 'right' && (
                    <BtnIcon src={data.ctaSecondaryIcon.url} fill={data.ctaSecondaryIconFill} />
                  )}
                </CtaWrap>
              )}
            </div>
          )}

          {stats.length > 0 && (
            <div
              className="flex items-start gap-6"
              // style={{ borderTop: '1px solid #FFCD37', paddingTop: '33px' }}
            >
              {stats.map((stat, i) => (
                <StatItem key={i} {...stat} />
              ))}
            </div>
          )}
          </span>
        </div>
        {/* px-6 md:px-10 py-20 lg:py-24 lg:pl-24 lg:pr-16 lg:mt-5 */}

        {/* ── Right — image + floating cards ── */}
        {data.heroImage?.url && (
          <div
            className="w-full lg:flex-1 hiddens lg:blocks relative 2xl:mt-8"
            style={{ flex: 1, minHeight: '100%' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.heroImage.url}
              alt={data.heroImage.alt ?? ''}
              style={{
                position: 'relative',
                top:    data.heroImagePadding ? '80px' : '0',
                right:  data.heroImagePadding ? '40px' : '0',
                bottom: data.heroImagePadding ? '40px' : '0',
                left:   data.heroImagePadding ? '40px' : 'unset',
                objectFit: 'cover',
                maxHeight: data.heroImagePadding ? '600px' : 'none',
                width: '100%',
                margin: data.heroImagePadding ? '0 auto' : 'auto',
              }}
            />
            {topCard    && <FloatingBadgeCard {...topCard}    className="w-[200px] top-[90px] md:top-[250px] right-[15px] md:right-20" />}
            {bottomCard && <FloatingBadgeCard {...bottomCard} className="min-w-[200px] bottom-[100px] left-[15px] md:left-[-24px]" />}
            {topLeftCard  && <FloatingBadgeCard {...topLeftCard}  className="min-w-[250px] top-[174px] md:-left-3" />}
            {botRightCard && <FloatingBadgeCard {...botRightCard} className="min-w-[250px] bottom-[144px] md:-right-3" />}
          </div>
        )}
      </div>

      {/* Floating cards over the full-bleed background (no right-column image) */}
      {!hasHeroImage && (topCard || bottomCard || topLeftCard || botRightCard) && (
        <div className="absolute inset-0 hidden lg:block pointer-events-none">
          <div className="relative mx-auto h-full" style={{ maxWidth: '1470px' }}>
            {topCard      && <FloatingBadgeCard {...topCard}      className="min-w-[200px] top-[42%] right-[8%]" />}
            {topLeftCard  && <FloatingBadgeCard {...topLeftCard}  className="min-w-[200px] top-[28%] left-[52%]" />}
            {bottomCard   && <FloatingBadgeCard {...bottomCard}   className="min-w-[200px] bottom-[12%] left-[52%]" />}
            {botRightCard && <FloatingBadgeCard {...botRightCard} className="min-w-[200px] bottom-[22%] right-[14%]" />}
          </div>
        </div>
      )}
    </section>
  )
}

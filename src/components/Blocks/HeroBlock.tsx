// Hero section — Figma node 1:26409
// Left: heading + body + CTAs + stats bar
// Right: hero photo + 2 floating badge cards

import Link from 'next/link'

// ─── Figma asset URLs ─────────────────────────────────────────────────────────
const DEPLOY_ICON = 'https://www.figma.com/api/mcp/asset/2183c7c2-a848-40e8-967a-114121241f24'
const LAUNCH_ICON = 'https://www.figma.com/api/mcp/asset/c6de1bca-e571-4303-a60d-25baa93e6827'
const ARROW_ICON  = 'https://www.figma.com/api/mcp/asset/df9193d1-129f-44fc-ae2c-a637e8f60c50'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Stat         { value: string; label: string }
interface FloatingCard { text: string; position: string }
interface HeroData {
  badge?:      string
  heading:     string
  headingSub?: string
  body:        string
  cta: {
    primary:   { label: string; url: string }
    secondary: { label: string; url: string }
  }
  stats:        Stat[]
  image:        { src: string; alt: string }
  floatingCards: FloatingCard[]
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatItem({ value, label }: Stat) {
  return (
    <div className="flex-1 flex flex-col gap-1">
      <p
        style={{
          fontFamily: 'var(--font-work-sans, sans-serif)',
          fontSize: '1.875rem',
          fontWeight: 400,
          lineHeight: '2.25rem',
          color: '#ffd369',
        }}
      >
        {value}
      </p>
      <p
        style={{
          color: '#ffd369',
          fontFamily: 'var(--font-work-sans, sans-serif)',
          fontSize: '0.75rem',
          letterSpacing: '0.6px',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </p>
    </div>
  )
}

function FloatingBadgeCard({
  text,
  iconSrc,
  className,
}: {
  text:     string
  iconSrc:  string
  className?: string
}) {
  return (
    <div
      className={`absolute flex items-center gap-4 rounded-xl px-4 py-3 z-10 ${className ?? ''}`}
      style={{
        background:  '#ffffff',
        border:      '1px solid #e5e5e5',
        boxShadow:   '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)',
        minWidth:    '198px',
      }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: '#ffcd37' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconSrc} alt="" className="w-4 h-4 object-contain" />
      </div>
      <p
        className="text-sm leading-tight"
        style={{
          color:      '#171717',
          fontFamily: 'var(--font-work-sans, sans-serif)',
          fontWeight: 400,
        }}
      >
        {text}
      </p>
    </div>
  )
}

// ─── HeroBlock ────────────────────────────────────────────────────────────────
export default function HeroBlock({ data }: { data: HeroData }) {
  const { badge, heading, headingSub, body, cta, stats, image, floatingCards } = data

  const deployCard = floatingCards.find((c) => c.position === 'top-right')
  const launchCard = floatingCards.find((c) => c.position === 'bottom-left')

  const showBadge = badge && badge.trim().length > 0

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: '#292929' }}
    >
      {/* Subtle radial gradient — matches Figma gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 100% 100% at 50% 50%, rgba(0,0,0,0.03) 1.77%, rgba(0,0,0,0) 1.77%)',
        }}
      />

      <div
        className="relative mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        style={{ maxWidth: '1280px', paddingTop: '80px', paddingBottom: '80px' }}
      >
        {/* ── Left column ────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-[50px]">
          <div className="flex flex-col gap-[50px]">
            {/* Badge — only shown when non-empty */}
            {showBadge && (
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full self-start"
                style={{
                  background: '#ffffff',
                  border:     '1px solid #e5e5e5',
                }}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: '#171717' }}
                />
                <span
                  className="text-xs font-normal tracking-widest uppercase"
                  style={{
                    color:      '#171717',
                    fontFamily: 'var(--font-work-sans, sans-serif)',
                  }}
                >
                  {badge}
                </span>
              </div>
            )}

            {/* Heading — bold main line + regular sub line (Figma: 64px bold + 48px regular) */}
            <div className="flex flex-col" style={{ height: '104px', justifyContent: 'center' }}>
              <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', lineHeight: '60px', fontSize: 0 }}>
                <span
                  style={{
                    fontSize:   'clamp(2.5rem, 4.5vw, 4rem)',
                    fontWeight: 700,
                    color:      '#ffffff',
                    display:    'inline',
                  }}
                >
                  {heading}{' '}
                </span>
                {headingSub && (
                  <span
                    style={{
                      fontSize:   'clamp(1.75rem, 3.5vw, 3rem)',
                      fontWeight: 400,
                      color:      '#ffffff',
                      display:    'inline',
                    }}
                  >
                    {headingSub}
                  </span>
                )}
              </p>
            </div>

            {/* Body */}
            <p
              style={{
                fontFamily: 'var(--font-work-sans, sans-serif)',
                fontSize:   '1.125rem',
                lineHeight: '1.625rem',
                color:      '#ffffff',
                maxWidth:   '565px',
              }}
            >
              {body}
            </p>
          </div>

          {/* CTAs — Figma: white primary, dark secondary */}
          <div className="flex flex-wrap gap-4">
            <Link
              href={cta.primary.url}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-base font-normal transition-opacity hover:opacity-90"
              style={{
                background: '#ffffff',
                color:      '#000000',
                fontFamily: 'var(--font-work-sans, sans-serif)',
              }}
            >
              {cta.primary.label}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ARROW_ICON} alt="" className="w-3.5 h-4 object-contain" />
            </Link>
            <Link
              href={cta.secondary.url}
              className="inline-flex items-center px-8 py-4 rounded-md text-base font-normal transition-opacity hover:opacity-80"
              style={{
                background: '#41403f',
                color:      '#ffffff',
                border:     '1px solid #e5e5e5',
                fontFamily: 'var(--font-work-sans, sans-serif)',
              }}
            >
              {cta.secondary.label}
            </Link>
          </div>

          {/* Stats bar — Figma: yellow (#ffcd37) border-top, 3-col grid */}
          <div
            className="grid grid-cols-3 gap-6 pt-8"
            style={{ borderTop: '1px solid #ffcd37' }}
          >
            {stats.map((stat, i) => (
              <StatItem key={i} {...stat} />
            ))}
          </div>
        </div>

        {/* ── Right column — hero image + floating cards ──────────────────── */}
        <div
          className="relative w-full hidden lg:block"
          style={{ height: '580px' }}
        >
          {/* Hero photo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            alt={image.alt}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Floating card — Deployment Successful (top-right, Figma: right-0, top-[76.5px]) */}
          {deployCard && (
            <FloatingBadgeCard
              text={deployCard.text}
              iconSrc={DEPLOY_ICON}
              className="-right-0 top-[76px]"
            />
          )}

          {/* Floating card — Launch Ready (bottom-left, Figma: right-[427px], top-[396px]) */}
          {launchCard && (
            <FloatingBadgeCard
              text={launchCard.text}
              iconSrc={LAUNCH_ICON}
              className="bottom-[144px] -left-6"
            />
          )}
        </div>
      </div>
    </section>
  )
}

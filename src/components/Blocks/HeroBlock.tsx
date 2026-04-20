// Hero section — Figma node 1:26409
// Left: badge + heading + body + CTAs + stats bar
// Right: hero photo + 2 floating badge cards

import Link from 'next/link'
import { ArrowIcon } from '@/components/icons/Icons'

// ─── Figma asset URLs ─────────────────────────────────────────────────────────
const DEPLOY_ICON = 'https://www.figma.com/api/mcp/asset/1ef93adc-bc6e-4a2f-b217-5ae6bd8e6851'
const LAUNCH_ICON = 'https://www.figma.com/api/mcp/asset/bb51a93a-b966-4f73-a933-32af9f8e3ae4'
const ARROW_ICON  = 'https://www.figma.com/api/mcp/asset/ccb53898-8bf1-4359-9707-4689784a071c'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Stat         { value: string; label: string }
interface FloatingCard { text: string; position: string }
interface HeroData {
  badge: string
  heading: string
  body: string
  cta: {
    primary:   { label: string; url: string }
    secondary: { label: string; url: string }
  }
  stats: Stat[]
  image: { src: string; alt: string }
  floatingCards: FloatingCard[]
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatItem({ value, label, hasBorder }: Stat & { hasBorder: boolean }) {
  return (
    <div
      className="flex-1"
      style={
        hasBorder
          ? { paddingLeft: '1.5rem', borderLeft: '1px solid #e5e5e5' }
          : {}
      }
    >
      <p
        className="leading-none mb-1"
        style={{
          fontFamily: 'var(--font-work-sans, sans-serif)',
          fontSize: '1.875rem',
          fontWeight: 700,
          color: '#ffd369',
        }}
      >
        {value}
      </p>
      <p
        className="text-xs tracking-wider uppercase"
        style={{
          color: '#ffd369',
          fontFamily: 'var(--font-work-sans, sans-serif)',
          opacity: 0.85,
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
  text: string
  iconSrc: string
  className?: string
}) {
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconSrc} alt="" className="w-4 h-4 object-contain" />
      </div>
      <p
        className="text-sm font-medium leading-tight"
        style={{
          color: '#171717',
          fontFamily: 'var(--font-work-sans, sans-serif)',
        }}
      >
        {text}
      </p>
    </div>
  )
}

// ─── HeroBlock ────────────────────────────────────────────────────────────────
export default function HeroBlock({ data }: { data: HeroData }) {
  const { badge, heading, body, cta, stats, image, floatingCards } = data

  const deployCard = floatingCards.find((c) => c.position === 'top-right')
  const launchCard = floatingCards.find((c) => c.position === 'bottom-left')

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'var(--color-bg, #292929)' }}
    >
      {/* Subtle radial gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0) 100%)",
        }}
      />

      <div
        className="relative mx-auto px-6 md:px-10 py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-12 items-center"
        style={{ maxWidth: '1280px' }}
      >
        {/* ── Left column ────────────────────────────────────────────────── */}
        <div className="flex flex-col">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 self-start"
            style={{
              background: '#ffffff',
              border: '1px solid #e5e5e5',
            }}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: '#171717' }}
            />
            <span
              className="text-xs font-normal tracking-widest uppercase"
              style={{
                color: '#171717',
                fontFamily: 'var(--font-work-sans, sans-serif)',
              }}
            >
              {badge}
            </span>
          </div>

          {/* Heading */}
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
            {heading}
          </h1>

          {/* Body */}
          <p
            className="leading-relaxed mb-10 max-w-lg"
            style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize: '1.125rem',
              color: '#525252',
              lineHeight: '1.625',
            }}
          >
            {body}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-14">
            <Link
              href={cta.primary.url}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-md text-base font-normal transition-opacity duration-200 hover:opacity-90"
              style={{
                background: '#ffffff',
                color: '#000000',
                fontFamily: 'var(--font-work-sans, sans-serif)',
              }}
            >
              {cta.primary.label}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ARROW_ICON} alt="" className="w-3.5 h-4 object-contain" />
            </Link>
            <Link
              href={cta.secondary.url}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-md text-base font-normal transition-opacity duration-200 hover:opacity-80"
              style={{
                background: '#41403f',
                color: '#ffffff',
                border: '1px solid #e5e5e5',
                fontFamily: 'var(--font-work-sans, sans-serif)',
              }}
            >
              {cta.secondary.label}
            </Link>
          </div>

          {/* Stats */}
          <div
            className="flex items-start pt-8 gap-0"
            style={{ borderTop: '1px solid #e5e5e5' }}
          >
            {stats.map((stat, i) => (
              <StatItem key={i} {...stat} hasBorder={i > 0} />
            ))}
          </div>
        </div>

        {/* ── Right column — hero image + floating cards ──────────────────── */}
        <div className="relative w-full hidden lg:block" style={{ height: '580px' }}>
          {/* Hero photo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            alt={image.alt}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ borderRadius: '0px' }}
          />

          {/* Floating card — Deployment Successful (top-right) */}
          {deployCard && (
            <FloatingBadgeCard
              text={deployCard.text}
              iconSrc={DEPLOY_ICON}
              className="top-[174px] -right-3"
            />
          )}

          {/* Floating card — Launch Ready (bottom-left, overlapping) */}
          {launchCard && (
            <FloatingBadgeCard
              text={launchCard.text}
              iconSrc={LAUNCH_ICON}
              className="bottom-[144px] left-[-24px]"
            />
          )}
        </div>
      </div>
    </section>
  )
}

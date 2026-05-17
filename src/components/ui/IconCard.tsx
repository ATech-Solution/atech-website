// Reusable icon + title + description card with optional CTA link.
// theme="dark"        → dark card bg, gold icon tint, white text  (fallback)
// theme="light"       → white card bg, #f5f5f5 icon box, dark text (Figma service cards)
// theme="transparent" → no card bg/border, #f5f5f5 icon box 64px,  gold title (Figma about pillars)

import Link from 'next/link'
import { ArrowIcon } from '@/components/icons/Icons'

interface IconCardProps {
  icon:     React.ReactNode
  title:    string
  description: string
  href?:    string
  align?:   'center' | 'left'
  size?:    'sm' | 'md'
  theme?:   'light' | 'dark' | 'transparent'
}

export default function IconCard({
  icon,
  title,
  description,
  href,
  align   = 'left',
  size    = 'md',
  theme   = 'dark',
}: IconCardProps) {
  const isCentered     = align === 'center'
  const isSmall        = size  === 'sm'
  const isLight        = theme === 'light'
  const isTransparent  = theme === 'transparent'

  // ── Icon box ─────────────────────────────────────────────────────────────
  // Figma about pillars: 64×64px, #f5f5f5 bg, no border, no gold tint
  // Figma service cards: 48×48px, #f5f5f5 bg, no border
  // Legacy dark cards:   48×48px, rgba(ffd369,.10) bg, rgba(ffd369,.20) border
  const iconSizePx = isTransparent ? 64 : isSmall ? 40 : 48
  const iconBoxStyle: React.CSSProperties = isTransparent || isLight
    ? { background: '#f5f5f5', borderRadius: '8px', width: iconSizePx, height: iconSizePx, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }
    : { background: 'rgba(255,211,105,0.10)', border: '1px solid rgba(255,211,105,0.20)', borderRadius: isSmall ? '8px' : '10px', width: iconSizePx, height: iconSizePx, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent, #ffd369)' }

  // ── Text colors ───────────────────────────────────────────────────────────
  // Figma about (transparent): title #ffd369 gold, desc #f0f5fc light
  // Figma service (light):     title #171717 dark,  desc #525252 grey
  // Legacy dark:               title #fafafa white,  desc #525252 grey
  const titleColor  = isTransparent ? '#ffd369' : isLight ? '#171717' : 'var(--color-text, #fafafa)'
  const descColor   = isTransparent ? '#f0f5fc'  : '#525252'
  const linkColor   = isLight ? '#171717' : 'var(--color-accent, #ffd369)'

  // ── Card container ────────────────────────────────────────────────────────
  const cardStyle: React.CSSProperties = isTransparent
    ? {}   // no bg, no border
    : isLight
      ? { background: '#ffffff', border: '1px solid #e5e5e5', borderRadius: '12px' }
      : { background: 'var(--color-surface, #2f2f2f)', border: '1px solid var(--color-border, #383838)', borderRadius: '16px' }

  const padding = isTransparent ? '' : isSmall ? 'p-4' : 'p-8'
  const flexDir = isCentered ? 'flex-col items-center text-center' : 'flex-col items-start'

  const content = (
    <div
      className={`group flex ${flexDir} ${padding} h-full transition-all duration-200`}
      style={cardStyle}
    >
      {/* Icon box */}
      <div className="mb-5" style={iconBoxStyle}>
        {icon}
      </div>

      {/* Title */}
      <h3
        className="leading-snug mb-3"
        style={{
          color:      titleColor,
          fontFamily: 'var(--font-work-sans, sans-serif)',
          fontWeight: 400,
          fontSize:   '1.25rem',   // 20px — matches Figma for all themes
        }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className={`leading-relaxed flex-1 ${href ? 'mb-6' : ''}`}
        style={{
          color:      descColor,
          fontFamily: 'var(--font-work-sans, sans-serif)',
          fontSize:   '1rem',      // 16px — matches Figma
        }}
      >
        {description}
      </p>

      {/* Optional CTA */}
      {href && (
        <span
          className="inline-flex items-center gap-2 text-sm font-normal group-hover:gap-3 transition-all duration-200"
          style={{ color: linkColor, fontFamily: 'var(--font-work-sans, sans-serif)' }}
        >
          Learn More <ArrowIcon />
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block h-full" style={{ textDecoration: 'none' }}>
        {content}
      </Link>
    )
  }

  return content
}

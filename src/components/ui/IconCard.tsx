// Reusable icon + title + description card with optional CTA link.
// Used by: AboutBlock (align=center, no href), ServicesBlock (align=left, with href)

import Link from 'next/link'
import { ArrowIcon } from '@/components/icons/Icons'

interface IconCardProps {
  icon: React.ReactNode
  title: string
  description: string
  href?: string
  align?: 'center' | 'left'
  /** 'sm' for compact hero-grid style, 'md' for full services section style */
  size?: 'sm' | 'md'
}

export default function IconCard({
  icon,
  title,
  description,
  href,
  align = 'left',
  size = 'md',
}: IconCardProps) {
  const isCentered = align === 'center'
  const isSmall = size === 'sm'

  const iconBoxSize = isSmall ? 'w-10 h-10' : 'w-12 h-12'
  const iconBoxRadius = isSmall ? 'rounded-lg' : 'rounded-xl'
  const padding = isSmall ? 'p-4' : 'p-8'
  const titleSize = isSmall ? 'text-sm' : 'text-base'
  const descSize = isSmall ? 'text-xs' : 'text-sm'

  const content = (
    <div
      className={`group flex ${isCentered ? 'flex-col items-center text-center' : 'flex-col items-start'} ${padding} rounded-2xl h-full transition-all duration-200`}
      style={{
        border: '1px solid var(--color-border, #383838)',
        background: 'var(--color-surface, #2f2f2f)',
      }}
    >
      {/* Icon box */}
      <div
        className={`${iconBoxSize} ${iconBoxRadius} flex items-center justify-center flex-shrink-0 mb-5`}
        style={{
          background: 'rgba(255,211,105,0.10)',
          border: '1px solid rgba(255,211,105,0.20)',
          color: 'var(--color-accent, #ffd369)',
        }}
      >
        {icon}
      </div>

      {/* Title */}
      <h3
        className={`${titleSize} font-semibold leading-snug mb-2`}
        style={{
          color: 'var(--color-text, #fafafa)',
          fontFamily: 'var(--font-work-sans, sans-serif)',
        }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className={`${descSize} leading-relaxed flex-1 ${href ? 'mb-6' : ''}`}
        style={{
          color: 'var(--color-muted, #525252)',
          fontFamily: 'var(--font-work-sans, sans-serif)',
        }}
      >
        {description}
      </p>

      {/* Optional CTA */}
      {href && (
        <span
          className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all duration-200"
          style={{
            color: 'var(--color-accent, #ffd369)',
            fontFamily: 'var(--font-work-sans, sans-serif)',
          }}
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

// CTA Banner Section — Layout Builder variant (Advance)
// Used by: cta-banner block type

import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'

function CtaWrap({ href, className, style, children }: { href?: string; className?: string; style?: CSSProperties; children: ReactNode }) {
  if (href) return <Link href={href} className={className} style={style}>{children}</Link>
  return <span className={className} style={style}>{children}</span>
}

function ArrowRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

interface Stat {
  statValue: string
  statLabel: string
}

export interface CTABannerSectionData {
  heading?:      string
  subtitle?:     string
  buttonLabel?:    string
  buttonUrl?:      string
  buttonIcon?:     { url: string } | null
  buttonIconPos?:  'left' | 'right'
  buttonIconFill?: boolean
  heroStats?:      Stat[]
}

export default function CTABannerSection({ data }: { data: CTABannerSectionData }) {
  const stats      = data.heroStats ?? []
  const iconPos    = data.buttonIconPos ?? 'right'
  const hasIcon    = !!data.buttonIcon?.url
  const iconFit    = data.buttonIconFill ? 'fill' : 'contain'

  return (
    <section
      className="py-20 px-6"
      style={{ background: '#171717' }}
    >
      <div
        className="mx-auto flex flex-col items-center text-center gap-4 px-6"
        style={{ maxWidth: '896px' }}
      >
        {data.heading && (
          <h2
            style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize:   'clamp(1.75rem, 3vw, 2.25rem)',
              fontWeight: 400,
              color:      '#ffffff',
              lineHeight: '40px',
            }}
          >
            {data.heading}
          </h2>
        )}

        {data.subtitle && (
          <p
            style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize:   '1.125rem',
              color:      '#d4d4d4',
              lineHeight: '28px',
              maxWidth:   '672px',
            }}
          >
            {data.subtitle}
          </p>
        )}

        {data.buttonLabel && (
          <div className="pt-4 pb-8 flex items-center justify-center w-full">
            <CtaWrap
              href={data.buttonUrl}
              className="inline-flex items-center gap-2 transition-opacity duration-200 hover:opacity-90"
              style={{
                background:   '#ffffff',
                color:        '#171717',
                fontFamily:   'var(--font-work-sans, sans-serif)',
                fontSize:     '1rem',
                fontWeight:   400,
                lineHeight:   '24px',
                padding:      '16px 32px',
                borderRadius: '6px',
              }}
            >
              {hasIcon && iconPos === 'left' && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.buttonIcon!.url} alt="" width={14} height={14} style={{ objectFit: iconFit }} />
              )}
              {data.buttonLabel}
              {hasIcon && iconPos === 'right' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.buttonIcon!.url} alt="" width={14} height={14} style={{ objectFit: iconFit }} />
              ) : data.buttonIcon === undefined ? (
                <ArrowRight />
              ) : null}
            </CtaWrap>
          </div>
        )}

        {stats.length > 0 && (
          <div
            className="flex flex-wrap items-start justify-center gap-8 w-full"
            style={{ borderTop: '1px solid #ffcd37', paddingTop: '33px' }}
          >
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span
                  style={{
                    fontFamily: 'var(--font-work-sans, sans-serif)',
                    fontSize:   '1.5rem',
                    fontWeight: 400,
                    color:      '#ffd369',
                    lineHeight: '32px',
                  }}
                >
                  {stat.statValue}
                </span>
                <span
                  className="uppercase tracking-[0.6px]"
                  style={{
                    fontFamily: 'var(--font-work-sans, sans-serif)',
                    fontSize:   '0.75rem',
                    color:      '#ffffff',
                    lineHeight: '16px',
                  }}
                >
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

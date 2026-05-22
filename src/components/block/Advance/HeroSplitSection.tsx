// Hero Split Section — Layout Builder (Advance)
// White bg, 2-col: badge+heading+body+CTAs | full-height image
// heroImagePosition: 'left' | 'right' (default right)

import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'

function CtaWrap({ href, className, style, children }: { href?: string; className?: string; style?: CSSProperties; children: ReactNode }) {
  if (href) return <Link href={href} className={className} style={style}>{children}</Link>
  return <span className={className} style={style}>{children}</span>
}

const CTA_ARROW = 'https://www.figma.com/api/mcp/asset/c2581a0e-817f-4155-a70f-a7a969d6d77f'

interface BreadcrumbItem { bcLabel?: string; bcHref?: string | null }

export interface HeroSplitSectionData {
  badge?:               string
  badgeIconSrc?:        string
  badgeIcon?:           { url: string } | null
  breadcrumbs?:         BreadcrumbItem[]
  heading?:             string
  body?:                string
  ctaPrimaryLabel?:        string
  ctaPrimaryUrl?:          string
  ctaPrimaryIcon?:         { url: string } | null
  ctaPrimaryIconPos?:      'left' | 'right'
  ctaPrimaryIconFill?:     boolean
  ctaSecondaryLabel?:      string
  ctaSecondaryUrl?:        string
  ctaSecondaryIcon?:       { url: string } | null
  ctaSecondaryIconPos?:    'left' | 'right'
  heroImage?:           { url: string; alt?: string } | null
  heroImagePosition?:   'left' | 'right'
  heroImagePadding?:    boolean
  heroStatValue?:       string
  heroStatLabel?:       string
}

export default function HeroSplitSection({ data }: { data: HeroSplitSectionData }) {
  const breadcrumbs = data.breadcrumbs ?? []
  const imageOnLeft = data.heroImagePosition === 'left'
  const badgeIcon   = data.badgeIcon?.url ?? data.badgeIconSrc ?? null

  const H_PAD = 104  // section horizontal padding (px)
  const V_PAD = 80   // section vertical padding (px)

  // ── Image panel ──────────────────────────────────────────────────────────────
  // position: relative + inset-0 absolute child fills 100% of the grid cell height.
  // The section is a flex column with minHeight 720px; the grid takes flex:1 so
  // both columns stretch to fill the full section height.
  const ImagePanel = (
    <div
      className="hidden lg:block"
      style={{ position: 'relative' }}
    >
      <div
        style={{
          position: 'absolute',
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
          overflow: 'hidden',
        }}
      >
        {data.heroImage?.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.heroImage.url}
            alt={data.heroImage.alt ?? ''}
            width={'100%'}
            height={'625px'}
            style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, width: '100%', height: '625px', objectFit: 'cover' }}
          />
        )}
      </div>
    </div>
  )

  return (
    <section style={{ background: '#ffffff', position: 'relative', display: 'flex', flexDirection: 'column', height: '625px' }}>
      {/* ── Main 2-column grid ── */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 items-stretch 
          ${imageOnLeft ? 'pr-[40px] md:pr-[104px]' : 'pl-[40px] md:pl-[104px]'}`}
        style={{ flex: 1 }}
      >
        {imageOnLeft && ImagePanel}

        {/* ── Content column ── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingBottom: `${V_PAD}px`,
          paddingLeft: imageOnLeft ? `60px` : '0',
          paddingRight: !imageOnLeft ? `60px` : '0',
        }}>
           {breadcrumbs.length > 0 && (
            <div style={{paddingTop: '27px',paddingBottom: '27px'  }}>
              <nav className="flex items-center gap-6 flex-wrap" aria-label="Breadcrumb">
                {breadcrumbs.map((item, idx) => (
                  <span key={idx} className="flex items-center gap-2">
                    {idx > 0 && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={'/images/breadcrumb-chevron.png'}
                        alt=""
                        style={{ width: '6.25px', height: '10px', objectFit: 'contain' }}
                      />
                    )}
                    {item.bcHref ? (
                      <Link
                        href={item.bcHref}
                        className="transition-colors duration-150 hover:text-[#171717]"
                        style={{ color: '#737373', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '14px', lineHeight: '20px' }}
                      >
                        {item.bcLabel}
                      </Link>
                    ) : (
                      <span style={{ color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '14px', lineHeight: '20px' }}>
                        {item.bcLabel}
                      </span>
                    )}
                  </span>
                ))}
              </nav>
            </div>
          )}
          
          {data.badge && (
            <div
              className="inline-flex items-center gap-2 self-start"
              style={{
                background: '#f5f5f5',
                border: '1px solid #e5e5e5',
                borderRadius: '9999px',
                padding: '9px 17px',
                marginBottom: '32px',
              }}
            >
              {badgeIcon && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={badgeIcon} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain', flexShrink: 0 }} />
              )}
              <span
                style={{
                  color: '#171717',
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize: '12px',
                  fontWeight: 400,
                  letterSpacing: '0.6px',
                  textTransform: 'uppercase',
                  lineHeight: '16px',
                }}
              >
                {data.badge}
              </span>
            </div>
          )}

          {data.heading && (
            <h1
              style={{
                fontFamily: 'var(--font-work-sans, sans-serif)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 400,
                color: '#171717',
                letterSpacing: '-1.2px',
                lineHeight: 1,
                marginBottom: '24px',
              }}
            >
              {data.heading.split('\n').map((line, i) => (
                <span key={i} style={{ display: 'block' }}>{line}</span>
              ))}
            </h1>
          )}

          {data.body && (
            <p
              style={{
                fontFamily: 'var(--font-work-sans, sans-serif)',
                fontSize: '18px',
                color: '#525252',
                lineHeight: '29.25px',
                marginBottom: '40px',
              }}
            >
              {data.body}
            </p>
          )}

          {(data.heroStatValue || data.heroStatLabel) && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '40px',
                paddingTop: '32px',
                borderTop: '1px solid #e5e5e5',
              }}
            >
              {data.heroStatValue && (
                <span style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '32px', fontWeight: 400, color: '#171717' }}>
                  {data.heroStatValue}
                </span>
              )}
              {data.heroStatLabel && (
                <span style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '14px', color: '#525252', lineHeight: '1.4' }}>
                  {data.heroStatLabel}
                </span>
              )}
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
            {data.ctaPrimaryLabel && (
              <CtaWrap
                href={data.ctaPrimaryUrl}
                className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
                style={{
                  background: '#171717',
                  color: '#ffffff',
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize: '16px',
                  fontWeight: 400,
                  padding: '16px 32px',
                  borderRadius: '6px',
                  lineHeight: '24px',
                }}
              >
                {data.ctaPrimaryIcon?.url && data.ctaPrimaryIconPos === 'left' && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data.ctaPrimaryIcon.url} alt="" style={{ width: '14px', height: '16px', objectFit: data.ctaPrimaryIconFill ? 'fill' : 'contain' }} />
                )}
                {data.ctaPrimaryLabel}
                {data.ctaPrimaryIcon?.url && data.ctaPrimaryIconPos !== 'left' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data.ctaPrimaryIcon.url} alt="" style={{ width: '14px', height: '16px', objectFit: data.ctaPrimaryIconFill ? 'fill' : 'contain' }} />
                ) : data.ctaPrimaryIcon === undefined ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={CTA_ARROW} alt="" style={{ width: '14px', height: '16px', objectFit: 'contain' }} />
                ) : null}
              </CtaWrap>
            )}

            {data.ctaSecondaryLabel && (
              <CtaWrap
                href={data.ctaSecondaryUrl}
                className="inline-flex items-center hover:opacity-70 transition-opacity duration-200"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '9999px',
                  color: '#171717',
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize: '16px',
                  fontWeight: 400,
                  padding: '16px 32px',
                }}
              >
                {data.ctaSecondaryLabel}
              </CtaWrap>
            )}
          </div>
        </div>

        {!imageOnLeft && ImagePanel}
      </div>
    </section>
  )
}

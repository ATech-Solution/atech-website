// Hero Split Section — Layout Builder (Advance)
// Two modes:
//   1. Full-bleed (backgroundImage set): full-width photo + dark gradient + white left-side content
//   2. 2-col (default): content left/right column + image panel right/left

import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'

const CSS = `
  .herosplit { background: #ffffff; position: relative; display: flex; flex-direction: column; height: 625px; }
  .herosplit__grid { flex: 1; }
  .herosplit__img { position: relative; }

  @media (max-width: 1023px) {
    .herosplit { height: auto !important; }
    .herosplit__grid {
      display: flex !important;
      flex-direction: column !important;
      padding-left: 20px !important;
      padding-right: 20px !important;
    }
    .herosplit__content {
      order: 1;
      padding-left: 0 !important;
      padding-right: 0 !important;
      padding-bottom: 40px !important;
    }
    .herosplit__img {
      order: 2;
      display: block !important;
      height: 280px;
      position: relative;
      width: calc(100% + 40px);
      margin-left: -20px;
      margin-right: -20px;
    }
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    .herosplit__img { height: 380px; }
  }

  .herosplit--fullbleed {
    background: #000;
    position: relative;
    overflow: hidden;
    min-height: 625px;
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 767px) {
    .herosplit--fullbleed { min-height: 480px; }
    .herosplit-fb__content { padding: 60px 24px !important; }
  }
`

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
  ctaPrimaryLabel?:     string
  ctaPrimaryUrl?:       string
  ctaPrimaryIcon?:      { url: string } | null
  ctaPrimaryIconPos?:   'left' | 'right'
  ctaPrimaryIconFill?:  boolean
  ctaSecondaryLabel?:   string
  ctaSecondaryUrl?:     string
  ctaSecondaryIcon?:    { url: string } | null
  ctaSecondaryIconPos?: 'left' | 'right'
  backgroundImage?:     { url: string; alt?: string } | null
  heroImage?:           { url: string; alt?: string } | null
  heroImagePosition?:   'left' | 'right'
  heroImagePadding?:    boolean
  heroStatValue?:       string
  heroStatLabel?:       string
}

export default function HeroSplitSection({ data }: { data: HeroSplitSectionData }) {
  const breadcrumbs = data.breadcrumbs ?? []
  const badgeIcon   = data.badgeIcon?.url ?? data.badgeIconSrc ?? null

  // ── Full-bleed background mode ────────────────────────────────────────────────
  if (data.backgroundImage?.url) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <section className="herosplit--fullbleed">
          {/* Background photo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.backgroundImage.url}
            alt={data.backgroundImage.alt ?? ''}
            aria-hidden
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />

          {/* Left-to-right gradient overlay */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
            }}
          />

          {/* Content */}
          <div
            className="herosplit-fb__content"
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
              paddingTop: '80px',
              paddingBottom: '80px',
              paddingLeft: '96px',
              paddingRight: '96px',
              gap: '32px',
            }}
          >
            {breadcrumbs.length > 0 && (
              <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }} aria-label="Breadcrumb">
                {breadcrumbs.map((item, idx) => (
                  <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {idx > 0 && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src="/images/breadcrumb-chevron.png" alt="" style={{ width: '5px', height: '8px', objectFit: 'contain', opacity: 0.6, filter: 'invert(1)' }} />
                    )}
                    {item.bcHref ? (
                      <Link href={item.bcHref} style={{ color: '#d1d5db', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '12px', fontWeight: 500, lineHeight: '16px', textDecoration: 'none' }}>
                        {item.bcLabel}
                      </Link>
                    ) : (
                      <span style={{ color: '#ffffff', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '12px', fontWeight: 500, lineHeight: '16px' }}>
                        {item.bcLabel}
                      </span>
                    )}
                  </span>
                ))}
              </nav>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '576px' }}>
              {data.badge && (
                <div style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#ffffff', borderRadius: '9999px', padding: '6px 16px' }}>
                  {badgeIcon && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={badgeIcon} alt="" style={{ width: '15px', height: '12px', objectFit: 'contain', flexShrink: 0 }} />
                  )}
                  <span style={{ color: '#1f2937', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '12px', fontWeight: 400, letterSpacing: '0.6px', textTransform: 'uppercase', lineHeight: '16px' }}>
                    {data.badge}
                  </span>
                </div>
              )}

              {data.heading && (
                <h1 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '48px', fontWeight: 600, color: '#ffffff', lineHeight: '48px', margin: 0 }}>
                  {data.heading.split('\n').map((line, i) => (
                    <span key={i} style={{ display: 'block' }}>{line}</span>
                  ))}
                </h1>
              )}

              {data.body && (
                <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '16px', fontWeight: 300, color: '#e5e7eb', lineHeight: '26px', margin: 0 }}>
                  {data.body}
                </p>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
                {data.ctaPrimaryLabel && (
                  <CtaWrap
                    href={data.ctaPrimaryUrl}
                    className="inline-flex items-center gap-2 hover:opacity-90 transition-opacity duration-200"
                    style={{ background: '#ffffff', color: '#111827', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '14px', fontWeight: 500, padding: '14px 24px', borderRadius: '4px', lineHeight: '20px', display: 'inline-flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}
                  >
                    {data.ctaPrimaryIcon?.url && data.ctaPrimaryIconPos === 'left' && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={data.ctaPrimaryIcon.url} alt="" style={{ width: '10.5px', height: '12px', objectFit: data.ctaPrimaryIconFill ? 'fill' : 'contain' }} />
                    )}
                    {data.ctaPrimaryLabel}
                    {data.ctaPrimaryIcon?.url && data.ctaPrimaryIconPos !== 'left' ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={data.ctaPrimaryIcon.url} alt="" style={{ width: '10.5px', height: '12px', objectFit: data.ctaPrimaryIconFill ? 'fill' : 'contain' }} />
                    ) : !data.ctaPrimaryIcon ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={CTA_ARROW} alt="" style={{ width: '10.5px', height: '12px', objectFit: 'contain' }} />
                    ) : null}
                  </CtaWrap>
                )}

                {data.ctaSecondaryLabel && (
                  <CtaWrap
                    href={data.ctaSecondaryUrl}
                    className="inline-flex items-center hover:opacity-70 transition-opacity duration-200"
                    style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '9999px', color: '#ffffff', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '16px', fontWeight: 400, padding: '16px 32px', textDecoration: 'none' }}
                  >
                    {data.ctaSecondaryLabel}
                  </CtaWrap>
                )}
              </div>
            </div>
          </div>
        </section>
      </>
    )
  }

  // ── 2-column mode (existing behavior — unchanged) ─────────────────────────────
  const imageOnLeft = data.heroImagePosition === 'left'
  const V_PAD = 80

  const ImagePanel = (
    <div
      className="herosplit__img"
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
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <section className="herosplit">
      {/* ── Main 2-column grid ── */}
      <div
        className={`herosplit__grid grid grid-cols-1 lg:grid-cols-2 items-stretch
          ${imageOnLeft ? 'pr-[40px] md:pr-[104px]' : 'pl-[40px] md:pl-[104px]'}`}
      >
        {imageOnLeft && ImagePanel}

        {/* ── Content column ── */}
        <div className="herosplit__content" style={{
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
    </>
  )
}

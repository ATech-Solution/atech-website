// Involved Hero Section — white background, 2-col: left = badge + heading + subheading + CTAs; right = image or dark card

import Link from 'next/link'

interface MediaRef { url: string; alt?: string }

interface InvolvedHeroData {
  badge?:              string
  // Badge icon — saved by ContentFields as badgeIcon (MediaRef); fall back to legacy badgeIconSrc string
  badgeIcon?:          MediaRef | null
  badgeIconSrc?:       string
  heading?:            string
  subheading?:         string
  ctaPrimaryLabel?:    string
  ctaPrimaryUrl?:      string
  // CTA icons — saved by ContentFields via CtaGroup as ctaPrimaryIcon / ctaSecondaryIcon
  ctaPrimaryIcon?:     MediaRef | null
  ctaPrimaryIconPos?:  'left' | 'right'
  ctaPrimaryIconFill?: boolean
  ctaSecondaryLabel?:  string
  ctaSecondaryUrl?:    string
  ctaSecondaryIcon?:     MediaRef | null
  ctaSecondaryIconPos?:  'left' | 'right'
  ctaSecondaryIconFill?: boolean
  // Legacy single-arrow field
  ctaArrowSrc?:        string
  // Right-side illustration image
  involvedHeroImage?:  MediaRef | null
}

export default function InvolvedHeroSection({ data }: { data: InvolvedHeroData }) {
  const {
    badge,
    badgeIcon, badgeIconSrc,
    heading, subheading,
    ctaPrimaryLabel, ctaPrimaryUrl, ctaPrimaryIcon, ctaPrimaryIconPos = 'right',
    ctaSecondaryLabel, ctaSecondaryUrl, ctaSecondaryIcon, ctaSecondaryIconPos = 'right',
    ctaArrowSrc,
    involvedHeroImage,
  } = data

  // Resolve badge icon — prefer MediaRef, fall back to legacy string src
  const badgeIconUrl = badgeIcon?.url ?? badgeIconSrc ?? ''

  // Resolve CTA icons — prefer per-button MediaRef, fall back to legacy shared ctaArrowSrc
  const primaryIconUrl   = ctaPrimaryIcon?.url   ?? ctaArrowSrc ?? ''
  const secondaryIconUrl = ctaSecondaryIcon?.url ?? ''

  const iconFit = (fill?: boolean) => (fill ? 'fill' : 'contain') as React.CSSProperties['objectFit']

  return (
    <section className="px-6 md:px-10 py-24" style={{ background: 'var(--section-bg, #ffffff)' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: content */}
          <div className="flex flex-col gap-6">

            {/* Badge */}
            {badge && (
              <div
                className="inline-flex items-center gap-2 px-4 py-2 self-start"
                style={{ background: '#f5f5f5', border: '1px solid rgba(0,0,0,0.08)' }}
              >
                {badgeIconUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={badgeIconUrl}
                    alt={badgeIcon?.alt ?? ''}
                    className="object-contain flex-shrink-0"
                    style={{ width: '24px', height: '24px', objectFit: iconFit(false) }}
                  />
                )}
                <span className="text-sm font-normal tracking-[0.35px] uppercase" style={{ color: '#000000', fontFamily: 'var(--font-work-sans, sans-serif)' }}>
                  {badge}
                </span>
              </div>
            )}

            {/* Heading */}
            {heading && (
              <h1 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 400, color: '#000000', letterSpacing: '-1.5px', lineHeight: 1 }}>
                {heading}
              </h1>
            )}

            {/* Subheading */}
            {subheading && (
              <p className="max-w-xl" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.25rem', color: '#000000', lineHeight: '1.625' }}>
                {subheading}
              </p>
            )}

            {/* CTAs */}
            {(ctaPrimaryLabel || ctaSecondaryLabel) && (
              <div className="flex flex-wrap items-center gap-4 pt-2">

                {ctaPrimaryLabel && ctaPrimaryUrl && (
                  <Link
                    href={ctaPrimaryUrl}
                    className="inline-flex items-center gap-2 px-8 py-4 text-sm font-normal transition-opacity duration-200 hover:opacity-80"
                    style={{ background: '#efefef', color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}
                  >
                    {ctaPrimaryIconPos === 'left' && primaryIconUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={primaryIconUrl} alt="" className="object-contain" style={{ width: '14px', height: '16px', objectFit: iconFit(data.ctaPrimaryIconFill) }} />
                    )}
                    {ctaPrimaryLabel}
                    {ctaPrimaryIconPos !== 'left' && primaryIconUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={primaryIconUrl} alt="" className="object-contain" style={{ width: '14px', height: '16px', objectFit: iconFit(data.ctaPrimaryIconFill) }} />
                    )}
                  </Link>
                )}

                {ctaSecondaryLabel && ctaSecondaryUrl && (
                  <Link
                    href={ctaSecondaryUrl}
                    className="inline-flex items-center gap-2 px-8 py-4 text-sm font-normal transition-opacity duration-200 hover:opacity-70"
                    style={{ border: '2px solid #e5e5e5', color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}
                  >
                    {ctaSecondaryIconPos === 'left' && secondaryIconUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={secondaryIconUrl} alt="" className="object-contain" style={{ width: '14px', height: '16px', objectFit: iconFit(data.ctaSecondaryIconFill) }} />
                    )}
                    {ctaSecondaryLabel}
                    {ctaSecondaryIconPos !== 'left' && secondaryIconUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={secondaryIconUrl} alt="" className="object-contain" style={{ width: '14px', height: '16px', objectFit: iconFit(data.ctaSecondaryIconFill) }} />
                    )}
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Right: illustration image or dark card placeholder */}
          <div style={{ height: '450px', overflow: 'hidden', position: 'relative' }}>
            {involvedHeroImage?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={involvedHeroImage.url}
                alt={involvedHeroImage.alt ?? heading ?? 'Community Collaboration Illustration'}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <div
                className="flex items-center justify-center w-full h-full"
                style={{ background: '#262626', border: '1px solid #404040' }}
              >
                <span style={{ color: '#a3a3a3', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', textAlign: 'center' }}>
                  Community Collaboration Illustration
                </span>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}

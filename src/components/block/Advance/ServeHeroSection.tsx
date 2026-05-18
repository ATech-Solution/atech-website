// Serve Hero Section — Layout Builder (Advance)
// White bg, 2-col: heading+body+CTAs | rounded image box with floating stat badge

import Link from 'next/link'

export interface ServeHeroSectionData {
  heading?:              string
  body?:                 string
  ctaPrimaryLabel?:      string
  ctaPrimaryUrl?:        string
  ctaSecondaryLabel?:    string
  ctaSecondaryUrl?:      string
  heroImage?:            { url: string; alt?: string } | null
  serveHeroStatIconSrc?: string
  serveHeroStatIconBg?:  string
  serveHeroStatValue?:   string
  serveHeroStatLabel?:   string
}

export default function ServeHeroSection({ data }: { data: ServeHeroSectionData }) {
  const statIconBg = data.serveHeroStatIconBg ?? '#ffd369'

  return (
    <section style={{ background: '#ffffff', position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 24px',
        }}
      >
        <div style={{ maxWidth: '1280px', width: '100%' }}>
          <div
            className="grid grid-cols-1 lg:grid-cols-2"
            style={{ gap: '48px', alignItems: 'center' }}
          >
            {/* Left: Text content */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {data.heading && (
                <h1
                  style={{
                    fontFamily: 'var(--font-work-sans, sans-serif)',
                    fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                    fontWeight: 400,
                    color: '#171717',
                    letterSpacing: '-1.2px',
                    lineHeight: '1',
                    marginBottom: '24px',
                    marginTop: 0,
                  }}
                >
                  {data.heading}
                </h1>
              )}

              {data.body && (
                <p
                  style={{
                    fontFamily: 'var(--font-work-sans, sans-serif)',
                    fontSize: '18px',
                    color: '#525252',
                    lineHeight: '29.25px',
                    marginBottom: '48px',
                    marginTop: 0,
                  }}
                >
                  {data.body}
                </p>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
                {data.ctaPrimaryLabel && data.ctaPrimaryUrl && (
                  <Link
                    href={data.ctaPrimaryUrl}
                    className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
                    style={{
                      background: '#171717',
                      color: '#ffffff',
                      fontFamily: 'var(--font-work-sans, sans-serif)',
                      fontSize: '16px',
                      fontWeight: 400,
                      padding: '16px 32px',
                      borderRadius: '8px',
                      lineHeight: '24px',
                      textDecoration: 'none',
                    }}
                  >
                    {data.ctaPrimaryLabel}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/arrow_white.png"
                      alt=""
                      style={{ width: '14px', height: '16px', objectFit: 'contain' }}
                    />
                  </Link>
                )}

                {data.ctaSecondaryLabel && data.ctaSecondaryUrl && (
                  <Link
                    href={data.ctaSecondaryUrl}
                    className="inline-flex items-center hover:opacity-70 transition-opacity duration-200"
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e5e5e5',
                      borderRadius: '8px',
                      color: '#171717',
                      fontFamily: 'var(--font-work-sans, sans-serif)',
                      fontSize: '16px',
                      fontWeight: 400,
                      padding: '16px 33px',
                      textDecoration: 'none',
                    }}
                  >
                    {data.ctaSecondaryLabel}
                  </Link>
                )}
              </div>
            </div>

            {/* Right: Rounded image box with floating stat badge */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  border: '1px solid #e5e5e5',
                  borderRadius: '16px',
                  height: '400px',
                  width: '100%',
                  overflow: 'hidden',
                  background: '#f5f5f5',
                  position: 'relative',
                }}
              >
                {data.heroImage?.url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.heroImage.url}
                    alt={data.heroImage.alt ?? ''}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                )}
              </div>

              {/* Floating stat badge */}
              {(data.serveHeroStatValue || data.serveHeroStatLabel) && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-24px',
                    left: '-24px',
                    background: '#ffffff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '12px',
                    padding: '25px',
                    boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  <div
                    style={{
                      background: statIconBg,
                      borderRadius: '9999px',
                      width: '48px',
                      height: '48px',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {data.serveHeroStatIconSrc && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={data.serveHeroStatIconSrc}
                        alt=""
                        style={{ width: '16px', height: '16px', objectFit: 'contain' }}
                      />
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {data.serveHeroStatValue && (
                      <span
                        style={{
                          fontFamily: 'var(--font-work-sans, sans-serif)',
                          fontSize: '14px',
                          color: '#171717',
                          lineHeight: '20px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {data.serveHeroStatValue}
                      </span>
                    )}
                    {data.serveHeroStatLabel && (
                      <span
                        style={{
                          fontFamily: 'var(--font-work-sans, sans-serif)',
                          fontSize: '12px',
                          color: '#525252',
                          lineHeight: '16px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {data.serveHeroStatLabel}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

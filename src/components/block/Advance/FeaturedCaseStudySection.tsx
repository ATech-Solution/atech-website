// Featured Case Study Section — 2-col layout with configurable image position (left | right)

import Link from 'next/link'

interface MediaRef { url: string; alt?: string }

interface FeaturedCaseStudyData {
  sectionLabel?:         string
  caseTitle?:            string
  caseDesc?:             string
  clientLogo?:           MediaRef | null
  caseImage?:            MediaRef | null
  floatingPlatform?:     string
  floatingPlatformType?: string
  floatingIconSrc?:      string
  ctaPrimaryLabel?:      string
  ctaPrimaryUrl?:        string
  imagePosition?:        'left' | 'right'
}

export default function FeaturedCaseStudySection({ data }: { data: FeaturedCaseStudyData }) {
  const {
    sectionLabel      = 'Featured Case Study',
    caseTitle         = '',
    caseDesc          = '',
    clientLogo        = null,
    caseImage         = null,
    floatingPlatform  = '',
    floatingPlatformType = '',
    floatingIconSrc   = '',
    ctaPrimaryLabel   = '',
    ctaPrimaryUrl     = '#',
    imagePosition     = 'right',
  } = data

  const isImageLeft = imagePosition === 'left'

  const textCol = (
    <div className="flex flex-col flex-1 min-w-0" style={{ gap: '16px' }}>
      {sectionLabel && (
        <p
          className="m-0"
          style={{
            fontFamily: 'var(--font-work-sans, sans-serif)',
            fontSize: '12px',
            fontWeight: 600,
            color: '#737373',
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            lineHeight: '18px',
          }}
        >
          {sectionLabel}
        </p>
      )}

      {caseTitle && (
        <h2
          className="m-0"
          style={{
            fontFamily: 'var(--font-work-sans, sans-serif)',
            fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
            fontWeight: 400,
            color: '#171717',
            lineHeight: '44px',
            letterSpacing: '-0.3px',
          }}
        >
          {caseTitle}
        </h2>
      )}

      {caseDesc && (
        <p
          className="m-0"
          style={{
            fontFamily: 'var(--font-work-sans, sans-serif)',
            fontSize: '18px',
            fontWeight: 400,
            color: '#525252',
            lineHeight: '28px',
            paddingTop: '8px',
          }}
        >
          {caseDesc}
        </p>
      )}

      {ctaPrimaryLabel && ctaPrimaryUrl && (
        <Link
          href={ctaPrimaryUrl}
          className="inline-flex items-center gap-2 mt-2 transition-opacity duration-200 hover:opacity-70"
          style={{
            fontFamily: 'var(--font-work-sans, sans-serif)',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#171717',
          }}
        >
          {ctaPrimaryLabel}
        </Link>
      )}

      {clientLogo?.url && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={clientLogo.url}
          alt={clientLogo.alt ?? 'Client logo'}
          style={{ height: '79px', width: 'auto', objectFit: 'contain', objectPosition: 'left' }}
        />
      )}
    </div>
  )

  const imageCol = (
    <div className="flex-1 min-w-0 relative w-full">
      <div
        className="relative overflow-hidden w-full"
        style={{
          background: '#f5f5f5',
          border: '1px solid #e5e5e5',
          borderRadius: '24px',
          height: '500px',
        }}
      >
        {caseImage?.url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={caseImage.url}
            alt={caseImage.alt ?? 'Case study preview'}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ color: '#a3a3a3', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '14px' }}
          >
            Case study image
          </div>
        )}
      </div>

      {/* Floating platform badge — bottom-left when image is on right, top-right when image is on left */}
      {(floatingPlatform || floatingPlatformType) && (
        <div
          className="absolute flex items-center"
          style={isImageLeft
            ? { right: '24px', top: '-24px', background: '#ffffff', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', gap: '16px', width: '260px', boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)' }
            : { left: '24px', bottom: '-20px', background: '#ffffff', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', gap: '16px', width: '279px', boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)' }
          }
        >
          {/* Icon circle */}
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              background: '#FFD369',
              borderRadius: '9999px',
              width: '48px',
              height: '48px',
            }}
          >
            {floatingIconSrc ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={floatingIconSrc} alt="" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontSize: '20px' }}>📱</span>
            )}
          </div>

          {/* Text */}
          <div className="flex flex-col" style={{ gap: '2px' }}>
            {floatingPlatform && (
              <p
                className="m-0"
                style={{
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#171717',
                  lineHeight: '27px',
                }}
              >
                {floatingPlatform}
              </p>
            )}
            {floatingPlatformType && (
              <p
                className="m-0"
                style={{
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize: '12px',
                  fontWeight: 400,
                  color: '#525252',
                  lineHeight: '18px',
                }}
              >
                {floatingPlatformType}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <section className="py-[100px] px-6 md:px-10" style={{ background: '#ffffff' }}>
      <div
        className="mx-auto flex flex-col lg:flex-row items-center"
        style={{ maxWidth: '1200px', gap: '80px' }}
      >
        {isImageLeft ? imageCol : textCol}
        {isImageLeft ? textCol : imageCol}
      </div>
    </section>
  )
}

// Article Feature Section — Layout Builder variant (Advance)
// Used by: article-feature block type
// White background, 2-column featured article: image left + content right with section label accent

import Link from 'next/link'

export interface ArticleFeatureData {
  artFeatSectionLabel?:  string
  artFeatContentSource?: 'collection' | 'manual'
  artFeatImage?:         { url: string; alt?: string } | null
  artFeatCategory?:      string
  artFeatDate?:          string
  artFeatTitle?:         string
  artFeatDesc?:          string
  artFeatReadTime?:      string
  artFeatViews?:         string
  artFeatCtaLabel?:      string
  artFeatCtaUrl?:        string
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="7" cy="7" r="6" stroke="#737373" strokeWidth="1.2" />
      <path d="M7 4v3l2 1.5" stroke="#737373" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M1 7s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="#737373" strokeWidth="1.2" />
      <circle cx="8" cy="7" r="2" stroke="#737373" strokeWidth="1.2" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M1 8h12M7 2l6 6-6 6" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function ArticleFeatureSection({ data }: { data: ArticleFeatureData }) {
  const sectionLabel = data.artFeatSectionLabel || 'Featured Article'
  const ctaLabel     = data.artFeatCtaLabel     || 'Read Full Article'

  return (
    <section style={{ background: 'var(--section-bg, #ffffff)', padding: '80px' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px', padding: '0 32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

        {/* Section label with left-border accent */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '4px', height: '32px', background: '#171717', flexShrink: 0 }} />
          <span
            style={{
              paddingLeft:   '12px',
              fontFamily:    'var(--font-work-sans, sans-serif)',
              fontSize:      '14px',
              fontWeight:    400,
              color:         '#171717',
              letterSpacing: '0.7px',
              textTransform: 'uppercase',
              lineHeight:    '20px',
            }}
          >
            {sectionLabel}
          </span>
        </div>

        {/* 2-column grid: image | content */}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '48px', alignItems: 'center' }}>

          {/* Left: image */}
          <div
            style={{
              position:    'relative',
              width:       '100%',
              aspectRatio: '4/3',
              overflow:    'hidden',
              background:  '#e5e5e5',
            }}
          >
            {data.artFeatImage?.url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.artFeatImage.url}
                alt={data.artFeatImage.alt ?? data.artFeatTitle ?? ''}
                style={{
                  position:   'absolute',
                  inset:      0,
                  width:      '100%',
                  height:     '100%',
                  objectFit:  'cover',
                }}
              />
            )}
          </div>

          {/* Right: content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

            {/* Category + date */}
            {(data.artFeatCategory || data.artFeatDate) && (
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0' }}>
                {data.artFeatCategory && (
                  <span
                    style={{
                      background:    '#171717',
                      color:         '#ffffff',
                      fontFamily:    'var(--font-work-sans, sans-serif)',
                      fontSize:      '12px',
                      fontWeight:    400,
                      letterSpacing: '0.6px',
                      textTransform: 'uppercase',
                      lineHeight:    '16px',
                      padding:       '4px 12px',
                    }}
                  >
                    {data.artFeatCategory}
                  </span>
                )}
                {data.artFeatDate && (
                  <span
                    style={{
                      paddingLeft: '16px',
                      fontFamily:  'var(--font-work-sans, sans-serif)',
                      fontSize:    '14px',
                      fontWeight:  400,
                      color:       '#737373',
                      lineHeight:  '20px',
                    }}
                  >
                    {data.artFeatDate}
                  </span>
                )}
              </div>
            )}

            {/* Title */}
            {data.artFeatTitle && (
              <h2
                style={{
                  fontFamily:  'var(--font-work-sans, sans-serif)',
                  fontSize:    '36px',
                  fontWeight:  400,
                  color:       '#171717',
                  lineHeight:  '40px',
                  margin:      0,
                  paddingTop:  '1px',
                }}
              >
                {data.artFeatTitle}
              </h2>
            )}

            {/* Description */}
            {data.artFeatDesc && (
              <p
                style={{
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize:   '18px',
                  fontWeight: 400,
                  color:      '#525252',
                  lineHeight: '29px',
                  margin:     0,
                }}
              >
                {data.artFeatDesc}
              </p>
            )}

            {/* Meta: read time + views */}
            {(data.artFeatReadTime || data.artFeatViews) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '8px 0 16px' }}>
                {data.artFeatReadTime && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ClockIcon />
                    <span style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '14px', color: '#737373', lineHeight: '20px' }}>
                      {data.artFeatReadTime}
                    </span>
                  </div>
                )}
                {data.artFeatViews && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <EyeIcon />
                    <span style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '14px', color: '#737373', lineHeight: '20px' }}>
                      {data.artFeatViews}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* CTA button */}
            {data.artFeatCtaUrl ? (
              <Link
                href={data.artFeatCtaUrl}
                style={{
                  display:        'inline-flex',
                  alignItems:     'center',
                  gap:            '8px',
                  padding:        '12px 32px',
                  background:     '#171717',
                  color:          '#ffffff',
                  fontFamily:     'var(--font-work-sans, sans-serif)',
                  fontSize:       '16px',
                  fontWeight:     400,
                  lineHeight:     '24px',
                  textDecoration: 'none',
                  alignSelf:      'flex-start',
                  transition:     'opacity 0.2s',
                }}
                className="hover:opacity-80"
              >
                {ctaLabel}
                <ArrowIcon />
              </Link>
            ) : (
              <button
                style={{
                  display:     'inline-flex',
                  alignItems:  'center',
                  gap:         '8px',
                  padding:     '12px 32px',
                  background:  '#171717',
                  color:       '#ffffff',
                  fontFamily:  'var(--font-work-sans, sans-serif)',
                  fontSize:    '16px',
                  fontWeight:  400,
                  lineHeight:  '24px',
                  border:      'none',
                  cursor:      'pointer',
                  alignSelf:   'flex-start',
                }}
              >
                {ctaLabel}
                <ArrowIcon />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

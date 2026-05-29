// Insights Tech Guide Section — Layout Builder variant (Advance)
// Used by: insights-tech-guide block type
// White background, 2-column grid of guide cards with icon + title + description + tag chips + CTA

import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'

interface TechGuideItem {
  guideIcon?:     { url: string } | null
  guideTitle?:    string
  guideDesc?:     string
  guideTags?:     string  // comma-separated tag list
  guideCtaLabel?: string
  guideCtaUrl?:   string
}

export interface InsightsTechGuideData {
  heading?:    string
  subheading?: string
  guideItems?: TechGuideItem[]
}

function DefaultIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M7 1v8M4 6l3 3 3-3M1 10v1a2 2 0 002 2h8a2 2 0 002-2v-1" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TagChip({ label }: { label: string }) {
  return (
    <span
      style={{
        display:      'inline-block',
        background:   '#ffffff',
        border:       '1px solid #d4d4d4',
        borderRadius: '8px',
        padding:      '9px 17px',
        fontFamily:   'var(--font-work-sans, sans-serif)',
        fontSize:     '14px',
        fontWeight:   400,
        color:        '#171717',
        lineHeight:   '20px',
        whiteSpace:   'nowrap',
      }}
    >
      {label}
    </span>
  )
}

function GuideCard({ guideIcon, guideTitle, guideDesc, guideTags, guideCtaLabel, guideCtaUrl }: TechGuideItem) {
  const tags = (guideTags ?? '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  const ctaLabel = guideCtaLabel || 'Download Full Guide'

  return (
    <div
      style={{
        background:   '#fafafa',
        border:       '2px solid #e5e5e5',
        borderRadius: '16px',
        overflow:     'hidden',
        display:      'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display:       'flex',
          flexDirection: 'column',
          gap:           '16px',
          padding:       '40px',
        }}
      >
        {/* Icon box */}
        <div
          style={{
            width:           '64px',
            height:          '64px',
            background:      '#171717',
            borderRadius:    '12px',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            flexShrink:      0,
          }}
        >
          {guideIcon?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={guideIcon.url} alt="" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
          ) : (
            <DefaultIcon />
          )}
        </div>

        {/* Title */}
        {guideTitle && (
          <div style={{ paddingTop: '8px' }}>
            <h3
              style={{
                fontFamily:  'var(--font-work-sans, sans-serif)',
                fontSize:    '30px',
                fontWeight:  400,
                color:       '#171717',
                lineHeight:  '36px',
                margin:      0,
              }}
            >
              {guideTitle}
            </h3>
          </div>
        )}

        {/* Description */}
        {guideDesc && (
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
            {guideDesc}
          </p>
        )}

        {/* Tag chips */}
        {tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', paddingTop: '8px' }}>
            {tags.map((tag, i) => (
              <TagChip key={i} label={tag} />
            ))}
          </div>
        )}

        {/* CTA button */}
        {guideCtaUrl ? (
          <Link
            href={guideCtaUrl}
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            '12px',
              padding:        '16px 32px',
              background:     '#171717',
              borderRadius:   '8px',
              fontFamily:     'var(--font-work-sans, sans-serif)',
              fontSize:       '14px',
              fontWeight:     400,
              color:          '#ffffff',
              textDecoration: 'none',
              alignSelf:      'flex-start',
              transition:     'opacity 0.2s',
            }}
            className="hover:opacity-80"
          >
            <DownloadIcon />
            {ctaLabel}
          </Link>
        ) : (
          <button
            style={{
              display:      'inline-flex',
              alignItems:   'center',
              gap:          '12px',
              padding:      '16px 32px',
              background:   '#171717',
              borderRadius: '8px',
              fontFamily:   'var(--font-work-sans, sans-serif)',
              fontSize:     '14px',
              fontWeight:   400,
              color:        '#ffffff',
              border:       'none',
              cursor:       'pointer',
              alignSelf:    'flex-start',
            }}
          >
            <DownloadIcon />
            {ctaLabel}
          </button>
        )}
      </div>
    </div>
  )
}

export default function InsightsTechGuideSection({ data }: { data: InsightsTechGuideData }) {
  const items = data.guideItems ?? []

  return (
    <section style={{ background: 'var(--section-bg, #ffffff)', padding: '80px' }}>
      <div
        className="mx-auto"
        style={{
          maxWidth:      '1280px',
          padding:       '0 24px',
          display:       'flex',
          flexDirection: 'column',
          gap:           '64px',
          alignItems:    'center',
        }}
      >
        {/* Section header */}
        {(data.heading || data.subheading) && (
          <div style={{ maxWidth: '768px', width: '100%' }}>
            <SectionHeader
              heading={data.heading ?? ''}
              subheading={data.subheading}
              align="center"
              headingColor="#171717"
              subheadingColor="#525252"
              headingFontWeight={400}
            />
          </div>
        )}

        {/* Guide card grid */}
        {items.length > 0 && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 w-full"
            style={{ gap: '48px', maxWidth: '1152px' }}
          >
            {items.map((item, idx) => (
              <GuideCard key={idx} {...item} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

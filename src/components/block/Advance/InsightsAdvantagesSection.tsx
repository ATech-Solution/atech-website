// Insights Advantages Section — Layout Builder variant (Advance)
// Used by: insights-advantages block type
// Yellow (#ffd369) background, 3×N grid of advantage cards with icon + title + description

import SectionHeader from '@/components/ui/SectionHeader'

interface AdvantageItem {
  advIcon?:  { url: string } | null
  advTitle?: string
  advDesc?:  string
}

export interface InsightsAdvantagesData {
  heading?:        string
  subheading?:     string
  advSectionBg?:      'yellow' | 'white' | 'dark'
  advantageItems?: AdvantageItem[]
}

function DefaultIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M10 2l2.09 4.26L17 7.27l-3.5 3.41.83 4.82L10 13.27l-4.33 2.23.83-4.82L3 7.27l4.91-.71L10 2z" fill="#ffffff" />
    </svg>
  )
}

function AdvantageCard({ advIcon, advTitle, advDesc }: AdvantageItem) {
  return (
    <div
      className="flex flex-col gap-4"
      style={{
        background: '#ffffff',
        border:     '1px solid #e5e5e5',
        padding:    '33px',
      }}
    >
      {/* Icon box */}
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width:        '48px',
          height:       '48px',
          background:   '#171717',
          borderRadius: '8px',
        }}
      >
        {advIcon?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={advIcon.url} alt="" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
        ) : (
          <DefaultIcon />
        )}
      </div>

      {/* Title */}
      {advTitle && (
        <div style={{ paddingTop: '8px' }}>
          <h3
            style={{
              fontFamily:  'var(--font-work-sans, sans-serif)',
              fontSize:    '20px',
              fontWeight:  400,
              color:       '#171717',
              lineHeight:  '28px',
              margin:      0,
            }}
          >
            {advTitle}
          </h3>
        </div>
      )}

      {/* Description */}
      {advDesc && (
        <p
          style={{
            fontFamily: 'var(--font-work-sans, sans-serif)',
            fontSize:   '16px',
            fontWeight: 400,
            color:      '#525252',
            lineHeight: '26px',
            margin:     0,
          }}
        >
          {advDesc}
        </p>
      )}
    </div>
  )
}

const BG_MAP: Record<string, string> = {
  yellow: '#ffd369',
  white:  '#ffffff',
  dark:   '#171717',
}

const HEADING_COLOR_MAP: Record<string, string> = {
  yellow: '#171717',
  white:  '#171717',
  dark:   '#ffffff',
}

const SUBHEADING_COLOR_MAP: Record<string, string> = {
  yellow: '#525252',
  white:  '#525252',
  dark:   '#a3a3a3',
}

export default function InsightsAdvantagesSection({ data }: { data: InsightsAdvantagesData }) {
  const items    = data.advantageItems ?? []
  const bgKey    = data.advSectionBg ?? 'yellow'
  const bg       = BG_MAP[bgKey] ?? '#ffd369'
  const headingColor    = HEADING_COLOR_MAP[bgKey] ?? '#171717'
  const subheadingColor = SUBHEADING_COLOR_MAP[bgKey] ?? '#525252'

  return (
    <section
      style={{
        background: bg,
        padding:    '80px',
      }}
    >
      <div
        className="mx-auto"
        style={{
          maxWidth: '1280px',
          padding:  '0 24px',
          display:  'flex',
          flexDirection: 'column',
          gap: '64px',
          alignItems: 'center',
        }}
      >
        {/* Header */}
        {(data.heading || data.subheading) && (
          <div style={{ maxWidth: '768px', width: '100%' }}>
            <SectionHeader
              heading={data.heading ?? ''}
              subheading={data.subheading}
              align="center"
              headingColor={headingColor}
              subheadingColor={subheadingColor}
              headingFontWeight={400}
            />
          </div>
        )}

        {/* Card grid */}
        {items.length > 0 && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full"
            style={{ gap: '32px' }}
          >
            {items.map((item, idx) => (
              <AdvantageCard key={idx} {...item} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

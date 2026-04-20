// Card Grid Section — Layout Builder (Advance)
// Dark (#292929) bg, 3-col icon+title+description+features cards

import SectionHeader from '@/components/ui/SectionHeader'

function CheckIcon() {
  return (
    <svg width="11" height="12" viewBox="0 0 11 12" fill="none" aria-hidden>
      <path d="M1.5 6.5 4.5 9.5 9.5 2.5" stroke="#525252" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

interface CardItem {
  cardIconSrc?:     string
  cardTitle?:       string
  cardDescription?: string
  cardFeatures?:    string
}

export interface CardGridSectionData {
  heading?:        string
  subtitle?:       string
  cardItems?:      CardItem[]
  cardGridTheme?:  'dark' | 'light'
}

function ServiceCard({ cardIconSrc, cardTitle, cardDescription, cardFeatures }: CardItem) {
  const features = (cardFeatures ?? '')
    .split('\n')
    .map((f) => f.trim())
    .filter(Boolean)

  return (
    <div className="relative flex flex-col p-8 rounded-2xl" style={{ background: '#ffffff', border: '1px solid #e5e5e5' }}>
      <div className="flex items-center justify-center rounded-lg mb-6 flex-shrink-0" style={{ background: '#f5f5f5', width: '48px', height: '48px' }}>
        {cardIconSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cardIconSrc} alt="" className="object-contain" style={{ maxWidth: '26px', maxHeight: '22px' }} />
        ) : (
          <span style={{ fontSize: '20px' }}>□</span>
        )}
      </div>

      {cardTitle && (
        <h3 className="mb-3" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.25rem', fontWeight: 400, color: '#171717', lineHeight: '28px' }}>
          {cardTitle}
        </h3>
      )}

      {cardDescription && (
        <p className="mb-5" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#525252', lineHeight: '1.625' }}>
          {cardDescription}
        </p>
      )}

      {features.length > 0 && (
        <ul className="flex flex-col gap-2 mt-auto">
          {features.map((feat, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <CheckIcon />
              <span className="text-sm font-normal" style={{ color: '#525252', fontFamily: 'var(--font-work-sans, sans-serif)' }}>
                {feat}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function CardGridSection({ data }: { data: CardGridSectionData }) {
  const cards      = data.cardItems ?? []
  const isLight    = data.cardGridTheme === 'light'
  const sectionBg  = isLight ? '#fafafa' : '#292929'
  const headingCol = isLight ? '#171717' : '#ffcd37'
  const subCol     = isLight ? '#525252' : '#ffffff'

  return (
    <section className="py-24" style={{ background: sectionBg }}>
      <div className="mx-auto px-6 md:px-10" style={{ maxWidth: '1280px' }}>
        {(data.heading || data.subtitle) && (
          <div className="mb-16 flex justify-center">
            <div style={{ maxWidth: '768px', width: '100%' }}>
              <SectionHeader heading={data.heading ?? ''} subheading={data.subtitle} align="center" headingColor={headingCol} subheadingColor={subCol} />
            </div>
          </div>
        )}

        {cards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, idx) => (
              <ServiceCard key={idx} {...card} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

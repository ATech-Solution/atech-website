// Expertise Tiles Section — Layout Builder variant (Advance)
// Used by: expertise-tiles block type
// Yellow (#ffd369) background, 4×2 white icon+label tile grid

import SectionHeader from '@/components/ui/SectionHeader'

interface ExpertiseTile {
  tileIconSrc?: string
  tileImage?:   { url: string } | null
  tileLabel?:   string
}

export interface ExpertiseTilesSectionData {
  heading?:        string
  subheading?:     string
  expertiseTiles?: ExpertiseTile[]
}

function DefaultIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M10 10L5 15L10 20" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 10L25 15L20 20" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 7L13 23" stroke="#171717" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function Tile({ tileIconSrc, tileImage, tileLabel }: ExpertiseTile) {
  const iconUrl = tileImage?.url ?? tileIconSrc
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        background:   '#ffffff',
        border:       '1px solid #e5e5e5',
        borderRadius: 0,
        padding:      '25px',
        gap:          '14px',
      }}
    >
      {iconUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={iconUrl} alt="" className="object-contain" style={{ width: '30px', height: '30px' }} />
      ) : (
        <DefaultIcon />
      )}
      {tileLabel && (
        <span
          className="text-center"
          style={{
            color:      '#171717',
            fontFamily: 'var(--font-work-sans, sans-serif)',
            fontSize:   '14px',
            fontWeight: 400,
            lineHeight: '20px',
          }}
        >
          {tileLabel}
        </span>
      )}
    </div>
  )
}

export default function ExpertiseTilesSection({ data }: { data: ExpertiseTilesSectionData }) {
  const tiles = data.expertiseTiles ?? []

  return (
    <section style={{ background: 'var(--section-bg, #ffd369)', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5', padding: '81px 80px' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px', padding: '0 32px' }}>
        {(data.heading || data.subheading) && (
          <div className="mb-16 flex justify-center">
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
          </div>
        )}

        {tiles.length > 0 && (
          <div
            className="grid grid-cols-2 sm:grid-cols-4"
            style={{ gap: '24px' }}
          >
            {tiles.map((tile, idx) => (
              <Tile key={idx} {...tile} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

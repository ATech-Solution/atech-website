// Expertise Tiles Section — Layout Builder variant (Advance)
// Used by: expertise-tiles block type
// Yellow (#ffd369) background, 4×2 white icon+label tile grid

import SectionHeader from '@/components/ui/SectionHeader'

interface ExpertiseTile {
  tileIconSrc?: string
  tileLabel?:   string
}

export interface ExpertiseTilesSectionData {
  heading?:        string
  subheading?:     string
  expertiseTiles?: ExpertiseTile[]
}

function Tile({ tileIconSrc, tileLabel }: ExpertiseTile) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 p-6 rounded-2xl"
      style={{ background: '#ffffff', border: '1px solid #e5e5e5' }}
    >
      {tileIconSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={tileIconSrc} alt="" className="object-contain" style={{ width: '32px', height: '32px' }} />
      )}
      {tileLabel && (
        <span
          className="text-center text-sm font-normal"
          style={{
            color:      '#171717',
            fontFamily: 'var(--font-work-sans, sans-serif)',
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
    <section className="py-24" style={{ background: '#ffd369' }}>
      <div className="mx-auto px-6 md:px-10" style={{ maxWidth: '1280px' }}>
        {(data.heading || data.subheading) && (
          <div className="mb-16 flex justify-center">
            <div style={{ maxWidth: '768px', width: '100%' }}>
              <SectionHeader
                heading={data.heading ?? ''}
                subheading={data.subheading}
                align="center"
                headingColor="#171717"
                subheadingColor="#292929"
              />
            </div>
          </div>
        )}

        {tiles.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {tiles.map((tile, idx) => (
              <Tile key={idx} {...tile} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

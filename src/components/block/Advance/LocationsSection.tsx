// Locations Section — Layout Builder (Advance)
// Style 1: white bg, centered heading, 3-col #fafafa cards (no icons)
// Style 2: white bg, 96px padding, 3-col cards with icon boxes (Figma 1418:11257)

interface OfficeEntry {
  officeName?:    string
  officeAddress?: string
}

interface LocationCard {
  cardOffices?: OfficeEntry[]
}

interface LocationsData {
  locStyle?:      'style1' | 'style2'
  heading?:       string
  // grouped structure
  locationCards?: LocationCard[]
  // legacy flat fallback
  officeItems?:   OfficeEntry[]
}

// ─── Style 2 — icon-box cards (Figma 1418:11257) ─────────────────────────────

const LOC2_CSS = `
  .loc2{box-sizing:border-box;background:#ffffff;padding:96px;display:flex;flex-direction:column;gap:64px;width:100%}
  .loc2__heading{font-family:var(--font-work-sans,'Work Sans',sans-serif);font-weight:500;font-size:30px;line-height:36px;color:#111827;text-align:center;margin:0}
  .loc2__grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;width:100%}
  .loc2__card{background:#f9fafb;border-radius:16px;padding:32px;display:flex;flex-direction:column;gap:8px}
  .loc2__office{display:flex;flex-direction:column;gap:8px}
  .loc2__icon-box{width:40px;height:40px;background:#363636;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .loc2__name{font-family:var(--font-work-sans,'Work Sans',sans-serif);font-weight:600;font-size:16px;line-height:24px;color:#111827;margin:0}
  .loc2__addr{font-family:var(--font-work-sans,'Work Sans',sans-serif);font-weight:400;font-size:12px;line-height:16px;color:#6b7280;margin:0;white-space:pre-line}
  @media(max-width:1023px){.loc2__grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
  @media(max-width:639px){.loc2{padding:64px 24px}.loc2__grid{grid-template-columns:1fr}}
`

function PinIcon() {
  return (
    <svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.5 0C2.46 0 0 2.46 0 5.5C0 9.625 5.5 14 5.5 14C5.5 14 11 9.625 11 5.5C11 2.46 8.54 0 5.5 0ZM5.5 7.5C4.395 7.5 3.5 6.605 3.5 5.5C3.5 4.395 4.395 3.5 5.5 3.5C6.605 3.5 7.5 4.395 7.5 5.5C7.5 6.605 6.605 7.5 5.5 7.5Z" fill="white"/>
    </svg>
  )
}

function LocationsStyle2({ data }: { data: LocationsData }) {
  const { heading, locationCards, officeItems = [] } = data
  const cards: LocationCard[] = locationCards?.length
    ? locationCards
    : officeItems.map((o) => ({ cardOffices: [o] }))

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: LOC2_CSS }} />
      <section className="loc2">
        {heading && <h2 className="loc2__heading">{heading}</h2>}
        {cards.length > 0 && (
          <div className="loc2__grid">
            {cards.map((card, ci) => {
              const offices = card.cardOffices ?? []
              return (
                <div key={ci} className="loc2__card">
                  {offices.map((office, oi) => {
                    const isLast = oi === offices.length - 1
                    return (
                      <div key={oi} className="loc2__office">
                        <div className="loc2__icon-box">
                          <PinIcon />
                        </div>
                        {office.officeName && (
                          <div style={{ paddingTop: '8px' }}>
                            <p className="loc2__name">{office.officeName}</p>
                          </div>
                        )}
                        {office.officeAddress && (
                          <div style={{ paddingBottom: isLast ? 0 : '24px' }}>
                            <p className="loc2__addr">{office.officeAddress}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}

// ─── Default export — routes on locStyle ──────────────────────────────────────

export default function LocationsSection({ data }: { data: LocationsData }) {
  if ((data.locStyle ?? 'style1') === 'style2') return <LocationsStyle2 data={data} />

  const { heading, locationCards, officeItems = [] } = data

  // Use locationCards if available, otherwise fall back to flat officeItems (each = 1-office card)
  const cards: LocationCard[] = locationCards?.length
    ? locationCards
    : officeItems.map((o) => ({ cardOffices: [o] }))

  return (
    <section style={{ background: 'var(--section-bg, #ffffff)', padding: '80px 0' }}>
      <div
        className="mx-auto px-8 flex flex-col"
        style={{ maxWidth: '1280px', gap: '64px' }}
      >
        {/* Heading */}
        {heading && (
          <div className="flex flex-col items-center">
            <h2
              className="text-center"
              style={{
                fontFamily: 'var(--font-work-sans, sans-serif)',
                fontSize: '2.25rem',
                fontWeight: 400,
                color: '#000000',
                lineHeight: '40px',
              }}
            >
              {heading}
            </h2>
          </div>
        )}

        {/* Cards grid */}
        {cards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '32px' }}>
            {cards.map((card, ci) => {
              const offices = card.cardOffices ?? []
              return (
                <div
                  key={ci}
                  className="flex flex-col"
                  style={{
                    background: '#fafafa',
                    borderRadius: '12px',
                    padding: '32px',
                    gap: '8px',
                  }}
                >
                  {offices.map((office, oi) => (
                    <div key={oi} className="flex flex-col" style={{ gap: '8px' }}>
                      {office.officeName && (
                        <h3
                          style={{
                            fontFamily: 'var(--font-work-sans, sans-serif)',
                            fontSize: '1.25rem',
                            fontWeight: 400,
                            color: '#000000',
                            lineHeight: '28px',
                            paddingTop: '16px',
                          }}
                        >
                          {office.officeName}
                        </h3>
                      )}
                      {office.officeAddress && (
                        <p
                          style={{
                            fontFamily: 'var(--font-work-sans, sans-serif)',
                            fontSize: '1rem',
                            color: '#525252',
                            lineHeight: '24px',
                            paddingTop: '8px',
                            whiteSpace: 'pre-line',
                          }}
                        >
                          {office.officeAddress}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

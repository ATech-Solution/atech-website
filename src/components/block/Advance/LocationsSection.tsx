// Locations Section — Layout Builder (Advance)
// White bg, centered heading, 3-col #fafafa cards, each card holds multiple offices

interface OfficeEntry {
  officeName?:    string
  officeAddress?: string
}

interface LocationCard {
  cardOffices?: OfficeEntry[]
}

interface LocationsData {
  heading?:       string
  // new grouped structure
  locationCards?: LocationCard[]
  // legacy flat fallback
  officeItems?:   OfficeEntry[]
}

export default function LocationsSection({ data }: { data: LocationsData }) {
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

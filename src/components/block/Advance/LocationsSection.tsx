// Locations Section — light #f5f5f5 background, heading + office location grid

interface OfficeItem {
  officeName?:    string
  officeAddress?: string
}

interface LocationsData {
  heading?:    string
  officeItems?: OfficeItem[]
}

export default function LocationsSection({ data }: { data: LocationsData }) {
  const { heading, officeItems = [] } = data

  return (
    <section className="py-24 px-6 md:px-10" style={{ background: '#f5f5f5' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>
        {heading && (
          <h2
            className="mb-12"
            style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 400, color: '#171717', letterSpacing: '-0.5px' }}
          >
            {heading}
          </h2>
        )}

        {officeItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {officeItems.map((office, i) => (
              <div key={i} className="flex flex-col gap-3 p-6 rounded-xl" style={{ background: '#ffffff', border: '1px solid #e5e5e5' }}>
                {office.officeName && (
                  <h3 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem', fontWeight: 400, color: '#171717' }}>
                    {office.officeName}
                  </h3>
                )}
                {office.officeAddress && (
                  <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#525252', lineHeight: '1.6' }}>
                    {office.officeAddress}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

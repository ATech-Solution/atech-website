// Contact Locations — Figma node 1:30273
// White background, heading + grid of office location cards

// ─── Types ────────────────────────────────────────────────────────────────────
interface OfficeLocation {
  name:    string
  address: string
}

interface ContactLocationsData {
  heading: string
  offices: OfficeLocation[]
}

// ─── ContactLocationsBlock ────────────────────────────────────────────────────
export default function ContactLocationsBlock({ data }: { data: ContactLocationsData }) {
  const { heading, offices } = data

  return (
    <section className="py-24 px-6 md:px-10" style={{ background: '#f5f5f5' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>
        <h2
          className="mb-12"
          style={{
            fontFamily:    'var(--font-work-sans, sans-serif)',
            fontSize:      'clamp(1.75rem, 3vw, 2.25rem)',
            fontWeight:    400,
            color:         '#171717',
            letterSpacing: '-0.5px',
          }}
        >
          {heading}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offices.map((office) => (
            <div key={office.name} className="flex flex-col gap-3 p-6 rounded-xl" style={{ background: '#ffffff', border: '1px solid #e5e5e5' }}>
              <h3 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem', fontWeight: 400, color: '#171717' }}>
                {office.name}
              </h3>
              <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#525252', lineHeight: '1.6' }}>
                {office.address}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

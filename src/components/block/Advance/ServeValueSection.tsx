// Serve Value Section — Layout Builder (Advance)
// Yellow bg (#ffd369), centered heading + body, 4-col icon/title/desc grid

export interface ServeValueItem {
  valueIconSrc?: string
  valueTitle?:   string
  valueDesc?:    string
}

export interface ServeValueSectionData {
  heading?:         string
  subheading?:      string
  serveValueItems?: ServeValueItem[]
}

export default function ServeValueSection({ data }: { data: ServeValueSectionData }) {
  const items = data.serveValueItems ?? []

  return (
    <section style={{ background: '#ffd369', position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '80px 24px',
        }}
      >
        <div style={{ maxWidth: '1280px', width: '100%', display: 'flex', flexDirection: 'column', gap: '64px', alignItems: 'center' }}>

          {/* Header */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', maxWidth: '768px', textAlign: 'center' }}>
            {data.heading && (
              <h2
                style={{
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize: '36px',
                  fontWeight: 400,
                  color: '#171717',
                  lineHeight: '40px',
                  letterSpacing: '-0.5px',
                  margin: 0,
                }}
              >
                {data.heading}
              </h2>
            )}
            {data.subheading && (
              <p
                style={{
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize: '16px',
                  color: '#525252',
                  lineHeight: '24px',
                  margin: 0,
                }}
              >
                {data.subheading}
              </p>
            )}
          </div>

          {/* 4-col grid */}
          {items.length > 0 && (
            <div
              className="grid grid-cols-2 lg:grid-cols-4"
              style={{ gap: '32px', width: '100%' }}
            >
              {items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  {/* Icon box */}
                  <div
                    style={{
                      background: '#f5f5f5',
                      border: '1px solid #e5e5e5',
                      borderRadius: '16px',
                      width: '64px',
                      height: '64px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {item.valueIconSrc && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.valueIconSrc}
                        alt=""
                        style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                      />
                    )}
                  </div>

                  {/* Title */}
                  {item.valueTitle && (
                    <h3
                      style={{
                        fontFamily: 'var(--font-work-sans, sans-serif)',
                        fontSize: '18px',
                        fontWeight: 400,
                        color: '#171717',
                        lineHeight: '28px',
                        margin: 0,
                        textAlign: 'center',
                      }}
                    >
                      {item.valueTitle}
                    </h3>
                  )}

                  {/* Description */}
                  {item.valueDesc && (
                    <p
                      style={{
                        fontFamily: 'var(--font-work-sans, sans-serif)',
                        fontSize: '14px',
                        color: '#525252',
                        lineHeight: '20px',
                        margin: 0,
                        textAlign: 'center',
                      }}
                    >
                      {item.valueDesc}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  )
}

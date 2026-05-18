// Serve Model Section — Layout Builder (Advance)
// Light gray bg (#fafafa), centered heading + subheading, 3-col engagement model cards
// Featured card: thick dark border + "Most Popular" pill badge

export interface ServeModelItem {
  modelTitle?:      string
  modelIconSrc?:    string
  modelDesc?:       string
  modelFeatures?:   string   // newline-separated list of feature strings
  modelFeatured?:   boolean  // thick border + pill badge
  modelBadgeLabel?: string   // defaults to "Most Popular"
}

export interface ServeModelSectionData {
  heading?:         string
  subheading?:      string
  serveModelItems?: ServeModelItem[]
}

export default function ServeModelSection({ data }: { data: ServeModelSectionData }) {
  const items = data.serveModelItems ?? []

  return (
    <section style={{ background: '#fafafa', position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '80px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '64px',
            alignItems: 'center',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              alignItems: 'center',
              maxWidth: '768px',
              textAlign: 'center',
            }}
          >
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

          {/* Card grid */}
          {items.length > 0 && (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              style={{ gap: '32px', width: '100%', alignItems: 'start' }}
            >
              {items.map((item, idx) => {
                const features = (item.modelFeatures ?? '')
                  .split('\n')
                  .map((f) => f.trim())
                  .filter(Boolean)
                const isFeatured   = item.modelFeatured ?? false
                const badgeLabel   = item.modelBadgeLabel || 'Most Popular'

                return (
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      background: '#ffffff',
                      border: isFeatured ? '2px solid #171717' : '1px solid #e5e5e5',
                      borderRadius: '16px',
                      padding: isFeatured ? '34px' : '33px 33px 35px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '24px',
                    }}
                  >
                    {/* "Most Popular" pill */}
                    {isFeatured && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '-12px',
                          left: '32px',
                          background: '#171717',
                          borderRadius: '9999px',
                          padding: '4px 12px',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--font-work-sans, sans-serif)',
                            fontSize: '12px',
                            fontWeight: 400,
                            color: '#ffffff',
                            lineHeight: '16px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {badgeLabel}
                        </span>
                      </div>
                    )}

                    {/* Title row: name + icon */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      {item.modelTitle && (
                        <h3
                          style={{
                            fontFamily: 'var(--font-work-sans, sans-serif)',
                            fontSize: '20px',
                            fontWeight: 400,
                            color: '#171717',
                            lineHeight: '28px',
                            margin: 0,
                          }}
                        >
                          {item.modelTitle}
                        </h3>
                      )}
                      {item.modelIconSrc && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.modelIconSrc}
                          alt=""
                          style={{ width: '28px', height: '24px', objectFit: 'contain', flexShrink: 0 }}
                        />
                      )}
                    </div>

                    {/* Description */}
                    {item.modelDesc && (
                      <p
                        style={{
                          fontFamily: 'var(--font-work-sans, sans-serif)',
                          fontSize: '14px',
                          color: '#525252',
                          lineHeight: '20px',
                          margin: 0,
                        }}
                      >
                        {item.modelDesc}
                      </p>
                    )}

                    {/* Feature list */}
                    {features.length > 0 && (
                      <ul
                        style={{
                          listStyle: 'none',
                          margin: 0,
                          padding: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                        }}
                      >
                        {features.map((feat, fi) => (
                          <li
                            key={fi}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '8px',
                            }}
                          >
                            <span
                              style={{
                                color: '#171717',
                                fontSize: '12px',
                                lineHeight: '20px',
                                flexShrink: 0,
                                marginTop: '2px',
                              }}
                            >
                              ✓
                            </span>
                            <span
                              style={{
                                fontFamily: 'var(--font-work-sans, sans-serif)',
                                fontSize: '14px',
                                color: '#525252',
                                lineHeight: '20px',
                              }}
                            >
                              {feat}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

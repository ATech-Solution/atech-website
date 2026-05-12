import Link from 'next/link'

interface TagItem { tagLabel?: string }

interface PortfolioDetailTopData {
  backLabel?:      string
  backUrl?:        string
  tags?:           TagItem[]
  pdTitle?:        string
  pdDescription?:  string
  pdClient?:       string
  pdDuration?:     string
  pdYear?:         string
  pdTeamSize?:     string
}

interface PortfolioDetailTopProps {
  data:           PortfolioDetailTopData
  portfolioItem?: any
}

export default function PortfolioDetailTopSection({ data, portfolioItem }: PortfolioDetailTopProps) {
  const p = portfolioItem

  // Portfolio item takes priority; block CMS data is the fallback
  const backLabel     = data.backLabel    ?? 'Back to Portfolio'
  const backUrl       = data.backUrl      ?? '/portfolio'
  const title         = p?.title          ?? data.pdTitle        ?? ''
  const description   = p?.excerpt        ?? data.pdDescription  ?? ''
  const client        = p?.client         ?? data.pdClient       ?? ''
  const duration      = p?.duration       ?? data.pdDuration     ?? ''
  const year          = p?.year           ?? data.pdYear         ?? ''
  const teamSize      = p?.teamSize       ?? data.pdTeamSize     ?? ''

  // Build tags from portfolio categories, fall back to block CMS tags
  const tags: string[] = p?.categories?.length
    ? p.categories.map((c: any) => c?.title ?? c?.name ?? '').filter(Boolean)
    : (data.tags ?? []).map((t: TagItem) => t.tagLabel ?? '').filter(Boolean)

  const meta = [
    { label: 'Client',    value: client    },
    { label: 'Duration',  value: duration  },
    { label: 'Year',      value: year      },
    { label: 'Team Size', value: teamSize  },
  ].filter((m) => m.value)

  return (
    <div
      style={{
        background:    '#ffffff',
        borderBottom:  '1px solid #e5e5e5',
        display:       'flex',
        justifyContent: 'center',
        paddingTop:    '80px',
        paddingBottom: '81px',
      }}
    >
      <div style={{ maxWidth: '1280px', width: '100%', paddingLeft: '24px', paddingRight: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1024px' }}>

          {/* Back link */}
          <Link
            href={backUrl}
            style={{
              display:     'flex',
              alignItems:  'center',
              gap:         '8px',
              color:       '#525252',
              textDecoration: 'none',
              fontFamily:  'var(--font-work-sans, sans-serif)',
              fontSize:    '14px',
              lineHeight:  '20px',
            }}
          >
            <span style={{ fontSize: '14px' }}>←</span>
            <span>{backLabel}</span>
          </Link>

          {/* Category tags */}
          {tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              {tags.map((tag, i) => (
                <span
                  key={i}
                  style={{
                    background:  '#f5f5f5',
                    border:      '1px solid #e5e5e5',
                    padding:     '9px 17px',
                    fontSize:    '12px',
                    lineHeight:  '16px',
                    color:       '#171717',
                    fontFamily:  'var(--font-work-sans, sans-serif)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          {title && (
            <h1
              style={{
                fontFamily:    'var(--font-work-sans, sans-serif)',
                fontSize:      '60px',
                fontWeight:    400,
                color:         '#171717',
                letterSpacing: '-1.5px',
                lineHeight:    '60px',
                margin:        0,
              }}
            >
              {title}
            </h1>
          )}

          {/* Description */}
          {description && (
            <div style={{ maxWidth: '768px' }}>
              <p
                style={{
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize:   '20px',
                  fontWeight: 400,
                  color:      '#525252',
                  lineHeight: '32.5px',
                  margin:     0,
                }}
              >
                {description}
              </p>
            </div>
          )}

          {/* Metadata row */}
          {meta.length > 0 && (
            <div style={{ display: 'flex', gap: '32px', alignItems: 'center', paddingTop: '8px' }}>
              {meta.map((m) => (
                <div key={m.label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-work-sans, sans-serif)',
                      fontSize:   '12px',
                      color:      '#737373',
                      lineHeight: '16px',
                    }}
                  >
                    {m.label}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-work-sans, sans-serif)',
                      fontSize:   '16px',
                      color:      '#171717',
                      lineHeight: '24px',
                    }}
                  >
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

import Link from 'next/link'

interface BreadcrumbItem { breadcrumbLabel?: string; breadcrumbUrl?: string }

interface ArticleDetailHeroData {
  badge?:           string
  breadcrumbItems?: BreadcrumbItem[]
}

interface ArticleDetailHeroProps {
  data:         ArticleDetailHeroData
  articleItem?: any
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  } catch {
    return dateStr
  }
}

export default function ArticleDetailHeroSection({ data, articleItem }: ArticleDetailHeroProps) {
  const a = articleItem
  const badge       = data.badge ?? 'Featured Article'
  const title       = a?.title       ?? ''
  const excerpt     = a?.excerpt     ?? ''
  const publishedAt = a?.publishedAt ?? ''

  const breadcrumbs: BreadcrumbItem[] = data.breadcrumbItems?.length
    ? data.breadcrumbItems
    : [
        { breadcrumbLabel: 'Insights',     breadcrumbUrl: '/insights' },
        { breadcrumbLabel: 'Our Articles', breadcrumbUrl: '/insights/articles' },
      ]

  const tags: string[] = a?.categories?.length
    ? a.categories.map((c: any) => c?.title ?? c?.name ?? '').filter(Boolean)
    : []

  return (
    <div style={{ background: '#ffffff' }}>
      {/* Breadcrumb bar */}
      <div
        style={{
          background:    '#fafafa',
          borderBottom:  '1px solid #e5e5e5',
          paddingTop:    '32px',
          paddingBottom: '32px',
          paddingLeft:   '104px',
          paddingRight:  '104px',
        }}
      >
        <div
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        '8px',
            fontFamily: 'var(--font-work-sans, sans-serif)',
            fontSize:   '14px',
            color:      '#525252',
          }}
        >
          {breadcrumbs.map((bc, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {bc.breadcrumbUrl ? (
                <Link href={bc.breadcrumbUrl} style={{ color: '#525252', textDecoration: 'none' }}>
                  {bc.breadcrumbLabel}
                </Link>
              ) : (
                <span>{bc.breadcrumbLabel}</span>
              )}
              <span style={{ color: '#d4d4d4' }}>›</span>
            </span>
          ))}
          {title && (
            <span
              style={{
                overflow:     'hidden',
                textOverflow: 'ellipsis',
                whiteSpace:   'nowrap',
                maxWidth:     '300px',
                color:        '#171717',
              }}
            >
              {title}
            </span>
          )}
        </div>
      </div>

      {/* Hero content */}
      <div
        style={{
          paddingTop:    '96px',
          paddingBottom: '96px',
          paddingLeft:   '104px',
          paddingRight:  '104px',
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          textAlign:     'center',
        }}
      >
        <div
          style={{
            display:       'flex',
            flexDirection: 'column',
            alignItems:    'center',
            gap:           '24px',
            maxWidth:      '768px',
            width:         '100%',
          }}
        >
          {/* Badge */}
          {badge && (
            <span
              style={{
                background:    '#f5f5f5',
                border:        '1px solid #e5e5e5',
                borderRadius:  '9999px',
                padding:       '9px 17px',
                fontSize:      '12px',
                letterSpacing: '0.6px',
                textTransform: 'uppercase',
                color:         '#525252',
                fontFamily:    'var(--font-work-sans, sans-serif)',
              }}
            >
              {badge}
            </span>
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

          {/* Published date */}
          {publishedAt && (
            <div
              style={{
                display:    'flex',
                alignItems: 'center',
                gap:        '16px',
                fontFamily: 'var(--font-work-sans, sans-serif)',
                fontSize:   '14px',
                color:      '#525252',
              }}
            >
              <span>{formatDate(publishedAt)}</span>
            </div>
          )}

          {/* Excerpt */}
          {excerpt && (
            <p
              style={{
                fontFamily: 'var(--font-work-sans, sans-serif)',
                fontSize:   '20px',
                fontWeight: 400,
                color:      '#525252',
                lineHeight: '32.5px',
                margin:     0,
                textAlign:  'center',
              }}
            >
              {excerpt}
            </p>
          )}

          {/* Category pills */}
          {tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
              {tags.map((tag, i) => (
                <span
                  key={i}
                  style={{
                    background:   '#f5f5f5',
                    border:       '1px solid #e5e5e5',
                    borderRadius: '9999px',
                    padding:      '9px 17px',
                    fontSize:     '12px',
                    color:        '#171717',
                    fontFamily:   'var(--font-work-sans, sans-serif)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

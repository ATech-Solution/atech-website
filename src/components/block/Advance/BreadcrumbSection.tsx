import Link from 'next/link'

interface BreadcrumbItem {
  bcLabel?: string
  bcHref?: string | null
}

interface BreadcrumbData {
  breadcrumbs?: BreadcrumbItem[]
}

const ChevronRight = () => (
  <svg width="7.5" height="12" viewBox="0 0 7.5 12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M1 1l5.5 5L1 11" stroke="#525252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function BreadcrumbSection({ data }: { data: BreadcrumbData }) {
  const { breadcrumbs = [] } = data

  if (breadcrumbs.length === 0) return null

  const itemStyle: React.CSSProperties = {
    fontFamily: 'var(--font-work-sans, sans-serif)',
    fontSize: '14px',
    fontWeight: 400,
    color: '#525252',
    lineHeight: '20px',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  }

  return (
    <section
      style={{
        background: 'var(--section-bg, #fafafa)',
        borderBottom: '1px solid #e5e5e5',
        paddingTop: '32px',
        paddingBottom: '33px',
        paddingLeft: 'clamp(24px, 7.2vw, 104px)',
        paddingRight: 'clamp(24px, 7.2vw, 104px)',
      }}
    >
      <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {breadcrumbs.map((crumb, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {i > 0 && <ChevronRight />}
            {crumb.bcHref ? (
              <Link href={crumb.bcHref} style={itemStyle}>
                {crumb.bcLabel}
              </Link>
            ) : (
              <span style={itemStyle}>{crumb.bcLabel}</span>
            )}
          </span>
        ))}
      </nav>
    </section>
  )
}

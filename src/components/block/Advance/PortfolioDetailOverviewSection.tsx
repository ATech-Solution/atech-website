interface MetricItem { pdMetricValue?: string; pdMetricLabel?: string }

interface PortfolioDetailOverviewData {
  pdSectionTitle?: string
  pdContent?:      string
  pdMetricsTitle?: string
  pdMetrics?:      MetricItem[]
}

interface PortfolioDetailOverviewProps {
  data:           PortfolioDetailOverviewData
  portfolioItem?: any
}

/** Extract plain text paragraphs from Payload Lexical rich text JSON */
function extractLexicalParagraphs(lexical: any): string[] {
  if (!lexical?.root) return []

  function textFromNode(node: any): string {
    if (node.type === 'text') return node.text ?? ''
    if (Array.isArray(node.children)) return node.children.map(textFromNode).join('')
    return ''
  }

  const root = lexical.root
  const children: any[] = Array.isArray(root.children) ? root.children : []

  return children
    .filter((n: any) => n.type === 'paragraph')
    .map((n: any) => textFromNode(n).trim())
    .filter(Boolean)
}

export default function PortfolioDetailOverviewSection({ data, portfolioItem }: PortfolioDetailOverviewProps) {
  const sectionTitle = data.pdSectionTitle ?? 'Project Overview'
  const metricsTitle = data.pdMetricsTitle ?? 'Key Metrics'

  // Paragraphs: from portfolio Lexical content, or block CMS textarea (split on blank lines)
  const paragraphs: string[] = portfolioItem?.content
    ? extractLexicalParagraphs(portfolioItem.content)
    : (data.pdContent ?? '').split(/\n\n+/).map((p: string) => p.trim()).filter(Boolean)

  // Metrics: from portfolio keyMetrics, or block CMS pdMetrics array
  // Only include items that have at least a value or a label
  const metrics: MetricItem[] = (
    portfolioItem?.keyMetrics?.length
      ? portfolioItem.keyMetrics.map((m: any) => ({
          pdMetricValue: m.metricValue ?? '',
          pdMetricLabel: m.metricLabel ?? '',
        }))
      : (data.pdMetrics ?? [])
  ).filter((m: MetricItem) => m.pdMetricValue || m.pdMetricLabel)

  const hasMetrics = metrics.length > 0

  return (
    <div
      style={{
        background:    '#ffffff',
        paddingLeft:   '104px',
        paddingRight:  '104px',
        paddingTop:    '80px',
        paddingBottom: '80px',
      }}
    >
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: hasMetrics ? 'repeat(12, minmax(0, 1fr))' : '1fr',
          gap:                 '48px',
        }}
      >
        {/* Left — 8/12 when metrics present, full-width otherwise */}
        <div style={{ gridColumn: hasMetrics ? '1 / span 8' : '1 / -1', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize:   '30px',
              fontWeight: 400,
              color:      '#171717',
              lineHeight: '36px',
              margin:     0,
            }}
          >
            {sectionTitle}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {paragraphs.map((para, i) => (
              <p
                key={i}
                style={{
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize:   '16px',
                  fontWeight: 400,
                  color:      '#525252',
                  lineHeight: '26px',
                  margin:     0,
                }}
              >
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* Right — 4/12 Key Metrics (hidden when no metrics) */}
        {hasMetrics && (
          <div
            style={{
              gridColumn:    '9 / span 4',
              background:    '#fafafa',
              border:        '1px solid #e5e5e5',
              padding:       '33px',
              display:       'flex',
              flexDirection: 'column',
              gap:           '24px',
              alignSelf:     'start',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-work-sans, sans-serif)',
                fontSize:   '20px',
                fontWeight: 400,
                color:      '#171717',
                lineHeight: '28px',
                margin:     0,
              }}
            >
              {metricsTitle}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {metrics.map((m, i) => (
                <div
                  key={i}
                  style={{
                    borderTop:     i === 0 ? 'none' : '1px solid #e5e5e5',
                    paddingTop:    i === 0 ? '0' : '25px',
                    display:       'flex',
                    flexDirection: 'column',
                    gap:           '4px',
                  }}
                >
                  {m.pdMetricValue && (
                    <span
                      style={{
                        fontFamily: 'var(--font-work-sans, sans-serif)',
                        fontSize:   '30px',
                        fontWeight: 400,
                        color:      '#171717',
                        lineHeight: '36px',
                      }}
                    >
                      {m.pdMetricValue}
                    </span>
                  )}
                  {m.pdMetricLabel && (
                    <span
                      style={{
                        fontFamily: 'var(--font-work-sans, sans-serif)',
                        fontSize:   '14px',
                        fontWeight: 400,
                        color:      '#525252',
                        lineHeight: '20px',
                      }}
                    >
                      {m.pdMetricLabel}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

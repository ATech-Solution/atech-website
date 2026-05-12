interface Stat {
  statValue: string
  statLabel: string
}

interface PortfolioStatisticsData {
  portfolioStats?: Stat[]
}

export default function PortfolioStatisticsSection({ data }: { data: PortfolioStatisticsData }) {
  const stats: Stat[] = data.portfolioStats?.length
    ? data.portfolioStats
    : [
        { statValue: '150+', statLabel: 'Projects Completed' },
        { statValue: '98%',  statLabel: 'Client Satisfaction' },
        { statValue: '12+',  statLabel: 'Industries Served'   },
        { statValue: '50+',  statLabel: 'Team Members'        },
      ]

  return (
    <section
      style={{
        background:   '#f5f5f5',
        borderTop:    '1px solid #e5e5e5',
        borderBottom: '1px solid #e5e5e5',
        padding:      '49px 104px',
        width:        '100%',
      }}
    >
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))`,
          gap:                 '32px',
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}
          >
            <span
              style={{
                fontFamily:  'var(--font-work-sans, sans-serif)',
                fontSize:    '36px',
                fontWeight:  400,
                color:       '#171717',
                lineHeight:  '40px',
                textAlign:   'center',
              }}
            >
              {stat.statValue}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-work-sans, sans-serif)',
                fontSize:   '14px',
                fontWeight: 400,
                color:      '#525252',
                lineHeight: '20px',
                textAlign:  'center',
              }}
            >
              {stat.statLabel}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

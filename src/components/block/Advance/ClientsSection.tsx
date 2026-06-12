'use client'

import { useState } from 'react'

interface ClientItem {
  clientName?: string
  clientLogo?: { url: string; alt?: string } | null
  clientUrl?:  string
}

interface ClientsData {
  clientsHeading?:   string
  clientItems?:      ClientItem[]
  clientsPageSize?:  number
  clientsGrayscale?: boolean
}

export default function ClientsSection({ data }: { data: ClientsData }) {
  const {
    clientsHeading:  heading        = 'Trusted by',
    clientItems                     = [],
    clientsPageSize                 = 6,
    clientsGrayscale: grayscale     = true,
  } = data

  const pageSize   = Math.max(1, Number(clientsPageSize) || 6)
  const totalPages = Math.max(1, Math.ceil(clientItems.length / pageSize))
  const [page, setPage] = useState(0)

  const visibleItems = clientItems.slice(page * pageSize, page * pageSize + pageSize)

  return (
    <section className="clients-section" style={sectionStyle}>
      {/* Heading */}
      <div style={headingWrapStyle}>
        <h2 style={headingStyle}>{heading}</h2>
      </div>

      {/* Logo row */}
      <div style={logoRowStyle}>
        {/* Prev arrow */}
        {totalPages > 1 && (
          <button
            aria-label="Previous"
            disabled={page === 0}
            onClick={() => setPage(p => Math.max(0, p - 1))}
            style={{ ...arrowStyle, opacity: page === 0 ? 0.3 : 1, cursor: page === 0 ? 'default' : 'pointer' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M13 4L7 10l6 6" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* Logos */}
        <div style={logosInnerStyle}>
          {visibleItems.length === 0 ? (
            <p style={{ color: '#9ca3af', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '14px' }}>
              No client logos added yet.
            </p>
          ) : (
            visibleItems.map((item, i) => {
              const logoEl = item.clientLogo?.url ? (
                <img
                  src={item.clientLogo.url}
                  alt={item.clientLogo.alt || item.clientName || `Client ${i + 1}`}
                  style={{
                    maxHeight:  '48px',
                    maxWidth:   '140px',
                    objectFit:  'contain',
                    display:    'block',
                    filter:     grayscale ? 'grayscale(1)' : 'none',
                    opacity:    grayscale ? 0.7 : 1,
                    transition: 'opacity 0.2s, filter 0.2s',
                  }}
                />
              ) : (
                <div style={placeholderStyle}>
                  <span style={{ color: '#9ca3af', fontSize: '11px' }}>{item.clientName || `Logo ${i + 1}`}</span>
                </div>
              )

              return (
                <div key={item.clientUrl ?? item.clientName ?? i} style={logoItemStyle}>
                  {item.clientUrl ? (
                    <a href={item.clientUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', lineHeight: 0 }}>
                      {logoEl}
                    </a>
                  ) : logoEl}
                </div>
              )
            })
          )}
        </div>

        {/* Next arrow */}
        {totalPages > 1 && (
          <button
            aria-label="Next"
            disabled={page === totalPages - 1}
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            style={{ ...arrowStyle, opacity: page === totalPages - 1 ? 0.3 : 1, cursor: page === totalPages - 1 ? 'default' : 'pointer' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M7 4l6 6-6 6" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Dot indicators */}
      {totalPages > 1 && (
        <div style={dotsStyle}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              aria-label={`Page ${i + 1}`}
              onClick={() => setPage(i)}
              style={{
                ...dotStyle,
                background: i === page ? '#111827' : '#d1d5db',
                transform:  i === page ? 'scale(1.25)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .clients-section { padding: 40px 24px !important; }
        }
      `}</style>
    </section>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const sectionStyle: React.CSSProperties = {
  background:     '#ffffff',
  padding:        '64px 96px',
  display:        'flex',
  flexDirection:  'column',
  gap:            '48px',
  alignItems:     'center',
  width:          '100%',
  boxSizing:      'border-box',
}

const headingWrapStyle: React.CSSProperties = {
  display:        'flex',
  flexDirection:  'column',
  alignItems:     'center',
  width:          '100%',
}

const headingStyle: React.CSSProperties = {
  fontFamily:  'var(--font-work-sans, sans-serif)',
  fontWeight:  500,
  fontSize:    '24px',
  lineHeight:  '32px',
  color:       '#111827',
  textAlign:   'center',
  margin:      0,
}

const logoRowStyle: React.CSSProperties = {
  display:        'flex',
  alignItems:     'center',
  gap:            '16px',
  width:          '100%',
  justifyContent: 'center',
}

const logosInnerStyle: React.CSSProperties = {
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  gap:            '80px',
  flex:           '1 0 0',
  minHeight:      '89px',
  flexWrap:       'wrap',
}

const logoItemStyle: React.CSSProperties = {
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  flexShrink:     0,
}

const placeholderStyle: React.CSSProperties = {
  width:          '120px',
  height:         '48px',
  background:     '#f3f4f6',
  borderRadius:   '6px',
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
}

const arrowStyle: React.CSSProperties = {
  width:          '36px',
  height:         '36px',
  borderRadius:   '50%',
  border:         '1px solid #e5e7eb',
  background:     '#ffffff',
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  cursor:         'pointer',
  flexShrink:     0,
  transition:     'opacity 0.2s',
  padding:        0,
}

const dotsStyle: React.CSSProperties = {
  display:    'flex',
  gap:        '8px',
  alignItems: 'center',
}

const dotStyle: React.CSSProperties = {
  width:        '8px',
  height:       '8px',
  borderRadius: '50%',
  border:       'none',
  cursor:       'pointer',
  padding:      0,
  transition:   'background 0.2s, transform 0.2s',
}

import DynamicFormSection from './DynamicFormSection'

interface SurveySectionData {
  title?:          string
  subtitle?:       string
  /** Form ID from the forms collection. Falls back to the default survey (ID 3). */
  surveyFormRef?:  string | { id: string }
  /** Legacy alias — layout-builder may pass formRef too */
  formRef?:        string | { id: string }
}

export default function SurveySection({ data = {} }: { data?: SurveySectionData }) {
  const heading  = data.title    || 'How are we doing?'
  const subline  = data.subtitle || 'Rate your experience with ATech. Your feedback shapes everything we build — and takes less than 3 minutes.'

  const rawRef   = data.surveyFormRef ?? data.formRef
  const formId   = typeof rawRef === 'object' ? rawRef?.id : (rawRef ?? '3')

  return (
    <div style={{ position: 'relative', background: '#0e0e0e', overflow: 'hidden' }}>

      {/* Atmospheric glow */}
      <div style={{
        position:      'absolute',
        top:           '-120px',
        left:          '50%',
        transform:     'translateX(-50%)',
        width:         '900px',
        height:        '500px',
        borderRadius:  '50%',
        background:    'radial-gradient(ellipse at center, rgba(255,211,105,0.07) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* ── Section header ── */}
      <div style={{
        position:    'relative',
        zIndex:       1,
        paddingTop:   '88px',
        paddingBottom:'52px',
        paddingLeft:  '24px',
        paddingRight: '24px',
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>

          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
            <span style={{
              display:         'inline-block',
              width:           '6px',
              height:          '6px',
              borderRadius:    '50%',
              background:      '#ffd369',
              boxShadow:       '0 0 8px rgba(255,211,105,0.6)',
              flexShrink:      0,
            }} />
            <span style={{
              fontFamily:      'var(--font-work-sans, sans-serif)',
              fontSize:        '11px',
              fontWeight:       600,
              letterSpacing:   '0.1em',
              textTransform:   'uppercase',
              color:           '#ffd369',
            }}>
              Satisfaction Survey
            </span>
          </div>

          {/* Main heading */}
          <h2 style={{
            fontFamily:    'var(--font-work-sans, sans-serif)',
            fontSize:      'clamp(2.25rem, 5vw, 3.5rem)',
            fontWeight:     700,
            color:         '#ffffff',
            letterSpacing: '-0.03em',
            lineHeight:     1.1,
            marginBottom:  '20px',
          }}>
            {(() => {
              const words = heading.split(' ')
              const last  = words.pop()
              return (
                <>
                  {words.join(' ')}{words.length > 0 ? ' ' : ''}
                  <span style={{ color: '#ffd369' }}>{last}</span>
                </>
              )
            })()}
          </h2>

          {/* Description */}
          <p style={{
            fontFamily:  'var(--font-work-sans, sans-serif)',
            fontSize:    '1.0625rem',
            color:       '#777',
            lineHeight:   1.75,
            maxWidth:    '500px',
            margin:      '0 auto 44px',
          }}>
            {subline}
          </p>

          {/* Diamond divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,211,105,0.22))' }} />
            <div style={{
              width:       '7px',
              height:      '7px',
              background:  '#ffd369',
              transform:   'rotate(45deg)',
              flexShrink:   0,
              opacity:      0.8,
            }} />
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(255,211,105,0.22))' }} />
          </div>
        </div>
      </div>

      {/* ── Form ── */}
      <div
        style={{
          position:  'relative',
          zIndex:     1,
          '--color-text':   '#fafafa',
          '--color-accent': '#ffd369',
          '--color-muted':  '#666',
        } as React.CSSProperties}
      >
        <DynamicFormSection data={{ formRef: formId }} />
      </div>

      {/* Bottom fade */}
      <div style={{
        height:     '48px',
        background: '#0e0e0e',
        position:   'relative',
        zIndex:      1,
      }} />
    </div>
  )
}

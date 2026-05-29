'use client'

// Quote Form Section — Figma node 230:28376
// Fields: First/Last Name, Email/Phone, Company, Service Type, Service Sub-type (dependent),
// Development Time, calculated Items / Cost / Maintenance display, Project Details.
// Submits to /api/quote which persists to quote-requests collection and sends email.

import { useEffect, useId, useRef, useState, useMemo } from 'react'

// ── Pricing data ──────────────────────────────────────────────────────────────

const SERVICE_SUBTYPES: Record<string, string[]> = {
  'Web Development':    ['Landing Page', 'Corporate Website', 'E-commerce', 'Web Application'],
  'Mobile Development': ['iOS App', 'Android App', 'Cross-Platform App'],
  'IT Consulting':      ['System Audit', 'Architecture Design', 'Technology Advisory'],
  'HR Recruitment':     ['Entry Level (1–3 positions)', 'Mid Level (3–10 positions)', 'Senior Level (1–5 positions)'],
  'Cloud Solutions':    ['Cloud Migration', 'DevOps Setup', 'Cloud Architecture'],
}

const BASE_PRICES: Record<string, number> = {
  'Landing Page':                    15000,
  'Corporate Website':               28000,
  'E-commerce':                      50000,
  'Web Application':                 90000,
  'iOS App':                         65000,
  'Android App':                     65000,
  'Cross-Platform App':             110000,
  'System Audit':                    12000,
  'Architecture Design':             20000,
  'Technology Advisory':              9500,
  'Entry Level (1–3 positions)':      8000,
  'Mid Level (3–10 positions)':      22000,
  'Senior Level (1–5 positions)':    32000,
  'Cloud Migration':                 38000,
  'DevOps Setup':                    30000,
  'Cloud Architecture':              24000,
}

const ITEMS_COUNT: Record<string, number> = {
  'Landing Page':                    5,
  'Corporate Website':               8,
  'E-commerce':                     12,
  'Web Application':                15,
  'iOS App':                        10,
  'Android App':                    10,
  'Cross-Platform App':             14,
  'System Audit':                    6,
  'Architecture Design':             8,
  'Technology Advisory':             4,
  'Entry Level (1–3 positions)':     3,
  'Mid Level (3–10 positions)':      8,
  'Senior Level (1–5 positions)':    5,
  'Cloud Migration':                10,
  'DevOps Setup':                    8,
  'Cloud Architecture':              7,
}

const TIMELINE_MULTIPLIER: Record<string, number> = {
  '1–3 months':  1.0,
  '3–6 months':  1.3,
  '6–12 months': 1.6,
  '12+ months':  2.0,
}

const MAINTENANCE_RATE = 0.08 // 8% of base per month

function calcQuote(subtype: string, timeline: string) {
  const base = BASE_PRICES[subtype] ?? 0
  const mult = TIMELINE_MULTIPLIER[timeline] ?? 1
  return {
    items:       ITEMS_COUNT[subtype] ?? 0,
    cost:        Math.round(base * mult),
    maintenance: Math.round(base * MAINTENANCE_RATE),
  }
}

function fmtHKD(n: number): string {
  if (!n) return 'HKD 0'
  return `HKD ${n.toLocaleString('en-HK')}`
}

// ── Styles ────────────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  border:     '2px solid #e5e5e5',
  background: '#ffffff',
  fontFamily: 'var(--font-work-sans, sans-serif)',
  color:      '#171717',
  width:      '100%',
  padding:    '20px 26px',
  fontSize:   '16px',
  outline:    'none',
  transition: 'border-color 0.2s',
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  background:  '#efefef',
  color:       '#525252',
  appearance:  'none' as const,
  cursor:      'pointer',
}

const calcBoxStyle: React.CSSProperties = {
  background: '#efefef',
  border:     '2px solid #e5e5e5',
  padding:    '18px 30px',
  fontFamily: 'var(--font-work-sans, sans-serif)',
  fontSize:   '16px',
  color:      '#525252',
  flex:       1,
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface QuoteFormData {
  heading?:     string
  subheading?:  string
  submitLabel?: string
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

declare global {
  interface Window {
    grecaptcha?: {
      render:      (container: string | HTMLElement, params: Record<string, string>) => number
      getResponse: (widgetId?: number) => string
      reset:       (widgetId?: number) => void
      ready:       (cb: () => void) => void
    }
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function QuoteFormSection({ data }: { data: QuoteFormData }) {
  const { heading = 'Get a Custom Quote', subheading, submitLabel = 'Request Your Quote' } = data

  const siteKey    = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ''
  const captchaId  = useId().replace(/:/g, '')
  const captchaRef = useRef<HTMLDivElement>(null)
  const widgetRef  = useRef<number | null>(null)

  const [status,   setStatus]   = useState<FormStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [fields,   setFields]   = useState({
    firstName:       '',
    lastName:        '',
    email:           '',
    phone:           '',
    company:         '',
    serviceType:     '',
    serviceSelected: '',
    developmentTime: '',
    projectDetails:  '',
  })

  // Dependent subtypes based on service type selection
  const subtypes = useMemo(() => SERVICE_SUBTYPES[fields.serviceType] ?? [], [fields.serviceType])

  // Live calculator
  const estimate = useMemo(
    () => calcQuote(fields.serviceSelected, fields.developmentTime),
    [fields.serviceSelected, fields.developmentTime],
  )

  // Reset service sub-type when service type changes
  const setServiceType = (v: string) =>
    setFields(p => ({ ...p, serviceType: v, serviceSelected: '' }))

  const set = (key: keyof typeof fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setFields(p => ({ ...p, [key]: e.target.value }))

  // reCAPTCHA
  useEffect(() => {
    if (!siteKey) return
    if (document.querySelector('script[src*="recaptcha/api.js"]')) { renderCaptcha(); return }
    const s = document.createElement('script')
    s.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
    s.async = true; s.defer = true; s.onload = renderCaptcha
    document.head.appendChild(s)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey])

  function renderCaptcha() {
    if (!siteKey || !captchaRef.current) return
    window.grecaptcha?.ready(() => {
      if (widgetRef.current !== null) return
      widgetRef.current = window.grecaptcha!.render(captchaRef.current!, { sitekey: siteKey })
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fields.firstName || !fields.email || !fields.projectDetails) return

    const recaptchaToken = siteKey
      ? (window.grecaptcha?.getResponse(widgetRef.current ?? undefined) ?? '')
      : 'dev-bypass'

    if (siteKey && !recaptchaToken) {
      setErrorMsg('Please complete the reCAPTCHA.'); setStatus('error'); return
    }

    setStatus('loading'); setErrorMsg('')
    try {
      const res = await fetch('/api/quote', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          ...fields,
          recaptchaToken,
          itemsCount:     estimate.items,
          calculatedCost: estimate.cost,
          maintenanceFee: estimate.maintenance,
        }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setFields({ firstName: '', lastName: '', email: '', phone: '', company: '',
        serviceType: '', serviceSelected: '', developmentTime: '', projectDetails: '' })
    } catch {
      setErrorMsg('Something went wrong. Please try again or email us directly.')
      setStatus('error')
      window.grecaptcha?.reset(widgetRef.current ?? undefined)
    }
  }

  return (
    <section
      id="quote"
      style={{ background: 'var(--section-bg, #ffffff)', borderTop: '1px solid #e5e5e5', paddingTop: '81px', paddingBottom: '96px', paddingLeft: 'clamp(24px, 10vw, 272px)', paddingRight: 'clamp(24px, 10vw, 272px)' }}
    >
      <div className="mx-auto flex flex-col items-center gap-6" style={{ maxWidth: '896px' }}>

        {/* Heading */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, color: '#171717', lineHeight: '1', margin: 0 }}>
            {heading}
          </h2>
          {subheading && (
            <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.25rem', color: '#525252', lineHeight: '1.625', maxWidth: '560px', margin: 0 }}>
              {subheading}
            </p>
          )}
        </div>

        {/* ── Success state ── */}
        {status === 'success' ? (
          <div className="w-full flex flex-col items-center gap-4 py-16" style={{ maxWidth: '672px' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#171717', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
                <path d="M6 14l6 6 10-12" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.5rem', fontWeight: 400, color: '#171717', textAlign: 'center', margin: 0 }}>
              Quote Request Sent
            </h3>
            <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', color: '#525252', textAlign: 'center', lineHeight: 1.6, margin: 0 }}>
              Thank you! Our team will review your project and get back to you within 1–2 business days.
            </p>
            <button
              onClick={() => setStatus('idle')}
              style={{ marginTop: 8, background: 'transparent', border: '2px solid #e5e5e5', padding: '12px 28px', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '14px', color: '#525252', cursor: 'pointer' }}
            >
              Submit Another Request
            </button>
          </div>
        ) : (

        /* ── Form ── */
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 mt-4" style={{ maxWidth: '672px' }}>

          {/* Row 1: First / Last name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <input type="text" placeholder="First Name *" required value={fields.firstName} onChange={set('firstName')} style={inputStyle} />
            <input type="text" placeholder="Last Name *"  value={fields.lastName}  onChange={set('lastName')}  style={inputStyle} />
          </div>

          {/* Row 2: Email / Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <input type="email" placeholder="Email Address *" required value={fields.email} onChange={set('email')} style={inputStyle} />
            <input type="tel"   placeholder="Phone Number"           value={fields.phone} onChange={set('phone')} style={inputStyle} />
          </div>

          {/* Row 3: Company */}
          <input type="text" placeholder="Company Name" value={fields.company} onChange={set('company')} style={inputStyle} />

          {/* Row 4: Service Type */}
          <div style={{ position: 'relative' }}>
            <select value={fields.serviceType} onChange={(e) => setServiceType(e.target.value)} style={selectStyle} required>
              <option value="">Select Service Type *</option>
              {Object.keys(SERVICE_SUBTYPES).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <span style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#525252' }}>▾</span>
          </div>

          {/* Row 5: Service Sub-type (dependent) */}
          <div style={{ position: 'relative' }}>
            <select
              value={fields.serviceSelected}
              onChange={set('serviceSelected')}
              style={{ ...selectStyle, opacity: subtypes.length ? 1 : 0.5 }}
              disabled={!subtypes.length}
            >
              <option value="">
                {fields.serviceType ? `Select "${fields.serviceType}" Type *` : 'Select "Service Selected" Type *'}
              </option>
              {subtypes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <span style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#525252' }}>▾</span>
          </div>

          {/* Row 6: Development Time */}
          <div style={{ position: 'relative' }}>
            <select value={fields.developmentTime} onChange={set('developmentTime')} style={selectStyle}>
              <option value="">Development Time*</option>
              {Object.keys(TIMELINE_MULTIPLIER).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <span style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#525252' }}>▾</span>
          </div>

          {/* Row 7: Calculation display */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Items label */}
            <span style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '16px', color: '#525252', whiteSpace: 'nowrap', flexShrink: 0 }}>
              Items : {estimate.items || 'xx'}
            </span>

            {/* Cost box */}
            <div style={calcBoxStyle}>
              Cost :{' '}
              <strong style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontWeight: 700 }}>
                {estimate.cost ? fmtHKD(estimate.cost) : 'HKD 00,0'}
              </strong>
            </div>

            {/* Maintenance box */}
            <div style={calcBoxStyle}>
              Maintenance Fee :{' '}
              <strong style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontWeight: 700 }}>
                {estimate.maintenance ? fmtHKD(estimate.maintenance) : 'HKD 00,0'}
              </strong>
            </div>
          </div>

          {/* Row 8: Project Details */}
          <textarea
            placeholder="Project Details *"
            required
            rows={6}
            value={fields.projectDetails}
            onChange={set('projectDetails')}
            style={{ ...inputStyle, resize: 'vertical' }}
          />

          {/* reCAPTCHA */}
          {siteKey && <div ref={captchaRef} id={`recaptcha-${captchaId}`} />}

          {/* Error */}
          {status === 'error' && errorMsg && (
            <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '14px', color: '#dc2626', padding: '12px 16px', border: '1px solid #fecaca', background: '#fef2f2', margin: 0 }}>
              {errorMsg}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'loading'}
            style={{
              width:      '100%',
              background: status === 'loading' ? '#525252' : '#171717',
              color:      '#ffffff',
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize:   '18px',
              fontWeight: 400,
              border:     'none',
              padding:    '20px',
              cursor:     status === 'loading' ? 'not-allowed' : 'pointer',
              opacity:    status === 'loading' ? 0.7 : 1,
              transition: 'opacity 0.2s, background 0.2s',
              display:    'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap:        '10px',
            }}
          >
            {status === 'loading' ? 'Sending…' : submitLabel}
            {status !== 'loading' && (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path d="M3 9h12M9 3l6 6-6 6" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </form>
        )}
      </div>
    </section>
  )
}

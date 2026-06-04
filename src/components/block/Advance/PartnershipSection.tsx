'use client'

import { useEffect, useId, useRef, useState } from 'react'

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

interface PartnershipData {
  heading?:         string
  description?:     string
  partnershipNote?: string
  submitLabel?:     string
}

type Status = 'idle' | 'loading' | 'success' | 'error'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '18px 24px',
  background: '#efefef',
  border: 'none',
  borderRadius: '8px',
  fontFamily: 'var(--font-work-sans, sans-serif)',
  fontSize: '16px',
  color: '#171717',
  outline: 'none',
  transition: 'background 0.2s',
}

export default function PartnershipSection({ data }: { data: PartnershipData }) {
  const {
    heading         = 'Get Partnership Opportunities',
    description     = "Have ideas, questions, or want to collaborate?\nLeave your details and we'll get in touch with you soon.",
    partnershipNote = 'Join 15,000+ developers and tech leaders. Unsubscribe anytime.',
    submitLabel     = 'Send Message',
  } = data

  const siteKey     = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ''
  const captchaId   = useId().replace(/:/g, '')
  const captchaRef  = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)
  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [status,       setStatus]       = useState<Status>('idle')
  const [fields,       setFields]       = useState({ name: '', email: '', phone: '' })
  const [errorMsg,     setErrorMsg]     = useState('')
  // true = widget rendered; false = still loading; null = failed to render
  const [captchaReady, setCaptchaReady] = useState<boolean | null>(!siteKey ? true : false)

  useEffect(() => {
    if (!siteKey) return
    if (document.querySelector('script[src*="recaptcha/api.js"]')) {
      renderCaptcha(); return
    }
    const script   = document.createElement('script')
    script.src     = 'https://www.google.com/recaptcha/api.js?render=explicit'
    script.async   = true
    script.defer   = true
    script.onload  = renderCaptcha
    script.onerror = () => setCaptchaReady(null)
    document.head.appendChild(script)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey])

  function renderCaptcha() {
    if (!siteKey || !captchaRef.current) return
    window.grecaptcha?.ready(() => {
      if (widgetIdRef.current !== null) return
      try {
        widgetIdRef.current = window.grecaptcha!.render(captchaRef.current!, { sitekey: siteKey })
      } catch { /* render failed */ }
      timerRef.current = setTimeout(() => {
        if (captchaRef.current?.querySelector('iframe')) {
          setCaptchaReady(true)
        } else {
          setCaptchaReady(null)
        }
      }, 3000)
    })
  }

  const set = (key: keyof typeof fields) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setFields(prev => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fields.name || !fields.email) return

    const recaptchaToken = captchaReady === true
      ? (window.grecaptcha?.getResponse(widgetIdRef.current ?? undefined) ?? '')
      : captchaReady === null ? 'recaptcha-unavailable' : ''

    if (captchaReady === false) {
      setErrorMsg('Security check is still loading. Please wait a moment.')
      setStatus('error')
      return
    }
    if (captchaReady === true && !recaptchaToken) {
      setErrorMsg('Please complete the reCAPTCHA.')
      setStatus('error')
      return
    }

    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/partnership', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...fields, recaptchaToken }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d?.error ?? 'error')
      }
      setStatus('success')
      setFields({ name: '', email: '', phone: '' })
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'Something went wrong. Please try again.')
      setStatus('error')
      if (captchaReady === true) window.grecaptcha?.reset(widgetIdRef.current ?? undefined)
    }
  }

  return (
    <section
      style={{ background: '#fafafa', padding: '80px 172px' }}
      className="partnership-section"
    >
      <div
        style={{
          background:   '#ffd369',
          borderRadius: '16px',
          padding:      '48px 88px',
          display:      'flex',
          gap:          '41px',
          alignItems:   'flex-start',
        }}
        className="partnership-inner"
      >
        {/* ── Left col ── */}
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '465px', flexShrink: 0 }}
          className="partnership-left"
        >
          {/* Icon */}
          <div
            style={{
              width: '64px', height: '64px',
              background: '#000',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
              />
              <path
                d="M22 6l-10 7L2 6"
                stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Heading */}
          <h2
            style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize:   '36px',
              fontWeight: 700,
              lineHeight: '40px',
              color:      '#171717',
              margin:     '8px 0 0',
            }}
          >
            {heading}
          </h2>

          {/* Description */}
          <p
            style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize:   '18px',
              fontWeight: 400,
              lineHeight: '28px',
              color:      '#171717',
              whiteSpace: 'pre-line',
            }}
          >
            {description}
          </p>

          {/* Note */}
          {partnershipNote && (
            <p
              style={{
                fontFamily: 'var(--font-work-sans, sans-serif)',
                fontSize:   '14px',
                lineHeight: '20px',
                color:      '#171717',
                marginTop:  '8px',
              }}
            >
              {partnershipNote}
            </p>
          )}
        </div>

        {/* ── Right col — form ── */}
        <div style={{ flex: '1 0 0', minWidth: 0, maxWidth: '576px', paddingTop: '16px' }}>
          {status === 'success' ? (
            <div
              style={{
                display:       'flex',
                flexDirection: 'column',
                alignItems:    'center',
                gap:           '16px',
                padding:       '40px 0',
                textAlign:     'center',
              }}
            >
              <div
                style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: '#171717',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12l5 5 9-10" stroke="#ffd369" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize:   '20px',
                  fontWeight: 700,
                  color:      '#171717',
                }}
              >
                Message Sent!
              </p>
              <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '15px', color: '#525252' }}>
                We&apos;ll get in touch with you soon.
              </p>
              <button
                onClick={() => setStatus('idle')}
                style={{
                  marginTop:   '8px',
                  background:  '#171717',
                  color:       '#ffd369',
                  border:      'none',
                  borderRadius:'8px',
                  padding:     '12px 28px',
                  fontFamily:  'var(--font-work-sans, sans-serif)',
                  fontSize:    '14px',
                  fontWeight:  600,
                  cursor:      'pointer',
                }}
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                placeholder="Enter your full name"
                required
                value={fields.name}
                onChange={set('name')}
                style={inputStyle}
              />
              <input
                type="email"
                placeholder="Enter your email address"
                required
                value={fields.email}
                onChange={set('email')}
                style={inputStyle}
              />
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={fields.phone}
                onChange={set('phone')}
                style={inputStyle}
              />

              {siteKey && (
                <div ref={captchaRef} id={`recaptcha-${captchaId}`} />
              )}

              {status === 'error' && errorMsg && (
                <p
                  style={{
                    fontFamily: 'var(--font-work-sans, sans-serif)',
                    fontSize:   '14px',
                    color:      '#dc2626',
                    padding:    '10px 16px',
                    background: 'rgba(220,38,38,0.08)',
                    borderRadius: '6px',
                  }}
                >
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  alignSelf:   'flex-start',
                  padding:     '17.5px 32px',
                  background:  '#ffffff',
                  color:       '#171717',
                  border:      'none',
                  borderRadius:'8px',
                  fontFamily:  'var(--font-work-sans, sans-serif)',
                  fontSize:    '16px',
                  fontWeight:  700,
                  cursor:      status === 'loading' ? 'not-allowed' : 'pointer',
                  opacity:     status === 'loading' ? 0.7 : 1,
                  transition:  'opacity 0.2s, transform 0.15s',
                  lineHeight:  '24px',
                }}
              >
                {status === 'loading' ? 'Sending…' : submitLabel}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .partnership-section { padding: 48px 24px !important; }
          .partnership-inner {
            flex-direction: column !important;
            padding: 36px 32px !important;
            gap: 28px !important;
          }
          .partnership-left { max-width: 100% !important; }
        }
      `}</style>
    </section>
  )
}

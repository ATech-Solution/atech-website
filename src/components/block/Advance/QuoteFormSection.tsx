'use client'

import { useEffect, useId, useRef, useState } from 'react'

declare global {
  interface Window {
    grecaptcha?: {
      render: (container: string | HTMLElement, params: Record<string, string>) => number
      getResponse: (widgetId?: number) => string
      reset: (widgetId?: number) => void
      ready: (cb: () => void) => void
    }
  }
}

interface QuoteFormData {
  heading?:     string
  subheading?:  string
  submitLabel?: string
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

const inputStyle: React.CSSProperties = {
  border: '2px solid #e5e5e5',
  background: '#ffffff',
  fontFamily: 'var(--font-work-sans, sans-serif)',
  color: '#171717',
  width: '100%',
  padding: '16px 20px',
  fontSize: '15px',
  outline: 'none',
  transition: 'border-color 0.2s',
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  background: '#f5f5f5',
  color: '#525252',
  appearance: 'none' as const,
  cursor: 'pointer',
}

export default function QuoteFormSection({ data }: { data: QuoteFormData }) {
  const { heading, subheading, submitLabel = 'Request Your Quote' } = data

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ''
  const captchaId = useId().replace(/:/g, '')
  const captchaRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)

  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [fields, setFields] = useState({
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

  useEffect(() => {
    if (!siteKey) return
    if (document.querySelector('script[src*="recaptcha/api.js"]')) {
      renderCaptcha(); return
    }
    const script = document.createElement('script')
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.onload = renderCaptcha
    document.head.appendChild(script)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey])

  function renderCaptcha() {
    if (!siteKey || !captchaRef.current) return
    window.grecaptcha?.ready(() => {
      if (widgetIdRef.current !== null) return
      widgetIdRef.current = window.grecaptcha!.render(captchaRef.current!, { sitekey: siteKey })
    })
  }

  const set = (key: keyof typeof fields) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setFields(prev => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fields.firstName || !fields.email || !fields.projectDetails) return

    const recaptchaToken = siteKey
      ? (window.grecaptcha?.getResponse(widgetIdRef.current ?? undefined) ?? '')
      : 'dev-bypass'

    if (siteKey && !recaptchaToken) {
      setErrorMsg('Please complete the reCAPTCHA.')
      setStatus('error')
      return
    }

    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/quote', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...fields, recaptchaToken }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setFields({
        firstName: '', lastName: '', email: '', phone: '', company: '',
        serviceType: '', serviceSelected: '', developmentTime: '', projectDetails: '',
      })
    } catch {
      setErrorMsg('Something went wrong. Please try again or email us directly.')
      setStatus('error')
      window.grecaptcha?.reset(widgetIdRef.current ?? undefined)
    }
  }

  return (
    <section
      id="quote"
      className="py-24 px-6 md:px-10"
      style={{ background: '#ffffff', borderTop: '1px solid #e5e5e5' }}
    >
      <div className="mx-auto flex flex-col items-center gap-6" style={{ maxWidth: '896px' }}>
        {heading && (
          <h2
            style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 400,
              color: '#171717',
              textAlign: 'center',
              letterSpacing: '-0.8px',
              lineHeight: 1,
            }}
          >
            {heading}
          </h2>
        )}
        {subheading && (
          <p
            className="text-center max-w-2xl"
            style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize: '1.25rem',
              color: '#525252',
              lineHeight: '1.625',
            }}
          >
            {subheading}
          </p>
        )}

        {status === 'success' ? (
          <div
            className="w-full flex flex-col items-center gap-4 py-16"
            style={{ maxWidth: '672px' }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#171717',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
                <path d="M6 14l6 6 10-12" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-work-sans, sans-serif)',
                fontSize: '1.5rem',
                fontWeight: 500,
                color: '#171717',
                textAlign: 'center',
              }}
            >
              Quote Request Sent
            </h3>
            <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', color: '#525252', textAlign: 'center', lineHeight: 1.6 }}>
              Thank you! Our team will review your project and get back to you within 1–2 business days.
            </p>
            <button
              onClick={() => setStatus('idle')}
              style={{
                marginTop: 8,
                background: 'transparent',
                border: '2px solid #e5e5e5',
                padding: '12px 28px',
                fontFamily: 'var(--font-work-sans, sans-serif)',
                fontSize: '14px',
                color: '#525252',
                cursor: 'pointer',
              }}
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-5 mt-4"
            style={{ maxWidth: '672px' }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <input
                type="text"
                placeholder="First Name *"
                required
                value={fields.firstName}
                onChange={set('firstName')}
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={fields.lastName}
                onChange={set('lastName')}
                style={inputStyle}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <input
                type="email"
                placeholder="Email Address *"
                required
                value={fields.email}
                onChange={set('email')}
                style={inputStyle}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={fields.phone}
                onChange={set('phone')}
                style={inputStyle}
              />
            </div>

            <input
              type="text"
              placeholder="Company Name"
              value={fields.company}
              onChange={set('company')}
              style={inputStyle}
            />

            <div style={{ position: 'relative' }}>
              <select
                value={fields.serviceType}
                onChange={set('serviceType')}
                style={selectStyle}
              >
                <option value="">Select Service Type</option>
                <option>Web Development</option>
                <option>Mobile Development</option>
                <option>IT Consulting</option>
                <option>HR Recruitment</option>
                <option>Cloud Solutions</option>
              </select>
              <span style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#999' }}>▾</span>
            </div>

            <div style={{ position: 'relative' }}>
              <select
                value={fields.serviceSelected}
                onChange={set('serviceSelected')}
                style={selectStyle}
              >
                <option value="">Select Service Plan</option>
                <option>Basic</option>
                <option>Standard</option>
                <option>Enterprise</option>
              </select>
              <span style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#999' }}>▾</span>
            </div>

            <div style={{ position: 'relative' }}>
              <select
                value={fields.developmentTime}
                onChange={set('developmentTime')}
                style={selectStyle}
              >
                <option value="">Development Timeline</option>
                <option>1–3 months</option>
                <option>3–6 months</option>
                <option>6–12 months</option>
                <option>12+ months</option>
              </select>
              <span style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#999' }}>▾</span>
            </div>

            <textarea
              placeholder="Project Details *"
              required
              rows={5}
              value={fields.projectDetails}
              onChange={set('projectDetails')}
              style={{ ...inputStyle, resize: 'none' }}
            />

            {siteKey && (
              <div ref={captchaRef} id={`recaptcha-${captchaId}`} />
            )}

            {status === 'error' && errorMsg && (
              <p
                style={{
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize: '14px',
                  color: '#dc2626',
                  padding: '12px 16px',
                  border: '1px solid #fecaca',
                  background: '#fef2f2',
                }}
              >
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-5 text-lg font-normal"
              style={{
                background: status === 'loading' ? '#525252' : '#171717',
                color: '#ffffff',
                fontFamily: 'var(--font-work-sans, sans-serif)',
                border: 'none',
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s, background 0.2s',
                opacity: status === 'loading' ? 0.7 : 1,
              }}
            >
              {status === 'loading' ? 'Sending…' : submitLabel}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

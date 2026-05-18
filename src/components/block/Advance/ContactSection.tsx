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

interface ContactSectionData {
  heading?:           string
  contactSubheading?: string
  formHeading?:       string
  submitLabel?:       string
  infoHeading?:       string
  contactEmail?:      string
  contactPhone?:      string
  contactLocation?:   string
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

function EmailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="white" strokeWidth="1.2" />
      <path d="M1.5 5.5l6.5 4 6.5-4" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M2 3.5A1.5 1.5 0 013.5 2h1.618a.5.5 0 01.473.336l.75 2.25a.5.5 0 01-.213.572L4.37 6.158a9.022 9.022 0 004.472 4.472l1-.758a.5.5 0 01.572-.213l2.25.75A.5.5 0 0113 10.882V12.5A1.5 1.5 0 0111.5 14 9.5 9.5 0 012 4.5V3.5z"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 1.5A4.5 4.5 0 013.5 6c0 3 4.5 8.5 4.5 8.5S12.5 9 12.5 6A4.5 4.5 0 018 1.5z"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6" r="1.5" stroke="white" strokeWidth="1.2" />
    </svg>
  )
}

function ContactInfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: '#000000' }}
      >
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <span
          className="text-base font-normal"
          style={{ color: 'var(--color-text, #fafafa)', fontFamily: 'var(--font-work-sans, sans-serif)' }}
        >
          {label}
        </span>
        <span
          className="text-base font-normal"
          style={{ color: 'var(--color-text, #fafafa)', fontFamily: 'var(--font-work-sans, sans-serif)' }}
        >
          {value}
        </span>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #d4d4d4',
  borderRadius: '8px',
  padding: '15px 17px',
  fontSize: '16px',
  color: '#171717',
  fontFamily: 'var(--font-work-sans, sans-serif)',
  width: '100%',
  outline: 'none',
}

export default function ContactSection({ data }: { data: ContactSectionData }) {
  const submitLabel = data.submitLabel ?? 'Send Message'
  const formHeading = data.formHeading ?? 'Send us a Message'
  const infoHeading = data.infoHeading ?? 'Contact Information'

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ''
  const captchaId = useId().replace(/:/g, '')
  const captchaRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)

  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [fields, setFields] = useState({
    firstName: '',
    lastName:  '',
    email:     '',
    phone:     '',
    message:   '',
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFields(prev => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fields.firstName || !fields.email || !fields.message) return

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
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...fields, recaptchaToken }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setFields({ firstName: '', lastName: '', email: '', phone: '', message: '' })
    } catch {
      setErrorMsg('Something went wrong. Please try again or email us directly.')
      setStatus('error')
      window.grecaptcha?.reset(widgetIdRef.current ?? undefined)
    }
  }

  return (
    <section
      className="py-24"
      style={{
        background: 'var(--color-bg, #292929)',
        borderTop: '1px solid var(--color-border, #383838)',
        paddingTop: 'var(--section-padding-y, 96px)',
        paddingBottom: 'var(--section-padding-y, 96px)',
      }}
    >
      <div className="mx-auto px-6 md:px-10" style={{ maxWidth: 'var(--content-max-width, 1280px)' }}>
        {(data.heading || data.contactSubheading) && (
          <div className="flex flex-col gap-6 items-center w-full mb-16">
            {data.heading && (
              <h2
                className="text-center w-full leading-tight tracking-tight"
                style={{
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                  fontWeight: 700,
                  color: 'var(--color-text, #fafafa)',
                  letterSpacing: '-0.01em',
                }}
              >
                {data.heading}
              </h2>
            )}
            {data.contactSubheading && (
              <p
                className="text-center w-full leading-relaxed"
                style={{
                  fontFamily: 'var(--font-work-sans, sans-serif)',
                  fontSize: '1.125rem',
                  color: 'var(--color-muted, #525252)',
                  maxWidth: '44rem',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                {data.contactSubheading}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* ── Left: Contact info ── */}
          <div className="flex flex-col gap-8">
            <h3
              className="text-2xl font-normal"
              style={{ color: 'var(--color-text, #fafafa)', fontFamily: 'var(--font-work-sans, sans-serif)' }}
            >
              {infoHeading}
            </h3>
            <div className="flex flex-col gap-6">
              {data.contactEmail && (
                <ContactInfoRow icon={<EmailIcon />} label="Email" value={data.contactEmail} />
              )}
              {data.contactPhone && (
                <ContactInfoRow icon={<PhoneIcon />} label="Phone" value={data.contactPhone} />
              )}
              {data.contactLocation && (
                <ContactInfoRow icon={<LocationIcon />} label="Location" value={data.contactLocation} />
              )}
            </div>
          </div>

          {/* ── Right: Contact form ── */}
          <div className="flex flex-col gap-6">
            <h3
              className="text-2xl font-normal"
              style={{ color: 'var(--color-text, #fafafa)', fontFamily: 'var(--font-work-sans, sans-serif)' }}
            >
              {formHeading}
            </h3>

            {status === 'success' ? (
              <div className="flex flex-col gap-4 py-8">
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'var(--button-bg, #ffffff)',
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M5 12l5 5 9-10" stroke="var(--button-text, #000000)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-work-sans, sans-serif)',
                    fontSize: '1.125rem',
                    fontWeight: 500,
                    color: 'var(--color-text, #fafafa)',
                  }}
                >
                  Message Sent
                </p>
                <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', color: 'var(--color-muted, #525252)', lineHeight: 1.6, fontSize: '14px' }}>
                  Thank you for reaching out. We&apos;ll get back to you within 1–2 business days.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  style={{
                    alignSelf: 'flex-start',
                    marginTop: 8,
                    background: 'transparent',
                    border: '1px solid var(--color-border, #383838)',
                    borderRadius: 8,
                    padding: '10px 20px',
                    fontFamily: 'var(--font-work-sans, sans-serif)',
                    fontSize: '14px',
                    color: 'var(--color-muted, #525252)',
                    cursor: 'pointer',
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name *"
                    required
                    value={fields.firstName}
                    onChange={set('firstName')}
                    className="focus:outline-none"
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={fields.lastName}
                    onChange={set('lastName')}
                    className="focus:outline-none"
                    style={inputStyle}
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email *"
                  required
                  value={fields.email}
                  onChange={set('email')}
                  className="focus:outline-none"
                  style={inputStyle}
                />
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={fields.phone}
                  onChange={set('phone')}
                  className="focus:outline-none"
                  style={inputStyle}
                />
                <textarea
                  placeholder="Message *"
                  required
                  rows={5}
                  value={fields.message}
                  onChange={set('message')}
                  className="focus:outline-none"
                  style={{ ...inputStyle, resize: 'none' }}
                />

                {siteKey && (
                  <div ref={captchaRef} id={`recaptcha-${captchaId}`} />
                )}

                {status === 'error' && errorMsg && (
                  <p
                    style={{
                      fontFamily: 'var(--font-work-sans, sans-serif)',
                      fontSize: '13px',
                      color: '#ef4444',
                      padding: '10px 14px',
                      background: 'rgba(239,68,68,0.08)',
                      borderRadius: 6,
                      border: '1px solid rgba(239,68,68,0.2)',
                    }}
                  >
                    {errorMsg}
                  </p>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-8 py-3 rounded-lg text-base font-normal"
                    style={{
                      background: 'var(--button-bg, #ffffff)',
                      color: 'var(--button-text, #000000)',
                      fontFamily: 'var(--font-work-sans, sans-serif)',
                      borderRadius: 'var(--button-radius, 8px)',
                      border: 'none',
                      cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                      opacity: status === 'loading' ? 0.6 : 1,
                      transition: 'opacity 0.2s',
                    }}
                  >
                    {status === 'loading' ? 'Sending…' : submitLabel}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

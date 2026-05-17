'use client'

// Get in Touch section — Figma node 1:26746
// Dark background, centered heading, 2-col: contact info + contact form

import { useState } from 'react'
import SectionHeader from '@/components/ui/SectionHeader'

const EMAIL_ICON_SRC    = 'https://www.figma.com/api/mcp/asset/10e9f417-5d38-4844-a82c-a2b1a3934a73'
const PHONE_ICON_SRC    = 'https://www.figma.com/api/mcp/asset/6d11bde0-c62c-4e41-acb9-480cdc319304'
const LOCATION_ICON_SRC = 'https://www.figma.com/api/mcp/asset/daac2985-4e17-45ec-a5ae-48ce02e76c7c'

interface ContactInfo {
  heading:  string
  email:    string
  phone:    string
  location: string
}

interface ContactForm {
  heading:     string
  submitLabel: string
}

interface ContactData {
  heading:    string
  subheading: string
  info:       ContactInfo
  form:       ContactForm
}

function ContactInfoItem({ iconSrc, label, value }: { iconSrc: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#000000' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconSrc} alt="" className="w-4 h-4 object-contain" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-base font-normal" style={{ color: 'var(--color-text, #fafafa)', fontFamily: 'var(--font-work-sans, sans-serif)' }}>{label}</span>
        <span className="text-base font-normal" style={{ color: 'var(--color-text, #fafafa)', fontFamily: 'var(--font-work-sans, sans-serif)' }}>{value}</span>
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

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function ContactBlock({ data }: { data: ContactData }) {
  const { heading, subheading, info, form } = data

  const [fields, setFields] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(fields),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data?.error ?? 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      setStatus('success')
      setFields({ firstName: '', lastName: '', email: '', phone: '', message: '' })
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.')
      setStatus('error')
    }
  }

  return (
    <section
      className="py-20"
      style={{
        background: '#292929',
        borderTop:  '1px solid #383838',
      }}
    >
      <div className="mx-auto px-6 md:px-10" style={{ maxWidth: '1280px' }}>
        <div className="mb-16">
          <SectionHeader
            heading={heading}
            subheading={subheading}
            align="center"
            headingColor="#ffffff"
            subheadingColor="#ffffff"
            headingFontWeight={400}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* ── Left: Contact info ──────────────────────────────────────── */}
          <div className="flex flex-col gap-8">
            <h3 className="text-2xl font-normal" style={{ color: 'var(--color-text, #fafafa)', fontFamily: 'var(--font-work-sans, sans-serif)' }}>
              {info.heading}
            </h3>
            <div className="flex flex-col gap-6">
              <ContactInfoItem iconSrc={EMAIL_ICON_SRC}    label="Email"    value={info.email} />
              <ContactInfoItem iconSrc={PHONE_ICON_SRC}    label="Phone"    value={info.phone} />
              <ContactInfoItem iconSrc={LOCATION_ICON_SRC} label="Location" value={info.location} />
            </div>
          </div>

          {/* ── Right: Contact form ─────────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            <h3 className="text-2xl font-normal" style={{ color: 'var(--color-text, #fafafa)', fontFamily: 'var(--font-work-sans, sans-serif)' }}>
              {form.heading}
            </h3>

            {status === 'success' ? (
              <div style={{ background: 'rgba(200,241,53,0.1)', border: '1px solid rgba(200,241,53,0.3)', borderRadius: '8px', padding: '24px' }}>
                <p style={{ color: '#c8f135', fontFamily: 'var(--font-work-sans, sans-serif)', margin: 0 }}>
                  ✓ Message sent! We&apos;ll get back to you shortly.
                </p>
              </div>
            ) : (
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    required
                    value={fields.firstName}
                    onChange={handleChange}
                    className="w-full focus:outline-none"
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={fields.lastName}
                    onChange={handleChange}
                    className="w-full focus:outline-none"
                    style={inputStyle}
                  />
                </div>

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={fields.email}
                  onChange={handleChange}
                  className="w-full focus:outline-none"
                  style={inputStyle}
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone (optional)"
                  value={fields.phone}
                  onChange={handleChange}
                  className="w-full focus:outline-none"
                  style={inputStyle}
                />

                <textarea
                  name="message"
                  placeholder="Message"
                  rows={5}
                  required
                  value={fields.message}
                  onChange={handleChange}
                  className="w-full focus:outline-none"
                  style={{ ...inputStyle, resize: 'none' }}
                />

                {status === 'error' && (
                  <p style={{ color: '#f87171', fontSize: '14px', margin: 0 }}>{errorMsg}</p>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="px-8 py-3 rounded-lg text-base font-normal transition-opacity duration-200 hover:opacity-90 disabled:opacity-50"
                    style={{ background: '#ffffff', color: '#000000', fontFamily: 'var(--font-work-sans, sans-serif)' }}
                  >
                    {status === 'sending' ? 'Sending…' : form.submitLabel}
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

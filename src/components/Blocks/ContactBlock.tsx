// Get in Touch section — Figma node 1:26746
// Dark background, centered heading, 2-col: contact info + contact form

import SectionHeader from '@/components/ui/SectionHeader'
import { MailIcon, PhoneIcon, LocationIcon } from '@/components/icons/Icons'

// Figma SVG asset URLs for contact icons
const EMAIL_ICON_SRC    = 'https://www.figma.com/api/mcp/asset/10e9f417-5d38-4844-a82c-a2b1a3934a73'
const PHONE_ICON_SRC    = 'https://www.figma.com/api/mcp/asset/6d11bde0-c62c-4e41-acb9-480cdc319304'
const LOCATION_ICON_SRC = 'https://www.figma.com/api/mcp/asset/daac2985-4e17-45ec-a5ae-48ce02e76c7c'

interface ContactInfo {
  heading: string
  email: string
  phone: string
  location: string
}

interface ContactForm {
  heading: string
  submitLabel: string
}

interface ContactData {
  heading: string
  subheading: string
  info: ContactInfo
  form: ContactForm
}

// ─── Reusable contact info row ────────────────────────────────────────────────
function ContactInfoItem({
  iconSrc,
  label,
  value,
}: {
  iconSrc: string
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-4">
      {/* Black icon square — matches Figma exactly */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: '#000000' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconSrc} alt="" className="w-4 h-4 object-contain" />
      </div>
      <div className="flex flex-col gap-1">
        <span
          className="text-base font-normal"
          style={{
            color: 'var(--color-text, #fafafa)',
            fontFamily: 'var(--font-work-sans, sans-serif)',
          }}
        >
          {label}
        </span>
        <span
          className="text-base font-normal"
          style={{
            color: 'var(--color-text, #fafafa)',
            fontFamily: 'var(--font-work-sans, sans-serif)',
          }}
        >
          {value}
        </span>
      </div>
    </div>
  )
}

// ─── Shared input style ───────────────────────────────────────────────────────
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

const placeholderClass = 'w-full focus:outline-none'

// ─── ContactBlock ─────────────────────────────────────────────────────────────
export default function ContactBlock({ data }: { data: ContactData }) {
  const { heading, subheading, info, form } = data

  return (
    <section
      className="py-24"
      style={{
        background: 'var(--color-bg, #292929)',
        borderTop: '1px solid var(--color-border, #383838)',
      }}
    >
      <div className="mx-auto px-6 md:px-10" style={{ maxWidth: '1280px' }}>
        {/* Section heading */}
        <div className="mb-16">
          <SectionHeader heading={heading} subheading={subheading} align="center" />
        </div>

        {/* 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* ── Left: Contact info ─────────────────────────────────────── */}
          <div className="flex flex-col gap-8">
            <h3
              className="text-2xl font-normal"
              style={{
                color: 'var(--color-text, #fafafa)',
                fontFamily: 'var(--font-work-sans, sans-serif)',
              }}
            >
              {info.heading}
            </h3>

            <div className="flex flex-col gap-6">
              <ContactInfoItem
                iconSrc={EMAIL_ICON_SRC}
                label="Email"
                value={info.email}
              />
              <ContactInfoItem
                iconSrc={PHONE_ICON_SRC}
                label="Phone"
                value={info.phone}
              />
              <ContactInfoItem
                iconSrc={LOCATION_ICON_SRC}
                label="Location"
                value={info.location}
              />
            </div>
          </div>

          {/* ── Right: Contact form ────────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            <h3
              className="text-2xl font-normal"
              style={{
                color: 'var(--color-text, #fafafa)',
                fontFamily: 'var(--font-work-sans, sans-serif)',
              }}
            >
              {form.heading}
            </h3>

            <form className="flex flex-col gap-4" action="/contact" method="POST">
              {/* First / Last name row */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className={placeholderClass}
                  style={inputStyle}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className={placeholderClass}
                  style={inputStyle}
                />
              </div>

              {/* Email */}
              <input
                type="email"
                placeholder="Email"
                className={placeholderClass}
                style={inputStyle}
              />

              {/* Message */}
              <textarea
                placeholder="Message"
                rows={5}
                className={placeholderClass}
                style={{ ...inputStyle, resize: 'none' }}
              />

              {/* Submit */}
              <div>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-lg text-base font-normal transition-opacity duration-200 hover:opacity-90"
                  style={{
                    background: '#ffffff',
                    color: '#000000',
                    fontFamily: 'var(--font-work-sans, sans-serif)',
                  }}
                >
                  {form.submitLabel}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

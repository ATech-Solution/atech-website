// Contact Section — Layout Builder variant (Advance)
// Used by: home-contact, about-contact block types

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

  return (
    <section
      className="py-24"
      style={{ background: 'var(--color-bg, #292929)', borderTop: '1px solid var(--color-border, #383838)' }}
    >
      <div className="mx-auto px-6 md:px-10" style={{ maxWidth: '1280px' }}>
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

            <form className="flex flex-col gap-4" action="/contact" method="POST">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="w-full focus:outline-none" style={inputStyle} />
                <input type="text" placeholder="Last Name"  className="w-full focus:outline-none" style={inputStyle} />
              </div>
              <input type="email" placeholder="Email" className="w-full focus:outline-none" style={inputStyle} />
              <textarea
                placeholder="Message"
                rows={5}
                className="w-full focus:outline-none"
                style={{ ...inputStyle, resize: 'none' }}
              />
              <div>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-lg text-base font-normal transition-opacity duration-200 hover:opacity-90"
                  style={{ background: '#ffffff', color: '#000000', fontFamily: 'var(--font-work-sans, sans-serif)' }}
                >
                  {submitLabel}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

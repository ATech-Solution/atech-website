import Link from 'next/link'

const FONT = 'var(--font-work-sans, "Work Sans", sans-serif)'
const MUTED = '#a3a3a3'

interface FooterProps {
  theme?: any
  settings?: any
}

const QUICK_LINKS = [
  { label: 'About Us',       href: '/about'   },
  { label: 'Services',       href: '/services'},
  { label: 'Contact',        href: '/static/contact' },
  // { label: 'Privacy Policy', href: '/privacy-policy' },
]

export default async function Footer({ theme, settings }: FooterProps = {}) {
  const year        = new Date().getFullYear()
  const t           = (theme as any) ?? {}
  const email       = t.contactEmail    ?? 'hello@atech.software'
  const phone       = t.contactPhone    ?? '+852 1234 5678'
  const location    = t.contactLocation ?? 'Hong Kong'

  const logo        = t.logo ?? 'Atech'
  const siteName    = t.siteName ?? ''
  const siteTagline    = t.siteTagline ?? ''
  const contactHeading    = t.contactHeading ?? ''
  const contactSubheading = t.contactSubheading ?? ''
  const footerDescription = t.footerDescription ?? ''
  const footerCopyright   = t.footerCopyright ?? ''

  return (
    <footer style={{ background: '#171717' }}>
      <div
        className="mx-auto px-6 md:px-[80px] pt-16 pb-8"
        style={{ maxWidth: '1280px' }}
      >
        {/* ── Top 4-column grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-6">
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex' }}>
              <div style={{ position: 'relative', width: 127.264, height: 27.003, flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {logo ? (
                  <><img 
                src={logo.url}  
                alt={logo.alt} 
                style={{ position: 'absolute', left: 0,top: 0.3,  width: 'auto', height: 'auto', filter: 'invert(100%)' }} 
                />
                </>): (t.siteName)
                }
              </div>
            </Link>
            <p
              style={{
                fontFamily: FONT, fontSize: 16, lineHeight: '24px',
                color: MUTED, maxWidth: 238,
              }}
            >
              {footerDescription ? footerDescription : ""}
            </p>
            {/* Social icons */}
            <div className="flex gap-4">
              {[
                { src: '/images/twitter.png',  href: settings?.twitter, label: 'Twitter',  w: 14, h: 16  },
                { src: '/images/linkedn.png', href: settings?.linkedin, label: 'LinkedIn',  w: 16, h: 16  },
                { src: '/images/github.png',   href: settings?.github, label: 'GitHub',    w: 15.5, h: 16 },
              ].map(({ src, href, label, w, h }) => (
                // { src: '/images/facebook.png',   href: settings.facebook, label: 'Facebook',    w: 15.5, h: 16 },
                // { src: '/images/instagram.png',   href: settings.instagram, label: 'Instagram',    w: 15.5, h: 16 },
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex items-center justify-center flex-shrink-0 transition-opacity duration-150 hover:opacity-70"
                  style={{
                    width: 40, height: 40, borderRadius: 8,
                    background: '#262626',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',

                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" style={{ width: w, height: h, objectFit: 'contain' }} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Contact Information */}
          <div className="flex flex-col gap-4">
            <h4
              style={{
                fontFamily: FONT, fontSize: 18, lineHeight: '28px',
                color: '#ffffff', fontWeight: 400, margin: 0,
              }}
            >
              Contact Information
            </h4>
            <div className="flex flex-col gap-3">
              {[email, phone, location].map((val) => (
                <p
                  key={val}
                  style={{
                    fontFamily: FONT, fontSize: 16, lineHeight: '24px',
                    color: MUTED, margin: 0,
                  }}
                >
                  {val}
                </p>
              ))}
            </div>
          </div>

          {/* Col 3 — Quick Links */}
          <div className="flex flex-col gap-4">
            <h4
              style={{
                fontFamily: FONT, fontSize: 18, lineHeight: '28px',
                color: '#ffffff', fontWeight: 400, margin: 0,
              }}
            >
              Quick Links
            </h4>
            <div className="flex flex-col gap-3">
              {QUICK_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  style={{
                    fontFamily: FONT, fontSize: 16, lineHeight: '24px',
                    color: MUTED, textDecoration: 'none',
                    transition: 'color 0.15s',
                  }}
                  // onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#ffffff' }}
                  // onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = MUTED      }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 4 — Get Started */}
          <div className="flex flex-col gap-4">
            <h4
              style={{
                fontFamily: FONT, fontSize: 18, lineHeight: '28px',
                color: '#ffffff', fontWeight: 400, margin: 0,
              }}
            >
              Get Started
            </h4>
            <p
              style={{
                fontFamily: FONT, fontSize: 16, lineHeight: '24px',
                color: MUTED, margin: 0,
              }}
            >
              Ready to transform your business with technology?
            </p>
            <Link
              href="/static/contact"
              style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '12px 24px', borderRadius: 8,
                background: '#292929', color: '#ffffff',
                fontFamily: FONT, fontSize: 16, lineHeight: '24px',
                textDecoration: 'none', width: 'fit-content',
                transition: 'opacity 0.15s',
              }}
              // onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.8' }}
              // onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'   }}
            >
              Send us a Message
            </Link>
          </div>
        </div>

        {/* ── Bottom bar ─────────────────────────────────────────────────── */}
        <div
          className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between pt-8"
          style={{ borderTop: '1px solid #262626' }}
        >
          <p
            style={{
              fontFamily: FONT, fontSize: 16, lineHeight: '24px',
              color: MUTED, margin: 0,
            }}
          >
            © {year} {footerCopyright ? footerCopyright : ""}
          </p>
          <div className="flex gap-6">
            {[
              { label: 'Privacy Policy',   href: '/privacy-policy' },
              { label: 'Terms of Service', href: '/terms-and-conditions'   },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                style={{
                  fontFamily: FONT, fontSize: 14, lineHeight: '20px',
                  color: MUTED, textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
                // onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#ffffff' }}
                // onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = MUTED      }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

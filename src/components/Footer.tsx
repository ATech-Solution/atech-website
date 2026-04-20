import Link from 'next/link'

// ─── Figma logo asset URLs (footer — light letterforms on dark bg) ──────────
const LOGO_LEFT  = 'https://www.figma.com/api/mcp/asset/5280f48a-30e9-45ce-aa6a-ce8718fc71f4'
const LOGO_A     = 'https://www.figma.com/api/mcp/asset/cf10d56e-cc6e-4b1b-ab0f-1a9bc372bc48'
const LOGO_T     = 'https://www.figma.com/api/mcp/asset/e3b7fb35-d46d-4148-813c-bcab52608653'
const LOGO_E     = 'https://www.figma.com/api/mcp/asset/b57d56cf-d698-4202-9ade-bdc936e83e94'
const LOGO_C     = 'https://www.figma.com/api/mcp/asset/6420cd23-3b0f-41e5-ac67-4b69cb759f6b'
const LOGO_H     = 'https://www.figma.com/api/mcp/asset/18df485b-312e-4a7b-9aed-40e299ec80aa'
const LOGO_RIGHT = 'https://www.figma.com/api/mcp/asset/41f7217e-094d-4e4c-9e53-a9c0590e0f67'

// ─── Figma social icon asset URLs ────────────────────────────────────────────
const ICON_TWITTER  = 'https://www.figma.com/api/mcp/asset/5d73f7d8-a3bf-491c-8f15-18df18a49db9'
const ICON_LINKEDIN = 'https://www.figma.com/api/mcp/asset/b9757cc3-36ef-4fd6-bec8-7c66a24eb4d4'
const ICON_GITHUB   = 'https://www.figma.com/api/mcp/asset/18805733-29b4-4576-936f-c3a2fc2d3eb1'

/** Reproduces the </>.Tech> logo from Figma exactly */
function AtechLogo() {
  return (
    <div style={{ position: 'relative', width: 127.264, height: 27.003, flexShrink: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO_LEFT}  alt="" style={{ position: 'absolute', left: 0,       top: 0.3,  width: 10.743, height: 26.705 }} />
      <div style={{ position: 'absolute', left: 16.16, top: 0, display: 'flex', alignItems: 'flex-end', gap: 1.413 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO_A} alt="" style={{ width: 23.277, height: 24.978 }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO_T} alt="" style={{ width: 16.968, height: 24.68  }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO_E} alt="" style={{ width: 18.626, height: 17.94  }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO_C} alt="" style={{ width: 13.198, height: 17.688 }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO_H} alt="" style={{ width: 17.49,  height: 27.003 }} />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO_RIGHT} alt="" style={{ position: 'absolute', left: 116.79, top: 0.04, width: 10.479, height: 26.962 }} />
    </div>
  )
}

const FONT = 'var(--font-work-sans, "Work Sans", sans-serif)'
const MUTED = '#a3a3a3'

interface FooterProps {
  theme?: any
}

const QUICK_LINKS = [
  { label: 'About Us',       href: '/about'   },
  { label: 'Services',       href: '/services'},
  { label: 'Contact',        href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
]

export default async function Footer({ theme }: FooterProps = {}) {
  const year        = new Date().getFullYear()
  const t           = (theme as any) ?? {}
  const email       = t.contactEmail    ?? 'hello@atech.software'
  const phone       = t.contactPhone    ?? '+852 1234 5678'
  const location    = t.contactLocation ?? 'Hong Kong'

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
              <AtechLogo />
            </Link>
            <p
              style={{
                fontFamily: FONT, fontSize: 16, lineHeight: '24px',
                color: MUTED, maxWidth: 238,
              }}
            >
              There is technical solution for your problems
            </p>
            {/* Social icons */}
            <div className="flex gap-4">
              {[
                { src: ICON_TWITTER,  href: '#', label: 'Twitter',  w: 14, h: 16  },
                { src: ICON_LINKEDIN, href: '#', label: 'LinkedIn',  w: 16, h: 16  },
                { src: ICON_GITHUB,   href: '#', label: 'GitHub',    w: 15.5, h: 16 },
              ].map(({ src, href, label, w, h }) => (
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
              href="/contact"
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
            © {year} ATech Solutions. All rights reserved.
          </p>
          <div className="flex gap-6">
            {[
              { label: 'Privacy Policy',   href: '/privacy' },
              { label: 'Terms of Service', href: '/terms'   },
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

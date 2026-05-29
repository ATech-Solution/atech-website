import Link from 'next/link'

const FONT = 'var(--font-work-sans, "Work Sans", sans-serif)'
const MUTED = '#a3a3a3'

// ── Social icon SVGs ──────────────────────────────────────────────────────────

function IconX() {
  return (
    <svg width="16" height="16" viewBox="0 0 300 300" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M178.57 127.15 290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59h89.34M36.01 19.54H76.66l187.13 262.13h-40.66" />
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function IconInstagram() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function IconGitHub() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

interface FooterColumn {
  heading: string
  links?: Array<{ label: string; url: string }>
}

interface FooterProps {
  theme?: any
  settings?: any
  navigation?: any
}

const FALLBACK_QUICK_LINKS = [
  { label: 'About Us',  href: '/about'          },
  { label: 'Services',  href: '/services'        },
  { label: 'Contact',   href: '/static/contact'  },
]

export default async function Footer({ theme, settings, navigation }: FooterProps = {}) {
  const year        = new Date().getFullYear()
  const t           = (theme as any) ?? {}
  const logo                  = t.logo ?? 'Atech'
  const footerDescription     = t.footerDescription ?? ''
  const footerCopyright       = t.footerCopyright ?? ''
  const getStartedTitle       = t.getStartedTitle       ?? 'Get Started'
  const getStartedDesc        = t.getStartedDesc        ?? 'Ready to transform your business with technology?'
  const getStartedButtonLabel = t.getStartedButtonLabel ?? 'Send us a Message'
  const getStartedButtonUrl   = t.getStartedButtonUrl   ?? '/static/contact'

  const cmsColumns: FooterColumn[] = ((navigation as any)?.footerColumns ?? []).filter(
    (col: FooterColumn) => col.heading && Array.isArray(col.links) && col.links.length > 0,
  )

  const copyrightMenu: Array<{ label: string; url: string }> =
    ((navigation as any)?.footerCopyrightMenu ?? []).filter(
      (item: any) => item.label && item.url,
    )

  return (
    <footer style={{ background: '#171717' }} id="footer">
      <div
        className="mx-auto px-6 md:px-[80px] pt-16 pb-8"
        style={{ maxWidth: '1280px' }}
      >
        {/* ── Top grid: Brand + Contact + N CMS columns + Get Started ──── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:auto-cols-fr lg:grid-flow-col gap-8 mb-12">

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
            <div className="flex flex-wrap gap-3">
              {([
                { icon: <IconX />,         href: t.twitter,   label: 'X (Twitter)' },
                { icon: <IconLinkedIn />,   href: t.linkedin,  label: 'LinkedIn'    },
                { icon: <IconFacebook />,   href: t.facebook,  label: 'Facebook'    },
                { icon: <IconInstagram />,  href: t.instagram, label: 'Instagram'   },
                { icon: <IconGitHub />,     href: t.github,    label: 'GitHub'      },
              ] as const).filter(({ href }) => Boolean(href)).map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href!}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 transition-opacity duration-150 hover:opacity-70"
                  style={{
                    width: 40, height: 40, borderRadius: 8,
                    background: '#262626', color: '#ffffff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* CMS Footer Columns (or fallback Quick Links) */}
          {cmsColumns.length > 0 ? (
            cmsColumns.map((col, ci) => (
              <div key={ci} className="flex flex-col gap-4">
                <h4
                  style={{
                    fontFamily: FONT, fontSize: 18, lineHeight: '28px',
                    color: '#ffffff', fontWeight: 400, margin: 0,
                  }}
                >
                  {col.heading}
                </h4>
                <div className="flex flex-col gap-3">
                  {(col.links ?? []).map(({ label, url }) => (
                    <Link
                      key={label}
                      href={url}
                      style={{
                        fontFamily: FONT, fontSize: 16, lineHeight: '24px',
                        color: MUTED, textDecoration: 'none',
                        transition: 'color 0.15s',
                      }}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            ))
          ) : (
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
                {FALLBACK_QUICK_LINKS.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    style={{
                      fontFamily: FONT, fontSize: 16, lineHeight: '24px',
                      color: MUTED, textDecoration: 'none',
                      transition: 'color 0.15s',
                    }}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Get Started */}
          <div className="flex flex-col gap-4">
            <h4
              style={{
                fontFamily: FONT, fontSize: 18, lineHeight: '28px',
                color: '#ffffff', fontWeight: 400, margin: 0,
              }}
            >
              {getStartedTitle}
            </h4>
            {getStartedDesc && (
              <p
                style={{
                  fontFamily: FONT, fontSize: 16, lineHeight: '24px',
                  color: MUTED, margin: 0,
                }}
              >
                {getStartedDesc}
              </p>
            )}
            {getStartedButtonLabel && getStartedButtonUrl && (
              <Link
                href={getStartedButtonUrl}
                style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '12px 24px', borderRadius: 8,
                  background: '#292929', color: '#ffffff',
                  fontFamily: FONT, fontSize: 16, lineHeight: '24px',
                  textDecoration: 'none', width: 'fit-content',
                  transition: 'opacity 0.15s',
                }}
              >
                {getStartedButtonLabel}
              </Link>
            )}
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
          {copyrightMenu.length > 0 && (
            <div className="flex flex-wrap gap-6">
              {copyrightMenu.map(({ label, url }) => (
                <Link
                  key={label}
                  href={url}
                  style={{
                    fontFamily: FONT, fontSize: 14, lineHeight: '20px',
                    color: MUTED, textDecoration: 'none',
                    transition: 'color 0.15s',
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}

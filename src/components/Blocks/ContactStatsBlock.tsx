// Contact Stats — Figma node 230:28185
// Dark background, 2-col: left = heading + subheading + CTA buttons; right = 4-stat grid

import Link from 'next/link'

interface StatItem  { value: string; label: string }
interface CtaItem   { label: string; url: string; primary: boolean }

interface ContactStatsData {
  heading:    string
  subheading: string
  cta:        CtaItem[]
  items:      StatItem[]
}

const FONT = 'var(--font-work-sans, "Work Sans", sans-serif)'

function WhatsAppIcon() {
  return (
    <svg width="21" height="24" viewBox="0 0 21 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path fillRule="evenodd" clipRule="evenodd" d="M10.5 0C4.701 0 0 4.701 0 10.5c0 2.116.55 4.104 1.514 5.83L0 24l7.91-1.485A10.457 10.457 0 0010.5 23C16.299 23 21 18.299 21 12.5S16.299 0 10.5 0zM7.31 6.257c-.214-.492-.44-.503-.643-.512-.167-.009-.357-.009-.548-.009-.19 0-.5.071-.762.357-.262.286-1.001.977-1.001 2.382s1.025 2.763 1.168 2.954c.143.19 1.978 3.143 4.88 4.286.681.262 1.213.417 1.628.536.685.19 1.31.163 1.804.099.55-.072 1.692-.692 1.93-1.359.238-.667.238-1.239.167-1.358-.071-.12-.262-.19-.548-.334-.286-.143-1.692-.834-1.954-.929-.262-.095-.453-.143-.643.143-.19.286-.738.929-.905 1.12-.166.19-.333.214-.619.071-.286-.143-1.207-.445-2.3-1.407-.85-.75-1.423-1.677-1.59-1.963-.166-.286-.017-.44.126-.583.127-.127.286-.334.429-.5.143-.167.19-.286.286-.477.095-.19.048-.357-.024-.5-.071-.142-.638-1.548-.881-2.118z" fill="#10c000"/>
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M1 8H13M7 2L13 8L7 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function ContactStatsBlock({ data }: { data: ContactStatsData }) {
  const { heading, subheading, cta, items } = data

  return (
    <section style={{ background: '#000000', padding: '112px 0' }}>
      <div className="mx-auto px-6 md:px-[80px]" style={{ maxWidth: '1280px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '64px', alignItems: 'center' }}>

          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 style={{
              fontFamily: FONT,
              fontSize: 'clamp(2rem, 4vw, 48px)',
              fontWeight: 400,
              color: '#ffffff',
              lineHeight: 1,
              margin: 0,
            }}>
              {heading}
            </h2>
            <p style={{
              fontFamily: FONT,
              fontSize: '20px',
              color: '#d4d4d4',
              lineHeight: '32.5px',
              margin: 0,
              maxWidth: '576px',
            }}>
              {subheading}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', paddingTop: '8px' }}>
              {cta.map((btn) =>
                btn.primary ? (
                  <Link
                    key={btn.label}
                    href={btn.url}
                    className="transition-opacity duration-200 hover:opacity-80"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: '#ffffff',
                      color: '#10c000',
                      fontFamily: FONT,
                      fontSize: '18px',
                      lineHeight: '28px',
                      padding: '20px 48px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <WhatsAppIcon />
                    {btn.label}
                  </Link>
                ) : (
                  <Link
                    key={btn.label}
                    href={btn.url}
                    className="transition-opacity duration-200 hover:opacity-80"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'transparent',
                      border: '1px solid #ffffff',
                      color: '#ffffff',
                      fontFamily: FONT,
                      fontSize: '16px',
                      lineHeight: '24px',
                      padding: '17px 33px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {btn.label}
                    <ArrowRightIcon />
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Right: stats grid */}
          {items.length > 0 && (
            <div className="grid grid-cols-2" style={{ gap: '24px' }}>
              {items.map((stat) => (
                <div key={stat.label} style={{
                  background: 'rgba(255,255,255,0.1)',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}>
                  <span style={{ fontFamily: FONT, fontSize: '48px', fontWeight: 400, color: '#ffffff', lineHeight: '48px' }}>
                    {stat.value}
                  </span>
                  <span style={{ fontFamily: FONT, fontSize: '16px', color: '#d4d4d4', lineHeight: '24px' }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  )
}

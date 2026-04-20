// Contact Hero — Figma node 1:30273
// White background, badge + large heading + subheading + 3 contact cards

// ─── Figma asset URLs ─────────────────────────────────────────────────────────
const EMAIL_ICON = 'https://www.figma.com/api/mcp/asset/650d07e2-0c8b-4dc5-98a4-9a64c07afcd2'
const PHONE_ICON = 'https://www.figma.com/api/mcp/asset/5fcd84c1-5b8d-42d8-b845-18d1b7b7926f'
const FIND_ICON  = 'https://www.figma.com/api/mcp/asset/c8d24172-9858-4582-8cbc-ef66ab565499'

// ─── Types ────────────────────────────────────────────────────────────────────
interface ContactCard {
  iconSrc:     string
  title:       string
  description: string
  value:       string
}

interface ContactHeroData {
  badge:      string
  heading:    string
  subheading: string
  cards:      ContactCard[]
}

// ─── ContactHeroBlock ─────────────────────────────────────────────────────────
export default function ContactHeroBlock({ data }: { data: ContactHeroData }) {
  const { badge, heading, subheading } = data

  const contactCards = [
    {
      iconSrc:     EMAIL_ICON,
      title:       'Email Us',
      description: "Send us an email and we'll get back to you within 24 hours.",
      value:       'info@atechsolution.com',
    },
    {
      iconSrc:     PHONE_ICON,
      title:       'Call Us',
      description: 'Available Monday to Friday, 9AM - 6PM EST.',
      value:       '+1 (234) 567-890',
    },
    {
      iconSrc:     FIND_ICON,
      title:       'Find Us',
      description: 'Follow our social media to keep in touch with our latest update',
      value:       '',
    },
  ]

  return (
    <section className="px-6 md:px-10 py-24" style={{ background: '#ffffff' }}>
      <div className="mx-auto flex flex-col items-center text-center gap-6" style={{ maxWidth: '896px' }}>
        {/* Badge */}
        <span
          className="text-xs font-normal tracking-[0.6px] uppercase"
          style={{ color: '#525252', fontFamily: 'var(--font-work-sans, sans-serif)' }}
        >
          {badge}
        </span>

        {/* Heading */}
        <h1
          style={{
            fontFamily:    'var(--font-work-sans, sans-serif)',
            fontSize:      'clamp(2.5rem, 5vw, 3.75rem)',
            fontWeight:    400,
            color:         '#171717',
            letterSpacing: '-1.2px',
            lineHeight:    1,
          }}
        >
          {heading}
        </h1>

        {/* Subheading */}
        <p
          className="max-w-2xl"
          style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', color: '#525252', lineHeight: '1.625' }}
        >
          {subheading}
        </p>

        {/* Contact cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
          {contactCards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col items-center gap-3 p-8 rounded-xl"
              style={{ background: '#f5f5f5' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={card.iconSrc} alt={card.title} className="object-contain" style={{ width: '40px', height: '40px' }} />
              <h3 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', fontWeight: 400, color: '#171717' }}>
                {card.title}
              </h3>
              <p className="text-center" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#737373', lineHeight: '1.6' }}>
                {card.description}
              </p>
              {card.value && (
                <span style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#171717', fontWeight: 500 }}>
                  {card.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

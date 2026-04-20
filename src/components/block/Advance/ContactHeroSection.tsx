// Contact Hero Section — white background, badge + heading + subheading + 3 contact cards

interface ContactCard {
  cardIconSrc?:  string
  cardTitle?:    string
  cardDesc?:     string
  cardValue?:    string
}

interface ContactHeroData {
  badge?:        string
  heading?:      string
  subheading?:   string
  contactCards?: ContactCard[]
}

export default function ContactHeroSection({ data }: { data: ContactHeroData }) {
  const { badge, heading, subheading, contactCards = [] } = data

  return (
    <section className="px-6 md:px-10 py-24" style={{ background: '#ffffff' }}>
      <div className="mx-auto flex flex-col items-center text-center gap-6" style={{ maxWidth: '896px' }}>
        {badge && (
          <span className="text-xs font-normal tracking-[0.6px] uppercase" style={{ color: '#525252', fontFamily: 'var(--font-work-sans, sans-serif)' }}>
            {badge}
          </span>
        )}

        {heading && (
          <h1
            style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', fontWeight: 400, color: '#171717', letterSpacing: '-1.2px', lineHeight: 1 }}
          >
            {heading}
          </h1>
        )}

        {subheading && (
          <p className="max-w-2xl" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', color: '#525252', lineHeight: '1.625' }}>
            {subheading}
          </p>
        )}

        {contactCards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
            {contactCards.map((card, i) => (
              <div key={i} className="flex flex-col items-center gap-3 p-8 rounded-xl" style={{ background: '#f5f5f5' }}>
                {card.cardIconSrc && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={card.cardIconSrc} alt={card.cardTitle ?? ''} className="object-contain" style={{ width: '40px', height: '40px' }} />
                )}
                {card.cardTitle && (
                  <h3 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', fontWeight: 400, color: '#171717' }}>
                    {card.cardTitle}
                  </h3>
                )}
                {card.cardDesc && (
                  <p className="text-center" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#737373', lineHeight: '1.6' }}>
                    {card.cardDesc}
                  </p>
                )}
                {card.cardValue && (
                  <span style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#171717', fontWeight: 500 }}>
                    {card.cardValue}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

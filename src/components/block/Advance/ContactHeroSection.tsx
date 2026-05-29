// Contact Hero Section — Figma 230:28133 (white hero) + 230:28145 (gold info cards)

const FONT = 'var(--font-work-sans, "Work Sans", sans-serif)'

interface ContactCardSocialIcon {
  socialIconSrc?: string
  socialIcon?:    { url: string } | null
  socialIconUrl?: string
}

interface ContactCard {
  cardIconSrc?:     string
  cardIcon?:        { url: string; alt?: string } | null
  cardTitle?:       string
  cardDesc?:        string
  cardValue?:       string
  cardSocialIcons?: ContactCardSocialIcon[]
}

interface ContactHeroData {
  badge?:        string
  badgeIconUrl?: string
  badgeIcon?:    { url: string } | null
  heading?:      string
  subheading?:   string
  contactCards?: ContactCard[]
}

export default function ContactHeroSection({ data }: { data: ContactHeroData }) {
  const { badge, heading, subheading, contactCards = [] } = data
  const badgeIconUrl = data.badgeIcon?.url ?? data.badgeIconUrl

  return (
    <>
      {/* ── White hero ───────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--section-bg, #ffffff)', padding: '128px 0' }}>
        <div
          className="mx-auto px-6 md:px-[80px]"
          style={{ maxWidth: '1280px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '896px' }}>

            {/* Badge */}
            {badge && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(0,0,0,0.25)', padding: '8px 16px', width: 'fit-content',
              }}>
                {badgeIconUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={badgeIconUrl} alt="" style={{ width: 14, height: 14, objectFit: 'contain', flexShrink: 0 }} />
                )}
                <span style={{
                  fontFamily: FONT, fontSize: '14px', fontWeight: 400,
                  color: '#000000', letterSpacing: '0.35px', lineHeight: '20px',
                  textTransform: 'uppercase',
                }}>
                  {badge}
                </span>
              </div>
            )}

            {/* Heading */}
            {heading && (
              <h1 style={{
                fontFamily: FONT,
                fontSize: 'clamp(2.5rem, 5.625vw, 72px)',
                fontWeight: 400,
                color: '#000000',
                lineHeight: 1,
                margin: 0,
              }}>
                {heading}
              </h1>
            )}

            {/* Subheading */}
            {subheading && (
              <p style={{
                fontFamily: FONT, fontSize: '20px', fontWeight: 400,
                color: '#000000', lineHeight: '32.5px',
                maxWidth: '672px', margin: 0,
              }}>
                {subheading}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Gold info cards ──────────────────────────────────────────────── */}
      {contactCards.length > 0 && (
        <section style={{ background: 'var(--section-bg, #ffd369)', padding: '112px 0' }}>
          <div
            className="mx-auto px-6 md:px-[80px]"
            style={{ maxWidth: '1280px' }}
          >
            <div
              className="grid grid-cols-1 md:grid-cols-3"
              style={{ gap: '48px' }}
            >
              {contactCards.map((card, i) => {
                const iconUrl = card.cardIcon?.url ?? card.cardIconSrc
                return (
                  <div
                    key={i}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e5e5e5',
                      padding: '41px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    {/* Icon square */}
                    {iconUrl && (
                      <div style={{
                        width: 64, height: 64,
                        background: '#000000',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={iconUrl}
                          alt=""
                          style={{ width: 24, height: 24, objectFit: 'contain' }}
                        />
                      </div>
                    )}

                    {/* Title */}
                    {card.cardTitle && (
                      <h3 style={{
                        fontFamily: FONT, fontSize: '24px', fontWeight: 400,
                        color: '#000000', lineHeight: '32px',
                        margin: 0, paddingTop: '8px',
                      }}>
                        {card.cardTitle}
                      </h3>
                    )}

                    {/* Description */}
                    {card.cardDesc && (
                      <p style={{
                        fontFamily: FONT, fontSize: '16px', fontWeight: 400,
                        color: '#525252', lineHeight: '26px', margin: 0,
                      }}>
                        {card.cardDesc}
                      </p>
                    )}

                    {/* Value */}
                    {card.cardValue && (
                      <span style={{
                        fontFamily: FONT, fontSize: '18px', fontWeight: 400,
                        color: '#000000', lineHeight: '28px',
                        paddingTop: '8px', display: 'block',
                      }}>
                        {card.cardValue}
                      </span>
                    )}

                    {/* Social Icons */}
                    {card.cardSocialIcons && card.cardSocialIcons.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', paddingTop: '8px' }}>
                        {card.cardSocialIcons.map((si, j) => {
                          const siUrl = si.socialIcon?.url ?? si.socialIconSrc
                          if (!siUrl) return null
                          const img = (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={siUrl}
                              alt=""
                              style={{ width: 35, height: 35, objectFit: 'contain', display: 'block', flexShrink: 0 }}
                            />
                          )
                          return si.socialIconUrl ? (
                            <a key={j} href={si.socialIconUrl} target="_blank" rel="noopener noreferrer"
                              style={{ display: 'block', flexShrink: 0 }}>
                              {img}
                            </a>
                          ) : (
                            <span key={j} style={{ display: 'block', flexShrink: 0 }}>{img}</span>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

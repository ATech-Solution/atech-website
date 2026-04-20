// Hero Centered Section — Layout Builder (Advance)
// White bg, centered badge + large heading + subheading + optional video

function toEmbedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  const vm = url.match(/vimeo\.com\/(\d+)/)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`
  if (url.includes('/embed/') || url.includes('player.vimeo')) return url
  return null
}

interface HeroCenteredSectionProps {
  data: {
    badge?: string
    badgeIcon?: { url: string; alt?: string } | null
    aboutHeroHeading?: string
    aboutHeroSubheading?: string
    aboutHeroVideoUrl?: string
  }
}

export default function HeroCenteredSection({ data }: HeroCenteredSectionProps) {
  const { badge, badgeIcon, aboutHeroHeading, aboutHeroSubheading, aboutHeroVideoUrl } = data

  const embedUrl = aboutHeroVideoUrl ? toEmbedUrl(aboutHeroVideoUrl) : null

  return (
    <section className="px-6 md:px-10 pt-24 pb-12" style={{ background: '#ffffff' }}>
      <div className="mx-auto flex flex-col items-center text-center gap-6" style={{ maxWidth: '896px' }}>
        {(badge || badgeIcon) && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full self-center" style={{ background: '#f5f5f5', border: '1px solid #e5e5e5' }}>
            {badgeIcon?.url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={badgeIcon.url} alt={badgeIcon.alt ?? ''} className="object-contain flex-shrink-0" style={{ width: '9px', height: '12px' }} />
            )}
            {badge && (
              <span className="text-xs font-normal tracking-[0.6px] uppercase" style={{ color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}>
                {badge}
              </span>
            )}
          </div>
        )}

        {aboutHeroHeading && (
          <h1 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', fontWeight: 400, color: '#000000', letterSpacing: '-1.2px', lineHeight: 1 }}>
            {aboutHeroHeading}
          </h1>
        )}

        {aboutHeroSubheading && (
          <p className="max-w-2xl" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.25rem', color: '#525252', lineHeight: '28px' }}>
            {aboutHeroSubheading}
          </p>
        )}

        {embedUrl ? (
          <div className="w-full mt-4 rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <iframe src={embedUrl} title="Company Overview Video" allowFullScreen style={{ width: '100%', height: '100%', border: 'none' }} />
          </div>
        ) : (
          <div className="w-full mt-4 flex items-center justify-center rounded-xl" style={{ background: '#e5e5e5', height: '264px' }}>
            <span style={{ color: '#737373', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem' }}>
              Company Overview Video
            </span>
          </div>
        )}
      </div>
    </section>
  )
}

// Hero Centered Section — Layout Builder (Advance)
// White bg, centered badge + large heading + subheading + full-width video or image

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
    aboutHeroMediaType?: 'video' | 'image'
    aboutHeroImage?: { url: string; alt?: string } | null
  }
}

export default function HeroCenteredSection({ data }: HeroCenteredSectionProps) {
  const { badge, badgeIcon, aboutHeroHeading, aboutHeroSubheading, aboutHeroVideoUrl, aboutHeroMediaType, aboutHeroImage } = data

  const mediaType = aboutHeroMediaType ?? 'video'
  const embedUrl = mediaType === 'video' && aboutHeroVideoUrl ? toEmbedUrl(aboutHeroVideoUrl) : null
  const showImage = mediaType === 'image' && aboutHeroImage?.url

  return (
    <section style={{ background: 'var(--section-bg, #ffffff)', padding: '80px 0' }}>
      {/* Outer container — full 1280px, centers everything */}
      <div
        className="mx-auto flex flex-col items-center gap-6 px-8"
        style={{ maxWidth: '1280px', width: '100%' }}
      >
        {/* Badge */}
        {(badge || badgeIcon) && (
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full self-center"
            style={{ background: '#f5f5f5', border: '1px solid #e5e5e5' }}
          >
            {badgeIcon?.url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={badgeIcon.url}
                alt={badgeIcon.alt ?? ''}
                className="object-contain flex-shrink-0"
                style={{ width: '9px', height: '12px' }}
              />
            )}
            {badge && (
              <span
                className="text-xs font-normal tracking-[0.6px] uppercase"
                style={{ color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}
              >
                {badge}
              </span>
            )}
          </div>
        )}

        {/* Heading — visually centered, no width cap needed */}
        {aboutHeroHeading && (
          <h1
            className="text-center w-full"
            style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
              fontWeight: 400,
              color: '#000000',
              letterSpacing: '-1.2px',
              lineHeight: 1,
            }}
          >
            {aboutHeroHeading}
          </h1>
        )}

        {/* Subheading — capped at 896px to match Figma */}
        {aboutHeroSubheading && (
          <p
            className="text-center"
            style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize: '1.25rem',
              color: '#525252',
              lineHeight: '28px',
              maxWidth: '896px',
              width: '100%',
            }}
          >
            {aboutHeroSubheading}
          </p>
        )}

        {/* Media — full container width (1280px) with rounded corners */}
        {showImage ? (
          <div className="w-full overflow-hidden" style={{ borderRadius: '12px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={aboutHeroImage!.url}
              alt={aboutHeroImage!.alt ?? ''}
              style={{ width: '100%', height: '264px', display: 'block', objectFit: 'cover' }}
            />
          </div>
        ) : embedUrl ? (
          <div
            className="w-full overflow-hidden"
            style={{ borderRadius: '12px', aspectRatio: '16/9' }}
          >
            <iframe
              src={embedUrl}
              title="Company Overview Video"
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            />
          </div>
        ) : (
          <div
            className="w-full flex items-center justify-center"
            style={{ background: '#e5e5e5', height: '264px', borderRadius: '12px' }}
          >
            <span
              style={{
                color: '#737373',
                fontFamily: 'var(--font-work-sans, sans-serif)',
                fontSize: '1.125rem',
              }}
            >
              {mediaType === 'image' ? 'Hero Image' : 'Company Overview Video'}
            </span>
          </div>
        )}
      </div>
    </section>
  )
}

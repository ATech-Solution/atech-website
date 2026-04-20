// Article Featured Section — 2-col: image left + content right

import Link from 'next/link'

const ARROW_ICON = 'https://www.figma.com/api/mcp/asset/45a54d06-5558-4992-9e87-c9de50d83829'

interface ArticleFeaturedData {
  sectionLabel?:  string
  featCategory?:  string
  featDate?:      string
  featReadTime?:  string
  featViews?:     string
  featTitle?:     string
  featDesc?:      string
  featCtaLabel?:  string
  featCtaUrl?:    string
}

export default function ArticleFeaturedSection({ data }: { data: ArticleFeaturedData }) {
  const { sectionLabel, featCategory, featDate, featReadTime, featViews, featTitle, featDesc, featCtaLabel, featCtaUrl } = data

  return (
    <section className="py-16 px-6 md:px-10" style={{ background: '#ffffff' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>
        {sectionLabel && (
          <div className="flex items-center gap-3 mb-8">
            <div style={{ width: '4px', height: '32px', background: '#171717' }} />
            <span className="text-xs font-normal tracking-[0.7px] uppercase" style={{ color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}>
              {sectionLabel}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image placeholder */}
          <div
            className="w-full flex items-center justify-center rounded-xl"
            style={{ aspectRatio: '4/3', background: '#404040', minHeight: '320px' }}
          >
            <span style={{ color: '#a3a3a3', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem' }}>
              Featured Article Image
            </span>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              {featCategory && (
                <span
                  className="px-3 py-1 text-xs"
                  style={{ background: '#f5f5f5', border: '1px solid #e5e5e5', color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)', borderRadius: 0 }}
                >
                  {featCategory}
                </span>
              )}
              {featDate && (
                <span style={{ color: '#737373', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.75rem' }}>
                  {featDate}
                </span>
              )}
            </div>

            {featTitle && (
              <h2
                style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 400, color: '#171717', letterSpacing: '-0.5px', lineHeight: '1.2' }}
              >
                {featTitle}
              </h2>
            )}

            {featDesc && (
              <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem', color: '#525252', lineHeight: '1.75' }}>
                {featDesc}
              </p>
            )}

            {(featReadTime || featViews) && (
              <div className="flex items-center gap-4">
                {featReadTime && (
                  <span style={{ color: '#737373', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.75rem' }}>
                    {featReadTime}
                  </span>
                )}
                {featReadTime && featViews && <span style={{ color: '#d4d4d4' }}>·</span>}
                {featViews && (
                  <span style={{ color: '#737373', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.75rem' }}>
                    {featViews}
                  </span>
                )}
              </div>
            )}

            {featCtaLabel && featCtaUrl && (
              <Link
                href={featCtaUrl}
                className="inline-flex items-center gap-2 mt-2 transition-opacity duration-200 hover:opacity-70"
                style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#171717', fontWeight: 500 }}
              >
                {featCtaLabel}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ARROW_ICON} alt="" className="object-contain" style={{ width: '10.5px', height: '12px' }} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

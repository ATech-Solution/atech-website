// Article Grid Section — heading + subheading + 3×N article cards

import Link from 'next/link'

const ARROW_ICON = 'https://www.figma.com/api/mcp/asset/45a54d06-5558-4992-9e87-c9de50d83829'

interface ArticleItem {
  articleCategory?: string
  articleDate?:     string
  articleTitle?:    string
  articleDesc?:     string
  articleCta?:      string
  articleUrl?:      string
}

interface ArticleGridData {
  heading?:        string
  subheading?:     string
  sectionLabel?:   string
  articleItems?:   ArticleItem[]
}

function ArticleCard({ item }: { item: ArticleItem }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl" style={{ background: '#ffffff', border: '1px solid #e5e5e5' }}>
      <div className="w-full flex items-center justify-center" style={{ height: '220px', background: '#d4d4d4' }}>
        <span style={{ color: '#737373', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem' }}>
          {item.articleTitle}
        </span>
      </div>
      <div className="flex flex-col p-6 gap-3">
        <div className="flex items-center gap-3">
          {item.articleCategory && (
            <span
              className="px-3 py-1 text-xs"
              style={{ background: '#f5f5f5', border: '1px solid #e5e5e5', color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)', borderRadius: 0 }}
            >
              {item.articleCategory}
            </span>
          )}
          {item.articleDate && (
            <span style={{ color: '#737373', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.75rem' }}>
              {item.articleDate}
            </span>
          )}
        </div>
        {item.articleTitle && (
          <h3 style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1.125rem', fontWeight: 400, color: '#171717', lineHeight: '1.4' }}>
            {item.articleTitle}
          </h3>
        )}
        {item.articleDesc && (
          <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#525252', lineHeight: '1.6' }}>
            {item.articleDesc}
          </p>
        )}
        {item.articleCta && item.articleUrl && (
          <Link
            href={item.articleUrl}
            className="inline-flex items-center gap-2 mt-2 transition-opacity duration-200 hover:opacity-70"
            style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#171717' }}
          >
            {item.articleCta}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ARROW_ICON} alt="" className="object-contain" style={{ width: '10.5px', height: '12px' }} />
          </Link>
        )}
      </div>
    </div>
  )
}

export default function ArticleGridSection({ data }: { data: ArticleGridData }) {
  const { heading, subheading, sectionLabel, articleItems = [] } = data

  return (
    <section id="articles" className="py-24 px-6 md:px-10" style={{ background: '#ffffff' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>
        {sectionLabel && (
          <div className="flex items-center gap-3 mb-8">
            <div style={{ width: '4px', height: '32px', background: '#171717' }} />
            <span className="text-xs font-normal tracking-[0.7px] uppercase" style={{ color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}>
              {sectionLabel}
            </span>
          </div>
        )}
        {(heading || subheading) && (
          <div className="mb-16 text-center">
            {heading && (
              <h2
                className="mb-4"
                style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 400, color: '#171717', letterSpacing: '-0.5px', lineHeight: '40px' }}
              >
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem', color: '#525252', lineHeight: '24px' }}>
                {subheading}
              </p>
            )}
          </div>
        )}
        {articleItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articleItems.map((item, i) => (
              <ArticleCard key={i} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

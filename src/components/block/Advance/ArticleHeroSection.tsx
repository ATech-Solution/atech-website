// Article Hero Section — Layout Builder variant (Advance)
// Used by: article-hero block type
// Left-aligned hero with large heading + body text, wide right whitespace column

export interface ArticleHeroData {
  heading?:  string
  body?:     string
  heroBg?:   'white' | 'dark'
}

export default function ArticleHeroSection({ data }: { data: ArticleHeroData }) {
  const isDark      = data.heroBg === 'dark'
  const bg          = isDark ? '#171717' : '#ffffff'
  const headingColor = isDark ? '#ffffff' : '#171717'
  const bodyColor    = isDark ? '#a3a3a3' : '#525252'

  return (
    <section
      style={{ background: bg }}
      className="px-6 md:px-10 lg:pl-[112px] lg:pr-[200px] xl:pr-[480px] py-24"
    >
      <div
        className="flex flex-col gap-6 w-full"
        style={{ maxWidth: '768px' }}
      >
        {data.heading && (
          <h1
            style={{
              fontFamily:    'var(--font-work-sans, sans-serif)',
              fontSize:      'clamp(2.5rem, 5vw, 3.75rem)',
              fontWeight:    400,
              color:         headingColor,
              lineHeight:    1,
              letterSpacing: '-0.5px',
              margin:        0,
            }}
          >
            {data.heading}
          </h1>
        )}

        {data.body && (
          <p
            style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize:   '20px',
              fontWeight: 400,
              color:      bodyColor,
              lineHeight: '32.5px',
              margin:     0,
            }}
          >
            {data.body}
          </p>
        )}
      </div>
    </section>
  )
}

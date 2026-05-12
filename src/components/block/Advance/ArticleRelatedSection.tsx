import Link from 'next/link'

interface RelatedPost {
  id?:           string
  slug?:         string
  title?:        string
  excerpt?:      string
  featuredImage?: { url?: string; alt?: string } | null
  publishedAt?:  string
  categories?:   Array<{ id?: string; title?: string; name?: string }>
}

interface ArticleRelatedData {
  heading?: string
}

interface ArticleRelatedProps {
  data:         ArticleRelatedData
  articleItem?: any
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  } catch {
    return dateStr
  }
}

async function fetchRelatedByCategory(articleItem: any): Promise<RelatedPost[]> {
  const cats: any[] = Array.isArray(articleItem?.categories) ? articleItem.categories : []
  const catIds      = cats.map((c: any) => c?.id).filter(Boolean)
  if (!catIds.length) return []

  try {
    const base = process.env.PAYLOAD_PUBLIC_SERVER_URL ?? process.env.NEXT_PUBLIC_DOMAIN ?? 'http://localhost:3000'
    const url  = new URL('/api/posts', base)
    url.searchParams.set('where[status][equals]', 'published')
    url.searchParams.set('where[categories][in]', catIds.join(','))
    if (articleItem?.id) {
      url.searchParams.set('where[id][not_equals]', String(articleItem.id))
    }
    url.searchParams.set('sort',  '-publishedAt')
    url.searchParams.set('limit', '3')
    url.searchParams.set('depth', '1')

    const res  = await fetch(url.toString(), { next: { revalidate: 60 } })
    const json = await res.json()

    return (json.docs ?? []).map((post: any): RelatedPost => ({
      id:           post.id,
      slug:         post.slug,
      title:        post.title,
      excerpt:      post.excerpt,
      publishedAt:  post.publishedAt,
      featuredImage: post.featuredImage?.url
        ? { url: post.featuredImage.url, alt: post.featuredImage.alt ?? post.title ?? '' }
        : null,
      categories: post.categories ?? [],
    }))
  } catch {
    return []
  }
}

export default async function ArticleRelatedSection({ data, articleItem }: ArticleRelatedProps) {
  const heading = data.heading ?? 'Related Articles'
  const related = await fetchRelatedByCategory(articleItem)

  if (related.length === 0) return null

  return (
    <div
      style={{
        background: '#ffffff',
        borderTop:  '1px solid #e5e5e5',
        padding:    '80px 104px',
      }}
    >
      {/* Section heading */}
      <h2
        style={{
          fontFamily: 'var(--font-work-sans, sans-serif)',
          fontSize:   '30px',
          fontWeight: 400,
          color:      '#171717',
          lineHeight: '36px',
          margin:     '0 0 48px',
        }}
      >
        {heading}
      </h2>

      {/* 3-col grid */}
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap:                 '32px',
        }}
      >
        {related.map((post, i) => {
          const postUrl  = post.slug ? `/article/${post.slug}` : '#'
          const category = post.categories?.[0]?.title ?? post.categories?.[0]?.name ?? ''
          const imgUrl   = post.featuredImage?.url
          const imgAlt   = post.featuredImage?.alt ?? post.title ?? ''

          return (
            <div
              key={post.id ?? i}
              style={{
                border:        '1px solid #e5e5e5',
                display:       'flex',
                flexDirection: 'column',
              }}
            >
              {/* Image */}
              <div
                style={{
                  aspectRatio: '16 / 10',
                  overflow:    'hidden',
                  background:  '#f5f5f5',
                }}
              >
                {imgUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={imgUrl}
                    alt={imgAlt}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                )}
              </div>

              {/* Card body */}
              <div
                style={{
                  padding:       '24px',
                  display:       'flex',
                  flexDirection: 'column',
                  gap:           '12px',
                  flex:          1,
                }}
              >
                {/* Category + date */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {category && (
                    <span
                      style={{
                        background:  '#f5f5f5',
                        border:      '1px solid #e5e5e5',
                        padding:     '4px 12px',
                        fontSize:    '12px',
                        color:       '#525252',
                        fontFamily:  'var(--font-work-sans, sans-serif)',
                      }}
                    >
                      {category}
                    </span>
                  )}
                  {post.publishedAt && (
                    <span
                      style={{
                        fontSize:   '12px',
                        color:      '#737373',
                        fontFamily: 'var(--font-work-sans, sans-serif)',
                      }}
                    >
                      {formatDate(post.publishedAt)}
                    </span>
                  )}
                </div>

                {/* Title */}
                {post.title && (
                  <h3
                    style={{
                      fontFamily: 'var(--font-work-sans, sans-serif)',
                      fontSize:   '18px',
                      fontWeight: 400,
                      color:      '#171717',
                      lineHeight: '26px',
                      margin:     0,
                    }}
                  >
                    {post.title}
                  </h3>
                )}

                {/* Excerpt */}
                {post.excerpt && (
                  <p
                    style={{
                      fontFamily:      'var(--font-work-sans, sans-serif)',
                      fontSize:        '14px',
                      color:           '#525252',
                      lineHeight:      '22px',
                      margin:          0,
                      flex:            1,
                      overflow:        'hidden',
                      display:         '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    } as React.CSSProperties}
                  >
                    {post.excerpt}
                  </p>
                )}

                {/* Read More link */}
                <Link
                  href={postUrl}
                  style={{
                    display:        'flex',
                    alignItems:     'center',
                    gap:            '8px',
                    color:          '#171717',
                    fontFamily:     'var(--font-work-sans, sans-serif)',
                    fontSize:       '14px',
                    textDecoration: 'none',
                    marginTop:      'auto',
                  }}
                >
                  <span>Read More</span>
                  <span style={{ fontSize: '16px' }}>→</span>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

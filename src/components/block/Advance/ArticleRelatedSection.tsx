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
  // getPostItem fetches with depth:2, so categories are populated objects {id, slug, name}
  const cats: any[] = Array.isArray(articleItem?.categories) ? articleItem.categories : []

  // Collect slugs — fall back to name-derived slug if slug field is absent
  const catSlugs = cats
    .map((c: any) => c?.slug ?? c?.name?.toLowerCase().replace(/\s+/g, '-'))
    .filter(Boolean) as string[]

  if (!catSlugs.length) return []

  try {
    const base      = process.env.PAYLOAD_PUBLIC_SERVER_URL ?? process.env.NEXT_PUBLIC_DOMAIN ?? 'http://localhost:3000'
    const currentId = articleItem?.id ? String(articleItem.id) : ''

    // Build one request per category slug then merge, dedup, and cap at 3.
    // Using where[categories.slug][equals] — the same pattern used throughout the codebase.
    const requests = catSlugs.map(async (slug) => {
      const url = new URL('/api/posts', base)
      url.searchParams.set('where[status][equals]',          'published')
      url.searchParams.set('where[categories.slug][equals]', slug)
      if (currentId) url.searchParams.set('where[id][not_equals]', currentId)
      url.searchParams.set('sort',  '-publishedAt')
      url.searchParams.set('limit', '6')
      url.searchParams.set('depth', '1')
      const res  = await fetch(url.toString(), { next: { revalidate: 60 } })
      const json = await res.json()
      return json.docs ?? []
    })

    const results = await Promise.all(requests)

    // Flatten, deduplicate by id, exclude current article, take first 3
    const seen = new Set<string>()
    const merged: RelatedPost[] = []
    for (const docs of results) {
      for (const post of docs) {
        if (!post?.id || seen.has(post.id) || post.id === currentId) continue
        seen.add(post.id)
        merged.push({
          id:           post.id,
          slug:         post.slug,
          title:        post.title,
          excerpt:      post.excerpt,
          publishedAt:  post.publishedAt,
          featuredImage: post.featuredImage?.url
            ? { url: post.featuredImage.url, alt: post.featuredImage.alt ?? post.title ?? '' }
            : null,
          categories: post.categories ?? [],
        })
        if (merged.length === 3) return merged
      }
    }
    return merged
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
        background: 'var(--section-bg, #ffffff)',
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

      {/* 3-col grid — responsive via Tailwind */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '32px' }}>
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
                        background:    '#f5f5f5',
                        padding:       '4px 10px',
                        fontSize:      '12px',
                        fontWeight:    400,
                        color:         '#171717',
                        fontFamily:    'var(--font-work-sans, sans-serif)',
                        letterSpacing: '0.6px',
                        textTransform: 'uppercase',
                        lineHeight:    '16px',
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

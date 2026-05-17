// Article Featured Section — 2-col: image left + content right
// Supports two content modes: 'collection' (auto-fetch a post by slug) and 'manual' (static fields)

import Link from 'next/link'

const ARROW_ICON = 'https://www.figma.com/api/mcp/asset/45a54d06-5558-4992-9e87-c9de50d83829'

interface MediaRef { url?: string; alt?: string }

interface FeaturedPost {
  title?:         string
  excerpt?:       string
  slug?:          string
  publishedAt?:   string
  featuredImage?: MediaRef | null
  categories?:    Array<{ title?: string; name?: string }>
}

export interface ArticleFeaturedData {
  sectionLabel?:      string
  featContentSource?: 'collection' | 'manual'
  featPostSlug?:      string
  featCategory?:      string
  featDate?:          string
  featReadTime?:      string
  featViews?:         string
  featTitle?:         string
  featDesc?:          string
  featCtaLabel?:      string
  featCtaUrl?:        string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso))
  } catch {
    return iso
  }
}

async function fetchFeaturedPost(slug: string): Promise<FeaturedPost | null> {
  try {
    const base = process.env.PAYLOAD_PUBLIC_SERVER_URL ?? process.env.NEXT_PUBLIC_DOMAIN ?? 'http://localhost:3000'
    const url  = new URL('/api/posts', base)
    url.searchParams.set('where[slug][equals]', slug)
    url.searchParams.set('where[status][equals]', 'published')
    url.searchParams.set('limit', '1')
    url.searchParams.set('depth', '1')
    const res  = await fetch(url.toString(), { next: { revalidate: 60 } })
    const json = await res.json()
    return json.docs?.[0] ?? null
  } catch {
    return null
  }
}

// ── Shared layout (works for both sync and async renders) ─────────────────────

function FeaturedArticleLayout({ data, post }: { data: ArticleFeaturedData; post?: FeaturedPost | null }) {
  // Post data takes priority over manual CMS fields
  const category = post?.categories?.[0]?.title ?? post?.categories?.[0]?.name ?? data.featCategory ?? ''
  const date     = post?.publishedAt ? formatDate(post.publishedAt) : (data.featDate ?? '')
  const title    = post?.title    ?? data.featTitle   ?? ''
  const desc     = post?.excerpt  ?? data.featDesc    ?? ''
  const ctaLabel = data.featCtaLabel ?? 'Read More'
  const ctaUrl   = post?.slug ? `/article/${post.slug}` : (data.featCtaUrl ?? '#')
  const image    = post?.featuredImage ?? null
  const readTime = data.featReadTime ?? ''
  const views    = data.featViews    ?? ''

  return (
    <section className="py-16 px-6 md:px-10" style={{ background: '#ffffff' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>
        {data.sectionLabel && (
          <div className="flex items-center gap-3 mb-8">
            <div style={{ width: '4px', height: '32px', background: '#171717' }} />
            <span
              className="text-xs font-normal tracking-[0.7px] uppercase"
              style={{ color: '#171717', fontFamily: 'var(--font-work-sans, sans-serif)' }}
            >
              {data.sectionLabel}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div
            className="w-full rounded-xl overflow-hidden flex items-center justify-center"
            style={{ aspectRatio: '4/3', background: '#d4d4d4', minHeight: '320px' }}
          >
            {image?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image.url}
                alt={image.alt ?? title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span style={{ color: '#a3a3a3', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem' }}>
                Featured Article Image
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              {category && (
                <span
                  className="px-3 py-1 text-xs"
                  style={{
                    background: '#f5f5f5',
                    border:     '1px solid #e5e5e5',
                    color:      '#171717',
                    fontFamily: 'var(--font-work-sans, sans-serif)',
                    borderRadius: 0,
                  }}
                >
                  {category}
                </span>
              )}
              {date && (
                <span style={{ color: '#737373', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.75rem' }}>
                  {date}
                </span>
              )}
            </div>

            {title && (
              <h2
                style={{
                  fontFamily:    'var(--font-work-sans, sans-serif)',
                  fontSize:      'clamp(1.5rem, 2.5vw, 2rem)',
                  fontWeight:    400,
                  color:         '#171717',
                  letterSpacing: '-0.5px',
                  lineHeight:    '1.2',
                }}
              >
                {title}
              </h2>
            )}

            {desc && (
              <p style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '1rem', color: '#525252', lineHeight: '1.75' }}>
                {desc}
              </p>
            )}

            {(readTime || views) && (
              <div className="flex items-center gap-4">
                {readTime && (
                  <span style={{ color: '#737373', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.75rem' }}>
                    {readTime}
                  </span>
                )}
                {readTime && views && <span style={{ color: '#d4d4d4' }}>·</span>}
                {views && (
                  <span style={{ color: '#737373', fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.75rem' }}>
                    {views}
                  </span>
                )}
              </div>
            )}

            {ctaLabel && ctaUrl && (
              <Link
                href={ctaUrl}
                className="inline-flex items-center gap-2 mt-2 transition-opacity duration-200 hover:opacity-70"
                style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '0.875rem', color: '#171717', fontWeight: 500 }}
              >
                {ctaLabel}
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

// ── Default export: sync (manual mode / Layout Builder preview) ───────────────

export default function ArticleFeaturedSection({ data }: { data: ArticleFeaturedData }) {
  return <FeaturedArticleLayout data={data} />
}

// ── Server export: async — fetches post from collection when source='collection' ─

export async function ArticleFeaturedServerSection({ data }: { data: ArticleFeaturedData }) {
  try {
    let post: FeaturedPost | null = null
    if ((data.featContentSource ?? 'manual') === 'collection' && data.featPostSlug) {
      post = await fetchFeaturedPost(data.featPostSlug)
    }
    return <FeaturedArticleLayout data={data} post={post} />
  } catch {
    return <FeaturedArticleLayout data={data} />
  }
}

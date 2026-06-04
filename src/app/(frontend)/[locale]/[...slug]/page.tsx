// Page Template : Dynamic (catch-all — handles /slug and /parent/slug)

import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPage, getBlockTemplates } from '@/lib/payload'
import { collectBlockIds, LayoutBlockRenderer } from '@/lib/layout-renderer'
import { buildJsonLd } from '@/plugins/seo/jsonld'

export const revalidate = 60

// ─────────────────────────────────────────────────────────────────────────────
// Metadata
// ─────────────────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[]; locale: string }>
}): Promise<Metadata> {
  const { slug: segments, locale } = await params
  const pageSlug = segments.join('/')
  const page = await getPage(pageSlug, locale)
  if (!page) return {}

  const meta = (page as any).meta ?? {}
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://atech.software'
  const canonicalUrl = meta.canonical || `${siteUrl}/${segments.join('/')}`
  const ogImageUrl = meta.image?.url ?? null

  const jsonLd = buildJsonLd({
    doc: page as any,
    collectionSlug: 'pages',
    siteUrl,
    siteName: 'ATech',
  })

  return {
    title: meta.title ?? (page as any).title,
    description: meta.description ?? undefined,
    robots: meta.noIndex ? { index: false, follow: false } : undefined,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: meta.ogTitle || meta.title || (page as any).title,
      description: meta.ogDescription || meta.description || undefined,
      url: canonicalUrl,
      type: 'website',
      ...(ogImageUrl && { images: [{ url: ogImageUrl }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.ogTitle || meta.title || (page as any).title,
      description: meta.ogDescription || meta.description || undefined,
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
    other: {
      'application/ld+json': JSON.stringify(jsonLd),
    },
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Block renderers
// ─────────────────────────────────────────────────────────────────────────────

function HeroBlock({ block }: { block: any }) {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-text">
          {block.heading && <h1>{block.heading}</h1>}
          {block.subheading && <p>{block.subheading}</p>}
          {block.ctaLabel && block.ctaUrl && (
            <a href={block.ctaUrl} className="btn">
              {block.ctaLabel}
            </a>
          )}
        </div>
        {block.image?.url && (
          <div className="hero-image">
            <Image
              src={block.image.url}
              alt={block.image.alt ?? block.heading ?? 'Hero image'}
              width={block.image.width ?? 600}
              height={block.image.height ?? 400}
              style={{ width: '100%', height: 'auto' }}
              priority
            />
          </div>
        )}
      </div>
    </section>
  )
}

function RichTextBlock({ block }: { block: any }) {
  return (
    <section className="section">
      <div className="container">
        <div
          className="prose"
          style={{ maxWidth: 720, margin: '0 auto', lineHeight: 1.8 }}
          dangerouslySetInnerHTML={{ __html: lexicalToHtml(block.content) }}
        />
      </div>
    </section>
  )
}

function MediaBlock({ block }: { block: any }) {
  if (!block.media?.url) return null
  return (
    <section className="section">
      <div className="container" style={{ textAlign: 'center' }}>
        <Image
          src={block.media.url}
          alt={block.media.alt ?? block.caption ?? 'Media'}
          width={block.media.width ?? 1200}
          height={block.media.height ?? 675}
          style={{ width: '100%', height: 'auto', borderRadius: 12 }}
        />
        {block.caption && (
          <p style={{ marginTop: 8, fontSize: 14, opacity: 0.6 }}>{block.caption}</p>
        )}
      </div>
    </section>
  )
}

function CtaBlock({ block }: { block: any }) {
  return (
    <section className="section" style={{ background: 'var(--color-surface, #f9fafb)' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: 640 }}>
        {block.heading && <h2>{block.heading}</h2>}
        {block.body && <p style={{ marginTop: 12, marginBottom: 28 }}>{block.body}</p>}
        {block.label && block.url && (
          <a href={block.url} className="btn">
            {block.label}
          </a>
        )}
      </div>
    </section>
  )
}

function CardsGridBlock({ block }: { block: any }) {
  return (
    <section className="section">
      <div className="container">
        {block.heading && <h2 className="section-title">{block.heading}</h2>}
        {block.subheading && <p className="section-lead">{block.subheading}</p>}
        <div className="cards">
          {(block.cards ?? []).map((card: any, i: number) => (
            <div key={i} className="card">
              {card.image?.url && (
                <Image
                  src={card.image.url}
                  alt={card.heading}
                  width={400}
                  height={240}
                  style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8 }}
                />
              )}
              <h3>{card.heading}</h3>
              {card.body && <p>{card.body}</p>}
              {card.label && card.url && (
                <a href={card.url} style={{ marginTop: 8, display: 'inline-block' }}>
                  {card.label} →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialsBlock({ block }: { block: any }) {
  return (
    <section className="section">
      <div className="container">
        {block.heading && <h2 className="section-title">{block.heading}</h2>}
        <div className="cards">
          {(block.items ?? []).map((item: any, i: number) => (
            <div key={i} className="card" style={{ fontStyle: 'italic' }}>
              <p>"{item.quote}"</p>
              <strong style={{ display: 'block', marginTop: 12 }}>
                {item.author}
                {item.role && (
                  <span style={{ fontWeight: 400, opacity: 0.6 }}> · {item.role}</span>
                )}
              </strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StatsBlock({ block }: { block: any }) {
  return (
    <section className="section">
      <div className="container">
        {block.heading && <h2 className="section-title">{block.heading}</h2>}
        <div className="cards" style={{ justifyContent: 'center' }}>
          {(block.items ?? []).map((item: any, i: number) => (
            <div key={i} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{item.number}</div>
              <div style={{ opacity: 0.6, marginTop: 4 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FaqBlock({ block }: { block: any }) {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 720, margin: '0 auto' }}>
        {block.heading && <h2 className="section-title">{block.heading}</h2>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 32 }}>
          {(block.items ?? []).map((item: any, i: number) => (
            <details
              key={i}
              style={{
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 10,
                padding: '16px 20px',
              }}
            >
              <summary style={{ fontWeight: 600, cursor: 'pointer' }}>{item.question}</summary>
              <p style={{ marginTop: 12, opacity: 0.8 }}>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function VideoBlock({ block }: { block: any }) {
  const embedUrl = toEmbedUrl(block.url)
  if (!embedUrl) return null
  return (
    <section className="section">
      <div className="container">
        <div
          style={{
            position: 'relative',
            paddingBottom: '56.25%',
            height: 0,
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <iframe
            src={embedUrl}
            title={block.caption ?? 'Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
          />
        </div>
        {block.caption && (
          <p style={{ marginTop: 8, textAlign: 'center', fontSize: 14, opacity: 0.6 }}>
            {block.caption}
          </p>
        )}
      </div>
    </section>
  )
}

function BannerBlock({ block }: { block: any }) {
  const colors: Record<string, string> = {
    info: '#e0f2fe',
    success: '#dcfce7',
    warning: '#fef9c3',
    error: '#fee2e2',
  }
  return (
    <div
      style={{
        background: colors[block.type ?? 'info'] ?? colors.info,
        padding: '14px 24px',
        textAlign: 'center',
        fontSize: 14,
      }}
    >
      {block.message}
    </div>
  )
}

function CodeBlock({ block }: { block: any }) {
  return (
    <section className="section">
      <div className="container">
        <pre
          style={{
            background: '#1e1e2e',
            color: '#cdd6f4',
            padding: '24px 28px',
            borderRadius: 12,
            overflowX: 'auto',
            fontSize: 14,
            lineHeight: 1.7,
          }}
        >
          <code>{block.code}</code>
        </pre>
        {block.caption && (
          <p style={{ marginTop: 8, fontSize: 13, opacity: 0.5 }}>{block.caption}</p>
        )}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Block dispatcher (original blocks field)
// ─────────────────────────────────────────────────────────────────────────────

function Block({ block }: { block: any }) {
  switch (block.blockType) {
    case 'hero':          return <HeroBlock block={block} />
    case 'richText':      return <RichTextBlock block={block} />
    case 'mediaBlock':    return <MediaBlock block={block} />
    case 'cta':           return <CtaBlock block={block} />
    case 'cardsGrid':     return <CardsGridBlock block={block} />
    case 'testimonials':  return <TestimonialsBlock block={block} />
    case 'stats':         return <StatsBlock block={block} />
    case 'faq':           return <FaqBlock block={block} />
    case 'video':         return <VideoBlock block={block} />
    case 'banner':        return <BannerBlock block={block} />
    case 'code':          return <CodeBlock block={block} />
    default:              return null
  }
}

// Layout Builder renderer is in src/lib/layout-renderer.tsx

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string[]; locale: string }>
}) {
  const { slug: segments, locale } = await params

  // Use the full joined path as the slug so nested pages like services/qa-testing
  // match their DB slug (which includes the parent segment).
  const pageSlug = segments.join('/')
  const page = await getPage(pageSlug, locale)

  if (!page || page.status !== 'published') notFound()

  // For nested paths, verify the breadcrumb URL matches to guard against
  // a page accidentally served at an unrelated parent path.
  if (segments.length > 1) {
    const expectedPath = '/' + segments.join('/')
    const breadcrumbs = (page as any).breadcrumbs as Array<{ url?: string }> | undefined
    const actualPath = breadcrumbs?.at(-1)?.url
    if (actualPath && actualPath !== expectedPath) notFound()
  }

  // Prefer layoutBuilder (new system) — fall back to layout blocks (original)
  const layoutBuilderTree: any[] = Array.isArray((page as any).layoutBuilder)
    ? (page as any).layoutBuilder
    : []

  const legacyBlocks: any[] = (page.layout as any[]) ?? []

  const useLayoutBuilder = layoutBuilderTree.length > 0

  // Pre-fetch all referenced block templates so the renderer can merge them
  const blockIds = collectBlockIds(layoutBuilderTree)
  const templates = await getBlockTemplates(blockIds, locale)

  return (
    <>
      {useLayoutBuilder ? (
        layoutBuilderTree.map((node: any) => (
          <LayoutBlockRenderer key={node.id} node={node} templates={templates} />
        ))
      ) : legacyBlocks.length === 0 ? (
        <section className="section">
          <div className="container">
            <h1>{page.title}</h1>
            <p style={{ opacity: 0.5, marginTop: 8 }}>This page has no content blocks yet.</p>
          </div>
        </section>
      ) : (
        legacyBlocks.map((block, i) => <Block key={i} block={block} />)
      )}
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function toEmbedUrl(url: string): string | null {
  if (!url) return null
  // YouTube
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  // Vimeo
  const vm = url.match(/vimeo\.com\/(\d+)/)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`
  return url
}

function lexicalToHtml(content: any): string {
  if (!content?.root?.children) return ''
  return content.root.children
    .map((node: any) => nodeToHtml(node))
    .join('')
}

function nodeToHtml(node: any): string {
  if (node.type === 'text') {
    let text = escapeHtml(node.text ?? '')
    if (node.format & 1) text = `<strong>${text}</strong>`
    if (node.format & 2) text = `<em>${text}</em>`
    if (node.format & 8) text = `<u>${text}</u>`
    return text
  }
  const children = (node.children ?? []).map(nodeToHtml).join('')
  switch (node.type) {
    case 'paragraph': return `<p>${children}</p>`
    case 'heading':   return `<h${node.tag?.replace('h','')}>${children}</h${node.tag?.replace('h','')}>`
    case 'list':      return node.listType === 'bullet' ? `<ul>${children}</ul>` : `<ol>${children}</ol>`
    case 'listitem':  return `<li>${children}</li>`
    case 'quote':     return `<blockquote>${children}</blockquote>`
    case 'link':      return `<a href="${escapeHtml(node.url ?? '#')}">${children}</a>`
    default:          return children
  }
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function extractLexicalText(content: any): string {
  if (!content?.root?.children) return ''
  const walk = (nodes: any[]): string =>
    nodes.map((n: any) => (n.text ?? '') + walk(n.children ?? [])).join(' ')
  return walk(content.root.children)
}

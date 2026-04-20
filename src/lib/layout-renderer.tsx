/**
 * Shared Layout Builder renderer — used by both the dynamic [slug] page
 * and the homepage (/) when a layoutBuilder tree is present.
 */
import Link from 'next/link'
import {
  HeroSection,
  FeaturesSection,
  ServicesSection,
  TestimonialsSection,
  ContactSection,
  CTABannerSection,
  ProcessStepsSection,
  ExpertiseTilesSection,
  HeroSplitSection,
  CardGridSection,
  HeroCenteredSection,
  CompanyStatsSection,
  MissionVisionSection,
  TeamSection,
  FAQSection,
  PageHeroSection,
  ProjectGridSection,
  ArticleGridSection,
  ArticleFeaturedSection,
  JobsListSection,
  InvolvedHeroSection,
  QuoteFormSection,
  CultureValuesSection,
  CommunityChannelsSection,
  CommunityAmbassadorSection,
  CommunityProgramsSection,
  ContactHeroSection,
  ContactStatsSection,
  LocationsSection,
  WebDevHeroSection,
} from '@/components/block'

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function collectBlockIds(nodes: any[]): string[] {
  return nodes.flatMap((n: any) => [
    ...(n.blockId ? [String(n.blockId)] : []),
    ...collectBlockIds(n.children ?? []),
  ])
}

function toEmbedUrl(url: string): string | null {
  if (!url) return null
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  const vm = url.match(/vimeo\.com\/(\d+)/)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`
  return url
}

// ─── Merge ────────────────────────────────────────────────────────────────────

/**
 * Merge a block template (from Blocks collection) with per-page overrides.
 * Priority: overrides > template > node defaults.
 */
export function mergeLayoutBlock(node: any, templates: Record<string, any>): any {
  const overrides = node.overrides ?? {}
  const template  = node.blockId && !node.detached ? (templates[String(node.blockId)] ?? {}) : {}

  return {
    ...node,
    ...template,
    ...(overrides.content  ?? {}),
    ...(overrides.style    ?? {}),
    ...(overrides.advanced ?? {}),
  }
}

// ─── Inline style builder ────────────────────────────────────────────────────

export function buildInlineStyle(data: any): React.CSSProperties {
  const style: React.CSSProperties = {}
  if (data.backgroundColor) style.backgroundColor = data.backgroundColor
  if (data.paddingTop)    style.paddingTop    = data.paddingTop
  if (data.paddingRight)  style.paddingRight  = data.paddingRight
  if (data.paddingBottom) style.paddingBottom = data.paddingBottom
  if (data.paddingLeft)   style.paddingLeft   = data.paddingLeft
  if (data.marginTop)    style.marginTop    = data.marginTop
  if (data.marginRight)  style.marginRight  = data.marginRight
  if (data.marginBottom) style.marginBottom = data.marginBottom
  if (data.marginLeft)   style.marginLeft   = data.marginLeft
  if (data.width)        style.width        = data.width
  if (data.position)     style.position     = data.position as any
  if (data.zIndex)       style.zIndex       = data.zIndex
  if (data.textAlign)    style.textAlign    = data.textAlign as any
  if (data.fontSize)     style.fontSize     = data.fontSize
  if (data.fontFamily)   style.fontFamily   = data.fontFamily
  if (data.fontWeight)   style.fontWeight   = data.fontWeight as any
  if (data.lineHeight)   style.lineHeight   = data.lineHeight
  if (data.letterSpacing) style.letterSpacing = data.letterSpacing
  if (data.color)        style.color        = data.textColorNormal ?? data.color
  if (data.borderRadius) style.borderRadius = data.borderRadius
  return style
}

// ─── Renderer ────────────────────────────────────────────────────────────────

export function LayoutBlockRenderer({
  node,
  templates,
}: {
  node: any
  templates: Record<string, any>
}): React.ReactNode {
  const data        = mergeLayoutBlock(node, templates)
  const inlineStyle = buildInlineStyle(data)
  const className   = data.cssClassName ?? undefined
  const id          = data.htmlId       ?? undefined

  const hideClasses = [
    data.hideOnMobile  ? 'hide-mobile'  : '',
    data.hideOnTablet  ? 'hide-tablet'  : '',
    data.hideOnDesktop ? 'hide-desktop' : '',
  ].filter(Boolean).join(' ')

  const wrapStyle = { ...inlineStyle }

  switch (node.blockType) {
    case 'container':
      return (
        <div id={id} className={`lb-container ${className ?? ''} ${hideClasses}`} style={wrapStyle}>
          {node.children?.map((child: any) => (
            <LayoutBlockRenderer key={child.id} node={child} templates={templates} />
          ))}
        </div>
      )

    case 'grid': {
      const cols = parseInt(data.columns ?? '3', 10)
      return (
        <div
          id={id}
          className={`lb-grid ${className ?? ''} ${hideClasses}`}
          style={{ ...wrapStyle, display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 24 }}
        >
          {node.children?.map((child: any) => (
            <LayoutBlockRenderer key={child.id} node={child} templates={templates} />
          ))}
        </div>
      )
    }

    case 'heading':
      return (
        <section id={id} className={`lb-heading-block ${className ?? ''} ${hideClasses}`} style={wrapStyle}>
          {data.title    && <h2 style={{ fontSize: data.fontSize, fontWeight: data.fontWeight, color: data.textColorNormal }}>{data.title}</h2>}
          {data.subtitle && <p  style={{ color: data.textColorNormal }}>{data.subtitle}</p>}
          {data.buttonLabel && data.buttonUrl && (
            <a href={data.buttonUrl} style={{ color: data.linkColorNormal }}>{data.buttonLabel}</a>
          )}
        </section>
      )

    case 'text-editor':
      return (
        <div id={id} className={`lb-text ${className ?? ''} ${hideClasses}`} style={wrapStyle}>
          {data.title    && <h3>{data.title}</h3>}
          {data.subtitle && <p>{data.subtitle}</p>}
        </div>
      )

    case 'image':
      return data.image ? (
        <div id={id} className={`lb-image ${className ?? ''} ${hideClasses}`} style={wrapStyle}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={typeof data.image === 'object' ? data.image.url : data.image}
            alt={typeof data.image === 'object' ? (data.image.alt ?? '') : ''}
            style={{ width: '100%', height: 'auto', borderRadius: data.borderRadius }}
          />
        </div>
      ) : null

    case 'video': {
      const embedUrl = toEmbedUrl(data.videoUrl ?? '')
      return embedUrl ? (
        <div id={id} className={`lb-video ${className ?? ''} ${hideClasses}`} style={{ ...wrapStyle, position: 'relative', paddingBottom: '56.25%' }}>
          <iframe
            src={embedUrl}
            title={data.title ?? 'Video'}
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      ) : null
    }

    case 'button':
      return data.buttonLabel ? (
        <div id={id} className={`lb-button-wrapper ${className ?? ''} ${hideClasses}`} style={wrapStyle}>
          <a
            href={data.buttonUrl ?? '#'}
            style={{
              display: 'inline-block',
              padding: '10px 24px',
              background: data.backgroundColor ?? 'var(--color-accent, #ffd369)',
              color: data.textColorNormal ?? '#171717',
              borderRadius: data.borderRadius ?? '6px',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            {data.buttonLabel}
          </a>
        </div>
      ) : null

    case 'divider':
      return (
        <hr
          id={id}
          className={`lb-divider ${className ?? ''} ${hideClasses}`}
          style={{ ...wrapStyle, border: 'none', borderTop: `1px solid ${data.backgroundColor ?? 'var(--color-border, #383838)'}` }}
        />
      )

    case 'spacer':
      return (
        <div
          id={id}
          className={`lb-spacer ${className ?? ''} ${hideClasses}`}
          style={{ height: data.height ?? data.paddingTop ?? '40px' }}
        />
      )

    case 'google-map':
      return data.mapEmbedUrl ? (
        <div id={id} className={`lb-map ${className ?? ''} ${hideClasses}`} style={wrapStyle}>
          <iframe
            src={data.mapEmbedUrl}
            title="Google Map"
            width="100%"
            height="400"
            style={{ border: 'none', borderRadius: data.borderRadius }}
            loading="lazy"
            allowFullScreen
          />
        </div>
      ) : null

    case 'icon':
      return data.iconName ? (
        <div id={id} className={`lb-icon ${className ?? ''} ${hideClasses}`} style={wrapStyle}>
          <span style={{ fontSize: data.fontSize ?? '32px' }}>{data.iconName}</span>
        </div>
      ) : null

    case 'alert':
      return (
        <div
          id={id}
          className={`lb-alert lb-alert--${data.alertType ?? 'info'} ${className ?? ''} ${hideClasses}`}
          style={wrapStyle}
        >
          {data.title    && <strong>{data.title}</strong>}
          {data.subtitle && <p>{data.subtitle}</p>}
        </div>
      )

    case 'html':
      return data.htmlContent ? (
        <div
          id={id}
          className={`lb-html ${className ?? ''} ${hideClasses}`}
          style={wrapStyle}
          dangerouslySetInnerHTML={{ __html: data.htmlContent }}
        />
      ) : null

    // ── icon-box ──────────────────────────────────────────────────────────────
    case 'icon-box':
      return (
        <div
          id={id}
          className={`lb-icon-box ${className ?? ''} ${hideClasses}`}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', ...wrapStyle }}
        >
          {data.iconName && (
            <div style={{ fontSize: '2rem', marginBottom: '16px', width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,211,105,0.10)', border: '1px solid rgba(255,211,105,0.25)', color: 'var(--color-accent,#ffd369)' }}>
              {data.iconName}
            </div>
          )}
          {data.title    && <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', fontFamily: 'var(--font-syne,sans-serif)', color: 'var(--color-text,#fafafa)' }}>{data.title}</h3>}
          {data.subtitle && <p  style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--color-muted,#525252)', fontFamily: 'var(--font-dm-sans,sans-serif)' }}>{data.subtitle}</p>}
          {data.buttonLabel && data.buttonUrl && (
            <Link href={data.buttonUrl} style={{ marginTop: '12px', fontSize: '13px', fontWeight: 600, color: 'var(--color-accent,#ffd369)', textDecoration: 'none' }}>
              {data.buttonLabel} →
            </Link>
          )}
        </div>
      )

    // ── image-box ─────────────────────────────────────────────────────────────
    case 'image-box': {
      const imgSrc = data.image ? (typeof data.image === 'object' ? data.image.url : data.image) : null
      return (
        <div
          id={id}
          className={`lb-image-box ${className ?? ''} ${hideClasses}`}
          style={{ borderRadius: data.borderRadius ?? '16px', overflow: 'hidden', border: '1px solid var(--color-border,#383838)', background: 'var(--color-surface,#2f2f2f)', ...wrapStyle }}
        >
          {imgSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imgSrc} alt={data.title ?? ''} style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
          )}
          <div style={{ padding: '24px' }}>
            {data.title    && <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', fontFamily: 'var(--font-syne,sans-serif)', color: 'var(--color-text,#fafafa)' }}>{data.title}</h3>}
            {data.subtitle && <p  style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-muted,#525252)', fontFamily: 'var(--font-dm-sans,sans-serif)' }}>{data.subtitle}</p>}
            {data.buttonLabel && data.buttonUrl && (
              <Link href={data.buttonUrl} style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--color-accent,#ffd369)', textDecoration: 'none' }}>
                {data.buttonLabel} →
              </Link>
            )}
          </div>
        </div>
      )
    }

    // ── tabs ──────────────────────────────────────────────────────────────────
    case 'tabs': {
      const items = data.items ?? []
      return (
        <section id={id} className={`lb-tabs ${className ?? ''} ${hideClasses}`} style={wrapStyle}>
          {data.title && <h2 style={{ marginBottom: '24px' }}>{data.title}</h2>}
          <div style={{ borderBottom: '1px solid var(--color-border,#383838)', display: 'flex', gap: '0', overflowX: 'auto' }}>
            {items.map((item: any, i: number) => (
              <button
                key={i}
                style={{ padding: '10px 20px', background: i === 0 ? 'var(--color-accent,#ffd369)' : 'transparent', color: i === 0 ? '#171717' : 'var(--color-muted,#525252)', border: 'none', borderBottom: i === 0 ? '2px solid var(--color-accent,#ffd369)' : '2px solid transparent', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-dm-sans,sans-serif)', fontSize: '14px', whiteSpace: 'nowrap' }}
              >
                {item.label}
              </button>
            ))}
          </div>
          {items[0] && (
            <div style={{ padding: '24px 0', color: 'var(--color-muted,#525252)', fontFamily: 'var(--font-dm-sans,sans-serif)', fontSize: '14px', lineHeight: 1.7 }}>
              {items[0].content}
            </div>
          )}
        </section>
      )
    }

    // ── icon-list ─────────────────────────────────────────────────────────────
    case 'icon-list': {
      const items = data.items ?? []
      return (
        <section id={id} className={`lb-icon-list ${className ?? ''} ${hideClasses}`} style={wrapStyle}>
          {data.title && <h2 style={{ marginBottom: '24px' }}>{data.title}</h2>}
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {items.map((item: any, i: number) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {item.icon && (
                  <span style={{ fontSize: '18px', flexShrink: 0, width: '32px', textAlign: 'center' }}>{item.icon}</span>
                )}
                <span style={{ fontSize: '14px', color: 'var(--color-text,#fafafa)', fontFamily: 'var(--font-dm-sans,sans-serif)' }}>{item.label}</span>
              </li>
            ))}
          </ul>
        </section>
      )
    }

    // ── progress-bar ──────────────────────────────────────────────────────────
    case 'progress-bar': {
      const items = data.items ?? []
      return (
        <section id={id} className={`lb-progress ${className ?? ''} ${hideClasses}`} style={wrapStyle}>
          {data.title && <h2 style={{ marginBottom: '24px' }}>{data.title}</h2>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {items.map((item: any, i: number) => {
              const pct = parseInt(item.value ?? '0', 10)
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px', color: 'var(--color-text,#fafafa)', fontFamily: 'var(--font-dm-sans,sans-serif)' }}>
                    <span>{item.label}</span>
                    <span>{pct}%</span>
                  </div>
                  <div style={{ height: '8px', borderRadius: '100px', background: 'var(--color-border,#383838)' }}>
                    <div style={{ height: '100%', borderRadius: '100px', background: 'var(--color-accent,#ffd369)', width: `${Math.min(pct, 100)}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )
    }

    // ── social-icons ──────────────────────────────────────────────────────────
    case 'social-icons': {
      const items = data.items ?? []
      return (
        <div id={id} className={`lb-social ${className ?? ''} ${hideClasses}`} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', ...wrapStyle }}>
          {items.map((item: any, i: number) => (
            <a
              key={i}
              href={item.url ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '10px', background: 'var(--color-surface,#2f2f2f)', border: '1px solid var(--color-border,#383838)', color: 'var(--color-text,#fafafa)', fontSize: '18px', textDecoration: 'none' }}
              title={item.label}
            >
              {item.icon ?? item.label?.charAt(0)}
            </a>
          ))}
        </div>
      )
    }

    // ── image-carousel ────────────────────────────────────────────────────────
    case 'image-carousel': {
      const items = data.items ?? []
      return (
        <div id={id} className={`lb-carousel ${className ?? ''} ${hideClasses}`} style={{ overflowX: 'auto', ...wrapStyle }}>
          {data.title && <h2 style={{ marginBottom: '16px' }}>{data.title}</h2>}
          <div style={{ display: 'flex', gap: '16px', paddingBottom: '8px' }}>
            {items.map((item: any, i: number) => {
              const src = item.image ? (typeof item.image === 'object' ? item.image.url : item.image) : null
              return src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt={item.label ?? ''} style={{ height: '200px', width: 'auto', borderRadius: '10px', flexShrink: 0, objectFit: 'cover' }} />
              ) : null
            })}
          </div>
        </div>
      )
    }

    // ── basic-gallery ─────────────────────────────────────────────────────────
    case 'basic-gallery': {
      const items = data.items ?? []
      return (
        <div id={id} className={`lb-gallery ${className ?? ''} ${hideClasses}`} style={wrapStyle}>
          {data.title && <h2 style={{ marginBottom: '16px' }}>{data.title}</h2>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
            {items.map((item: any, i: number) => {
              const src = item.image ? (typeof item.image === 'object' ? item.image.url : item.image) : null
              return src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt={item.label ?? ''} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '10px' }} />
              ) : null
            })}
          </div>
        </div>
      )
    }

    // ── hero-section ──────────────────────────────────────────────────────────
    case 'hero-section': {
      const items       = data.items ?? []
      const stats       = items.filter((it: any) => it.value)
      const secondaryCta = items.find((it: any) => it.url && !it.value)
      return (
        <section
          id={id}
          className={`lb-hero-section ${className ?? ''} ${hideClasses}`}
          style={{ position: 'relative', minHeight: '580px', display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'var(--color-bg,#292929)', color: 'var(--color-text,#fafafa)', padding: '80px 40px', ...wrapStyle }}
        >
          {/* Background ambience */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', top: '-128px', left: '-128px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle,var(--color-accent,#ffd369) 0%,transparent 70%)', opacity: 0.08 }} />
            <div style={{ position: 'absolute', inset: 0, opacity: 0.02, backgroundImage: 'radial-gradient(circle,var(--color-accent,#ffd369) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
          </div>
          <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', position: 'relative' }}>
            {/* Badge */}
            {data.htmlContent && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '100px', border: '1px solid rgba(255,211,105,.35)', background: 'rgba(255,211,105,.08)', marginBottom: '28px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent,#ffd369)', boxShadow: '0 0 6px var(--color-accent,#ffd369)', display: 'inline-block' }} />
                <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--color-accent,#ffd369)', fontFamily: 'var(--font-dm-sans,sans-serif)' }}>
                  {data.htmlContent}
                </span>
              </div>
            )}
            {/* Heading */}
            {data.title && (
              <h1 style={{ fontSize: 'clamp(2.2rem,4.5vw,3.5rem)', fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.07, marginBottom: '24px', fontFamily: 'var(--font-syne,sans-serif)' }}>
                {data.title}
              </h1>
            )}
            {/* Body */}
            {data.subtitle && (
              <p style={{ fontSize: '16px', lineHeight: 1.8, maxWidth: '500px', color: 'var(--color-muted,#525252)', marginBottom: '36px', fontFamily: 'var(--font-dm-sans,sans-serif)' }}>
                {data.subtitle}
              </p>
            )}
            {/* CTAs */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: stats.length ? '48px' : '0' }}>
              {data.buttonLabel && data.buttonUrl && (
                <Link href={data.buttonUrl} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 28px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, background: 'var(--color-accent,#ffd369)', color: '#171717', textDecoration: 'none', boxShadow: '0 8px 24px rgba(255,211,105,.3)', fontFamily: 'var(--font-dm-sans,sans-serif)' }}>
                  {data.buttonLabel} →
                </Link>
              )}
              {secondaryCta && (
                <Link href={secondaryCta.url} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 28px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, border: '1px solid var(--color-border,#383838)', background: 'var(--color-surface,#2f2f2f)', color: 'var(--color-text,#fafafa)', textDecoration: 'none', fontFamily: 'var(--font-dm-sans,sans-serif)' }}>
                  {secondaryCta.label}
                </Link>
              )}
            </div>
            {/* Stats */}
            {stats.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'stretch', paddingTop: '28px', borderTop: '1px solid var(--color-border,#383838)' }}>
                {stats.map((stat: any, i: number) => (
                  <div key={i} style={i > 0 ? { flex: 1, paddingLeft: '2rem', marginLeft: '2rem', borderLeft: '1px solid var(--color-border,#383838)' } : { flex: 1 }}>
                    <p style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1, marginBottom: '6px', color: 'var(--color-accent,#ffd369)', fontFamily: 'var(--font-syne,sans-serif)' }}>{stat.value}</p>
                    <p style={{ fontSize: '12px', letterSpacing: '.05em', color: 'var(--color-muted,#525252)', fontFamily: 'var(--font-dm-sans,sans-serif)' }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )
    }

    // ── services-section ──────────────────────────────────────────────────────
    case 'services-section': {
      const services = data.items ?? []
      return (
        <section
          id={id}
          className={`lb-services-section ${className ?? ''} ${hideClasses}`}
          style={{ padding: '96px 40px', borderTop: '1px solid var(--color-border,#383838)', background: 'var(--color-bg,#292929)', color: 'var(--color-text,#fafafa)', ...wrapStyle }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {(data.title || data.subtitle) && (
              <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                {data.title    && <h2 style={{ fontSize: 'clamp(1.75rem,3vw,2.5rem)', fontWeight: 700, letterSpacing: '-.02em', marginBottom: '16px', color: 'var(--color-accent,#ffd369)', fontFamily: 'var(--font-syne,sans-serif)' }}>{data.title}</h2>}
                {data.subtitle && <p  style={{ fontSize: '16px', color: 'var(--color-muted,#525252)', fontFamily: 'var(--font-dm-sans,sans-serif)' }}>{data.subtitle}</p>}
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '20px', marginBottom: '24px' }}>
              {services.map((svc: any, i: number) => (
                svc.url ? (
                  <Link key={i} href={svc.url} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-border,#383838)', background: 'var(--color-surface,#2f2f2f)', textDecoration: 'none', color: 'inherit' }}>
                    {svc.icon && (
                      <div style={{ width: '44px', height: '44px', borderRadius: '10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,211,105,.10)', border: '1px solid rgba(255,211,105,.20)', color: 'var(--color-accent,#ffd369)', fontSize: '18px' }}>
                        {svc.icon}
                      </div>
                    )}
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px', color: 'var(--color-text,#fafafa)', fontFamily: 'var(--font-syne,sans-serif)' }}>{svc.label}</p>
                      <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--color-muted,#525252)', fontFamily: 'var(--font-dm-sans,sans-serif)' }}>{svc.content}</p>
                    </div>
                  </Link>
                ) : (
                  <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-border,#383838)', background: 'var(--color-surface,#2f2f2f)' }}>
                    {svc.icon && (
                      <div style={{ width: '44px', height: '44px', borderRadius: '10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,211,105,.10)', border: '1px solid rgba(255,211,105,.20)', color: 'var(--color-accent,#ffd369)', fontSize: '18px' }}>
                        {svc.icon}
                      </div>
                    )}
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px', color: 'var(--color-text,#fafafa)', fontFamily: 'var(--font-syne,sans-serif)' }}>{svc.label}</p>
                      <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--color-muted,#525252)', fontFamily: 'var(--font-dm-sans,sans-serif)' }}>{svc.content}</p>
                    </div>
                  </div>
                )
              ))}
            </div>
            {/* CTA Banner */}
            {(data.htmlContent || data.buttonLabel) && (
              <div style={{ borderRadius: '16px', padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px', border: '1px solid rgba(255,211,105,.2)', background: 'linear-gradient(135deg,rgba(255,211,105,.06) 0%,rgba(255,179,71,.04) 100%)' }}>
                <div>
                  {data.htmlContent && <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '6px', fontFamily: 'var(--font-syne,sans-serif)' }}>{data.htmlContent}</h3>}
                  {data.subtitle && <p style={{ fontSize: '14px', color: 'var(--color-muted,#525252)', fontFamily: 'var(--font-dm-sans,sans-serif)' }}>Let&apos;s discuss your specific requirements and create a tailored solution.</p>}
                </div>
                {data.buttonLabel && data.buttonUrl && (
                  <Link href={data.buttonUrl} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 28px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, background: 'var(--color-accent,#ffd369)', color: '#171717', textDecoration: 'none', whiteSpace: 'nowrap', fontFamily: 'var(--font-dm-sans,sans-serif)' }}>
                    {data.buttonLabel} →
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>
      )
    }

    // ── testimonials-section ──────────────────────────────────────────────────
    case 'testimonials-section': {
      const items = data.items ?? []
      return (
        <section
          id={id}
          className={`lb-testimonials-section ${className ?? ''} ${hideClasses}`}
          style={{ padding: '96px 40px', background: data.backgroundColor ?? '#ffd369', color: '#171717', ...wrapStyle }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {(data.title || data.subtitle) && (
              <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                {data.title    && <h2 style={{ fontSize: 'clamp(1.75rem,3vw,2.5rem)', fontWeight: 700, letterSpacing: '-.02em', marginBottom: '16px', color: '#171717', fontFamily: 'var(--font-syne,sans-serif)' }}>{data.title}</h2>}
                {data.subtitle && <p  style={{ fontSize: '16px', color: '#525252', fontFamily: 'var(--font-dm-sans,sans-serif)' }}>{data.subtitle}</p>}
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '20px' }}>
              {items.map((item: any, i: number) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', borderRadius: '16px', padding: '32px', background: '#ffffff', border: '1px solid #e5e5e5' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', color: '#f59e0b', fontSize: '16px' }}>★★★★★</div>
                  <p style={{ fontSize: '14px', lineHeight: 1.7, flex: 1, marginBottom: '32px', color: '#525252', fontFamily: 'var(--font-dm-sans,sans-serif)' }}>
                    &ldquo;{item.content}&rdquo;
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, background: 'linear-gradient(135deg,#ffd369,#ffb347)', color: '#171717', flexShrink: 0 }}>
                      {(item.label ?? '?').charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '2px', color: '#171717', fontFamily: 'var(--font-syne,sans-serif)' }}>{item.label}</p>
                      {item.value && <p style={{ fontSize: '12px', color: '#525252', fontFamily: 'var(--font-dm-sans,sans-serif)' }}>{item.value}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )
    }

    // ── contact-section ───────────────────────────────────────────────────────
    case 'contact-section': {
      const items = data.items ?? []
      return (
        <section
          id={id}
          className={`lb-contact-section ${className ?? ''} ${hideClasses}`}
          style={{ padding: '96px 40px', borderTop: '1px solid var(--color-border,#383838)', background: 'var(--color-surface,#2f2f2f)', color: 'var(--color-text,#fafafa)', ...wrapStyle }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {(data.title || data.subtitle) && (
              <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                {data.title    && <h2 style={{ fontSize: 'clamp(1.75rem,3vw,2.5rem)', fontWeight: 700, letterSpacing: '-.02em', marginBottom: '16px', fontFamily: 'var(--font-syne,sans-serif)' }}>{data.title}</h2>}
                {data.subtitle && <p  style={{ fontSize: '16px', color: 'var(--color-muted,#525252)', fontFamily: 'var(--font-dm-sans,sans-serif)' }}>{data.subtitle}</p>}
              </div>
            )}
            {items.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '20px', marginBottom: '40px' }}>
                {items.map((item: any, i: number) => (
                  <div key={i} style={{ padding: '28px', borderRadius: '16px', border: '1px solid var(--color-border,#383838)', background: 'var(--color-bg,#292929)' }}>
                    {item.icon && <div style={{ fontSize: '20px', marginBottom: '12px' }}>{item.icon}</div>}
                    <p style={{ fontSize: '12px', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--color-muted,#525252)', marginBottom: '6px', fontFamily: 'var(--font-dm-sans,sans-serif)' }}>{item.label}</p>
                    {item.url ? (
                      <a href={item.url} style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text,#fafafa)', textDecoration: 'none', fontFamily: 'var(--font-dm-sans,sans-serif)' }}>{item.content}</a>
                    ) : (
                      <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text,#fafafa)', fontFamily: 'var(--font-dm-sans,sans-serif)' }}>{item.content}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
            {data.buttonLabel && data.buttonUrl && (
              <div style={{ textAlign: 'center' }}>
                <Link href={data.buttonUrl} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '16px 36px', borderRadius: '12px', fontSize: '15px', fontWeight: 600, background: 'var(--color-accent,#ffd369)', color: '#171717', textDecoration: 'none', boxShadow: '0 8px 24px rgba(255,211,105,.3)', fontFamily: 'var(--font-dm-sans,sans-serif)' }}>
                  {data.buttonLabel} →
                </Link>
              </div>
            )}
          </div>
        </section>
      )
    }

    case 'testimonial': {
      const items = data.items ?? []
      return (
        <section id={id} className={`lb-testimonials ${className ?? ''} ${hideClasses}`} style={wrapStyle}>
          {data.title && <h2>{data.title}</h2>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {items.map((item: any, i: number) => (
              <blockquote key={i} style={{ borderLeft: '3px solid var(--color-accent, #ffd369)', paddingLeft: 16, margin: 0 }}>
                <p style={{ fontStyle: 'italic' }}>{item.content ?? item.label}</p>
                {item.value && <cite style={{ fontSize: 12, opacity: 0.7 }}>— {item.value}</cite>}
              </blockquote>
            ))}
          </div>
        </section>
      )
    }

    case 'counter': {
      const items = data.items ?? []
      return (
        <section id={id} className={`lb-counter ${className ?? ''} ${hideClasses}`} style={wrapStyle}>
          {data.title && <h2>{data.title}</h2>}
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            {items.map((item: any, i: number) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 40, fontWeight: 700, color: 'var(--color-accent, #ffd369)' }}>{item.value}</div>
                <div style={{ fontSize: 14, opacity: 0.7 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </section>
      )
    }

    case 'accordion': {
      const items = data.items ?? []
      return (
        <section id={id} className={`lb-accordion ${className ?? ''} ${hideClasses}`} style={wrapStyle}>
          {data.title && <h2>{data.title}</h2>}
          {items.map((item: any, i: number) => (
            <details key={i} style={{ borderBottom: '1px solid var(--color-border, #383838)', padding: '12px 0' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600 }}>{item.label}</summary>
              <p style={{ marginTop: 8, opacity: 0.8 }}>{item.content}</p>
            </details>
          ))}
        </section>
      )
    }

    // ── Advance Sections ─────────────────────────────────────────────────────
    case 'hero':
      return <HeroSection data={data} />
    case 'features':
      return <FeaturesSection data={data} />
    case 'services':
      return <ServicesSection data={data} />
    case 'testimonials':
      return <TestimonialsSection data={data} />
    case 'contact':
      return <ContactSection data={data} />
    case 'card-grid':
      return <CardGridSection data={data} />
    case 'cta-banner':
      return <CTABannerSection data={data} />
    case 'hero-split':
      return <HeroSplitSection data={data} />
    case 'process-steps':
      return <ProcessStepsSection data={data} />
    case 'expertise-tiles':
      return <ExpertiseTilesSection data={data} />
    case 'hero-centered':
      return <HeroCenteredSection data={data} />
    case 'company-stats':
      return <CompanyStatsSection data={data} />
    case 'mission-vision':
      return <MissionVisionSection data={data} />
    case 'team-section':
      return <TeamSection data={data} />
    case 'faq-section':
      return <FAQSection data={data} />

    case 'page-hero':
      return <PageHeroSection data={data} />
    case 'project-grid':
      return <ProjectGridSection data={data} />
    case 'article-grid':
      return <ArticleGridSection data={data} />
    case 'article-featured':
      return <ArticleFeaturedSection data={data} />
    case 'jobs-list':
      return <JobsListSection data={data} />
    case 'involved-hero':
      return <InvolvedHeroSection data={data} />
    case 'quote-form':
      return <QuoteFormSection data={data} />
    case 'culture-values':
      return <CultureValuesSection data={data} />
    case 'community-channels':
      return <CommunityChannelsSection data={data} />
    case 'community-ambassador':
      return <CommunityAmbassadorSection data={data} />
    case 'community-programs':
      return <CommunityProgramsSection data={data} />
    case 'contact-hero':
      return <ContactHeroSection data={data} />
    case 'contact-stats':
      return <ContactStatsSection data={data} />
    case 'locations':
      return <LocationsSection data={data} />

    // ── Service Page Sections ────────────────────────────────────────────────
    case 'web-dev-hero':
      return <WebDevHeroSection data={data} />

    default:
      return (
        <div
          id={id}
          className={`lb-block lb-block--${node.blockType} ${className ?? ''} ${hideClasses}`}
          style={wrapStyle}
        >
          {data.title    && <h3>{data.title}</h3>}
          {data.subtitle && <p>{data.subtitle}</p>}
          {node.children?.map((child: any) => (
            <LayoutBlockRenderer key={child.id} node={child} templates={templates} />
          ))}
        </div>
      )
  }
}

'use client'

import React from 'react'
import type { BlockType } from '../types'

// Advance section components
import {
  HeroSection,
  HeroSplitSection,
  HeroCenteredSection,
  FeaturesSection,
  ServicesSection,
  TestimonialsSection,
  ContactSection,
  CardGridSection,
  CTABannerSection,
  ProcessStepsSection,
  ExpertiseTilesSection,
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
  FeaturedCaseStudySection,
  PartnershipSection,
  FAQMainSection,
  BreadcrumbSection,
  FAQAboutSection,
  ArticleSubmitSection,
  ServeHeroSection,
  ServeValueSection,
  ServeModelSection,
  InsightsAdvantagesSection,
  InsightsTechGuideSection,
  CommunityHeroSection,
  ArticleFilterSection,
  ArticleHeroSection,
  ArticleFeatureSection,
  ArticleMainGridSection,
  SubscribeSection,
} from '@/components/block'

// ── CSS custom property injection ─────────────────────────────────────────────
// Maps blockStyle keys (from BlockStyleFields) → CSS custom properties so
// block components can read them via var(--token, fallback).
function buildCSSVarsFromBlockStyle(style: Record<string, unknown>): React.CSSProperties {
  const vars: Record<string, string> = {}
  const str = (v: unknown) => String(v)

  // Background
  if (style.heroBgColor) vars['--color-bg']       = str(style.heroBgColor)
  if (style.sectionBg)   vars['--color-bg']       = str(style.sectionBg)
  if (style.gradientFrom) vars['--gradient-from'] = str(style.gradientFrom)
  if (style.gradientTo)   vars['--gradient-to']   = str(style.gradientTo)
  if (style.heroBgImage || style.sectionBgImage)
    vars['--bg-image'] = `url(${str(style.heroBgImage ?? style.sectionBgImage)})`
  if (style.overlayOpacity != null) vars['--overlay-opacity'] = str(style.overlayOpacity)

  // Heading / typography
  if (style.headingColor)      vars['--color-text']           = str(style.headingColor)
  if (style.headingFontSize)   vars['--heading-font-size']    = str(style.headingFontSize)
  if (style.headingFontWeight) vars['--heading-font-weight']  = str(style.headingFontWeight)
  if (style.headingLineHeight) vars['--heading-line-height']  = str(style.headingLineHeight)
  if (style.headingTextShadow) vars['--heading-text-shadow']  = str(style.headingTextShadow)

  // Body / muted text
  if (style.bodyColor)    vars['--color-muted']    = str(style.bodyColor)
  if (style.bodyFontSize) vars['--body-font-size'] = str(style.bodyFontSize)

  // Label / accent
  if (style.labelColor)    vars['--color-accent']     = str(style.labelColor)
  if (style.labelFontSize) vars['--label-font-size']  = str(style.labelFontSize)
  if (style.iconColor)     vars['--icon-color']       = str(style.iconColor)
  if (style.iconBg)        vars['--icon-bg']          = str(style.iconBg)
  if (style.iconBorderRadius) vars['--icon-radius']   = str(style.iconBorderRadius)

  // Cards / surfaces
  if (style.cardBg)           vars['--color-surface']  = str(style.cardBg)
  if (style.cardBorder)       vars['--color-border']   = str(style.cardBorder)
  if (style.cardBorderRadius) vars['--card-radius']    = str(style.cardBorderRadius)
  if (style.cardHoverBg)      vars['--card-hover-bg']  = str(style.cardHoverBg)

  // CTAs / buttons
  if (style.ctaPrimaryBg)       vars['--cta-primary-bg']       = str(style.ctaPrimaryBg)
  if (style.ctaPrimaryText)     vars['--cta-primary-text']     = str(style.ctaPrimaryText)
  if (style.ctaSecondaryBg)     vars['--cta-secondary-bg']     = str(style.ctaSecondaryBg)
  if (style.ctaSecondaryText)   vars['--cta-secondary-text']   = str(style.ctaSecondaryText)
  if (style.ctaSecondaryBorder) vars['--cta-secondary-border'] = str(style.ctaSecondaryBorder)
  if (style.buttonBg)           vars['--button-bg']            = str(style.buttonBg)
  if (style.buttonText)         vars['--button-text']          = str(style.buttonText)
  if (style.buttonBorderRadius) vars['--button-radius']        = str(style.buttonBorderRadius)
  if (style.buttonHoverBg)      vars['--button-hover-bg']      = str(style.buttonHoverBg)

  // Stats
  if (style.statsBg)        vars['--stats-bg']          = str(style.statsBg)
  if (style.statsBorder)    vars['--stats-border']       = str(style.statsBorder)
  if (style.statValueColor) vars['--stat-value-color']  = str(style.statValueColor)
  if (style.statLabelColor) vars['--stat-label-color']  = str(style.statLabelColor)

  // Badge
  if (style.badgeBg)           vars['--badge-bg']      = str(style.badgeBg)
  if (style.badgeTextColor)    vars['--badge-text']    = str(style.badgeTextColor)
  if (style.badgeBorderRadius) vars['--badge-radius']  = str(style.badgeBorderRadius)

  // Testimonials
  if (style.quoteColor)        vars['--quote-color']       = str(style.quoteColor)
  if (style.quoteFontSize)     vars['--quote-font-size']   = str(style.quoteFontSize)
  if (style.quoteLineHeight)   vars['--quote-line-height'] = str(style.quoteLineHeight)
  if (style.quoteIconColor)    vars['--quote-icon-color']  = str(style.quoteIconColor)
  if (style.authorColor)       vars['--author-color']      = str(style.authorColor)
  if (style.authorRoleColor)   vars['--author-role-color'] = str(style.authorRoleColor)
  if (style.avatarBorderRadius) vars['--avatar-radius']   = str(style.avatarBorderRadius)

  // Contact / primary text
  if (style.primaryTextColor) vars['--primary-text-color'] = str(style.primaryTextColor)

  // Layout
  if (style.sectionMinHeight) vars['--section-min-height'] = str(style.sectionMinHeight)
  if (style.contentMaxWidth)  vars['--content-max-width']  = str(style.contentMaxWidth)
  if (style.sectionPaddingY)  vars['--section-padding-y']  = str(style.sectionPaddingY)
  if (style.paddingX)         vars['--padding-x']          = str(style.paddingX)
  if (style.gridGap)          vars['--grid-gap']           = str(style.gridGap)
  if (style.columns != null)  vars['--grid-columns']       = str(style.columns)

  return vars as React.CSSProperties
}

function withStyle(node: React.ReactNode, blockStyle?: Record<string, unknown>): React.ReactNode {
  if (!blockStyle || Object.keys(blockStyle).length === 0) return node
  const vars = buildCSSVarsFromBlockStyle(blockStyle)
  if (Object.keys(vars).length === 0) return node
  return <div style={vars}>{node}</div>
}

export function resolvePreviewComponent(
  blockType: BlockType,
  data: Record<string, unknown>,
  blockStyle?: Record<string, unknown>,
): React.ReactNode {
  switch (blockType) {
    // ── Advance sections ─────────────────────────────────────────────────────
    case 'hero':
      return withStyle(<HeroSection data={data as any} />, blockStyle)
    case 'hero-split':
      return withStyle(<HeroSplitSection data={data as any} />, blockStyle)
    case 'hero-centered':
      return withStyle(<HeroCenteredSection data={data as any} />, blockStyle)
    case 'features':
      return withStyle(<FeaturesSection data={data as any} />, blockStyle)
    case 'services':
      return withStyle(<ServicesSection data={data as any} />, blockStyle)
    case 'testimonials':
      return withStyle(<TestimonialsSection data={data as any} />, blockStyle)
    case 'contact':
      return withStyle(<ContactSection data={data as any} />, blockStyle)
    case 'card-grid':
      return withStyle(<CardGridSection data={data as any} />, blockStyle)
    case 'cta-banner':
      return withStyle(<CTABannerSection data={data as any} />, blockStyle)
    case 'process-steps':
      return withStyle(<ProcessStepsSection data={data as any} />, blockStyle)
    case 'expertise-tiles':
      return withStyle(<ExpertiseTilesSection data={data as any} />, blockStyle)
    case 'company-stats':
      return withStyle(<CompanyStatsSection data={data as any} />, blockStyle)
    case 'mission-vision':
      return withStyle(<MissionVisionSection data={data as any} />, blockStyle)
    case 'team-section':
      return withStyle(<TeamSection data={data as any} />, blockStyle)
    case 'faq-section':
      return withStyle(<FAQSection data={data as any} />, blockStyle)
    case 'page-hero':
      return withStyle(<PageHeroSection data={data as any} />, blockStyle)
    case 'project-grid':
      return withStyle(<ProjectGridSection data={data as any} />, blockStyle)
    case 'article-grid':
      return withStyle(<ArticleGridSection data={data as any} />, blockStyle)
    case 'article-featured':
      return withStyle(<ArticleFeaturedSection data={data as any} />, blockStyle)
    case 'jobs-list':
      if ((data as any).jobSource === 'collection') {
        return withStyle(
          <div style={{ background: '#171717', padding: '96px 40px', textAlign: 'center', color: '#737373', fontFamily: 'var(--font-work-sans,"Work Sans",sans-serif)', fontSize: '0.875rem' }}>
            Collection mode — live jobs load on the published page
          </div>,
          blockStyle
        )
      }
      return withStyle(<JobsListSection data={data as any} />, blockStyle)
    case 'involved-hero':
      return withStyle(<InvolvedHeroSection data={data as any} />, blockStyle)
    case 'quote-form':
      return withStyle(<QuoteFormSection data={data as any} />, blockStyle)
    case 'culture-values':
      return withStyle(<CultureValuesSection data={data as any} />, blockStyle)
    case 'community-hero':
      return withStyle(<CommunityHeroSection data={data as any} />, blockStyle)
    case 'community-channels':
      return withStyle(<CommunityChannelsSection data={data as any} />, blockStyle)
    case 'community-ambassador':
      return withStyle(<CommunityAmbassadorSection data={data as any} />, blockStyle)
    case 'community-programs':
      return withStyle(<CommunityProgramsSection data={data as any} />, blockStyle)
    case 'contact-hero':
      return withStyle(<ContactHeroSection data={data as any} />, blockStyle)
    case 'contact-stats':
      return withStyle(<ContactStatsSection data={data as any} />, blockStyle)
    case 'locations':
      return withStyle(<LocationsSection data={data as any} />, blockStyle)
    case 'featured-case-study':
      return withStyle(<FeaturedCaseStudySection data={data as any} />, blockStyle)
    case 'partnership':
      return withStyle(<PartnershipSection data={data as any} />, blockStyle)
    case 'faq-main':
      return withStyle(<FAQMainSection data={data as any} />, blockStyle)
    case 'breadcrumb':
      return withStyle(<BreadcrumbSection data={data as any} />, blockStyle)
    case 'faq-about':
      return withStyle(<FAQAboutSection data={data as any} />, blockStyle)
    case 'article-submit':
      return withStyle(<ArticleSubmitSection data={data as any} />, blockStyle)
    case 'serve-hero':
      return withStyle(<ServeHeroSection data={data as any} />, blockStyle)
    case 'serve-value':
      return withStyle(<ServeValueSection data={data as any} />, blockStyle)
    case 'serve-model':
      return withStyle(<ServeModelSection data={data as any} />, blockStyle)
    case 'insights-advantages':
      return withStyle(<InsightsAdvantagesSection data={data as any} />, blockStyle)
    case 'insights-tech-guide':
      return withStyle(<InsightsTechGuideSection data={data as any} />, blockStyle)
    case 'article-filter':
      return withStyle(<ArticleFilterSection data={data as any} />, blockStyle)
    case 'article-hero':
      return withStyle(<ArticleHeroSection data={data as any} />, blockStyle)
    case 'article-feature':
      return withStyle(<ArticleFeatureSection data={data as any} />, blockStyle)
    case 'article-main-grid':
      return withStyle(<ArticleMainGridSection data={data as any} />, blockStyle)
    case 'subscribe':
      return withStyle(<SubscribeSection data={data as any} />, blockStyle)

    // ── Basic blocks — inline previews ────────────────────────────────────────
    case 'heading':
      return (
        <div style={{ padding: '24px 32px', background: '#fff' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 400, color: '#171717', margin: 0, letterSpacing: '-0.5px' }}>
            {String(data.title || 'Heading')}
          </h2>
        </div>
      )

    case 'text-editor':
      return (
        <div style={{ padding: '16px 32px', background: '#fff', color: '#525252', lineHeight: 1.75, fontSize: '1rem' }}>
          {data.htmlContent
            ? <div dangerouslySetInnerHTML={{ __html: String(data.htmlContent) }} />
            : <p style={{ margin: 0 }}>Text block — add your content in Properties.</p>
          }
        </div>
      )

    case 'image':
      return (
        <div style={{ padding: '16px', background: '#fff' }}>
          {(data.image as any)?.url
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={(data.image as any).url} alt={(data.image as any).alt || ''} style={{ maxWidth: '100%', display: 'block', borderRadius: '6px' }} />
            : <div style={{ background: '#f5f5f5', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', borderRadius: '8px', border: '2px dashed #e5e7eb', fontSize: '13px' }}>
                🖼 Image — select in Properties
              </div>
          }
        </div>
      )

    case 'video':
      return (
        <div style={{ padding: '16px', background: '#fff' }}>
          <div style={{ background: '#1a1a2e', borderRadius: '8px', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', fontSize: '32px' }}>
            ▶
          </div>
        </div>
      )

    case 'button':
      return (
        <div style={{ padding: '16px 32px', background: '#fff' }}>
          <button style={{ padding: '10px 24px', background: '#171717', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '14px', cursor: 'default' }}>
            {String(data.buttonLabel || 'Button')}
          </button>
        </div>
      )

    case 'divider':
      return (
        <div style={{ padding: '16px 32px', background: '#fff' }}>
          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: 0 }} />
        </div>
      )

    case 'spacer':
      return (
        <div style={{ height: '64px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#d1d5db' }}>
          SPACER
        </div>
      )

    case 'google-map':
      return (
        <div style={{ padding: '16px', background: '#fff' }}>
          <div style={{ background: '#e8f4fd', height: '200px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', fontSize: '13px' }}>
            📍 Google Map
          </div>
        </div>
      )

    case 'icon':
      return (
        <div style={{ padding: '24px', background: '#fff', textAlign: 'center', fontSize: '32px' }}>
          {String(data.iconName || '⭐')}
        </div>
      )

    // ── General blocks ─────────────────────────────────────────────────────────
    case 'tabs':
      return (
        <div style={{ padding: '16px 32px', background: '#fff' }}>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
            {['Tab 1', 'Tab 2', 'Tab 3'].map((t, i) => (
              <div key={t} style={{ padding: '6px 16px', background: i === 0 ? '#171717' : '#f5f5f5', color: i === 0 ? '#fff' : '#525252', fontSize: '13px', borderRadius: '4px 4px 0 0', cursor: 'default' }}>{t}</div>
            ))}
          </div>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '0 4px 4px 4px', padding: '16px', color: '#9ca3af', fontSize: '13px' }}>Tab content here</div>
        </div>
      )

    case 'accordion':
      return (
        <div style={{ padding: '16px 32px', background: '#fff' }}>
          {['Item 1', 'Item 2', 'Item 3'].map((item) => (
            <div key={item} style={{ borderBottom: '1px solid #e5e7eb', padding: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#171717' }}>
              <span>{item}</span><span style={{ color: '#9ca3af' }}>▼</span>
            </div>
          ))}
        </div>
      )

    case 'icon-box':
      return (
        <div style={{ padding: '24px 32px', background: '#fff', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ width: '40px', height: '40px', background: '#f5f5f5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '18px' }}>⚡</div>
          <div>
            <div style={{ fontWeight: 500, color: '#171717', marginBottom: '4px', fontSize: '15px' }}>{String(data.title || 'Icon Box Title')}</div>
            <div style={{ color: '#525252', fontSize: '13px', lineHeight: 1.5 }}>{String(data.subtitle || 'Description text here')}</div>
          </div>
        </div>
      )

    case 'image-box':
      return (
        <div style={{ padding: '16px 32px', background: '#fff' }}>
          <div style={{ background: '#f5f5f5', height: '120px', borderRadius: '6px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '13px' }}>Image</div>
          <div style={{ fontWeight: 500, color: '#171717', marginBottom: '4px' }}>{String(data.title || 'Image Box')}</div>
          <div style={{ color: '#525252', fontSize: '13px' }}>{String(data.subtitle || 'Description')}</div>
        </div>
      )

    case 'counter':
      return (
        <div style={{ padding: '32px', background: '#fff', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', fontWeight: 300, color: '#171717' }}>{String(data.title || '100')}</div>
          <div style={{ color: '#525252', fontSize: '14px', marginTop: '4px' }}>{String(data.subtitle || 'Counter Label')}</div>
        </div>
      )

    case 'progress-bar':
      return (
        <div style={{ padding: '16px 32px', background: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px', color: '#171717' }}>
            <span>{String(data.title || 'Skill')}</span><span>75%</span>
          </div>
          <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: '75%', height: '100%', background: '#6366f1', borderRadius: '3px' }} />
          </div>
        </div>
      )

    case 'testimonial':
      return (
        <div style={{ padding: '24px 32px', background: '#fff' }}>
          <div style={{ color: '#525252', fontSize: '15px', lineHeight: 1.75, fontStyle: 'italic', marginBottom: '16px' }}>&ldquo;{String(data.subtitle || 'A wonderful testimonial about this product.')}&rdquo;</div>
          <div style={{ fontWeight: 500, color: '#171717', fontSize: '13px' }}>{String(data.title || '— Client Name')}</div>
        </div>
      )

    case 'social-icons':
      return (
        <div style={{ padding: '16px 32px', background: '#fff', display: 'flex', gap: '12px' }}>
          {['f', 'in', '𝕏', '▶'].map((icon) => (
            <div key={icon} style={{ width: '36px', height: '36px', background: '#f5f5f5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#525252', cursor: 'default' }}>{icon}</div>
          ))}
        </div>
      )

    case 'alert':
      return (
        <div style={{ padding: '16px 32px', background: '#fff' }}>
          <div style={{ padding: '12px 16px', background: '#eff6ff', borderLeft: '4px solid #3b82f6', borderRadius: '0 4px 4px 0', color: '#1d4ed8', fontSize: '13px' }}>
            ℹ {String(data.title || 'Alert message content here.')}
          </div>
        </div>
      )

    case 'html':
      return (
        <div style={{ padding: '16px 32px', background: '#fff' }}>
          <div style={{ background: '#1e1e2e', borderRadius: '6px', padding: '12px 16px', color: '#a8b2d8', fontSize: '12px', fontFamily: 'monospace' }}>
            &lt;!-- HTML Block --&gt;
          </div>
        </div>
      )

    case 'icon-list':
      return (
        <div style={{ padding: '16px 32px', background: '#fff' }}>
          {['Item One', 'Item Two', 'Item Three'].map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', fontSize: '13px', color: '#525252' }}>
              <span style={{ color: '#6366f1' }}>✓</span>{item}
            </div>
          ))}
        </div>
      )

    case 'image-carousel':
      return (
        <div style={{ padding: '16px', background: '#fff' }}>
          <div style={{ display: 'flex', gap: '8px', overflow: 'hidden' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ flex: 1, height: '120px', background: '#f5f5f5', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '11px' }}>Slide {i}</div>
            ))}
          </div>
        </div>
      )

    case 'basic-gallery':
      return (
        <div style={{ padding: '16px 32px', background: '#fff' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={{ aspectRatio: '1', background: '#f5f5f5', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '10px' }}>{i}</div>
            ))}
          </div>
        </div>
      )

    case 'container':
      return (
        <div style={{ padding: '12px', background: '#fafafa', border: '1px dashed #e5e7eb', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '12px' }}>
          Container — drag blocks inside
        </div>
      )

    case 'grid':
      return (
        <div style={{ padding: '12px', background: '#fafafa', border: '1px dashed #e5e7eb', minHeight: '80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${String(data.columns || '2')}, 1fr)`, gap: '8px', minHeight: '60px' }}>
            {Array.from({ length: Number(data.columns || 2) }).map((_, i) => (
              <div key={i} style={{ border: '1px dashed #e5e7eb', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '11px', padding: '16px' }}>
                Col {i + 1}
              </div>
            ))}
          </div>
        </div>
      )

    default:
      return (
        <div style={{ padding: '24px', background: '#f9fafb', textAlign: 'center', color: '#9ca3af', fontStyle: 'italic', fontSize: '13px', border: '1px dashed #e5e7eb' }}>
          [{blockType}]
        </div>
      )
  }
}

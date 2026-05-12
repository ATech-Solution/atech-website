'use client'

import React, { useState } from 'react'
import type { BlockType } from './types'
import { BASIC_BLOCK_TYPES, GENERAL_BLOCK_TYPES, ADVANCE_BLOCK_TYPES } from './types'

interface BlockPickerProps {
  onAdd: (blockType: BlockType) => void
}

const BLOCK_ICONS: Record<string, string> = {
  container: '⬜', grid: '▦', heading: 'H', 'text-editor': '¶', image: '🖼',
  video: '▶', button: '⬛', divider: '—', spacer: '↕', 'google-map': '📍', icon: '✦',
  tabs: '⊟', accordion: '☰', 'image-box': '🖼', 'icon-box': '✦', 'image-carousel': '◁▷',
  'basic-gallery': '⊞', 'icon-list': '≡', counter: '#', 'progress-bar': '▰',
  testimonial: '❝', 'social-icons': '⊛', alert: '⚠', html: '</>',
  'hero': '⚡', 'hero-split': '🚀', 'hero-centered': '⭕', 'features': 'ℹ',
  'services': '⚙', 'testimonials': '❝', 'contact': '✉', 'card-grid': '🃏',
  'cta-banner': '📣', 'process-steps': '🔢', 'expertise-tiles': '🏅',
  'company-stats': '📊', 'mission-vision': '🎯', 'team-section': '👥',
  'faq-section': '❓', 'page-hero': '🏠', 'project-grid': '🗂',
  'article-grid': '📰', 'article-featured': '⭐', 'jobs-list': '💼',
  'involved-hero': '🤝', 'quote-form': '📝', 'culture-values': '🌱',
  'community-channels': '📡', 'community-ambassador': '🏆',
  'community-programs': '🎓', 'contact-hero': '📞', 'contact-stats': '📈',
  'locations': '📍',
  'featured-case-study': '🏆',
  'partnership': '🤝',
  'portfolio-detail-top': '📋',
  'portfolio-featured-image': '🖼',
  'portfolio-detail-overview': '📑',
  'article-detail-hero': '📰',
  'article-detail-content': '📄',
  'article-related': '🔗',
}

const BLOCK_LABELS: Record<string, string> = {
  container: 'Container', grid: 'Grid', heading: 'Heading', 'text-editor': 'Text',
  image: 'Image', video: 'Video', button: 'Button', divider: 'Divider', spacer: 'Spacer',
  'google-map': 'Map', icon: 'Icon', tabs: 'Tabs', accordion: 'Accordion',
  'image-box': 'Image Box', 'icon-box': 'Icon Box', 'image-carousel': 'Carousel',
  'basic-gallery': 'Gallery', 'icon-list': 'Icon List', counter: 'Counter',
  'progress-bar': 'Progress', testimonial: 'Testimonial', 'social-icons': 'Social',
  alert: 'Alert', html: 'HTML',
  'hero': 'Hero', 'hero-split': 'Hero — Split', 'hero-centered': 'Hero — Centered',
  'features': 'Features', 'services': 'Services', 'testimonials': 'Testimonials',
  'contact': 'Contact', 'card-grid': 'Card Grid', 'cta-banner': 'CTA Banner',
  'process-steps': 'Process Steps', 'expertise-tiles': 'Expertise Tiles',
  'company-stats': 'Company Stats', 'mission-vision': 'Mission & Vision',
  'team-section': 'Team', 'faq-section': 'FAQ', 'page-hero': 'Page Hero',
  'project-grid': 'Project Grid', 'article-grid': 'Article Grid',
  'article-featured': 'Article Featured', 'jobs-list': 'Jobs List',
  'involved-hero': 'Involved Hero', 'quote-form': 'Quote Form',
  'culture-values': 'Culture Values', 'community-channels': 'Community Channels',
  'community-ambassador': 'Community Ambassador', 'community-programs': 'Community Programs',
  'contact-hero': 'Contact Hero', 'contact-stats': 'Contact Stats', 'locations': 'Locations',
  'featured-case-study': 'Featured Case Study',
  'partnership': 'Partnership',
  'portfolio-detail-top': 'Portfolio — Top',
  'portfolio-featured-image': 'Portfolio — Image',
  'portfolio-detail-overview': 'Portfolio — Overview',
  'article-detail-hero': 'Article — Hero',
  'article-detail-content': 'Article — Content',
  'article-related': 'Article — Related',
}

export function BlockPicker({ onAdd }: BlockPickerProps) {
  const [search, setSearch]         = useState('')
  const [basicOpen,   setBasicOpen]   = useState(true)
  const [generalOpen, setGeneralOpen] = useState(true)
  const [advanceOpen, setAdvanceOpen] = useState(true)

  const q = search.trim().toLowerCase()

  const filtered = (types: readonly string[]) =>
    q ? types.filter((t) => BLOCK_LABELS[t]?.toLowerCase().includes(q)) : types

  const basicFiltered   = filtered(BASIC_BLOCK_TYPES)
  const generalFiltered = filtered(GENERAL_BLOCK_TYPES)
  const advanceFiltered = filtered(ADVANCE_BLOCK_TYPES)
  const hasResults      = basicFiltered.length + generalFiltered.length + advanceFiltered.length > 0

  function renderTiles(types: readonly string[]) {
    if (types.length === 0) return null
    return (
      <div className="lb-picker__grid">
        {types.map((type) => (
          <button
            key={type}
            className="lb-picker__tile"
            onClick={() => onAdd(type as BlockType)}
            title={`Add ${BLOCK_LABELS[type] ?? type}`}
          >
            <span className="lb-picker__tile-icon">{BLOCK_ICONS[type] ?? '⬜'}</span>
            <span className="lb-picker__tile-label">{BLOCK_LABELS[type] ?? type}</span>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="lb-picker">
      {/* Search */}
      <div className="lb-picker__search-wrap">
        <svg className="lb-picker__search-icon" width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="5.5" cy="5.5" r="4" />
          <path d="M9 9l2.5 2.5" strokeLinecap="round" />
        </svg>
        <input
          className="lb-picker__search"
          type="text"
          placeholder="Search blocks…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="lb-picker__search-clear" onClick={() => setSearch('')} title="Clear">✕</button>
        )}
      </div>

      {/* No results */}
      {q && !hasResults && (
        <p className="lb-picker__no-results">No blocks match &ldquo;{search}&rdquo;</p>
      )}

      {/* Sections — shown normally, or all collapsed except matching when searching */}
      {(!q || basicFiltered.length > 0) && (
        <div className="lb-picker__section">
          <button className="lb-picker__section-header" onClick={() => !q && setBasicOpen((v) => !v)}>
            <span>{(q || basicOpen) ? '▾' : '▸'} Basic</span>
            {basicFiltered.length > 0 && q && <span className="lb-picker__section-count">{basicFiltered.length}</span>}
          </button>
          {(q || basicOpen) && renderTiles(basicFiltered)}
        </div>
      )}

      {(!q || generalFiltered.length > 0) && (
        <div className="lb-picker__section">
          <button className="lb-picker__section-header" onClick={() => !q && setGeneralOpen((v) => !v)}>
            <span>{(q || generalOpen) ? '▾' : '▸'} General</span>
            {generalFiltered.length > 0 && q && <span className="lb-picker__section-count">{generalFiltered.length}</span>}
          </button>
          {(q || generalOpen) && renderTiles(generalFiltered)}
        </div>
      )}

      {(!q || advanceFiltered.length > 0) && (
        <div className="lb-picker__section">
          <button className="lb-picker__section-header" onClick={() => !q && setAdvanceOpen((v) => !v)}>
            <span>{(q || advanceOpen) ? '▾' : '▸'} Advance</span>
            {advanceFiltered.length > 0 && q && <span className="lb-picker__section-count">{advanceFiltered.length}</span>}
          </button>
          {(q || advanceOpen) && renderTiles(advanceFiltered)}
        </div>
      )}
    </div>
  )
}

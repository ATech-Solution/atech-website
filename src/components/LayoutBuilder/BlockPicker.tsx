'use client'

import React, { useState } from 'react'
import type { BlockType } from './types'
import { BASIC_BLOCK_TYPES, GENERAL_BLOCK_TYPES, ADVANCE_BLOCK_TYPES } from './types'

interface BlockPickerProps {
  onAdd: (blockType: BlockType) => void
}

const BLOCK_ICONS: Record<string, string> = {
  container:        '⬜',
  grid:             '▦',
  heading:          'H',
  'text-editor':    '¶',
  image:            '🖼',
  video:            '▶',
  button:           '⬛',
  divider:          '—',
  spacer:           '↕',
  'google-map':     '📍',
  icon:             '✦',
  tabs:             '⊟',
  accordion:        '☰',
  'image-box':      '🖼',
  'icon-box':       '✦',
  'image-carousel': '◁▷',
  'basic-gallery':  '⊞',
  'icon-list':      '≡',
  counter:          '#',
  'progress-bar':   '▰',
  testimonial:      '❝',
  'social-icons':   '⊛',
  alert:            '⚠',
  html:             '</>',
  // Advance sections
  'hero':                  '⚡',
  'hero-split':            '🚀',
  'hero-centered':         '⭕',
  'features':              'ℹ',
  'services':              '⚙',
  'testimonials':          '❝',
  'contact':               '✉',
  'card-grid':             '🃏',
  'cta-banner':            '📣',
  'process-steps':         '🔢',
  'expertise-tiles':       '🏅',
  'company-stats':         '📊',
  'mission-vision':        '🎯',
  'team-section':          '👥',
  'faq-section':           '❓',
  'page-hero':             '🏠',
  'project-grid':          '🗂',
  'article-grid':          '📰',
  'article-featured':      '⭐',
  'jobs-list':             '💼',
  'involved-hero':         '🤝',
  'quote-form':            '📝',
  'culture-values':        '🌱',
  'community-channels':    '📡',
  'community-ambassador':  '🏆',
  'community-programs':    '🎓',
  'contact-hero':          '📞',
  'contact-stats':         '📈',
  'locations':             '📍',
}

const BLOCK_LABELS: Record<string, string> = {
  container: 'Container', grid: 'Grid', heading: 'Heading',
  'text-editor': 'Text', image: 'Image', video: 'Video',
  button: 'Button', divider: 'Divider', spacer: 'Spacer',
  'google-map': 'Map', icon: 'Icon',
  tabs: 'Tabs', accordion: 'Accordion', 'image-box': 'Image Box',
  'icon-box': 'Icon Box', 'image-carousel': 'Carousel',
  'basic-gallery': 'Gallery', 'icon-list': 'Icon List',
  counter: 'Counter', 'progress-bar': 'Progress',
  testimonial: 'Testimonial', 'social-icons': 'Social',
  alert: 'Alert', html: 'HTML',
  // Advance sections
  'hero':           'Hero',
  'hero-split':     'Hero — Split',
  'hero-centered':  'Hero — Centered',
  'features':       'Features',
  'services':       'Services',
  'testimonials':   'Testimonials',
  'contact':        'Contact',
  'card-grid':      'Card Grid',
  'cta-banner':     'CTA Banner',
  'process-steps':  'Process Steps',
  'expertise-tiles':'Expertise Tiles',
  'company-stats':  'Company Stats',
  'mission-vision': 'Mission & Vision',
  'team-section':   'Team',
  'faq-section':    'FAQ',
}

export function BlockPicker({ onAdd }: BlockPickerProps) {
  const [basicOpen,   setBasicOpen]   = useState(true)
  const [generalOpen, setGeneralOpen] = useState(true)
  const [advanceOpen, setAdvanceOpen] = useState(true)

  function renderTiles(types: readonly string[]) {
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
      <div className="lb-picker__section">
        <button className="lb-picker__section-header" onClick={() => setBasicOpen((v) => !v)}>
          <span>{basicOpen ? '▾' : '▸'} Basic</span>
        </button>
        {basicOpen && renderTiles(BASIC_BLOCK_TYPES)}
      </div>

      <div className="lb-picker__section">
        <button className="lb-picker__section-header" onClick={() => setGeneralOpen((v) => !v)}>
          <span>{generalOpen ? '▾' : '▸'} General</span>
        </button>
        {generalOpen && renderTiles(GENERAL_BLOCK_TYPES)}
      </div>

      <div className="lb-picker__section">
        <button className="lb-picker__section-header" onClick={() => setAdvanceOpen((v) => !v)}>
          <span>{advanceOpen ? '▾' : '▸'} Advance</span>
        </button>
        {advanceOpen && renderTiles(ADVANCE_BLOCK_TYPES)}
      </div>
    </div>
  )
}

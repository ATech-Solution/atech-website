'use client'

import React, { useEffect, useState } from 'react'
import type { LayoutBlock, BlockOverrides } from './types'
import { ADVANCE_BLOCK_TYPES } from './types'
import { ContentFields } from './fields/ContentFields'
import { StyleFields } from './fields/StyleFields'
import { AdvancedFields } from './fields/AdvancedFields'
import { getBlockStyleFields } from './fields/BlockStyleFields'

interface BlockPropertiesPanelProps {
  block: LayoutBlock
  /** Element-type hint from clicking inside the preview (heading/body/cta/image). */
  focusedField?: string | null
  onBack: () => void
  onOverrideChange: (id: string, overrides: BlockOverrides) => void
  onDetach: (id: string) => void
}

type Tab = 'content' | 'style' | 'advanced'

// Maps the click-detected field hint → which properties tab to open
const FIELD_TAB_MAP: Record<string, Tab> = {
  heading: 'content',
  body:    'content',
  cta:     'content',
  image:   'content',
}

// Label keywords to search for when scrolling to a field
const FIELD_LABEL_MAP: Record<string, string[]> = {
  heading: ['Heading', 'Title', 'Badge'],
  body:    ['Body', 'Description', 'Subtitle'],
  cta:     ['Primary CTA', 'CTA', 'Button Label', 'Label'],
  image:   ['Image', 'Hero Image', 'Icon', 'Background Image'],
}

export function BlockPropertiesPanel({
  block,
  focusedField,
  onBack,
  onOverrideChange,
  onDetach,
}: BlockPropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('content')

  const isAdvanceBlock = (ADVANCE_BLOCK_TYPES as readonly string[]).includes(block.blockType)

  // When a field focus hint arrives, switch to the right tab and scroll to field
  useEffect(() => {
    if (!focusedField) return
    const targetTab = FIELD_TAB_MAP[focusedField] ?? 'content'
    setActiveTab(targetTab)

    // Wait one frame for the tab content to render, then scroll + flash
    requestAnimationFrame(() => {
      const panel = document.querySelector('.lb-properties__body')
      if (!panel) return
      const targetLabels = FIELD_LABEL_MAP[focusedField] ?? []
      const labelEls = Array.from(panel.querySelectorAll('.lb-field__label'))
      for (const lbl of targetLabels) {
        const match = labelEls.find((el) => el.textContent?.includes(lbl))
        if (match) {
          const fieldEl = match.closest('.lb-field') as HTMLElement | null
          if (fieldEl) {
            fieldEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
            fieldEl.classList.add('lb-field--focused')
            setTimeout(() => fieldEl.classList.remove('lb-field--focused'), 1200)
            return
          }
        }
      }
    })
  }, [focusedField])

  const handleContentChange = (content: BlockOverrides['content']) =>
    onOverrideChange(block.id, { ...block.overrides, content })

  const handleStyleChange = (style: BlockOverrides['style']) =>
    onOverrideChange(block.id, { ...block.overrides, style })

  const handleBlockStyleChange = (blockStyle: Record<string, unknown>) =>
    onOverrideChange(block.id, { ...block.overrides, blockStyle })

  const handleAdvancedChange = (advanced: BlockOverrides['advanced']) =>
    onOverrideChange(block.id, { ...block.overrides, advanced })

  return (
    <div className="lb-properties">
      {/* Back button */}
      <button className="lb-properties__back" onClick={onBack}>
        ← Back to Blocks
      </button>

      {/* Block name + type */}
      <div className="lb-properties__header">
        <span className="lb-properties__block-name">{block.name}</span>
        <span className="lb-properties__block-type">[{block.blockType}]</span>
      </div>

      {/* Tabs */}
      <div className="lb-properties__tabs">
        {(['content', 'style', 'advanced'] as Tab[]).map((tab) => (
          <button
            key={tab}
            className={`lb-properties__tab ${activeTab === tab ? 'lb-properties__tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="lb-properties__body">
        {activeTab === 'content' && (
          <ContentFields
            blockType={block.blockType}
            overrides={block.overrides?.content}
            onChange={handleContentChange}
          />
        )}
        {activeTab === 'style' && (
          isAdvanceBlock
            ? getBlockStyleFields(
                block.blockType,
                block.overrides?.blockStyle ?? {},
                handleBlockStyleChange,
              )
            : <StyleFields
                overrides={block.overrides?.style}
                onChange={handleStyleChange}
              />
        )}
        {activeTab === 'advanced' && (
          <AdvancedFields
            overrides={block.overrides?.advanced}
            onChange={handleAdvancedChange}
          />
        )}
      </div>

      {/* Template info */}
      {block.blockId && !block.detached && (
        <div className="lb-properties__template-info">
          <span className="lb-properties__template-label">
            ⓘ Template: from Blocks library
          </span>
          <button
            className="lb-properties__detach-btn"
            onClick={() => onDetach(block.id)}
            title="Detach from template — this block becomes fully independent"
          >
            Detach from template
          </button>
        </div>
      )}
      {block.detached && (
        <div className="lb-properties__template-info lb-properties__template-info--detached">
          <span className="lb-properties__template-label">
            ✓ Detached — fully independent copy
          </span>
        </div>
      )}
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import type { LayoutBlock, BlockOverrides } from './types'
import { ContentFields } from './fields/ContentFields'
import { StyleFields } from './fields/StyleFields'
import { AdvancedFields } from './fields/AdvancedFields'

interface BlockPropertiesPanelProps {
  block: LayoutBlock
  onBack: () => void
  onOverrideChange: (id: string, overrides: BlockOverrides) => void
  onDetach: (id: string) => void
}

type Tab = 'content' | 'style' | 'advanced'

export function BlockPropertiesPanel({
  block,
  onBack,
  onOverrideChange,
  onDetach,
}: BlockPropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('content')

  const handleContentChange = (content: BlockOverrides['content']) =>
    onOverrideChange(block.id, { ...block.overrides, content })

  const handleStyleChange = (style: BlockOverrides['style']) =>
    onOverrideChange(block.id, { ...block.overrides, style })

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
          <StyleFields
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

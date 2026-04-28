'use client'

import React from 'react'
import type { LayoutBlock, LayoutTree, BlockOverrides } from './types'
import { getDefaultOverrides } from './utils/defaultOverrides'
import { resolvePreviewComponent } from './utils/previewResolver'

interface LayoutPreviewProps {
  tree: LayoutTree
  selectedId: string | null
  viewMode?: 'desktop' | 'tablet' | 'mobile'
  onSelect: (id: string) => void
  onAddRoot: () => void
  onAddAfter: (afterId: string) => void
  onDelete: (id: string) => void
  onInlineEdit: (blockId: string, field: string, value: string) => void
}

/** Build CSS overrides from style + advanced fields, applying responsive visibility. */
function buildStyleCSS(
  style?: BlockOverrides['style'],
  advanced?: BlockOverrides['advanced'],
  viewMode?: 'desktop' | 'tablet' | 'mobile',
): React.CSSProperties {
  const css: React.CSSProperties = {}
  if (!style && !advanced) return css
  if (style?.backgroundColor) css.backgroundColor = style.backgroundColor
  if (style?.textColorNormal) css.color = style.textColorNormal
  if (style?.fontFamily)      css.fontFamily = style.fontFamily
  if (style?.fontSize)        css.fontSize = style.fontSize
  if (style?.fontWeight)      css.fontWeight = style.fontWeight as React.CSSProperties['fontWeight']
  if (style?.lineHeight)      css.lineHeight = style.lineHeight
  if (style?.letterSpacing)   css.letterSpacing = style.letterSpacing
  if (style?.borderRadius)    css.borderRadius = style.borderRadius
  if (advanced?.paddingTop)    css.paddingTop    = advanced.paddingTop
  if (advanced?.paddingRight)  css.paddingRight  = advanced.paddingRight
  if (advanced?.paddingBottom) css.paddingBottom = advanced.paddingBottom
  if (advanced?.paddingLeft)   css.paddingLeft   = advanced.paddingLeft
  if (advanced?.marginTop)     css.marginTop     = advanced.marginTop
  if (advanced?.marginRight)   css.marginRight   = advanced.marginRight
  if (advanced?.marginBottom)  css.marginBottom  = advanced.marginBottom
  if (advanced?.marginLeft)    css.marginLeft    = advanced.marginLeft
  if (advanced?.width)         css.width         = advanced.width
  if (advanced?.position)      css.position      = advanced.position as React.CSSProperties['position']
  if (advanced?.zIndex != null) css.zIndex       = advanced.zIndex
  // Responsive visibility — hide block in preview for its target viewport
  const adv = advanced as Record<string, unknown> | undefined
  if (viewMode === 'desktop' && adv?.hideOnDesktop) css.display = 'none'
  if (viewMode === 'tablet'  && adv?.hideOnTablet)  css.display = 'none'
  if (viewMode === 'mobile'  && adv?.hideOnMobile)  css.display = 'none'
  return css
}

/** Inline text block — editable heading or text when block is selected */
function InlineTextBlock({
  block,
  onInlineEdit,
}: {
  block: LayoutBlock
  onInlineEdit: (blockId: string, field: string, value: string) => void
}) {
  const content = block.overrides?.content ?? {}
  const defaults = getDefaultOverrides(block.blockType).content ?? {}

  if (block.blockType === 'heading') {
    const text = (content as any).title ?? (defaults as any).title ?? 'Heading'
    return (
      <div style={{ padding: '20px 32px', background: '#fff' }}>
        <h2
          contentEditable
          suppressContentEditableWarning
          style={{ fontSize: '2rem', fontWeight: 400, color: '#171717', margin: 0, letterSpacing: '-0.5px', outline: 'none', cursor: 'text' }}
          onBlur={(e) => onInlineEdit(block.id, 'title', e.currentTarget.textContent ?? '')}
        >
          {text}
        </h2>
      </div>
    )
  }

  if (block.blockType === 'text-editor') {
    const text = (content as any).htmlContent ?? (defaults as any).htmlContent ?? 'Text block'
    return (
      <div style={{ padding: '16px 32px', background: '#fff', color: '#525252', lineHeight: 1.75, fontSize: '1rem' }}>
        <p
          contentEditable
          suppressContentEditableWarning
          style={{ margin: 0, outline: 'none', cursor: 'text' }}
          onBlur={(e) => onInlineEdit(block.id, 'htmlContent', e.currentTarget.textContent ?? '')}
        >
          {text}
        </p>
      </div>
    )
  }

  if (block.blockType === 'button') {
    const label = (content as any).buttonLabel ?? (defaults as any).buttonLabel ?? 'Button'
    return (
      <div style={{ padding: '16px 32px', background: '#fff' }}>
        <button
          contentEditable
          suppressContentEditableWarning
          style={{ padding: '10px 24px', background: '#171717', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '14px', cursor: 'text', outline: '2px solid #6366f1' }}
          onBlur={(e) => onInlineEdit(block.id, 'buttonLabel', e.currentTarget.textContent ?? '')}
        >
          {label}
        </button>
      </div>
    )
  }

  return null
}

const INLINE_EDITABLE_TYPES = new Set(['heading', 'text-editor', 'button'])

function BlockPreviewWrapper({
  block,
  selectedId,
  viewMode,
  onSelect,
  onAddAfter,
  onDelete,
  onInlineEdit,
}: {
  block: LayoutBlock
  selectedId: string | null
  viewMode?: 'desktop' | 'tablet' | 'mobile'
  onSelect: (id: string) => void
  onAddAfter: (afterId: string) => void
  onDelete: (id: string) => void
  onInlineEdit: (blockId: string, field: string, value: string) => void
}) {
  const isSelected    = block.id === selectedId
  const isInlineType  = INLINE_EDITABLE_TYPES.has(block.blockType)
  const isLayoutBlock = block.blockType === 'container' || block.blockType === 'grid'

  const defaults = getDefaultOverrides(block.blockType).content ?? {}
  const data: Record<string, unknown> = { ...defaults, ...(block.overrides?.content ?? {}) }
  const blockStyle = block.overrides?.blockStyle ?? {}
  const wrapperStyle = buildStyleCSS(block.overrides?.style, block.overrides?.advanced, viewMode)


  // w-full overflow-x-auto bg-gray-200 p-4 
  // mx-auto min-w-[1440px] max-w-[1440px] bg-white shadow-xl min-h-screen
  // @container
  // w-full overflow-hidden
  return (
    <div
      className={`"
      lbfs-preview-block${isSelected ? ' lbfs-preview-block--selected' : ''}`}
      style={Object.keys(wrapperStyle).length > 0 ? wrapperStyle : undefined}
    >
      {/* Hover/select overlay — only shown on non-inline-edit blocks, or when not selected */}
      {!(isInlineType && isSelected) && (
        <div
          className="lbfs-preview-block__overlay"
          onClick={(e) => { e.stopPropagation(); onSelect(block.id) }}
        />
      )}

      {/* Hover toolbar — visible via CSS :hover on parent */}
      <div className="lbfs-preview-block__hover-bar">
        <span className="lbfs-preview-block__hover-label">
          {block.blockType}
        </span>
        <div className="lbfs-preview-block__hover-actions">
          <button
            className="lbfs-preview-block__hover-btn lbfs-preview-block__hover-btn--add"
            onClick={(e) => { e.stopPropagation(); onAddAfter(block.id) }}
            title="Add section below"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 1v8M1 5h8" />
            </svg>
          </button>
          <button
            className="lbfs-preview-block__hover-btn lbfs-preview-block__hover-btn--del"
            onClick={(e) => { e.stopPropagation(); onDelete(block.id) }}
            title="Delete section"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M1 1l8 8M9 1L1 9" />
            </svg>
          </button>
        </div>
      </div>

      {/* Selection name badge */}
      {isSelected && (
        <div className="lbfs-preview-block__sel-badge">
          <span>{block.name}</span>
          <span className="lbfs-preview-block__sel-type">{block.blockType}</span>
        </div>
      )}


      {/* Render content */}
      {isLayoutBlock ? (
        <div className="lbfs-preview-layout-block">
          {block.children.length > 0
            ? block.children.map((child) => (
                <BlockPreviewWrapper
                  key={child.id}
                  block={child}
                  selectedId={selectedId}
                  viewMode={viewMode}
                  onSelect={onSelect}
                  onAddAfter={onAddAfter}
                  onDelete={onDelete}
                  onInlineEdit={onInlineEdit}
                />
              ))
            : <div className="lbfs-preview-layout-block__empty">Drop blocks inside</div>
          }
        </div>
      ) : isInlineType && isSelected ? (
        <InlineTextBlock block={block} onInlineEdit={onInlineEdit} />
      ) : (
        resolvePreviewComponent(block.blockType, data, blockStyle)
      )}
    </div>
  )
}

/** Add-section strip between blocks */
function AddStripBetween({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="lbfs-preview-add-strip" onClick={onAdd}>
      <span className="lbfs-preview-add-strip__icon">+</span>
    </div>
  )
}

export function LayoutPreview({
  tree,
  selectedId,
  viewMode,
  onSelect,
  onAddRoot,
  onAddAfter,
  onDelete,
  onInlineEdit,
}: LayoutPreviewProps) {
  return (
    //  @container
    <div className="lbfs-preview tailwind-scope">
      {tree.length === 0 && (
        <div className="lbfs-preview__empty">
          <div className="lbfs-preview__empty-icon">⬡</div>
          <p>No sections yet</p>
          <span>Add a block from the left panel</span>
        </div>
      )}

      {tree.map((block, i) => (
        <React.Fragment key={block.id}>
          {i === 0 && (
            <AddStripBetween onAdd={() => onAddAfter('__before__' + block.id)} />
          )}
          <BlockPreviewWrapper
            block={block}
            selectedId={selectedId}
            viewMode={viewMode}
            onSelect={onSelect}
            onAddAfter={onAddAfter}
            onDelete={onDelete}
            onInlineEdit={onInlineEdit}
          />
          <AddStripBetween onAdd={() => onAddAfter(block.id)} />
        </React.Fragment>
      ))}

      <button className="lbfs-preview__add-root" onClick={onAddRoot}>
        + Add Section
      </button>
    </div>
  )
}

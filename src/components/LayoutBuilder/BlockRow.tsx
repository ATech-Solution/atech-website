'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { LayoutBlock } from './types'

interface BlockRowProps {
  block: LayoutBlock
  depth: number
  isSelected: boolean
  isExpanded: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onToggleExpand: (id: string) => void
  onAddInside?: (parentId: string) => void
  children?: React.ReactNode
}

const BLOCK_TYPE_COLORS: Record<string, string> = {
  container:    '#6366f1',
  grid:         '#8b5cf6',
  heading:      '#0ea5e9',
  'text-editor':'#06b6d4',
  image:        '#10b981',
  video:        '#f59e0b',
  button:       '#ef4444',
  divider:      '#6b7280',
  spacer:       '#9ca3af',
  'google-map': '#22c55e',
  icon:         '#f97316',
  // general
  tabs:             '#a855f7',
  accordion:        '#ec4899',
  'image-box':      '#14b8a6',
  'icon-box':       '#f59e0b',
  'image-carousel': '#3b82f6',
  'basic-gallery':  '#84cc16',
  'icon-list':      '#fb923c',
  counter:          '#e11d48',
  'progress-bar':   '#7c3aed',
  testimonial:      '#0891b2',
  'social-icons':   '#4f46e5',
  alert:            '#dc2626',
  html:             '#374151',
}

export function BlockRow({
  block,
  depth,
  isSelected,
  isExpanded,
  onSelect,
  onDelete,
  onToggleExpand,
  onAddInside,
  children,
}: BlockRowProps) {
  const isContainer = block.blockType === 'container' || block.blockType === 'grid'
  const badgeColor = BLOCK_TYPE_COLORS[block.blockType] ?? '#6b7280'

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id, data: { block, depth } })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, marginLeft: depth * 16 }}
      className={`lb-block-row ${isSelected ? 'lb-block-row--selected' : ''} ${isDragging ? 'lb-block-row--dragging' : ''}`}
    >
      {/* Main row */}
      <div
        className="lb-block-row__inner"
        onClick={() => onSelect(block.id)}
      >
        {/* Drag handle */}
        <button
          className="lb-block-row__handle"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          title="Drag to reorder"
        >
          <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor">
            <circle cx="2" cy="2"  r="1.5" />
            <circle cx="8" cy="2"  r="1.5" />
            <circle cx="2" cy="8"  r="1.5" />
            <circle cx="8" cy="8"  r="1.5" />
            <circle cx="2" cy="14" r="1.5" />
            <circle cx="8" cy="14" r="1.5" />
          </svg>
        </button>

        {/* Expand/collapse for containers */}
        {isContainer && (
          <button
            className="lb-block-row__expand"
            onClick={(e) => { e.stopPropagation(); onToggleExpand(block.id) }}
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            <svg
              width="10" height="10" viewBox="0 0 10 10"
              style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}
              fill="currentColor"
            >
              <path d="M3 1l5 4-5 4V1z" />
            </svg>
          </button>
        )}

        {/* Block name */}
        <span className="lb-block-row__name">{block.name}</span>

        {/* Type badge */}
        <span
          className="lb-block-row__badge"
          style={{ backgroundColor: badgeColor + '22', color: badgeColor, borderColor: badgeColor + '44' }}
        >
          {block.blockType}
        </span>

        {/* Controls */}
        <div className="lb-block-row__controls" onClick={(e) => e.stopPropagation()}>
          <button
            className="lb-block-row__btn lb-block-row__btn--edit"
            onClick={() => onSelect(block.id)}
            title="Edit properties"
          >
            ✎
          </button>
          <button
            className="lb-block-row__btn lb-block-row__btn--delete"
            onClick={() => onDelete(block.id)}
            title="Delete block"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Children (nested blocks) */}
      {isContainer && isExpanded && (
        <div className="lb-block-row__children">
          {children}
          {onAddInside && (
            <button
              className="lb-block-row__add-inside"
              onClick={(e) => { e.stopPropagation(); onAddInside(block.id) }}
            >
              + Add block inside <em>{block.name}</em>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

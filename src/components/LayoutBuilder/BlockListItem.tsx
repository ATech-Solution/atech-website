'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { LayoutBlock } from './types'

interface BlockListItemProps {
  block: LayoutBlock
  depth: number
  isSelected: boolean
  isExpanded: boolean
  isRenaming: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onToggleExpand: (id: string) => void
  onStartRename: (id: string) => void
  onConfirmRename: (id: string, name: string) => void
  children?: React.ReactNode
}

export function BlockListItem({
  block,
  depth,
  isSelected,
  isExpanded,
  isRenaming,
  onSelect,
  onDelete,
  onToggleExpand,
  onStartRename,
  onConfirmRename,
  children,
}: BlockListItemProps) {
  const isContainer = block.blockType === 'container' || block.blockType === 'grid'
  const inputRef = useRef<HTMLInputElement>(null)
  const [renameValue, setRenameValue] = useState(block.name)

  useEffect(() => {
    if (isRenaming) {
      setRenameValue(block.name)
      setTimeout(() => inputRef.current?.select(), 10)
    }
  }, [isRenaming, block.name])

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onConfirmRename(block.id, renameValue)
    if (e.key === 'Escape') onConfirmRename(block.id, block.name)
  }

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, paddingLeft: depth * 16 + 8 }}
      className={`lb-list-item ${isSelected ? 'lb-list-item--selected' : ''} ${isDragging ? 'lb-list-item--dragging' : ''}`}
    >
      <div className="lb-list-item__row">
        {/* Drag handle */}
        <button className="lb-list-item__handle" {...attributes} {...listeners} title="Drag to reorder">
          <svg width="8" height="14" viewBox="0 0 8 14" fill="currentColor">
            <circle cx="2" cy="2"  r="1.2" />
            <circle cx="6" cy="2"  r="1.2" />
            <circle cx="2" cy="7"  r="1.2" />
            <circle cx="6" cy="7"  r="1.2" />
            <circle cx="2" cy="12" r="1.2" />
            <circle cx="6" cy="12" r="1.2" />
          </svg>
        </button>

        {/* Expand toggle for containers */}
        {isContainer ? (
          <button
            className="lb-list-item__expand"
            onClick={() => onToggleExpand(block.id)}
          >
            <svg
              width="8" height="8" viewBox="0 0 8 8"
              style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}
              fill="currentColor"
            >
              <path d="M2 1l4 3-4 3V1z" />
            </svg>
          </button>
        ) : (
          <span className="lb-list-item__indent-spacer" />
        )}

        {/* Block name — double-click to rename */}
        {isRenaming ? (
          <input
            ref={inputRef}
            className="lb-list-item__rename-input"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => onConfirmRename(block.id, renameValue)}
          />
        ) : (
          <span
            className="lb-list-item__name"
            onClick={() => onSelect(block.id)}
            onDoubleClick={() => onStartRename(block.id)}
            title="Double-click to rename"
          >
            {block.name}
          </span>
        )}

        {/* Controls */}
        <div className="lb-list-item__controls">
          <button
            className="lb-list-item__btn lb-list-item__btn--edit"
            onClick={() => onSelect(block.id)}
            title="Edit"
          >✎</button>
          <button
            className="lb-list-item__btn lb-list-item__btn--delete"
            onClick={() => onDelete(block.id)}
            title="Delete"
          >✕</button>
        </div>
      </div>

      {/* Children */}
      {isContainer && isExpanded && children && (
        <div className="lb-list-item__children">{children}</div>
      )}
    </div>
  )
}

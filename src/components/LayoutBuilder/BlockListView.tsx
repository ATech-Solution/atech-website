'use client'

import React, { useCallback, useRef, useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import type { LayoutBlock, LayoutTree } from './types'
import { BlockListItem } from './BlockListItem'
import { findNode, moveNode, nestNode } from './utils/treeOps'

interface BlockListViewProps {
  tree: LayoutTree
  selectedId: string | null
  expandedIds: Set<string>
  renamingId: string | null
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onToggleExpand: (id: string) => void
  onStartRename: (id: string) => void
  onConfirmRename: (id: string, name: string) => void
  onTreeChange: (tree: LayoutTree) => void
}

function flatIds(nodes: LayoutBlock[], expandedIds: Set<string>): string[] {
  const ids: string[] = []
  for (const node of nodes) {
    ids.push(node.id)
    if (expandedIds.has(node.id)) ids.push(...flatIds(node.children, expandedIds))
  }
  return ids
}

export function BlockListView({
  tree,
  selectedId,
  expandedIds,
  renamingId,
  onSelect,
  onDelete,
  onToggleExpand,
  onStartRename,
  onConfirmRename,
  onTreeChange,
}: BlockListViewProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const hoverTimer   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const nestTimer    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastHoverId  = useRef<string | null>(null)
  const activeDragId = useRef<string | null>(null)
  const [nestTargetId, setNestTargetId] = useState<string | null>(null)

  const clearTimers = () => {
    if (hoverTimer.current)  { clearTimeout(hoverTimer.current);  hoverTimer.current  = null }
    if (nestTimer.current)   { clearTimeout(nestTimer.current);   nestTimer.current   = null }
  }

  const handleDragStart = useCallback((event: DragStartEvent) => {
    activeDragId.current = event.active.id as string
    setNestTargetId(null)
  }, [])

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const overId = event.over?.id as string | undefined
    if (!overId || overId === lastHoverId.current) return
    lastHoverId.current = overId
    clearTimers()

    if (overId === activeDragId.current) return

    const result = findNode(tree, overId)
    if (!result) return
    const [node] = result

    // Auto-expand after 300ms
    if (!expandedIds.has(overId)) {
      hoverTimer.current = setTimeout(() => onToggleExpand(overId), 300)
    }

    // Set nest target after 600ms — any block can receive children
    nestTimer.current = setTimeout(() => {
      setNestTargetId(overId)
    }, 600)
  }, [tree, expandedIds, onToggleExpand])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    clearTimers()
    lastHoverId.current  = null
    activeDragId.current = null

    const { active, over } = event
    const currentNestTarget = nestTargetId
    setNestTargetId(null)

    if (!over || active.id === over.id) return

    const activeId = active.id as string
    const overId   = over.id as string

    // If we had a nest target set, nest the block inside it
    if (currentNestTarget && currentNestTarget !== activeId) {
      onTreeChange(nestNode(tree, activeId, currentNestTarget))
      return
    }

    // Otherwise standard reorder within same parent
    const overResult = findNode(tree, overId)
    if (!overResult) return
    const [, overParents] = overResult
    const overParentId = overParents[overParents.length - 1]?.id ?? null

    onTreeChange(moveNode(tree, activeId, overParentId, overId))
  }, [tree, nestTargetId, onTreeChange])

  const allIds = flatIds(tree, expandedIds)

  const renderItem = (block: LayoutBlock, depth: number): React.ReactNode => {
    return (
      <BlockListItem
        key={block.id}
        block={block}
        depth={depth}
        isSelected={selectedId === block.id}
        isExpanded={expandedIds.has(block.id)}
        isRenaming={renamingId === block.id}
        isNestTarget={nestTargetId === block.id}
        onSelect={onSelect}
        onDelete={onDelete}
        onToggleExpand={onToggleExpand}
        onStartRename={onStartRename}
        onConfirmRename={onConfirmRename}
      >
        {expandedIds.has(block.id) &&
          block.children.map((child) => renderItem(child, depth + 1))
        }
      </BlockListItem>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={allIds} strategy={verticalListSortingStrategy}>
        <div className="lb-list">
          {tree.length === 0 ? (
            <p className="lb-list__empty">No blocks added yet.</p>
          ) : (
            tree.map((block) => renderItem(block, 0))
          )}
          <p className="lb-list__hint">Drag to reorder or nest · Double-click to rename</p>
        </div>
      </SortableContext>
    </DndContext>
  )
}

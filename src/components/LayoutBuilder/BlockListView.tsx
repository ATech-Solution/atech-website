'use client'

import React, { useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import type { LayoutBlock, LayoutTree } from './types'
import { BlockListItem } from './BlockListItem'
import { findNode, moveNode, renameNode } from './utils/treeOps'

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

  const allIds = flatIds(tree, expandedIds)

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      const activeId = active.id as string
      const overId = over.id as string

      const overResult = findNode(tree, overId)
      if (!overResult) return
      const [, overParents] = overResult
      const overParentId = overParents[overParents.length - 1]?.id ?? null

      const nextTree = moveNode(tree, activeId, overParentId, overId)
      onTreeChange(nextTree)
    },
    [tree, onTreeChange],
  )

  const renderItem = (block: LayoutBlock, depth: number): React.ReactNode => {
    const isContainer = block.blockType === 'container' || block.blockType === 'grid'
    return (
      <BlockListItem
        key={block.id}
        block={block}
        depth={depth}
        isSelected={selectedId === block.id}
        isExpanded={expandedIds.has(block.id)}
        isRenaming={renamingId === block.id}
        onSelect={onSelect}
        onDelete={onDelete}
        onToggleExpand={onToggleExpand}
        onStartRename={onStartRename}
        onConfirmRename={onConfirmRename}
      >
        {isContainer && expandedIds.has(block.id) &&
          block.children.map((child) => renderItem(child, depth + 1))
        }
      </BlockListItem>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={allIds} strategy={verticalListSortingStrategy}>
        <div className="lb-list">
          {tree.length === 0 ? (
            <p className="lb-list__empty">No blocks added yet.</p>
          ) : (
            tree.map((block) => renderItem(block, 0))
          )}
          <p className="lb-list__hint">Double-click a name to rename · Drag to reorder</p>
        </div>
      </SortableContext>
    </DndContext>
  )
}

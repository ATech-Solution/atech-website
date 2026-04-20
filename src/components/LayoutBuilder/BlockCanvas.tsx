'use client'

import React, { useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
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
import { BlockRow } from './BlockRow'
import { findNode, moveNode } from './utils/treeOps'

interface BlockCanvasProps {
  tree: LayoutTree
  selectedId: string | null
  expandedIds: Set<string>
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onToggleExpand: (id: string) => void
  onAddBlock: (parentId: string | null) => void
  onTreeChange: (tree: LayoutTree) => void
}

interface RenderNode {
  block: LayoutBlock
  depth: number
  parentId: string | null
}

/** Flatten visible tree nodes for SortableContext */
function flattenVisible(
  nodes: LayoutBlock[],
  expandedIds: Set<string>,
  depth = 0,
  parentId: string | null = null,
): RenderNode[] {
  const result: RenderNode[] = []
  for (const block of nodes) {
    result.push({ block, depth, parentId })
    const isContainer = block.blockType === 'container' || block.blockType === 'grid'
    if (isContainer && expandedIds.has(block.id) && block.children.length > 0) {
      result.push(...flattenVisible(block.children, expandedIds, depth + 1, block.id))
    }
  }
  return result
}

export function BlockCanvas({
  tree,
  selectedId,
  expandedIds,
  onSelect,
  onDelete,
  onToggleExpand,
  onAddBlock,
  onTreeChange,
}: BlockCanvasProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const flatNodes = flattenVisible(tree, expandedIds)
  const ids = flatNodes.map((n) => n.block.id)

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      const activeId = active.id as string
      const overId = over.id as string

      // Find what container the over-node lives in
      const overResult = findNode(tree, overId)
      if (!overResult) return
      const [overNode, overParents] = overResult
      const overParentId = overParents[overParents.length - 1]?.id ?? null

      // Determine if we're dropping onto a container (nest) or between items (reorder)
      const isOverContainer =
        overNode.blockType === 'container' || overNode.blockType === 'grid'

      let nextTree: LayoutTree
      if (isOverContainer && expandedIds.has(overId)) {
        // Nest into container
        nextTree = moveNode(tree, activeId, overId, null)
      } else {
        // Reorder within the same parent
        nextTree = moveNode(tree, activeId, overParentId, overId)
      }

      onTreeChange(nextTree)
    },
    [tree, expandedIds, onTreeChange],
  )

  /** Recursively render block rows */
  const renderBlock = (block: LayoutBlock, depth: number, parentId: string | null): React.ReactNode => {
    const isContainer = block.blockType === 'container' || block.blockType === 'grid'
    return (
      <BlockRow
        key={block.id}
        block={block}
        depth={depth}
        isSelected={selectedId === block.id}
        isExpanded={expandedIds.has(block.id)}
        onSelect={onSelect}
        onDelete={onDelete}
        onToggleExpand={onToggleExpand}
        onAddInside={isContainer ? onAddBlock : undefined}
      >
        {isContainer && expandedIds.has(block.id) &&
          block.children.map((child) => renderBlock(child, depth + 1, block.id))
        }
      </BlockRow>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="lb-canvas">
          {tree.length === 0 ? (
            <div className="lb-canvas__empty">
              <p>No blocks yet.</p>
            </div>
          ) : (
            tree.map((block) => renderBlock(block, 0, null))
          )}

          {/* Add block at root level */}
          <button
            className="lb-canvas__add-root"
            onClick={() => onAddBlock(null)}
          >
            + Add Block
          </button>
        </div>
      </SortableContext>
    </DndContext>
  )
}

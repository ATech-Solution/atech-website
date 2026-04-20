'use client'

import React from 'react'
import type { LayoutBlock, LayoutTree, BlockOverrides, BlockType, SidebarView } from './types'
import { BlockPicker } from './BlockPicker'
import { BlockListView } from './BlockListView'
import { BlockPropertiesPanel } from './BlockPropertiesPanel'

interface BlockSidebarProps {
  view: SidebarView
  tree: LayoutTree
  selectedBlock: LayoutBlock | null
  expandedIds: Set<string>
  renamingId: string | null
  onViewChange: (view: SidebarView) => void
  onAddBlock: (blockType: BlockType) => void
  onSelectBlock: (id: string) => void
  onDeleteBlock: (id: string) => void
  onToggleExpand: (id: string) => void
  onStartRename: (id: string) => void
  onConfirmRename: (id: string, name: string) => void
  onOverrideChange: (id: string, overrides: BlockOverrides) => void
  onDetach: (id: string) => void
  onTreeChange: (tree: LayoutTree) => void
  onBack: () => void
}

export function BlockSidebar({
  view,
  tree,
  selectedBlock,
  expandedIds,
  renamingId,
  onViewChange,
  onAddBlock,
  onSelectBlock,
  onDeleteBlock,
  onToggleExpand,
  onStartRename,
  onConfirmRename,
  onOverrideChange,
  onDetach,
  onTreeChange,
  onBack,
}: BlockSidebarProps) {
  // When a block is selected, show properties panel (overrides tab header)
  if (view === 'properties' && selectedBlock) {
    return (
      <aside className="lb-sidebar">
        <BlockPropertiesPanel
          block={selectedBlock}
          onBack={onBack}
          onOverrideChange={onOverrideChange}
          onDetach={onDetach}
        />
      </aside>
    )
  }

  return (
    <aside className="lb-sidebar">
      {/* Tab switcher */}
      <div className="lb-sidebar__tabs">
        <button
          className={`lb-sidebar__tab ${view === 'picker' ? 'lb-sidebar__tab--active' : ''}`}
          onClick={() => onViewChange('picker')}
        >
          Blocks
        </button>
        <button
          className={`lb-sidebar__tab ${view === 'list' ? 'lb-sidebar__tab--active' : ''}`}
          onClick={() => onViewChange('list')}
        >
          List
        </button>
      </div>

      {/* Tab content */}
      <div className="lb-sidebar__body">
        {view === 'picker' && (
          <BlockPicker onAdd={onAddBlock} />
        )}
        {view === 'list' && (
          <BlockListView
            tree={tree}
            selectedId={selectedBlock?.id ?? null}
            expandedIds={expandedIds}
            renamingId={renamingId}
            onSelect={onSelectBlock}
            onDelete={onDeleteBlock}
            onToggleExpand={onToggleExpand}
            onStartRename={onStartRename}
            onConfirmRename={onConfirmRename}
            onTreeChange={onTreeChange}
          />
        )}
      </div>
    </aside>
  )
}

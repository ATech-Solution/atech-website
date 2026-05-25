'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useField, useDocumentInfo } from '@payloadcms/ui'
import type {
  LayoutBlock,
  LayoutTree,
  BlockOverrides,
  BlockType,
  SidebarView,
} from './types'
import { BlockCanvas } from './BlockCanvas'
import { BlockSidebar } from './BlockSidebar'
import { addNode, removeNode, renameNode, updateNodeOverrides, toggleExpanded, findNode } from './utils/treeOps'
import { getDefaultOverrides } from './utils/defaultOverrides'
import './LayoutBuilder.css'

interface LayoutBuilderFieldProps {
  path: string
}

export function LayoutBuilderField({ path }: LayoutBuilderFieldProps) {
  const { value, setValue } = useField<LayoutTree>({ path })
  const { id: docId } = useDocumentInfo()

  // Ensure every block node has children: [] so treeOps never sees undefined.children
  const normalizeBlock = (node: any): LayoutBlock =>
    ({ ...node, children: (node.children ?? []).map(normalizeBlock) })
  const tree: LayoutTree = Array.isArray(value) ? value.map(normalizeBlock) : []

  // ── Wrap setValue to also sync tree to sessionStorage ─────────────────────
  const syncedSetValue = useCallback(
    (next: LayoutTree) => {
      setValue(next)
      if (docId) {
        try { sessionStorage.setItem(`lb_tree_${docId}`, JSON.stringify(next)) } catch {}
      }
    },
    [setValue, docId],
  )

  // ── Listen for postMessage from fullscreen window (save completed) ─────────
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'lb_save' && Array.isArray(e.data?.tree)) {
        setValue(e.data.tree)
        if (docId) {
          try { sessionStorage.removeItem(`lb_tree_${docId}`) } catch {}
        }
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [setValue, docId])

  const [pluginActive, setPluginActive]       = useState<boolean | null>(null)
  const [selectedId, setSelectedId]           = useState<string | null>(null)
  const [sidebarView, setSidebarView]         = useState<SidebarView>('picker')
  const [expandedIds, setExpandedIds]         = useState<Set<string>>(new Set())
  const [renamingId, setRenamingId]           = useState<string | null>(null)
  // pendingParentId remembers where to insert when canvas triggers "Add Block"
  const [pendingParentId, setPendingParentId] = useState<string | null>(null)

  // ── Check plugin status on mount ─────────────────────────────────────────
  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(
          '/api/plugins?where[slug][equals]=layout-builder&limit=1',
          { credentials: 'include' },
        )
        const data = await res.json()
        const doc = data?.docs?.[0]
        // If no record exists yet, default to active (first-run).
        // Only block if the record explicitly says 'inactive'.
        setPluginActive(!doc || doc.status === 'active')
      } catch {
        // Network error — don't block the UI
        setPluginActive(true)
      }
    }
    check()
  }, [])

  // ── Tree change handler ───────────────────────────────────────────────────
  const handleTreeChange = useCallback(
    (next: LayoutTree) => syncedSetValue(next),
    [syncedSetValue],
  )

  // ── Select block ─────────────────────────────────────────────────────────
  const handleSelect = useCallback((id: string) => {
    setSelectedId(id)
    setSidebarView('properties')
  }, [])

  // ── Add block (from picker sidebar) ─────────────────────────────────────
  // Called when the user picks a block type from the BlockPicker.
  // Uses `pendingParentId` set by the canvas "Add Block" buttons.
  const handlePickerAdd = useCallback(
    (blockType: BlockType) => {
      const parentId = pendingParentId
      const newBlock: Omit<LayoutBlock, 'id' | 'order'> = {
        blockType,
        name: blockType.charAt(0).toUpperCase() + blockType.slice(1).replace(/-/g, ' '),
        children: [],
        overrides: getDefaultOverrides(blockType),
      }
      const next = addNode(tree, newBlock, parentId, selectedId)
      syncedSetValue(next)
      // Auto-expand parent container if adding inside one
      if (parentId) {
        setExpandedIds((prev) => new Set([...prev, parentId]))
      }
      setPendingParentId(null)
    },
    [tree, selectedId, pendingParentId, syncedSetValue],
  )

  // ── Request add from canvas ────────────────────────────────────────────────
  // Called by the canvas "Add Block" and "Add inside <container>" buttons.
  // Sets where blocks should be inserted, then opens the picker sidebar.
  const handleCanvasAddRequest = useCallback(
    (parentId: string | null) => {
      setPendingParentId(parentId)
      setSelectedId(null)
      setSidebarView('picker')
    },
    [],
  )

  // ── Delete block ─────────────────────────────────────────────────────────
  const handleDelete = useCallback(
    (id: string) => {
      const next = removeNode(tree, id)
      syncedSetValue(next)
      if (selectedId === id) {
        setSelectedId(null)
        setSidebarView('picker')
      }
    },
    [tree, selectedId, syncedSetValue],
  )

  // ── Toggle expand ─────────────────────────────────────────────────────────
  const handleToggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => toggleExpanded(prev, id))
  }, [])

  // ── Rename ────────────────────────────────────────────────────────────────
  const handleStartRename = useCallback((id: string) => setRenamingId(id), [])
  const handleConfirmRename = useCallback(
    (id: string, name: string) => {
      setRenamingId(null)
      if (name.trim()) syncedSetValue(renameNode(tree, id, name.trim()))
    },
    [tree, syncedSetValue],
  )

  // ── Override change ───────────────────────────────────────────────────────
  const handleOverrideChange = useCallback(
    (id: string, overrides: BlockOverrides) => {
      syncedSetValue(updateNodeOverrides(tree, id, overrides))
    },
    [tree, syncedSetValue],
  )

  // ── Detach block from template ────────────────────────────────────────────
  const handleDetach = useCallback(
    (id: string) => {
      const result = findNode(tree, id)
      if (!result) return
      const [node] = result
      const next = updateNodeOverrides(tree, id, node.overrides)
      // Mark as detached and clear blockId reference
      const cloned: LayoutTree = JSON.parse(JSON.stringify(next))
      const found = findNode(cloned, id)
      if (found) {
        found[0].detached = true
        found[0].blockId  = undefined
      }
      syncedSetValue(cloned)
    },
    [tree, syncedSetValue],
  )

  // ── Back to picker ────────────────────────────────────────────────────────
  const handleBack = useCallback(() => {
    setSelectedId(null)
    setSidebarView('picker')
  }, [])

  const selectedBlock = selectedId ? findNode(tree, selectedId)?.[0] ?? null : null

  // ── Loading state ─────────────────────────────────────────────────────────
  if (pluginActive === null) {
    return (
      <div className="lb-wrapper">
        <div className="lb-loading">Checking Layout Builder plugin status…</div>
      </div>
    )
  }

  // ── Plugin inactive ───────────────────────────────────────────────────────
  if (!pluginActive) {
    return (
      <div className="lb-wrapper">
        <div className="lb-inactive">
          <p>🔌 Layout Builder Plugin is inactive.</p>
          <p>
            Go to{' '}
            <a href="/admin/collections/plugins" target="_blank" rel="noreferrer">
              Plugins → Layout Builder Plugin
            </a>{' '}
            to activate it.
          </p>
        </div>
      </div>
    )
  }

  // ── Main builder UI ───────────────────────────────────────────────────────
  return (
    <div className="lb-wrapper">
      {/* Header bar */}
      <div className="lb-header">
        <span className="lb-header__title">Page Layout</span>
        <button
          className={`lb-header__fullscreen${!docId ? ' lb-header__fullscreen--disabled' : ''}`}
          disabled={!docId}
          title={docId ? 'Open full screen editor' : 'Save the page first to enable full screen'}
          onClick={() => {
            if (docId) {
              try { sessionStorage.setItem(`lb_tree_${docId}`, JSON.stringify(tree)) } catch {}
              window.location.href = `/admin/layout-builder/${docId}`
            }
          }}
        >
          ⛶ Full Screen
        </button>
      </div>

      {/* Builder layout */}
      <div className="lb-layout">
        <BlockCanvas
          tree={tree}
          selectedId={selectedId}
          expandedIds={expandedIds}
          onSelect={handleSelect}
          onDelete={handleDelete}
          onToggleExpand={handleToggleExpand}
          onAddBlock={handleCanvasAddRequest}
          onTreeChange={handleTreeChange}
        />
        <BlockSidebar
          view={sidebarView}
          tree={tree}
          selectedBlock={selectedBlock}
          expandedIds={expandedIds}
          renamingId={renamingId}
          onViewChange={setSidebarView}
          onAddBlock={handlePickerAdd}
          onSelectBlock={handleSelect}
          onDeleteBlock={handleDelete}
          onToggleExpand={handleToggleExpand}
          onStartRename={handleStartRename}
          onConfirmRename={handleConfirmRename}
          onOverrideChange={handleOverrideChange}
          onDetach={handleDetach}
          onTreeChange={handleTreeChange}
          onBack={handleBack}
        />
      </div>
    </div>
  )
}

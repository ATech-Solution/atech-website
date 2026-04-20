'use client'

import React, { useCallback, useEffect, useState } from 'react'
import type {
  LayoutBlock,
  LayoutTree,
  BlockOverrides,
  BlockType,
  SidebarView,
} from './types'
import { getDefaultOverrides } from './utils/defaultOverrides'
import { BlockCanvas } from './BlockCanvas'
import { BlockSidebar } from './BlockSidebar'
import {
  addNode,
  removeNode,
  renameNode,
  updateNodeOverrides,
  toggleExpanded,
  findNode,
} from './utils/treeOps'
import './LayoutBuilder.css'

interface LayoutBuilderFullScreenProps {
  pageId: string
}

export function LayoutBuilderFullScreen({ pageId }: LayoutBuilderFullScreenProps) {
  const [tree, setTree]             = useState<LayoutTree>([])
  const [loading, setLoading]       = useState(true)
  const [saving, setSaving]         = useState(false)
  const [saveMsg, setSaveMsg]       = useState('')
  const [pageTitle, setPageTitle]   = useState('')

  const [selectedId, setSelectedId]   = useState<string | null>(null)
  const [sidebarView, setSidebarView] = useState<SidebarView>('picker')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [renamingId, setRenamingId]   = useState<string | null>(null)
  // pendingParentId remembers where to insert when canvas triggers "Add Block"
  const [pendingParentId, setPendingParentId] = useState<string | null>(null)

  // ── Load page data ────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        // Prefer sessionStorage: contains unsaved field-mode edits
        const cached = sessionStorage.getItem(`lb_tree_${pageId}`)
        if (cached) {
          const parsed = JSON.parse(cached)
          if (Array.isArray(parsed)) {
            setTree(parsed)
            setPageTitle(pageId)
            return
          }
        }
        const res  = await fetch(`/api/pages/${pageId}?depth=0`, { credentials: 'include' })
        const data = await res.json()
        setTree(Array.isArray(data?.layoutBuilder) ? data.layoutBuilder : [])
        setPageTitle(data?.title ?? pageId)
      } catch {
        /* ignore */
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [pageId])

  // ── Save to Payload API ───────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    setSaving(true)
    setSaveMsg('')
    try {
      await fetch(`/api/pages/${pageId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layoutBuilder: tree }),
      })
      setSaveMsg('Saved ✓')
      setTimeout(() => setSaveMsg(''), 2500)
      // Sync saved tree back to field-mode window and clear its sessionStorage key
      window.opener?.postMessage({ type: 'lb_save', tree }, '*')
      try { sessionStorage.removeItem(`lb_tree_${pageId}`) } catch {}
    } catch {
      setSaveMsg('Save failed')
    } finally {
      setSaving(false)
    }
  }, [pageId, tree])

  // ── Tree handlers (same as LayoutBuilderField) ───────────────────────────
  const handleTreeChange = useCallback((next: LayoutTree) => setTree(next), [])

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id)
    setSidebarView('properties')
  }, [])

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
      setTree((prev) => addNode(prev, newBlock, parentId, selectedId))
      if (parentId) setExpandedIds((prev) => new Set([...prev, parentId]))
      setPendingParentId(null)
    },
    [selectedId, pendingParentId],
  )

  // Called by canvas "Add Block" / "Add inside" buttons — sets pending location, opens picker.
  const handleCanvasAddRequest = useCallback(
    (parentId: string | null) => {
      setPendingParentId(parentId)
      setSelectedId(null)
      setSidebarView('picker')
    },
    [],
  )

  const handleDelete = useCallback((id: string) => {
    setTree((prev) => removeNode(prev, id))
    if (selectedId === id) { setSelectedId(null); setSidebarView('picker') }
  }, [selectedId])

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => toggleExpanded(prev, id))
  }, [])

  const handleStartRename  = useCallback((id: string) => setRenamingId(id), [])
  const handleConfirmRename = useCallback((id: string, name: string) => {
    setRenamingId(null)
    if (name.trim()) setTree((prev) => renameNode(prev, id, name.trim()))
  }, [])

  const handleOverrideChange = useCallback((id: string, overrides: BlockOverrides) => {
    setTree((prev) => updateNodeOverrides(prev, id, overrides))
  }, [])

  const handleDetach = useCallback((id: string) => {
    setTree((prev) => {
      const result = findNode(prev, id)
      if (!result) return prev
      const next = updateNodeOverrides(prev, id, result[0].overrides)
      const cloned: LayoutTree = JSON.parse(JSON.stringify(next))
      const found = findNode(cloned, id)
      if (found) { found[0].detached = true; found[0].blockId = undefined }
      return cloned
    })
  }, [])

  const handleBack = useCallback(() => { setSelectedId(null); setSidebarView('picker') }, [])

  const selectedBlock = selectedId ? findNode(tree, selectedId)?.[0] ?? null : null

  if (loading) {
    return (
      <div className="lb-fullscreen lb-fullscreen--loading">
        Loading layout data…
      </div>
    )
  }

  return (
    <div className="lb-fullscreen">
      {/* Top bar */}
      <div className="lb-fullscreen__topbar">
        <div className="lb-fullscreen__breadcrumb">
          <a href="/admin/collections/pages" className="lb-fullscreen__back-link">Pages</a>
          <span> › </span>
          <span>{pageTitle}</span>
          <span> › Layout Builder</span>
        </div>
        <div className="lb-fullscreen__actions">
          {saveMsg && <span className="lb-fullscreen__save-msg">{saveMsg}</span>}
          <button
            className="lb-fullscreen__save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving…' : '💾 Save'}
          </button>
          <button
            className="lb-fullscreen__exit-btn"
            onClick={() => window.close()}
          >
            ✕ Exit
          </button>
        </div>
      </div>

      {/* Builder */}
      <div className="lb-fullscreen__body">
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

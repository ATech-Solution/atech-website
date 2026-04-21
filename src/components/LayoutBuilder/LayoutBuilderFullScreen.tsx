'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import type {
  LayoutBlock,
  LayoutTree,
  BlockOverrides,
  BlockType,
} from './types'
import { getDefaultOverrides } from './utils/defaultOverrides'
import { BlockPicker } from './BlockPicker'
import { BlockPropertiesPanel } from './BlockPropertiesPanel'
import { BlockListView } from './BlockListView'
import { LayoutPreview } from './LayoutPreview'
import { FloatingPanel } from './FloatingPanel'
import {
  addNode,
  removeNode,
  renameNode,
  updateNodeOverrides,
  toggleExpanded,
  findNode,
} from './utils/treeOps'
import './LayoutBuilder.css'

const VIEWPORT_WIDTHS = {
  desktop: '100%',
  tablet:  '768px',
  mobile:  '390px',
} as const

type ViewMode = keyof typeof VIEWPORT_WIDTHS

interface LayoutBuilderFullScreenProps {
  pageId: string
}

export function LayoutBuilderFullScreen({ pageId }: LayoutBuilderFullScreenProps) {
  // ── Page data ──────────────────────────────────────────────────────────────
  const [tree, setTree]           = useState<LayoutTree>([])
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [saveMsg, setSaveMsg]     = useState('')
  const [pageTitle, setPageTitle] = useState('')

  // ── Selection + sidebar ───────────────────────────────────────────────────
  const [selectedId, setSelectedId]   = useState<string | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [renamingId, setRenamingId]   = useState<string | null>(null)
  const [pendingParentId, setPendingParentId] = useState<string | null>(null)
  const [pendingAfterId, setPendingAfterId]   = useState<string | null>(null)
  const [leftTab, setLeftTab]         = useState<'picker' | 'properties'>('picker')

  // ── Layout UI state ───────────────────────────────────────────────────────
  const [leftWidth, setLeftWidth]     = useState(280)
  const [leftHidden, setLeftHidden]   = useState(false)
  const [rightVisible, setRightVisible] = useState(true)
  const [viewMode, setViewMode]       = useState<ViewMode>('desktop')

  // ── Resize handle refs ────────────────────────────────────────────────────
  const isResizingLeft  = useRef(false)
  const resizeStartX    = useRef(0)
  const resizeStartW    = useRef(0)

  const startLeftResize = useCallback((e: React.MouseEvent) => {
    isResizingLeft.current = true
    resizeStartX.current   = e.clientX
    resizeStartW.current   = leftWidth
    e.preventDefault()
  }, [leftWidth])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isResizingLeft.current) return
      const dx  = e.clientX - resizeStartX.current
      setLeftWidth(Math.min(480, Math.max(160, resizeStartW.current + dx)))
    }
    const onUp = () => { isResizingLeft.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  // ── Auto-switch left tab to Properties on block select ────────────────────
  useEffect(() => {
    if (selectedId) setLeftTab('properties')
  }, [selectedId])

  // ── Load page data ────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
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
      } catch { /* ignore */ }
      finally { setLoading(false) }
    }
    load()
  }, [pageId])

  // ── Save ──────────────────────────────────────────────────────────────────
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
      try { sessionStorage.removeItem(`lb_tree_${pageId}`) } catch {}
      setTimeout(() => {
        window.location.href = `/admin/collections/pages/${pageId}`
      }, 800)
    } catch {
      setSaveMsg('Save failed')
    } finally {
      setSaving(false)
    }
  }, [pageId, tree])

  // ── Tree change ───────────────────────────────────────────────────────────
  const handleTreeChange = useCallback((next: LayoutTree) => setTree(next), [])

  // ── Preview select — click on canvas section ──────────────────────────────
  const handlePreviewSelect = useCallback((id: string) => {
    setSelectedId(id)
    setLeftTab('properties')
  }, [])

  // ── Standard select (from list) ───────────────────────────────────────────
  const handleSelect = useCallback((id: string) => {
    setSelectedId(id)
    setLeftTab('properties')
  }, [])

  // ── Add block from picker ─────────────────────────────────────────────────
  const handlePickerAdd = useCallback(
    (blockType: BlockType) => {
      const parentId = pendingParentId
      const afterId  = pendingAfterId
      const newBlock: Omit<LayoutBlock, 'id' | 'order'> = {
        blockType,
        name: blockType.charAt(0).toUpperCase() + blockType.slice(1).replace(/-/g, ' '),
        children: [],
        overrides: getDefaultOverrides(blockType),
      }
      setTree((prev) => addNode(prev, newBlock, parentId, afterId))
      if (parentId) setExpandedIds((prev) => new Set([...prev, parentId]))
      setPendingParentId(null)
      setPendingAfterId(null)
    },
    [pendingParentId, pendingAfterId],
  )

  // ── Canvas add request — opens picker with position context ──────────────
  const handleCanvasAddRequest = useCallback((parentId: string | null) => {
    setPendingParentId(parentId)
    setPendingAfterId(null)
    setSelectedId(null)
    setLeftTab('picker')
  }, [])

  // ── Add after specific block (from preview hover toolbar) ─────────────────
  const handleAddAfter = useCallback((afterId: string) => {
    const result = findNode(tree, afterId)
    const parentId = result ? (result[1][result[1].length - 1]?.id ?? null) : null
    setPendingParentId(parentId)
    setPendingAfterId(afterId)
    setSelectedId(null)
    setLeftTab('picker')
  }, [tree])

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = useCallback((id: string) => {
    setTree((prev) => removeNode(prev, id))
    if (selectedId === id) { setSelectedId(null); setLeftTab('picker') }
  }, [selectedId])

  // ── Expand / collapse ─────────────────────────────────────────────────────
  const handleToggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => toggleExpanded(prev, id))
  }, [])

  // ── Rename ────────────────────────────────────────────────────────────────
  const handleStartRename   = useCallback((id: string) => setRenamingId(id), [])
  const handleConfirmRename = useCallback((id: string, name: string) => {
    setRenamingId(null)
    if (name.trim()) setTree((prev) => renameNode(prev, id, name.trim()))
  }, [])

  // ── Override change ───────────────────────────────────────────────────────
  const handleOverrideChange = useCallback((id: string, overrides: BlockOverrides) => {
    setTree((prev) => updateNodeOverrides(prev, id, overrides))
  }, [])

  // ── Detach ────────────────────────────────────────────────────────────────
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

  // ── Inline edit (contenteditable text in preview) ────────────────────────
  const handleInlineEdit = useCallback((blockId: string, field: string, value: string) => {
    setTree((prev) => {
      const result = findNode(prev, blockId)
      if (!result) return prev
      const [node] = result
      const overrides = node.overrides ?? {}
      return updateNodeOverrides(prev, blockId, {
        ...overrides,
        content: { ...(overrides.content ?? {}), [field]: value },
      })
    })
  }, [])

  // ── Collapse / expand all in floating list ────────────────────────────────
  const handleCollapseAll = useCallback(() => {
    setExpandedIds(new Set())
  }, [])

  const handleExpandAll = useCallback(() => {
    const allIds = new Set<string>()
    const walk = (nodes: typeof tree) => {
      for (const n of nodes) { allIds.add(n.id); walk(n.children) }
    }
    walk(tree)
    setExpandedIds(allIds)
  }, [tree])

  const allCollapsed = expandedIds.size === 0

  // ── Back to picker ────────────────────────────────────────────────────────
  const handleBack = useCallback(() => {
    setSelectedId(null)
    setLeftTab('picker')
  }, [])

  const selectedBlock = selectedId ? findNode(tree, selectedId)?.[0] ?? null : null

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="lbfs-loading">
        <div className="lbfs-loading__spinner" />
        <span>Loading layout…</span>
      </div>
    )
  }

  return (
    <div className="lbfs-root">
      {/* ── Topbar ────────────────────────────────────────────────────────── */}
      <div className="lbfs-topbar">
        <div className="lbfs-topbar__left">
          <button
            className="lbfs-topbar__panel-toggle"
            onClick={() => setLeftHidden((v) => !v)}
            title={leftHidden ? 'Show panel' : 'Hide panel'}
          >
            <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
              <rect y="0" width="16" height="2" rx="1" />
              <rect y="5" width="16" height="2" rx="1" />
              <rect y="10" width="16" height="2" rx="1" />
            </svg>
          </button>
          <div className="lbfs-topbar__breadcrumb">
            <a href="/admin/collections/pages" className="lbfs-topbar__breadcrumb-link">Pages</a>
            <span className="lbfs-topbar__breadcrumb-sep">›</span>
            <span className="lbfs-topbar__breadcrumb-page">{pageTitle || pageId}</span>
            <span className="lbfs-topbar__breadcrumb-sep">›</span>
            <span className="lbfs-topbar__breadcrumb-current">Layout Builder</span>
          </div>
        </div>

        <div className="lbfs-topbar__center">
          {(['desktop', 'tablet', 'mobile'] as ViewMode[]).map((v) => (
            <button
              key={v}
              className={`lbfs-topbar__vp-btn${viewMode === v ? ' lbfs-topbar__vp-btn--active' : ''}`}
              onClick={() => setViewMode(v)}
              title={v.charAt(0).toUpperCase() + v.slice(1)}
            >
              {v === 'desktop' ? (
                <svg width="16" height="14" viewBox="0 0 16 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="1" y="1" width="14" height="10" rx="1.5" />
                  <path d="M5 13h6M8 11v2" />
                </svg>
              ) : v === 'tablet' ? (
                <svg width="12" height="14" viewBox="0 0 12 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="1" y="1" width="10" height="12" rx="1.5" />
                  <circle cx="6" cy="11" r="0.75" fill="currentColor" />
                </svg>
              ) : (
                <svg width="10" height="14" viewBox="0 0 10 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="1" y="1" width="8" height="12" rx="1.5" />
                  <circle cx="5" cy="11.5" r="0.75" fill="currentColor" />
                </svg>
              )}
            </button>
          ))}
        </div>

        <div className="lbfs-topbar__right">
          <button
            className={`lbfs-topbar__list-btn${rightVisible ? ' lbfs-topbar__list-btn--active' : ''}`}
            onClick={() => setRightVisible((v) => !v)}
            title="Toggle block list"
          >
            <svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor">
              <rect y="0" width="8" height="1.5" rx="0.75" />
              <rect y="5" width="12" height="1.5" rx="0.75" />
              <rect y="10" width="10" height="1.5" rx="0.75" />
            </svg>
            <span>List</span>
          </button>
          {saveMsg && <span className="lbfs-topbar__save-msg">{saveMsg}</span>}
          <button className="lbfs-topbar__save-btn" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button
            className="lbfs-topbar__exit-btn"
            onClick={() => { window.location.href = `/admin/collections/pages/${pageId}` }}
          >
            ✕ Exit
          </button>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="lbfs-body">
        {/* Left panel */}
        {!leftHidden && (
          <>
            <div className="lbfs-left" style={{ width: leftWidth }}>
              <div className="lbfs-left__tabs">
                <button
                  className={`lbfs-left__tab${leftTab === 'picker' ? ' lbfs-left__tab--active' : ''}`}
                  onClick={() => setLeftTab('picker')}
                >
                  Blocks
                </button>
                <button
                  className={`lbfs-left__tab${leftTab === 'properties' ? ' lbfs-left__tab--active' : ''}${!selectedBlock ? ' lbfs-left__tab--disabled' : ''}`}
                  onClick={() => { if (selectedBlock) setLeftTab('properties') }}
                >
                  Properties
                  {selectedBlock && <span className="lbfs-left__tab-dot" />}
                </button>
              </div>
              <div className="lbfs-left__body">
                {leftTab === 'picker' || !selectedBlock ? (
                  <BlockPicker onAdd={handlePickerAdd} />
                ) : (
                  <BlockPropertiesPanel
                    block={selectedBlock}
                    onBack={handleBack}
                    onOverrideChange={handleOverrideChange}
                    onDetach={handleDetach}
                  />
                )}
              </div>
            </div>
            {/* Resize handle */}
            <div className="lbfs-resize-handle" onMouseDown={startLeftResize} />
          </>
        )}

        {/* Main preview area */}
        <div className="lbfs-main">
          <div className="lbfs-preview-scroller">
            <div
              className="lbfs-preview-frame"
              style={{ maxWidth: VIEWPORT_WIDTHS[viewMode] }}
            >
              <LayoutPreview
                tree={tree}
                selectedId={selectedId}
                onSelect={handlePreviewSelect}
                onAddRoot={() => handleCanvasAddRequest(null)}
                onAddAfter={handleAddAfter}
                onDelete={handleDelete}
                onInlineEdit={handleInlineEdit}
              />
            </div>
          </div>

          {/* Floating block list */}
          {rightVisible && (
            <FloatingPanel
              title="Block List"
              onClose={() => setRightVisible(false)}
              onCollapseAll={handleCollapseAll}
              onExpandAll={handleExpandAll}
              allCollapsed={allCollapsed}
            >
              <BlockListView
                tree={tree}
                selectedId={selectedId}
                expandedIds={expandedIds}
                renamingId={renamingId}
                onSelect={handleSelect}
                onDelete={handleDelete}
                onToggleExpand={handleToggleExpand}
                onStartRename={handleStartRename}
                onConfirmRename={handleConfirmRename}
                onTreeChange={handleTreeChange}
              />
            </FloatingPanel>
          )}
        </div>
      </div>
    </div>
  )
}

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
  insertNode,
  removeNode,
  renameNode,
  updateNodeOverrides,
  toggleExpanded,
  findNode,
  cloneBlockWithNewIds,
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

  // ── Undo / redo history (refs — don't drive renders) ──────────────────────
  const treeRef   = useRef<LayoutTree>([])
  const pastRef   = useRef<LayoutTree[]>([])
  const futureRef = useRef<LayoutTree[]>([])

  // Keep treeRef in sync with tree state
  useEffect(() => { treeRef.current = tree }, [tree])

  // Wrap all user-initiated tree mutations through this to record history
  const commitTree = useCallback((fn: (prev: LayoutTree) => LayoutTree) => {
    const current = treeRef.current
    const next    = fn(current)
    pastRef.current   = [...pastRef.current.slice(-49), current]
    futureRef.current = []
    setTree(next)
  }, [])

  const handleUndo = useCallback(() => {
    if (pastRef.current.length === 0) return
    const prev = pastRef.current[pastRef.current.length - 1]
    futureRef.current = [treeRef.current, ...futureRef.current.slice(0, 49)]
    pastRef.current   = pastRef.current.slice(0, -1)
    setTree(prev)
  }, [])

  const handleRedo = useCallback(() => {
    if (futureRef.current.length === 0) return
    const next = futureRef.current[0]
    pastRef.current   = [...pastRef.current.slice(-49), treeRef.current]
    futureRef.current = futureRef.current.slice(1)
    setTree(next)
  }, [])

  // ── Clipboard (copy / paste) ───────────────────────────────────────────────
  const [clipboard, setClipboard] = useState<LayoutBlock | null>(null)

  // ── Selection + sidebar ───────────────────────────────────────────────────
  const [selectedId, setSelectedId]   = useState<string | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [renamingId, setRenamingId]   = useState<string | null>(null)
  const [pendingParentId, setPendingParentId] = useState<string | null>(null)
  const [pendingAfterId, setPendingAfterId]   = useState<string | null>(null)
  const [leftTab, setLeftTab]         = useState<'picker' | 'properties'>('picker')

  // ── Focused field (click element in preview → highlight field in panel) ────
  const [focusedField, setFocusedField] = useState<string | null>(null)

  // ── Layout UI state ───────────────────────────────────────────────────────
  const [leftWidth, setLeftWidth]     = useState(280)
  const [leftHidden, setLeftHidden]   = useState(false)
  const [rightVisible, setRightVisible] = useState(true)
  const [viewMode, setViewMode]       = useState<ViewMode>('desktop')

  // ── Resize handle refs ────────────────────────────────────────────────────
  const isResizingLeft  = useRef(false)
  const resizeStartX    = useRef(0)
  const resizeStartW    = useRef(0)

  // ── Responsive iframe refs ────────────────────────────────────────────────
  const iframeRef       = useRef<HTMLIFrameElement>(null)
  const [iframeReady, setIframeReady]   = useState(false)
  const [iframeHeight, setIframeHeight] = useState(600)

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

  // ── Stable ref for iframe event handlers (avoids stale closures) ──────────
  const iframeHandlers = useRef({
    onSelect:   (id: string) => { setSelectedId(id); setLeftTab('properties') },
    onAddAfter: (_id: string) => {},
    onDelete:   (_id: string) => {},
  })

  // ── Listen for messages from the responsive iframe ─────────────────────────
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      const msg = e.data
      if (!msg?.type) return
      switch (msg.type) {
        case 'LB_READY':    setIframeReady(true); break
        case 'LB_HEIGHT':   setIframeHeight(msg.height as number); break
        case 'LB_SELECT':   iframeHandlers.current.onSelect(msg.id as string); break
        case 'LB_ADD_AFTER':iframeHandlers.current.onAddAfter(msg.id as string); break
        case 'LB_DELETE':   iframeHandlers.current.onDelete(msg.id as string); break
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  // ── Sync tree + selection to iframe when in tablet/mobile mode ─────────────
  useEffect(() => {
    if (viewMode === 'desktop') return
    const send = () => {
      iframeRef.current?.contentWindow?.postMessage(
        { type: 'LB_UPDATE_TREE', tree, selectedId },
        '*',
      )
    }
    if (iframeReady) send()
  }, [tree, selectedId, viewMode, iframeReady])

  // ── When switching to a responsive mode, reset iframe ready state ──────────
  useEffect(() => {
    if (viewMode !== 'desktop') {
      setIframeReady(false)
      setIframeHeight(600)
    }
  }, [viewMode])

  // ── Load page data ────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const cached = sessionStorage.getItem(`lb_tree_${pageId}`)
        if (cached) {
          const parsed = JSON.parse(cached)
          if (Array.isArray(parsed)) {
            const initial = parsed
            treeRef.current = initial
            setTree(initial)
            setPageTitle(pageId)
            return
          }
        }
        const res  = await fetch(`/api/pages/${pageId}?depth=0`, { credentials: 'include' })
        const data = await res.json()
        const initial = Array.isArray(data?.layoutBuilder) ? data.layoutBuilder : []
        treeRef.current = initial
        setTree(initial)
        setPageTitle(data?.title ?? pageId)
      } catch { /* ignore */ }
      finally { setLoading(false) }
    }
    load()
  }, [pageId])

  // ── Keyboard shortcuts: Undo / Redo / Copy / Paste ────────────────────────
  useEffect(() => {
    const isInInput = (target: EventTarget | null) => {
      if (!target) return false
      const el = target as HTMLElement
      return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || (el as HTMLElement).isContentEditable
    }

    const handler = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey
      if (!meta) return
      if (isInInput(e.target)) return

      switch (e.key.toLowerCase()) {
        case 'z':
          e.preventDefault()
          if (e.shiftKey) handleRedo()
          else            handleUndo()
          break
        case 'y':
          e.preventDefault()
          handleRedo()
          break
        case 'c': {
          const sel = selectedId ? findNode(treeRef.current, selectedId)?.[0] ?? null : null
          if (sel) {
            setClipboard(cloneBlockWithNewIds(sel))
            e.preventDefault()
          }
          break
        }
        case 'v': {
          if (!clipboard) break
          const fresh = cloneBlockWithNewIds(clipboard)
          const result = selectedId ? findNode(treeRef.current, selectedId) : null
          const parentId = result ? (result[1][result[1].length - 1]?.id ?? null) : null
          commitTree((prev) => insertNode(prev, fresh, parentId, selectedId ?? null))
          e.preventDefault()
          break
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [clipboard, selectedId, handleUndo, handleRedo, commitTree])

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    setSaving(true)
    setSaveMsg('')
    try {
      await fetch(`/api/pages/${pageId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layoutBuilder: treeRef.current }),
      })
      setSaveMsg('Saved ✓')
      try { sessionStorage.removeItem(`lb_tree_${pageId}`) } catch {}
      setTimeout(() => setSaveMsg(''), 3000)
    } catch {
      setSaveMsg('Save failed')
    } finally {
      setSaving(false)
    }
  }, [pageId])

  // ── Tree change (drag-drop from list view) ────────────────────────────────
  const handleTreeChange = useCallback((next: LayoutTree) => {
    pastRef.current   = [...pastRef.current.slice(-49), treeRef.current]
    futureRef.current = []
    setTree(next)
  }, [])

  // ── Preview select — click on canvas section ──────────────────────────────
  const handlePreviewSelect = useCallback((id: string) => {
    setSelectedId(id)
    setFocusedField(null)
    setLeftTab('properties')
  }, [])

  // ── Preview field focus — click on specific element within selected block ──
  const handleFieldFocus = useCallback((blockId: string, field: string) => {
    setSelectedId(blockId)
    setFocusedField(field)
    setLeftTab('properties')
  }, [])

  // ── Standard select (from list) ───────────────────────────────────────────
  const handleSelect = useCallback((id: string) => {
    setSelectedId(id)
    setFocusedField(null)
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
      commitTree((prev) => addNode(prev, newBlock, parentId, afterId))
      if (parentId) setExpandedIds((prev) => new Set([...prev, parentId]))
      setPendingParentId(null)
      setPendingAfterId(null)
    },
    [pendingParentId, pendingAfterId, commitTree],
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
    const result = findNode(treeRef.current, afterId)
    const parentId = result ? (result[1][result[1].length - 1]?.id ?? null) : null
    setPendingParentId(parentId)
    setPendingAfterId(afterId)
    setSelectedId(null)
    setLeftTab('picker')
  }, [])

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = useCallback((id: string) => {
    commitTree((prev) => removeNode(prev, id))
    if (selectedId === id) { setSelectedId(null); setLeftTab('picker') }
  }, [selectedId, commitTree])

  // ── Keep iframe handler ref up to date ───────────────────────────────────
  iframeHandlers.current.onAddAfter = handleAddAfter
  iframeHandlers.current.onDelete   = handleDelete

  // ── Expand / collapse ─────────────────────────────────────────────────────
  const handleToggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => toggleExpanded(prev, id))
  }, [])

  // ── Rename ────────────────────────────────────────────────────────────────
  const handleStartRename   = useCallback((id: string) => setRenamingId(id), [])
  const handleConfirmRename = useCallback((id: string, name: string) => {
    setRenamingId(null)
    if (name.trim()) commitTree((prev) => renameNode(prev, id, name.trim()))
  }, [commitTree])

  // ── Override change ───────────────────────────────────────────────────────
  const handleOverrideChange = useCallback((id: string, overrides: BlockOverrides) => {
    commitTree((prev) => updateNodeOverrides(prev, id, overrides))
  }, [commitTree])

  // ── Detach ────────────────────────────────────────────────────────────────
  const handleDetach = useCallback((id: string) => {
    commitTree((prev) => {
      const result = findNode(prev, id)
      if (!result) return prev
      const next = updateNodeOverrides(prev, id, result[0].overrides)
      const cloned: LayoutTree = JSON.parse(JSON.stringify(next))
      const found = findNode(cloned, id)
      if (found) { found[0].detached = true; found[0].blockId = undefined }
      return cloned
    })
  }, [commitTree])

  // ── Inline edit (contenteditable text in preview) ────────────────────────
  const handleInlineEdit = useCallback((blockId: string, field: string, value: string) => {
    commitTree((prev) => {
      const result = findNode(prev, blockId)
      if (!result) return prev
      const [node] = result
      const overrides = node.overrides ?? {}
      return updateNodeOverrides(prev, blockId, {
        ...overrides,
        content: { ...(overrides.content ?? {}), [field]: value },
      })
    })
  }, [commitTree])

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
    setFocusedField(null)
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
          {/* Undo / Redo buttons */}
          <button
            className="lbfs-topbar__undo-btn"
            onClick={handleUndo}
            title="Undo (⌘Z)"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 7c0-2.761 2.239-5 5-5s5 2.239 5 5-2.239 5-5 5H4" />
              <path d="M4 4L2 7l2 3" />
            </svg>
          </button>
          <button
            className="lbfs-topbar__undo-btn"
            onClick={handleRedo}
            title="Redo (⌘⇧Z)"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 7c0-2.761-2.239-5-5-5S2 4.239 2 7s2.239 5 5 5h3" />
              <path d="M10 4l2 3-2 3" />
            </svg>
          </button>
          {clipboard && (
            <span className="lbfs-topbar__clipboard-hint" title="Clipboard: paste with ⌘V">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M8 1H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V3L8 1zm0 1l1 1H8V2zM4 9V2h3v2h2v5H4z"/>
              </svg>
            </span>
          )}
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
                    focusedField={focusedField}
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
        <div className="lbfs-main tailwind-scope">
          <div className="lbfs-preview-scroller">
            <div
              className="lbfs-preview-frame"
              style={{ maxWidth: VIEWPORT_WIDTHS[viewMode] }}
            >
              {viewMode === 'desktop' ? (
                <LayoutPreview
                  tree={tree}
                  selectedId={selectedId}
                  viewMode={viewMode}
                  onSelect={handlePreviewSelect}
                  onFieldFocus={handleFieldFocus}
                  onAddRoot={() => handleCanvasAddRequest(null)}
                  onAddAfter={handleAddAfter}
                  onDelete={handleDelete}
                  onInlineEdit={handleInlineEdit}
                />
              ) : (
                <iframe
                  key={viewMode}
                  ref={iframeRef}
                  src="/lb-preview"
                  title={`${viewMode} preview`}
                  style={{
                    width: '100%',
                    height: iframeHeight,
                    border: 'none',
                    display: 'block',
                  }}
                />
              )}
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

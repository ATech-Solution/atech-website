'use client'

import React, { useEffect, useState, useRef } from 'react'
import type { LayoutTree, LayoutBlock } from '@/components/LayoutBuilder/types'
import { getDefaultOverrides } from '@/components/LayoutBuilder/utils/defaultOverrides'
import { resolvePreviewComponent } from '@/components/LayoutBuilder/utils/previewResolver'

type InMsg = { type: 'LB_UPDATE_TREE'; tree: LayoutTree; selectedId: string | null }
type OutMsg =
  | { type: 'LB_READY' }
  | { type: 'LB_HEIGHT'; height: number }
  | { type: 'LB_SELECT'; id: string }
  | { type: 'LB_ADD_AFTER'; id: string }
  | { type: 'LB_DELETE'; id: string }

function post(msg: OutMsg) {
  window.parent.postMessage(msg, '*')
}

function BlockItem({
  block,
  selectedId,
}: {
  block: LayoutBlock
  selectedId: string | null
}) {
  const isSelected = block.id === selectedId
  const defaults = getDefaultOverrides(block.blockType).content ?? {}
  const data: Record<string, unknown> = { ...defaults, ...(block.overrides?.content ?? {}) }

  return (
    <div
      style={{
        position: 'relative',
        outline: isSelected ? '2px solid #6366f1' : undefined,
        outlineOffset: '-2px',
      }}
    >
      {/* Click overlay — sends select event to parent */}
      <div
        onClick={(e) => { e.stopPropagation(); post({ type: 'LB_SELECT', id: block.id }) }}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          cursor: 'pointer',
        }}
        className="lbp-overlay"
      />

      {/* Hover toolbar */}
      <div className="lbp-toolbar">
        <span className="lbp-toolbar__label">{block.blockType}</span>
        <div className="lbp-toolbar__actions">
          <button
            onClick={(e) => { e.stopPropagation(); post({ type: 'LB_ADD_AFTER', id: block.id }) }}
            className="lbp-btn lbp-btn--add"
            title="Add below"
          >+</button>
          <button
            onClick={(e) => { e.stopPropagation(); post({ type: 'LB_DELETE', id: block.id }) }}
            className="lbp-btn lbp-btn--del"
            title="Delete"
          >×</button>
        </div>
      </div>

      {resolvePreviewComponent(block.blockType, data)}
    </div>
  )
}

export default function LBPreviewPage() {
  const [tree, setTree] = useState<LayoutTree>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  /* ── Report content height to parent so iframe can auto-size ── */
  useEffect(() => {
    const report = () => {
      const h = document.body.scrollHeight
      post({ type: 'LB_HEIGHT', height: h })
    }
    const ro = new ResizeObserver(report)
    if (bodyRef.current) ro.observe(bodyRef.current)
    report()
    return () => ro.disconnect()
  }, [tree])

  /* ── Listen for tree updates from parent ── */
  useEffect(() => {
    post({ type: 'LB_READY' })

    const handler = (e: MessageEvent) => {
      const msg = e.data as InMsg
      if (msg?.type === 'LB_UPDATE_TREE') {
        setTree(msg.tree)
        setSelectedId(msg.selectedId)
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  return (
    <>
      <style>{`
        .lbp-overlay {
          border: 2px solid transparent;
          transition: border-color 0.12s;
        }
        .lbp-overlay:hover {
          border-color: rgba(34,197,94,0.7);
        }
        .lbp-toolbar {
          display: none;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 20;
          align-items: center;
          justify-content: space-between;
          padding: 3px 6px;
          background: rgba(0,0,0,0.72);
          pointer-events: none;
        }
        div:has(> .lbp-overlay:hover) .lbp-toolbar {
          display: flex;
          pointer-events: all;
        }
        .lbp-toolbar__label {
          color: #fff;
          font-size: 10px;
          font-family: ui-monospace, monospace;
          letter-spacing: 0.02em;
        }
        .lbp-toolbar__actions { display: flex; gap: 3px; }
        .lbp-btn {
          border: none;
          color: #fff;
          border-radius: 3px;
          width: 18px;
          height: 18px;
          cursor: pointer;
          font-size: 14px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .lbp-btn--add { background: #22c55e; }
        .lbp-btn--del { background: #ef4444; }
      `}</style>

      <div ref={bodyRef} style={{ minHeight: '100vh', background: '#fff' }}>
        {tree.length === 0 ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px',
            color: '#9ca3af',
            fontSize: '14px',
          }}>
            No sections added yet
          </div>
        ) : (
          tree.map((block) => (
            <BlockItem
              key={block.id}
              block={block}
              selectedId={selectedId}
            />
          ))
        )}
      </div>
    </>
  )
}

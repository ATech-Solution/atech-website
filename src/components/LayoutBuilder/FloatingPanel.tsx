'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react'

interface FloatingPanelProps {
  title: string
  initialX?: number
  initialY?: number
  initialW?: number
  initialH?: number
  onClose: () => void
  onCollapseAll?: () => void
  onExpandAll?: () => void
  allCollapsed?: boolean
  children: React.ReactNode
}

export function FloatingPanel({
  title,
  initialX,
  initialY = 72,
  initialW = 300,
  initialH = 520,
  onClose,
  onCollapseAll,
  onExpandAll,
  allCollapsed = false,
  children,
}: FloatingPanelProps) {
  const [pos, setPos]   = useState<{ x: number; y: number } | null>(null)
  const [size, setSize] = useState({ w: initialW, h: initialH })

  useEffect(() => {
    const x = initialX ?? Math.max(20, window.innerWidth - initialW - 24)
    setPos({ x, y: initialY })
  }, [initialX, initialY, initialW])

  const dragging   = useRef(false)
  const resizing   = useRef(false)
  const startMouse = useRef({ x: 0, y: 0 })
  const startVal   = useRef({ x: 0, y: 0, w: 0, h: 0 })

  const startDrag = useCallback((e: React.MouseEvent) => {
    if (!pos) return
    dragging.current = true
    startMouse.current = { x: e.clientX, y: e.clientY }
    startVal.current = { x: pos.x, y: pos.y, w: size.w, h: size.h }
    e.preventDefault()
  }, [pos, size])

  const startResize = useCallback((e: React.MouseEvent) => {
    if (!pos) return
    resizing.current = true
    startMouse.current = { x: e.clientX, y: e.clientY }
    startVal.current = { x: pos.x, y: pos.y, w: size.w, h: size.h }
    e.preventDefault()
    e.stopPropagation()
  }, [pos, size])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - startMouse.current.x
      const dy = e.clientY - startMouse.current.y
      if (dragging.current)  setPos({ x: startVal.current.x + dx, y: startVal.current.y + dy })
      if (resizing.current)  setSize({ w: Math.max(220, startVal.current.w + dx), h: Math.max(200, startVal.current.h + dy) })
    }
    const onUp = () => { dragging.current = false; resizing.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [])

  if (!pos) return null

  return (
    <div className="lbfs-fp" style={{ left: pos.x, top: pos.y, width: size.w, height: size.h }}>
      <div className="lbfs-fp__titlebar" onMouseDown={startDrag}>
        <div className="lbfs-fp__title-row">
          <span className="lbfs-fp__drag-dots">
            <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor">
              <circle cx="2.5" cy="3"  r="1.5" /><circle cx="7.5" cy="3"  r="1.5" />
              <circle cx="2.5" cy="8"  r="1.5" /><circle cx="7.5" cy="8"  r="1.5" />
              <circle cx="2.5" cy="13" r="1.5" /><circle cx="7.5" cy="13" r="1.5" />
            </svg>
          </span>
          <span className="lbfs-fp__title">{title}</span>
        </div>
        <div className="lbfs-fp__title-actions">
          {/* Collapse all / Expand all toggle */}
          {(onCollapseAll || onExpandAll) && (
            <button
              className="lbfs-fp__action-btn"
              onClick={allCollapsed ? onExpandAll : onCollapseAll}
              title={allCollapsed ? 'Expand all' : 'Collapse all'}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {allCollapsed ? (
                /* Expand: chevrons pointing outward */
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M2 5L7 2l5 3M2 9l5 3 5-3" />
                </svg>
              ) : (
                /* Collapse: chevrons pointing inward */
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M2 4l5 3 5-3M2 10l5-3 5 3" />
                </svg>
              )}
            </button>
          )}
          <button className="lbfs-fp__close" onClick={onClose} title="Hide panel">✕</button>
        </div>
      </div>
      <div className="lbfs-fp__body">{children}</div>
      <div className="lbfs-fp__resize" onMouseDown={startResize} title="Drag to resize">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" opacity="0.4">
          <path d="M9 3L3 9M9 7L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      </div>
    </div>
  )
}

'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
} from 'lexical'
import type { LexicalEditor } from 'lexical'
import { $createHeadingNode } from '@lexical/rich-text'
import { useDocumentInfo } from '@payloadcms/ui'
import { useLocale } from '@payloadcms/ui'
import { OPEN_AI_PANEL_COMMAND } from './command'

type Action = 'draft' | 'expand' | 'rewrite' | 'summarize'

const PLACEHOLDERS: Record<Action, string> = {
  draft: 'What would you like to write about?\ne.g. Write an intro about AI trends for senior devs...',
  expand: 'Direction for expansion (optional)\ne.g. Add more examples and concrete detail...',
  rewrite: 'How should it be rewritten?\ne.g. More direct, less jargon, shorter sentences...',
  summarize: 'Format preference (optional)\ne.g. 3 bullet points for a non-technical reader...',
}

const TIPS: Record<Action, string> = {
  draft: "Name your target audience. Include a keyword you want to rank for. Specify tone: 'conversational', 'technical', or 'punchy'.",
  expand: 'Select the paragraph to expand first. Mention any angle to add: examples, data, or deeper explanation.',
  rewrite: "Select the text to rewrite. Describe the tone shift: 'more direct', 'less jargon', 'shorter sentences'.",
  summarize: "Select the full passage first. Specify format: 'one sentence', 'bullet points', 'for a non-technical reader'.",
}

// ── Markdown → Lexical nodes ──────────────────────────────────────────────────

function appendStyledText(
  parent: ReturnType<typeof $createParagraphNode> | ReturnType<typeof $createHeadingNode>,
  text: string,
) {
  const parts = text.split(/\*\*([^*]+)\*\*/)
  for (let i = 0; i < parts.length; i++) {
    if (!parts[i]) continue
    const node = $createTextNode(parts[i])
    if (i % 2 === 1) node.toggleFormat('bold')
    parent.append(node)
  }
}

function parseMarkdownToNodes(markdown: string) {
  const lines = markdown.split('\n')
  const nodes: Array<
    ReturnType<typeof $createParagraphNode> | ReturnType<typeof $createHeadingNode>
  > = []
  const bulletBuffer: string[] = []

  const flushBullets = () => {
    for (const item of bulletBuffer) {
      const p = $createParagraphNode()
      appendStyledText(p, '• ' + item)
      nodes.push(p)
    }
    bulletBuffer.length = 0
  }

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      flushBullets()
      continue
    }
    if (trimmed.startsWith('## ')) {
      flushBullets()
      const h = $createHeadingNode('h2')
      appendStyledText(h, trimmed.slice(3).trim())
      nodes.push(h)
    } else if (trimmed.startsWith('### ')) {
      flushBullets()
      const h = $createHeadingNode('h3')
      appendStyledText(h, trimmed.slice(4).trim())
      nodes.push(h)
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      bulletBuffer.push(trimmed.slice(2).trim())
    } else {
      flushBullets()
      const p = $createParagraphNode()
      appendStyledText(p, trimmed)
      nodes.push(p)
    }
  }
  flushBullets()

  return nodes.length ? nodes : [$createParagraphNode()]
}

function insertMarkdownContent(
  editor: LexicalEditor,
  text: string,
  replaceSelection: boolean,
) {
  editor.update(() => {
    const nodes = parseMarkdownToNodes(text)
    const selection = $getSelection()

    if ($isRangeSelection(selection)) {
      if (replaceSelection && !selection.isCollapsed()) {
        selection.removeText()
      }
      $insertNodes(nodes)
    } else {
      const root = $getRoot()
      const last = root.getLastChild()
      if (last) {
        let prev = last
        for (const node of nodes) {
          prev.insertAfter(node)
          prev = node
        }
      } else {
        root.append(...nodes)
      }
    }
  })
}

// ── Panel component ───────────────────────────────────────────────────────────

const panelStyle: React.CSSProperties = {
  background: 'var(--theme-elevation-50, #1a1a1a)',
  borderBottom: '1px solid var(--theme-elevation-200, rgba(255,255,255,0.1))',
  fontFamily: 'var(--font-body, system-ui, sans-serif)',
  fontSize: '13px',
  color: 'var(--theme-text, #ccc)',
}

const tabStyle = (active: boolean): React.CSSProperties => ({
  padding: '3px 12px',
  borderRadius: '20px',
  fontSize: '11px',
  cursor: 'pointer',
  border: active ? '1px solid rgba(99,102,241,0.4)' : '1px solid var(--theme-elevation-200, #2a2a2a)',
  background: active ? 'rgba(99,102,241,0.2)' : 'var(--theme-elevation-100, #1e1e1e)',
  color: active ? '#a5b4fc' : 'var(--theme-elevation-600, #666)',
  transition: 'all 0.15s ease',
})

const btnPrimary: React.CSSProperties = {
  background: 'rgba(99,102,241,0.2)',
  color: '#a5b4fc',
  border: '1px solid rgba(99,102,241,0.3)',
  borderRadius: '4px',
  padding: '5px 14px',
  fontSize: '12px',
  cursor: 'pointer',
  fontWeight: 500,
}

const btnSecondary: React.CSSProperties = {
  background: 'var(--theme-elevation-100, #1e1e1e)',
  color: 'var(--theme-elevation-600, #888)',
  border: '1px solid var(--theme-elevation-200, #2a2a2a)',
  borderRadius: '4px',
  padding: '5px 12px',
  fontSize: '12px',
  cursor: 'pointer',
}

export const AiContentPlugin: React.FC<{ clientProps?: unknown }> = () => {
  const [editor] = useLexicalComposerContext()
  const docInfo = useDocumentInfo()
  const locale = useLocale()

  const [isOpen, setIsOpen] = useState(false)
  const [action, setAction] = useState<Action>('draft')
  const [prompt, setPrompt] = useState('')
  const [selectedText, setSelectedText] = useState('')
  const [tipsOpen, setTipsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [longWait, setLongWait] = useState(false)

  const abortRef = useRef<AbortController | null>(null)
  const longWaitTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return editor.registerCommand(
      OPEN_AI_PANEL_COMMAND,
      (payload) => {
        setSelectedText(payload ?? '')
        setIsOpen((prev) => {
          if (!prev) {
            setGenerated(null)
            setError(null)
            setPrompt('')
            if (payload) setAction('expand')
            else setAction('draft')
          }
          return !prev
        })
        return false
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor])

  const handleClose = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    if (longWaitTimer.current) clearTimeout(longWaitTimer.current)
    setIsOpen(false)
    setLoading(false)
    setGenerated(null)
    setError(null)
    setLongWait(false)
  }, [])

  const handleGenerate = useCallback(async () => {
    abortRef.current?.abort()
    const abort = new AbortController()
    abortRef.current = abort

    setLoading(true)
    setError(null)
    setGenerated(null)
    setLongWait(false)

    longWaitTimer.current = setTimeout(() => setLongWait(true), 8000)

    try {
      const res = await fetch('/api/seo/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          prompt: prompt.trim(),
          selectedText: selectedText.slice(0, 4000),
          collectionSlug: docInfo.collectionSlug ?? undefined,
          docId: docInfo.id ? String(docInfo.id) : undefined,
          locale: (locale as any)?.code ?? 'en',
        }),
        signal: abort.signal,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Generation failed')
        return
      }
      setGenerated(data.value)
    } catch (err) {
      if ((err as Error).name === 'AbortError') return
      setError('Generation failed. Please try again.')
    } finally {
      if (longWaitTimer.current) clearTimeout(longWaitTimer.current)
      setLoading(false)
      setLongWait(false)
    }
  }, [action, prompt, selectedText, docInfo, locale])

  const handleAccept = useCallback(() => {
    if (!generated) return
    const replaceSelection = action !== 'draft' && !!selectedText.trim()
    insertMarkdownContent(editor, generated, replaceSelection)
    handleClose()
  }, [editor, generated, action, selectedText, handleClose])

  if (!isOpen) return null

  const needsSelection = action !== 'draft'
  const missingSelection = needsSelection && !selectedText.trim()
  const canGenerate = !loading && !missingSelection && (action !== 'draft' || !!prompt.trim())

  return (
    <div style={panelStyle}>
      <div style={{ padding: '10px 14px 12px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#a5b4fc' }}>✨ AI Write</span>
          <button
            type="button"
            onClick={handleClose}
            title="Close"
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              color: 'var(--theme-elevation-500, #666)',
              cursor: 'pointer',
              fontSize: '16px',
              lineHeight: 1,
              padding: '0 2px',
            }}
          >
            ×
          </button>
        </div>

        {/* Action tabs */}
        <div style={{ display: 'flex', gap: '5px', marginBottom: '10px', flexWrap: 'wrap' }}>
          {(['draft', 'expand', 'rewrite', 'summarize'] as Action[]).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => {
                setAction(a)
                setGenerated(null)
                setError(null)
              }}
              style={tabStyle(action === a)}
            >
              {a.charAt(0).toUpperCase() + a.slice(1)}
            </button>
          ))}
        </div>

        {/* Selection warning */}
        {missingSelection && (
          <div
            style={{
              background: 'rgba(250,200,50,0.08)',
              border: '1px solid rgba(250,200,50,0.2)',
              borderRadius: '4px',
              padding: '6px 10px',
              fontSize: '11px',
              color: '#d4a700',
              marginBottom: '8px',
            }}
          >
            Select text in the editor first — then click ✨ AI again.
          </div>
        )}

        {/* Preview state */}
        {generated ? (
          <>
            <div
              style={{
                background: 'var(--theme-elevation-100, #111)',
                border: '1px solid var(--theme-elevation-200, #2a2a2a)',
                borderLeft: '2px solid #6366f1',
                borderRadius: '0 4px 4px 0',
                padding: '8px 10px',
                fontSize: '11px',
                color: 'var(--theme-elevation-700, #999)',
                lineHeight: '1.6',
                maxHeight: '140px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                marginBottom: '8px',
              }}
            >
              {generated}
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button type="button" onClick={handleAccept} style={btnPrimary}>
                ✓ Accept
              </button>
              <button
                type="button"
                onClick={() => {
                  setGenerated(null)
                  handleGenerate()
                }}
                style={btnSecondary}
              >
                ↺ Regenerate
              </button>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--theme-elevation-500, #666)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  marginLeft: 'auto',
                }}
              >
                Discard
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Prompt textarea */}
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={PLACEHOLDERS[action]}
              disabled={loading}
              rows={3}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && canGenerate) {
                  e.preventDefault()
                  handleGenerate()
                }
              }}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: loading
                  ? 'var(--theme-elevation-50, #0f0f0f)'
                  : 'var(--theme-elevation-100, #111)',
                border: '1px solid var(--theme-elevation-200, #2d2d2d)',
                borderRadius: '4px',
                padding: '7px 9px',
                color: loading ? 'var(--theme-elevation-500, #666)' : 'var(--theme-text, #bbb)',
                fontSize: '11px',
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit',
                lineHeight: '1.5',
                marginBottom: '8px',
              }}
            />

            {/* Tips */}
            <div
              style={{
                background: 'var(--theme-elevation-100, #111)',
                border: '1px solid var(--theme-elevation-150, #222)',
                borderRadius: '4px',
                padding: '6px 9px',
                marginBottom: '8px',
              }}
            >
              <button
                type="button"
                onClick={() => setTipsOpen((p) => !p)}
                style={{
                  display: 'flex',
                  width: '100%',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: '10px', color: '#a5b4fc' }}>💡</span>
                <span style={{ fontSize: '10px', color: 'var(--theme-elevation-600, #666)', fontWeight: 500 }}>
                  Tips for better results
                </span>
                <span style={{ fontSize: '9px', color: 'var(--theme-elevation-400, #555)', marginLeft: 'auto' }}>
                  {tipsOpen ? '▴' : '▾'}
                </span>
              </button>
              {tipsOpen && (
                <p
                  style={{
                    margin: '6px 0 0 0',
                    fontSize: '10px',
                    color: 'var(--theme-elevation-500, #666)',
                    lineHeight: '1.6',
                  }}
                >
                  {TIPS[action]}
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: '4px',
                  padding: '6px 10px',
                  fontSize: '11px',
                  color: '#f87171',
                  marginBottom: '8px',
                }}
              >
                {error}
              </div>
            )}

            {/* Generate row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {loading ? (
                <>
                  <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                    <span
                      style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: '#a5b4fc',
                        display: 'inline-block',
                      }}
                    />
                    <span
                      style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: '#a5b4fc',
                        opacity: 0.6,
                        display: 'inline-block',
                      }}
                    />
                    <span
                      style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: '#a5b4fc',
                        opacity: 0.3,
                        display: 'inline-block',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '11px', color: '#6366f1' }}>
                    {longWait ? 'Still generating…' : 'Generating…'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      abortRef.current?.abort()
                      setLoading(false)
                    }}
                    style={{
                      marginLeft: 'auto',
                      background: 'none',
                      border: 'none',
                      color: 'var(--theme-elevation-500, #666)',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={!canGenerate}
                    style={{
                      ...btnPrimary,
                      opacity: canGenerate ? 1 : 0.4,
                      cursor: canGenerate ? 'pointer' : 'not-allowed',
                    }}
                  >
                    ✨ Generate
                  </button>
                  <span style={{ fontSize: '10px', color: 'var(--theme-elevation-400, #555)' }}>⌘↵</span>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

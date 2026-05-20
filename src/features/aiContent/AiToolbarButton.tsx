'use client'

import React from 'react'
import { $getSelection, $isRangeSelection } from 'lexical'
import { COMMAND_PRIORITY_EDITOR } from 'lexical'
import type { LexicalEditor } from 'lexical'
import type { ToolbarGroupItem } from '@payloadcms/richtext-lexical'
import { OPEN_AI_PANEL_COMMAND } from './command'

interface Props {
  active?: boolean
  anchorElem: HTMLElement
  editor: LexicalEditor
  enabled?: boolean
  item: ToolbarGroupItem
}

export const AiToolbarButton: React.FC<Props> = ({ editor }) => {
  const handleClick = () => {
    const selectedText = editor.getEditorState().read(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection) && !selection.isCollapsed()) {
        return selection.getTextContent()
      }
      return null
    })
    editor.dispatchCommand(OPEN_AI_PANEL_COMMAND, selectedText)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title="AI Write"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        background: 'var(--theme-elevation-150, #222)',
        color: 'var(--theme-elevation-800, #aaa)',
        border: 'none',
        borderRadius: '3px',
        padding: '3px 8px',
        fontSize: '11px',
        cursor: 'pointer',
        lineHeight: '1',
        fontFamily: 'inherit',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.color =
          'var(--theme-elevation-1000, #ccc)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.color =
          'var(--theme-elevation-800, #aaa)'
      }}
    >
      <span>✨</span>
      <span>AI</span>
    </button>
  )
}

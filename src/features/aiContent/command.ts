import { createCommand, type LexicalCommand } from 'lexical'

export interface AiPanelContext {
  selectedText: string
  paragraphText: string
}

export const OPEN_AI_PANEL_COMMAND: LexicalCommand<AiPanelContext | null> =
  createCommand('OPEN_AI_PANEL_COMMAND')

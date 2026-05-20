import { createCommand, type LexicalCommand } from 'lexical'

export const OPEN_AI_PANEL_COMMAND: LexicalCommand<string | null> =
  createCommand('OPEN_AI_PANEL_COMMAND')

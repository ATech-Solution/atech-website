type Action = 'draft' | 'expand' | 'rewrite' | 'summarize'

interface PromptArgs {
  action: Action
  prompt: string
  selectedText?: string
  docTitle?: string
  docExcerpt?: string
  locale?: string
}

const BANNED_WORDS = [
  'delve', 'elevate', 'unlock', 'transform', 'empower', 'navigate', 'foster',
  'leverage', 'seamless', 'tailored', 'robust', 'groundbreaking', 'cutting-edge',
  'state-of-the-art', 'innovative', 'comprehensive', 'revolutionize',
]

export function buildContentPrompt(args: PromptArgs): { system: string; user: string } {
  const { action, prompt, selectedText = '', docTitle = '', docExcerpt = '', locale = 'en' } = args
  const lang = locale === 'id' ? 'Bahasa Indonesia' : 'English'

  const system = `You are a professional content writer. Write as a knowledgeable human expert.

Rules:
- NEVER use these words: ${BANNED_WORDS.join(', ')}
- Vary sentence lengths — mix short punchy sentences with longer elaborated ones
- Use active voice. Open with a specific claim or fact, never "In today's world..."
- Use specific examples and concrete details
- Short paragraphs (2-4 sentences). Use ## headers for sections where appropriate
- SEO: weave in semantically related terms naturally; one clear topic per paragraph
- Format: Markdown (## h2, **bold**, - bullets for lists)
- Language: Write in ${lang}`

  let user: string

  switch (action) {
    case 'draft': {
      const ctx = [docTitle, docExcerpt].filter(Boolean).join(' — ')
      user = `Write about: ${prompt}${ctx ? `\nDoc context: ${ctx}` : ''}
Write at least 300 words. Use ## headers to organize sections. Start with a specific, factual opening sentence.`
      break
    }

    case 'expand': {
      const capped = selectedText.slice(0, 4000)
      user = `Expand the following passage with more depth, examples, and detail:

"${capped}"

Direction: ${prompt || 'Add more examples and concrete detail.'}

Make the expanded version 2-3× longer than the original. Keep the same topic and perspective.`
      break
    }

    case 'rewrite': {
      const capped = selectedText.slice(0, 4000)
      user = `Rewrite the following passage to be clearer and more direct:

"${capped}"

Direction: ${prompt || 'Make it more concise and direct with shorter sentences.'}

Preserve the original meaning. Same word count or slightly shorter.`
      break
    }

    case 'summarize': {
      const capped = selectedText.slice(0, 4000)
      user = `Summarize the key points of the following passage in 2-4 sentences:

"${capped}"

Format preference: ${prompt || 'Plain sentences. Be specific, not vague.'}`
      break
    }
  }

  return { system, user }
}

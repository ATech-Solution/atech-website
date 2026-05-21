# Chatbot Plugin — Advanced Features Roadmap

> Features documented here are **not yet implemented**. Each section describes the design intent, data model changes, and implementation steps needed to ship that feature. Build them in order; each one builds on the previous.

---

## Table of Contents

1. [Availability Hours](#1-availability-hours)
2. [Free-Text Input with Fuzzy Matching](#2-free-text-input-with-fuzzy-matching)
3. [Keyword & URL Triggers](#3-keyword--url-triggers)
4. [Multi-Language Support](#4-multi-language-support)
5. [Conversation Export & CRM Sync](#5-conversation-export--crm-sync)
6. [Proactive Triggers (Exit-Intent / Scroll)](#6-proactive-triggers-exit-intent--scroll)
7. [Rich Media Answers](#7-rich-media-answers)

---

## 1. Availability Hours

Show an offline message when the current time is outside configured business hours.

### Current state

The `chatbot-settings` Global already has an **Availability** tab with these fields:

| Field | Type | Default |
|---|---|---|
| `enableAvailability` | checkbox | `false` |
| `hoursStart` | text | `09:00` |
| `hoursEnd` | text | `18:00` |
| `offlineMessage` | textarea | `"We're currently offline..."` |

The fields are saved to the database but the widget does not yet act on them.

### What to build

**In `ChatbotWidget/index.tsx`:**

```typescript
function isWithinBusinessHours(start: string, end: string): boolean {
  // Config stores HH:MM strings. Compare against current HKT time (UTC+8).
  const now = new Date()
  const hkt = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Hong_Kong' }))
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  const cur = hkt.getHours() * 60 + hkt.getMinutes()
  return cur >= sh * 60 + sm && cur < eh * 60 + em
}
```

When `config.enableAvailability` is true and `isWithinBusinessHours()` returns false:
- Replace the normal greeting message with `config.offlineMessage`
- Hide all Q&A options
- Show only a contact form (name + email) so the lead is captured even when offline
- Optionally still show the WhatsApp button if `defaultWhatsappUrl` is set

**No schema changes needed** — fields are already in the Global.

### Testing

- Set `hoursStart` to a time 1 minute in the future, open the widget — should show offline message.
- Set `hoursStart` to 1 minute ago, open the widget — should show normal greeting.

---

## 2. Free-Text Input with Fuzzy Matching

Let users type a question instead of picking from numbered options.

### Schema changes

Add to the `chatbot-settings` Global (General tab):

```typescript
{
  name: 'enableFreeText',
  type: 'checkbox',
  defaultValue: false,
  label: 'Enable free-text input',
},
{
  name: 'noMatchMessage',
  type: 'textarea',
  defaultValue: "Sorry, I didn't understand that. Please pick one of the options below, or contact us on WhatsApp.",
  label: 'No-match fallback message',
},
```

### Widget changes

When `enableFreeText` is true, the input row at the bottom of the chat window becomes active.

**Search logic (client-side, no server call):**

```typescript
function findBestMatch(query: string, nodes: ChatNode[]): ChatNode | null {
  const q = query.toLowerCase().trim()
  const scored = nodes.map(node => {
    const label = node.label.toLowerCase()
    // exact > starts-with > includes > word overlap
    if (label === q) return { node, score: 100 }
    if (label.startsWith(q)) return { node, score: 80 }
    if (label.includes(q)) return { node, score: 60 }
    const words = q.split(/\s+/)
    const hits = words.filter(w => label.includes(w)).length
    return { node, score: hits > 0 ? (hits / words.length) * 40 : 0 }
  })
  const best = scored.sort((a, b) => b.score - a.score)[0]
  return best && best.score >= 40 ? best.node : null
}
```

If a match is found, treat it as if the user tapped that option. If no match, show `noMatchMessage` and re-display the current options.

Track `free_text_submitted` and `free_text_no_match` events in `chatbot-events`.

### Migration

```bash
pnpm payload migrate:create --name chatbot_freetext_fields
pnpm payload migrate
```

---

## 3. Keyword & URL Triggers

Auto-open the widget or jump straight to a specific node based on the current page URL or a query parameter.

### No schema changes required for URL triggers

Everything is driven by URL query parameters:

| Parameter | Behaviour |
|---|---|
| `?chat=open` | Auto-opens the widget on page load |
| `?chat=node-3` | Opens the widget and immediately selects node at index 3 (0-based root level) |
| `?chat=contact` | Opens the widget and jumps directly to the contact form |

### Widget changes (`index.tsx`)

```typescript
useEffect(() => {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  const chat = params.get('chat')
  if (!chat) return

  if (chat === 'open') {
    setChatState('open')
  } else if (chat === 'contact') {
    setChatState('open')
    // push a synthetic contact-form message after greeting loads
    setTimeout(() => showContactForm(), 500)
  } else if (chat.startsWith('node-')) {
    const idx = parseInt(chat.replace('node-', ''), 10)
    setChatState('open')
    setTimeout(() => {
      const node = config?.nodes?.[idx]
      if (node) selectNode(node)
    }, 600)
  }
}, [config])
```

### Page-level keyword triggers (optional, schema-driven)

Add to each Q&A node in `ChatbotGlobal.ts`:

```typescript
{
  name: 'triggerKeywords',
  type: 'array',
  label: 'Auto-trigger keywords',
  admin: { description: 'Open widget and select this node when these words appear in the URL path' },
  fields: [{ name: 'keyword', type: 'text' }],
}
```

In the widget:

```typescript
useEffect(() => {
  if (!config?.nodes) return
  const path = window.location.pathname.toLowerCase()
  for (const node of config.nodes) {
    const keywords: string[] = (node.triggerKeywords ?? []).map((k: any) => k.keyword?.toLowerCase()).filter(Boolean)
    if (keywords.some(kw => path.includes(kw))) {
      setChatState('open')
      setTimeout(() => selectNode(node), 600)
      break
    }
  }
}, [config])
```

### Migration

```bash
pnpm payload migrate:create --name chatbot_trigger_keywords
pnpm payload migrate
```

---

## 4. Multi-Language Support

Serve the chatbot content in English and Indonesian, matching the site's existing Payload localization.

### Design

Payload already has `locales: ['en', 'id']`. The cleanest approach is to **localize the Global fields** rather than duplicating the entire tree.

### Schema changes (`ChatbotGlobal.ts`)

Add `localized: true` to text/textarea fields:

```typescript
{ name: 'botName', type: 'text', localized: true, ... },
{ name: 'greetingMessage', type: 'textarea', localized: true, ... },
{ name: 'offlineMessage', type: 'textarea', localized: true, ... },
```

And in `buildNodeFields`:

```typescript
{ name: 'label', type: 'text', localized: true, required: true },
{ name: 'answer', type: 'textarea', localized: true },
```

### API route (`config/route.ts`)

Accept a `locale` query param and pass it to `findGlobal`:

```typescript
export async function GET(request: NextRequest) {
  const locale = (request.nextUrl.searchParams.get('locale') ?? 'en') as 'en' | 'id'
  const settings = await payload.findGlobal({ slug: 'chatbot-settings', locale, fallbackLocale: 'en', depth: 5 })
  return NextResponse.json(settings)
}
```

### Widget changes (`index.tsx`)

Detect the page locale (Next.js `useParams()` or `document.documentElement.lang`) and pass it to the config fetch:

```typescript
const lang = document.documentElement.lang?.split('-')[0] ?? 'en'
const res = await fetch(`/api/plugins/chatbot/config?locale=${lang}`)
```

### Seed changes (`seed.ts`)

Supply Indonesian translations for all 9 nodes in the `seedChatbotContent` function, using Payload's `locale` option in `updateGlobal`:

```typescript
await payload.updateGlobal({
  slug: 'chatbot-settings',
  locale: 'id',
  data: { botName: 'Asisten ATech', greetingMessage: 'Halo, apa yang bisa saya bantu?...', nodes: idNodes },
})
```

### Migration

```bash
pnpm payload migrate:create --name chatbot_localization
pnpm payload migrate
```

**Important:** Run this migration before adding any localized content; it adds the `_locale` column to the underlying table.

---

## 5. Conversation Export & CRM Sync

Let admins download a conversation log as CSV or push leads directly to a CRM (e.g., HubSpot, Pipedrive).

### Export to CSV

Add a custom admin component `ChatbotExportButton.tsx` that calls:

```
GET /api/plugins/chatbot/export?format=csv&from=2026-01-01&to=2026-12-31
```

The route queries `chatbot-leads` and `chatbot-events`, joins them by `sessionId`, and streams a CSV response.

### CRM sync

Add to the lead API route (`lead/route.ts`):

```typescript
if (process.env.HUBSPOT_API_KEY) {
  // fire-and-forget
  syncToHubSpot({ name, email, question }).catch(err =>
    console.error('[Chatbot] HubSpot sync failed', err.message)
  )
}
```

New environment variable: `HUBSPOT_API_KEY` (optional). When absent, sync is skipped silently.

### Schema changes

Add `crmSyncedAt` (date, admin-only) to `ChatbotLeadsCollection.ts` to track which leads have been pushed.

---

## 6. Proactive Triggers (Exit-Intent / Scroll)

Open the notification bubble automatically based on user behaviour.

### Trigger types

| Trigger | Condition |
|---|---|
| Exit-intent | `mouseleave` event near top of viewport (desktop only) |
| Scroll depth | User scrolled ≥ 60% of page height |
| Time on page | User has been on page ≥ 30 seconds |
| Inactivity | No mouse/keyboard events for ≥ 20 seconds |

### Schema changes

Add to the Visibility tab of `ChatbotGlobal.ts`:

```typescript
{
  name: 'proactiveTrigger',
  type: 'select',
  options: ['none', 'exit_intent', 'scroll_depth', 'time_on_page', 'inactivity'],
  defaultValue: 'none',
},
{
  name: 'proactiveTriggerDelay',
  type: 'number',
  defaultValue: 30,
  admin: { description: 'Seconds (for time/inactivity) or percentage (for scroll)' },
},
```

### Widget changes (`index.tsx`)

Register event listeners based on `config.proactiveTrigger`. When triggered, show the notification bubble (same as the 3s auto-show, but respects the `chatbot_greeted` sessionStorage key).

### Migration

```bash
pnpm payload migrate:create --name chatbot_proactive_triggers
pnpm payload migrate
```

---

## 7. Rich Media Answers

Allow bot answers to include images, YouTube embeds, or file download links.

### Schema changes

Replace the `answer` textarea with a Payload **rich-text (Lexical)** field per node:

```typescript
import { lexicalEditor } from '@payloadcms/richtext-lexical'

{
  name: 'answerRichText',
  type: 'richText',
  editor: lexicalEditor({ features: ({ defaultFeatures }) => defaultFeatures }),
  label: 'Answer (rich text)',
  admin: { description: 'Supports bold, links, and images' },
}
```

Keep the plain-text `answer` field as a fallback for programmatic access. Populate one or the other.

### Widget changes (`index.tsx`)

Render `answerRichText` using a lightweight Lexical-to-React serializer, or fall back to the plain `answer` string:

```typescript
function renderAnswer(node: ChatNode) {
  if (node.answerRichText) return <LexicalRenderer content={node.answerRichText} />
  return <p>{node.answer}</p>
}
```

A minimal `LexicalRenderer` can be copy-pasted from the Payload docs — no external package needed.

### Migration

```bash
pnpm payload migrate:create --name chatbot_rich_text_answers
pnpm payload migrate
```

---

## Implementation Order

| # | Feature | Effort | Prerequisite |
|---|---|---|---|
| 1 | Availability Hours | Small — widget-only change | — |
| 2 | Free-Text Input | Medium — schema + widget | — |
| 3 | Keyword & URL Triggers | Small | — |
| 4 | Multi-Language | Large — schema + seed + API + widget | Run migration before content entry |
| 5 | CRM Sync / Export | Medium | — |
| 6 | Proactive Triggers | Small-Medium | — |
| 7 | Rich Media Answers | Medium | Understand Lexical serializer first |

---

## Environment Variables (new, added by advanced features)

| Variable | Feature | Required |
|---|---|---|
| `HUBSPOT_API_KEY` | CRM Sync | No — omit to disable |

All other env vars are already in use by the base plugin. See [chatbot-plugin.md](./chatbot-plugin.md#environment-variables).

# Chatbot Widget Plugin

> Self-contained Payload CMS plugin. Floating chat widget with nested Q&A tree, WhatsApp redirect, lead capture, and analytics.

---

## Overview

| Item | Value |
|---|---|
| Plugin slug | `chatbot` |
| Payload Global | `chatbot-settings` |
| Collections | `chatbot-leads`, `chatbot-events` |
| API routes | `GET /api/plugins/chatbot/config`, `POST /api/plugins/chatbot/lead`, `POST /api/plugins/chatbot/event` |
| Widget injection | `src/app/(frontend)/layout.tsx` |
| Admin nav | `src/components/admin/ChatbotNavLink.tsx` |
| Z-index | `9500` (below AdminBar at 9997) |

---

## File Structure

```
src/
├── plugins/
│   ├── chatbotPlugin.ts                    # Plugin factory (entry point)
│   └── chatbot/
│       ├── ChatbotGlobal.ts                # Payload Global schema
│       ├── ChatbotLeadsCollection.ts       # Contact form submissions
│       ├── ChatbotEventsCollection.ts      # Analytics events
│       └── seed.ts                         # Initial Q&A content seeder
├── app/api/plugins/chatbot/
│   ├── config/route.ts                     # GET — public config endpoint
│   ├── lead/route.ts                       # POST — save lead + email notify
│   └── event/route.ts                      # POST — analytics event
├── components/
│   ├── ChatbotWidget/
│   │   ├── index.tsx                       # Main React widget component
│   │   └── ChatbotWidget.css               # All styles (cb- namespaced)
│   └── admin/
│       └── ChatbotNavLink.tsx              # Admin sidebar nav link
docs/
├── chatbot-plugin.md                       # This file
└── chatbot-plugin-advanced.md              # Advanced features (future roadmap)
```

---

## Setup

### 1. Run database migration

After adding the plugin, Payload needs to create tables for the new Global and collections:

```bash
pnpm payload migrate:create --name chatbot_plugin
pnpm payload migrate
```

### 2. Start dev server

```bash
pnpm dev
```

The plugin self-seeds on first boot:
- Creates a record in the `plugins` collection
- Seeds the `chatbot-settings` Global with the 9 initial Q&A nodes

### 3. Verify

- Visit `/admin/globals/chatbot-settings` — see the Q&A tree
- Visit any frontend page — yellow FAB appears at bottom-right
- Click the FAB — chat window opens with greeting + 9 options

---

## Admin Configuration

Navigate to **Admin → Chatbot** (sidebar link) or directly to `/admin/globals/chatbot-settings`.

### General tab

| Field | Description |
|---|---|
| Widget Active | Toggle to show/hide the widget sitewide |
| Bot Name | Display name in the chat header (default: "ATech Assistant") |
| Greeting Message | First message shown when the user opens chat |
| Default WhatsApp URL | Fallback WhatsApp link (default: `https://wa.me/85297496042`) |
| Contact Form Title | Text shown above the name/email form |
| Lead Notification Email | Email to notify on new contact form submissions |

### Q&A Tree tab

Each node has:

| Field | Description |
|---|---|
| Button Label | Text shown as a numbered option |
| Answer | Bot reply (leave empty to use sub-questions instead) |
| Show contact form | If on, shows name+email form 3s after the answer |
| Show WhatsApp button | Shows WhatsApp button after the answer |
| WhatsApp URL override | Per-node WhatsApp URL (overrides global default) |
| Sub-questions | Nested child options (up to 3 levels in admin UI) |

**Drag to reorder** nodes using the handle on the left of each row.

### Visibility tab

| Field | Description |
|---|---|
| Show on All Pages | When on, widget appears everywhere (default) |
| Page Whitelist | Exact paths where widget appears when "all pages" is off (e.g. `/`, `/contact`) |

### Availability tab

| Field | Description |
|---|---|
| Enable Availability Hours | Show an offline message outside business hours |
| Business hours start/end | 24h format, HKT timezone (UTC+8) |
| Offline Message | Shown when outside business hours |

---

## Widget Behaviour

### State machine

```
CLOSED → OPEN         (click FAB)
OPEN   → NAVIGATING   (user selects an option)
NAVIGATING → ANSWER   (node has answer, no children)
NAVIGATING → DEEPER   (node has children → show sub-options)
ANSWER → CONTACT_FORM (if showContactForm = true, 3s delay)
ANSWER → QUICK_REPLY  (show "Anything else?" + root options)
CONTACT_FORM → SUCCESS (form submitted)
Any → MINIMIZED       (click — on open FAB)
Any → CLOSED          (click ✕ → resets conversation)
```

### Notification bubble

- Pops up 3 seconds after page load on first visit
- Stored in `sessionStorage` so it only shows once per browser session
- Dismissible with the ✕ button

### Unread badge

- Red badge on FAB showing `1` for new visitors
- Disappears when the user opens the chat

### Typing indicator

- 3-dot bounce animation plays before each bot reply
- Delay: 600–700ms — feels natural, not instant

### Back navigation

- `← Back` button appears in the options list when inside a sub-question level
- Pops the navigation stack and restores the parent options

### Minimize vs Close

- **Minimize** (click open FAB / `—` button): collapses to FAB, preserves conversation
- **Close** (✕ button): closes and resets conversation entirely

---

## Analytics

All events are stored in the `chatbot-events` Payload collection.

| Event | Trigger |
|---|---|
| `widget_opened` | User clicks FAB to open |
| `node_selected` | User clicks a question option |
| `answer_viewed` | A leaf node answer is displayed |
| `whatsapp_clicked` | User clicks the WhatsApp button |
| `contact_form_shown` | Contact form appears after 3s |
| `lead_submitted` | User submits name + email |
| `widget_closed` | User clicks ✕ |
| `back_navigated` | User clicks ← Back |

View events at `/admin/collections/chatbot-events`.

---

## Lead Capture

When a user submits the contact form:

1. `POST /api/plugins/chatbot/lead` saves the record to `chatbot-leads`
2. If `notifyEmail` is set in the Global, an email is sent via Payload's configured transport (AWS SES)
3. A success message replaces the form in the chat window

View leads at `/admin/collections/chatbot-leads`.

---

## Design Tokens

The widget uses CSS custom properties in `ChatbotWidget.css` that mirror the ATech site palette:

| Variable | Value | Usage |
|---|---|---|
| `--cb-bg` | `#292929` | Chat window background |
| `--cb-surface` | `#41403f` | Header, bot bubbles |
| `--cb-deep` | `#171717` | Input row, FAB icon fill |
| `--cb-border` | `#383838` | All borders |
| `--cb-text` | `#fafafa` | Primary text |
| `--cb-muted` | `#a3a3a3` | Secondary text, status |
| `--cb-accent` | `#ffd369` | FAB button, user bubbles, numbered badges |
| `--cb-accent2` | `#ffcd37` | Hover state for accent |
| `--cb-green` | `#16a34a` | WhatsApp button |
| `--cb-red` | `#ef4444` | Unread badge |
| `--cb-z` | `9500` | Z-index (below AdminBar) |

---

## Reusability

This plugin is designed to be self-contained and reusable across Payload CMS projects:

- **No hard dependency** on project-specific collections beyond `plugins` (optional — the self-seed gracefully skips if it doesn't exist)
- **All schema registered internally** — Global + 2 collections created by the plugin factory
- **Exported components** — `<ChatbotWidget />` can be dropped into any Next.js layout
- **Configurable via factory options** — extend `chatbotPlugin(options)` to pass defaults

To use in another project:
1. Copy `src/plugins/chatbotPlugin.ts` and `src/plugins/chatbot/`
2. Copy `src/components/ChatbotWidget/`
3. Copy API routes
4. Add `chatbotPlugin()` to `payload.config.ts` plugins array
5. Add `<ChatbotWidget />` to the frontend layout
6. Run migrations

---

## Environment Variables

No new environment variables required. The plugin uses:
- `DATABASE_URL` — already set (SQLite)
- `AWS_SES_SMTP_*` — already set (for lead notification emails)

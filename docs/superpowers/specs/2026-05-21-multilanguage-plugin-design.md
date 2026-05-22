# Multilanguage Plugin — Design Spec

**Date:** 2026-05-21  
**Status:** Approved  
**Author:** brainstorming session

---

## Context

The project already has Payload CMS localization configured (`en` + `id`, `defaultLocale: 'en'`, `fallback: true`). Many collections have `localized: true` fields. However the frontend is 0% functional for multilanguage:

- No locale routing (`/[locale]/...` structure)
- No `locale` param passed to any Payload query
- No language switcher UI
- Navigation and Settings globals have no localized fields

This spec defines a **reusable Multilanguage Plugin** — following the same factory pattern as `chatbotPlugin` and `backupRestorePlugin` — that packages the full multilanguage feature in one place and can be toggled active/inactive from the Payload admin.

**Extensibility requirement:** The plugin must support adding new languages later. Locale list is data-driven (from `LanguageSettings` global), not hardcoded.

---

## Architecture

### Two-layer design

**Layer 1 — One-time structural setup** (done during installation; cannot be toggled):
- All frontend routes moved into `src/app/(frontend)/[locale]/`
- All `src/lib/payload.ts` data-fetching functions gain a `locale?: string` parameter
- Locale block added to `src/middleware.ts`
- `localized: true` added to Navigation and Settings globals (+ Payload migration)

**Layer 2 — Runtime plugin** (controlled by active/inactive status in Plugins collection):
- `LanguageSettings` global holds admin-configurable options
- `LanguageSwitcher` component only renders when plugin is active
- Locale detection and auto-redirect only runs when plugin is active
- When inactive: site runs in English-only mode; `/en/...` routes still work silently

---

## Backend Plugin

### Files

| File | Purpose |
|---|---|
| `src/plugins/multilanguagePlugin.ts` | Plugin factory — registers `LanguageSettingsGlobal`, wires `onInit` seed |
| `src/plugins/multilanguage/LanguageSettingsGlobal.ts` | Payload global: admin-editable language settings |
| `src/plugins/multilanguage/seed.ts` | Seeds plugin entry in Plugins collection + default LanguageSettings |

### Plugin factory signature

```typescript
export const multilanguagePlugin = (): Plugin =>
  (incomingConfig: Config): Config => ({
    ...incomingConfig,
    globals: [...(incomingConfig.globals ?? []), LanguageSettingsGlobal],
    onInit: async (payload) => {
      if (incomingConfig.onInit) await incomingConfig.onInit(payload)
      await seedMultilanguage(payload)
    },
  })
```

### LanguageSettings global fields

| Field | Type | Description |
|---|---|---|
| `autoDetect` | boolean | Read `Accept-Language` header on `/` and redirect to detected locale |
| `showSwitcher` | boolean | Render the language switcher in the header |
| `switcherPosition` | select `header \| footer` | Where to render the switcher |
| `defaultLocale` | text | Locale code to fall back to (default: `en`) |
| `hreflangEnabled` | boolean | Inject `<link rel="alternate" hreflang="...">` tags in `<head>` |
| `activeLocales` | array | Which locales are live. Each entry: `{ code: text, label: text, enabled: boolean }` |

`activeLocales` drives the switcher UI and middleware validation. Adding a new language requires adding it to Payload's `localization.locales` config (code change) and then enabling it here (admin).

### Slug and seed

- Plugin slug: `multilanguage`
- Plugin type: `built-in`
- Seeded features: `locale-routing` (hook), `language-switcher` (script), `language-settings` (collection)
- `afterChange` hook on Plugins collection already calls `revalidateTag('plugins')` — no extra work needed

---

## Frontend Changes

### Route restructure

All pages move from `src/app/(frontend)/` into `src/app/(frontend)/[locale]/`:

```
src/app/(frontend)/[locale]/
├── layout.tsx              ← reads params.locale, sets <html lang>, fetches with locale
├── page.tsx                ← frontpage
├── error.tsx
├── loading.tsx
├── [...slug]/page.tsx      ← dynamic pages
└── static/
    ├── contact/page.tsx
    ├── about-us/page.tsx
    ├── article/page.tsx
    ├── article-detail/page.tsx
    ├── app-dev-service/page.tsx
    └── web-dev-service/page.tsx
```

The old `src/app/(frontend)/layout.tsx` is replaced with the `[locale]/layout.tsx`. A minimal redirect shim or `not-found.tsx` at the root handles any traffic that slips through without a locale prefix.

### lib/payload.ts updates

Every exported data-fetching function gains `locale?: string = 'en'`:

```typescript
export const getPage = unstable_cache(
  async (slug: string, locale: string = 'en') => { ... },
  ['page'],
  { tags: ['pages'] }
)
// Same pattern for: getFrontpage, getNavigation, getSettings, getTheme,
// getPortfolioItem, getPostItem, getBlockTemplates, etc.
```

Cache keys include locale to avoid cross-locale cache pollution:
```typescript
['page', locale]
```

### LanguageSwitcher component

`src/components/LanguageSwitcher.tsx` — client component:
- Reads current locale from the URL pathname (`/en/...` → `'en'`)
- Reads `activeLocales` from `LanguageSettings` (passed as a prop from layout)
- Renders a button per active locale; current locale is highlighted
- Clicking a locale: navigates to same path with new locale prefix + sets `NEXT_LOCALE` cookie
- Data-driven: if a new locale is added to `activeLocales`, it appears automatically

```
EN | ID   (highlighted: current locale)
```

### Header integration

`src/components/Header.tsx` receives `isMultilangActive: boolean` and `activeLocales` props from layout. Renders `<LanguageSwitcher />` only when active.

### hreflang tags

When `hreflangEnabled: true`, `[locale]/layout.tsx` injects into `<head>`:
```html
<link rel="alternate" hreflang="en" href="https://atech.software/en/..." />
<link rel="alternate" hreflang="id" href="https://atech.software/id/..." />
<link rel="alternate" hreflang="x-default" href="https://atech.software/en/..." />
```

---

## Middleware

Added to existing `src/middleware.ts` as a locale detection block. Runs only on frontend paths (excluding `/admin`, `/api`, `/_next`, static assets).

**Logic:**
```
1. Parse first path segment:
   - Known locale prefix (/en, /id, ...) → pass through, set NEXT_LOCALE cookie
   - No locale prefix → run detection

2. Detection (only when plugin is active):
   - Read NEXT_LOCALE cookie (user's persisted preference)
   - If no cookie and autoDetect=true → parse Accept-Language header
   - Fall back to defaultLocale

3. Redirect / → /{detectedLocale}/

4. If plugin is inactive → default to defaultLocale, no redirect
```

Plugin status is read from a lightweight cached DB call (`getActivePlugins()` already exists and is cached with the `plugins` tag).

---

## Collections/Globals requiring localized fields

These globals need `localized: true` added to user-facing text fields — requires a Payload migration:

| Global | Fields to localize |
|---|---|
| `Navigation` | Menu item labels, CTA button text, footer link labels |
| `Settings` | Site description, maintenance message |

The migration uses Payload's `migrate:create` + `migrate` workflow.

---

## Translation Manager (Content Management UI)

A key usability requirement: content editors and translators need a single place to see what content exists, what has been translated, and what is still missing — without hunting through every collection manually.

### Custom Admin View

The plugin registers a custom Payload admin view at `/admin/multilanguage/translations` via `admin.components.views`:

```
Plugin → registers:
  admin.components.views.multilanguage-translations → TranslationManagerView
```

### Translation Manager UI

```
┌─────────────────────────────────────────────────────────────────────┐
│  🌐 Translation Manager                              [ + Add Locale ]│
├──────────────────┬──────────────────┬──────────────────┬────────────┤
│  Collection      │  Total Items     │  EN              │  ID        │
├──────────────────┼──────────────────┼──────────────────┼────────────┤
│  Pages           │  12              │  ✅ 12/12        │  ⚠️  4/12  │
│  Posts           │  8               │  ✅  8/8         │  ⚠️  2/8   │
│  Portfolio       │  6               │  ✅  6/6         │  ❌  0/6   │
│  FAQs            │  15              │  ✅ 15/15        │  ⚠️  7/15  │
│  Testimonials    │  4               │  ✅  4/4         │  ✅  4/4   │
│  Navigation      │  Global          │  ✅ Complete     │  ❌ Missing │
│  Settings        │  Global          │  ✅ Complete     │  ⚠️  Partial│
└──────────────────┴──────────────────┴──────────────────┴────────────┘

  Clicking a row expands to show per-item translation status:

  ▼ Pages
  ┌──────────────────────────────────┬────────┬─────────────────┐
  │  Page Title (EN)                 │  ID    │  Action         │
  ├──────────────────────────────────┼────────┼─────────────────┤
  │  Home                            │  ✅    │  Edit           │
  │  About Us                        │  ⚠️    │  Translate →    │
  │  Services                        │  ❌    │  Translate →    │
  └──────────────────────────────────┴────────┴─────────────────┘
```

**Legend:**
- ✅ Complete — all localized fields have values in this locale
- ⚠️ Partial — some localized fields are missing
- ❌ Missing — no content in this locale at all

**"Translate →" button** links directly to the Payload document edit page with the target locale pre-selected in the admin locale switcher.

### API Route

`src/app/api/plugins/multilanguage/translation-status/route.ts`

- Queries each translatable collection/global using Payload's `locale=all` option
- Counts non-null/non-empty localized field values per locale
- Returns a structured JSON response consumed by the Translation Manager view
- Cached with `revalidateTag('multilang-status')`, busted on any `afterChange` hook across translatable collections

### Files

| File | Purpose |
|---|---|
| `src/plugins/multilanguage/TranslationManagerView.tsx` | Custom Payload admin React component |
| `src/app/api/plugins/multilanguage/translation-status/route.ts` | Translation completeness API |

---

## Payload Config Registration

In `src/payload.config.ts`:
```typescript
import { multilanguagePlugin } from '@/plugins/multilanguagePlugin'

plugins: [
  multilanguagePlugin(),
  // ...existing plugins
]
```

---

## Data Flow (request lifecycle)

```
Browser → /id/about-us
  → middleware.ts:
      locale = 'id' (from URL)
      plugin active? yes
      set NEXT_LOCALE=id cookie
      pass through

  → [locale]/layout.tsx:
      params.locale = 'id'
      const settings = await getLanguageSettings()  // cached
      const nav = await getNavigation('id')
      const theme = await getTheme('id')
      render <html lang="id">
      render <LanguageSwitcher activeLocales={settings.activeLocales} />

  → [...slug]/page.tsx:
      params.locale = 'id'
      const page = await getPage(slug, 'id')
      render page content in Indonesian (fallback to English if missing)
```

---

## API Route

`src/app/api/plugins/multilanguage/settings/route.ts` — public GET endpoint:
- Returns `activeLocales`, `showSwitcher`, `switcherPosition` for client-side use
- Used by LanguageSwitcher if needed without a server component

---

## Adding New Languages (extensibility)

To add a third language (e.g., Chinese `zh`):
1. Add `{ label: 'Chinese', code: 'zh' }` to `localization.locales` in `payload.config.ts`
2. Run `pnpm payload migrate:create && pnpm payload migrate` (Payload adds locale columns)
3. In Payload admin → Language Settings → Active Locales → add `zh` entry, `enabled: true`
4. LanguageSwitcher and middleware pick it up automatically — no code change

---

## Implementation Steps

1. **Plugin backend** — `multilanguagePlugin.ts`, `LanguageSettingsGlobal.ts`, `seed.ts`
2. **payload.config.ts** — register plugin
3. **Migration** — add `localized: true` to Navigation and Settings globals
4. **lib/payload.ts** — add `locale` param to all functions, update cache keys
5. **Route restructure** — move all pages into `[locale]/`, update imports
6. **[locale]/layout.tsx** — read locale, pass to fetches, set `<html lang>`, hreflang
7. **Middleware** — add locale detection block
8. **LanguageSwitcher component** — data-driven, cookie persistence
9. **Header** — wire in LanguageSwitcher
10. **Translation Manager** — `TranslationManagerView.tsx`, translation-status API route, register admin view in plugin
11. **Run dev** — verify no TypeScript errors, test EN and ID routes, visit `/admin/multilanguage/translations`

---

## Verification

1. `pnpm tsc --noEmit` — no errors
2. `pnpm dev` — server starts clean
3. Visit `/` → redirects to `/en/` (autoDetect on, browser is English)
4. Visit `/id/` → same page, Indonesian content where translations exist; English fallback elsewhere
5. Click `ID` in header → switches to `/id/` equivalent, sets cookie
6. Refresh → stays on `/id/` (cookie persists)
7. Deactivate plugin in admin → switcher disappears, `/en/` still works, no redirect on `/`
8. Add content translation in Payload admin for one Page in Indonesian → verify appears at `/id/...`
9. Check `<html lang="id">` on Indonesian pages
10. Check `<link rel="alternate" hreflang>` in page source when hreflangEnabled

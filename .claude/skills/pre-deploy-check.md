---
name: pre-deploy-check
description: Run full pre-deployment testing suite for the ATech website — smoke tests, Playwright e2e, and present a final pass/fail report. Use before every production deploy.
metadata:
  type: reference
---

# Pre-Deploy Check Skill

Run this skill before every production deployment. It verifies that all pages, APIs, navigation, forms, and mobile layouts work correctly against both local dev and UAT.

## Step 1 — TypeScript + Lint (local)

```bash
npx tsc --noEmit --project tsconfig.json
npm run lint
```

Report any errors. Stop if TypeScript fails — fix before proceeding.

## Step 2 — Smoke tests (local)

Ensure the dev server is running (`npm run dev`), then:

```bash
bash scripts/pre-deploy-check.sh
```

Report the full output table (PASS/FAIL per tier). If any fail, investigate before continuing.

## Step 3 — Playwright e2e (local)

```bash
npm run test:e2e
```

After the run, open the HTML report:
```bash
npx playwright show-report
```

Report: total passed, failed, any screenshots from failures.

## Step 4 — UAT smoke tests (post-deploy)

After pushing to `dev` and waiting for the UAT deploy to complete:

```bash
bash scripts/pre-deploy-check.sh --uat
```

## Step 5 — UAT Playwright e2e

```bash
npm run test:e2e:uat
```

## Step 6 — Admin plugin check

Visit `/admin/plugins/site-testing` and click **Run Tests Now** (select UAT). Confirm the on-screen results match the CLI output.

## Step 7 — Final verdict

Present a summary table:

| Tier | Local | UAT |
|------|-------|-----|
| TypeScript | ✅/❌ | — |
| Pages | ✅/❌ | ✅/❌ |
| Admin | ✅/❌ | ✅/❌ |
| API | ✅/❌ | ✅/❌ |
| Assets | ✅/❌ | ✅/❌ |
| Playwright | ✅/❌ | ✅/❌ |

**PASS** = safe to promote to production.  
**FAIL** = fix issues before promoting.

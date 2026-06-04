import { NextRequest, NextResponse } from 'next/server'

// ─── Test definitions ─────────────────────────────────────────────────────────

interface TestDef {
  id: string
  tier: string
  label: string
  method?: string
  path: string
  expectStatus?: number
  expectJson?: boolean
  tag?: string
}

const TESTS: TestDef[] = [
  // Tier 1 — Key Pages (all locales)
  { id: 'home-en',      tier: 'Pages',    label: 'Homepage (EN)',        path: '/en' },
  { id: 'home-zh-hk',  tier: 'Pages',    label: 'Homepage (ZH-HK)',     path: '/zh-hk' },
  { id: 'home-zh-cn',  tier: 'Pages',    label: 'Homepage (ZH-CN)',     path: '/zh-cn' },
  { id: 'home-id',     tier: 'Pages',    label: 'Homepage (ID)',         path: '/id' },
  { id: 'about',       tier: 'Pages',    label: 'About Us',              path: '/en/about-us' },
  { id: 'contact',     tier: 'Pages',    label: 'Contact',               path: '/en/contact' },
  { id: 'faq',         tier: 'Pages',    label: 'FAQ',                   path: '/en/faq' },
  { id: 'portfolio',   tier: 'Pages',    label: 'Portfolio',             path: '/en/portfolio' },
  { id: 'insights',    tier: 'Pages',    label: 'Insights',              path: '/en/insight' },
  { id: 'qa-svc',      tier: 'Pages',    label: 'QA Testing Service',    path: '/en/services/qa-testing' },
  { id: 'web-svc',     tier: 'Pages',    label: 'Web Development',       path: '/en/services/web-development' },
  { id: 'app-svc',     tier: 'Pages',    label: 'App Development',       path: '/en/services/app-development' },
  { id: 'who-serve',   tier: 'Pages',    label: 'Who We Serve',          path: '/en/who-we-serve' },
  { id: 'involved',    tier: 'Pages',    label: 'Get Involved',          path: '/en/get-involved' },

  // Tier 2 — Admin
  { id: 'admin',       tier: 'Admin',    label: 'Admin Dashboard',       path: '/admin' },

  // Tier 3 — API Health
  { id: 'api-maint',   tier: 'API',      label: '/api/maintenance-status', path: '/api/maintenance-status', expectJson: true },
  { id: 'api-theme',   tier: 'API',      label: '/api/theme',              path: '/api/theme',              expectJson: true },
  { id: 'api-ml',      tier: 'API',      label: '/api/plugins/multilanguage/settings', path: '/api/plugins/multilanguage/settings', expectJson: true },
  { id: 'api-fb',      tier: 'API',      label: '/api/plugins/form-builder/stats (auth)',  path: '/api/plugins/form-builder/stats', expectStatus: 401 },

  // Tier 4 — Static assets
  { id: 'favicon',     tier: 'Assets',   label: 'Favicon',               path: '/favicon.ico',  expectStatus: 200 },
  { id: 'robots',      tier: 'Assets',   label: 'robots.txt',            path: '/robots.txt',   expectStatus: 200 },
]

// ─── Runner ───────────────────────────────────────────────────────────────────

async function runTest(def: TestDef, base: string): Promise<{
  id: string
  tier: string
  label: string
  status: 'pass' | 'fail' | 'warn'
  httpStatus: number | null
  message: string
  durationMs: number
}> {
  const url = `${base}${def.path}`
  const expectedStatus = def.expectStatus ?? 200
  const start = Date.now()

  try {
    const res = await fetch(url, {
      method: def.method ?? 'GET',
      headers: { 'User-Agent': 'ATech-SiteTesting/1.0' },
      redirect: 'follow',
      signal: AbortSignal.timeout(10_000),
    })

    const durationMs = Date.now() - start
    const httpStatus = res.status

    if (httpStatus === expectedStatus || (expectedStatus === 200 && httpStatus < 400)) {
      if (def.expectJson) {
        const ct = res.headers.get('content-type') ?? ''
        if (!ct.includes('json')) {
          return { id: def.id, tier: def.tier, label: def.label, status: 'warn', httpStatus, message: `Expected JSON, got ${ct}`, durationMs }
        }
      }
      return { id: def.id, tier: def.tier, label: def.label, status: 'pass', httpStatus, message: `${httpStatus} OK`, durationMs }
    }

    return { id: def.id, tier: def.tier, label: def.label, status: 'fail', httpStatus, message: `Expected ${expectedStatus}, got ${httpStatus}`, durationMs }
  } catch (err) {
    const durationMs = Date.now() - start
    const msg = err instanceof Error ? err.message : 'Request failed'
    return { id: def.id, tier: def.tier, label: def.label, status: 'fail', httpStatus: null, message: msg, durationMs }
  }
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const target = (body.target as string) ?? 'local'

    const base =
      target === 'uat'
        ? 'https://uat.atech.software'
        : `${req.nextUrl.protocol}//${req.nextUrl.host}`

    const results = await Promise.all(TESTS.map((t) => runTest(t, base)))

    const pass = results.filter((r) => r.status === 'pass').length
    const fail = results.filter((r) => r.status === 'fail').length
    const warn = results.filter((r) => r.status === 'warn').length

    return NextResponse.json({
      target,
      base,
      runAt: new Date().toISOString(),
      summary: { total: results.length, pass, fail, warn },
      results,
    })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ tests: TESTS.length, tiers: [...new Set(TESTS.map((t) => t.tier))] })
}

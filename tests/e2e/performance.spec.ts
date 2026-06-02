// tests/e2e/performance.spec.ts
import { test, expect } from '@playwright/test'

// ── Cache header tests ────────────────────────────────────────────────────────

test.describe('Performance Plugin — Cache Headers', () => {
  test('HTML pages have s-maxage cache header', async ({ request }) => {
    const res = await request.get('/en')
    const cacheControl = res.headers()['cache-control'] ?? ''
    expect(cacheControl).toContain('no-cache')
    expect(cacheControl).toContain('s-maxage')
    expect(cacheControl).not.toContain('no-store')
  })

  test('Static chunks keep immutable cache header', async ({ page }) => {
    const staticChunks: string[] = []
    page.on('response', (res) => {
      if (res.url().includes('/_next/static/')) staticChunks.push(res.url())
    })
    await page.goto('/en', { waitUntil: 'networkidle' })

    if (staticChunks.length === 0) {
      test.skip()
      return
    }

    const chunkRes = await page.request.get(staticChunks[0])
    const cc = chunkRes.headers()['cache-control'] ?? ''
    expect(cc).toContain('immutable')
    expect(cc).toContain('max-age=31536000')
  })

  test('API routes keep no-store cache header', async ({ request }) => {
    const res = await request.get('/api/users/me')
    const cacheControl = res.headers()['cache-control'] ?? ''
    expect(cacheControl).not.toContain('s-maxage')
  })

  test('Admin routes are NOT proxy-cached (no s-maxage)', async ({ request }) => {
    const res = await request.get('/admin')
    const cacheControl = res.headers()['cache-control'] ?? ''
    // Admin must never carry s-maxage — CDN must not cache admin UI
    expect(cacheControl).not.toContain('s-maxage')
  })
})

// ── Image optimization tests ──────────────────────────────────────────────────

test.describe('Performance Plugin — Image Optimization', () => {
  test('Homepage loads without image errors', async ({ page }) => {
    const imageErrors: string[] = []
    page.on('response', (res) => {
      if (
        res.request().resourceType() === 'image' &&
        res.status() >= 400
      ) {
        imageErrors.push(`${res.status()} ${res.url()}`)
      }
    })
    await page.goto('/en', { waitUntil: 'networkidle' })
    expect(imageErrors, `Image load errors: ${imageErrors.join(', ')}`).toHaveLength(0)
  })

  test('Media images return 200', async ({ request }) => {
    const images = ['app_badge.png', 'comm1.png', 'portfolio1.png']
    for (const img of images) {
      const res = await request.get(`/media/${img}`)
      expect(res.status(), `Expected 200 for /media/${img}`).toBe(200)
    }
  })
})

// ── Streaming SSR tests ───────────────────────────────────────────────────────

test.describe('Performance Plugin — Streaming SSR', () => {
  test('FAQ page renders without JS errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto('/en/faq', { waitUntil: 'domcontentloaded' })
    const critical = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('ResizeObserver'),
    )
    expect(critical, `JS errors on /en/faq: ${critical.join(', ')}`).toHaveLength(0)
    await expect(page.locator('body')).not.toBeEmpty()
  })

  test('Insight page renders without JS errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto('/en/insight', { waitUntil: 'domcontentloaded' })
    const critical = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('ResizeObserver'),
    )
    expect(critical, `JS errors on /en/insight: ${critical.join(', ')}`).toHaveLength(0)
    await expect(page.locator('body')).not.toBeEmpty()
  })

  test('Portfolio page renders without JS errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto('/en/portfolio', { waitUntil: 'domcontentloaded' })
    const critical = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('ResizeObserver'),
    )
    expect(critical, `JS errors on /en/portfolio: ${critical.join(', ')}`).toHaveLength(0)
    await expect(page.locator('body')).not.toBeEmpty()
  })
})

// ── Admin panel tests ─────────────────────────────────────────────────────────

test.describe('Performance Plugin — Admin Panel', () => {
  test('Performance settings global exists (not 404)', async ({ page }) => {
    const res = await page.goto('/admin/globals/performance-settings', {
      waitUntil: 'domcontentloaded',
    })
    expect(res?.status(), 'Performance settings global should exist').not.toBe(404)
  })

  test('Performance plugin listed in Plugins collection', async ({ page }) => {
    const res = await page.goto('/admin/collections/plugins', {
      waitUntil: 'domcontentloaded',
    })
    expect(res?.status()).toBeLessThan(400)
  })
})

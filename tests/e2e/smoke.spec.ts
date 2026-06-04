import { test, expect } from '@playwright/test'

// All key pages must return 200 and render an <h1> or content
const PAGES = [
  { path: '/en',                    label: 'Homepage EN' },
  { path: '/zh-hk',                 label: 'Homepage ZH-HK' },
  { path: '/zh-cn',                 label: 'Homepage ZH-CN' },
  { path: '/id',                    label: 'Homepage ID' },
  { path: '/en/about-us',           label: 'About Us' },
  { path: '/en/contact',            label: 'Contact' },
  { path: '/en/faq',                label: 'FAQ' },
  { path: '/en/portfolio',          label: 'Portfolio' },
  { path: '/en/insight',            label: 'Insights' },
  { path: '/en/services/qa-testing',      label: 'QA Testing Service' },
  { path: '/en/services/web-development', label: 'Web Development' },
  { path: '/en/who-we-serve',       label: 'Who We Serve' },
  { path: '/en/get-involved',       label: 'Get Involved' },
]

for (const { path, label } of PAGES) {
  test(`[Smoke] ${label} — loads without error`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))

    const res = await page.goto(path, { waitUntil: 'domcontentloaded' })
    expect(res?.status(), `Expected 200 for ${path}`).toBeLessThan(400)

    // Page should have some visible content
    await expect(page.locator('body')).not.toBeEmpty()

    // No critical JS errors
    const criticalErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('ResizeObserver')
    )
    expect(criticalErrors, `JS errors on ${path}: ${criticalErrors.join(', ')}`).toHaveLength(0)
  })
}

test('[Smoke] Admin dashboard loads', async ({ page }) => {
  const res = await page.goto('/admin', { waitUntil: 'domcontentloaded' })
  expect(res?.status()).toBeLessThan(400)
  await expect(page.locator('body')).not.toBeEmpty()
})

test('[Smoke] robots.txt accessible', async ({ page }) => {
  const res = await page.goto('/robots.txt')
  expect(res?.status()).toBe(200)
})

test('[Smoke] sitemap accessible', async ({ page }) => {
  const res = await page.goto('/sitemap.xml')
  expect(res?.status()).toBeLessThan(400)
})

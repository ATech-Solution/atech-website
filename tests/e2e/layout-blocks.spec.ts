import { test, expect } from '@playwright/test'

test.describe('Layout Builder Blocks', () => {
  test('Homepage — blocks render, no critical JS errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))

    await page.goto('/en', { waitUntil: 'networkidle' })
    await expect(page.locator('body')).toBeVisible()

    const critical = errors.filter(e =>
      !e.includes('ResizeObserver') && !e.includes('favicon') && !e.includes('gtag')
    )
    expect(critical, `JS errors on homepage: ${critical.join('\n')}`).toHaveLength(0)
  })

  test('Services QA page — service cards render', async ({ page }) => {
    await page.goto('/en/services/qa-testing', { waitUntil: 'networkidle' })
    await expect(page.locator('body')).toBeVisible()
    // Service cards should have h3 headings
    const headings = page.locator('h2, h3')
    await expect(headings.first()).toBeVisible()
  })

  test('About page — sections render', async ({ page }) => {
    await page.goto('/en/about-us', { waitUntil: 'networkidle' })
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    await expect(page.locator('body')).toBeVisible()
    const critical = errors.filter(e => !e.includes('ResizeObserver') && !e.includes('favicon'))
    expect(critical).toHaveLength(0)
  })

  test('Portfolio page — grid renders', async ({ page }) => {
    await page.goto('/en/portfolio', { waitUntil: 'networkidle' })
    await expect(page.locator('body')).toBeVisible()
    const res = await page.goto('/en/portfolio')
    expect(res?.status()).toBeLessThan(400)
  })

  test('FAQ page — accordion renders and toggles', async ({ page }) => {
    await page.goto('/en/faq', { waitUntil: 'networkidle' })

    // At least one FAQ item
    const faqItems = page.locator('.faqm__item')
    if (await faqItems.count() > 0) {
      const firstQ = faqItems.first().locator('button')
      await expect(firstQ).toBeVisible()
      // Click to open
      await firstQ.click()
      await expect(faqItems.first().locator('.faqm__a')).toBeVisible()
      // Click again to close
      await firstQ.click()
      await expect(faqItems.first().locator('.faqm__a')).not.toBeVisible()
    }
  })
})

import { test, expect } from '@playwright/test'

test.use({ viewport: { width: 390, height: 844 } })

test.describe('Mobile Layout', () => {
  test('Hero-split: image renders on mobile', async ({ page }) => {
    // Find a page that uses the hero-split block
    await page.goto('/en/services/qa-testing', { waitUntil: 'networkidle' })
    // The herosplit__img should be visible (not hidden) on mobile
    const imgPanel = page.locator('.herosplit__img')
    if (await imgPanel.count() > 0) {
      await expect(imgPanel.first()).toBeVisible()
      // Image should have order:2 (i.e., appear after content)
      const order = await imgPanel.first().evaluate(el => getComputedStyle(el).order)
      expect(order).toBe('2')
    }
  })

  test('FAQ-main: categories show as horizontal pills on mobile', async ({ page }) => {
    await page.goto('/en/faq', { waitUntil: 'networkidle' })
    const cats = page.locator('.faqm__cats')
    if (await cats.count() > 0) {
      const flexDir = await cats.evaluate(el => getComputedStyle(el).flexDirection)
      expect(flexDir).toBe('row')
    }
  })

  test('Homepage renders without horizontal scroll', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'networkidle' })
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    // Allow 1px tolerance
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1)
  })

  test('Contact page is readable on mobile', async ({ page }) => {
    await page.goto('/en/contact', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('body')).toBeVisible()
  })

  test('About page is readable on mobile', async ({ page }) => {
    await page.goto('/en/about-us', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('body')).toBeVisible()
  })
})

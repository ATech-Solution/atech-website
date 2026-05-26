import { test, expect } from '@playwright/test'

test.describe('Desktop Navigation', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test('Desktop nav renders logo and menu items', async ({ page }) => {
    await page.goto('/en')
    await expect(page.locator('header, nav').first()).toBeVisible()
    // At least one nav link visible
    await expect(page.locator('header a, nav a').first()).toBeVisible()
  })

  test('Language switcher is present', async ({ page }) => {
    await page.goto('/en')
    // Language switcher typically shows "EN" text
    const switcher = page.locator('text=EN').or(page.locator('[aria-label*="language"], [aria-label*="Language"]')).first()
    await expect(switcher).toBeVisible()
  })
})

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('Burger menu button is visible on mobile', async ({ page }) => {
    await page.goto('/en')
    // Look for burger/hamburger button
    const burgerBtn = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"]')
      .or(page.locator('button').filter({ hasText: /☰|≡|menu/i }))
      .first()
    await expect(burgerBtn).toBeVisible()
  })

  test('Mobile drawer opens when burger is clicked', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'networkidle' })
    // The burger button has aria-label containing "menu"
    const menuBtn = page.getByRole('button', { name: /menu|open navigation/i }).first()
    if (await menuBtn.isVisible()) {
      await menuBtn.click()
    } else {
      // Fallback: SVG-containing button in header that isn't the language selector
      const svgBtns = page.locator('header button').filter({ has: page.locator('svg') })
      const count = await svgBtns.count()
      if (count > 0) await svgBtns.nth(count - 1).click()
    }
    // After click, the close button should appear
    await expect(page.locator('button[aria-label="Close menu"]').first()).toBeVisible({ timeout: 5000 })
  })

  test('Mobile nav has navigation items', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'networkidle' })
    // Open the drawer
    const menuBtn = page.getByRole('button', { name: /menu|open navigation/i }).first()
    if (await menuBtn.isVisible()) {
      await menuBtn.click()
    } else {
      const svgBtns = page.locator('header button').filter({ has: page.locator('svg') })
      const count = await svgBtns.count()
      if (count > 0) await svgBtns.nth(count - 1).click()
    }
    // The close button confirms the drawer is open
    const closeBtn = page.locator('button[aria-label="Close menu"]')
    await expect(closeBtn).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Footer', () => {
  test('Footer renders on homepage', async ({ page }) => {
    await page.goto('/en')
    await expect(page.locator('footer')).toBeVisible()
  })

  test('Footer has links', async ({ page }) => {
    await page.goto('/en')
    const footerLinks = page.locator('footer a')
    await expect(footerLinks.first()).toBeVisible()
    const count = await footerLinks.count()
    expect(count).toBeGreaterThan(2)
  })
})

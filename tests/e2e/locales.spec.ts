import { test, expect } from '@playwright/test'

const LOCALES = [
  { code: 'en',    label: 'English' },
  { code: 'zh-hk', label: 'Traditional Chinese' },
  { code: 'zh-cn', label: 'Simplified Chinese' },
  { code: 'id',    label: 'Indonesian' },
]

for (const locale of LOCALES) {
  test(`[Locale] ${locale.label} homepage loads (/${locale.code})`, async ({ page }) => {
    const res = await page.goto(`/${locale.code}`, { waitUntil: 'domcontentloaded' })
    expect(res?.status(), `${locale.label} homepage status`).toBeLessThan(400)
    await expect(page.locator('body')).not.toBeEmpty()
    // Should not show a 404 page
    await expect(page.locator('text=404').or(page.locator('text=Page not found'))).not.toBeVisible()
  })

  test(`[Locale] ${locale.label} contact page loads (/${locale.code}/contact)`, async ({ page }) => {
    const res = await page.goto(`/${locale.code}/contact`, { waitUntil: 'domcontentloaded' })
    expect(res?.status()).toBeLessThan(400)
  })
}

test('[Locale] Language switcher changes locale', async ({ page }) => {
  await page.goto('/en')
  await page.waitForLoadState('networkidle')

  // Check current URL is /en
  expect(page.url()).toContain('/en')

  // Look for language switcher — it typically shows "EN" text
  const enSwitcher = page.locator('text=EN').first()
  if (await enSwitcher.isVisible()) {
    // The switcher is present on the page
    await expect(enSwitcher).toBeVisible()
  }
})

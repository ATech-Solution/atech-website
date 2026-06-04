import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    screenshot: 'only-on-failure',
    video: 'off',
    trace: 'on-first-retry',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },
  projects: [
    {
      name: 'local',
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:3000' },
    },
    {
      name: 'local-mobile',
      use: { ...devices['iPhone 13'], baseURL: 'http://localhost:3000' },
    },
    {
      name: 'uat',
      use: { ...devices['Desktop Chrome'], baseURL: 'https://uat.atech.software' },
    },
    {
      name: 'uat-mobile',
      use: { ...devices['iPhone 13'], baseURL: 'https://uat.atech.software' },
    },
  ],
})

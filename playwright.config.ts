import { defineConfig } from '@playwright/test';

// API testing doesn't launch a browser, so there are no browser `projects`
// here — every test runs through Playwright's `request` context against the
// configured baseURL. Suites are separated by tag (@smoke, @e2e, @negative)
// via the npm scripts rather than by project.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never' }]]
    : 'html',

  use: {
    baseURL: process.env.BASE_URL ?? 'https://restful-booker.herokuapp.com',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    trace: 'on-first-retry',
  },

  timeout: 30_000,
  expect: { timeout: 10_000 },
});

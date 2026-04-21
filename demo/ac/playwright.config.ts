import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:10088',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 414, height: 896 },
        launchOptions: {
          executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
      },
    },
  ],
})

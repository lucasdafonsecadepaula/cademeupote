import type { PlaywrightTestConfig } from '@playwright/test'
import { devices } from '@playwright/test'

// Use a distinct port on CI to avoid conflicts during concurrent tests
const PORT = process.env.CI ? 3001 : 3000

const config: PlaywrightTestConfig = {
  retries: process.env.CI ? 1 : 0,
  testDir: './tests',
  projects: [
    {
      name: 'chromium',
      use: devices['Desktop Firefox'],
    },
  ],
  fullyParallel: true,
  use: {
    // headless: false,
  },
  webServer: {
    command: `PORT=${PORT} npm start`,
    port: PORT,
    reuseExistingServer: true,
  },
}

export default config

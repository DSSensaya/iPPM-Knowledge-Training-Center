import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';
const executablePath =
  process.env.PLAYWRIGHT_EXECUTABLE_PATH ||
  (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);

const port = Number(process.env.PLAYWRIGHT_PORT || 4173);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './tests',
  testMatch: ['content.spec.ts', 'reader.spec.ts', 'editor.spec.ts', 'editor-api.spec.ts'],
  fullyParallel: true,
  workers: 2,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'retain-on-failure',
    channel: executablePath ? undefined : process.env.PLAYWRIGHT_CHANNEL || 'chrome',
    launchOptions: { executablePath },
  },
  projects: [
    { name: 'integrity', testMatch: ['content.spec.ts', 'editor-api.spec.ts'] },
    {
      name: 'desktop',
      testMatch: ['reader.spec.ts', 'editor.spec.ts'],
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1100 } },
    },
    {
      name: 'mobile',
      testMatch: ['reader.spec.ts', 'editor.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: `npm run preview -- --port ${port} --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});

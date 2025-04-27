import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'bun run dev',
    port: 3001,
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3001',
    ...devices['Desktop Chrome'],
  },
});

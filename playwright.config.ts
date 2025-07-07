import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'npm run dev:web',
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: true,
  },
});

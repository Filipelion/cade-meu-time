const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 5_000,
  // Extension tests share one persistent Chrome context per worker.
  // Keep workers at 1 so all spec files run in a single worker and share that context.
  workers: 1,
});

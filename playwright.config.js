import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 10_000,
  // Extension tests share one persistent Chrome context per worker.
  // Keep workers at 1 so all spec files run in a single worker and share that context.
  workers: 1,
});

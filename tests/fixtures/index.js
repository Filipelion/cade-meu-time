const { test: base, expect, chromium } = require('@playwright/test');
const path = require('path');
const { mkdtempSync } = require('fs');
const { tmpdir } = require('os');

const EXTENSION_PATH = path.resolve(__dirname, '../../src');

const test = base.extend({
  // One persistent Chrome context per worker — shared across all tests in that worker.
  sharedContext: [async ({}, use) => {
    const userDataDir = mkdtempSync(path.join(tmpdir(), 'pw-ext-'));
    const context = await chromium.launchPersistentContext(userDataDir, {
      headless: false,
      args: [
        '--disable-features=Translate',
        `--disable-extensions-except=${EXTENSION_PATH}`,
        `--load-extension=${EXTENSION_PATH}`,
      ],
    });
    await use(context);
    await context.close();
  }, { scope: 'worker' }],

  extensionId: [async ({ sharedContext }, use) => {
    const extPage = await sharedContext.newPage();
    await extPage.goto('chrome://extensions/');
    // Function must be defined inside evaluate — Node.js has no `document`
    const id = await extPage.evaluate(() => {
      function queryShadow(root, selector) {
        if (!root) return null;
        const direct = root.querySelector(selector);
        if (direct) return direct;
        for (const el of root.querySelectorAll('*')) {
          if (el.shadowRoot) {
            const found = queryShadow(el.shadowRoot, selector);
            if (found) return found;
          }
        }
        return null;
      }
      return queryShadow(document, 'extensions-item')?.getAttribute('id') ?? null;
    });
    await extPage.close();
    if (!id) throw new Error('Could not resolve extension ID from chrome://extensions/');
    await use(id);
  }, { scope: 'worker' }],

  page: async ({ sharedContext }, use) => {
    const page = await sharedContext.newPage();
    await use(page);
    await page.close();
  },
});

module.exports = { test, expect };

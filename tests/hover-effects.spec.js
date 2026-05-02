import { test, expect } from './fixtures/index.js';
import { setup, enableDark, bgColor, textColor } from './helpers/page-setup.js';
import { RED, YELLOW } from './fixtures/mock-data.js';

// Hover behavior is identical in light and dark mode — parameterize to avoid duplication.
for (const [label, applyMode] of [
  ['light mode', async () => {}],
  ['dark mode',  enableDark],
]) {
  test.describe(`Hover effects — ${label}`, () => {
    test('game card turns red with yellow text on hover', async ({ page, extensionId }) => {
      await setup(page, extensionId);
      await applyMode(page);
      const card = page.locator('.game').first();
      await card.hover();
      expect(await bgColor(card)).toBe(RED);
      expect(await textColor(page.locator('.game-league').first())).toBe(YELLOW);
      expect(await textColor(page.locator('.game-date').first())).toBe(YELLOW);
    });

    test('game venue text turns yellow on hover', async ({ page, extensionId }) => {
      await setup(page, extensionId);
      await applyMode(page);
      await page.waitForSelector('.game-venue');
      await page.locator('.game').first().hover();
      expect(await textColor(page.locator('.game-venue').first())).toBe(YELLOW);
    });

    test('news card turns red with yellow title on hover', async ({ page, extensionId }) => {
      await setup(page, extensionId);
      await applyMode(page);
      await page.click('#tab-news');
      const card = page.locator('.news-card').first();
      await card.hover();
      expect(await bgColor(card)).toBe(RED);
      expect(await textColor(page.locator('.news-title').first())).toBe(YELLOW);
    });

    test('video card turns red with yellow title on hover', async ({ page, extensionId }) => {
      await setup(page, extensionId);
      await applyMode(page);
      await page.click('#tab-videos');
      const card = page.locator('.video-card').first();
      await card.hover();
      expect(await bgColor(card)).toBe(RED);
      expect(await textColor(page.locator('.video-title').first())).toBe(YELLOW);
    });
  });
}

import { test, expect } from './fixtures/index.js';
import { setup, enableDark, textColor } from './helpers/page-setup.js';
import { YELLOW } from './fixtures/mock-data.js';

test.describe('Broadcast label', () => {
  test('displays normalized channel names', async ({ page, extensionId }) => {
    await setup(page, extensionId);
    await page.waitForSelector('.game-broadcast');
    const text = await page.locator('.game-broadcast').first().textContent();
    expect(text.trim()).toBe('SporTV, Premiere');
  });

  test('renders TV icon alongside channel name', async ({ page, extensionId }) => {
    await setup(page, extensionId);
    await page.waitForSelector('.game-broadcast');
    const icon = page.locator('.game-broadcast .venue-icon').first();
    await expect(icon).toBeVisible();
  });

  test('broadcast text turns yellow on hover — light mode', async ({ page, extensionId }) => {
    await setup(page, extensionId);
    await page.waitForSelector('.game-broadcast');
    await page.locator('.game').first().hover();
    expect(await textColor(page.locator('.game-broadcast').first())).toBe(YELLOW);
  });

  test('broadcast text turns yellow on hover — dark mode', async ({ page, extensionId }) => {
    await setup(page, extensionId);
    await enableDark(page);
    await page.waitForSelector('.game-broadcast');
    await page.locator('.game').first().hover();
    expect(await textColor(page.locator('.game-broadcast').first())).toBe(YELLOW);
  });
});

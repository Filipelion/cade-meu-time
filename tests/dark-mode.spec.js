const { test, expect } = require('./fixtures');
const { setup, enableDark } = require('./helpers/page-setup');

test.describe('Dark mode', () => {
  test('starts in light mode', async ({ page, extensionId }) => {
    await setup(page, extensionId);
    expect(await page.evaluate(() => document.body.classList.contains('dark'))).toBe(false);
  });

  test('enables on first click', async ({ page, extensionId }) => {
    await setup(page, extensionId);
    await enableDark(page);
    expect(await page.evaluate(() => document.body.classList.contains('dark'))).toBe(true);
  });

  test('disables on second click', async ({ page, extensionId }) => {
    await setup(page, extensionId);
    await enableDark(page);
    await page.locator('label.theme-toggle').click();
    await page.waitForFunction(() => !document.body.classList.contains('dark'));
    expect(await page.evaluate(() => document.body.classList.contains('dark'))).toBe(false);
  });

  test('persists preference in localStorage', async ({ page, extensionId }) => {
    await setup(page, extensionId);
    await enableDark(page);
    expect(await page.evaluate(() => localStorage.getItem('darkMode'))).toBe('true');
  });

  test('restores preference on reload', async ({ page, extensionId }) => {
    await setup(page, extensionId);
    await enableDark(page);
    await page.reload();
    await page.waitForSelector('.game');
    expect(await page.evaluate(() => document.body.classList.contains('dark'))).toBe(true);
  });
});

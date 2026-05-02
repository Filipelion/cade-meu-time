import { test, expect } from './fixtures/index.js';
import { setup, bgColor, textColor } from './helpers/page-setup.js';
import { RED, YELLOW } from './fixtures/mock-data.js';

test.describe('Jogos Encerrados', () => {
  test('panel is hidden and upcoming games are visible by default', async ({ page, extensionId }) => {
    await setup(page, extensionId);
    await expect(page.locator('#finished-games-list')).toBeHidden();
    await expect(page.locator('#games-list')).toBeVisible();
  });

  test('clicking button shows finished games and hides upcoming games', async ({ page, extensionId }) => {
    await setup(page, extensionId);
    await page.click('#btn-finished-games');
    await page.waitForSelector('.game--finished');
    await expect(page.locator('#finished-games-list')).toBeVisible();
    await expect(page.locator('#games-list')).toBeHidden();
  });

  test('button gets active class when panel is open', async ({ page, extensionId }) => {
    await setup(page, extensionId);
    await page.click('#btn-finished-games');
    await page.waitForSelector('.game--finished');
    await expect(page.locator('#btn-finished-games')).toHaveClass(/active/);
  });

  test('active button has red background and yellow text', async ({ page, extensionId }) => {
    await setup(page, extensionId);
    await page.click('#btn-finished-games');
    await page.waitForSelector('.game--finished');
    expect(await bgColor(page.locator('#btn-finished-games'))).toBe(RED);
    expect(await textColor(page.locator('.game-card-finished-text'))).toBe(YELLOW);
  });

  test('renders the correct number of finished game cards', async ({ page, extensionId }) => {
    await setup(page, extensionId);
    await page.click('#btn-finished-games');
    await page.waitForSelector('.game--finished');
    await expect(page.locator('.game--finished')).toHaveCount(2);
  });

  test('cards display score', async ({ page, extensionId }) => {
    await setup(page, extensionId);
    await page.click('#btn-finished-games');
    await page.waitForSelector('.game--finished');
    await expect(page.locator('.game--finished .score-text').first()).toHaveText('2 - 1');
  });

  test('cards display date', async ({ page, extensionId }) => {
    await setup(page, extensionId);
    await page.click('#btn-finished-games');
    await page.waitForSelector('.game--finished');
    await expect(page.locator('.game--finished .finished-date').first()).toHaveText('SÁB, 18/04');
  });

  test('cards have "Veja os detalhes" tooltip', async ({ page, extensionId }) => {
    await setup(page, extensionId);
    await page.click('#btn-finished-games');
    await page.waitForSelector('.game--finished');
    await expect(page.locator('.game--finished').first()).toHaveAttribute('title', 'Veja os detalhes');
  });

  test('cards link to placardefutebol in a new tab', async ({ page, extensionId }) => {
    await setup(page, extensionId);
    await page.click('#btn-finished-games');
    await page.waitForSelector('.game--finished');
    const card = page.locator('.game--finished').first();
    await expect(card).toHaveAttribute('href', /placardefutebol\.com\.br/);
    await expect(card).toHaveAttribute('target', '_blank');
  });

  test('second click hides panel and restores upcoming games', async ({ page, extensionId }) => {
    await setup(page, extensionId);
    await page.click('#btn-finished-games');
    await page.waitForSelector('.game--finished');
    await page.click('#btn-finished-games');
    await expect(page.locator('#finished-games-list')).toBeHidden();
    await expect(page.locator('#games-list')).toBeVisible();
  });

  test('button loses active class when panel is closed', async ({ page, extensionId }) => {
    await setup(page, extensionId);
    await page.click('#btn-finished-games');
    await page.waitForSelector('.game--finished');
    await page.click('#btn-finished-games');
    await expect(page.locator('#btn-finished-games')).not.toHaveClass(/active/);
  });
});

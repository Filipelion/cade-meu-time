const { test: base, expect, chromium } = require('@playwright/test');
const path = require('path');
const { mkdtempSync } = require('fs');
const { tmpdir } = require('os');

// ── Extension bootstrap ───────────────────────────────────────────────────────

const EXTENSION_PATH = path.resolve(__dirname, '../src');

const FAKE_LISTING_HTML = `<!DOCTYPE html><html><body>
<a class="match__lg" href="/brasileirao-serie-b/test-sport.html">
  <span class="match__lg_card--datetime">amanhã 18:00</span>
  <span class="match__lg_card--league">Brasileirão Série B</span>
  <span class="match__lg_card--ht-name text">Sport</span>
  <span class="match__lg_card--at-name text">América-MG</span>
  <div class="match__lg_card--ht-logo"><img src=""></div>
  <div class="match__lg_card--at-logo"><img src=""></div>
</a>
</body></html>`;

const FAKE_DETAIL_HTML = `<!DOCTYPE html><html><body>
<div class="match-details">
  <p><img src="/images/local.png" alt="Ícone de Localização">Arena de Pernambuco (São Lourenço da Mata, PE)</p>
</div>
</body></html>`;

const CORS = { 'Access-Control-Allow-Origin': '*' };
const RED    = 'rgb(184, 0, 0)';
const YELLOW = 'rgb(255, 238, 3)';

let sharedContext;
let extensionId;

// Override the `page` fixture so every test gets a page from the extension context
const test = base.extend({
  page: async ({}, use) => {
    const page = await sharedContext.newPage();
    await use(page);
    await page.close();
  },
});

test.beforeAll(async () => {
  const userDataDir = mkdtempSync(path.join(tmpdir(), 'pw-ext-'));
  sharedContext = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
    ],
  });

  // Find extension ID by piercing chrome://extensions/ shadow DOM
  const extPage = await sharedContext.newPage();
  await extPage.goto('chrome://extensions/');
  extensionId = await extPage.evaluate(() => {
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

  if (!extensionId) throw new Error('Could not resolve extension ID from chrome://extensions/');
});

test.afterAll(async () => {
  await sharedContext.close();
});

// ── Helpers ───────────────────────────────────────────────────────────────────

async function setup(page) {
  // Widcard (lower LIFO priority) handles individual match detail pages
  await page.route(/placardefutebol\.com\.br/, (r) =>
    r.fulfill({ contentType: 'text/html', headers: CORS, body: FAKE_DETAIL_HTML })
  );
  // Specific route (higher LIFO priority) handles the game listing
  await page.route(/placardefutebol\.com\.br\/time\/sport\/proximos-jogos/, (r) =>
    r.fulfill({ contentType: 'text/html', headers: CORS, body: FAKE_LISTING_HTML })
  );

  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  // Clear state from previous tests that may have set localStorage
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  // Disable CSS transitions so hover styles are applied instantly and getComputedStyle is reliable
  await page.addStyleTag({ content: '*, *::before, *::after { transition-duration: 0s !important; animation-duration: 0s !important; }' });
  await page.waitForSelector('.game');
}

async function enableDark(page) {
  await page.locator('label.theme-toggle').click();
  await page.waitForFunction(() => document.body.classList.contains('dark'));
}

const bgColor   = (loc) => loc.evaluate((el) => getComputedStyle(el).backgroundColor);
const textColor = (loc) => loc.evaluate((el) => getComputedStyle(el).color);

// ── Dark mode toggle ──────────────────────────────────────────────────────────

test.describe('Dark mode toggle', () => {
  test('starts in light mode', async ({ page }) => {
    await setup(page);
    expect(await page.evaluate(() => document.body.classList.contains('dark'))).toBe(false);
  });

  test('enables dark mode on first click', async ({ page }) => {
    await setup(page);
    await enableDark(page);
    expect(await page.evaluate(() => document.body.classList.contains('dark'))).toBe(true);
  });

  test('disables dark mode on second click', async ({ page }) => {
    await setup(page);
    await enableDark(page);
    await page.locator('label.theme-toggle').click();
    await page.waitForFunction(() => !document.body.classList.contains('dark'));
    expect(await page.evaluate(() => document.body.classList.contains('dark'))).toBe(false);
  });

  test('persists preference in localStorage', async ({ page }) => {
    await setup(page);
    await enableDark(page);
    expect(await page.evaluate(() => localStorage.getItem('darkMode'))).toBe('true');
  });

  test('restores dark mode preference on reload', async ({ page }) => {
    await setup(page);
    await enableDark(page);
    await page.route(/placardefutebol\.com\.br/, (r) =>
      r.fulfill({ contentType: 'text/html', headers: CORS, body: FAKE_DETAIL_HTML })
    );
    await page.route(/placardefutebol\.com\.br\/time\/sport\/proximos-jogos/, (r) =>
      r.fulfill({ contentType: 'text/html', headers: CORS, body: FAKE_LISTING_HTML })
    );
    await page.reload();
    await page.waitForSelector('.game');
    expect(await page.evaluate(() => document.body.classList.contains('dark'))).toBe(true);
  });
});

// ── Tab switching ─────────────────────────────────────────────────────────────

test.describe('Tab switching', () => {
  test('Jogos tab is active by default', async ({ page }) => {
    await setup(page);
    await expect(page.locator('#tab-games')).toHaveClass(/active/);
    await expect(page.locator('#content-games')).toHaveClass(/active/);
    await expect(page.locator('#content-news')).not.toHaveClass(/active/);
    await expect(page.locator('#content-videos')).not.toHaveClass(/active/);
  });

  test('clicking Notícias activates its tab and content', async ({ page }) => {
    await setup(page);
    await page.click('#tab-news');
    await expect(page.locator('#tab-news')).toHaveClass(/active/);
    await expect(page.locator('#content-news')).toHaveClass(/active/);
    await expect(page.locator('#content-games')).not.toHaveClass(/active/);
    await expect(page.locator('#content-videos')).not.toHaveClass(/active/);
  });

  test('clicking Vídeos activates its tab and content', async ({ page }) => {
    await setup(page);
    await page.click('#tab-videos');
    await expect(page.locator('#tab-videos')).toHaveClass(/active/);
    await expect(page.locator('#content-videos')).toHaveClass(/active/);
    await expect(page.locator('#content-games')).not.toHaveClass(/active/);
    await expect(page.locator('#content-news')).not.toHaveClass(/active/);
  });

  test('switching between tabs updates active state correctly', async ({ page }) => {
    await setup(page);
    await page.click('#tab-news');
    await page.click('#tab-videos');
    await expect(page.locator('#tab-videos')).toHaveClass(/active/);
    await expect(page.locator('#content-videos')).toHaveClass(/active/);
    await expect(page.locator('#content-news')).not.toHaveClass(/active/);
  });
});

// ── Hover effects — light mode ────────────────────────────────────────────────

test.describe('Hover effects — light mode', () => {
  test('game card background turns red on hover', async ({ page }) => {
    await setup(page);
    const card = page.locator('.game').first();
    await card.hover();
    expect(await bgColor(card)).toBe(RED);
  });

  test('game card league and date text turns yellow on hover', async ({ page }) => {
    await setup(page);
    const card = page.locator('.game').first();
    await card.hover();
    expect(await textColor(page.locator('.game-league').first())).toBe(YELLOW);
    expect(await textColor(page.locator('.game-date').first())).toBe(YELLOW);
  });

  test('game venue text turns yellow on hover', async ({ page }) => {
    await setup(page);
    await page.waitForSelector('.game-venue');
    await page.locator('.game').first().hover();
    expect(await textColor(page.locator('.game-venue').first())).toBe(YELLOW);
  });

  test('news card background turns red on hover', async ({ page }) => {
    await setup(page);
    await page.click('#tab-news');
    const card = page.locator('.news-card').first();
    await card.hover();
    expect(await bgColor(card)).toBe(RED);
  });

  test('news card title turns yellow on hover', async ({ page }) => {
    await setup(page);
    await page.click('#tab-news');
    const card = page.locator('.news-card').first();
    await card.hover();
    expect(await textColor(page.locator('.news-title').first())).toBe(YELLOW);
  });

  test('video card background turns red on hover', async ({ page }) => {
    await setup(page);
    await page.click('#tab-videos');
    const card = page.locator('.video-card').first();
    await card.hover();
    expect(await bgColor(card)).toBe(RED);
  });

  test('video card title turns yellow on hover', async ({ page }) => {
    await setup(page);
    await page.click('#tab-videos');
    const card = page.locator('.video-card').first();
    await card.hover();
    expect(await textColor(page.locator('.video-title').first())).toBe(YELLOW);
  });
});

// ── Hover effects — dark mode ─────────────────────────────────────────────────

test.describe('Hover effects — dark mode', () => {
  test('game card background turns red on hover', async ({ page }) => {
    await setup(page);
    await enableDark(page);
    const card = page.locator('.game').first();
    await card.hover();
    expect(await bgColor(card)).toBe(RED);
  });

  test('game card league and date text turns yellow on hover', async ({ page }) => {
    await setup(page);
    await enableDark(page);
    const card = page.locator('.game').first();
    await card.hover();
    expect(await textColor(page.locator('.game-league').first())).toBe(YELLOW);
    expect(await textColor(page.locator('.game-date').first())).toBe(YELLOW);
  });

  test('game venue text turns yellow on hover', async ({ page }) => {
    await setup(page);
    await enableDark(page);
    await page.waitForSelector('.game-venue');
    await page.locator('.game').first().hover();
    expect(await textColor(page.locator('.game-venue').first())).toBe(YELLOW);
  });

  test('news card background turns red on hover', async ({ page }) => {
    await setup(page);
    await enableDark(page);
    await page.click('#tab-news');
    const card = page.locator('.news-card').first();
    await card.hover();
    expect(await bgColor(card)).toBe(RED);
  });

  test('news card title turns yellow on hover', async ({ page }) => {
    await setup(page);
    await enableDark(page);
    await page.click('#tab-news');
    const card = page.locator('.news-card').first();
    await card.hover();
    expect(await textColor(page.locator('.news-title').first())).toBe(YELLOW);
  });

  test('video card background turns red on hover', async ({ page }) => {
    await setup(page);
    await enableDark(page);
    await page.click('#tab-videos');
    const card = page.locator('.video-card').first();
    await card.hover();
    expect(await bgColor(card)).toBe(RED);
  });

  test('video card title turns yellow on hover', async ({ page }) => {
    await setup(page);
    await enableDark(page);
    await page.click('#tab-videos');
    const card = page.locator('.video-card').first();
    await card.hover();
    expect(await textColor(page.locator('.video-title').first())).toBe(YELLOW);
  });
});

// ── Hyperlinks ────────────────────────────────────────────────────────────────

test.describe('Hyperlinks', () => {
  test('Jogos Encerrados link', async ({ page }) => {
    await setup(page);
    const link = page.locator('a.game-card-finished');
    await expect(link).toHaveAttribute('href', 'https://ge.globo.com/pe/futebol/times/sport/agenda/#/encerrados');
    await expect(link).toHaveAttribute('target', '_blank');
  });

  const NEWS_LINKS = [
    ['Sport Club do Recife', 'https://sportrecife.com.br/noticias/'],
    ['Globo Esporte',        'https://ge.globo.com/pe/futebol/times/sport/'],
    ['FolhaPE',              'https://www.folhape.com.br/esportes/sport/'],
    ['JC',                   'https://jc.ne10.uol.com.br/esportes/sport'],
    ['Meu Sport',            'https://meusport.com/'],
  ];

  for (const [title, href] of NEWS_LINKS) {
    test(`news — "${title}"`, async ({ page }) => {
      await setup(page);
      await page.click('#tab-news');
      const link = page.locator(`.news-card:has(.news-title:text("${title}"))`);
      await expect(link).toHaveAttribute('href', href);
      await expect(link).toHaveAttribute('target', '_blank');
    });
  }

  const VIDEO_LINKS = [
    ['/TVSport',      'https://www.youtube.com/@tvsportrecife/videos?view=0&sort=dd&shelf_id=1'],
    ['Globo Esporte', 'https://ge.globo.com/pe/futebol/times/sport/videos/'],
    ['@sportrecife',  'https://www.instagram.com/sportrecife/'],
  ];

  for (const [title, href] of VIDEO_LINKS) {
    test(`video — "${title}"`, async ({ page }) => {
      await setup(page);
      await page.click('#tab-videos');
      const link = page.locator(`.video-card:has(.video-title:text("${title}"))`);
      await expect(link).toHaveAttribute('href', href);
      await expect(link).toHaveAttribute('target', '_blank');
    });
  }
});

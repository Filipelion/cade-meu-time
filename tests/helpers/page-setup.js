const {
  FAKE_LISTING_HTML,
  FAKE_DETAIL_HTML,
  FAKE_FINISHED_HTML,
  FAKE_SOCIOS_JSON,
  CORS,
} = require('../fixtures/mock-data');

async function setup(page, extensionId) {
  // Wildcard fallback handles individual match detail pages (lower LIFO priority)
  await page.route(/placardefutebol\.com\.br/, (r) =>
    r.fulfill({ contentType: 'text/html', headers: CORS, body: FAKE_DETAIL_HTML })
  );
  await page.route(/placardefutebol\.com\.br\/time\/sport\/proximos-jogos/, (r) =>
    r.fulfill({ contentType: 'text/html', headers: CORS, body: FAKE_LISTING_HTML })
  );
  await page.route(/placardefutebol\.com\.br\/time\/sport\/ultimos-jogos/, (r) =>
    r.fulfill({ contentType: 'text/html', headers: CORS, body: FAKE_FINISHED_HTML })
  );
  await page.route(/maiordonordeste\.com\.br\/api\/v1\/numeros/, (r) =>
    r.fulfill({ contentType: 'application/json', headers: CORS, body: FAKE_SOCIOS_JSON })
  );

  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.addStyleTag({
    content: '*, *::before, *::after { transition-duration: 0s !important; animation-duration: 0s !important; }',
  });
  await page.waitForSelector('.game');
}

async function enableDark(page) {
  await page.locator('label.theme-toggle').click();
  await page.waitForFunction(() => document.body.classList.contains('dark'));
}

const bgColor   = (loc) => loc.evaluate((el) => getComputedStyle(el).backgroundColor);
const textColor = (loc) => loc.evaluate((el) => getComputedStyle(el).color);

module.exports = { setup, enableDark, bgColor, textColor };

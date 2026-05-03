import {
  FAKE_LISTING_HTML,
  FAKE_DETAIL_HTML,
  FAKE_DETAIL_HTML_WITH_YOUTUBE,
  FAKE_FINISHED_HTML,
  FAKE_SOCIOS_JSON,
  CORS,
} from "../fixtures/mock-data.js";

async function setup(page, extensionId) {
  // Wildcard fallback handles individual match detail pages (lower LIFO priority)
  await page.route(/placardefutebol\.com\.br/, (r) =>
    r.fulfill({
      contentType: "text/html",
      headers: CORS,
      body: FAKE_DETAIL_HTML,
    }),
  );
  await page.route(
    /placardefutebol\.com\.br\/time\/sport\/proximos-jogos/,
    (r) =>
      r.fulfill({
        contentType: "text/html",
        headers: CORS,
        body: FAKE_LISTING_HTML,
      }),
  );
  await page.route(
    /placardefutebol\.com\.br\/time\/sport\/ultimos-jogos/,
    (r) =>
      r.fulfill({
        contentType: "text/html",
        headers: CORS,
        body: FAKE_FINISHED_HTML,
      }),
  );
  await page.route(/maiordonordeste\.com\.br\/api\/v1\/numeros/, (r) =>
    r.fulfill({
      contentType: "application/json",
      headers: CORS,
      body: FAKE_SOCIOS_JSON,
    }),
  );

  // Safety net: intercept any GA4 request that slips through before _ga_disabled is set
  await page.route(/google-analytics\.com/, (r) =>
    r.fulfill({ status: 204, body: "" }),
  );

  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await page.evaluate(() => {
    localStorage.clear();
    // Prevents analytics.js from firing trackEvent() calls during tests
    localStorage.setItem("_ga_disabled", "1");
  });
  await page.reload();
  await page.addStyleTag({
    content:
      "*, *::before, *::after { transition-duration: 0s !important; animation-duration: 0s !important; }",
  });
  await page.waitForSelector(".game");
}

async function setupWithYoutube(page, extensionId) {
  await page.route(/placardefutebol\.com\.br/, (r) =>
    r.fulfill({
      contentType: "text/html",
      headers: CORS,
      body: FAKE_DETAIL_HTML_WITH_YOUTUBE,
    }),
  );
  await page.route(
    /placardefutebol\.com\.br\/time\/sport\/proximos-jogos/,
    (r) =>
      r.fulfill({
        contentType: "text/html",
        headers: CORS,
        body: FAKE_LISTING_HTML,
      }),
  );
  await page.route(
    /placardefutebol\.com\.br\/time\/sport\/ultimos-jogos/,
    (r) =>
      r.fulfill({
        contentType: "text/html",
        headers: CORS,
        body: FAKE_FINISHED_HTML,
      }),
  );
  await page.route(/maiordonordeste\.com\.br\/api\/v1\/numeros/, (r) =>
    r.fulfill({
      contentType: "application/json",
      headers: CORS,
      body: FAKE_SOCIOS_JSON,
    }),
  );
  await page.route(/google-analytics\.com/, (r) =>
    r.fulfill({ status: 204, body: "" }),
  );

  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem("_ga_disabled", "1");
  });
  await page.reload();
  await page.addStyleTag({
    content:
      "*, *::before, *::after { transition-duration: 0s !important; animation-duration: 0s !important; }",
  });
  await page.waitForSelector(".game-youtube");
}

async function enableDark(page) {
  await page.locator('label[title="Alternar modo escuro"]').click();
  await page.waitForFunction(() => document.body.classList.contains("dark"));
}

const bgColor = (loc) =>
  loc.evaluate((el) => getComputedStyle(el).backgroundColor);
const textColor = (loc) => loc.evaluate((el) => getComputedStyle(el).color);

export { setup, setupWithYoutube, enableDark, bgColor, textColor };

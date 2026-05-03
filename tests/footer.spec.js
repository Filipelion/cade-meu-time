import { test, expect } from "./fixtures/index.js";
import { setup } from "./helpers/page-setup.js";

test.describe("Sócios footnote", () => {
  test("displays Texto from API", async ({ page, extensionId }) => {
    await setup(page, extensionId);
    await page.waitForFunction(() => {
      const el = document.getElementById("footnote-socios-content");
      return el && el.textContent.trim().length > 0;
    });
    await expect(page.locator("#footnote-socios-content")).toHaveText(
      "Somos 18446 sócios, 14979 pagantes",
    );
  });

  test("links to maiordonordeste.com.br in a new tab", async ({
    page,
    extensionId,
  }) => {
    await setup(page, extensionId);
    await expect(page.locator("#footnote-socios")).toHaveAttribute(
      "href",
      "https://maiordonordeste.com.br/",
    );
    await expect(page.locator("#footnote-socios")).toHaveAttribute(
      "target",
      "_blank",
    );
  });

  test('shows "Seja Sócio!" CTA', async ({ page, extensionId }) => {
    await setup(page, extensionId);
    await expect(page.locator(".socios-cta")).toHaveText("Seja Sócio!");
  });

  test("falls back gracefully on API error", async ({ page, extensionId }) => {
    await setup(page, extensionId);
    // Override socios route with 500 — LIFO means this wins over the setup route
    await page.route(/maiordonordeste\.com\.br\/api\/v1\/numeros/, (r) =>
      r.fulfill({ status: 500, body: "" }),
    );
    // Clear socios cache so the reload hits the API (and gets the 500) instead of returning cached text
    await page.evaluate(() => {
      localStorage.removeItem("sociosData");
      localStorage.removeItem("lastFetchedSocios");
    });
    await page.reload();
    await page.waitForSelector(".game");
    await page.waitForFunction(() => {
      const el = document.getElementById("footnote-socios-content");
      return el && el.textContent.trim().length > 0;
    });
    await expect(page.locator("#footnote-socios-content")).toHaveText(
      "maiordonordeste.com.br",
    );
  });
});

test.describe("Version label", () => {
  test("displays version from manifest", async ({ page, extensionId }) => {
    await setup(page, extensionId);
    await expect(page.locator("#version-label")).toHaveText(/^v\d+\.\d+/);
  });

  test("is visible on the Jogos tab", async ({ page, extensionId }) => {
    await setup(page, extensionId);
    await expect(page.locator("#version-label")).toBeVisible();
  });
});

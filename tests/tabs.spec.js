import { test, expect } from "./fixtures/index.js";
import { setup } from "./helpers/page-setup.js";

test.describe("Tab switching", () => {
  test("Jogos tab is active by default", async ({ page, extensionId }) => {
    await setup(page, extensionId);
    await expect(page.locator("#tab-games")).toHaveClass(/active/);
    await expect(page.locator("#content-games")).toHaveClass(/active/);
    await expect(page.locator("#content-news")).not.toHaveClass(/active/);
    await expect(page.locator("#content-videos")).not.toHaveClass(/active/);
  });

  test("clicking Notícias activates its content", async ({
    page,
    extensionId,
  }) => {
    await setup(page, extensionId);
    await page.click("#tab-news");
    await expect(page.locator("#tab-news")).toHaveClass(/active/);
    await expect(page.locator("#content-news")).toHaveClass(/active/);
    await expect(page.locator("#content-games")).not.toHaveClass(/active/);
    await expect(page.locator("#content-videos")).not.toHaveClass(/active/);
  });

  test("clicking Vídeos activates its content", async ({
    page,
    extensionId,
  }) => {
    await setup(page, extensionId);
    await page.click("#tab-videos");
    await expect(page.locator("#tab-videos")).toHaveClass(/active/);
    await expect(page.locator("#content-videos")).toHaveClass(/active/);
    await expect(page.locator("#content-games")).not.toHaveClass(/active/);
    await expect(page.locator("#content-news")).not.toHaveClass(/active/);
  });

  test("switching tabs deactivates previous tab", async ({
    page,
    extensionId,
  }) => {
    await setup(page, extensionId);
    await page.click("#tab-news");
    await page.click("#tab-videos");
    await expect(page.locator("#tab-videos")).toHaveClass(/active/);
    await expect(page.locator("#content-videos")).toHaveClass(/active/);
    await expect(page.locator("#content-news")).not.toHaveClass(/active/);
  });
});

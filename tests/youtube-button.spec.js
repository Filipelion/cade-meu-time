import { test, expect } from "./fixtures/index.js";
import {
  setup,
  setupWithYoutube,
  enableDark,
  bgColor,
  textColor,
} from "./helpers/page-setup.js";
import { YELLOW, TEXT_PRIMARY_LIGHT, YOUTUBE_WATCH_URL } from "./fixtures/mock-data.js";

test.describe("YouTube button — absent", () => {
  test("not rendered when detail page has no YouTube embed", async ({
    page,
    extensionId,
  }) => {
    await setup(page, extensionId);
    await expect(page.locator(".game-youtube")).toHaveCount(0);
  });
});

test.describe("YouTube button — present", () => {
  test("visible when detail page has YouTube embed", async ({
    page,
    extensionId,
  }) => {
    await setupWithYoutube(page, extensionId);
    await expect(page.locator(".game-youtube").first()).toBeVisible();
  });

  test("href is watch URL derived from embed src", async ({
    page,
    extensionId,
  }) => {
    await setupWithYoutube(page, extensionId);
    await expect(page.locator(".game-youtube").first()).toHaveAttribute(
      "href",
      YOUTUBE_WATCH_URL,
    );
  });

  test("opens in a new tab", async ({ page, extensionId }) => {
    await setupWithYoutube(page, extensionId);
    const btn = page.locator(".game-youtube").first();
    await expect(btn).toHaveAttribute("target", "_blank");
    await expect(btn).toHaveAttribute("rel", /noopener/);
  });

  test("shows default label 'Assistir ao vivo'", async ({
    page,
    extensionId,
  }) => {
    await setupWithYoutube(page, extensionId);
    await expect(
      page.locator(".game-youtube .yt-label-default").first(),
    ).toBeVisible();
    await expect(
      page.locator(".game-youtube .yt-label-default").first(),
    ).toHaveText("Assistir ao vivo");
  });

  test("hovering button shows CTA and hides default label", async ({
    page,
    extensionId,
  }) => {
    await setupWithYoutube(page, extensionId);
    await page.locator(".game-youtube").first().hover();
    await expect(
      page.locator(".game-youtube .yt-label-hover").first(),
    ).toBeVisible();
    await expect(
      page.locator(".game-youtube .yt-label-default").first(),
    ).toBeHidden();
  });

  test("clicking button opens YouTube in a new tab without navigating popup", async ({
    page,
    extensionId,
  }) => {
    await setupWithYoutube(page, extensionId);
    const newPagePromise = page.context().waitForEvent("page");
    await page.locator(".game-youtube").first().click();
    const newPage = await newPagePromise;
    expect(newPage.url()).toContain("youtube.com");
    await newPage.close();
    await expect(page.locator(".game-youtube").first()).toBeVisible();
  });
});

test.describe("YouTube button — styling", () => {
  test("bright mode: button text uses text-primary color, not yellow", async ({
    page,
    extensionId,
  }) => {
    await setupWithYoutube(page, extensionId);
    const color = await textColor(page.locator(".game-youtube").first());
    expect(color).toBe(TEXT_PRIMARY_LIGHT);
    expect(color).not.toBe(YELLOW);
  });

  test("dark mode: button text is yellow", async ({ page, extensionId }) => {
    await setupWithYoutube(page, extensionId);
    await enableDark(page);
    expect(await textColor(page.locator(".game-youtube").first())).toBe(YELLOW);
  });

  test("card hover in bright mode: button background becomes yellow", async ({
    page,
    extensionId,
  }) => {
    await setupWithYoutube(page, extensionId);
    await page.locator(".game").first().hover();
    expect(await bgColor(page.locator(".game-youtube").first())).toBe(YELLOW);
  });

  test("card hover in dark mode: button background becomes yellow", async ({
    page,
    extensionId,
  }) => {
    await setupWithYoutube(page, extensionId);
    await enableDark(page);
    await page.locator(".game").first().hover();
    expect(await bgColor(page.locator(".game-youtube").first())).toBe(YELLOW);
  });

  test("card hover: button text becomes dark for contrast against yellow", async ({
    page,
    extensionId,
  }) => {
    await setupWithYoutube(page, extensionId);
    await page.locator(".game").first().hover();
    const color = await textColor(page.locator(".game-youtube").first());
    expect(color).not.toBe(YELLOW);
    // dark text (#333 = rgb(51,51,51)) for contrast on yellow background
    expect(color).toBe("rgb(51, 51, 51)");
  });
});

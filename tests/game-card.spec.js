import { test, expect } from "./fixtures/index.js";
import { setup } from "./helpers/page-setup.js";

test.describe("Game card rendering", () => {
  test("displays home and away team names", async ({ page, extensionId }) => {
    await setup(page, extensionId);
    await expect(page.locator(".home-team-name").first()).toHaveText("Sport");
    await expect(page.locator(".away-team-name").first()).toHaveText(
      "América-MG",
    );
  });

  test("displays league name", async ({ page, extensionId }) => {
    await setup(page, extensionId);
    await expect(page.locator(".game-league").first()).toHaveText(
      "Brasileirão Série B",
    );
  });

  test("displays formatted date and time", async ({ page, extensionId }) => {
    await setup(page, extensionId);
    await expect(page.locator(".game-date").first()).toHaveText(
      "Amanhã às 18:00",
    );
  });

  test("has pointer cursor indicating it is clickable", async ({
    page,
    extensionId,
  }) => {
    await setup(page, extensionId);
    const cursor = await page
      .locator(".game")
      .first()
      .evaluate((el) => getComputedStyle(el).cursor);
    expect(cursor).toBe("pointer");
  });

  test("click opens game page in a new tab", async ({
    page,
    extensionId,
  }) => {
    await setup(page, extensionId);
    const newPagePromise = page.context().waitForEvent("page");
    await page.locator(".game").first().click();
    const newPage = await newPagePromise;
    expect(newPage.url()).toContain("placardefutebol.com.br");
    await newPage.close();
  });
});

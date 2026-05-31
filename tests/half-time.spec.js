import { test, expect } from "./fixtures/index.js";
import {
  setup,
  setupWithLiveHalfTime,
} from "./helpers/page-setup.js";
import {
  createHalfTimeLastGamesHTML,
  FAKE_RELOAD_INTERVALO_HTML,
} from "./fixtures/mock-data.js";

test.describe("Intervalo", () => {
    test("Half-time match is being displayed as a finished game", async ({
    page,
    extensionId,
  }) => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    const liveLink = `https://www.placardefutebol.com.br/sport-x-nautico-${dd}-${mm}-${yyyy}.html`;

    await setupWithLiveHalfTime(
      page,
      extensionId,
      createHalfTimeLastGamesHTML(liveLink),
      FAKE_RELOAD_INTERVALO_HTML,
    );

    await page.waitForSelector(".game--live");
    await expect(page.locator(".live-section-header")).toContainText("INTERVALO");
    await expect(page.locator(".game--live")).toHaveAttribute("href", liveLink);

    await page.click("#btn-finished-games");
    await page.waitForSelector(".game--finished");
    await expect(page.locator("#finished-games-list .game--finished")).toHaveCount(1);

    const finishedHref = await page
      .locator("#finished-games-list .game--finished")
      .first()
      .getAttribute("href");
    expect(finishedHref).not.toBe(liveLink);
  });
});

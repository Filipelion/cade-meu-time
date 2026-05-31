import { test, expect } from "./fixtures/index.js";
import { setup } from "./helpers/page-setup.js";
import {
  CORS,
  FAKE_DETAIL_HTML_HOME,
  FAKE_DETAIL_HTML_AWAY,
  FAKE_LISTING_HTML_AWAY,
} from "./fixtures/mock-data.js";

const EMPTY_TICKETS_RESPONSE = [
  {
    id: "1234",
    local: { nome: "Ilha do Retiro", cidade: "Recife" },
    liga: { nome: "Campeonato Pernambucano" },
    clube_mandante: { nome: "Sport", escudo_url: "" },
    clube_visitante: { nome: "Náutico", escudo_url: "" },
    data_hora: "2026-06-01T19:30:00",
    liberacoes: [],
  },
];

test.describe("Ingressos tab", () => {
  test("shows a pending ticket message when the next game is at home and no tickets are available", async ({ page, extensionId }) => {
    await page.route(/maiordonordeste\.com\.br\/jogos\.json/, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: CORS,
        body: JSON.stringify(EMPTY_TICKETS_RESPONSE),
      }),
    );

    await setup(page, extensionId, {
      customRoutes: async (page) => {
        await page.route(/placardefutebol\.com\.br\/brasileirao-serie-b\/test-sport\.html/, (route) =>
          route.fulfill({
            status: 200,
            contentType: "text/html",
            headers: CORS,
            body: FAKE_DETAIL_HTML_HOME,
          }),
        );
      },
    });

    await page.click("#tab-tickets");

    await expect(page.locator("#tickets-list")).toContainText(
      "Ingressos ainda não disponíveis. Em breve o Sport libera a compra.",
    );
  });

  test("shows away-game text when the next ticketed game is away and tickets are not available", async ({ page, extensionId }) => {
    await page.route(/maiordonordeste\.com\.br\/jogos\.json/, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: CORS,
        body: JSON.stringify(EMPTY_TICKETS_RESPONSE),
      }),
    );

    await setup(page, extensionId, {
      customRoutes: async (page) => {
        await page.route(/placardefutebol\.com\.br\/brasileirao-serie-b\/test-sport-away\.html/, (route) =>
          route.fulfill({
            status: 200,
            contentType: "text/html",
            headers: CORS,
            body: FAKE_DETAIL_HTML_AWAY,
          }),
        );

        await page.route(/placardefutebol\.com\.br\/time\/sport\/proximos-jogos/, (route) =>
          route.fulfill({
            status: 200,
            contentType: "text/html",
            headers: CORS,
            body: FAKE_LISTING_HTML_AWAY,
          }),
        );
      },
    });

    await page.click("#tab-tickets");

    await expect(page.locator("#tickets-list")).toContainText(
      "Próximo jogo é fora de casa.",
    );
  });
});

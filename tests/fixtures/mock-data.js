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
  <p><img src="/images/tv.png" alt="Ícone de TV" title="Transmissão"><strong>SporTV (7 dias grátis), Premiere</strong></p>
</div>
</body></html>`;

const FAKE_FINISHED_HTML = `<!DOCTYPE html><html><body>
<a class="match__lg" href="/sport-x-nautico-18-04-2025.html">
  <div class="match__lg_card--date">SÁB, 18/04</div>
  <span class="match__lg_card--league">Pernambucano</span>
  <span class="match__lg_card--ht-name text">Sport</span>
  <span class="match__lg_card--at-name text">Náutico</span>
  <div class="match__lg_card--ht-logo"><img src="sport.png"></div>
  <div class="match__lg_card--at-logo"><img src="nautico.png"></div>
  <span class="match__lg_card--scoreboard">2 - 1</span>
</a>
<a class="match__lg" href="/sport-x-fortaleza-15-04-2025.html">
  <div class="match__lg_card--date">TER, 15/04</div>
  <span class="match__lg_card--league">Copa do Nordeste</span>
  <span class="match__lg_card--ht-name text">Sport</span>
  <span class="match__lg_card--at-name text">Fortaleza</span>
  <div class="match__lg_card--ht-logo"><img src="sport.png"></div>
  <div class="match__lg_card--at-logo"><img src="fortaleza.png"></div>
  <span class="match__lg_card--scoreboard">1 - 0</span>
</a>
</body></html>`;

const FAKE_SOCIOS_JSON = JSON.stringify({
  Texto: "Somos 18446 sócios, 14979 pagantes",
});

const CORS = { "Access-Control-Allow-Origin": "*" };
const RED = "rgb(184, 0, 0)";
const YELLOW = "rgb(255, 238, 3)";

export {
  FAKE_LISTING_HTML,
  FAKE_DETAIL_HTML,
  FAKE_FINISHED_HTML,
  FAKE_SOCIOS_JSON,
  CORS,
  RED,
  YELLOW,
};

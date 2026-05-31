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

const FAKE_LISTING_HTML_AWAY = `<!DOCTYPE html><html><body>
<a class="match__lg" href="/brasileirao-serie-b/test-sport-away.html">
  <span class="match__lg_card--datetime">amanhã 18:00</span>
  <span class="match__lg_card--league">Brasileirão Série B</span>
  <span class="match__lg_card--ht-name text">América-MG</span>
  <span class="match__lg_card--at-name text">Sport</span>
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

const FAKE_DETAIL_HTML_HOME = `<!DOCTYPE html><html><body>
<div class="match-details">
  <p><img src="/images/local.png" alt="Ícone de Localização">Ilha do Retiro (Recife, PE)</p>
  <p><img src="/images/tv.png" alt="Ícone de TV" title="Transmissão"><strong>SporTV (7 dias grátis), Premiere</strong></p>
</div>
</body></html>`;

const FAKE_DETAIL_HTML_AWAY = `<!DOCTYPE html><html><body>
<div class="match-details">
  <p><img src="/images/local.png" alt="Ícone de Localização">Mineirão (Belo Horizonte, MG)</p>
  <p><img src="/images/tv.png" alt="Ícone de TV" title="Transmissão"><strong>SporTV</strong></p>
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

const FAKE_DETAIL_HTML_WITH_YOUTUBE = `<!DOCTYPE html><html><body>
<div class="match-details">
  <p><img src="/images/local.png" alt="Ícone de Localização">Ilha do Retiro (Recife, PE)</p>
  <p><img src="/images/tv.png" alt="Ícone de TV"><strong>SporTV</strong></p>
</div>
<div id="video" class="match-video">
  <iframe class="match-video-player" src="https://www.youtube.com/embed/abc1234TEST" frameborder="0" allowfullscreen></iframe>
</div>
</body></html>`;

const FAKE_HALF_TIME_GAME_HTML = (liveHref) => `<!DOCTYPE html><html><body>
<a class="match__lg" href="${liveHref}">
  <span class="match__lg_card--league">Copa do Nordeste</span>
  <span class="match__lg_card--ht-name text">Sport</span>
  <span class="match__lg_card--at-name text">Santa Cruz</span>
  <div class="match__lg_card--ht-logo"><img src="sport.png"></div>
  <div class="match__lg_card--at-logo"><img src="santa.png"></div>
</a>
<a class="match__lg" href="/sport-x-ceara-17-04-2025.html">
  <div class="match__lg_card--date">QUA, 17/04</div>
  <span class="match__lg_card--league">Copa do Nordeste</span>
  <span class="match__lg_card--ht-name text">Sport</span>
  <span class="match__lg_card--at-name text">Ceará</span>
  <div class="match__lg_card--ht-logo"><img src="sport.png"></div>
  <div class="match__lg_card--at-logo"><img src="ceara.png"></div>
  <span class="match__lg_card--scoreboard">3 - 2</span>
</a>
</body></html>`;

const createHalfTimeLastGamesHTML = (liveHref) => `<!DOCTYPE html><html><body>
<a class="match__lg" href="${liveHref}">
  <span class="match__lg_card--league">Copa do Nordeste</span>
  <span class="match__lg_card--ht-name text">Sport</span>
  <span class="match__lg_card--at-name text">Santa Cruz</span>
  <div class="match__lg_card--ht-logo"><img src="sport.png"></div>
  <div class="match__lg_card--at-logo"><img src="santa.png"></div>
</a>
<a class="match__lg" href="/sport-x-ceara-17-04-2025.html">
  <div class="match__lg_card--date">QUA, 17/04</div>
  <span class="match__lg_card--league">Copa do Nordeste</span>
  <span class="match__lg_card--ht-name text">Sport</span>
  <span class="match__lg_card--at-name text">Ceará</span>
  <div class="match__lg_card--ht-logo"><img src="sport.png"></div>
  <div class="match__lg_card--at-logo"><img src="ceara.png"></div>
  <span class="match__lg_card--scoreboard">3 - 2</span>
</a>
</body></html>`;

const FAKE_RELOAD_INTERVALO_HTML = `<!DOCTYPE html><html><body>
<div class="status-name">Intervalo</div>
<div class="match-score-text">1</div>
<div class="match-score-text">0</div>
</body></html>`;

const CORS = { "Access-Control-Allow-Origin": "*" };
const RED = "rgb(184, 0, 0)";
const YELLOW = "rgb(255, 238, 3)";
const TEXT_PRIMARY_LIGHT = "rgb(68, 68, 68)";
const YOUTUBE_WATCH_URL = "https://www.youtube.com/watch?v=abc1234TEST";

export {
  FAKE_LISTING_HTML,
  FAKE_LISTING_HTML_AWAY,
  FAKE_DETAIL_HTML,
  FAKE_DETAIL_HTML_HOME,
  FAKE_DETAIL_HTML_AWAY,
  FAKE_DETAIL_HTML_WITH_YOUTUBE,
  FAKE_FINISHED_HTML,
  FAKE_HALF_TIME_GAME_HTML,
  createHalfTimeLastGamesHTML,
  FAKE_RELOAD_INTERVALO_HTML,
  FAKE_SOCIOS_JSON,
  CORS,
  RED,
  YELLOW,
  TEXT_PRIMARY_LIGHT,
  YOUTUBE_WATCH_URL,
};

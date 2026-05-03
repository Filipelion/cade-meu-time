import { JOGOS, INGRESSOS } from "../constants.js";

const YOUTUBE_ICON_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6a3 3 0 0 0-2.1 2.1C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/></svg>`;

export function renderTickets(games, container, enriched = {}) {
  container.innerHTML = "";
  if (!games || games.length === 0) return;

  const game = games[0];
  const buyUrl = `${INGRESSOS.URL.BUY_BASE}${game.id}/comprar`;
  const localStr = game.local
    ? `${game.local.nome}, ${game.local.cidade}`
    : null;

  const gameData = {
    campeonato: [enriched.campeonato ?? game.liga?.nome ?? ""],
    team_home: [enriched.team_home ?? game.clube_mandante.nome],
    img_src_home: [enriched.img_src_home ?? game.clube_mandante.escudo_url],
    team_away: [enriched.team_away ?? game.clube_visitante.nome],
    img_src_away: [enriched.img_src_away ?? game.clube_visitante.escudo_url],
    datas: [enriched.datas ?? isoDateToParts(game.data_hora)],
    local: [enriched.local ?? localStr],
    broadcast: [enriched.broadcast ?? null],
    youtubeUrl: [enriched.youtubeUrl ?? null],
    links: [enriched.links ?? null],
  };
  container.appendChild(buildGameCard(gameData, 0));

  const plans = document.createElement("div");
  plans.className = "ticket-plans";

  const visiblePlans = game.liberacoes.filter((l) => l.publica);

  const groups = new Map();
  visiblePlans.forEach((lib) => {
    const key = lib.data_de_liberacao.slice(0, 16);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(lib);
  });

  groups.forEach((libs, key) => {
    const groupEl = document.createElement("div");
    groupEl.className = "ticket-group";

    const groupHeader = document.createElement("div");
    groupHeader.className = "ticket-group-header";
    groupHeader.textContent = `${INGRESSOS.TEXT.RELEASE_PREFIX}${formatIsoDate(key)}`;
    groupEl.appendChild(groupHeader);

    libs.forEach((lib) => {
      const row = document.createElement("div");
      row.className = "ticket-plan-row";

      const btn = document.createElement("a");
      btn.className = "btn-comprar";
      btn.href = buyUrl;
      btn.target = "_blank";
      btn.rel = "noopener noreferrer";
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2z"/></svg>${INGRESSOS.TEXT.BUY_BTN}`;

      const name = document.createElement("span");
      name.className = "ticket-plan-name";
      name.textContent = lib.localizador.titulo;

      row.append(btn, name);
      groupEl.appendChild(row);
    });

    plans.appendChild(groupEl);
  });

  container.appendChild(plans);
}

function isoDateToParts(iso) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return [`${dd}/${mm}`, `${hh}:${min}`];
}

function formatIsoDate(iso) {
  const [datePart, timePart] = isoDateToParts(iso);
  return `${datePart} às ${timePart}`;
}

export function renderGames(data) {
  const gamesList = document.getElementById(JOGOS.ELEMENT.GAMES_LIST);
  gamesList.innerHTML = "";

  for (let i = 0; i < data.team_home.length; i++) {
    gamesList.appendChild(buildGameCard(data, i));
  }
}

function buildGameCard(data, i) {
  const card = document.createElement("div");
  card.className = "game";

  const rawLink = data.links?.[i];
  if (rawLink) {
    const href = rawLink.startsWith("http")
      ? rawLink
      : `${JOGOS.URL.PLACAR_BASE}${rawLink}`;
    card.style.cursor = "pointer";
    card.addEventListener("click", () =>
      window.open(href, "_blank", "noopener,noreferrer"),
    );
  }

  const info = document.createElement("div");
  info.className = "game-info";

  const league = document.createElement("span");
  league.className = "game-league";
  league.textContent = data.campeonato[i];

  const teams = document.createElement("div");
  teams.className = "game-teams";
  teams.append(
    buildTeamEl(data.team_home[i], data.img_src_home[i], "home"),
    buildVsEl(),
    buildTeamEl(data.team_away[i], data.img_src_away[i], "away"),
  );

  const date = document.createElement("span");
  date.className = "game-date";
  date.textContent = formatDate(data.datas[i]);

  info.append(league, teams, date);

  const venue = data.local?.[i];
  if (venue) {
    const venueEl = document.createElement("span");
    venueEl.className = "game-venue";
    venueEl.innerHTML = `<svg class="venue-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>${venue}`;
    info.appendChild(venueEl);
  }

  const broadcast = data.broadcast?.[i];
  if (broadcast) {
    const broadcastEl = document.createElement("span");
    broadcastEl.className = "game-venue game-broadcast";
    broadcastEl.innerHTML = `<svg class="venue-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/></svg>${broadcast}`;
    info.appendChild(broadcastEl);
  }

  const youtubeUrl = data.youtubeUrl?.[i];
  if (youtubeUrl) {
    const ytEl = document.createElement("a");
    ytEl.className = "game-youtube";
    ytEl.href = youtubeUrl;
    ytEl.target = "_blank";
    ytEl.rel = "noopener noreferrer";
    ytEl.innerHTML = `${YOUTUBE_ICON_SVG}<span class="yt-label-default">${JOGOS.TEXT.YOUTUBE_LIVE_LABEL}</span><span class="yt-label-hover">${JOGOS.TEXT.YOUTUBE_LIVE_LABEL_HOVER}</span>`;
    ytEl.addEventListener("click", (e) => e.stopPropagation());
    info.appendChild(ytEl);
  }

  card.appendChild(info);
  return card;
}

function buildTeamEl(name, imgSrc, side) {
  const div = document.createElement("div");
  div.className = `${side}-team-div`;

  const icon = document.createElement("img");
  icon.className = `${side}-team-icon`;
  icon.src = imgSrc;
  icon.alt = name;

  const label = document.createElement("span");
  label.className = `${side}-team-name`;
  label.textContent = name;

  // home: [icon][name]  →  name adjacent to VS
  // away: [name][icon]  →  name adjacent to VS, icon on far right
  if (side === "away") {
    div.append(label, icon);
  } else {
    div.append(icon, label);
  }
  return div;
}

function buildVsEl() {
  const vs = document.createElement("span");
  vs.className = "vs-text";
  vs.textContent = JOGOS.TEXT.VS;
  return vs;
}

function formatDate(parts) {
  if (!parts || parts.length === 0) return "";
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const time = parts[parts.length - 1];
  if (parts.length === 2) return `${capitalize(parts[0])} às ${time}`;
  return `${capitalize(parts[0])} ${parts[1]} às ${time}`;
}

export function renderLiveGames(data, container) {
  if (data.team_home.length === 0) {
    container.style.display = "none";
    return;
  }

  const isHalftime = data.minute.some((m) => m === "Intervalo");

  const existing = container.querySelectorAll("a.game--live");
  if (existing.length === data.team_home.length) {
    let allMatch = true;
    existing.forEach((card, i) => {
      if (card.dataset.gameKey !== data.links[i]) allMatch = false;
    });
    if (allMatch) {
      existing.forEach((card, i) => {
        const newScore = `${data.score_home[i]} - ${data.score_away[i]}`;
        const scoreEl = card.querySelector(".live-score-text");
        if (scoreEl) scoreEl.textContent = newScore;
        card.querySelector(".live-minute").textContent = data.minute[i];
      });
      const headerEl = container.querySelector(".live-section-header");
      if (headerEl)
        headerEl.innerHTML = isHalftime
          ? JOGOS.TEXT.HALFTIME_HEADER
          : JOGOS.TEXT.LIVE_HEADER;
      container.style.display = "block";
      return;
    }
  }

  container.innerHTML = "";
  const header = document.createElement("div");
  header.className = "live-section-header";
  header.innerHTML = isHalftime
    ? JOGOS.TEXT.HALFTIME_HEADER
    : JOGOS.TEXT.LIVE_HEADER;
  container.appendChild(header);

  for (let i = 0; i < data.team_home.length; i++) {
    container.appendChild(buildLiveGameCard(data, i));
  }
  container.style.display = "block";
}

function buildLiveGameCard(data, i) {
  const href = data.links[i]
    ? data.links[i].startsWith("http")
      ? data.links[i]
      : `${JOGOS.URL.PLACAR_BASE}${data.links[i]}`
    : "#";

  const card = document.createElement("a");
  card.className = "game game--live";
  card.href = href;
  card.target = "_blank";
  card.rel = "noopener noreferrer";
  card.dataset.gameKey = data.links[i];

  const info = document.createElement("div");
  info.className = "game-info";

  const league = document.createElement("span");
  league.className = "game-league";
  league.textContent = data.campeonato[i];

  const teams = document.createElement("div");
  teams.className = "game-teams";

  const scoreWrap = document.createElement("span");
  scoreWrap.className = "score-text live-score";

  const scoreText = document.createElement("span");
  scoreText.className = "live-score-text";
  scoreText.textContent = `${data.score_home[i]} - ${data.score_away[i]}`;

  scoreWrap.appendChild(scoreText);

  teams.append(
    buildTeamEl(data.team_home[i], data.img_src_home[i], "home"),
    scoreWrap,
    buildTeamEl(data.team_away[i], data.img_src_away[i], "away"),
  );

  const minute = document.createElement("span");
  minute.className = "game-date live-minute";
  minute.textContent = data.minute[i];

  const hint = document.createElement("span");
  hint.className = "live-details-hint";
  hint.textContent = JOGOS.TEXT.LIVE_DETAILS_HINT;

  info.append(league, teams, minute, hint);

  const liveYoutubeUrl = data.youtubeUrl?.[i];
  if (liveYoutubeUrl) {
    const ytEl = document.createElement("a");
    ytEl.className = "game-youtube";
    ytEl.href = liveYoutubeUrl;
    ytEl.target = "_blank";
    ytEl.rel = "noopener noreferrer";
    ytEl.innerHTML = `${YOUTUBE_ICON_SVG}<span class="yt-label-default">${JOGOS.TEXT.YOUTUBE_LIVE_LABEL}</span><span class="yt-label-hover">${JOGOS.TEXT.YOUTUBE_LIVE_LABEL_HOVER}</span>`;
    ytEl.addEventListener("click", (e) => e.stopPropagation());
    info.appendChild(ytEl);
  }

  card.appendChild(info);
  return card;
}

export function renderFinishedGames(data, container, excludeLink = null) {
  container.innerHTML = "";
  for (let i = 0; i < data.team_home.length; i++) {
    if (excludeLink && data.links[i] === excludeLink) continue;
    container.appendChild(buildFinishedGameCard(data, i));
  }
}

function buildFinishedGameCard(data, i) {
  const href = data.links[i]
    ? data.links[i].startsWith("http")
      ? data.links[i]
      : `${JOGOS.URL.PLACAR_BASE}${data.links[i]}`
    : "#";

  const card = document.createElement("a");
  card.className = "game game--finished";
  card.href = href;
  card.target = "_blank";
  card.rel = "noopener noreferrer";
  card.title = JOGOS.TEXT.FINISHED_DETAILS_TITLE;

  const header = document.createElement("div");
  header.className = "finished-header";

  const league = document.createElement("span");
  league.className = "game-league";
  league.textContent = data.campeonato[i];

  const date = document.createElement("span");
  date.className = "finished-date";
  date.textContent = data.datas[i];

  header.append(league, date);

  const teams = document.createElement("div");
  teams.className = "game-teams";

  const score = document.createElement("span");
  score.className = "score-text";
  score.textContent = data.scoreboard[i] || "-";

  teams.append(
    buildTeamEl(data.team_home[i], data.img_src_home[i], "home"),
    score,
    buildTeamEl(data.team_away[i], data.img_src_away[i], "away"),
  );

  card.append(header, teams);
  return card;
}

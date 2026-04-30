import { isCacheValid, getCachedGames, setCachedGames, isFinishedCacheValid, getCachedFinishedGames, setCachedFinishedGames, clearFinishedCache, isSociosCacheValid, getCachedSocios, setCachedSocios, isTicketsCacheValid, getCachedTickets, setCachedTickets } from './services/cache.js';
import { fetchGames, fetchFinishedGames } from './services/gamesApi.js';
import { fetchLiveGameFromLastGames } from './services/liveGamesApi.js';
import { fetchSocios } from './services/sociosApi.js';
import { fetchTickets } from './services/ticketsApi.js';
import { renderGames, renderFinishedGames, renderLiveGames, renderTickets } from './ui/renderer.js';
import { initTabs } from './ui/tabs.js';
import { initDarkMode } from './ui/darkMode.js';
import { trackEvent } from './analytics.js';

document.addEventListener('DOMContentLoaded', init);

const prevScores = {};
let currentLiveLink = null;

async function init() {
  initTabs(trackEvent);
  initDarkMode();
  initCountdownToggle();
  document.getElementById('version-label').textContent = `v${chrome.runtime.getManifest().version}`;
  trackEvent('page_view');
  const gamesData = await loadGames();
  initCountdown(gamesData);
  pollLiveGames();
  setInterval(pollLiveGames, 30_000);
  initFinishedGamesToggle();
  loadSocios();
  loadTickets(gamesData);
}

async function loadGames() {
  if (isCacheValid()) {
    const cached = getCachedGames();
    if (cached) {
      console.log('Usando dados do cache');
      renderGames(cached);
      return cached;
    }
  }

  console.log('Cache expirado ou ausente. Fazendo nova requisição.');
  try {
    const data = await fetchGames();
    setCachedGames(data);
    renderGames(data);
    return data;
  } catch (err) {
    console.error('Erro ao buscar jogos:', err);
    return null;
  }
}

function parseGameDate(parts) {
  if (!parts || parts.length === 0) return null;
  const joined = parts.join(' ');
  // Time: "21:30" or "21h30"
  const timeMatch = joined.match(/(\d{1,2})[h:](\d{2})/);
  if (!timeMatch) return null;
  const h = parseInt(timeMatch[1], 10);
  const m = parseInt(timeMatch[2], 10);
  const now = new Date();
  // Date: "29/04" or "29/04/2026"
  const dateMatch = joined.match(/(\d{2})\/(\d{2})(?:\/\d{4})?/);
  if (dateMatch) {
    const dd = parseInt(dateMatch[1], 10);
    const mm = parseInt(dateMatch[2], 10);
    const year = now.getFullYear();
    const d = new Date(year, mm - 1, dd, h, m, 0, 0);
    if (d < now) d.setFullYear(year + 1);
    return d;
  }
  const first = parts[0].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const d = new Date(now);
  d.setHours(h, m, 0, 0);
  if (first === 'amanha') d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
  return d;
}

function initCountdownToggle() {
  const toggle = document.getElementById('countdown-toggle');
  const enabled = localStorage.getItem('showCountdown') === 'true';
  toggle.checked = enabled;
  toggle.addEventListener('change', () => {
    localStorage.setItem('showCountdown', toggle.checked);
    const el = document.getElementById('next-game-countdown');
    if (el) el.style.display = toggle.checked ? 'block' : 'none';
  });
}

function initCountdown(gamesData) {
  if (!gamesData?.datas?.length) return;
  const now = new Date();
  const nextDate = gamesData.datas.map(parseGameDate).find((d) => d && d > now);
  if (!nextDate) return;

  const el = document.getElementById('next-game-countdown');
  if (localStorage.getItem('showCountdown') === 'true') el.style.display = 'block';

  function tick() {
    const diff = nextDate - new Date();
    if (diff <= 0) {
      el.style.display = 'none';
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const pad = (n) => String(n).padStart(2, '0');
    const text = days > 0
      ? `${days}d ${pad(hours)}h ${pad(mins)}m`
      : `${pad(hours)}h ${pad(mins)}m`;
    el.textContent = `Próximo jogo em: ${text}`;
  }

  tick();
  setInterval(tick, 60_000);
}

function isGamePossiblyLive(parts) {
  if (!parts || parts.length === 0) return false;
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const todayStr = `${dd}/${mm}`;
  const isToday = parts[0].toLowerCase() === 'hoje' || parts.some((p) => p === todayStr);
  if (!isToday) return false;
  const timePart = parts.find((p) => /^\d{2}:\d{2}$/.test(p));
  if (!timePart) return true;
  const [h, m] = timePart.split(':').map(Number);
  const kickoff = new Date(now);
  kickoff.setHours(h, m, 0, 0);
  const diffMin = (now - kickoff) / 60000;
  return diffMin >= -15 && diffMin <= 130;
}

async function pollLiveGames() {
  const container = document.getElementById('live-games-list');
  const finishedPanel = document.getElementById('finished-games-list');
  try {
    const liveGame = await fetchLiveGameFromLastGames();
    if (!liveGame) {
      if (currentLiveLink) {
        currentLiveLink = null;
        clearFinishedCache();
        if (finishedPanel.style.display !== 'none') await loadFinishedGames(finishedPanel);
      }
      renderLiveGames({ team_home: [], team_away: [], campeonato: [], img_src_home: [], img_src_away: [], score_home: [], score_away: [], minute: [], links: [] }, container);
      return;
    }

    currentLiveLink = liveGame.link;
    const key = liveGame.link;
    const score = `${liveGame.score_home}-${liveGame.score_away}`;
    if (prevScores[key] !== undefined && prevScores[key] !== score) {
      showGoalToast(liveGame.team_home, liveGame.score_home, liveGame.team_away, liveGame.score_away);
    }
    prevScores[key] = score;

    renderLiveGames({
      campeonato: [liveGame.campeonato],
      team_home: [liveGame.team_home],
      team_away: [liveGame.team_away],
      img_src_home: [liveGame.img_src_home],
      img_src_away: [liveGame.img_src_away],
      score_home: [liveGame.score_home],
      score_away: [liveGame.score_away],
      minute: [liveGame.minute],
      links: [liveGame.link],
    }, container);

    if (finishedPanel.style.display !== 'none') container.style.display = 'none';
  } catch (err) {
    console.error('Erro ao buscar jogos ao vivo:', err);
  }
}

function showGoalToast(home, scoreHome, away, scoreAway) {
  const toast = document.getElementById('goal-toast');
  toast.textContent = `⚽ GOL! ${home} ${scoreHome} × ${scoreAway} ${away}`;
  toast.classList.add('show');
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => toast.classList.remove('show'), 5000);
}

function initFinishedGamesToggle() {
  const btn = document.getElementById('btn-finished-games');
  const panel = document.getElementById('finished-games-list');
  const gamesList = document.getElementById('games-list');
  const liveList = document.getElementById('live-games-list');

  btn.addEventListener('click', async () => {
    const isVisible = panel.style.display !== 'none';

    panel.style.display = isVisible ? 'none' : 'block';
    gamesList.style.display = isVisible ? 'block' : 'none';
    liveList.style.display = isVisible ? (liveList.children.length > 0 ? 'block' : 'none') : 'none';
    btn.classList.toggle('active', !isVisible);

    trackEvent('finished_games_toggle', { action: isVisible ? 'hide' : 'show' });

    if (!isVisible && panel.children.length === 0) {
      await loadFinishedGames(panel);
    }
  });
}

async function loadSocios() {
  const el = document.getElementById('footnote-socios-content');
  try {
    if (isSociosCacheValid()) {
      const cached = getCachedSocios();
      if (cached) {
        el.textContent = cached;
        return;
      }
    }
    const data = await fetchSocios();
    const text = data.Texto ?? data.texto ?? 'maiordonordeste.com.br';
    setCachedSocios(text);
    el.textContent = text;
  } catch {
    el.textContent = 'maiordonordeste.com.br';
  }
}

async function loadTickets(gamesData) {
  const tab = document.getElementById('tab-tickets');
  const container = document.getElementById('tickets-list');
  tab.style.display = '';

  let data = null;
  try {
    if (isTicketsCacheValid()) data = getCachedTickets();
    if (!data) {
      data = await fetchTickets();
      setCachedTickets(data);
    }
  } catch (err) {
    console.error('Erro ao buscar ingressos:', err);
  }

  const nextIdx = findNextGameIndex(gamesData);
  if (isNextGameHome(gamesData, nextIdx)) {
    const enriched = gamesData ? {
      campeonato: gamesData.campeonato[nextIdx],
      team_home: gamesData.team_home[nextIdx],
      team_away: gamesData.team_away[nextIdx],
      img_src_home: gamesData.img_src_home[nextIdx],
      img_src_away: gamesData.img_src_away[nextIdx],
      datas: gamesData.datas[nextIdx],
      local: gamesData.local?.[nextIdx] ?? null,
      broadcast: gamesData.broadcast?.[nextIdx] ?? null,
    } : {};
    renderTickets(data, container, enriched);
    return;
  }

  const nextHomeDate = findNextHomeGameDate(gamesData, nextIdx + 1);
  container.innerHTML = `<div class="loading-text">${
    nextHomeDate
      ? `Próximo jogo é fora de casa, dia ${nextHomeDate} tem jogo na Ilha novamente!`
      : 'Próximo jogo é fora de casa.'
  }</div>`;
}

function findNextHomeGameDate(gamesData, startIdx) {
  if (!gamesData?.datas?.length) return null;
  for (let i = startIdx; i < gamesData.datas.length; i++) {
    const venue = gamesData.local?.[i];
    if (venue && (venue.includes('Ilha do Retiro') || venue.includes('Recife'))) {
      const parts = gamesData.datas[i];
      return parts?.find((p) => /\d{2}\/\d{2}/.test(p)) ?? null;
    }
  }
  return null;
}

function findNextGameIndex(gamesData) {
  if (!gamesData?.datas?.length) return 0;
  const idx = gamesData.datas.findIndex((parts) => !isGamePossiblyLive(parts));
  return idx >= 0 ? idx : 0;
}

function isNextGameHome(gamesData, idx) {
  const venue = gamesData?.local?.[idx];
  if (!venue) return false;
  return venue.includes('Ilha do Retiro') || venue.includes('Recife');
}

async function loadFinishedGames(panel) {
  panel.innerHTML = '<div class="loading-text">Carregando...</div>';

  if (isFinishedCacheValid()) {
    const cached = getCachedFinishedGames();
    if (cached) {
      renderFinishedGames(cached, panel);
      return;
    }
  }

  try {
    const data = await fetchFinishedGames();
    setCachedFinishedGames(data);
    renderFinishedGames(data, panel, currentLiveLink);
  } catch (err) {
    console.error('Erro ao buscar jogos encerrados:', err);
    panel.innerHTML = '<div class="loading-text">Erro ao carregar jogos encerrados.</div>';
  }
}

import { isCacheValid, getCachedGames, setCachedGames, isFinishedCacheValid, getCachedFinishedGames, setCachedFinishedGames } from './services/cache.js';
import { fetchGames, fetchFinishedGames } from './services/gamesApi.js';
import { fetchSocios } from './services/sociosApi.js';
import { renderGames, renderFinishedGames } from './ui/renderer.js';
import { initTabs } from './ui/tabs.js';
import { initDarkMode } from './ui/darkMode.js';

document.addEventListener('DOMContentLoaded', init);

async function init() {
  initTabs();
  initDarkMode();
  document.getElementById('version-label').textContent = `v${chrome.runtime.getManifest().version}`;
  await loadGames();
  initFinishedGamesToggle();
  loadSocios();
}

async function loadGames() {
  if (isCacheValid()) {
    const cached = getCachedGames();
    if (cached) {
      console.log('Usando dados do cache');
      renderGames(cached);
      return;
    }
  }

  console.log('Cache expirado ou ausente. Fazendo nova requisição.');
  try {
    const data = await fetchGames();
    setCachedGames(data);
    renderGames(data);
  } catch (err) {
    console.error('Erro ao buscar jogos:', err);
  }
}

function initFinishedGamesToggle() {
  const btn = document.getElementById('btn-finished-games');
  const panel = document.getElementById('finished-games-list');
  const gamesList = document.getElementById('games-list');

  btn.addEventListener('click', async () => {
    const isVisible = panel.style.display !== 'none';

    panel.style.display = isVisible ? 'none' : 'block';
    gamesList.style.display = isVisible ? 'block' : 'none';
    btn.classList.toggle('active', !isVisible);

    if (!isVisible && panel.children.length === 0) {
      await loadFinishedGames(panel);
    }
  });
}

async function loadSocios() {
  const el = document.getElementById('footnote-socios-content');
  try {
    const data = await fetchSocios();
    el.textContent = data.Texto ?? data.texto ?? 'maiordonordeste.com.br';
  } catch {
    el.textContent = 'maiordonordeste.com.br';
  }
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
    renderFinishedGames(data, panel);
  } catch (err) {
    console.error('Erro ao buscar jogos encerrados:', err);
    panel.innerHTML = '<div class="loading-text">Erro ao carregar jogos encerrados.</div>';
  }
}

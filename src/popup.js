import { isCacheValid, getCachedGames, setCachedGames } from './services/cache.js';
import { fetchGames } from './services/gamesApi.js';
import { renderGames } from './ui/renderer.js';
import { initTabs } from './ui/tabs.js';
import { initDarkMode } from './ui/darkMode.js';

document.addEventListener('DOMContentLoaded', init);

async function init() {
  initTabs();
  initDarkMode();
  await loadGames();
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

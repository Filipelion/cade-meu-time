const CACHE_KEY = 'gamesData';
const CACHE_TS_KEY = 'lastFetched';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export function isCacheValid() {
  const lastFetched = localStorage.getItem(CACHE_TS_KEY);
  return !!lastFetched && Date.now() - Number(lastFetched) < CACHE_TTL_MS;
}

export function getCachedGames() {
  const raw = localStorage.getItem(CACHE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setCachedGames(data) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  localStorage.setItem(CACHE_TS_KEY, Date.now().toString());
}

export function clearCache() {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(CACHE_TS_KEY);
}

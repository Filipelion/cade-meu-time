const CACHE_KEY = 'gamesData_v3';
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

const FINISHED_CACHE_KEY = 'finishedGamesData_v2';
const FINISHED_CACHE_TS_KEY = 'lastFetchedFinished';
const FINISHED_CACHE_TTL_MS = 60 * 60 * 1000;

export function isFinishedCacheValid() {
  const lastFetched = localStorage.getItem(FINISHED_CACHE_TS_KEY);
  return !!lastFetched && Date.now() - Number(lastFetched) < FINISHED_CACHE_TTL_MS;
}

export function getCachedFinishedGames() {
  const raw = localStorage.getItem(FINISHED_CACHE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setCachedFinishedGames(data) {
  localStorage.setItem(FINISHED_CACHE_KEY, JSON.stringify(data));
  localStorage.setItem(FINISHED_CACHE_TS_KEY, Date.now().toString());
}

const TICKETS_CACHE_KEY = 'ticketsData';
const TICKETS_CACHE_TS_KEY = 'lastFetchedTickets';
const TICKETS_CACHE_TTL_MS = 30 * 60 * 1000;

export function isTicketsCacheValid() {
  const lastFetched = localStorage.getItem(TICKETS_CACHE_TS_KEY);
  return !!lastFetched && Date.now() - Number(lastFetched) < TICKETS_CACHE_TTL_MS;
}

export function getCachedTickets() {
  const raw = localStorage.getItem(TICKETS_CACHE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setCachedTickets(data) {
  localStorage.setItem(TICKETS_CACHE_KEY, JSON.stringify(data));
  localStorage.setItem(TICKETS_CACHE_TS_KEY, Date.now().toString());
}

const SOCIOS_CACHE_KEY = 'sociosData';
const SOCIOS_CACHE_TS_KEY = 'lastFetchedSocios';
const SOCIOS_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function isSociosCacheValid() {
  const lastFetched = localStorage.getItem(SOCIOS_CACHE_TS_KEY);
  return !!lastFetched && Date.now() - Number(lastFetched) < SOCIOS_CACHE_TTL_MS;
}

export function getCachedSocios() {
  const raw = localStorage.getItem(SOCIOS_CACHE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setCachedSocios(data) {
  localStorage.setItem(SOCIOS_CACHE_KEY, JSON.stringify(data));
  localStorage.setItem(SOCIOS_CACHE_TS_KEY, Date.now().toString());
}

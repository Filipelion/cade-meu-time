const GAMES_URL = 'https://www.placardefutebol.com.br/time/sport/proximos-jogos';
const FINISHED_GAMES_URL = 'https://www.placardefutebol.com.br/time/sport/ultimos-jogos';

const SELECTORS = {
  datetime: '.match__lg_card--datetime',
  league:   '.match__lg_card--league',
  homeName: '.match__lg_card--ht-name.text',
  awayName: '.match__lg_card--at-name.text',
  homeLogo: '.match__lg_card--ht-logo',
  awayLogo: '.match__lg_card--at-logo',
};

export function parseGamesFromHTML(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const all = (selector) => Array.from(doc.querySelectorAll(selector));

  return {
    datas:        all(SELECTORS.datetime).map((el) => el.textContent.trim().split(' ')),
    campeonato:   all(SELECTORS.league).map((el) => el.textContent.trim()),
    team_home:    all(SELECTORS.homeName).map((el) => el.textContent.trim()),
    team_away:    all(SELECTORS.awayName).map((el) => el.textContent.trim()),
    img_src_home: all(SELECTORS.homeLogo).map((el) => el.querySelector('img')?.getAttribute('src') ?? ''),
    img_src_away: all(SELECTORS.awayLogo).map((el) => el.querySelector('img')?.getAttribute('src') ?? ''),
    links:        all('a.match__lg').map((el) => el.getAttribute('href') ?? ''),
  };
}

export function parseVenueFromHTML(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const details = doc.querySelector('div.match-details');
  if (!details) return '';
  for (const p of details.querySelectorAll('p')) {
    if (p.querySelector('img[src*="local.png"]')) {
      return p.textContent.trim();
    }
  }
  return '';
}

async function fetchVenue(relativeUrl) {
  if (!relativeUrl) return '';
  try {
    const url = relativeUrl.startsWith('http')
      ? relativeUrl
      : `https://www.placardefutebol.com.br${relativeUrl}`;
    const res = await fetch(url);
    if (!res.ok) return '';
    return parseVenueFromHTML(await res.text());
  } catch {
    return '';
  }
}

export async function fetchGames() {
  const response = await fetch(GAMES_URL);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const html = await response.text();
  const data = parseGamesFromHTML(html);

  const local = await Promise.all(data.links.map(fetchVenue));
  return { ...data, local };
}

export function parseFinishedGamesFromHTML(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');

  let allCards = Array.from(doc.querySelectorAll('a.match__lg'));
  if (allCards.length === 0) {
    allCards = Array.from(doc.querySelectorAll('a')).filter(
      (a) => /\/\d{2}-\d{2}-\d{4}-/.test(a.getAttribute('href') || ''),
    );
  }
  console.log('[finished] cards found:', allCards.length, allCards[0]?.className);

  const cards = allCards.slice(0, 5);

  const result = {
    datas: [],
    campeonato: [],
    team_home: [],
    team_away: [],
    img_src_home: [],
    img_src_away: [],
    scoreboard: [],
    links: [],
  };

  for (const card of cards) {
    result.datas.push(card.querySelector('.match__lg_card--date')?.textContent.trim() ?? '');
    result.campeonato.push(card.querySelector('.match__lg_card--league')?.textContent.trim() ?? '');
    result.team_home.push(card.querySelector('.match__lg_card--ht-name.text')?.textContent.trim() ?? '');
    result.team_away.push(card.querySelector('.match__lg_card--at-name.text')?.textContent.trim() ?? '');
    result.img_src_home.push(card.querySelector('.match__lg_card--ht-logo img')?.getAttribute('src') ?? '');
    result.img_src_away.push(card.querySelector('.match__lg_card--at-logo img')?.getAttribute('src') ?? '');
    result.scoreboard.push(card.querySelector('.match__lg_card--scoreboard')?.textContent.trim() ?? '');
    result.links.push(card.getAttribute('href') ?? '');
  }

  return result;
}

export async function fetchFinishedGames() {
  const response = await fetch(FINISHED_GAMES_URL);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const html = await response.text();
  return parseFinishedGamesFromHTML(html);
}

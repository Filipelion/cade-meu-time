const GAMES_URL = 'https://www.placardefutebol.com.br/time/sport/proximos-jogos';

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

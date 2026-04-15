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
  };
}

export async function fetchGames() {
  const response = await fetch(GAMES_URL);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const html = await response.text();
  return parseGamesFromHTML(html);
}

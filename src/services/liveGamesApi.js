export function parseReloadFromHTML(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const scores = Array.from(doc.querySelectorAll('.match-score-text'));
  const statusEl = doc.querySelector('.status-name');
  const isLive = statusEl?.classList.contains('badge-success') ?? false;
  const minute = statusEl?.textContent.trim() ?? '';
  return {
    isLive,
    score_home: scores[0]?.textContent.trim() ?? '0',
    score_away: scores[1]?.textContent.trim() ?? '0',
    minute,
  };
}

async function fetchReload(relativeLink) {
  const slug = relativeLink
    .replace(/^https?:\/\/[^/]+\//, '')
    .replace(/^\//, '')
    .replace(/\.html$/, '');
  try {
    const res = await fetch(`https://www.placardefutebol.com.br/reload/${slug}`);
    if (!res.ok) return null;
    return parseReloadFromHTML(await res.text());
  } catch {
    return null;
  }
}

export async function fetchLiveGames(gameLinks) {
  if (!gameLinks || gameLinks.length === 0) return [];
  return Promise.all(gameLinks.map(fetchReload));
}

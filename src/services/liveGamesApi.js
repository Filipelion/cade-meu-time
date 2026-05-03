const LAST_GAMES_URL =
  "https://www.placardefutebol.com.br/time/sport/ultimos-jogos";

function extractCardMeta(card) {
  return {
    team_home:
      card.querySelector(".match__lg_card--ht-name.text")?.textContent.trim() ??
      "",
    team_away:
      card.querySelector(".match__lg_card--at-name.text")?.textContent.trim() ??
      "",
    img_src_home:
      card.querySelector(".match__lg_card--ht-logo img")?.getAttribute("src") ??
      "",
    img_src_away:
      card.querySelector(".match__lg_card--at-logo img")?.getAttribute("src") ??
      "",
    campeonato:
      card.querySelector(".match__lg_card--league")?.textContent.trim() ?? "",
    link: card.getAttribute("href") ?? "",
  };
}

function linkHasToday(link) {
  if (!link) return false;
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  return link.includes(`${dd}-${mm}-${yyyy}`);
}

async function fetchReloadData(link) {
  if (!link) return null;
  const slug = link
    .replace(/^https?:\/\/[^/]+\//, "")
    .replace(/^\//, "")
    .replace(/\.html$/, "");
  try {
    const res = await fetch(
      `https://www.placardefutebol.com.br/reload/${slug}`,
    );
    if (!res.ok) return null;
    return parseReloadFromHTML(await res.text());
  } catch {
    return null;
  }
}

export async function fetchLiveGameFromLastGames() {
  try {
    const res = await fetch(LAST_GAMES_URL);
    if (!res.ok) return null;
    const doc = new DOMParser().parseFromString(await res.text(), "text/html");
    const cards = Array.from(doc.querySelectorAll("a.match__lg"));

    for (const card of cards) {
      const meta = extractCardMeta(card);
      if (!linkHasToday(meta.link)) continue;
      const reload = await fetchReloadData(meta.link);
      if (!reload?.isLive) continue;
      return {
        isLive: true,
        ...meta,
        score_home: reload.score_home,
        score_away: reload.score_away,
        minute: reload.minute,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function parseReloadFromHTML(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const scores = Array.from(doc.querySelectorAll(".match-score-text"));
  const statusEl = doc.querySelector(".status-name");
  const minute = statusEl?.textContent.trim() ?? "";
  const isLive =
    (statusEl?.classList.contains("badge-success") ?? false) ||
    minute === "Intervalo";
  return {
    isLive,
    score_home: scores[0]?.textContent.trim() ?? "0",
    score_away: scores[1]?.textContent.trim() ?? "0",
    minute,
  };
}

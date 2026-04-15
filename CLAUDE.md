# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Chrome extension (Manifest V3) for fans of Sport Club do Recife. It shows upcoming games, links to news portals, and links to video channels via a popup UI.

## Installation / Loading the extension

No build step — load unpacked directly into Chrome:

1. Open `chrome://extensions/`
2. Enable Developer Mode
3. Click "Carregar sem compactação" and select this folder

After any code change, reload the extension on the extensions page and reopen the popup to see the result.

## Architecture

There is no framework, bundler, or package manager. Everything is plain HTML/CSS/vanilla JS.

| File | Role |
|---|---|
| `manifest.json` | Extension config (MV3). Declares `activeTab` permission and registers `background.js` as a content script (runs in every page context but is also loaded by `popup.html`). |
| `popup.html` | Extension popup UI. Three tabs: **Jogos**, **Notícias**, **Vídeos**. Tab switching and game data rendering happen via `background.js`. |
| `background.js` | All JS logic — fetches upcoming game data, caches it in `localStorage` (24h TTL), renders game cards into `#games-list`, and handles tab switching. |
| `style.css` | All styling for the popup. |

## Data flow for the Jogos tab

`fetchData()` in [background.js](background.js) scrapes `placardefutebol.com.br` via XHR and parses the HTML response with `DOMParser`. Scraped data (dates, leagues, team names, logo URLs) is stored as JSON in `localStorage` under the key `gamesData`, with `lastFetched` as the TTL timestamp. On the next popup open within 24h, the cached data is used directly.

CSS selectors used for scraping (brittle — upstream HTML changes will break them):
- `.match__lg_card--datetime` — date/time
- `.match__lg_card--league` — league name
- `.match__lg_card--ht-name.text` / `.match__lg_card--at-name.text` — team names
- `.match__lg_card--ht-logo` / `.match__lg_card--at-logo` — team logos

## Debugging

Open the popup, then right-click the extension icon → "Inspecionar popup" to open DevTools for the popup context. `console.log` statements in `background.js` will appear there. Cache hits/misses are logged:
- `"Usando dados do cache"` — served from localStorage
- `"Cache expirado ou ausente. Fazendo nova requisição."` — fresh XHR

To force a fresh fetch during development, clear `localStorage` in the popup DevTools console:
```js
localStorage.clear()
```

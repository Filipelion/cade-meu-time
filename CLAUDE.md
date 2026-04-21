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

No framework, bundler, or package manager. Plain HTML/CSS/ES modules.

```
src/
  popup.js              Entry point — wires everything together on DOMContentLoaded
  services/
    cache.js            localStorage read/write with 24h TTL (pure, no DOM — testable)
    gamesApi.js         fetch() + DOMParser scraping of placardefutebol.com.br (testable)
  ui/
    renderer.js         Builds and injects game card DOM nodes into #games-list
    tabs.js             Tab switching logic
    darkMode.js         Dark mode toggle with localStorage persistence
popup.html              Shell — three tabs (Jogos / Notícias / Vídeos), loads src/popup.js as module
style.css               All popup styling, CSS variables for light/dark theme
manifest.json           MV3 config — host_permissions for placardefutebol.com.br
background.js           Retired (no longer loaded)
```

`src/services/` has no DOM dependency — safe to unit-test in Node or a browser test harness.
`src/ui/` touches the DOM — integration/e2e tests needed.

## Data flow for the Jogos tab

`loadGames()` in [src/popup.js](src/popup.js) checks `cache.js` first (24h TTL in `localStorage`). On miss, calls `gamesApi.fetchGames()` which does a `fetch()` to `placardefutebol.com.br` and parses the HTML response with `DOMParser`. Result is passed to `renderer.renderGames()` and stored in cache.

CSS selectors used for scraping (brittle — upstream HTML changes will break them):
- `.match__lg_card--datetime` — date/time
- `.match__lg_card--league` — league name
- `.match__lg_card--ht-name.text` / `.match__lg_card--at-name.text` — team names
- `.match__lg_card--ht-logo` / `.match__lg_card--at-logo` — team logos

## Testing

Tests use Playwright and load the real extension into a headless Chrome instance. Network calls to `placardefutebol.com.br` are intercepted with `page.route()` — no real requests are made.

```bash
npm install          # first time only
npx playwright install chromium   # first time only
npm test             # run all tests
npx playwright test --grep "Dark mode"   # run a single describe block
```

The test fixture in `tests/popup.spec.js` uses a shared persistent Chrome context so the extension ID is resolved once in `beforeAll`. Each test gets a fresh page and calls `localStorage.clear()` + reload to avoid state bleed between tests.

## Debugging

Right-click extension icon → "Inspecionar popup" to open DevTools for the popup. Cache hits/misses log to console. To force a fresh fetch:

```js
localStorage.clear()
```

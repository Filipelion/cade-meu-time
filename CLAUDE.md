# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Chrome Extension (Manifest V3) for fans of Sport Club do Recife. Shows upcoming games, finished games with scores, news portals, video channels, and club membership count via a popup UI. No build step — plain HTML/CSS/ES modules loaded unpacked into Chrome. The extension source lives entirely in `src/`.

## Commands

```bash
npm install                                    # first time only
npx playwright install chromium                # first time only
npm test                                       # run all Playwright E2E tests
npx playwright test --grep "Dark mode"         # run a single describe block
npx playwright test tests/finished-games.spec.js  # run a single file
```

To reload the extension after code changes: go to `chrome://extensions/` → click the reload button → reopen the popup.

To force a fresh data fetch from the popup DevTools console:
```js
localStorage.clear()
```

## Architecture

```
src/
  manifest.json         MV3 — host_permissions for 3 domains, no service worker
  popup.html            Shell — 3 tabs (Jogos / Notícias / Vídeos), loads popup.js as module
  popup.js              Entry point — orchestrates all initialization on DOMContentLoaded
  style.css             All popup styling + CSS variables for light/dark theme
  analytics.js          Google Analytics 4 — tracks page_view, tab_click, finished_games_toggle
  services/
    cache.js            localStorage wrapper with per-dataset TTLs (no DOM — testable in Node)
    gamesApi.js         fetch() + DOMParser scraping of placardefutebol.com.br
    sociosApi.js        JSON fetch from maiordonordeste.com.br API (club membership count)
  ui/
    renderer.js         Builds DOM nodes for upcoming and finished game cards
    tabs.js             Tab switching logic with GA4 event emission
    darkMode.js         Dark mode toggle with localStorage persistence
tests/
  fixtures/
    index.js            Custom Playwright fixtures: sharedContext, extensionId, page
    mock-data.js        Fake HTML/JSON responses used by all tests
  helpers/
    page-setup.js       setup(), enableDark(), bgColor(), textColor() helpers
  dark-mode.spec.js
  tabs.spec.js
  finished-games.spec.js
  hover-effects.spec.js
  hyperlinks.spec.js
  footer.spec.js
```

`src/services/` has no DOM dependency. `src/ui/` touches the DOM — integration/E2E only.

## Startup flow

```
DOMContentLoaded (popup.js)
  → initTabs(trackEvent)           tab switching + GA4 events
  → initDarkMode()                 restore dark preference from localStorage
  → trackEvent('page_view')
  → loadGames()                    upcoming games (cache 24h)
      cache hit → render
      cache miss → fetchGames() → scrape placardefutebol.com.br → cache → render
  → initFinishedGamesToggle()      lazy: fetches only on first button click (cache 1h)
  → loadSocios()                   member count from API (cache 7d)
```

## Caching

| localStorage key | TTL | Data |
|---|---|---|
| `gamesData` / `lastFetched` | 24h | Upcoming games |
| `finishedGamesData_v2` / `lastFetchedFinished` | 1h | Finished games |
| `sociosData` / `lastFetchedSocios` | 7d | Member count |
| `darkMode` | indefinite | Dark mode preference |
| `_ga_cid` | indefinite | GA4 persistent client ID |

GA4 tracking is skipped when `localStorage.getItem('_ga_disabled') === '1'` — tests set this automatically.

## Scraping (brittle)

Games are scraped from placardefutebol.com.br HTML via `DOMParser`. CSS selectors:
- `.match__lg_card--datetime` — date/time
- `.match__lg_card--league` — league name
- `.match__lg_card--ht-name.text` / `.match__lg_card--at-name.text` — team names
- `.match__lg_card--ht-logo img` / `.match__lg_card--at-logo img` — team logos
- `.match__lg_card--scoreboard` — score (finished games only)

Venue is fetched separately per game from each game's detail page (`.match-details > p` with `img[src*="local.png"]`). Any upstream HTML change will silently break the relevant feature.

## Testing architecture

All tests use a **single shared persistent Chrome context** (one worker, sequential) so the extension ID is resolved once. Each test gets a fresh page with `localStorage.clear()` + reload to prevent state bleed.

`tests/helpers/page-setup.js#setup()` does for every test:
1. Routes placardefutebol.com.br → fake HTML from `mock-data.js`
2. Routes maiordonordeste.com.br/api → fake JSON
3. Routes google-analytics.com → 204 (no tracking)
4. Sets `_ga_disabled` in localStorage
5. Strips all CSS transitions/animations

CI runs tests with `xvfb-run` on Ubuntu (headless Chrome requires a virtual display).

## Theming

Brand colors: red `#b80000` (active tab bg, hover bg) and yellow `#ffee03` (active tab text, hover text). Dark mode applies a `.dark` class to `<body>` and uses CSS variables for all color overrides. No JavaScript color logic — purely CSS.

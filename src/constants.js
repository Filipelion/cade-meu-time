// --- Jogos tab ---
export const JOGOS = {
  ELEMENT: {
    GAMES_LIST: "games-list",
    LIVE_LIST: "live-games-list",
    FINISHED_LIST: "finished-games-list",
    BTN_FINISHED: "btn-finished-games",
    COUNTDOWN: "next-game-countdown",
    COUNTDOWN_TOGGLE: "countdown-toggle",
    GOAL_TOAST: "goal-toast",
  },
  STORAGE: {
    SHOW_COUNTDOWN: "showCountdown",
  },
  URL: {
    PLACAR_BASE: "https://www.placardefutebol.com.br",
  },
  TEXT: {
    COUNTDOWN_PREFIX: "Próximo jogo em ",
    LIVE_HEADER: '<span class="live-dot"></span> AO VIVO',
    HALFTIME_HEADER: '<span class="live-dot"></span> INTERVALO',
    LIVE_DETAILS_HINT: "Clique para ver os detalhes da partida",
    FINISHED_DETAILS_TITLE: "Veja os detalhes",
    VS: "VS",
    LOADING: "Carregando...",
    LOADING_ERROR: "Erro ao carregar jogos encerrados",
    FETCH_ERROR: "Erro ao buscar os próximos jogos",
    YOUTUBE_LIVE_LABEL: "Assistir ao vivo",
    YOUTUBE_LIVE_LABEL_HOVER: "Veja agora ao vivo",
    HOME_VENUES: ["Ilha do Retiro", "Recife"],
  },
};

// --- Ingressos tab ---
export const INGRESSOS = {
  ELEMENT: {
    TAB: "tab-tickets",
    LIST: "tickets-list",
  },
  URL: {
    BUY_BASE: "https://maiordonordeste.com.br/jogos/",
  },
  TEXT: {
    BUY_BTN: "Comprar",
    RELEASE_PREFIX: "Liberado ",
    FETCH_ERROR: "Erro ao buscar ingressos",
    AWAY_GAME: "Próximo jogo é fora de casa.",
    AWAY_GAME_WITH_DATE: (date) =>
      `Próximo jogo é fora de casa, dia ${date} tem jogo na Ilha novamente!`,
  },
};

// --- Sócios (footer) ---
export const SOCIOS = {
  ELEMENT: {
    CONTENT: "footnote-socios-content",
  },
  TEXT: {
    FALLBACK: "maiordonordeste.com.br",
  },
};

// --- Global UI ---
export const UI = {
  ELEMENT: {
    DARK_MODE_TOGGLE: "dark-mode-toggle",
    VERSION_LABEL: "version-label",
  },
  STORAGE: {
    DARK_MODE: "darkMode",
  },
};

// --- Analytics ---
export const ANALYTICS = {
  MEASUREMENT_ID: "G-H31X01K2KP",
  ENDPOINT: "https://www.google-analytics.com/g/collect",
  STORAGE: {
    CLIENT_ID: "_ga_cid",
    SESSION_ID: "_ga_sid",
    DISABLED: "_ga_disabled",
  },
  EVENT: {
    PAGE_VIEW: "page_view",
    TAB_CLICK: "tab_click",
    FINISHED_GAMES_TOGGLE: "finished_games_toggle",
    ERROR: "error",
  },
  DOC: {
    LOCATION: "https://extension.maiordonordeste.com.br/popup",
    TITLE: "Maior do Nordeste",
  },
};

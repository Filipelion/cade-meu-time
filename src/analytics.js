import { ANALYTICS } from "./constants.js";

function getClientId() {
  let id = localStorage.getItem(ANALYTICS.STORAGE.CLIENT_ID);
  if (!id) {
    id = `${Date.now()}.${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(ANALYTICS.STORAGE.CLIENT_ID, id);
  }
  return id;
}

function getSessionId() {
  let sid = sessionStorage.getItem(ANALYTICS.STORAGE.SESSION_ID);
  if (!sid) {
    sid = Date.now().toString();
    sessionStorage.setItem(ANALYTICS.STORAGE.SESSION_ID, sid);
  }
  return sid;
}

export function trackEvent(name, params = {}) {
  if (localStorage.getItem(ANALYTICS.STORAGE.DISABLED)) return;

  const customParams = Object.fromEntries(
    Object.entries(params).map(([k, v]) => [`ep.${k}`, v]),
  );

  const qs = new URLSearchParams({
    v: "2",
    tid: ANALYTICS.MEASUREMENT_ID,
    cid: getClientId(),
    sid: getSessionId(),
    sct: "1",
    seg: "1",
    en: name,
    _et: "100",
    _p: Math.round(Math.random() * 2_147_483_647).toString(),
    dl: ANALYTICS.DOC.LOCATION,
    dt: ANALYTICS.DOC.TITLE,
    ...customParams,
  });

  fetch(`${ANALYTICS.ENDPOINT}?${qs}`, { method: "POST", keepalive: true }).catch(
    () => {},
  );
}

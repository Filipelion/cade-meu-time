const MEASUREMENT_ID = 'G-H31X01K2KP';
const ENDPOINT = 'https://www.google-analytics.com/g/collect';

function getClientId() {
  let id = localStorage.getItem('_ga_cid');
  if (!id) {
    id = `${Date.now()}.${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('_ga_cid', id);
  }
  return id;
}

function getSessionId() {
  let sid = sessionStorage.getItem('_ga_sid');
  if (!sid) {
    sid = Date.now().toString();
    sessionStorage.setItem('_ga_sid', sid);
  }
  return sid;
}

export function trackEvent(name, params = {}) {
  if (localStorage.getItem('_ga_disabled')) return;

  const customParams = Object.fromEntries(
    Object.entries(params).map(([k, v]) => [`ep.${k}`, v])
  );

  const qs = new URLSearchParams({
    v: '2',
    tid: MEASUREMENT_ID,
    cid: getClientId(),
    sid: getSessionId(),
    sct: '1',
    seg: '1',
    en: name,
    _et: '100',
    _p: Math.round(Math.random() * 2_147_483_647).toString(),
    dl: 'https://extension.maiordonordeste.com.br/popup',
    dt: 'Maior do Nordeste',
    ...customParams,
  });

  fetch(`${ENDPOINT}?${qs}`, { method: 'POST', keepalive: true }).catch(() => {});
}

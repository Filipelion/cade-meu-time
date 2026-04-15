export function initTabs() {
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => activateTab(tab.id));
  });
}

function activateTab(tabId) {
  document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
  document.querySelectorAll('.content').forEach((c) => c.classList.remove('active'));

  document.getElementById(tabId)?.classList.add('active');
  document.getElementById(tabId.replace('tab-', 'content-'))?.classList.add('active');
}

import { ANALYTICS } from "../constants.js";

export function initTabs(trackEvent) {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      activateTab(tab.id);
      trackEvent?.(ANALYTICS.EVENT.TAB_CLICK, { tab: tab.id.replace("tab-", "") });
    });
  });
}

function activateTab(tabId) {
  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.remove("active"));
  document
    .querySelectorAll(".content")
    .forEach((c) => c.classList.remove("active"));

  document.getElementById(tabId)?.classList.add("active");
  document
    .getElementById(tabId.replace("tab-", "content-"))
    ?.classList.add("active");
}

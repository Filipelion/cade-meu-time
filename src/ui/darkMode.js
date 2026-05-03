import { UI } from "../constants.js";

export function initDarkMode() {
  const toggle = document.getElementById(UI.ELEMENT.DARK_MODE_TOGGLE);

  function apply(isDark) {
    document.body.classList.toggle("dark", isDark);
    toggle.checked = isDark;
  }

  apply(localStorage.getItem(UI.STORAGE.DARK_MODE) === "true");

  toggle.addEventListener("change", function () {
    localStorage.setItem(UI.STORAGE.DARK_MODE, this.checked);
    apply(this.checked);
  });
}

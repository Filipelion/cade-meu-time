const STORAGE_KEY = "darkMode";

export function initDarkMode() {
  const toggle = document.getElementById("dark-mode-toggle");

  function apply(isDark) {
    document.body.classList.toggle("dark", isDark);
    toggle.checked = isDark;
  }

  apply(localStorage.getItem(STORAGE_KEY) === "true");

  toggle.addEventListener("change", function () {
    localStorage.setItem(STORAGE_KEY, this.checked);
    apply(this.checked);
  });
}

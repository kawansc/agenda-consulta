const KEY = "healthup_theme";
export const getTheme = () => localStorage.getItem(KEY) || "auto";
export function applyTheme(t) {
  if (t === "auto") { document.documentElement.removeAttribute("data-theme"); localStorage.removeItem(KEY); }
  else { document.documentElement.setAttribute("data-theme", t); localStorage.setItem(KEY, t); }
}
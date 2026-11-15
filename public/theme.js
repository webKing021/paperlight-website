/*
 * Runs in <head> before the first paint, so the page never flashes the wrong theme.
 * It is a file of its own (not inline in index.html) so the site's Content-Security-Policy
 * can allow scripts from this site only, with no exception for inline code.
 */
try {
  var asked = new URLSearchParams(location.search).get("theme");
  if (asked === "light" || asked === "dark") localStorage.setItem("paperlight-theme", asked);
  if (localStorage.getItem("paperlight-theme") === "light") {
    document.documentElement.classList.remove("dark");
    document.querySelector('meta[name="theme-color"]').content = "#ffffff";
  }
} catch (e) {}
// Scroll reveals: only hide content when it can be revealed again (see src/lib/reveal.ts).
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.classList.add("reveal");
}

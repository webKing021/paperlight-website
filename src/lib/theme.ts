import { useCallback, useSyncExternalStore } from "react";

export type Theme = "dark" | "light";

const KEY = "paperlight-theme";
const listeners = new Set<() => void>();

function current(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function setTheme(theme: Theme) {
  const root = document.documentElement;
  // Swap colours without every element animating its own transition.
  root.classList.add("no-transitions");
  root.classList.toggle("dark", theme === "dark");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0a0a0b" : "#ffffff");
  requestAnimationFrame(() => root.classList.remove("no-transitions"));
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((fn) => fn());
}

/** Dark by default; the choice is remembered in this browser. */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, current, () => "dark" as Theme);
  const toggle = useCallback(() => setTheme(current() === "dark" ? "light" : "dark"), []);
  return { theme, toggle };
}

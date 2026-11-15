import { useSyncExternalStore } from "react";

export type Platform = "windows" | "linux";

/** Desktop Linux only: Android also says "Linux", and phones can't run Paperlight anyway. */
function detect(): Platform | null {
  if (typeof navigator === "undefined") return null;
  const hint = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ?? "";
  const ua = navigator.userAgent;
  if (/android/i.test(ua) || /android/i.test(hint)) return null;
  if (/linux|cros/i.test(hint) || /Linux|X11|CrOS/.test(ua)) return "linux";
  if (/windows/i.test(hint) || /Windows/.test(ua)) return "windows";
  return null;
}

/** What the visitor's own computer runs, when it is one Paperlight supports. */
export const DETECTED = detect();

let chosen: Platform = DETECTED ?? "windows";
const listeners = new Set<() => void>();

export function setPlatform(next: Platform) {
  if (next === chosen) return;
  chosen = next;
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** The system the download buttons are showing: the visitor's own to begin with, theirs to change. */
export function usePlatform(): Platform {
  return useSyncExternalStore(
    subscribe,
    () => chosen,
    () => "windows" as Platform,
  );
}

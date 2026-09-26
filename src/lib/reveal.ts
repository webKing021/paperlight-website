import { useEffect, useRef, type PointerEvent } from "react";

/*
 * Scroll reveals. The head script adds `reveal` to <html> before the first paint, only when
 * IntersectionObserver exists and the visitor hasn't asked for reduced motion; the CSS hides
 * `[data-reveal]` elements only under that class. So without JS, without the observer or with
 * reduced motion, everything is simply visible, and nothing flickers on load.
 */

let observer: IntersectionObserver | null = null;

function shared(): IntersectionObserver | null {
  if (observer || typeof IntersectionObserver === "undefined") return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        (e.target as HTMLElement).dataset.in = "";
        observer!.unobserve(e.target);
      }
    },
    // Reveal a little before the element is fully in view.
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
  );
  return observer;
}

/** Marks the element as shown once it scrolls into view. */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    const io = shared();
    if (!el) return;
    if (!io) {
      el.dataset.in = "";
      return;
    }
    io.observe(el);
    return () => io.unobserve(el);
  }, []);
  return ref;
}

/** A soft glow that follows the pointer across a card (pointer devices only, via CSS). */
export function spotlight(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

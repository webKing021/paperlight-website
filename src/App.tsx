import { useEffect } from "react";
import { Features } from "./components/Features";
import { Hero } from "./components/Hero";
import { Nav } from "./components/Nav";
import { NotFound } from "./components/NotFound";
import { Faq, FinalCta, Footer, Formats, Keyboard, OpenSource, Privacy, Screenshots, Steps } from "./components/Sections";

const HOME = new Set(["/", "/index", "/index.html"]);

/** Arriving at "/#faq": the browser looks for #faq before React has drawn it, so do it here. */
function useInitialHash() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const target = decodeURIComponent(hash.slice(1));
    const go = () => document.getElementById(target)?.scrollIntoView({ block: "start" });
    const id = requestAnimationFrame(go);
    // Once the web font has swapped in, lines may have re-wrapped: aim again, unless the
    // visitor has already scrolled somewhere themselves.
    let moved = false;
    const onWheel = () => (moved = true);
    window.addEventListener("wheel", onWheel, { passive: true, once: true });
    window.addEventListener("touchmove", onWheel, { passive: true, once: true });
    document.fonts?.ready.then(() => !moved && go());
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onWheel);
    };
  }, []);
}

export default function App() {
  useInitialHash();
  const path = window.location.pathname.replace(/\/+$/, "") || "/";

  if (!HOME.has(path)) {
    document.title = "Not found · Paperlight";
    return (
      <div className="overflow-x-clip">
        <Nav />
        <NotFound />
      </div>
    );
  }

  return (
    <div className="overflow-x-clip">
      <Nav />
      <main>
        <Hero />
        <Features />
        <Formats />
        <Privacy />
        <Steps />
        <Screenshots />
        <Keyboard />
        <OpenSource />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

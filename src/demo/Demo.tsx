import { Maximize2, Minimize2, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Beam, Landing } from "../components/Lamp";
import { cx } from "../components/ui";
import { AppWindow, type AppWindowHandle } from "./AppWindow";

/** Searches that show what the real search does: inside text, prefixes and typos. */
const TRIES = [
  { q: "invoice", note: "names" },
  { q: "booking page", note: "words inside" },
  { q: "tax deadline", note: "inside PDFs" },
  { q: "lisbn", note: "a typo" },
];

export function Demo() {
  const frame = useRef<HTMLDivElement>(null);
  const app = useRef<AppWindowHandle>(null);
  const [key, setKey] = useState(0);
  const [full, setFull] = useState(false);
  const visible = useRef(false);

  useEffect(() => {
    const onChange = () => setFull(document.fullscreenElement === frame.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Ctrl+K (or /) jumps to the demo's search while it is on screen, like in the app.
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
      if (!visible.current) return;
      if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") || (e.key === "/" && !typing)) {
        e.preventDefault();
        app.current?.focusSearch();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      io.disconnect();
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const toggleFull = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else frame.current?.requestFullscreen?.();
  };

  return (
    <div>
      <div className="relative z-10 mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 px-1">
        <div className="flex items-center gap-2 text-sm">
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-lamp opacity-50" />
            <span className="relative size-2 rounded-full bg-lamp" />
          </span>
          <span className="font-medium text-fg">Interactive demo</span>
          <span className="text-faint">· sample documents</span>
        </div>
        <div className="order-3 flex w-full flex-wrap items-center gap-1.5 text-sm sm:order-none sm:w-auto">
          <span className="text-muted">Try</span>
          {TRIES.map((t) => (
            <button
              key={t.q}
              type="button"
              onClick={() => app.current?.searchFor(t.q)}
              title={`Search ${t.note}`}
              className="rounded-full border border-border bg-card px-2.5 py-0.5 text-fg-2 transition-colors hover:border-border-2 hover:text-fg"
            >
              {t.q}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={() => setKey((k) => k + 1)}
            className="flex h-8 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-sm text-fg-2 transition-colors hover:border-border-2 hover:text-fg"
          >
            <RotateCcw className="size-3.5" /> Reset
          </button>
          <button
            type="button"
            onClick={toggleFull}
            className="hidden h-8 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-sm text-fg-2 transition-colors hover:border-border-2 hover:text-fg sm:flex"
          >
            {full ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />} {full ? "Exit" : "Fullscreen"}
          </button>
        </div>
      </div>

      <div className="relative">
        {/* The lamp: a beam falling from the top of the page and landing on the window. */}
        <Beam />
        <div className="window-rise relative">
          <Landing />
          <div
            ref={frame}
            className={cx(
              "relative rounded-[11px] shadow-[0_30px_80px_-24px_rgb(0_0_0/0.3)] dark:shadow-[0_30px_100px_-20px_rgb(0_0_0/0.9)]",
              full && "bg-paper",
            )}
          >
            <AppWindow key={key} ref={app} fullscreen={full} />
          </div>
        </div>
      </div>
    </div>
  );
}

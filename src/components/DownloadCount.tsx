import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { useDownloads } from "../lib/github";
import { cx } from "./ui";

/** Counts up to `target` once when it first arrives (instantly with reduced motion). */
function useCountUp(target: number | null): number {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (target === null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || target < 2) {
      setShown(target);
      return;
    }
    const start = performance.now();
    const duration = Math.min(1400, 500 + target * 2);
    let frame = requestAnimationFrame(function step(now) {
      const t = Math.min(1, (now - start) / duration);
      setShown(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return shown;
}

export function downloadsLabel(n: number): string {
  return n === 1 ? "download" : "downloads";
}

/**
 * The real number of installer downloads from GitHub, as an amber chip on its own solid
 * background so the hero's light beam can't wash it out.
 */
export function DownloadChip({ className }: { className?: string }) {
  const total = useDownloads();
  const shown = useCountUp(total);
  if (total === null) return null;
  return (
    <span
      className={cx(
        "animate-fade inline-flex h-8 items-center gap-2 rounded-full border border-lamp/45 bg-[color-mix(in_oklab,var(--lamp)_14%,var(--bg))] pr-3.5 pl-1 text-[14px] whitespace-nowrap shadow-[0_0_24px_-8px_rgb(234_176_76/0.6)] backdrop-blur-md",
        className,
      )}
      title="Installer downloads across all releases, counted by GitHub"
    >
      <span className="relative flex size-6 items-center justify-center rounded-full bg-lamp text-[#1b1b1e]">
        <span className="absolute inset-0 animate-ping rounded-full bg-lamp opacity-50 [animation-iteration-count:3]" />
        <Download className="relative size-3.5" strokeWidth={2.4} />
      </span>
      <span className="font-semibold text-fg tabular-nums">{shown.toLocaleString("en-US")}</span>
      <span className="text-fg-2">{downloadsLabel(total)}</span>
    </span>
  );
}

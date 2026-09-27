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

/** The real number of installer downloads from GitHub, next to the download buttons. */
export function DownloadStat({ className }: { className?: string }) {
  const total = useDownloads();
  const shown = useCountUp(total);
  if (total === null) return null;
  return (
    <div
      className={cx("animate-fade flex h-13 flex-col justify-center", className)}
      title="Installer downloads across all releases, counted by GitHub"
    >
      <span className="text-[24px] leading-none font-semibold tracking-[-0.03em] text-fg tabular-nums">
        {shown.toLocaleString("en-US")}
      </span>
      <span className="mt-1.5 flex items-center gap-1.5 text-[13px] text-muted">
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-lamp opacity-60 [animation-iteration-count:3]" />
          <span className="relative inline-flex size-1.5 rounded-full bg-lamp" />
        </span>
        {downloadsLabel(total)} so far
      </span>
    </div>
  );
}

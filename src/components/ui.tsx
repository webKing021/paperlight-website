import type { ReactNode } from "react";
import type { Range } from "../demo/search";
import { Reveal, RevealLines } from "./Reveal";

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

/** Text with the matching words marked, the way Paperlight highlights search results. */
export function Highlight({ text, ranges }: { text: string; ranges?: Range[] }) {
  if (!ranges?.length) return <>{text}</>;
  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
  const out: ReactNode[] = [];
  let at = 0;
  for (const [s, e] of sorted) {
    if (s < at) continue;
    if (s > at) out.push(text.slice(at, s));
    out.push(
      <mark key={s} className="hl">
        {text.slice(s, e)}
      </mark>,
    );
    at = e;
  }
  out.push(text.slice(at));
  return <>{out}</>;
}

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cx(
        "inline-flex h-[1.6em] min-w-[1.6em] items-center justify-center rounded-md border border-b-2 border-border-2 bg-card-2 px-1.5 text-[0.8em] font-medium text-fg-2",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

/** A section's heading: lines that rise in one after another, then one sentence under it. */
export function SectionHeading({ title, lead, center }: { title: ReactNode[]; lead?: ReactNode; center?: boolean }) {
  return (
    <div className={cx("max-w-3xl", center && "mx-auto text-center")}>
      <RevealLines
        lines={title}
        className="text-[clamp(2rem,4.4vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-fg"
      />
      {lead && (
        <Reveal as="p" index={2} className="mt-4 text-lg leading-relaxed text-pretty text-muted">
          {lead}
        </Reveal>
      )}
    </div>
  );
}

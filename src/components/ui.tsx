import type { ReactNode } from "react";
import type { Range } from "../demo/search";
import { Reveal, RevealLines } from "./Reveal";

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

/** The site's buttons. */
export const btn = {
  primary:
    "btn-glow inline-flex h-12 items-center gap-2.5 rounded-full bg-button px-6 text-[15px] font-semibold whitespace-nowrap text-on-button transition-transform duration-300 hover:-translate-y-px",
  outline:
    "inline-flex h-12 items-center gap-2 rounded-full border border-border-2 bg-card/60 px-5 text-[15px] font-medium whitespace-nowrap text-fg-2 transition-colors hover:border-faint hover:text-fg",
};

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

/** The small amber label above a heading. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-2.5 text-[12.5px] font-semibold tracking-[0.14em] text-accent uppercase", className)}>
      <span aria-hidden="true" className="h-px w-6 bg-lamp" />
      {children}
    </span>
  );
}

/** A section's heading: a label, lines that rise in one after another, then one sentence. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  center,
}: {
  eyebrow?: string;
  title: ReactNode[];
  lead?: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={cx("max-w-3xl", center && "mx-auto text-center")}>
      {eyebrow && (
        <Reveal className="mb-5">
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <RevealLines
        lines={title}
        className="text-[clamp(2.1rem,4.8vw,3.6rem)] leading-[1.04] font-semibold tracking-[-0.04em] text-fg"
      />
      {lead && (
        <Reveal as="p" index={2} className={cx("mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-muted", center && "mx-auto")}>
          {lead}
        </Reveal>
      )}
    </div>
  );
}

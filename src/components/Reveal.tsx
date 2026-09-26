import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from "react";
import { useReveal } from "../lib/reveal";

/**
 * Fades its content up into place when scrolled into view. `index` staggers siblings;
 * `variant` picks the motion ("up" by default, "scale" for large media).
 */
export function Reveal({
  as: Tag = "div",
  index = 0,
  variant = "up",
  className,
  style,
  children,
  ...rest
}: {
  as?: ElementType;
  index?: number;
  variant?: "up" | "scale";
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "children" | "className" | "style">) {
  const ref = useReveal<HTMLElement>();
  return (
    <Tag {...rest} ref={ref} data-reveal={variant} className={className} style={{ ...style, "--i": index } as CSSProperties}>
      {children}
    </Tag>
  );
}

/**
 * A heading whose lines rise one after another out of a mask. Each entry of `lines` is one
 * line; lines after the first are shown in the muted colour.
 */
export function RevealLines({
  lines,
  as: Tag = "h2",
  className,
  mutedFrom = 1,
}: {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  mutedFrom?: number;
}) {
  const ref = useReveal<HTMLElement>();
  return (
    <Tag ref={ref} data-reveal="lines" className={className}>
      {lines.map((line, i) => (
        <span key={i} className="line-mask">
          <span style={{ "--l": i } as CSSProperties} className={i >= mutedFrom ? "text-muted" : undefined}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}

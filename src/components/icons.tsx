import type { Kind } from "../demo/data";

const COLOR: Record<Kind, string> = {
  pdf: "var(--pdf)",
  word: "var(--word)",
  excel: "var(--excel)",
  slides: "var(--slides)",
};

const BADGE: Record<Kind, string> = { pdf: "PDF", word: "DOC", excel: "XLS", slides: "PPT" };

/** The app's document icon: a page with a folded corner and a badge in the type's colour. */
export function FileIcon({ kind, ext, size = 30, className }: { kind: Kind; ext?: string; size?: number; className?: string }) {
  const label = ext && ext.length <= 3 ? ext.toUpperCase() : BADGE[kind];
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden="true" style={{ flexShrink: 0 }}>
      <path
        d="M8.5 2.5h11L26.5 9.5v19a1.5 1.5 0 0 1-1.5 1.5H8.5A1.5 1.5 0 0 1 7 28.5v-24.5a1.5 1.5 0 0 1 1.5-1.5z"
        fill="var(--sheet)"
        stroke="var(--line-strong)"
      />
      <path d="M19.5 2.5v5.5a1.5 1.5 0 0 0 1.5 1.5h5.5" fill="var(--paper-2)" stroke="var(--line-strong)" />
      <path d="M11 9.5h5M11 12.5h11" stroke="var(--line-strong)" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="3" y="16" width="20" height="10" rx="2" fill={COLOR[kind]} />
      <text x="13" y="23.4" textAnchor="middle" fontSize="6.6" fontWeight="700" letterSpacing="0.2" fill="#fff" fontFamily="Segoe UI, Geist Variable, sans-serif">
        {label}
      </text>
    </svg>
  );
}

/** The small navigation glyph: a page outline in the type's colour. */
export function KindGlyph({ kind, className }: { kind: Kind; className?: string }) {
  const color = COLOR[kind];
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path
        d="M4 1.75h5.25L12.75 5.25v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-10.5a1 1 0 0 1 1-1z"
        fill={color}
        fillOpacity="0.14"
        stroke={color}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M9.25 1.75v3.5h3.5" fill="none" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

/** The Paperlight mark: an ink stem and a lamp-amber bowl, a "P" that is also a pool of light. */
export function Mark({ className, stem = "var(--fg)", bowl = "var(--lamp)" }: { className?: string; stem?: string; bowl?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="4" y="3" width="3.4" height="18" rx="0.4" fill={stem} />
      <path d="M9 3a7 7 0 0 1 0 14z" fill={bowl} />
    </svg>
  );
}

/** The app icon (the tile the installer puts on the desktop). */
export function AppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden="true">
      <rect width="512" height="512" rx="104" fill="#1C1B18" />
      <rect x="164" y="128" width="68" height="256" rx="6" fill="#F5F3EE" />
      <path d="M252 128a100 100 0 0 1 0 200z" fill="#E3A23B" />
    </svg>
  );
}

export function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

/** Windows logo, for the download button. */
export function WindowsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
      <path d="M0 2.2 6.5 1.3v6.2H0V2.2zm7.3-1L16 0v7.5H7.3V1.2zM0 8.3h6.5v6.3L0 13.7V8.3zm7.3 0H16V16l-8.7-1.2V8.3z" />
    </svg>
  );
}

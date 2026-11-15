import { ArrowRight, ArrowUp, Check, ChevronRight, FolderOpen, Mail, Search, Settings, Star } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { KINDS, makeLibrary, TAGS, type Kind } from "../demo/data";
import { search } from "../demo/search";
import { formatSize } from "../lib/format";
import { useRepoInfo } from "../lib/github";
import { FileIcon, Mark } from "./icons";
import { spotlight, useInView } from "../lib/reveal";
import { Reveal, RevealLines } from "./Reveal";
import { cx, Highlight, Kbd, SectionHeading } from "./ui";

function Card({
  title,
  body,
  children,
  className,
  index,
}: {
  title: string;
  body: ReactNode;
  children: ReactNode;
  className?: string;
  index: number;
}) {
  return (
    <Reveal index={index} className={cx("flex", className)}>
      <div
        onPointerMove={spotlight}
        className="spot card-depth flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-border-2"
      >
        <div className="relative min-h-[210px] flex-1 overflow-hidden border-b border-border bg-bg-2 p-4 sm:p-5">{children}</div>
        <div className="relative p-5 sm:p-6">
          <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-fg">{title}</h3>
          <p className="mt-1.5 text-[15px] leading-relaxed text-pretty text-muted">{body}</p>
        </div>
      </div>
    </Reveal>
  );
}

/* A search box that types by itself and shows real results from the sample library. */
const QUERIES = ["northfield", "tax deadline", "lisbon hotel", "regresion"];

function TypingSearch() {
  const library = useMemo(() => makeLibrary(), []);
  const [qi, setQi] = useState(0);
  const [len, setLen] = useState(0);
  const target = QUERIES[qi];
  const [ref, inView] = useInView<HTMLDivElement>();

  useEffect(() => {
    if (!inView) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setLen(target.length);
      return;
    }
    const done = len >= target.length;
    const t = setTimeout(
      () => {
        if (done) {
          setQi((i) => (i + 1) % QUERIES.length);
          setLen(0);
        } else setLen((l) => l + 1);
      },
      done ? 2600 : 70 + Math.random() * 60,
    );
    return () => clearTimeout(t);
  }, [len, target, inView]);

  const q = target.slice(0, len);
  const hits = useMemo(() => (len >= 3 ? search(library, q).slice(0, 3) : []), [library, q, len]);

  return (
    <div ref={ref} className="font-app mx-auto max-w-[560px] rounded-xl border border-line bg-paper text-left shadow-[0_20px_50px_-24px_rgb(0_0_0/0.5)]">
      <div className="flex h-11 items-center gap-2.5 border-b border-line px-3.5">
        <Search className="size-4 text-graphite" />
        <span className="text-[14px] text-ink">
          {q}
          <span className="animate-caret ml-px inline-block h-4 w-px translate-y-[3px] bg-ink" />
        </span>
        {q === "regresion" && <span className="ml-auto text-[11.5px] text-pencil">typo forgiven</span>}
      </div>
      <div className="min-h-[186px] p-1.5">
        {hits.map((h) => (
          <div key={h.doc.id} className="animate-fade flex items-start gap-3 rounded-lg px-2.5 py-2">
            <FileIcon kind={h.doc.kind} ext={h.doc.ext} size={28} />
            <div className="min-w-0">
              <div className="truncate text-[13.5px] font-medium text-ink">
                <Highlight text={h.doc.name.slice(0, h.doc.name.lastIndexOf("."))} ranges={h.name} />
                {h.doc.name.slice(h.doc.name.lastIndexOf("."))}
              </div>
              {h.snippet ? (
                <div className="truncate text-[12.5px] text-ink-2">
                  <Highlight text={h.snippet.text} ranges={h.snippet.ranges} />
                </div>
              ) : (
                <div className="truncate text-[12px] text-pencil">{h.doc.folder}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* A feed of file-system changes arriving live. */
const EVENTS = [
  { verb: "Added", name: "Invoice INV-2064.pdf", kind: "pdf" as Kind, where: "Clients\\Blue Fern Cafe" },
  { verb: "Renamed", name: "Budget 2026 final.xlsx", kind: "excel" as Kind, where: "was Budget 2026.xlsx" },
  { verb: "Moved", name: "Thesis Draft v7.docx", kind: "word" as Kind, where: "to Study\\Submitted" },
  { verb: "Changed", name: "Q3 Client Review.pptx", kind: "slides" as Kind, where: "saved in PowerPoint" },
  { verb: "Removed", name: "old notes.docx", kind: "word" as Kind, where: "sent to Recycle Bin" },
];

function LiveFeed() {
  const [n, setN] = useState(3);
  const [ref, inView] = useInView<HTMLDivElement>();
  useEffect(() => {
    if (!inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setN((x) => x + 1), 2400);
    return () => clearInterval(t);
  }, [inView]);
  const items = [0, 1, 2].map((i) => ({ ...EVENTS[(n - i) % EVENTS.length], key: n - i }));
  return (
    <div ref={ref} className="font-app mx-auto max-w-[460px] space-y-2.5">
      {items.map((e, i) => (
        <div
          key={e.key}
          className={cx(
            "flex items-center gap-3 rounded-lg border border-line bg-paper px-3 py-2 transition-opacity",
            i === 0 ? "animate-rise" : i === 1 ? "opacity-70" : "opacity-40",
          )}
        >
          <FileIcon kind={e.kind} size={24} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] text-ink">{e.name}</div>
            <div className="truncate text-[11.5px] text-pencil">
              {e.verb} · {e.where}
            </div>
          </div>
          <span className="text-[11px] whitespace-nowrap text-graphite">{i === 0 ? "just now" : `${i * 2}s ago`}</span>
        </div>
      ))}
    </div>
  );
}

function Buckets() {
  const lib = useMemo(() => makeLibrary(), []);
  return (
    <div className="font-app grid grid-cols-2 gap-2.5">
      {KINDS.map((k, i) => {
        const list = lib.filter((d) => d.kind === k.id);
        return (
          <div key={k.id} className={cx("rounded-lg border bg-paper p-3", i === 0 ? "border-ink" : "border-line")}>
            <FileIcon kind={k.id} size={22} />
            <div className="mt-1.5 text-[20px] leading-none font-semibold text-ink">{list.length}</div>
            <div className="mt-1 truncate text-[12px] text-graphite">{k.bucket}</div>
          </div>
        );
      })}
    </div>
  );
}

function QuickKeys() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5">
      <div className="flex items-center gap-3">
        {["Alt", "Space"].map((k, i) => (
          <span key={k} className="contents">
            {i > 0 && <span className="text-2xl text-faint">+</span>}
            <kbd
              className={cx(
                "flex h-16 items-center justify-center rounded-2xl border border-b-4 border-border-2 bg-card text-[19px] font-medium text-fg",
                i === 0 ? "w-24" : "w-48",
              )}
            >
              {k}
            </kbd>
          </span>
        ))}
      </div>
      <div className="font-app flex w-full max-w-[340px] items-center gap-2.5 rounded-xl border border-line bg-paper px-3.5 py-2.5 shadow-[0_16px_40px_-20px_rgb(0_0_0/0.5)]">
        <Search className="size-4 text-graphite" />
        <span className="flex-1 text-[13.5px] text-pencil">Find any document…</span>
        <Mark className="size-4" stem="var(--ink)" bowl="var(--app-lamp)" />
      </div>
    </div>
  );
}

function Dupes() {
  const lib = useMemo(() => makeLibrary(), []);
  const total = lib.reduce((sum, d) => sum + d.size, 0);
  return (
    <div className="font-app rounded-xl border border-line bg-paper p-2">
      <div className="flex justify-between px-2 pt-1 pb-2 text-[11.5px] text-graphite">
        <span>2 copies · 182 KB each</span>
        <span className="text-ok">Identical</span>
      </div>
      {[
        ["Invoice INV-2063.pdf", "Work\\Clients\\Blue Fern Cafe"],
        ["Invoice INV-2063 (1).pdf", "Downloads"],
      ].map(([n, f]) => (
        <div key={n} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
          <FileIcon kind="pdf" size={24} />
          <div className="min-w-0">
            <div className="truncate text-[12.5px] text-ink">{n}</div>
            <div className="truncate text-[11px] text-pencil">{f}</div>
          </div>
        </div>
      ))}
      <div className="mt-1 border-t border-line px-2 pt-2 text-[11.5px] text-graphite">
        Storage: <span className="text-ink">{formatSize(total)}</span> across {lib.length} documents
      </div>
    </div>
  );
}

function Organise() {
  return (
    <div className="font-app space-y-2">
      {[
        { name: "Tax Return 2025-26 Summary.pdf", kind: "pdf" as Kind, tag: TAGS[2], fav: true },
        { name: "Project Proposal - Northfield.docx", kind: "word" as Kind, tag: TAGS[0], fav: false },
        { name: "Thesis Draft v7.docx", kind: "word" as Kind, tag: TAGS[1], fav: true },
      ].map((d) => (
        <div key={d.name} className="flex items-center gap-2.5 rounded-lg border border-line bg-paper px-3 py-2">
          <FileIcon kind={d.kind} size={24} />
          <span className="min-w-0 flex-1 truncate text-[12.5px] text-ink">{d.name}</span>
          <span className="hidden items-center gap-1 rounded-full border border-line px-1.5 py-0.5 text-[11px] text-ink-2 sm:inline-flex">
            <span className="size-1.5 rounded-full" style={{ background: d.tag.color }} />
            {d.tag.name}
          </span>
          <Star className={cx("size-4 shrink-0", d.fav ? "fill-app-lamp text-app-lamp" : "text-pencil")} />
        </div>
      ))}
    </div>
  );
}

/** A result being dragged out of Paperlight into another app. */
function DragOut() {
  return (
    <div className="font-app flex h-full flex-col justify-center gap-3">
      <div className="flex w-[82%] -rotate-2 items-center gap-2.5 rounded-lg border border-line-strong bg-paper px-3 py-2 shadow-[0_16px_40px_-20px_rgb(0_0_0/0.5)]">
        <FileIcon kind="pdf" size={24} />
        <span className="min-w-0 flex-1 truncate text-[12.5px] text-ink">Invoice INV-2064.pdf</span>
      </div>
      <div className="ml-auto flex w-[82%] items-center gap-2.5 rounded-lg border border-dashed border-line-strong bg-paper-2 px-3 py-3 text-[12.5px] text-graphite">
        <Mail className="size-4 shrink-0" strokeWidth={1.7} />
        Drop it into an email, a chat or a folder
      </div>
      <div className="flex items-center gap-1.5 text-[12px] text-pencil">
        or <Kbd>Ctrl</Kbd> <Kbd>C</Kbd> to copy the file
      </div>
    </div>
  );
}

/** The app's update ring: full while an update waits, filling as it downloads. */
function Ring({ size, animated, children }: { size: number; animated?: boolean; children: ReactNode }) {
  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="18" cy="18" r="16.5" fill="none" stroke="var(--line-strong)" strokeWidth="2.5" />
        <circle
          cx="18"
          cy="18"
          r="16.5"
          fill="none"
          stroke="var(--app-lamp)"
          strokeWidth="2.5"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="100 100"
          className={animated ? "update-ring" : undefined}
        />
      </svg>
      {children}
    </span>
  );
}

/** The sidebar card and the dialog Paperlight shows when a new version is out. */
function Updates() {
  const { version } = useRepoInfo();
  const [major, minor] = version.split(".").map(Number);
  const next = Number.isFinite(minor) ? `${major}.${minor + 1}.0` : "next";
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={cx("font-app flex h-full flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6", !inView && "resting")}>
      <div className="w-full max-w-[250px] rounded-xl border border-line bg-paper-2 p-2">
        <div className="flex items-center gap-2.5 rounded-lg border border-app-lamp/40 bg-lamp-wash/45 py-2 pr-2.5 pl-1.5">
          <Ring size={28}>
            <ArrowUp className="size-3.5 text-ink" strokeWidth={2.4} />
          </Ring>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] leading-tight font-semibold text-ink">Update available</span>
            <span className="mt-0.5 block truncate text-[11.5px] leading-tight text-graphite">Paperlight {next} is ready</span>
          </span>
          <ChevronRight className="size-4 text-graphite" />
        </div>
        <div className="mt-1 flex h-8 items-center gap-3 px-3 text-[13px] text-ink-2">
          <Settings className="size-4" strokeWidth={1.7} /> Settings
        </div>
      </div>
      <div className="w-full max-w-[320px] overflow-hidden rounded-xl border border-line-strong bg-paper shadow-[0_20px_50px_-24px_rgb(0_0_0/0.5)]">
        <div className="flex items-center gap-3 p-4">
          <Ring size={44} animated>
            <Mark className="size-[18px]" stem="var(--ink)" bowl="var(--app-lamp)" />
          </Ring>
          <div className="min-w-0">
            <div className="truncate text-[14.5px] font-semibold text-ink">A new Paperlight is ready</div>
            <div className="mt-1 flex items-center gap-1.5 text-[11.5px]">
              <span className="rounded border border-line-strong px-1 text-graphite tabular-nums">{version}</span>
              <ArrowRight className="size-3 text-pencil" />
              <span className="rounded bg-app-lamp px-1 font-semibold text-[#1b1b1e] tabular-nums">{next}</span>
            </div>
          </div>
        </div>
        <div className="border-t border-line bg-paper-2 px-4 py-3">
          <div className="flex justify-between text-[11.5px]">
            <span className="font-medium text-ink">Downloading…</span>
            <span className="text-pencil">keeps your index</span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-selected">
            <div className="update-fill h-full w-full rounded-full bg-app-lamp" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Choose() {
  const [on, setOn] = useState<Record<string, boolean>>({ PDF: true, Word: true, Excel: true, PowerPoint: false });
  return (
    <div className="font-app grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
      <div className="rounded-xl border border-line bg-paper p-1.5">
        {Object.entries(on).map(([k, v]) => (
          <button
            key={k}
            type="button"
            onClick={() => setOn((s) => ({ ...s, [k]: !s[k] }))}
            className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-[12.5px] text-ink hover:bg-hover"
            aria-pressed={v}
          >
            {k}
            <span className={cx("relative h-[18px] w-8 rounded-full transition-colors", v ? "bg-ink" : "border border-line-strong bg-paper-2")}>
              <span
                className={cx(
                  "absolute top-1/2 size-3 -translate-y-1/2 rounded-full transition-all",
                  v ? "left-[16px] bg-paper" : "left-[3px] bg-graphite",
                )}
              />
            </span>
          </button>
        ))}
      </div>
      <div className="rounded-xl border border-line bg-paper p-1.5">
        {[
          ["C:\\Users\\Maya", true],
          ["D:\\Projects", true],
          ["node_modules, AppData…", false],
        ].map(([p, inc]) => (
          <div key={String(p)} className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12.5px]">
            <FolderOpen className="size-3.5 text-graphite" />
            <span className={cx("min-w-0 flex-1 truncate", inc ? "text-ink" : "text-pencil line-through")}>{p}</span>
            {inc ? <Check className="size-3.5 text-ok" /> : <span className="text-[11px] text-pencil">skipped</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ The three stories */

const KEYS: [string[], string][] = [
  [["Alt", "Space"], "Quick search"],
  [["Ctrl", "K"], "Search"],
  [["Enter"], "Open"],
  [["Ctrl", "Enter"], "Show in folder"],
  [["Ctrl", "C"], "Copy file"],
  [["Ctrl", "Shift", "C"], "Copy path"],
  [["Ctrl", "D"], "Favourite"],
  [["Ctrl", "T"], "Tag"],
];

function Shortcuts() {
  return (
    <Reveal index={3} className="mt-7 grid grid-cols-1 gap-x-8 border-t border-border pt-5 min-[440px]:grid-cols-2">
      {KEYS.map(([keys, label]) => (
        <div key={label} className="flex items-center justify-between gap-3 py-1.5">
          <span className="text-[14.5px] text-fg-2">{label}</span>
          <span className="flex gap-1 text-[14px]">
            {keys.map((k) => (
              <Kbd key={k}>{k}</Kbd>
            ))}
          </span>
        </div>
      ))}
    </Reveal>
  );
}

/** One big feature: the live visual on one side, what it means on the other. */
function Story({
  n,
  title,
  body,
  points,
  flip,
  extra,
  children,
}: {
  n: string;
  title: string;
  body: ReactNode;
  points?: string[];
  flip?: boolean;
  extra?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
      <Reveal
        variant="scale"
        className={cx(
          // On a phone the words come first, then the picture; side by side from lg up.
          "card-depth relative order-2 flex min-h-[280px] items-center overflow-hidden rounded-3xl border border-border bg-bg-2 p-5 sm:min-h-[380px] sm:p-10",
          flip ? "lg:order-2" : "lg:order-none",
        )}
      >
        <div aria-hidden="true" className="grid-bg absolute inset-0 opacity-50" />
        <div className="relative w-full">{children}</div>
      </Reveal>
      <div>
        <Reveal as="span" className="block text-[13px] font-semibold tracking-[0.14em] text-accent tabular-nums">
          {n}
        </Reveal>
        <RevealLines
          as="h3"
          lines={[title]}
          className="mt-3 text-[clamp(1.75rem,3.3vw,2.6rem)] leading-[1.08] font-semibold tracking-[-0.035em] text-fg"
        />
        <Reveal as="p" index={1} className="mt-4 text-[17px] leading-relaxed text-pretty text-muted">
          {body}
        </Reveal>
        {points && (
          <Reveal as="ul" index={2} className="mt-6 space-y-2.5">
            {points.map((p) => (
              <li key={p} className="flex gap-2.5 text-[15.5px] leading-relaxed text-fg-2">
                <Check className="mt-1 size-4 shrink-0 text-lamp" strokeWidth={2.4} />
                <span>{p}</span>
              </li>
            ))}
          </Reveal>
        )}
        {extra}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Formats */

const READ: [string, Kind][] = [
  ["pdf", "pdf"],
  ["docx", "word"],
  ["odt", "word"],
  ["rtf", "word"],
  ["xlsx", "excel"],
  ["xlsm", "excel"],
  ["xlsb", "excel"],
  ["xls", "excel"],
  ["ods", "excel"],
  ["csv", "excel"],
  ["pptx", "slides"],
  ["odp", "slides"],
];

function FormatGrid() {
  return (
    <ul className="grid h-full grid-cols-4 content-center gap-x-2 gap-y-4">
      {READ.map(([ext, kind]) => (
        <li key={ext} className="flex flex-col items-center gap-1.5">
          <FileIcon kind={kind} ext={ext} size={34} />
          <span className="text-[12px] text-muted">.{ext}</span>
        </li>
      ))}
    </ul>
  );
}

export function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-[1200px] px-5 pt-32 sm:px-8 sm:pt-40">
      <SectionHeading
        eyebrow="What it does"
        title={["You remember what it said.", "Paperlight knows where it is."]}
        lead="Documents pile up in Downloads, on the Desktop, in project folders and old drives. Paperlight reads them once and keeps up, so any of them is a few keystrokes away."
      />

      <div className="mt-20 space-y-20 sm:space-y-28">
        <Story
          n="01"
          title="Search inside every document."
          body="Names, folders and the text of PDFs, Word, Excel and PowerPoint files: whole documents, not just the first pages."
          points={[
            "Long reports are searched to the end, up to 200,000 characters each.",
            "Typos are forgiven and the first few letters are enough.",
            "The matching passage is highlighted, so you know it's the right file.",
          ]}
        >
          <TypingSearch />
        </Story>
        <Story
          n="02"
          flip
          title="Quick search from any app."
          body="Press Alt+Space wherever you are (or a shortcut you choose), type a few letters, press Enter. The document opens, and your hands never leave the keyboard."
          extra={<Shortcuts />}
        >
          <QuickKeys />
        </Story>
        <Story
          n="03"
          title="Always current, never busy."
          body="New, renamed, moved and deleted files show up within a second. The disk tells Paperlight what changed, so nothing is ever rescanned."
          points={[
            "The first scan runs at background priority, and you can search while it runs.",
            "No CPU use when idle, and about 6 MB of memory in the tray.",
          ]}
        >
          <LiveFeed />
        </Story>
      </div>

      <Reveal as="h3" className="mt-24 text-[clamp(1.5rem,2.6vw,2rem)] font-semibold tracking-[-0.03em] text-fg sm:mt-32">
        And everything around it.
      </Reveal>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card index={0} className="lg:col-span-2" title="A tile for every type" body="PDFs, Word documents, spreadsheets and presentations, each with its own search.">
          <Buckets />
        </Card>
        <Card index={1} className="lg:col-span-2" title="Duplicates and storage" body="Find byte-identical copies and see what takes space. Nothing is ever deleted for you.">
          <Dupes />
        </Card>
        <Card
          index={2}
          className="md:col-span-2 lg:col-span-2"
          title="Drag it where you need it"
          body="Found it? Drag the result straight into an email, a chat or a folder. The original stays where it is."
        >
          <DragOut />
        </Card>
        <Card
          index={0}
          className="lg:col-span-3"
          title="Organise without touching files"
          body="Favourites, tags, recently opened and previews live in Paperlight. Your files stay exactly where they are."
        >
          <Organise />
        </Card>
        <Card
          index={1}
          className="lg:col-span-3"
          title="You choose what's indexed"
          body="Pick the formats and folders. System folders, AppData and developer clutter are skipped from the start."
        >
          <Choose />
        </Card>
        <Card
          index={0}
          className="md:col-span-2 lg:col-span-4"
          title="Updates itself"
          body="Download it once; it works offline from then on. When a new version brings new features, Paperlight shows what's new and, if you want it, installs it in a few seconds, signed and verified, keeping your index, favourites and tags."
        >
          <Updates />
        </Card>
        <Card
          index={1}
          className="md:col-span-2 lg:col-span-2"
          title="Reads the text of 12 formats"
          body="Older doc, dot, ppt and pps files are found by name. Plain txt and md files can be switched on."
        >
          <FormatGrid />
        </Card>
      </div>
    </section>
  );
}

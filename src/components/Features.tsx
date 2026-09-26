import { Check, FolderOpen, Search, Star } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { KINDS, makeLibrary, TAGS, type Kind } from "../demo/data";
import { search } from "../demo/search";
import { formatSize } from "../lib/format";
import { FileIcon, Mark } from "./icons";
import { spotlight } from "../lib/reveal";
import { Reveal } from "./Reveal";
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

  useEffect(() => {
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
  }, [len, target]);

  const q = target.slice(0, len);
  const hits = useMemo(() => (len >= 3 ? search(library, q).slice(0, 3) : []), [library, q, len]);

  return (
    <div className="font-app mx-auto max-w-[560px] rounded-xl border border-line bg-paper shadow-[0_20px_50px_-24px_rgb(0_0_0/0.5)]">
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
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setN((x) => x + 1), 2400);
    return () => clearInterval(t);
  }, []);
  const items = [0, 1, 2].map((i) => ({ ...EVENTS[(n - i) % EVENTS.length], key: n - i }));
  return (
    <div className="font-app space-y-2">
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
      <div className="flex items-center gap-2.5">
        <Kbd className="h-12 min-w-16 rounded-xl text-[17px]">Alt</Kbd>
        <span className="text-xl text-faint">+</span>
        <Kbd className="h-12 min-w-36 rounded-xl text-[17px]">Space</Kbd>
      </div>
      <div className="font-app flex w-full max-w-[280px] items-center gap-2.5 rounded-xl border border-line bg-paper px-3.5 py-2.5 shadow-[0_16px_40px_-20px_rgb(0_0_0/0.5)]">
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

export function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-[1200px] px-5 pt-36 sm:px-8">
      <SectionHeading
        title={["You remember what it said.", "Paperlight knows where it is."]}
        lead="Documents pile up in Downloads, on the Desktop, in project folders and old drives. Paperlight reads them once and keeps up, so any of them is a few keystrokes away."
      />

      <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card
          index={0}
          className="md:col-span-2 lg:col-span-4"
          title="Search inside documents"
          body="Names, folders and the text of PDFs, Word, Excel and PowerPoint files. Prefixes work, typos are forgiven, and the matching passage is highlighted."
        >
          <TypingSearch />
        </Card>
        <Card
          index={1}
          className="lg:col-span-2"
          title="Quick search from any app"
          body="Press Alt+Space wherever you are, type a few letters, press Enter. The document opens."
        >
          <QuickKeys />
        </Card>
        <Card index={0} className="lg:col-span-2" title="Always current" body="New, renamed, moved and deleted files show up within a second, with no rescans.">
          <LiveFeed />
        </Card>
        <Card index={1} className="lg:col-span-2" title="A tile for every type" body="PDFs, Word documents, spreadsheets and presentations, each with its own search.">
          <Buckets />
        </Card>
        <Card index={2} className="lg:col-span-2" title="Duplicates and storage" body="Find byte-identical copies and see what takes space. Nothing is ever deleted for you.">
          <Dupes />
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
      </div>
    </section>
  );
}

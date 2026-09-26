import {
  ClipboardCopy,
  Copy,
  FilePen,
  Files,
  FolderOpen,
  History,
  LayoutGrid,
  PanelLeft,
  PieChart,
  Search,
  Settings,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { FileIcon, KindGlyph, Mark } from "../components/icons";
import { cx, Highlight } from "../components/ui";
import { formatAgo, formatDate, formatSize } from "../lib/format";
import { KINDS, TAGS, type Doc, type Kind, type TagId } from "./data";
import { search, type Hit } from "./search";

export type View =
  | "overview"
  | "all"
  | "changed"
  | "opened"
  | "favourites"
  | "duplicates"
  | "storage"
  | `kind:${Kind}`
  | `tag:${TagId}`;

/* ------------------------------------------------------------------ Sidebar */

function NavItem({
  active,
  icon,
  label,
  count,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "relative flex h-8 w-full items-center gap-2.5 rounded-md px-2.5 text-left text-[13px] transition-colors",
        active ? "bg-selected text-ink" : "text-ink-2 hover:bg-hover",
      )}
    >
      {active && <span className="absolute top-2 bottom-2 -left-1 w-[3px] rounded-full bg-app-lamp" />}
      <span className="flex size-4 shrink-0 items-center justify-center text-graphite [&>svg]:size-4">{icon}</span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {count !== undefined && <span className="text-[12px] text-pencil tabular-nums">{count}</span>}
    </button>
  );
}

function NavGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-4">
      <div className="px-2.5 pb-1 text-[12px] text-pencil">{title}</div>
      <div className="space-y-px">{children}</div>
    </div>
  );
}

export function Sidebar({
  docs,
  view,
  onView,
  onCollapse,
}: {
  docs: Doc[];
  view: View;
  onView: (v: View) => void;
  onCollapse: () => void;
}) {
  const count = (f: (d: Doc) => boolean) => docs.filter(f).length;
  return (
    <aside className="flex w-[216px] shrink-0 flex-col border-r border-line bg-paper-2">
      <div className="flex h-12 items-center gap-2 px-4">
        <Mark className="size-5" stem="var(--ink)" bowl="var(--app-lamp)" />
        <span className="flex-1 text-[15px] font-semibold text-ink">Paperlight</span>
        <button type="button" onClick={onCollapse} className="rounded p-1 text-graphite hover:bg-hover" aria-label="Hide sidebar">
          <PanelLeft className="size-4" />
        </button>
      </div>
      <nav className="app-scroll flex-1 overflow-y-auto px-2 pb-3">
        <div className="space-y-px">
          <NavItem active={view === "overview"} icon={<LayoutGrid />} label="Overview" onClick={() => onView("overview")} />
          <NavItem active={view === "all"} icon={<Files />} label="All documents" count={docs.length} onClick={() => onView("all")} />
          <NavItem active={view === "changed"} icon={<FilePen />} label="Recently changed" onClick={() => onView("changed")} />
          <NavItem
            active={view === "opened"}
            icon={<History />}
            label="Recently opened"
            count={count((d) => !!d.opened)}
            onClick={() => onView("opened")}
          />
          <NavItem
            active={view === "favourites"}
            icon={<Star />}
            label="Favourites"
            count={count((d) => !!d.favourite)}
            onClick={() => onView("favourites")}
          />
        </div>
        <NavGroup title="Types">
          {KINDS.map((k) => (
            <NavItem
              key={k.id}
              active={view === `kind:${k.id}`}
              icon={<KindGlyph kind={k.id} />}
              label={k.label}
              count={count((d) => d.kind === k.id)}
              onClick={() => onView(`kind:${k.id}`)}
            />
          ))}
        </NavGroup>
        <NavGroup title="Insights">
          <NavItem active={view === "duplicates"} icon={<Copy />} label="Duplicates" onClick={() => onView("duplicates")} />
          <NavItem active={view === "storage"} icon={<PieChart />} label="Storage" onClick={() => onView("storage")} />
        </NavGroup>
        <NavGroup title="Tags">
          {TAGS.map((t) => (
            <NavItem
              key={t.id}
              active={view === `tag:${t.id}`}
              icon={<span className="size-2 rounded-full" style={{ background: t.color }} />}
              label={t.name}
              count={count((d) => d.tags.includes(t.id))}
              onClick={() => onView(`tag:${t.id}`)}
            />
          ))}
        </NavGroup>
      </nav>
      <div className="border-t border-line p-2">
        <NavItem active={false} icon={<Settings />} label="Settings" onClick={() => onView("overview")} />
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ Rows */

function TagChip({ id }: { id: TagId }) {
  const tag = TAGS.find((t) => t.id === id)!;
  return (
    <span className="inline-flex h-5 shrink-0 items-center gap-1 rounded-full border border-line px-1.5 text-[11.5px] text-ink-2">
      <span className="size-1.5 rounded-full" style={{ background: tag.color }} />
      {tag.name}
    </span>
  );
}

export function DocRow({
  doc,
  hit,
  selected,
  now,
  onSelect,
  onOpen,
  onStar,
  onAction,
}: {
  doc: Doc;
  hit?: Hit;
  selected: boolean;
  now: number;
  onSelect: () => void;
  onOpen: () => void;
  onStar: () => void;
  onAction: (msg: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const was = useRef(selected);
  // Keep the selected row visible inside the list only (never the page), when the selection moves.
  useEffect(() => {
    if (was.current === selected) return;
    was.current = selected;
    const row = ref.current;
    const list = row?.closest<HTMLElement>("[data-scroll]");
    if (!selected || !row || !list) return;
    const r = row.getBoundingClientRect();
    const l = list.getBoundingClientRect();
    if (r.top < l.top) list.scrollTop -= l.top - r.top + 8;
    else if (r.bottom > l.bottom) list.scrollTop += r.bottom - l.bottom + 8;
  }, [selected]);

  return (
    <div
      ref={ref}
      role="option"
      aria-selected={selected}
      onClick={onSelect}
      onDoubleClick={onOpen}
      className={cx(
        "group grid cursor-default grid-cols-[minmax(0,1fr)] items-center gap-3 rounded-lg px-3 py-2 sm:grid-cols-[minmax(0,1fr)_104px_64px_auto]",
        selected ? "bg-selected" : "hover:bg-hover",
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <FileIcon kind={doc.kind} ext={doc.ext} size={30} />
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="truncate text-[13.5px] font-medium text-ink">
              <Highlight text={doc.name.slice(0, doc.name.lastIndexOf("."))} ranges={hit?.name} />
              {doc.name.slice(doc.name.lastIndexOf("."))}
            </span>
            {doc.favourite && <Star className="size-3.5 shrink-0 fill-app-lamp text-app-lamp" />}
            <span className="hidden gap-1 md:flex">
              {doc.tags.map((t) => (
                <TagChip key={t} id={t} />
              ))}
            </span>
          </div>
          <div className="truncate text-[12px] text-pencil">{doc.folder}</div>
          {hit?.snippet && (
            <div className="mt-0.5 truncate text-[12.5px] text-ink-2">
              <Highlight text={hit.snippet.text} ranges={hit.snippet.ranges} />
            </div>
          )}
        </div>
      </div>
      <div className="hidden text-[12.5px] text-graphite sm:block">{formatAgo(doc.modified, now)}</div>
      <div className="hidden text-right text-[12.5px] text-graphite tabular-nums sm:block">{formatSize(doc.size)}</div>
      <div className={cx("hidden items-center gap-0.5 sm:flex", selected ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
        <RowButton label={doc.favourite ? "Remove from favourites" : "Add to favourites"} onClick={onStar}>
          <Star className={cx("size-4", doc.favourite && "fill-app-lamp text-app-lamp")} />
        </RowButton>
        <RowButton label="Show in folder" onClick={() => onAction(`Would open ${doc.folder.split("\\").pop()} in File Explorer`)}>
          <FolderOpen className="size-4" />
        </RowButton>
        <RowButton label="Copy path" onClick={() => onAction("Path copied (in the demo, nothing was copied)")}>
          <ClipboardCopy className="size-4" />
        </RowButton>
      </div>
    </div>
  );
}

function RowButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="rounded-md p-1.5 text-graphite hover:bg-paper hover:text-ink"
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ Overview tiles */

export function BucketTiles({ docs, active, onPick }: { docs: Doc[]; active: Kind; onPick: (k: Kind) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {KINDS.map((k) => {
        const list = docs.filter((d) => d.kind === k.id);
        const size = list.reduce((s, d) => s + d.size, 0);
        const on = active === k.id;
        return (
          <button
            key={k.id}
            type="button"
            onClick={() => onPick(k.id)}
            className={cx(
              "rounded-xl border bg-sheet p-3.5 text-left transition-colors",
              on ? "border-ink ring-1 ring-ink" : "border-line hover:border-line-strong",
            )}
          >
            <FileIcon kind={k.id} size={26} />
            <div className="mt-2 text-[26px] leading-none font-semibold text-ink tabular-nums">{list.length}</div>
            <div className="mt-1.5 truncate text-[13.5px] font-medium text-ink">{k.bucket}</div>
            <div className="truncate text-[12px] text-pencil">
              {formatSize(size)} · {k.formats}
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ Details */

function PaperPreview({ doc }: { doc: Doc }) {
  const title = doc.name.slice(0, doc.name.lastIndexOf("."));
  if (doc.kind === "slides") {
    const points = doc.text.split(/[.:]\s+/).filter(Boolean).slice(0, 4);
    return (
      <div className="aspect-video w-full rounded-md bg-white p-4 text-left text-[#18181b] shadow-[0_1px_2px_rgb(0_0_0/0.08),0_8px_24px_-8px_rgb(0_0_0/0.25)]">
        <div className="h-1 w-6 rounded bg-[#cf5b26]" />
        <div className="mt-2 text-[11px] leading-tight font-semibold">{title}</div>
        <ul className="mt-2 space-y-1 text-[6.5px] leading-snug text-[#555]">
          {points.map((p, i) => (
            <li key={i} className="truncate">
              • {p}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (doc.kind === "excel") {
    const cells = doc.text.split(/[·,.:]\s+/).filter(Boolean).slice(0, 18);
    return (
      <div className="aspect-[4/3] w-full overflow-hidden rounded-md bg-white text-left shadow-[0_1px_2px_rgb(0_0_0/0.08),0_8px_24px_-8px_rgb(0_0_0/0.25)]">
        <div className="bg-[#1b7a46] px-2 py-1 text-[7px] font-semibold text-white">{title}</div>
        <div className="grid grid-cols-3">
          {cells.map((c, i) => (
            <div key={i} className="truncate border-r border-b border-[#e5e5e5] px-1 py-[3px] text-[6px] text-[#333]">
              {c}
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="mx-auto aspect-[1/1.3] w-[86%] rounded-sm bg-white px-4 py-4 text-left text-[#18181b] shadow-[0_1px_2px_rgb(0_0_0/0.08),0_8px_24px_-8px_rgb(0_0_0/0.25)]">
      <div className={cx("h-[2px] w-5", doc.kind === "word" ? "bg-[#2b5fc0]" : "bg-[#e09c26]")} />
      <div className="mt-2 text-[8.5px] leading-tight font-semibold">{title}</div>
      <div className="mt-0.5 text-[5.5px] text-[#888]">{doc.folder.split("\\").pop()}</div>
      <div className="my-2 h-px bg-[#eee]" />
      <p className="text-[5.5px] leading-[1.6] text-[#444]">{doc.text}</p>
      <div className="mt-2 space-y-1">
        {[88, 94, 70, 82, 60].map((w, i) => (
          <div key={i} className="h-[3px] rounded-full bg-[#eee]" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

function Meta({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[76px_1fr] gap-2 border-t border-line py-2.5 text-[12.5px]">
      <span className="text-pencil">{label}</span>
      <span className="min-w-0 break-words text-ink-2">{children}</span>
    </div>
  );
}

export function DetailsPane({
  doc,
  now,
  onOpen,
  onStar,
  onAction,
}: {
  doc: Doc | undefined;
  now: number;
  onOpen: () => void;
  onStar: () => void;
  onAction: (msg: string) => void;
}) {
  return (
    <aside className="flex w-[288px] shrink-0 flex-col border-l border-line bg-paper">
      <div className="flex h-12 items-center px-5 text-[14px] font-semibold text-ink">Details</div>
      {doc ? (
        <div key={doc.id} className="app-scroll animate-fade flex-1 overflow-y-auto">
          <div className="border-y border-line bg-paper-2 px-6 py-5">
            <PaperPreview doc={doc} />
          </div>
          <div className="px-5 py-4">
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1 text-[15px] leading-snug font-semibold break-words text-ink">{doc.name}</div>
              <button type="button" onClick={onStar} aria-label="Favourite" className="rounded p-0.5 hover:bg-hover">
                <Star className={cx("size-4.5", doc.favourite ? "fill-app-lamp text-app-lamp" : "text-graphite")} />
              </button>
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-graphite">
              <FileIcon kind={doc.kind} ext={doc.ext} size={18} />
              {doc.ext.toUpperCase()} · {formatSize(doc.size)}
            </div>
            <div className="mt-3.5 flex gap-2">
              <button
                type="button"
                onClick={onOpen}
                className="h-8 flex-1 rounded-md bg-ink text-[13px] font-medium text-on-ink transition-opacity hover:opacity-90"
              >
                Open
              </button>
              <button
                type="button"
                onClick={() => onAction(`Would open ${doc.folder.split("\\").pop()} in File Explorer`)}
                className="flex size-8 items-center justify-center rounded-md border border-line text-graphite hover:bg-hover"
                aria-label="Show in folder"
              >
                <FolderOpen className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => onAction("Path copied (in the demo, nothing was copied)")}
                className="flex size-8 items-center justify-center rounded-md border border-line text-graphite hover:bg-hover"
                aria-label="Copy path"
              >
                <ClipboardCopy className="size-4" />
              </button>
            </div>
            <div className="mt-4">
              <Meta label="Folder">{doc.folder}</Meta>
              <Meta label="Modified">{formatDate(doc.modified)}</Meta>
              <Meta label="Opened">{doc.opened ? `${doc.opened.count}× · last ${formatAgo(doc.opened.last, now)}` : "Not yet"}</Meta>
              <Meta label="Tags">
                {doc.tags.length ? (
                  <span className="flex flex-wrap gap-1">
                    {doc.tags.map((t) => (
                      <TagChip key={t} id={t} />
                    ))}
                  </span>
                ) : (
                  <span className="text-pencil">None</span>
                )}
              </Meta>
              <Meta label="Text">Read · searchable</Meta>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center px-8 text-center text-[13px] text-pencil">
          Select a document to see its preview and details.
        </div>
      )}
    </aside>
  );
}

/* ------------------------------------------------------------------ Insights */

export function DuplicatesView({ docs, now, onSelect }: { docs: Doc[]; now: number; onSelect: (id: number) => void }) {
  const groups = useMemo(() => {
    const map = new Map<string, Doc[]>();
    for (const d of docs) if (d.dupe) map.set(d.dupe, [...(map.get(d.dupe) ?? []), d]);
    return [...map.values()].filter((g) => g.length > 1);
  }, [docs]);
  const wasted = groups.reduce((s, g) => s + g[0].size * (g.length - 1), 0);

  return (
    <div className="px-5 pb-6">
      <p className="mb-4 text-[13px] text-graphite">
        {groups.length} sets of identical copies · {formatSize(wasted)} could be freed. Compared by size, then content; nothing is
        ever deleted.
      </p>
      <div className="space-y-3">
        {groups.map((g) => (
          <div key={g[0].dupe} className="rounded-xl border border-line bg-sheet p-2">
            <div className="flex items-center justify-between px-2 pt-1 pb-2 text-[12.5px] text-graphite">
              <span>
                {g.length} copies · {formatSize(g[0].size)} each
              </span>
              <span className="text-ok">Identical content</span>
            </div>
            {g.map((d) => (
              <button
                type="button"
                key={d.id}
                onClick={() => onSelect(d.id)}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left hover:bg-hover"
              >
                <FileIcon kind={d.kind} ext={d.ext} size={26} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium text-ink">{d.name}</div>
                  <div className="truncate text-[12px] text-pencil">{d.folder}</div>
                </div>
                <span className="hidden text-[12px] text-graphite sm:block">{formatAgo(d.modified, now)}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function StorageView({ docs, onSelect }: { docs: Doc[]; onSelect: (id: number) => void }) {
  const total = docs.reduce((s, d) => s + d.size, 0);
  const byKind = KINDS.map((k) => ({ ...k, size: docs.filter((d) => d.kind === k.id).reduce((s, d) => s + d.size, 0) }));
  const largest = [...docs].sort((a, b) => b.size - a.size).slice(0, 5);
  return (
    <div className="px-5 pb-6">
      <div className="rounded-xl border border-line bg-sheet p-4">
        <div className="text-[13px] text-graphite">
          <span className="text-[22px] font-semibold text-ink">{formatSize(total)}</span> in {docs.length} documents
        </div>
        <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-paper-2">
          {byKind.map((k) => (
            <div key={k.id} style={{ width: `${(k.size / total) * 100}%`, background: `var(--${k.id})` }} />
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {byKind.map((k) => (
            <div key={k.id} className="flex items-center gap-2 text-[12.5px]">
              <span className="size-2 rounded-full" style={{ background: `var(--${k.id})` }} />
              <span className="text-ink-2">{k.bucket}</span>
              <span className="ml-auto text-pencil tabular-nums">{formatSize(k.size)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 mb-2 text-[13px] font-semibold text-ink">Largest documents</div>
      {largest.map((d) => (
        <button
          type="button"
          key={d.id}
          onClick={() => onSelect(d.id)}
          className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left hover:bg-hover"
        >
          <FileIcon kind={d.kind} ext={d.ext} size={26} />
          <span className="min-w-0 flex-1 truncate text-[13px] text-ink">{d.name}</span>
          <span className="text-[12.5px] text-graphite tabular-nums">{formatSize(d.size)}</span>
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ Quick search */

export function QuickSearch({
  docs,
  now,
  onClose,
  onPick,
}: {
  docs: Doc[];
  now: number;
  onClose: () => void;
  onPick: (doc: Doc) => void;
}) {
  const [q, setQ] = useState("");
  const [index, setIndex] = useState(0);
  const recent = useMemo(
    () => docs.filter((d) => d.opened).sort((a, b) => b.opened!.last - a.opened!.last),
    [docs],
  );
  const hits = useMemo(() => (q.trim() ? search(docs, q, now).slice(0, 6) : null), [docs, q, now]);
  const list = hits ? hits.map((h) => h.doc) : recent;

  return (
    <div className="animate-fade absolute inset-0 z-30 flex items-start justify-center bg-black/35 px-4 pt-[9%]" onMouseDown={onClose}>
      <div
        className="w-full max-w-[520px] overflow-hidden rounded-xl border border-line-strong bg-paper shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="size-4.5 text-graphite" />
          <input
            autoFocus
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setIndex((i) => Math.min(i + 1, list.length - 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setIndex((i) => Math.max(i - 1, 0));
              }
              if (e.key === "Enter" && list[index]) onPick(list[index]);
            }}
            placeholder="Find any document…"
            className="h-12 flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-pencil"
          />
          <Mark className="size-4.5" stem="var(--ink)" bowl="var(--app-lamp)" />
        </div>
        <div className="px-2 py-2">
          <div className="px-2 pb-1 text-[12px] text-pencil">{hits ? "Best matches" : "Recently opened"}</div>
          {list.length === 0 && <div className="px-2 py-6 text-center text-[13px] text-pencil">No documents match.</div>}
          {list.map((d, i) => (
            <button
              type="button"
              key={d.id}
              onMouseEnter={() => setIndex(i)}
              onClick={() => onPick(d)}
              className={cx("flex w-full items-center gap-3 rounded-lg px-2.5 py-1.5 text-left", i === index && "bg-selected")}
            >
              <FileIcon kind={d.kind} ext={d.ext} size={26} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13.5px] text-ink">{d.name}</div>
                <div className="truncate text-[11.5px] text-pencil">{d.folder}</div>
              </div>
              <span className="hidden text-[12px] text-graphite sm:block">{formatAgo(d.opened?.last ?? d.modified, now)}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 border-t border-line bg-paper-2 px-4 py-2 text-[11.5px] text-graphite">
          <span>
            <KeyCap>↵</KeyCap> open
          </span>
          <span className="hidden sm:inline">
            <KeyCap>Ctrl ↵</KeyCap> show in folder
          </span>
          <span className="ml-auto">
            <KeyCap>Esc</KeyCap> close
          </span>
        </div>
      </div>
    </div>
  );
}

export function KeyCap({ children }: { children: ReactNode }) {
  return (
    <kbd className="mr-1 inline-flex h-[18px] items-center rounded border border-line-strong bg-paper px-1.5 text-[10.5px] font-medium text-ink-2">
      {children}
    </kbd>
  );
}


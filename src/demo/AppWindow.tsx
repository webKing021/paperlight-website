import { Moon, PanelLeft, PanelRight, RotateCw, Search, Sun, X } from "lucide-react";
import { forwardRef, type KeyboardEvent, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Mark } from "../components/icons";
import { cx } from "../components/ui";
import { DAY, formatSize } from "../lib/format";
import { useRepoInfo } from "../lib/github";
import { useTheme } from "../lib/theme";
import { KINDS, TAGS, makeLibrary, type Doc, type Kind } from "./data";
import { BucketTiles, DetailsPane, DocRow, DuplicatesView, KeyCap, QuickSearch, Sidebar, StorageView, type View } from "./parts";
import { search, type Hit } from "./search";

export type AppWindowHandle = { searchFor: (q: string) => void; focusSearch: () => void };

const TITLES: Record<string, string> = {
  overview: "Overview",
  all: "All documents",
  changed: "Recently changed",
  opened: "Recently opened",
  favourites: "Favourites",
  duplicates: "Duplicates",
  storage: "Storage",
};

function titleOf(view: View): string {
  if (view.startsWith("kind:")) return KINDS.find((k) => `kind:${k.id}` === view)!.bucket;
  if (view.startsWith("tag:")) return TAGS.find((t) => `tag:${t.id}` === view)!.name;
  return TITLES[view];
}

function listFor(view: View, docs: Doc[], bucket: Kind, now: number): Doc[] {
  const byModified = (a: Doc, b: Doc) => b.modified - a.modified;
  switch (view) {
    case "overview":
      return docs.filter((d) => d.kind === bucket).sort(byModified);
    case "all":
      return [...docs].sort(byModified);
    case "changed":
      return docs.filter((d) => now - d.modified < 14 * DAY).sort(byModified);
    case "opened":
      return docs.filter((d) => d.opened).sort((a, b) => b.opened!.last - a.opened!.last);
    case "favourites":
      return docs.filter((d) => d.favourite).sort(byModified);
    case "duplicates":
    case "storage":
      return [];
  }
  if (view.startsWith("kind:")) return docs.filter((d) => `kind:${d.kind}` === view).sort(byModified);
  return docs.filter((d) => d.tags.some((t) => `tag:${t}` === view)).sort(byModified);
}

/** Title bar with the Windows 11 caption buttons. */
function TitleBar() {
  return (
    <div className="flex h-9 shrink-0 items-center border-b border-line bg-paper-2 pl-3 select-none">
      <Mark className="size-4" stem="var(--ink)" bowl="var(--app-lamp)" />
      <span className="ml-2 text-[12px] text-ink-2">Paperlight</span>
      <div className="ml-auto flex h-full" aria-hidden="true">
        {["min", "max", "close"].map((b) => (
          <span key={b} className={cx("flex h-full w-11 items-center justify-center text-graphite", b === "close" ? "hover:bg-[#c42b1c] hover:text-white" : "hover:bg-hover")}>
            <svg viewBox="0 0 10 10" className="size-2.5" fill="none" stroke="currentColor" strokeWidth="1">
              {b === "min" && <path d="M0 5h10" />}
              {b === "max" && <rect x="0.5" y="0.5" width="9" height="9" rx="1.5" />}
              {b === "close" && <path d="M0.5 0.5l9 9M9.5 0.5l-9 9" />}
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

export const AppWindow = forwardRef<AppWindowHandle, { fullscreen?: boolean }>(function AppWindow({ fullscreen }, ref) {
  const [now] = useState(() => Date.now());
  const { version } = useRepoInfo();
  const [docs, setDocs] = useState(() => makeLibrary(now));
  const [view, setView] = useState<View>("overview");
  const [bucket, setBucket] = useState<Kind>("pdf");
  const [query, setQuery] = useState("");
  const [bucketQuery, setBucketQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | undefined>(1);
  const [sidebar, setSidebar] = useState(true);
  const [details, setDetails] = useState(true);
  const [quick, setQuick] = useState(false);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const [scan, setScan] = useState<"idle" | "scanning" | "done">("idle");
  const searchRef = useRef<HTMLInputElement>(null);
  const { theme, toggle } = useTheme();

  const say = useCallback((text: string) => setToast({ id: Date.now(), text }), []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  useImperativeHandle(ref, () => ({
    searchFor: (q) => {
      setQuick(false);
      setQuery(q);
      searchRef.current?.focus({ preventScroll: true });
    },
    focusSearch: () => searchRef.current?.focus({ preventScroll: true }),
  }));

  const searching = query.trim().length > 0;
  const insight = view === "duplicates" || view === "storage";

  // Global search looks inside the current view, like the app; Overview searches everything.
  const hits: Hit[] | null = useMemo(() => {
    if (searching) {
      const scope = view === "overview" || insight ? docs : listFor(view, docs, bucket, now);
      return search(scope, query, now);
    }
    if (view === "overview" && bucketQuery.trim()) return search(listFor("overview", docs, bucket, now), bucketQuery, now);
    return null;
  }, [searching, view, insight, docs, bucket, query, bucketQuery, now]);

  const rows: { doc: Doc; hit?: Hit }[] = hits ? hits.map((h) => ({ doc: h.doc, hit: h })) : listFor(view, docs, bucket, now).map((doc) => ({ doc }));
  const selected = docs.find((d) => d.id === selectedId);

  const open = (doc: Doc | undefined) => doc && say(`Demo: Paperlight would open ${doc.name} in its default app`);
  const star = (id: number) => setDocs((all) => all.map((d) => (d.id === id ? { ...d, favourite: !d.favourite } : d)));

  const goto = (v: View) => {
    setView(v);
    setQuery("");
    setBucketQuery("");
    const first = listFor(v, docs, bucket, now)[0];
    if (first) setSelectedId(first.id);
  };

  const move = (delta: number) => {
    if (!rows.length) return;
    const i = rows.findIndex((r) => r.doc.id === selectedId);
    const next = rows[Math.max(0, Math.min(rows.length - 1, (i < 0 ? -1 : i) + delta))];
    setSelectedId(next.doc.id);
  };

  const onSearchKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Enter") {
      open(selected);
    } else if (e.key === "Escape") {
      setQuery("");
    }
  };

  // Keep the selection on a visible result while typing.
  useEffect(() => {
    if (hits && hits.length && !hits.some((h) => h.doc.id === selectedId)) setSelectedId(hits[0].doc.id);
  }, [hits, selectedId]);

  const rescan = () => {
    setScan("scanning");
    setTimeout(() => setScan("done"), 1400);
    setTimeout(() => setScan("idle"), 4200);
  };

  const heading = searching ? "Best matches" : titleOf(view);
  const totalSize = docs.reduce((s, d) => s + d.size, 0);

  return (
    <div
      className={cx(
        "relative flex flex-col overflow-hidden bg-paper font-app text-ink",
        fullscreen ? "h-full" : "h-[560px] rounded-[10px] border border-line-strong md:h-[660px]",
      )}
    >
      <TitleBar />
      <div className="flex min-h-0 flex-1">
        {sidebar && (
          <div className="hidden md:flex">
            <Sidebar docs={docs} view={view} onView={goto} onCollapse={() => setSidebar(false)} />
          </div>
        )}

        <main className="flex min-w-0 flex-1 flex-col">
          {/* Top bar: search, theme, details toggle */}
          <div className="flex h-12 shrink-0 items-center gap-2 border-b border-line px-3">
            {!sidebar && (
              <button type="button" onClick={() => setSidebar(true)} className="hidden rounded-md p-1.5 text-graphite hover:bg-hover md:block" aria-label="Show sidebar">
                <PanelLeft className="size-4" />
              </button>
            )}
            <label className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-lg border border-line bg-paper-2 px-2.5 focus-within:border-line-strong focus-within:bg-paper">
              <Search className="size-4 shrink-0 text-graphite" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onSearchKey}
                placeholder="Search documents by name, folder or the words inside"
                aria-label="Search the sample documents"
                className="h-full min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-pencil"
              />
              {query ? (
                <button type="button" onClick={() => setQuery("")} className="rounded p-0.5 text-graphite hover:bg-hover" aria-label="Clear search">
                  <X className="size-3.5" />
                </button>
              ) : (
                <span className="hidden sm:inline-flex">
                  <KeyCap>Ctrl K</KeyCap>
                </span>
              )}
            </label>
            <button type="button" onClick={toggle} className="rounded-md p-2 text-graphite hover:bg-hover" aria-label="Switch theme" title="Switch theme">
              {theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
            </button>
            <button
              type="button"
              onClick={() => setDetails((d) => !d)}
              className={cx("hidden rounded-md p-2 text-graphite xl:block", details ? "bg-selected text-ink" : "hover:bg-hover")}
              aria-label="Details panel"
              title="Details (Ctrl+I)"
            >
              <PanelRight className="size-4" />
            </button>
          </div>

          {/* Compact view switcher for small screens, where the sidebar is hidden */}
          <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-line px-3 py-2 md:hidden">
            {(["overview", "all", "favourites", "duplicates", "storage"] as View[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => goto(v)}
                className={cx("shrink-0 rounded-full px-3 py-1 text-[12.5px]", view === v ? "bg-selected text-ink" : "text-graphite")}
              >
                {titleOf(v)}
              </button>
            ))}
          </div>

          <div data-scroll className="app-scroll min-h-0 flex-1 overflow-y-auto" role="listbox" aria-label="Documents">
            <div className="px-5 pt-5 pb-3">
              <div className="flex items-baseline gap-2.5">
                <h3 className="text-[22px] font-semibold tracking-[-0.01em] text-ink">{heading}</h3>
                {(searching || (!insight && view !== "overview")) && <span className="text-[13px] text-pencil">{rows.length} documents</span>}
              </div>
              {view === "overview" && !searching && (
                <p className="mt-0.5 text-[13px] text-graphite">
                  {docs.length} documents · {formatSize(totalSize)} on disk · 1 location
                </p>
              )}
            </div>

            {view === "overview" && !searching && (
              <div className="px-5">
                <BucketTiles
                  docs={docs}
                  active={bucket}
                  onPick={(k) => {
                    setBucket(k);
                    setBucketQuery("");
                    const first = listFor("overview", docs, k, now)[0];
                    if (first) setSelectedId(first.id);
                  }}
                />
                <div className="mt-6 mb-1 flex flex-wrap items-center gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[17px] font-semibold text-ink">{KINDS.find((k) => k.id === bucket)!.bucket}</span>
                    <span className="text-[12.5px] text-pencil">{rows.length} documents</span>
                  </div>
                  <label className="ml-auto flex h-8 w-full items-center gap-2 rounded-lg border border-line px-2.5 sm:w-64">
                    <Search className="size-3.5 text-graphite" />
                    <input
                      value={bucketQuery}
                      onChange={(e) => setBucketQuery(e.target.value)}
                      placeholder={`Search in ${KINDS.find((k) => k.id === bucket)!.bucket}`}
                      className="h-full min-w-0 flex-1 bg-transparent text-[12.5px] text-ink outline-none placeholder:text-pencil"
                    />
                  </label>
                </div>
              </div>
            )}

            {view === "duplicates" && !searching ? (
              <DuplicatesView docs={docs} now={now} onSelect={setSelectedId} />
            ) : view === "storage" && !searching ? (
              <StorageView docs={docs} onSelect={setSelectedId} />
            ) : (
              <div className="px-2 pb-4">
                <div className="hidden grid-cols-[minmax(0,1fr)_104px_64px_96px] gap-3 border-b border-line px-3 pt-2 pb-1.5 text-[12px] text-pencil sm:grid">
                  <span className="pl-[42px]">Name</span>
                  <span>Modified</span>
                  <span className="text-right">Size</span>
                  <span />
                </div>
                <div className="pt-1">
                  {rows.map(({ doc, hit }) => (
                    <DocRow
                      key={doc.id}
                      doc={doc}
                      hit={hit}
                      now={now}
                      selected={doc.id === selectedId}
                      onSelect={() => setSelectedId(doc.id)}
                      onOpen={() => open(doc)}
                      onStar={() => star(doc.id)}
                      onAction={say}
                    />
                  ))}
                  {rows.length === 0 && (
                    <div className="px-6 py-14 text-center">
                      <div className="text-[14px] font-medium text-ink">No documents match</div>
                      <div className="mt-1 text-[12.5px] text-pencil">Try another word: search reads names, folders and the text inside.</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>

        {details && (
          <div className="hidden xl:flex">
            <DetailsPane doc={selected} now={now} onOpen={() => open(selected)} onStar={() => selected && star(selected.id)} onAction={say} />
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="relative flex h-8 shrink-0 items-center gap-3 border-t border-line bg-paper-2 px-3 text-[12px] text-graphite">
        {scan === "scanning" && (
          <span className="absolute inset-x-0 top-0 h-[2px] overflow-hidden">
            <span className="block h-full w-1/4 animate-[runner_1.1s_ease-in-out_infinite] bg-app-lamp" />
          </span>
        )}
        <span className={cx("size-2 rounded-full", scan === "scanning" ? "bg-app-lamp" : "bg-ok")} />
        <span className="truncate">
          {scan === "scanning" ? "Checking for changes…" : scan === "done" ? "Up to date · 0 changes found" : "Up to date · watching for changes"}
        </span>
        <span className="hidden text-pencil lg:inline">
          {docs.length} documents · {formatSize(totalSize)} · 1 location
        </span>
        <button type="button" onClick={() => setQuick(true)} className="ml-auto flex shrink-0 items-center gap-1.5 rounded px-1.5 py-0.5 whitespace-nowrap hover:bg-hover hover:text-ink">
          <span className="hidden sm:inline">Quick search</span> <KeyCap>Alt+Space</KeyCap>
        </button>
        <button type="button" onClick={rescan} className="hidden items-center gap-1 rounded px-1.5 py-0.5 hover:bg-hover hover:text-ink sm:flex">
          <RotateCw className={cx("size-3.5", scan === "scanning" && "animate-spin")} /> Rescan
        </button>
        <span className="hidden text-pencil sm:inline">v{version}</span>
      </div>

      {quick && (
        <QuickSearch
          docs={docs}
          now={now}
          onClose={() => setQuick(false)}
          onPick={(d) => {
            setQuick(false);
            setSelectedId(d.id);
            open(d);
          }}
        />
      )}

      {toast && (
        <div
          key={toast.id}
          role="status"
          className="animate-fade absolute bottom-11 left-1/2 z-40 max-w-[90%] -translate-x-1/2 truncate rounded-lg border border-line-strong bg-sheet px-3.5 py-2 text-[12.5px] text-ink-2 shadow-lg"
        >
          {toast.text}
        </div>
      )}
    </div>
  );
});

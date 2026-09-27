import { ArrowUpRight, Download, EyeOff, FileLock2, Plus, Scale, Star, UserX } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { Kind } from "../demo/data";
import { AUTHOR_URL, formatStars, REPO_URL, useDownloads, useRepoInfo } from "../lib/github";
import { downloadsLabel } from "./DownloadCount";
import { DownloadButton } from "./Hero";
import { FileIcon, GitHubIcon } from "./icons";
import { Logo, ThemeToggle } from "./Nav";
import { spotlight } from "../lib/reveal";
import { Reveal, RevealLines } from "./Reveal";
import { cx, Kbd, SectionHeading } from "./ui";

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

export function Formats() {
  return (
    <section className="mx-auto max-w-[1200px] px-5 pt-24 sm:px-8">
      <Reveal className="card-depth flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 sm:p-8 lg:flex-row lg:items-center lg:gap-10">
        <div className="lg:w-72 lg:shrink-0">
          <h3 className="text-[17px] font-semibold text-fg">Reads the text of 12 formats</h3>
          <p className="mt-1 text-[15px] text-muted">Older doc, dot, ppt and pps files are found by name.</p>
        </div>
        <ul className="grid grid-cols-4 gap-x-3 gap-y-4 min-[420px]:grid-cols-6 xl:flex xl:flex-wrap xl:gap-x-5">
          {READ.map(([ext, kind], i) => (
            <Reveal as="li" key={ext} index={i * 0.4} className="flex flex-col items-center gap-1.5">
              <FileIcon kind={kind} ext={ext} size={38} />
              <span className="text-[12px] text-muted">.{ext}</span>
            </Reveal>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ Privacy */

const NUMBERS = [
  { value: "0", unit: "bytes", label: "of your data leave your PC. It works offline; it only goes online for optional updates." },
  { value: "~6", unit: "MB", label: "of memory when the window is closed and it waits in the tray." },
  { value: "0", unit: "% CPU", label: "when idle. No polling: the disk tells Paperlight what changed." },
  { value: "~5", unit: "MB", label: "installer. Built with Rust and Tauri, not a bundled browser." },
];

const PROMISES = [
  { icon: EyeOff, title: "Works offline", body: "No internet needed to index, search or open. It only goes online to check for a new version, and updating is optional." },
  { icon: FileLock2, title: "Read-only", body: "Your files are never modified, moved, renamed or deleted. Not even duplicates." },
  { icon: UserX, title: "No account", body: "Install it and use it. There's nothing to sign up for and nothing to pay." },
];

export function Privacy() {
  return (
    <section id="privacy" className="relative mt-36 overflow-hidden border-y border-border bg-bg-2">
      <div aria-hidden="true" className="grid-bg absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-[1200px] px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeading
          title={["Private by design.", "Light by nature."]}
          lead="A search tool sees everything you keep, so Paperlight keeps it all on your PC and stays out of the way."
        />
        <Reveal className="card-depth mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {NUMBERS.map((n) => (
            <div key={n.label} className="bg-card p-6 sm:p-7">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[48px] leading-none font-semibold tracking-[-0.04em] text-fg sm:text-[56px]">{n.value}</span>
                <span className="text-lg font-medium text-lamp">{n.unit}</span>
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">{n.label}</p>
            </div>
          ))}
        </Reveal>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {PROMISES.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} index={i} className="card-depth flex gap-4 rounded-2xl border border-border bg-card p-6 md:flex-col lg:flex-row">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-bg-2 text-fg">
                <Icon className="size-[18px]" />
              </span>
              <div>
                <h3 className="text-[16px] font-semibold text-fg">{title}</h3>
                <p className="mt-1 text-[14.5px] leading-relaxed text-muted">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ How it works */

const STEPS = [
  { title: "Install", body: "Run the installer. No admin rights and no account. Windows 10 or 11, 64-bit." },
  { title: "Choose where to look", body: "Pick drives or folders and the formats you care about. Paperlight is usable while the first scan runs." },
  {
    title: "Search",
    body: (
      <>
        <Kbd>Ctrl</Kbd> <Kbd>K</Kbd> in the app or <Kbd>Alt</Kbd> <Kbd>Space</Kbd> from anywhere. <Kbd>Enter</Kbd> opens.
      </>
    ),
  },
];

export function Steps() {
  return (
    <section className="mx-auto max-w-[1200px] px-5 pt-36 sm:px-8">
      <SectionHeading title={["Set up in a minute."]} lead="A short welcome walks you through it on first run. After that it just stays current." />
      <ol className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <Reveal
            as="li"
            key={s.title}
            index={i}
            onPointerMove={spotlight}
            className="spot card-depth rounded-2xl border border-border bg-card p-6 sm:p-7"
          >
            <span className="flex size-9 items-center justify-center rounded-full border border-border-2 text-[15px] font-semibold text-fg tabular-nums">
              {i + 1}
            </span>
            <h3 className="mt-6 text-[18px] font-semibold text-fg">{s.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.body}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------ Screenshots */

const SHOTS = [
  { id: "overview", label: "Overview", alt: "Overview: a tile per document type, the list below and a PDF preview" },
  { id: "search", label: "Search", alt: "Search results with the matching passages highlighted" },
  { id: "quick-search", label: "Quick search", alt: "The quick search launcher opened with Alt+Space" },
  { id: "duplicates", label: "Duplicates", alt: "Identical copies grouped together" },
  { id: "storage", label: "Storage", alt: "Size by type and the largest documents" },
  { id: "settings", label: "Settings", alt: "Settings: choose which file formats are indexed" },
  { id: "dark", label: "Dark theme", alt: "Paperlight in its dark theme" },
  { id: "welcome", label: "Welcome", alt: "The welcome screen on first run" },
];

export function Screenshots() {
  const [active, setActive] = useState(SHOTS[0].id);
  const shot = SHOTS.find((s) => s.id === active)!;
  return (
    <section id="screenshots" className="mx-auto max-w-[1200px] px-5 pt-36 sm:px-8">
      <SectionHeading title={["The real thing."]} lead="Screenshots of Paperlight on Windows 11, with made-up sample documents." />
      <Reveal className="-mx-5 mt-10 flex gap-1.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0" role="tablist" aria-label="Screenshots">
        {SHOTS.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={s.id === active}
            onClick={() => setActive(s.id)}
            className={cx(
              "shrink-0 rounded-full border px-4 py-1.5 text-[14px] transition-colors",
              s.id === active ? "border-fg bg-fg text-bg" : "border-border text-muted hover:border-border-2 hover:text-fg",
            )}
          >
            {s.label}
          </button>
        ))}
      </Reveal>
      <Reveal variant="scale" className="card-depth mt-5 overflow-hidden rounded-2xl border border-border bg-bg-2 p-2 sm:p-6">
        <a
          href={`/screenshots/${shot.id}.png`}
          target="_blank"
          rel="noreferrer"
          title="Open full size"
          className="flex cursor-zoom-in items-center justify-center"
        >
          <img
            key={shot.id}
            src={`/screenshots/${shot.id}.png`}
            alt={shot.alt}
            width={shot.id === "quick-search" ? 1024 : 1804}
            height={shot.id === "quick-search" ? 694 : 1217}
            loading="lazy"
            decoding="async"
            className={cx(
              "animate-fade h-auto rounded-lg shadow-[0_20px_60px_-20px_rgb(0_0_0/0.5)]",
              shot.id === "quick-search" ? "w-full max-w-[720px]" : "w-full",
            )}
          />
        </a>
      </Reveal>
      {/* Warm the cache so switching tabs is instant. */}
      <div className="hidden">
        {SHOTS.filter((s) => s.id !== active).map((s) => (
          <img key={s.id} src={`/screenshots/${s.id}.png`} alt="" loading="lazy" />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Keyboard */

const KEYS: [string[], string][] = [
  [["Alt", "Space"], "Quick search"],
  [["Ctrl", "K"], "Search"],
  [["Enter"], "Open"],
  [["Ctrl", "Enter"], "Show in folder"],
  [["Ctrl", "Shift", "C"], "Copy path"],
  [["Ctrl", "D"], "Favourite"],
  [["Ctrl", "T"], "Tag"],
  [["Ctrl", "I"], "Details panel"],
];

export function Keyboard() {
  return (
    <section className="mx-auto max-w-[1200px] px-5 pt-36 sm:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:items-center">
        <SectionHeading title={["Hands stay on", "the keyboard."]} lead="Everything has a shortcut. Arrow keys move through results, Page Up and Down jump." />
        <Reveal index={1} className="card-depth grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
          {KEYS.map(([keys, label]) => (
            <div key={label} className="flex items-center justify-between gap-4 bg-card px-5 py-4">
              <span className="text-[15px] text-fg-2">{label}</span>
              <span className="flex gap-1 text-[15px]">
                {keys.map((k) => (
                  <Kbd key={k}>{k}</Kbd>
                ))}
              </span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Open source */

export function OpenSource() {
  const { stars } = useRepoInfo();
  const downloads = useDownloads();
  return (
    <section className="mx-auto max-w-[1200px] px-5 pt-36 sm:px-8">
      <Reveal
        variant="scale"
        onPointerMove={spotlight}
        className="spot card-depth overflow-hidden rounded-3xl border border-border bg-card px-6 py-12 sm:px-14 sm:py-20"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(234_176_76/0.18),transparent)]"
        />
        <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <RevealLines
              lines={["Free and open source.", "Read every line."]}
              className="text-[clamp(2rem,4.4vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-fg"
            />
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Paperlight is MIT licensed and built in the open with Tauri 2, Rust, SQLite FTS5 and React. Issues and pull requests are
              welcome, and a star helps other people find it.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="flex h-12 items-center justify-center gap-2.5 rounded-full bg-button px-6 text-[15px] font-semibold text-on-button transition-opacity hover:opacity-90"
            >
              <Star className="size-4" /> Star on GitHub
              {!!stars && <span className="rounded-full bg-on-button/10 px-2 py-0.5 text-[13px] tabular-nums">{formatStars(stars)}</span>}
            </a>
            <a
              href={`${REPO_URL}/blob/main/CONTRIBUTING.md`}
              target="_blank"
              rel="noreferrer"
              className="flex h-12 items-center justify-center gap-2 rounded-full border border-border-2 px-6 text-[15px] font-medium text-fg-2 transition-colors hover:border-faint hover:text-fg"
            >
              Contribute <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>
        <div className="relative mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-8 text-[14px] text-muted">
          <span className="flex items-center gap-2">
            <Scale className="size-4 text-lamp" /> MIT license
          </span>
          <span className="flex items-center gap-2">
            <GitHubIcon className="size-4" /> webKing021/paperlight
          </span>
          {downloads !== null && (
            <span className="flex items-center gap-2">
              <Download className="size-4 text-lamp" /> {downloads.toLocaleString("en-US")} {downloadsLabel(downloads)}
            </span>
          )}
          <span>Tauri 2 · Rust · SQLite FTS5 · React</span>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ FAQ */

const FAQ: { q: string; a: ReactNode }[] = [
  {
    q: "Is Paperlight really free?",
    a: "Yes. It's open source under the MIT license: no ads, no trial, no paid tier and no account.",
  },
  {
    q: "Does it upload, change or delete my files?",
    a: "No. Paperlight only reads your documents to index them. Nothing is uploaded and it works fully offline: the only time it goes online is to check whether a new version exists, and updating is optional. It never modifies, moves, renames or deletes a file, not even duplicates it finds.",
  },
  {
    q: "How do I get new versions?",
    a: "You download Paperlight once. Updating is optional: it keeps working as it is, fully offline. When a new version with new features is out, Paperlight tells you what's new and installs it in a few seconds if you choose Update now, keeping your index, favourites, tags and settings. The check can be turned off in Settings → About. (Version 1.0.0 came before the updater: install the latest version once and it updates itself from then on.)",
  },
  {
    q: "Which files can it search?",
    a: "The text inside PDF, Word (docx, odt, rtf), Excel (xlsx, xlsm, xlsb, xls, ods, csv) and PowerPoint (pptx, odp) files. Older doc, dot, ppt and pps files are found by name and folder. You can switch any format off.",
  },
  {
    q: "Will it slow my PC down?",
    a: "The first scan runs at background priority and Paperlight is usable while it runs. After that a live watcher picks up changes as they happen, so there are no repeated scans. Idle, it uses no CPU and about 6 MB of memory in the tray.",
  },
  {
    q: "Windows SmartScreen warns about the installer. Is it safe?",
    a: (
      <>
        The installer isn't code-signed yet, so Windows doesn't recognise it. Choose <em>More info</em>, then <em>Run anyway</em>.
        The full source is public, so you can read it or build the app yourself.
      </>
    ),
  },
  {
    q: "Where is the index stored?",
    a: "In a small SQLite database in your AppData folder, on your own disk. Uninstall Paperlight or delete the folder and it's gone.",
  },
  {
    q: "Alt+Space is already used on my PC.",
    a: "Paperlight falls back to Ctrl+Shift+Space, then Ctrl+Alt+P, if another app already owns the shortcut.",
  },
  {
    q: "Is there a Mac or Linux version?",
    a: "Not yet. Paperlight is made for Windows 10 and 11 first. It's built on Tauri, which runs on macOS and Linux too, so contributions are welcome.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-[1200px] px-5 pt-36 sm:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <SectionHeading title={["Questions."]} lead="Something else? Open an issue on GitHub." />
        <div className="divide-y divide-border border-y border-border">
          {FAQ.map((f, i) => (
            <Reveal as="details" key={f.q} index={i * 0.5} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-[17px] font-medium text-fg [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus className="size-5 shrink-0 text-muted transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="max-w-2xl pb-5 text-[15.5px] leading-relaxed text-muted">{f.a}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Final call + footer */

export function FinalCta() {
  const { version } = useRepoInfo();
  const downloads = useDownloads();
  return (
    <section className="relative mt-40 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 h-[420px] w-[900px] -translate-x-1/2 translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(234_176_76/0.22),transparent)]"
      />
      <div className="relative mx-auto max-w-[1200px] px-5 pb-32 text-center sm:px-8">
        <RevealLines
          lines={["Stop looking.", "Start finding."]}
          mutedFrom={2}
          className="text-[clamp(2.75rem,7vw,5.5rem)] leading-[1] font-semibold tracking-[-0.045em] text-fg"
        />
        <Reveal as="p" index={2} className="mx-auto mt-6 max-w-md text-lg text-muted">
          Free for Windows 10 and 11. Version {version}
          {downloads ? `, downloaded ${downloads.toLocaleString("en-US")} ${downloads === 1 ? "time" : "times"}` : ""}. Updates itself.
        </Reveal>
        <Reveal index={3} className="mt-9 flex justify-center">
          <DownloadButton />
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  const links = [
    { href: `${REPO_URL}/releases`, label: "Releases" },
    { href: `${REPO_URL}/blob/main/CHANGELOG.md`, label: "Changelog" },
    { href: `${REPO_URL}/issues`, label: "Report an issue" },
    { href: `${REPO_URL}/blob/main/SECURITY.md`, label: "Security" },
    { href: `${REPO_URL}/blob/main/LICENSE`, label: "License" },
  ];
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-3 text-[14px] leading-relaxed text-muted">Every document on your PC, one search away.</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
          {links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="text-muted transition-colors hover:text-fg">
              {l.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 border-t border-border px-5 py-6 text-[13px] text-faint sm:px-8">
        <span>
          Made by{" "}
          <a href={AUTHOR_URL} target="_blank" rel="noreferrer" className="text-muted hover:text-fg">
            webKing021
          </a>{" "}
          · MIT licensed
        </span>
        <ThemeToggle />
      </div>
    </footer>
  );
}

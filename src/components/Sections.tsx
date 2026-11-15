import { ArrowUpRight, Download, EyeOff, FileLock2, Plus, Scale, Star, UserX } from "lucide-react";
import type { ReactNode } from "react";
import { AUTHOR_URL, formatStars, REPO_URL, useDownloads, useRepoInfo } from "../lib/github";
import { spotlight } from "../lib/reveal";
import { DownloadButtons, DownloadMeta, PlatformSwitch } from "./Download";
import { downloadsLabel } from "./DownloadCount";
import { GitHubIcon } from "./icons";
import { Logo, ThemeToggle } from "./Nav";
import { Reveal, RevealLines } from "./Reveal";
import { btn, cx, SectionHeading } from "./ui";

/* ------------------------------------------------------------------ Privacy */

const NUMBERS = [
  { value: "0", unit: "bytes", label: "of your data leave your PC. It only goes online for optional updates." },
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
    <section id="privacy" className="relative mt-32 overflow-hidden border-y border-border bg-bg-2 sm:mt-40">
      <div aria-hidden="true" className="grid-bg absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-[1200px] px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeading
          eyebrow="Privacy and footprint"
          title={["Private by design.", "Light by nature."]}
          lead="A search tool sees everything you keep, so Paperlight keeps it all on your PC and stays out of the way."
        />
        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-x-0">
          {NUMBERS.map((n, i) => (
            <Reveal key={n.label} index={i} className="border-border lg:border-l lg:px-7 lg:first:border-l-0 lg:first:pl-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[clamp(3.25rem,7vw,5.5rem)] leading-none font-semibold tracking-[-0.05em] text-fg">{n.value}</span>
                <span className="text-lg font-medium text-accent">{n.unit}</span>
              </div>
              <p className="mt-4 max-w-[17rem] text-[15px] leading-relaxed text-muted">{n.label}</p>
            </Reveal>
          ))}
        </div>
        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-8 border-t border-border pt-10 md:grid-cols-3">
          {PROMISES.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} index={i} className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-fg">
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

/* ------------------------------------------------------------------ Open source */

export function OpenSource() {
  const { stars } = useRepoInfo();
  const downloads = useDownloads();
  return (
    <section className="mx-auto max-w-[1200px] px-5 pt-32 sm:px-8 sm:pt-40">
      <Reveal
        variant="scale"
        onPointerMove={spotlight}
        className="spot card-depth overflow-hidden rounded-3xl border border-border bg-card px-6 py-12 sm:px-14 sm:py-16"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(234_176_76/0.16),transparent)]"
        />
        <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <RevealLines
              lines={["Free and open source.", "Read every line."]}
              className="text-[clamp(2.1rem,4.8vw,3.6rem)] leading-[1.04] font-semibold tracking-[-0.04em] text-fg"
            />
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Paperlight is MIT licensed and built in the open with Tauri 2, Rust, SQLite FTS5 and React. Issues and pull requests are
              welcome, and a star helps other people find it.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
            <a href={REPO_URL} target="_blank" rel="noreferrer" className={cx(btn.primary, "justify-center")}>
              <Star className="size-4" /> Star on GitHub
              {!!stars && <span className="rounded-full bg-on-button/10 px-2 py-0.5 text-[13px] tabular-nums">{formatStars(stars)}</span>}
            </a>
            <a href={`${REPO_URL}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noreferrer" className={cx(btn.outline, "justify-center")}>
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
    a: "The text inside PDF, Word (docx, odt, rtf), Excel (xlsx, xlsm, xlsb, xls, ods, csv) and PowerPoint (pptx, odp) files, up to 200,000 characters per document, so long reports are searched to the end. Older doc, dot, ppt and pps files are found by name and folder. Plain txt and md files are off to begin with and can be switched on. You can switch any format off.",
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
    a: "Choose your own in Settings → In the background → Change. If you don't, Paperlight falls back to Ctrl+Shift+Space, then Ctrl+Alt+P, when another app already owns the shortcut.",
  },
  {
    q: "Is there a Mac or Linux version?",
    a: <OtherSystems />,
  },
];

/** The answer follows the latest release: Linux is only mentioned as available when it is. */
function OtherSystems() {
  const { linux } = useRepoInfo();
  if (!linux) {
    return (
      <>
        Not yet. Paperlight is made for Windows 10 and 11 first. A Linux version is being worked on, and it's built on Tauri,
        which runs on macOS too, so contributions are welcome.
      </>
    );
  }
  return (
    <>
      Linux: yes, as a beta. There are {linux.map((p) => p.label).join(", ")} packages in the{" "}
      <a href="#download" className="underline underline-offset-4 hover:text-fg">
        download section
      </a>
      . On Linux it doesn't update itself yet, and the quick-search shortcut needs X11. There is no Mac version yet; it's built on
      Tauri, which runs on macOS too, so contributions are welcome.
    </>
  );
}

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-[1200px] px-5 pt-32 sm:px-8 sm:pt-40">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <SectionHeading
          eyebrow="FAQ"
          title={["Questions."]}
          lead={
            <>
              Something else?{" "}
              <a href={`${REPO_URL}/issues`} target="_blank" rel="noreferrer" className="underline decoration-border-2 underline-offset-4 hover:text-fg">
                Open an issue on GitHub
              </a>
              .
            </>
          }
        />
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
  const downloads = useDownloads();
  return (
    <section className="relative mt-32 overflow-hidden border-t border-border sm:mt-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 h-[420px] w-[900px] max-w-[160vw] -translate-x-1/2 translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(234_176_76/0.2),transparent)]"
      />
      <div className="relative mx-auto flex max-w-[1200px] flex-col items-center px-5 py-28 text-center sm:px-8 sm:py-36">
        <RevealLines
          lines={["Stop looking.", "Start finding."]}
          mutedFrom={2}
          className="text-[clamp(2.75rem,7.5vw,6rem)] leading-[0.98] font-semibold tracking-[-0.05em] text-fg"
        />
        <Reveal as="p" index={2} className="mt-6 max-w-md text-lg text-muted">
          Free for Windows and Linux
          {downloads ? `, downloaded ${downloads.toLocaleString("en-US")} ${downloads === 1 ? "time" : "times"}` : ""}.
        </Reveal>
        <Reveal index={3} className="mt-9 flex flex-col items-center gap-4">
          <PlatformSwitch />
          <DownloadButtons className="justify-center" />
          <p className="max-w-[34rem] text-[13.5px] leading-relaxed text-muted">
            <DownloadMeta />
          </p>
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

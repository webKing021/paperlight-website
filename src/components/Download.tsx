import { ArrowDownToLine, Check, Copy, Download as DownloadIcon } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { RELEASES_URL, useRepoInfo, type LinuxPackage } from "../lib/github";
import { setPlatform, usePlatform, type Platform } from "../lib/platform";
import { LinuxIcon, WindowsIcon } from "./icons";
import { Reveal } from "./Reveal";
import { btn, cx, Kbd, SectionHeading } from "./ui";

const SYSTEMS: { id: Platform; label: string; icon: typeof WindowsIcon }[] = [
  { id: "windows", label: "Windows", icon: WindowsIcon },
  { id: "linux", label: "Linux", icon: LinuxIcon },
];

/** Windows or Linux: starts on the visitor's own system. */
export function PlatformSwitch({ className }: { className?: string }) {
  const platform = usePlatform();
  return (
    <div role="radiogroup" aria-label="Your system" className={cx("inline-flex rounded-full border border-border bg-card p-1", className)}>
      {SYSTEMS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={platform === id}
          onClick={() => setPlatform(id)}
          className={cx(
            "flex h-8 items-center gap-2 rounded-full px-3.5 text-[13.5px] font-medium transition-colors",
            platform === id ? "bg-fg text-bg" : "text-muted hover:text-fg",
          )}
        >
          <Icon className="size-3.5" />
          {label}
          {id === "linux" && (
            <span
              className={cx(
                "rounded-full px-1.5 text-[10.5px] font-semibold tracking-wide uppercase",
                platform === id ? "bg-bg/15" : "bg-lamp/15 text-accent",
              )}
            >
              beta
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

/** What each Linux package is for, in a few words. */
const PACKAGE_FOR: Record<string, string> = {
  ".deb": "Ubuntu, Debian, Mint",
  ".rpm": "Fedora, openSUSE",
  AppImage: "Any distribution",
};

/** The download action for the chosen system: one button on Windows, one per package on Linux. */
export function DownloadButtons({ className }: { className?: string }) {
  const platform = usePlatform();
  const { downloadUrl, linux } = useRepoInfo();

  if (platform === "linux") {
    return (
      <div className={cx("flex flex-wrap items-center gap-2.5", className)}>
        {linux ? (
          linux.map((p, i) => (
            <a key={p.label} href={p.url} title={PACKAGE_FOR[p.label]} className={i === 0 ? btn.primary : btn.outline}>
              {i === 0 && <DownloadIcon className="size-[18px]" />}
              {i === 0 ? `Download ${p.label}` : p.label}
            </a>
          ))
        ) : (
          <a href={RELEASES_URL} target="_blank" rel="noreferrer" className={btn.outline}>
            No Linux build in this release · see all releases
          </a>
        )}
      </div>
    );
  }
  return (
    <div className={cx("flex flex-wrap items-center gap-2.5", className)}>
      <a href={downloadUrl} className={btn.primary}>
        <DownloadIcon className="size-[18px]" />
        Download for Windows
      </a>
    </div>
  );
}

/** The small print under the buttons. */
export function DownloadMeta() {
  const platform = usePlatform();
  const { version, sizeMb, releaseUrl } = useRepoInfo();
  return (
    <span>
      <a href={releaseUrl} target="_blank" rel="noreferrer" className="underline decoration-border-2 underline-offset-4 hover:text-fg hover:decoration-fg">
        Version {version}
      </a>
      {platform === "windows"
        ? ` · Windows 10 and 11 (x64)${sizeMb ? ` · ${sizeMb} MB` : ""} · no admin rights needed`
        : " · Linux x64, beta · .deb for Ubuntu and Debian, .rpm for Fedora, AppImage for the rest"}
    </span>
  );
}

/* ------------------------------------------------------------------ The download section */

function Point({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2.5 text-[15px] leading-relaxed text-fg-2">
      <Check className="mt-1 size-4 shrink-0 text-lamp" strokeWidth={2.4} />
      <span>{children}</span>
    </li>
  );
}

function SystemCard({
  id,
  icon: Icon,
  name,
  detail,
  tag,
  index,
  children,
}: {
  id: Platform;
  icon: typeof WindowsIcon;
  name: string;
  detail: string;
  tag?: string;
  index: number;
  children: ReactNode;
}) {
  const active = usePlatform() === id;
  return (
    <Reveal
      index={index}
      className={cx(
        "card-depth relative flex flex-col rounded-3xl border bg-card p-6 transition-colors duration-300 sm:p-8",
        active ? "border-lamp/60" : "border-border",
      )}
    >
      <div className="flex items-center gap-4">
        <span
          className={cx(
            "flex size-12 items-center justify-center rounded-2xl border transition-colors duration-300",
            active ? "border-lamp/50 bg-lamp/12 text-fg" : "border-border bg-bg-2 text-fg-2",
          )}
        >
          <Icon className="size-5" />
        </span>
        <div>
          <h3 className="flex items-center gap-2.5 text-[22px] leading-tight font-semibold tracking-[-0.02em] text-fg">
            {name}
            {tag && <span className="rounded-full bg-lamp/15 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-accent uppercase">{tag}</span>}
          </h3>
          <p className="mt-0.5 text-[14px] text-muted">{detail}</p>
        </div>
      </div>
      {children}
    </Reveal>
  );
}

function PackageRow({ pkg, first }: { pkg: LinuxPackage; first: boolean }) {
  return (
    <a
      href={pkg.url}
      className={cx(
        "group flex items-center gap-4 rounded-2xl border px-4 py-3 transition-[border-color,opacity]",
        first ? "border-transparent bg-button text-on-button hover:opacity-90" : "border-border-2 text-fg hover:border-faint",
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold">{pkg.label}</span>
        <span className={cx("block truncate text-[13px]", first ? "opacity-65" : "text-muted")}>{PACKAGE_FOR[pkg.label]}</span>
      </span>
      {pkg.sizeMb && (
        <span className={cx("text-[13px] tabular-nums", first ? "opacity-65" : "text-muted")}>
          {pkg.sizeMb < 10 ? pkg.sizeMb : Math.round(pkg.sizeMb)} MB
        </span>
      )}
      <ArrowDownToLine className="size-[18px] shrink-0 transition-transform duration-300 group-hover:translate-y-0.5" />
    </a>
  );
}

const WINGET = "winget install webKing021.Paperlight";

/** The same install from a terminal, through Windows' own package manager. */
function WingetCommand() {
  const [copied, setCopied] = useState(false);
  const code = useRef<HTMLElement>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(WINGET);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // No clipboard access: select the command so Ctrl+C takes it.
      if (!code.current) return;
      const range = document.createRange();
      range.selectNodeContents(code.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  return (
    <div className="mt-3">
      <p className="text-[13px] text-muted">Or from a terminal, with winget:</p>
      <div className="mt-1.5 flex items-center gap-2 rounded-2xl border border-border-2 bg-bg-2 py-1.5 pr-1.5 pl-4">
        <code ref={code} className="min-w-0 flex-1 py-1 font-mono text-[12.5px] leading-snug font-normal break-words text-fg sm:text-[13px]">
          {WINGET}
        </code>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy the winget command"}
          className="flex h-8 shrink-0 items-center gap-1.5 rounded-xl px-2.5 text-[13px] font-medium text-fg-2 transition-colors hover:bg-card hover:text-fg"
        >
          {copied ? <Check className="size-4 text-lamp" strokeWidth={2.4} /> : <Copy className="size-4" />}
          <span aria-live="polite" className="max-sm:sr-only">
            {copied ? "Copied" : "Copy"}
          </span>
        </button>
      </div>
    </div>
  );
}

const STEPS:{ title: string; body: ReactNode }[] = [
  { title: "Install", body: "Run the installer. No admin rights and no account." },
  { title: "Choose where to look", body: "Pick drives or folders and the formats you care about. You can search while the first scan runs." },
  {
    title: "Search",
    body: (
      <>
        <Kbd>Ctrl</Kbd> <Kbd>K</Kbd> in the app or <Kbd>Alt</Kbd> <Kbd>Space</Kbd> from anywhere. <Kbd>Enter</Kbd> opens.
      </>
    ),
  },
];

export function DownloadSection() {
  const { downloadUrl, sizeMb, version, linux, releaseUrl } = useRepoInfo();
  return (
    <section id="download" className="mx-auto max-w-[1200px] px-5 pt-32 sm:px-8 sm:pt-40">
      <SectionHeading
        center
        eyebrow="Download"
        title={["Free. No account.", "Ready in a minute."]}
        lead={
          <>
            Version {version}, open source under the MIT license.{" "}
            <a href={releaseUrl} target="_blank" rel="noreferrer" className="underline decoration-border-2 underline-offset-4 hover:text-fg">
              See what's new
            </a>
            .
          </>
        }
      />

      <div className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SystemCard id="windows" index={0} icon={WindowsIcon} name="Windows" detail="Windows 10 and 11 · 64-bit">
          <ul className="mt-7 flex-1 space-y-2.5">
            <Point>A {sizeMb ? `${sizeMb} MB` : "small"} installer that needs no admin rights.</Point>
            <Point>Tells you when a new version is out and installs it in seconds, if you want it.</Point>
            <Point>Quick search from any app with Alt+Space, or a shortcut you choose.</Point>
          </ul>
          <a href={downloadUrl} className={cx(btn.primary, "mt-8 w-full justify-center")}>
            <DownloadIcon className="size-[18px]" />
            Download for Windows
          </a>
          <WingetCommand />
          <p className="mt-4text-[13px] leading-relaxed text-muted">
            The installer isn't code-signed yet, so SmartScreen may warn: choose <em>More info</em>, then <em>Run anyway</em>.
          </p>
        </SystemCard>

        <SystemCard id="linux" index={1} icon={LinuxIcon} name="Linux" tag="Beta" detail="64-bit · three package formats">
          {linux ? (
            <div className="mt-7 flex flex-1 flex-col gap-2.5">
              {linux.map((p, i) => (
                <PackageRow key={p.label} pkg={p} first={i === 0} />
              ))}
            </div>
          ) : (
            <p className="mt-7 flex-1 text-[15px] leading-relaxed text-muted">
              The latest release has no Linux packages.{" "}
              <a href={RELEASES_URL} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-fg">
                See all releases
              </a>
              .
            </p>
          )}
          <p className="mt-4 text-[13px] leading-relaxed text-muted">
            Beta: on Linux it doesn't update itself yet, and the quick-search shortcut needs X11.
          </p>
        </SystemCard>
      </div>

      <ol className="mt-4 grid grid-cols-1 overflow-hidden rounded-3xl border border-border md:grid-cols-3">
        {STEPS.map((s, i) => (
          <Reveal
            as="li"
            key={s.title}
            index={i}
            className="flex gap-4 border-border p-6 not-first:border-t sm:p-7 md:not-first:border-t-0 md:not-first:border-l"
          >
            <span className="pt-px text-[13px] font-semibold text-accent tabular-nums">0{i + 1}</span>
            <div>
              <h3 className="text-[16px] leading-tight font-semibold text-fg">{s.title}</h3>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

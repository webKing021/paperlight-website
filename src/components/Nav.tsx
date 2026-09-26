import { ArrowRight, Menu, Moon, Star, Sun, X } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
import { formatStars, REPO_URL, useRepoInfo } from "../lib/github";
import { useTheme } from "../lib/theme";
import { DownloadButton } from "./Hero";
import { GitHubIcon, Mark } from "./icons";
import { cx } from "./ui";

const LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#privacy", label: "Privacy" },
  { href: "/#screenshots", label: "Screenshots" },
  { href: "/#faq", label: "FAQ" },
];

/**
 * Section links are written as "/#faq" so they also work from other pages. On the home page
 * they scroll in place (even with a query string in the URL) instead of reloading the page.
 */
export function goToSection(e: MouseEvent<HTMLAnchorElement>) {
  const hash = new URL(e.currentTarget.href).hash;
  const target = hash && document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!target || window.location.pathname !== "/") return;
  e.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", `${window.location.pathname}${window.location.search}${hash}`);
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Light theme" : "Dark theme"}
      className={cx(
        "flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-card-2 hover:text-fg",
        className,
      )}
    >
      {theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
    </button>
  );
}

export function Logo() {
  return (
    <a href="/" className="flex items-center gap-2" aria-label="Paperlight home">
      <Mark className="size-7" />
      <span className="text-[19px] font-semibold tracking-[-0.02em] text-fg">Paperlight</span>
    </a>
  );
}

export function Nav() {
  const { stars } = useRepoInfo();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The menu closes on Escape and when the screen grows past the phone layout.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const wide = window.matchMedia("(min-width: 768px)");
    const onWide = () => wide.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || open ? "border-b border-border bg-bg/80 backdrop-blur-xl" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-3 px-4 min-[380px]:px-5 sm:gap-6 sm:px-8">
        <Logo />
        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={goToSection} className="rounded-full px-3 py-1.5 text-[14px] text-muted transition-colors hover:text-fg">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Paperlight on GitHub"
            className="flex h-9 items-center gap-2 rounded-full bg-button px-2.5 text-[13px] font-semibold tracking-wide text-on-button transition-opacity hover:opacity-90 min-[380px]:pr-3.5 min-[380px]:pl-3"
          >
            <GitHubIcon className="size-4" />
            <span className="hidden min-[380px]:inline">GitHub</span>
            {!!stars && (
              <>
                <span className="hidden h-4 w-px bg-on-button/25 min-[380px]:block" />
                <span className="hidden items-center gap-1 tabular-nums min-[380px]:flex">
                  <Star className="size-3.5 fill-current" />
                  {formatStars(stars)}
                </span>
              </>
            )}
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex size-9 items-center justify-center rounded-full text-fg-2 transition-colors hover:bg-card-2 md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" className="animate-fade border-t border-border px-4 pt-2 pb-5 md:hidden">
          {LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => {
                setOpen(false);
                goToSection(e);
              }}
              className="animate-rise flex items-center justify-between border-b border-border py-3.5 text-[17px] font-medium text-fg"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {l.label}
              <ArrowRight className="size-4 text-faint" />
            </a>
          ))}
          <div className="mt-5">
            <DownloadButton size="md" />
          </div>
        </nav>
      )}

      {/* Reading progress (browsers that support scroll-driven animations). */}
      <div aria-hidden="true" className="progress absolute inset-x-0 bottom-[-1px] h-px bg-gradient-to-r from-transparent via-lamp to-lamp" />
    </header>
  );
}

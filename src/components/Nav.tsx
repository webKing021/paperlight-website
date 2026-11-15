import { ArrowRight, Download, Menu, Moon, Star, Sun, X } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
import { formatStars, REPO_URL, useRepoInfo } from "../lib/github";
import { useTheme } from "../lib/theme";
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
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300",
        scrolled || open ? "border-border bg-bg/92 backdrop-blur-md" : "border-transparent",
      )}
    >
      {/* Tablets (md) get the full menu too, so everything sits a little closer there. */}
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-3 px-4 min-[380px]:px-5 sm:px-8 lg:gap-6">
        <Logo />
        <nav className="hidden items-center md:flex lg:ml-4 lg:gap-1">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={goToSection} className="rounded-full px-2.5 py-1.5 text-[14px] text-muted transition-colors hover:text-fg lg:px-3">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Paperlight on GitHub"
            className="flex h-9 items-center gap-2 rounded-full px-2.5 text-[13.5px] font-medium text-fg-2 transition-colors hover:bg-card-2 hover:text-fg"
          >
            <GitHubIcon className="size-[18px]" />
            {!!stars && (
              <span className="hidden items-center gap-1 tabular-nums min-[380px]:flex">
                <Star className="size-3.5 fill-lamp text-lamp" />
                {formatStars(stars)}
              </span>
            )}
          </a>
          <a
            href="/#download"
            onClick={goToSection}
            className="hidden h-9 shrink-0 items-center gap-2 rounded-full bg-button px-4 text-[13.5px] font-semibold text-on-button transition-opacity hover:opacity-90 sm:flex"
          >
            <Download className="size-4" />
            Download
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
          <a
            href="/#download"
            onClick={(e) => {
              setOpen(false);
              goToSection(e);
            }}
            className="mt-5 flex h-11 items-center justify-center gap-2 rounded-full bg-button text-[15px] font-semibold text-on-button"
          >
            <Download className="size-4" />
            Download
          </a>
        </nav>
      )}
    </header>
  );
}

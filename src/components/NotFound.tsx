import { ArrowLeft, Search } from "lucide-react";
import { FileIcon } from "./icons";

/** Shown for any unknown path (Vercel rewrites every route to the app, so there's never a bare 404). */
export function NotFound() {
  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 pt-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-[720px] max-w-[140vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(234_176_76/0.3),transparent)]"
      />
      <div className="relative max-w-lg text-center">
        <div className="font-app mx-auto flex w-fit items-center gap-3 rounded-xl border border-line bg-paper px-4 py-3 shadow-[0_20px_50px_-24px_rgb(0_0_0/0.6)]">
          <Search className="size-4 text-graphite" />
          <span className="text-[14px] text-ink">{decodeURIComponent(location.pathname).slice(1, 40) || "page"}</span>
          <span className="ml-6 text-[12px] text-pencil">0 documents</span>
        </div>
        <h1 className="mt-10 text-[clamp(2.5rem,7vw,4rem)] leading-none font-semibold tracking-[-0.045em] text-fg">
          Nothing by that name.
        </h1>
        <p className="mt-5 text-lg text-muted">
          This page doesn't exist. Every document on your PC can be found, though. That's the whole idea.
        </p>
        <a
          href="/"
          className="mt-9 inline-flex h-12 items-center gap-2 rounded-full bg-button px-6 text-[15px] font-semibold text-on-button transition-opacity hover:opacity-90"
        >
          <ArrowLeft className="size-4" /> Back to Paperlight
        </a>
        <div className="mt-12 flex justify-center gap-3 opacity-60">
          <FileIcon kind="pdf" size={30} />
          <FileIcon kind="word" size={30} />
          <FileIcon kind="excel" size={30} />
          <FileIcon kind="slides" size={30} />
        </div>
      </div>
    </main>
  );
}

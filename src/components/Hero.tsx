import { ArrowRight, Code2, Feather, ScanText, WifiOff } from "lucide-react";
import { Demo } from "../demo/Demo";
import { useRepoInfo } from "../lib/github";
import { DownloadButtons, DownloadMeta, PlatformSwitch } from "./Download";
import { DownloadChip } from "./DownloadCount";
import { WatchFilmLink } from "./Showcase";

const FACTS = [
  { icon: ScanText, strong: "Searches inside", rest: "every document" },
  { icon: Feather, strong: "~5 MB", rest: "installer" },
  { icon: Code2, strong: "Open source", rest: "MIT" },
  { icon: WifiOff, strong: "Works offline", rest: "no account" },
];

export function Hero() {
  const { version, releaseUrl } = useRepoInfo();

  return (
    <section className="relative pt-26 sm:pt-32">
      <div aria-hidden="true" className="hero-sky" />
      <div className="relative mx-auto flex max-w-[1200px] flex-col items-center px-5 text-center sm:px-8">
        <div className="animate-rise flex flex-wrap items-center justify-center gap-2.5">
          <a
            href={releaseUrl}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex h-8 items-center gap-2 rounded-full border border-border bg-card pr-3 pl-1 text-[13.5px] text-fg-2 transition-colors hover:border-border-2 hover:text-fg"
          >
            <span className="rounded-full bg-lamp px-2 py-0.5 text-[11.5px] font-semibold text-[#1b1b1e]">New</span>
            Version {version} is out
            <ArrowRight className="size-3.5 text-faint transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
          <DownloadChip />
        </div>

        <h1
          className="animate-rise mt-7 text-[clamp(2.7rem,9.4vw,6.5rem)] leading-[0.96] font-semibold tracking-[-0.05em] text-fg"
          style={{ animationDelay: "60ms" }}
        >
          Every document.
          <br />
          <span className="headline-accent">One search away.</span>
        </h1>
        <p
          className="animate-rise mt-7 max-w-[38rem] text-pretty text-[clamp(1.05rem,1.6vw,1.25rem)] leading-relaxed text-muted"
          style={{ animationDelay: "120ms" }}
        >
          Paperlight finds any PDF, Word, Excel or PowerPoint file on your PC by its name, its folder or the words inside it.
          It indexes once, keeps up as files change, and never sends your data anywhere.
        </p>

        <div className="animate-rise mt-9 flex flex-col items-center gap-4" style={{ animationDelay: "180ms" }}>
          <PlatformSwitch />
          <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-3">
            <DownloadButtons className="justify-center" />
            <WatchFilmLink />
          </div>
          <p className="max-w-[34rem] text-[13.5px] leading-relaxed text-muted">
            <DownloadMeta />
          </p>
        </div>

        <ul
          className="animate-rise mt-9 flex flex-wrap justify-center gap-x-7 gap-y-2.5 border-t border-border pt-6 text-[14.5px]"
          style={{ animationDelay: "240ms" }}
        >
          {FACTS.map(({ icon: Icon, strong, rest }) => (
            <li key={strong} className="flex items-center gap-2">
              <Icon className="size-4 text-lamp" strokeWidth={2} />
              <span className="font-semibold text-fg">{strong}</span>
              <span className="text-muted">{rest}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mx-auto mt-12 max-w-[1240px] px-3 sm:mt-14 sm:px-8">
        <Demo />
      </div>
    </section>
  );
}

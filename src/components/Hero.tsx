import { Code2, Download, Feather, ScanText, WifiOff } from "lucide-react";
import { Demo } from "../demo/Demo";
import { REPO_URL, useRepoInfo } from "../lib/github";
import { DownloadChip } from "./DownloadCount";
import { Daylight } from "./Lamp";
import { GitHubIcon } from "./icons";

const FACTS = [
  { icon: ScanText, strong: "Searches inside", rest: "every document" },
  { icon: Feather, strong: "~5 MB", rest: "installer" },
  { icon: Code2, strong: "Open source", rest: "MIT" },
  { icon: WifiOff, strong: "Works offline", rest: "no account" },
];

export function DownloadButton({ size = "lg" }: { size?: "lg" | "md" }) {
  const { downloadUrl } = useRepoInfo();
  return (
    <a
      href={downloadUrl}
      className={
        size === "lg"
          ? "group relative inline-flex h-13 items-center gap-2.5 rounded-full bg-button px-5 text-[13.5px] font-semibold tracking-[0.03em] whitespace-nowrap text-on-button uppercase min-[380px]:px-7 min-[380px]:text-[15px] min-[380px]:tracking-[0.04em] shadow-[0_0_0_1px_rgb(234_176_76/0.5),0_0_32px_-4px_rgb(234_176_76/0.55)] transition-[transform,box-shadow] duration-300 hover:-translate-y-px hover:shadow-[0_0_0_1px_rgb(234_176_76/0.8),0_0_44px_-2px_rgb(234_176_76/0.7)]"
          : "inline-flex h-11 items-center gap-2 rounded-full bg-button px-5 text-[14px] font-semibold whitespace-nowrap text-on-button transition-opacity hover:opacity-90"
      }
    >
      <Download className={size === "lg" ? "size-[18px]" : "size-4"} />
      Download for Windows
    </a>
  );
}

export function Hero() {
  const { version, sizeMb, releaseUrl } = useRepoInfo();

  return (
    <section className="relative pt-32 sm:pt-40">
      <Daylight />
      <div className="relative z-10 mx-auto max-w-[1200px] px-5 sm:px-8">
        <h1 className="animate-rise max-w-[15ch] text-[clamp(2.6rem,9vw,6.75rem)] leading-[0.95] font-semibold tracking-[-0.05em] text-fg">
          Every document.
          <br />
          <span className="headline-accent">
            One search away.
          </span>
        </h1>
        <p
          className="animate-rise mt-7 max-w-[34rem] text-pretty text-[clamp(1.05rem,1.6vw,1.3rem)] leading-relaxed text-muted"
          style={{ animationDelay: "80ms" }}
        >
          Paperlight finds any PDF, Word, Excel or PowerPoint file on your PC by its name, its folder or the words inside it.
          It indexes once, keeps up as files change, and never sends your data anywhere.
        </p>

        <ul className="animate-rise mt-7 flex flex-wrap gap-x-6 gap-y-2.5 text-[15px]" style={{ animationDelay: "140ms" }}>
          {FACTS.map(({ icon: Icon, strong, rest }) => (
            <li key={strong} className="flex items-center gap-2">
              <Icon className="size-4 text-lamp" strokeWidth={2} />
              <span className="font-semibold text-fg">{strong}</span>
              <span className="text-muted">{rest}</span>
            </li>
          ))}
        </ul>

        <div className="animate-rise mt-9 flex flex-wrap items-center gap-3" style={{ animationDelay: "200ms" }}>
          <DownloadButton />
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-13 items-center gap-2 rounded-full border border-border-2 px-6 text-[15px] font-medium text-fg-2 transition-colors hover:border-faint hover:text-fg"
          >
            <GitHubIcon className="size-4" /> View source
          </a>
        </div>
        <p className="animate-rise mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px] text-muted" style={{ animationDelay: "240ms" }}>
          <DownloadChip />
          <span>
          <a href={releaseUrl} target="_blank" rel="noreferrer" className="underline decoration-border-2 underline-offset-4 hover:text-fg hover:decoration-fg">
            Version {version}
          </a>{" "}
          for Windows 10 and 11 (x64){sizeMb ? ` · ${sizeMb} MB` : ""} · no admin rights needed
          </span>
        </p>
      </div>

      <div className="relative mx-auto mt-20 max-w-[1240px] px-3 sm:mt-24 sm:px-8">
        <Demo />
      </div>
    </section>
  );
}

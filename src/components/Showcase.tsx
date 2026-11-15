import { Play } from "lucide-react";
import { useEffect, useState } from "react";
import { Reveal } from "./Reveal";
import { cx, SectionHeading } from "./ui";

/**
 * The videos, hosted on YouTube. Until someone presses play the page only shows a local
 * poster: nothing is loaded from YouTube before that (and then from youtube-nocookie.com).
 * The first one is what the section opens on; the tour is what the hero's link plays.
 */
type Video = { id: string; youtubeId: string; duration: string; label: string; title: string; poster: string };

const VIDEOS: Video[] = [
  { id: "update", youtubeId: "XygZKOjmGGw", duration: "0:25", label: "What's new in 1.2", title: "What's new in Paperlight 1.2", poster: "/film/update-poster" },
  { id: "tour", youtubeId: "vAPLSGX4Teg", duration: "1:58", label: "The full tour", title: "Paperlight: the full tour", poster: "/film/poster" },
];
const TOUR = VIDEOS[1];

const PLAY_EVENT = "paperlight:play-film";

/** A quiet link for the hero: scrolls to the videos and starts the tour. */
export function WatchFilmLink() {
  return (
    <a
      href="#film"
      onClick={(e) => {
        e.preventDefault();
        document.getElementById("film")?.scrollIntoView({ behavior: "smooth", block: "center" });
        window.dispatchEvent(new Event(PLAY_EVENT));
      }}
      className="inline-flex h-12 items-center gap-2.5 rounded-full px-4 text-[15px] font-medium text-fg-2 transition-colors hover:text-fg"
    >
      <span className="flex size-7 items-center justify-center rounded-full border border-border-2">
        <Play className="size-3 translate-x-px fill-current" />
      </span>
      Watch the film <span className="text-faint tabular-nums">{TOUR.duration}</span>
    </a>
  );
}

const SHOTS = [
  { id: "overview", label: "Overview", alt: "Overview: a tile per document type, the list below and a PDF preview" },
  { id: "search", label: "Search", alt: "Search results with the matching passages highlighted" },
  { id: "quick-search", label: "Quick search", alt: "The quick search launcher opened with Alt+Space" },
  { id: "duplicates", label: "Duplicates", alt: "Identical copies grouped together" },
  { id: "storage", label: "Storage", alt: "Size by type and the largest documents" },
  { id: "settings", label: "Settings", alt: "Settings: choose which file formats are indexed" },
  { id: "update", label: "Updates", alt: "A new version offered inside Paperlight, with what's new" },
  { id: "dark", label: "Dark theme", alt: "Paperlight in its dark theme" },
  { id: "welcome", label: "Welcome", alt: "The welcome screen on first run" },
];

/** Tabs are named "video:<id>" or "shot:<id>", so a video and a screenshot can share an id. */
const videoTab = (v: Video) => `video:${v.id}`;
const shotTab = (id: string) => `shot:${id}`;

function VideoFrame({ video, playing, onPlay }: { video: Video; playing: boolean; onPlay: () => void }) {
  const src = `https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&playsinline=1&vq=hd2160`;
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
      {playing ? (
        <iframe
          key={video.id}
          src={src}
          title={video.title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 size-full"
        />
      ) : (
        <button type="button" onClick={onPlay} className="group absolute inset-0 size-full cursor-pointer" aria-label={`Play "${video.title}" (${video.duration})`}>
          <picture key={video.id}>
            <source srcSet={`${video.poster}.webp`} type="image/webp" />
            <img src={`${video.poster}.jpg`} alt="" width={1920} height={1080} loading="lazy" decoding="async" className="animate-fade size-full object-cover" />
          </picture>
          <span className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/0" />
          <span className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-full bg-[#f3f3f5]/95 py-2.5 pr-6 pl-2.5 text-[15px] font-semibold whitespace-nowrap text-[#111113] shadow-[0_0_0_1px_rgb(234_176_76/0.5),0_0_40px_-4px_rgb(234_176_76/0.6)] transition-transform duration-300 group-hover:scale-[1.04]">
            <span className="flex size-10 items-center justify-center rounded-full bg-[#111113] text-[#eab04c]">
              <Play className="size-4 translate-x-px fill-current" />
            </span>
            Play
            <span className="font-medium text-[#62626a] tabular-nums">{video.duration}</span>
          </span>
        </button>
      )}
    </div>
  );
}

/** The two videos and the real screenshots, in one viewer. */
export function Showcase() {
  const [active, setActive] = useState(videoTab(VIDEOS[0]));
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const play = () => {
      setActive(videoTab(TOUR));
      setPlaying(true);
    };
    window.addEventListener(PLAY_EVENT, play);
    return () => window.removeEventListener(PLAY_EVENT, play);
  }, []);

  /** Changing tab always stops whatever was playing. */
  const show = (tab: string) => {
    setActive(tab);
    setPlaying(false);
  };
  /** Fetch a picture as soon as its tab is pointed at, so the switch is instant. */
  const warm = (src: string) => {
    new Image().src = src;
  };

  const video = VIDEOS.find((v) => videoTab(v) === active);
  const shot = SHOTS.find((s) => shotTab(s.id) === active);
  const tabs = [
    ...VIDEOS.map((v) => ({ tab: videoTab(v), label: `${v.label} · ${v.duration}`, isVideo: true, picture: `${v.poster}.webp` })),
    ...SHOTS.map((s) => ({ tab: shotTab(s.id), label: s.label, isVideo: false, picture: `/screenshots/${s.id}.png` })),
  ];

  return (
    <section id="screenshots" className="mx-auto max-w-[1200px] px-5 pt-32 sm:px-8 sm:pt-40">
      <SectionHeading
        eyebrow="See it"
        title={["The real thing.", "Not a mock-up."]}
        lead="What's new in 25 seconds, the full two-minute tour, and screenshots of Paperlight on Windows 11 with made-up sample documents."
      />
      <Reveal className="-mx-5 mt-10 flex gap-1.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0" role="tablist" aria-label="Videos and screenshots">
        {tabs.map((t) => (
          <button
            key={t.tab}
            type="button"
            role="tab"
            aria-selected={t.tab === active}
            onClick={() => show(t.tab)}
            onPointerEnter={() => warm(t.picture)}
            onFocus={() => warm(t.picture)}
            className={cx(
              "flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-[14px] transition-colors",
              t.tab === active ? "border-fg bg-fg text-bg" : "border-border text-muted hover:border-border-2 hover:text-fg",
            )}
          >
            {t.isVideo && <Play className="size-3 fill-current" />}
            {t.label}
          </button>
        ))}
      </Reveal>
      <Reveal id="film" variant="scale" className="card-depth mt-5 overflow-hidden rounded-3xl border border-border bg-bg-2 p-2 sm:p-4">
        {video && <VideoFrame video={video} playing={playing} onPlay={() => setPlaying(true)} />}
        {shot && (
          <a href={`/screenshots/${shot.id}.png`} target="_blank" rel="noreferrer" title="Open full size" className="flex cursor-zoom-in items-center justify-center">
            <img
              key={shot.id}
              src={`/screenshots/${shot.id}.png`}
              alt={shot.alt}
              width={shot.id === "quick-search" ? 1024 : 1804}
              height={shot.id === "quick-search" ? 694 : 1217}
              loading="lazy"
              decoding="async"
              className={cx("animate-fade h-auto rounded-xl", shot.id === "quick-search" ? "w-full max-w-[720px]" : "w-full")}
            />
          </a>
        )}
      </Reveal>
      <p className="mt-3 px-1 text-[13px] text-faint">
        {shot ? "Click the screenshot to open it full size." : "Plays from YouTube (youtube-nocookie.com) once you press play."}
      </p>
    </section>
  );
}

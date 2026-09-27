import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./ui";

/**
 * The product film, hosted on YouTube. Until someone presses play the page only shows a local
 * poster: nothing is loaded from YouTube before that (and then from youtube-nocookie.com).
 * Leave `youtubeId` empty to hide the film everywhere.
 */
export const FILM = { youtubeId: "vAPLSGX4Teg", duration: "1:58" };

const PLAY_EVENT = "paperlight:play-film";

/** A quiet link for the hero: scrolls to the film and starts it. */
export function WatchFilmLink() {
  if (!FILM.youtubeId) return null;
  return (
    <a
      href="#film"
      onClick={(e) => {
        e.preventDefault();
        document.getElementById("film")?.scrollIntoView({ behavior: "smooth", block: "center" });
        window.dispatchEvent(new Event(PLAY_EVENT));
      }}
      className="inline-flex h-13 items-center gap-2.5 rounded-full px-4 text-[15px] font-medium text-fg-2 transition-colors hover:text-fg"
    >
      <span className="flex size-7 items-center justify-center rounded-full border border-border-2">
        <Play className="size-3 translate-x-px fill-current" />
      </span>
      Watch the film <span className="text-faint tabular-nums">{FILM.duration}</span>
    </a>
  );
}

export function Film() {
  const [playing, setPlaying] = useState(false);
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const play = () => setPlaying(true);
    window.addEventListener(PLAY_EVENT, play);
    return () => window.removeEventListener(PLAY_EVENT, play);
  }, []);

  if (!FILM.youtubeId) return null;

  const src = `https://www.youtube-nocookie.com/embed/${FILM.youtubeId}?autoplay=1&rel=0&playsinline=1&vq=hd2160`;

  return (
    <section id="film" className="mx-auto max-w-[1200px] px-5 pt-36 sm:px-8">
      <SectionHeading title={["Two minutes,", "the whole tour."]} lead="Setup, search, quick search, live updates and the rest, on a made-up sample library." />
      <Reveal variant="scale" className="card-depth mt-10 overflow-hidden rounded-2xl border border-border bg-bg-2 p-2 sm:p-3">
        <div ref={frame} className="relative aspect-video overflow-hidden rounded-xl bg-black">
          {playing ? (
            <iframe
              src={src}
              title="Paperlight: the film"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 size-full"
            />
          ) : (
            <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 size-full cursor-pointer" aria-label={`Play the film (${FILM.duration})`}>
              <picture>
                <source srcSet="/film/poster.webp" type="image/webp" />
                <img src="/film/poster.jpg" alt="" width={1920} height={1080} loading="lazy" decoding="async" className="size-full object-cover" />
              </picture>
              <span className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/0" />
              <span className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-full bg-[#f3f3f5]/95 py-2.5 pr-6 pl-2.5 text-[15px] font-semibold text-[#111113] shadow-[0_0_0_1px_rgb(234_176_76/0.5),0_0_40px_-4px_rgb(234_176_76/0.6)] transition-transform duration-300 group-hover:scale-[1.04]">
                <span className="flex size-10 items-center justify-center rounded-full bg-[#111113] text-[#eab04c]">
                  <Play className="size-4 translate-x-px fill-current" />
                </span>
                Play the film
                <span className="font-medium text-[#62626a] tabular-nums">{FILM.duration}</span>
              </span>
            </button>
          )}
        </div>
      </Reveal>
      <p className="mt-3 px-1 text-[13px] text-faint">Plays from YouTube (youtube-nocookie.com) once you press play.</p>
    </section>
  );
}

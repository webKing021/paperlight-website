import { useEffect, useState } from "react";

export const REPO = "webKing021/paperlight";
export const REPO_URL = `https://github.com/${REPO}`;
export const RELEASES_URL = `${REPO_URL}/releases/latest`;
export const AUTHOR_URL = "https://github.com/webKing021";

export type RepoInfo = {
  stars: number | null;
  version: string;
  downloadUrl: string;
  sizeMb: number | null;
  releaseUrl: string;
};

/** What the page shows before (or without) the GitHub API: the current release. */
const FALLBACK: RepoInfo = {
  stars: null,
  version: "1.0.0",
  downloadUrl: RELEASES_URL,
  sizeMb: 4.3,
  releaseUrl: RELEASES_URL,
};

const CACHE_KEY = "paperlight-repo";
const CACHE_MS = 60 * 60 * 1000;

type Release = {
  tag_name: string;
  html_url: string;
  assets: { name: string; browser_download_url: string; size: number }[];
};

async function load(): Promise<RepoInfo> {
  const [repo, release] = await Promise.all([
    fetch(`https://api.github.com/repos/${REPO}`).then((r) => (r.ok ? r.json() : null)),
    fetch(`https://api.github.com/repos/${REPO}/releases/latest`).then((r) => (r.ok ? r.json() : null)),
  ]);
  const rel = release as Release | null;
  const setup = rel?.assets.find((a) => /setup\.exe$/i.test(a.name)) ?? rel?.assets.find((a) => /\.exe$/i.test(a.name));
  return {
    stars: typeof repo?.stargazers_count === "number" ? repo.stargazers_count : null,
    version: rel?.tag_name?.replace(/^v/, "") ?? FALLBACK.version,
    downloadUrl: setup?.browser_download_url ?? FALLBACK.downloadUrl,
    sizeMb: setup ? Math.round((setup.size / 1024 / 1024) * 10) / 10 : FALLBACK.sizeMb,
    releaseUrl: rel?.html_url ?? FALLBACK.releaseUrl,
  };
}

let pending: Promise<RepoInfo> | null = null;

/** Star count and latest installer from the GitHub API, cached for an hour per visitor. */
export function useRepoInfo(): RepoInfo {
  const [info, setInfo] = useState<RepoInfo>(() => {
    try {
      const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? "null");
      if (cached && Date.now() - cached.at < CACHE_MS) return cached.info as RepoInfo;
    } catch {
      /* storage unavailable */
    }
    return FALLBACK;
  });

  useEffect(() => {
    if (info !== FALLBACK) return;
    pending ??= load();
    let live = true;
    pending
      .then((next) => {
        if (!live) return;
        setInfo(next);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), info: next }));
        } catch {
          /* storage unavailable */
        }
      })
      .catch(() => {
        /* offline or rate-limited: keep the fallback */
      });
    return () => {
      live = false;
    };
  }, [info]);

  return info;
}

export function formatStars(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n);
}

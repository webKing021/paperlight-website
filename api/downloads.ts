/// <reference types="node" />
/**
 * GET /api/downloads → { total, releases, at }
 *
 * Total downloads of the Paperlight installer across every published release, as counted by
 * GitHub (this includes in-app updates, which download the same installer). Vercel's CDN
 * caches the answer for 5 minutes, so GitHub is asked at most a few times an hour however
 * many people visit. Set GITHUB_TOKEN in Vercel for a higher GitHub rate limit (optional).
 */

const REPO = "webKing021/paperlight";

type Release = { draft: boolean; assets: { name: string; download_count: number }[] };

export async function GET(): Promise<Response> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "paperlight-website",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  let total = 0;
  let releases = 0;
  try {
    for (let page = 1; page <= 10; page++) {
      const res = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=100&page=${page}`, { headers });
      if (!res.ok) return reply({ error: `GitHub answered ${res.status}` }, 502, "no-store");
      const list = (await res.json()) as Release[];
      for (const release of list) {
        if (release.draft) continue;
        releases++;
        for (const asset of release.assets) {
          // Installers only: not signatures (.sig) or the updater's latest.json.
          if (/\.(exe|msi)$/i.test(asset.name)) total += asset.download_count;
        }
      }
      if (list.length < 100) break;
    }
  } catch {
    return reply({ error: "GitHub unreachable" }, 502, "no-store");
  }

  return reply({ total, releases, at: new Date().toISOString() }, 200, "public, s-maxage=300, stale-while-revalidate=86400");
}

function reply(body: unknown, status: number, cache: string): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": cache },
  });
}

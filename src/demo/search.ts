import type { Doc } from "./data";

/** A character range to highlight. */
export type Range = [start: number, end: number];

export type Hit = {
  doc: Doc;
  score: number;
  name: Range[];
  snippet?: { text: string; ranges: Range[] };
};

const WORD = /[\p{L}\p{N}]+/gu;

function fold(s: string): string {
  return s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

function words(s: string): { w: string; start: number; end: number }[] {
  const out: { w: string; start: number; end: number }[] = [];
  for (const m of s.matchAll(WORD)) out.push({ w: fold(m[0]), start: m.index, end: m.index + m[0].length });
  return out;
}

/** Optimal string alignment distance (a swap of two letters counts as one edit). */
function distance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
}

/**
 * The app's matching rules, in miniature: prefixes match ("invoic" finds "invoices"), and
 * longer words forgive typos (one in 5+ letters, two in 9+). Exact beats prefix beats typo.
 */
function match(term: string, word: string): number {
  if (word === term) return 3;
  if (word.startsWith(term)) return 2;
  const max = term.length >= 9 ? 2 : term.length >= 5 ? 1 : 0;
  if (max === 0) return 0;
  const near = Math.min(distance(term, word, max), distance(term, word.slice(0, term.length), max));
  return near <= max ? 1 : 0;
}

function findIn(field: { w: string; start: number; end: number }[], term: string) {
  let best = 0;
  const ranges: Range[] = [];
  for (const t of field) {
    const m = match(term, t.w);
    if (m > 0) {
      ranges.push([t.start, t.end]);
      best = Math.max(best, m);
    }
  }
  return { best, ranges };
}

function snippetOf(text: string, ranges: Range[]): { text: string; ranges: Range[] } {
  const first = ranges[0][0];
  const start = Math.max(0, text.lastIndexOf(" ", Math.max(0, first - 28)) + 1);
  const clip = text.slice(start, start + 150);
  const prefix = start > 0 ? "… " : "";
  return {
    text: prefix + clip,
    ranges: ranges
      .filter(([s, e]) => s >= start && e <= start + 150)
      .map(([s, e]) => [s - start + prefix.length, e - start + prefix.length] as Range),
  };
}

export function terms(query: string): string[] {
  return words(query).map((t) => t.w);
}

export function search(docs: Doc[], query: string, now = Date.now()): Hit[] {
  const qs = terms(query);
  if (qs.length === 0) return [];
  const hits: Hit[] = [];

  for (const doc of docs) {
    const base = doc.name.slice(0, doc.name.lastIndexOf("."));
    const nameW = words(base);
    const folderW = words(doc.folder.split("\\").slice(3).join(" "));
    const textW = words(doc.text);
    let score = 0;
    const nameRanges: Range[] = [];
    const textRanges: Range[] = [];
    let ok = true;

    for (const q of qs) {
      const n = findIn(nameW, q);
      const f = findIn(folderW, q);
      const t = findIn(textW, q);
      if (!n.best && !f.best && !t.best) {
        ok = false;
        break;
      }
      score += n.best * 10 + f.best * 4 + t.best * 2;
      nameRanges.push(...n.ranges);
      textRanges.push(...t.ranges);
    }
    if (!ok) continue;

    // Recent, favourite and often-opened documents rank a little higher.
    const ageDays = (now - doc.modified) / 86400000;
    score += ageDays < 7 ? 3 : ageDays < 30 ? 1.5 : 0;
    if (doc.favourite) score += 2;
    if (doc.opened) score += Math.min(3, doc.opened.count / 2);

    textRanges.sort((a, b) => a[0] - b[0]);
    hits.push({
      doc,
      score,
      name: nameRanges,
      snippet: textRanges.length ? snippetOf(doc.text, textRanges) : undefined,
    });
  }

  return hits.sort((a, b) => b.score - a.score);
}

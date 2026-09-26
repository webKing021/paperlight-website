const DAY = 24 * 60 * 60 * 1000;

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  const mb = bytes / 1024 / 1024;
  return `${mb < 10 ? mb.toFixed(1) : Math.round(mb)} MB`;
}

/** "2 days ago" for the last month, then a date, the way the app shows it. */
export function formatAgo(time: number, now = Date.now()): string {
  const diff = now - time;
  const days = Math.floor(diff / DAY);
  if (diff < 60 * 60 * 1000) return `${Math.max(1, Math.round(diff / 60000))} minutes ago`;
  if (days < 1) return `${Math.round(diff / 3600000)} hours ago`;
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  return new Date(time).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDate(time: number): string {
  return new Date(time).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export { DAY };

export const cn = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(" ");

/** Parse a #rrggbb hex into an `r, g, b` triple. */
const parseHex = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
};

/** `#rrggbb` → `rgba(r,g,b,a)` for dynamic per-model tints in inline styles. */
export const hexToRgba = (hex: string, alpha: number): string => {
  const [r, g, b] = parseHex(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/** Readable text color (near-black / white) for text laid over `hex`, chosen by
 *  relative luminance so brand backgrounds stay WCAG-legible. */
export const readableOn = (hex: string): string => {
  const [r, g, b] = parseHex(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.4 ? "#0a0a0a" : "#ffffff";
};

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

let idCounter = 0;
/** Monotonic client-side id — stable within a session, never used for SSR. */
export const uid = (prefix = "id"): string => `${prefix}-${Date.now()}-${idCounter++}`;

/** Human-readable file size for attachment chips. */
export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/** Relative timestamp: "44m", "3h", "4d". Call only after hydration. */
export const relativeTime = (from: number, to: number = Date.now()): string => {
  const s = Math.max(0, Math.round((to - from) / 1000));
  if (s < 60) return "now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.round(h / 24)}d`;
};

export type DateBucket = "Today" | "Yesterday" | "Earlier";

export const dateBucket = (ts: number, now: number = Date.now()): DateBucket => {
  const startOfToday = new Date(now).setHours(0, 0, 0, 0);
  const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;
  if (ts >= startOfToday) return "Today";
  if (ts >= startOfYesterday) return "Yesterday";
  return "Earlier";
};

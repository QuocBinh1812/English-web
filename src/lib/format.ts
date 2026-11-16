import { siteConfig } from "@/config/site";

const numberFormat = new Intl.NumberFormat(siteConfig.locale);
const relativeFormat = new Intl.RelativeTimeFormat(siteConfig.locale, { numeric: "auto" });

export function formatNumber(n: number): string {
  return numberFormat.format(n);
}

/** 245 → "4:05" (media length). */
export function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** 95 → "1 giờ 35 phút", 12 → "12 phút". */
export function formatMinutes(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m} phút`;
  if (m === 0) return `${h} giờ`;
  return `${h} giờ ${m} phút`;
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
];

/** "3 giờ trước", "hôm qua"... */
export function formatRelative(iso: string, now: Date = new Date()): string {
  const diffSec = (new Date(iso).getTime() - now.getTime()) / 1000;
  for (const [unit, sec] of UNITS) {
    if (Math.abs(diffSec) >= sec) return relativeFormat.format(Math.round(diffSec / sec), unit);
  }
  return "vừa xong";
}

const WEEKDAYS_SHORT = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

/** Short Vietnamese weekday for a YYYY-MM-DD key. */
export function weekdayShort(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  return WEEKDAYS_SHORT[(new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7];
}

/** "16/11" for a YYYY-MM-DD key. */
export function dayMonth(dateKey: string): string {
  const [, m, d] = dateKey.split("-");
  return `${Number(d)}/${Number(m)}`;
}

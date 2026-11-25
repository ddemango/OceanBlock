// Seasonal and holiday pictures: which ones belong to today's date.
import type { Activity } from '../content/types';

const md = (d: Date) => `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** True when `date` falls inside the MM-DD window (inclusive). Windows may wrap past New Year (12-01 → 02-28). */
export function inSeason(s: { from: string; to: string }, date = new Date()): boolean {
  const t = md(date);
  return s.from <= s.to ? t >= s.from && t <= s.to : t >= s.from || t <= s.to;
}

/** Activities in season today, holidays first (the shortest windows are the most specific). */
export function seasonalNow(all: Activity[], date = new Date()): Activity[] {
  const span = (s: { from: string; to: string }) => {
    const n = (x: string) => Number(x.slice(0, 2)) * 31 + Number(x.slice(3));
    return (n(s.to) - n(s.from) + 12 * 31) % (12 * 31);
  };
  return all.filter((a) => a.season && inSeason(a.season, date)).sort((a, b) => span(a.season!) - span(b.season!));
}

/** A friendly heading, e.g. "Thanksgiving & autumn". */
export function seasonTitle(list: Activity[]): string {
  const labels = [...new Set(list.map((a) => a.season!.label))].slice(0, 2);
  const t = labels.join(' & ');
  return t.charAt(0).toUpperCase() + t.slice(1);
}

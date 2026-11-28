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

/** Pictures count as new for three weeks after they join the library. */
export function isNew(a: Activity, date = new Date()): boolean {
  if (!a.added) return false;
  const days = (date.getTime() - new Date(a.added + 'T00:00:00').getTime()) / 86400000;
  return days >= -1 && days <= 21;
}

/** Newest pictures first, mixing puzzle, paint and find so the row is varied. */
export function newest(all: Activity[], limit: number, date = new Date()): Activity[] {
  const fresh = all.filter((a) => isNew(a, date)).sort((a, b) => (b.added! > a.added! ? 1 : b.added! < a.added! ? -1 : 0));
  const by = { puzzle: fresh.filter((a) => a.mode === 'puzzle'), paint: fresh.filter((a) => a.mode === 'paint'), find: fresh.filter((a) => a.mode === 'find') };
  const out: Activity[] = [];
  for (let i = 0; out.length < limit && (by.puzzle[i] || by.paint[i] || by.find[i]); i++) for (const m of ['paint', 'find', 'puzzle'] as const) if (by[m][i] && out.length < limit) out.push(by[m][i]);
  return out;
}

/** Days in a row the app has been opened, ending today (or yesterday, so a streak is not lost before today's visit counts). */
export function streak(days: string[], date = new Date()): number {
  const set = new Set(days);
  const key = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const d = new Date(date);
  if (!set.has(key(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(key(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

import type { Activity, Mode } from '../content/types';

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

/** The same valid activity for a given local calendar date and mode, every time. */
export function dailyPick(activities: Activity[], mode: Mode, date: string): Activity | undefined {
  const pool = activities.filter((a) => a.mode === mode).sort((a, b) => a.id.localeCompare(b.id));
  if (!pool.length) return undefined;
  // days since epoch keeps consecutive days from repeating while the pool has 2+ entries
  const [y, m, d] = date.split('-').map(Number);
  const day = Math.floor(Date.UTC(y, m - 1, d) / 86400000);
  return pool[(day + hash(mode)) % pool.length];
}

/** A stable, date-seeded ordering used for recommendations. */
export function shuffledFor(activities: Activity[], date: string): Activity[] {
  return [...activities].sort((a, b) => hash(a.id + date) - hash(b.id + date));
}

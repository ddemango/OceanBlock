import { describe, expect, it } from 'vitest';
import { ACTIVITIES } from '../src/content/catalog';
import { inSeason, isNew, newest, seasonalNow, seasonTitle, streak } from '../src/lib/season';

const day = (m: number, d: number) => new Date(2026, m - 1, d, 12);

describe('seasons', () => {
  it('handles ordinary and New Year–wrapping windows', () => {
    expect(inSeason({ from: '11-01', to: '11-30' }, day(11, 25))).toBe(true);
    expect(inSeason({ from: '11-01', to: '11-30' }, day(12, 1))).toBe(false);
    expect(inSeason({ from: '12-01', to: '02-28' }, day(1, 15))).toBe(true);
    expect(inSeason({ from: '12-01', to: '02-28' }, day(12, 24))).toBe(true);
    expect(inSeason({ from: '12-01', to: '02-28' }, day(3, 2))).toBe(false);
  });
  it('always has something in season, every day of the year', () => {
    for (let m = 1; m <= 12; m++) for (const d of [1, 10, 20, 28]) expect(seasonalNow(ACTIVITIES, day(m, d)).length, `${m}-${d}`).toBeGreaterThan(0);
  });
  it('puts the holiday first in late November', () => {
    const now = seasonalNow(ACTIVITIES, day(11, 25));
    expect(now[0].season!.label).toBe('Thanksgiving');
    expect(seasonTitle(now)).toBe('Thanksgiving & autumn');
  });
  it('marks pictures new for three weeks and mixes the newest by activity', () => {
    const a = ACTIVITIES.find((x) => x.added)!;
    const [y, m, d] = a.added!.split('-').map(Number);
    expect(isNew(a, new Date(y, m - 1, d + 5))).toBe(true);
    expect(isNew(a, new Date(y, m - 1, d + 30))).toBe(false);
    expect(isNew(ACTIVITIES.find((x) => !x.added)!)).toBe(false);
    const row = newest(ACTIVITIES, 9, new Date(y, m - 1, d + 1));
    expect(row.length).toBe(9);
    expect(new Set(row.slice(0, 3).map((x) => x.mode)).size).toBe(3);
  });
  it('counts days in a row, forgiving a day not yet visited', () => {
    expect(streak(['2026-11-24', '2026-11-25', '2026-11-26'], day(11, 26))).toBe(3);
    expect(streak(['2026-11-24', '2026-11-25'], day(11, 26))).toBe(2);
    expect(streak(['2026-11-20', '2026-11-26'], day(11, 26))).toBe(1);
    expect(streak([], day(11, 26))).toBe(0);
  });
});

import { describe, expect, it } from 'vitest';
import { ACTIVITIES } from '../src/content/catalog';
import { inSeason, seasonalNow, seasonTitle } from '../src/lib/season';

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
});

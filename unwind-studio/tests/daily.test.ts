import { describe, expect, it } from 'vitest';
import { ACTIVITIES } from '../src/content/catalog';
import { dailyPick, shuffledFor } from '../src/lib/daily';

describe('daily picks', () => {
  it('are deterministic, valid and per mode', () => {
    for (const mode of ['puzzle', 'paint', 'find'] as const) {
      const a = dailyPick(ACTIVITIES, mode, '2026-11-24'), b = dailyPick(ACTIVITIES, mode, '2026-11-24');
      expect(a).toBeDefined();
      expect(a).toBe(b);
      expect(a!.mode).toBe(mode);
      expect(ACTIVITIES).toContain(a);
    }
  });
  it('rotate from day to day', () => {
    const ids = new Set(['2026-11-24', '2026-11-25', '2026-11-26'].map((d) => dailyPick(ACTIVITIES, 'puzzle', d)!.id));
    expect(ids.size).toBe(3);
  });
  it('recommendations are a stable permutation', () => {
    const a = shuffledFor(ACTIVITIES, '2026-11-24');
    expect(a).toEqual(shuffledFor(ACTIVITIES, '2026-11-24'));
    expect([...a].sort((x, y) => x.id.localeCompare(y.id))).toEqual([...ACTIVITIES].sort((x, y) => x.id.localeCompare(y.id)));
  });
});

import { describe, expect, it } from 'vitest';
import { ACTIVITIES, COLLECTIONS } from '../src/content/catalog';
import { validateCatalog } from '../src/content/validate';
import { buildFindGeometry, hitTarget } from '../src/engine/find/geometry';
import { targetsOf } from '../src/engine/find/state';
import { buildPaintGeometry } from '../src/engine/paint/geometry';

describe('bundled content', () => {
  it('passes manifest validation with no errors', () => {
    const errors = validateCatalog(ACTIVITIES, COLLECTIONS).filter((i) => i.level === 'error');
    expect(errors).toEqual([]);
  });

  it('ships at least 15 puzzles, 15 paintings and 15 scenes, every collection with all three', () => {
    for (const mode of ['puzzle', 'paint', 'find'] as const) expect(ACTIVITIES.filter((a) => a.mode === mode).length).toBeGreaterThanOrEqual(15);
    expect(COLLECTIONS.length).toBeGreaterThanOrEqual(7);
    for (const c of COLLECTIONS) {
      const modes = new Set(c.activityIds.map((id) => ACTIVITIES.find((a) => a.id === id)!.mode));
      expect([...modes].sort()).toEqual(['find', 'paint', 'puzzle']);
    }
  });

  it('turns every scene into a jigsaw of exactly the same artwork', () => {
    for (const f of ACTIVITIES) if (f.mode === 'find') {
      const j = ACTIVITIES.find((a) => a.id === `${f.id}-jigsaw`);
      expect(j?.mode).toBe('puzzle');
      if (j?.mode === 'puzzle') expect(j.art.shapes.length).toBe(f.items.reduce((n, i) => n + i.shapes.length, 0));
    }
  });

  it('has no placeholder content left', () => {
    for (const a of ACTIVITIES) expect(a.title, a.id).not.toBe('Placeholder');
  });

  it('every paint region can be reached by tapping its own label', () => {
    for (const a of ACTIVITIES) if (a.mode === 'paint') {
      const g = buildPaintGeometry(a.regions);
      a.regions.forEach((r, i) => expect(g.regionAt(g.labels[i].x, g.labels[i].y), `${a.id}/${r.id}`).toBe(i));
    }
  });

  it('every hidden object can be found by tapping its own artwork', () => {
    for (const a of ACTIVITIES) if (a.mode === 'find') {
      const g = buildFindGeometry(a.items);
      const found = new Set<string>();
      for (const t of targetsOf(a)) {
        const gi = g.items[a.items.indexOf(t)];
        let ok = false;
        for (let y = gi.box.y0; y <= gi.box.y1 && !ok; y += 2) for (let x = gi.box.x0; x <= gi.box.x1 && !ok; x += 2) ok = hitTarget(g, a.items, x, y, 0, found) === t.id;
        expect(ok, `${a.id}/${t.id}`).toBe(true);
      }
    }
  });
});

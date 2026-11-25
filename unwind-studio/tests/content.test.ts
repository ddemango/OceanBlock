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

  it('ships three collections, each with a puzzle, a painting and a scene', () => {
    expect(COLLECTIONS).toHaveLength(3);
    expect(ACTIVITIES).toHaveLength(9);
    for (const c of COLLECTIONS) {
      const modes = c.activityIds.map((id) => ACTIVITIES.find((a) => a.id === id)!.mode).sort();
      expect(modes).toEqual(['find', 'paint', 'puzzle']);
    }
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

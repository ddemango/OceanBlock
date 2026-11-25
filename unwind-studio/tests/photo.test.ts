import { describe, expect, it } from 'vitest';
import { isClosedSingle } from '../src/art/geometry';
import { ACTIVITIES } from '../src/content/catalog';
import type { FindActivity, PaintActivity } from '../src/content/types';
import { buildFindGeometry, visibleFraction } from '../src/engine/find/geometry';
import { buildPaintGeometry } from '../src/engine/paint/geometry';
import { fillRegion, isComplete, newPaint } from '../src/engine/paint/state';
import { buildCreation, creationActivities, creationCollection, isCreation } from '../src/photo/creation';
import { objectPool } from '../src/photo/hide';
import { PAINT_PRESETS, colorName, paintify, type Pixels } from '../src/photo/paintify';

/** A noisy synthetic "photo": sky gradient, sun, hills, a striped field and some noise. */
function fakePhoto(w: number, h: number, seed = 1): Pixels {
  const data = new Uint8ClampedArray(w * h * 4);
  let s = seed;
  const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const u = x / w, v = y / h;
    let r = 120 + 100 * v, g = 170 + 50 * v, b = 235 - 40 * v; // sky
    if (Math.hypot(u - 0.72, v - 0.22) < 0.1) { r = 255; g = 214; b = 90; } // sun
    const hill = 0.55 + 0.08 * Math.sin(u * 7);
    if (v > hill) { r = 70; g = 140 + 30 * Math.sin(u * 20); b = 60; } // hills
    if (v > 0.78) { const stripe = Math.floor(u * 12) % 2; r = stripe ? 200 : 150; g = stripe ? 120 : 60; b = 50; } // field
    if (Math.hypot(u - 0.25, v - 0.7) < 0.06) { r = 230; g = 40; b = 60; } // a red barn-ish blob
    const n = (rnd() - 0.5) * 30;
    const i = (y * w + x) * 4;
    data[i] = r + n; data[i + 1] = g + n; data[i + 2] = b + n; data[i + 3] = 255;
  }
  return { width: w, height: h, data };
}

const resize = (grid: number, aspect: number): [number, number] => (aspect >= 1 ? [grid, Math.round(grid / aspect)] : [Math.round(grid * aspect), grid]);

describe('photo paint-by-number', () => {
  for (const [level, p] of Object.entries(PAINT_PRESETS)) {
    for (const aspect of [4 / 3, 3 / 4]) {
      it(`${level} at ${aspect.toFixed(2)}: every area is a closed outline with a visible, tappable number`, () => {
        const [w, h] = resize(p.grid, aspect);
        const t0 = performance.now();
        const r = paintify(fakePhoto(w, h), { colors: p.colors, minArea: p.minArea, maxRegions: p.maxRegions, scale: 800 / p.grid, seed: 3 });
        const t1 = performance.now();
        expect(r.regions.length).toBeGreaterThan(5);
        expect(r.regions.length).toBeLessThanOrEqual(p.maxRegions);
        expect(r.palette.length).toBeLessThanOrEqual(p.colors);
        const pal = new Set(r.palette.map((c) => c.id));
        for (const reg of r.regions) {
          expect(isClosedSingle(reg.d)).toBe(true);
          expect(pal.has(reg.color)).toBe(true);
        }
        // every palette colour is used
        expect(new Set(r.regions.map((x) => x.color)).size).toBe(r.palette.length);
        const g = buildPaintGeometry(r.regions);
        const t2 = performance.now();
        r.regions.forEach((reg, i) => {
          expect(g.labels[i].r, `label room for ${reg.id}`).toBeGreaterThan(2);
          // tapping the number fills this area, not a neighbour
          expect(g.regionAt(g.labels[i].x, g.labels[i].y)).toBe(i);
        });
        // the whole picture is covered: no paper peeks through
        for (let y = 2; y < r.height; y += 7) for (let x = 2; x < r.width; x += 7) expect(g.regionAt(x, y), `covered at ${x},${y}`).toBeGreaterThanOrEqual(0);
        expect(t1 - t0, 'conversion time').toBeLessThan(1500);
        expect(t2 - t1, 'geometry time').toBeLessThan(2500);
      });
    }
  }

  it('can be completed by filling every area with its own colour', () => {
    const r = paintify(fakePhoto(132, 99), { colors: 12, minArea: 34, maxRegions: 130, scale: 6, seed: 1 });
    const a = { id: 'x', version: 1, mode: 'paint', title: 'x', blurb: '', collectionId: 'x', categories: [], difficulty: 'Moderate', ...r } as PaintActivity;
    let s = newPaint('pbn');
    for (const reg of a.regions) s = fillRegion(s, a, reg.id, reg.color).state;
    expect(isComplete(s, a)).toBe(true);
  });

  it('names colours in plain words', () => {
    expect(colorName(255, 255, 255)).toBe('White');
    expect(colorName(20, 20, 20)).toBe('Black');
    expect(colorName(40, 90, 200)).toMatch(/blue/i);
    expect(colorName(40, 150, 60)).toMatch(/green/i);
    expect(colorName(110, 60, 20)).toMatch(/brown/i);
  });
});

describe('photo hidden objects and creations', () => {
  const scenes = ACTIVITIES.filter((a): a is FindActivity => a.mode === 'find');
  const pool = objectPool(scenes);

  it('draws on a large pool of distinct named objects', () => {
    expect(pool.length).toBeGreaterThan(80);
    expect(new Set(pool.map((p) => p.name.toLowerCase())).size).toBe(pool.length);
  });

  for (const difficulty of ['Relaxed', 'Moderate', 'Detailed'] as const) {
    for (const aspect of [1.5, 0.75]) {
      it(`${difficulty} at ${aspect}: objects are inside the photo, apart, uniquely named and fully visible`, () => {
        const [w, h] = resize(PAINT_PRESETS[difficulty].grid, aspect);
        const c = buildCreation({ id: `photo-test-${difficulty}-${aspect}`, title: 'Test', difficulty, image: 'data:image/jpeg;base64,AAAA', aspect, grid: fakePhoto(w, h), pool });
        expect(isCreation(c)).toBe(true);
        const [puzzle, paint, find] = creationActivities(c);
        expect(puzzle.mode).toBe('puzzle');
        expect(paint.mode).toBe('paint');
        const f = find as FindActivity;
        const want = { Relaxed: 8, Moderate: 12, Detailed: 16 }[difficulty];
        expect(f.items.length).toBe(want);
        expect(new Set(f.items.map((i) => i.name)).size).toBe(want);
        const geom = buildFindGeometry(f.items);
        geom.items.forEach((g, i) => {
          expect(g.box.x0).toBeGreaterThanOrEqual(0);
          expect(g.box.y0).toBeGreaterThanOrEqual(0);
          expect(g.box.x1).toBeLessThanOrEqual(f.width);
          expect(g.box.y1).toBeLessThanOrEqual(f.height);
          expect(visibleFraction(geom, i)).toBeGreaterThan(0.95);
          // big enough to tap: at least ~3% of the shorter side
          expect(Math.max(g.box.x1 - g.box.x0, g.box.y1 - g.box.y0)).toBeGreaterThan(Math.min(f.width, f.height) * 0.03);
        });
        const col = creationCollection(c);
        expect(col.activityIds).toEqual([puzzle.id, paint.id, find.id]);
      });
    }
  }

  it('rejects damaged records', () => {
    expect(isCreation(null)).toBe(false);
    expect(isCreation({ v: 1, id: 'photo-x' })).toBe(false);
  });
});

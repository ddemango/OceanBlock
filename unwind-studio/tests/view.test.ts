import { describe, expect, it } from 'vitest';
import { clampView, fitView, restoreView, saveView, toScreen, toWorld, zoomAt, type View } from '../src/engine/view';
import { flattenPath, parsePath, pointInPoly, transformPath } from '../src/art/geometry';
import { ellipse, rect, xf } from '../src/art/kit';

const world = { x: 0, y: 0, w: 1200, h: 1500 };

describe('view transform', () => {
  it('screen → world is the exact inverse of world → screen', () => {
    const v: View = { s: 0.37, x: -112.5, y: 48.25 };
    for (const [x, y] of [[0, 0], [1200, 1500], [333.3, 987.6], [-50, 20]]) {
      const s = toScreen(v, x, y);
      const w = toWorld(v, s.x, s.y);
      expect(w.x).toBeCloseTo(x, 9);
      expect(w.y).toBeCloseTo(y, 9);
    }
  });
  it('fit centres the world in the viewport', () => {
    const v = fitView(world, 390, 600, 10);
    const tl = toScreen(v, 0, 0), br = toScreen(v, 1200, 1500);
    expect(tl.x).toBeCloseTo(390 - br.x);
    expect(tl.y).toBeCloseTo(600 - br.y);
    expect(Math.min(tl.x, tl.y)).toBeCloseTo(10);
  });
  it('zoom keeps the anchor point fixed and respects limits', () => {
    const v = fitView(world, 800, 600);
    const before = toWorld(v, 250, 410);
    const z = zoomAt(v, 250, 410, 3.3, 0.1, 20);
    const after = toWorld(z, 250, 410);
    expect(after.x).toBeCloseTo(before.x, 9);
    expect(after.y).toBeCloseTo(before.y, 9);
    expect(zoomAt(v, 0, 0, 1e6, 0.1, 5).s).toBe(5);
    expect(zoomAt(v, 0, 0, 1e-6, 0.1, 5).s).toBe(0.1);
  });
  it('a world point stays put across zoom, pan and viewport resize when saved and restored', () => {
    let v = fitView(world, 390, 600);
    v = zoomAt(v, 100, 200, 4, 0.05, 30);
    v = { ...v, x: v.x - 57, y: v.y + 91 };
    const saved = saveView(v, world, 390, 600);
    const r = restoreView(saved, world, 1024, 768);
    const c = toWorld(r, 512, 384);
    expect(c.x).toBeCloseTo(saved.cx, 9);
    expect(c.y).toBeCloseTo(saved.cy, 9);
    expect(r.s / fitView(world, 1024, 768).s).toBeCloseTo(4, 9);
    // identical viewport → identical view
    const same = restoreView(saved, world, 390, 600);
    expect(same.s).toBeCloseTo(v.s, 9);
    expect(same.x).toBeCloseTo(v.x, 6);
    expect(same.y).toBeCloseTo(v.y, 6);
  });
  it('clamping never loses the artwork', () => {
    const v = clampView({ s: 1, x: 99999, y: -99999 }, world, 800, 600, 80);
    expect(toScreen(v, 0, 0).x).toBeLessThanOrEqual(800 - 80);
    expect(toScreen(v, 0, 1500).y).toBeGreaterThanOrEqual(80);
  });
});

describe('path geometry', () => {
  it('parses, flattens and hit-tests curves', () => {
    const d = ellipse(50, 50, 40, 20);
    const poly = flattenPath(d)[0];
    expect(pointInPoly(poly, 50, 50)).toBe(true);
    expect(pointInPoly(poly, 88, 50)).toBe(true);
    expect(pointInPoly(poly, 50, 72)).toBe(false);
    expect(pointInPoly(poly, 85, 68)).toBe(false);
  });
  it('transforms paths', () => {
    const d = xf(rect(0, 0, 10, 20), { s: 2, rot: 90, x: 100, y: 50 });
    const poly = flattenPath(d)[0];
    expect(pointInPoly(poly, 80, 60)).toBe(true); // (10,10)*2 rotated 90° → (-20,20) + (100,50)
    expect(pointInPoly(poly, 110, 60)).toBe(false);
    expect(transformPath('M0 0L10 0', [1, 0, 0, 1, 5, 5])).toBe('M5 5L15 5');
  });
  it('supports H and V and rejects arcs and relative commands', () => {
    expect(parsePath('M0 0H10V10Z').map((c) => c.c).join('')).toBe('MLLZ');
    expect(() => parsePath('M0 0A5 5 0 0 1 10 10')).toThrow();
    expect(() => parsePath('M0 0l5 5')).toThrow();
  });
});

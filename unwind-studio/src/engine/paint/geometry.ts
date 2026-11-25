// Region geometry for paint artworks: hit testing and label placement.
// Regions overlap in painter's order; the visible part of a region is whatever
// later regions do not cover. Everything here is pure and runs in Node too.
import { bboxOf, boxesOverlap, flattenPath, inBox, pointInPoly, type BBox, type Poly } from '../../art/geometry';
import type { PaintRegion } from '../../content/types';

export interface RegionLabel { x: number; y: number; /** clear radius around the label, in artwork units */ r: number }

export interface PaintGeometry {
  polys: Poly[];
  boxes: BBox[];
  labels: RegionLabel[];
  /** Index of the topmost region at a point, or -1. */
  regionAt(x: number, y: number): number;
}

const DIRS: [number, number][] = [];
for (let i = 0; i < 12; i++) DIRS.push([Math.cos((i * Math.PI) / 6), Math.sin((i * Math.PI) / 6)]);

export function buildPaintGeometry(regions: PaintRegion[]): PaintGeometry {
  const polys = regions.map((r) => flattenPath(r.d)[0] ?? []);
  const boxes = polys.map((p) => bboxOf([p]));
  const n = regions.length;
  const inside = (i: number, x: number, y: number) => inBox(boxes[i], x, y) && pointInPoly(polys[i], x, y);
  const above: number[][] = boxes.map((b, i) => {
    const out: number[] = [];
    for (let j = i + 1; j < n; j++) if (boxesOverlap(b, boxes[j])) out.push(j);
    return out;
  });
  const visible = (i: number, x: number, y: number) => {
    if (!inside(i, x, y)) return false;
    for (const j of above[i]) if (inside(j, x, y)) return false;
    return true;
  };
  const regionAt = (x: number, y: number) => {
    for (let i = n - 1; i >= 0; i--) if (inside(i, x, y)) return i;
    return -1;
  };

  const labels: RegionLabel[] = regions.map((reg, i) => {
    const b = boxes[i];
    const w = b.x1 - b.x0, h = b.y1 - b.y0;
    const maxR = Math.max(w, h) / 2;
    const clearance = (x: number, y: number, dr: number) => {
      let r = 0;
      for (let k = 1; k * dr <= maxR; k++) {
        const rr = k * dr;
        for (const [dx, dy] of DIRS) if (!visible(i, x + dx * rr, y + dy * rr)) return r;
        r = rr;
      }
      return r;
    };
    if (reg.label) {
      const [x, y] = reg.label;
      return visible(i, x, y) ? { x, y, r: Math.max(0.5, clearance(x, y, 0.5)) } : { x, y, r: 0 };
    }
    const step = Math.max(Math.max(w, h) / 22, 0.6);
    let best: RegionLabel = { x: (b.x0 + b.x1) / 2, y: (b.y0 + b.y1) / 2, r: -1 };
    const scan = (x0: number, y0: number, x1: number, y1: number, st: number, dr: number) => {
      for (let y = y0; y <= y1; y += st) for (let x = x0; x <= x1; x += st) {
        if (!visible(i, x, y)) continue;
        const r = clearance(x, y, dr);
        if (r > best.r) best = { x, y, r };
      }
    };
    scan(b.x0 + step / 2, b.y0 + step / 2, b.x1, b.y1, step, step / 2);
    if (best.r >= 0) {
      const c = best;
      scan(c.x - step, c.y - step, c.x + step, c.y + step, step / 4, Math.max(step / 6, 0.25));
    }
    return { x: Math.round(best.x * 10) / 10, y: Math.round(best.y * 10) / 10, r: Math.max(0, best.r) };
  });

  return { polys, boxes, labels, regionAt };
}

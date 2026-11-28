// Hit geometry for hidden-object scenes, in scene coordinates. Pure; runs in Node too.
import { bboxOf, distToPoly, flattenPath, inBox, pointInPoly, type BBox, type Poly } from '../../art/geometry';
import type { FindItem } from '../../content/types';

export interface ItemGeometry {
  /** Filled subpaths (clickable interiors). */
  filled: Poly[];
  /** Every subpath, used for edge-distance tolerance (covers thin stroked details). */
  outlines: Poly[];
  box: BBox;
}

export interface FindGeometry { items: ItemGeometry[] }

export function buildFindGeometry(items: FindItem[]): FindGeometry {
  return {
    items: items.map((item) => {
      const filled: Poly[] = [];
      const outlines: Poly[] = [];
      for (const s of item.shapes) {
        const polys = flattenPath(s.d, 8);
        outlines.push(...polys);
        if (s.fill && s.fill !== 'none' && (s.opacity ?? 1) > 0.25) filled.push(...polys);
      }
      return { filled, outlines, box: bboxOf(outlines) };
    }),
  };
}

export function itemHit(g: ItemGeometry, x: number, y: number, tol: number): boolean {
  if (!inBox(g.box, x, y, tol)) return false;
  for (const p of g.filled) if (pointInPoly(p, x, y)) return true;
  for (const p of g.outlines) if (distToPoly(p, x, y) <= tol) return true;
  return false;
}

/**
 * The target hit by a point: the topmost not-yet-found target whose shape
 * contains the point (within `tol` scene units). Found targets are skipped so
 * overlapping targets resolve the same way every time.
 */
export function hitTarget(geom: FindGeometry, items: FindItem[], x: number, y: number, tol: number, found: ReadonlySet<string>): string | null {
  for (let i = items.length - 1; i >= 0; i--) {
    const it = items[i];
    if (!it.target || !it.id || found.has(it.id)) continue;
    if (itemHit(geom.items[i], x, y, tol)) return it.id;
  }
  return null;
}

/** Fraction (0..1) of a target's filled area that is not covered by later items. */
export function visibleFraction(geom: FindGeometry, index: number): number {
  const g = geom.items[index];
  const b = g.box;
  const step = Math.max((b.x1 - b.x0) / 24, (b.y1 - b.y0) / 24, 0.5);
  let total = 0, vis = 0;
  for (let y = b.y0 + step / 2; y < b.y1; y += step) for (let x = b.x0 + step / 2; x < b.x1; x += step) {
    if (!g.filled.some((p) => pointInPoly(p, x, y))) continue;
    total++;
    let covered = false;
    for (let j = index + 1; j < geom.items.length && !covered; j++) {
      const o = geom.items[j];
      if (inBox(o.box, x, y) && o.filled.some((p) => pointInPoly(p, x, y))) covered = true;
    }
    if (!covered) vis++;
  }
  return total ? vis / total : 0;
}

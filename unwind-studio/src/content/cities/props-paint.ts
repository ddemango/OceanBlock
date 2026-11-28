// Shared drawing helpers for the City Lights paint-by-number artworks.
import { poly, xf } from '../../art/kit';
import type { PaintRegion } from '../types';

export type Pt = [number, number];
export const n = (v: number) => String(Math.round(v * 10) / 10);
export const M = (x: number, y: number) => `M${n(x)} ${n(y)}`;
export const L = (x: number, y: number) => `L${n(x)} ${n(y)}`;
export const Q = (cx: number, cy: number, x: number, y: number) => `Q${n(cx)} ${n(cy)} ${n(x)} ${n(y)}`;
export const C = (a: number, b: number, c: number, d: number, x: number, y: number) => `C${n(a)} ${n(b)} ${n(c)} ${n(d)} ${n(x)} ${n(y)}`;

export const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

/** Region collector. */
export function collector() {
  const regions: PaintRegion[] = [];
  const R = (id: string, d: string, color: string, label?: [number, number]) => {
    regions.push(label ? { id, d, color, label } : { id, d, color });
  };
  return { regions, R };
}

/** A tower silhouette from a list of [x, topY] steps, standing on `base`. */
export function steps(pts: Pt[], base: number): string {
  const out: Pt[] = [[pts[0][0], base]];
  for (let i = 0; i < pts.length; i++) {
    const [x, y] = pts[i];
    out.push([x, y]);
    const nx = i + 1 < pts.length ? pts[i + 1][0] : null;
    if (nx !== null) out.push([nx, y]);
  }
  out.push([pts[pts.length - 1][0], base]);
  return poly(out);
}

/** A soft, wobbly vertical reflection streak below (cx, y0). */
export function reflection(cx: number, y0: number, y1: number, w: number, wob = 6): string {
  const k = 6, left: Pt[] = [], right: Pt[] = [];
  for (let i = 0; i <= k; i++) {
    const t = i / k, y = y0 + (y1 - y0) * t, ww = w * (1 - 0.55 * t) / 2, o = (i % 2 ? wob : -wob) * t;
    left.push([cx - ww + o, y]);
    right.push([cx + ww + o, y]);
  }
  return poly([...left, ...right.reverse()]);
}

/** A slanted quad: x0..x1 along a street whose kerb is y = a + b·x, from `up` above to `down` below the kerb. */
export function slopeQuad(a: number, b: number, x0: number, x1: number, up: number, down: number): string {
  const y = (x: number) => a + b * x;
  return poly([[x0, y(x0) - up], [x1, y(x1) - up], [x1, y(x1) + down], [x0, y(x0) + down]]);
}

/** Umbrella canopy (scalloped dome) of radius r, centred at (cx, cy) on its rim, tilted by rot degrees. */
export function umbrella(cx: number, cy: number, r: number, rot = 0): string {
  let d = M(-r, 0) + C(-r, -r * 0.95, r, -r * 0.95, r, 0);
  const k = 4, w = (2 * r) / k;
  for (let i = 0; i < k; i++) {
    const x0 = r - i * w, x1 = x0 - w;
    d += Q((x0 + x1) / 2, -r * 0.16, x1, 0);
  }
  return xf(d + 'Z', { rot, x: cx, y: cy });
}

/** One panel of an umbrella canopy between fractions u0..u1 of its width. */
export function umbrellaPanel(cx: number, cy: number, r: number, u0: number, u1: number, rot = 0): string {
  const top = (u: number): Pt => {
    const x = -r + 2 * r * u;
    // approximate the dome top as an ellipse of height 0.72r
    const yy = -0.72 * r * Math.sqrt(Math.max(0, 1 - (x / r) ** 2));
    return [x, yy];
  };
  const pts: Pt[] = [];
  for (let i = 0; i <= 6; i++) pts.push(top(u0 + ((u1 - u0) * i) / 6));
  const xa = -r + 2 * r * u1, xb = -r + 2 * r * u0;
  return xf(poly(pts).replace(/Z$/, '') + L(xa, 0) + Q((xa + xb) / 2, -r * 0.16, xb, 0) + 'Z', { rot, x: cx, y: cy });
}

/** A standing figure in a long coat (head excluded), feet at (cx, feet). */
export function coat(cx: number, top: number, feet: number, w: number): string {
  const h = feet - top;
  return poly([
    [cx - w * 0.36, top], [cx + w * 0.36, top], [cx + w * 0.5, top + h * 0.22], [cx + w * 0.56, top + h * 0.8],
    [cx + w * 0.2, top + h * 0.8], [cx + w * 0.2, feet], [cx + w * 0.04, feet], [cx + w * 0.02, top + h * 0.8],
    [cx - w * 0.02, top + h * 0.8], [cx - w * 0.04, feet], [cx - w * 0.2, feet], [cx - w * 0.2, top + h * 0.8],
    [cx - w * 0.56, top + h * 0.8], [cx - w * 0.5, top + h * 0.22],
  ]);
}

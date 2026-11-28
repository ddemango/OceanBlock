// Shared drawing helpers for The Great Outdoors paint-by-number artworks.
import { blob, curve, poly, xf } from '../../art/kit';
import type { PaintRegion } from '../types';

export type Pt = [number, number];
const n = (v: number) => String(Math.round(v * 10) / 10);

/** Region collector. Pass `label` for long thin regions where the automatic placement struggles. */
export function collector() {
  const regions: PaintRegion[] = [];
  const R = (id: string, d: string, color: string, label?: [number, number]) => {
    regions.push(label ? { id, d, color, label } : { id, d, color });
  };
  return { regions, R };
}

/** Straight-edged skyline through `pts` (left to right), filled down to `bottom`. */
export function band(pts: Pt[], bottom: number): string {
  return poly([...pts, [pts[pts.length - 1][0], bottom], [pts[0][0], bottom]]);
}

/** Smooth skyline through `pts` (left to right), filled down to `bottom`. */
export function softBand(pts: Pt[], bottom: number, tension = 0.7): string {
  const a = pts[0], b = pts[pts.length - 1];
  return curve(pts, tension) + `L${n(b[0])} ${n(bottom)}L${n(a[0])} ${n(bottom)}Z`;
}

/** Skyline sampled from y = fy(x), filled down to `bottom`. */
export function ridge(fy: (x: number) => number, x0: number, x1: number, bottom: number, step = 20): string {
  const pts: Pt[] = [];
  for (let x = x0; x < x1; x += step) pts.push([x, fy(x)]);
  pts.push([x1, fy(x1)]);
  return band(pts, bottom);
}

/** A distant row of conifers: saw-tooth tops following y = fy(x), filled down to `bottom`. */
export function treeline(x0: number, x1: number, fy: (x: number) => number, toothW: number, toothH: number, bottom: number, seed = 0): string {
  const pts: Pt[] = [];
  const k = Math.max(1, Math.round((x1 - x0) / toothW)), w = (x1 - x0) / k;
  for (let i = 0; i < k; i++) {
    const x = x0 + i * w, v = 0.62 + 0.38 * Math.abs(Math.sin(i * 2.3 + seed));
    pts.push([x, fy(x)], [x + w * 0.5, fy(x + w * 0.5) - toothH * v]);
  }
  pts.push([x1, fy(x1)]);
  return band(pts, bottom);
}

/** Clip a polygon to the rectangle x0..x1, y0..y1. */
export function clipRect(pts: Pt[], x0: number, y0: number, x1: number, y1: number): Pt[] {
  const edges: [(p: Pt) => boolean, (a: Pt, b: Pt) => Pt][] = [
    [(p) => p[0] >= x0, (a, b) => [x0, a[1] + ((b[1] - a[1]) * (x0 - a[0])) / (b[0] - a[0])]],
    [(p) => p[0] <= x1, (a, b) => [x1, a[1] + ((b[1] - a[1]) * (x1 - a[0])) / (b[0] - a[0])]],
    [(p) => p[1] >= y0, (a, b) => [a[0] + ((b[0] - a[0]) * (y0 - a[1])) / (b[1] - a[1]), y0]],
    [(p) => p[1] <= y1, (a, b) => [a[0] + ((b[0] - a[0]) * (y1 - a[1])) / (b[1] - a[1]), y1]],
  ];
  let out = pts;
  for (const [inside, cut] of edges) {
    const src = out;
    out = [];
    for (let i = 0; i < src.length; i++) {
      const a = src[i], b = src[(i + 1) % src.length];
      if (inside(a)) { out.push(a); if (!inside(b)) out.push(cut(a, b)); }
      else if (inside(b)) out.push(cut(a, b));
    }
  }
  return out;
}

const halfAt = (w: number, i: number, tiers: number) => (w / 2) * (0.26 + (0.74 * i) / tiers);

/** A conifer as one saw-edged silhouette: tip at base - h, widest (w) at the base. `clip` = [width, height] of the canvas. */
export function pine(cx: number, base: number, h: number, w: number, tiers = 4, clip?: [number, number]): string {
  const right: Pt[] = [];
  for (let i = 1; i <= tiers; i++) {
    const y = base - h + (h * i) / tiers, hw = halfAt(w, i, tiers);
    right.push([cx + hw, y]);
    if (i < tiers) right.push([cx + hw * 0.46, y - (h / tiers) * 0.2]);
  }
  const left = right.map(([x, y]): Pt => [2 * cx - x, y]).reverse();
  const pts: Pt[] = [[cx, base - h], ...right, ...left];
  return poly(clip ? clipRect(pts, 0, 0, clip[0], clip[1]) : pts);
}

/** The same conifer as separate overlapping boughs, lowest first (draw in order). */
export function pineTiers(cx: number, base: number, h: number, w: number, tiers = 4, clip?: [number, number]): string[] {
  const out: string[] = [];
  const th = h / tiers;
  for (let i = tiers; i >= 1; i--) {
    const ya = base - h + th * (i - 1) - (i > 1 ? th * 0.4 : 0), yb = base - h + th * i, hw = halfAt(w, i, tiers);
    const pts: Pt[] = [
      [cx, ya], [cx + hw, yb], [cx + hw * 0.56, yb - th * 0.1], [cx + hw * 0.2, yb + th * 0.05],
      [cx - hw * 0.2, yb + th * 0.05], [cx - hw * 0.56, yb - th * 0.1], [cx - hw, yb],
    ];
    out.push(poly(clip ? clipRect(pts, 0, 0, clip[0], clip[1]) : pts));
  }
  return out;
}

/** x as a function of y along a top-to-bottom polyline. */
export function xAtY(spine: Pt[]): (y: number) => number {
  return (y) => {
    if (y <= spine[0][1]) return spine[0][0];
    for (let i = 1; i < spine.length; i++) {
      const a = spine[i - 1], b = spine[i];
      if (y <= b[1]) return a[0] + ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]);
    }
    return spine[spine.length - 1][0];
  };
}

/**
 * Ground on one side of a river or trail: the top edge follows y = top(x) from the canvas edge to the
 * river/trail centre line x = spineX(y), then runs down that line to the bottom. Left and right banks
 * meet under the river, so neither is cut in two by it.
 */
export function bank(side: 'l' | 'r', top: (x: number) => number, spineX: (y: number) => number, w: number, h: number): string {
  let yc = top(w / 2);
  for (let i = 0; i < 12; i++) yc = top(spineX(yc));
  const xc = spineX(yc), pts: Pt[] = [];
  if (side === 'l') for (let x = 0; x < xc - 5; x += 25) pts.push([x, top(x)]);
  else for (let x = w; x > xc + 5; x -= 25) pts.push([x, top(x)]);
  pts.push([xc, yc]);
  for (let y = yc + 20; y < h; y += 20) pts.push([spineX(y), y]);
  return poly([...pts, [spineX(h), h], [side === 'l' ? 0 : w, h]]);
}

/** A puffy fair-weather cloud about 230·s wide centred near (cx, cy). */
export function puff(cx: number, cy: number, s: number): string {
  const p: Pt[] = [[-116, 18], [-86, -14], [-38, -16], [-8, -46], [48, -44], [80, -12], [116, 0], [94, 30], [-6, 36], [-86, 38]];
  return blob(p.map(([x, y]): Pt => [cx + x * s, cy + y * s]), 0.9);
}

/** A path of varying width following `spine` (half-width per spine point). */
export function ribbon(spine: Pt[], halfW: number[], tension = 0.6): string {
  const l: Pt[] = [], r: Pt[] = [];
  spine.forEach((p, i) => {
    const a = spine[Math.max(0, i - 1)], b = spine[Math.min(spine.length - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len, ny = dx / len;
    l.push([p[0] + nx * halfW[i], p[1] + ny * halfW[i]]);
    r.push([p[0] - nx * halfW[i], p[1] - ny * halfW[i]]);
  });
  return curve(l, tension) + curve(r.reverse(), tension).replace(/^M/, 'L') + 'Z';
}

type Off = number | ((t: number) => number);

/**
 * A thick curved body (an arch, a trunk) around centre line `center(t)`, t in 0..1, with half-width `half(t)`.
 * Returns a function giving the piece between t0..t1 and between offsets a..b (fractions of the half-width,
 * -1 = one edge, 1 = the other; either may vary with t).
 */
export function tube(center: (t: number) => Pt, half: (t: number) => number) {
  const at = (t: number, o: number): Pt => {
    const e = 0.002, p = center(t), a = center(Math.max(0, t - e)), b = center(Math.min(1, t + e));
    const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
    return [p[0] + (-dy / len) * o * half(t), p[1] + (dx / len) * o * half(t)];
  };
  return (t0: number, t1: number, a: Off, b: Off, steps = 44): string => {
    const fa = typeof a === 'number' ? () => a : a, fb = typeof b === 'number' ? () => b : b;
    const A: Pt[] = [], B: Pt[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = t0 + ((t1 - t0) * i) / steps;
      A.push(at(t, fa(t)));
      B.push(at(t, fb(t)));
    }
    return poly([...A, ...B.reverse()]);
  };
}

/** Mirror a path in the horizontal line y (a reflection in still water); `squash` < 1 shortens it. */
export const flipY = (d: string, y: number, squash = 1) => xf(d, { sy: -squash, oy: y });

/** A long, soft evening cloud centred on (cx, cy). */
export function streak(cx: number, cy: number, w: number, h: number): string {
  return blob([
    [cx - w * 0.5, cy + h * 0.1], [cx - w * 0.32, cy - h * 0.42], [cx - w * 0.1, cy - h * 0.3], [cx + w * 0.12, cy - h * 0.55],
    [cx + w * 0.36, cy - h * 0.22], [cx + w * 0.5, cy + h * 0.12], [cx + w * 0.22, cy + h * 0.42], [cx - w * 0.2, cy + h * 0.4],
  ], 0.9);
}

/** A pointed lens (ripple, glint, sand bar) of length w and thickness h, optionally tilted. */
export function lens(cx: number, cy: number, w: number, h: number, rot = 0): string {
  const d = `M${n(cx - w / 2)} ${n(cy)}Q${n(cx)} ${n(cy - h)} ${n(cx + w / 2)} ${n(cy)}Q${n(cx)} ${n(cy + h)} ${n(cx - w / 2)} ${n(cy)}Z`;
  return rot ? xf(d, { rot, ox: cx, oy: cy }) : d;
}

/** A fan of grass blades rooted at (cx, base). */
export function tuft(cx: number, base: number, w: number, h: number, blades = 5, lean = 0): string {
  const pts: Pt[] = [[cx - w * 0.22, base]];
  for (let i = 0; i < blades; i++) {
    const u = blades === 1 ? 0 : (i / (blades - 1)) * 2 - 1;
    const hh = h * (1 - 0.38 * u * u) * (i % 2 ? 0.86 : 1);
    pts.push([cx + u * w * 0.5 + lean * hh, base - hh]);
    if (i < blades - 1) {
      const um = ((i + 0.5) / (blades - 1)) * 2 - 1;
      pts.push([cx + um * w * 0.2, base - h * 0.3]);
    }
  }
  pts.push([cx + w * 0.22, base]);
  return poly(pts);
}

/** A rounded boulder sitting on (cx, base). */
export function boulder(cx: number, base: number, w: number, h: number): string {
  return blob([
    [cx - w * 0.5, base], [cx - w * 0.42, base - h * 0.6], [cx - w * 0.12, base - h], [cx + w * 0.26, base - h * 0.88],
    [cx + w * 0.5, base - h * 0.34], [cx + w * 0.46, base],
  ], 0.8);
}

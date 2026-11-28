// Shared drawing helpers for the Holiday Traditions paint-by-number artworks.
import { ellipse, poly, xf } from '../../art/kit';
import type { Pt } from '../../art/geometry';
import type { Shape } from '../../art/types';
import type { PaintRegion } from '../types';

export type { Pt };
export const W = 1000, H = 1250;

const n = (v: number) => String(Math.round(v * 10) / 10);
export const M = (x: number, y: number) => `M${n(x)} ${n(y)}`;
export const L = (x: number, y: number) => `L${n(x)} ${n(y)}`;
export const Q = (cx: number, cy: number, x: number, y: number) => `Q${n(cx)} ${n(cy)} ${n(x)} ${n(y)}`;
export const C = (a: number, b: number, c: number, d: number, x: number, y: number) => `C${n(a)} ${n(b)} ${n(c)} ${n(d)} ${n(x)} ${n(y)}`;

/** Region + detail collector. */
export function collector() {
  const regions: PaintRegion[] = [];
  const detail: Shape[] = [];
  const R = (id: string, d: string, color: string, label?: [number, number]) => {
    regions.push(label ? { id, d, color, label } : { id, d, color });
  };
  return { regions, detail, R };
}

export const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

/** Points along a smooth Catmull-Rom curve through pts. */
export function sampleCurve(pts: Pt[], per = 8): Pt[] {
  const out: Pt[] = [];
  const at = (i: number) => pts[Math.max(0, Math.min(pts.length - 1, i))];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    for (let k = 0; k < per; k++) {
      const t = k / per, t2 = t * t, t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

/** A tapered ribbon (stem, branch, handle) along a smooth curve, width w0 → w1. */
export function band(pts: Pt[], w0: number, w1: number, per = 8): string {
  return poly(bandPts(pts, w0, w1, per));
}
export function bandPts(pts: Pt[], w0: number, w1: number, per = 8): Pt[] {
  const s = sampleCurve(pts, per);
  const left: Pt[] = [], right: Pt[] = [];
  s.forEach((p, i) => {
    const a = s[Math.max(0, i - 1)], b = s[Math.min(s.length - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    dx /= len; dy /= len;
    const w = (w0 + (w1 - w0) * (i / (s.length - 1))) / 2;
    left.push([p[0] - dy * w, p[1] + dx * w]);
    right.push([p[0] + dy * w, p[1] - dx * w]);
  });
  return [...left, ...right.reverse()];
}

/** Classic heart, centred on (cx, cy) with total width w and height h. */
export function heart(cx: number, cy: number, w: number, h: number, rot = 0): string {
  const x = w / 2, top = -h * 0.5, bot = h * 0.5, dip = -h * 0.22;
  const d = M(0, dip) + C(x * 0.2, top - h * 0.12, x * 1.05, top - h * 0.08, x, top + h * 0.32) +
    C(x * 0.96, h * 0.12, x * 0.4, h * 0.3, 0, bot) +
    C(-x * 0.4, h * 0.3, -x * 0.96, h * 0.12, -x, top + h * 0.32) +
    C(-x * 1.05, top - h * 0.08, -x * 0.2, top - h * 0.12, 0, dip) + 'Z';
  return xf(d, { rot, x: cx, y: cy });
}

/** A turned vessel (cup, vase, jug) with profile [y, half-width] seen a little from above. */
export function vessel(cx: number, prof: [number, number][], ratio: number) {
  const hw = (y: number) => {
    if (y <= prof[0][0]) return prof[0][1];
    for (let i = 0; i < prof.length - 1; i++) {
      const [y0, v0] = prof[i], [y1, v1] = prof[i + 1];
      if (y <= y1) { const t = (y - y0) / (y1 - y0); const s = t * t * (3 - 2 * t); return v0 + (v1 - v0) * s; }
    }
    return prof[prof.length - 1][1];
  };
  const arc = (y: number, dir: 1 | -1, inset = 0): Pt[] => {
    const pts: Pt[] = [], w = hw(y) - inset;
    for (let i = 0; i <= 18; i++) { const a = (Math.PI * i) / 18; pts.push([cx - dir * Math.cos(a) * w, y + Math.sin(a) * w * ratio]); }
    return pts;
  };
  const side = (ya: number, yb: number, sgn: 1 | -1, inset = 0): Pt[] => {
    const pts: Pt[] = [], k = Math.max(2, Math.ceil(Math.abs(yb - ya) / 5));
    for (let i = 0; i <= k; i++) { const y = ya + ((yb - ya) * i) / k; pts.push([cx + sgn * (hw(y) - inset), y]); }
    return pts;
  };
  const yTop = prof[0][0], yBot = prof[prof.length - 1][0];
  return {
    hw,
    body: () => poly([...arc(yTop, 1), ...side(yTop, yBot, 1).slice(1), ...arc(yBot, -1).slice(1), ...side(yBot, yTop, -1).slice(1, -1)]),
    band: (y1: number, y2: number, inset = 0.8) => poly([...arc(y1, 1, inset), ...side(y1, y2, 1, inset).slice(1), ...arc(y2, -1, inset).slice(1), ...side(y2, y1, -1, inset).slice(1, -1)]),
    opening: (inset = 0) => ellipse(cx, yTop, hw(yTop) - inset, (hw(yTop) - inset) * ratio),
  };
}

// ---------------------------------------------------------------- eggs
/** Half-width of an egg (narrower at the top) at height y (−ry..ry), relative to its centre. */
const eggHW = (rx: number, ry: number, y: number) => {
  const c = Math.max(-1, Math.min(1, -y / ry));
  const s = Math.sqrt(1 - c * c);
  return rx * s * (1 - 0.16 * c);
};
export function egg(cx: number, cy: number, rx: number, ry: number, rot = 0): string {
  const pts: Pt[] = [];
  for (let i = 0; i < 40; i++) {
    const t = (i / 40) * Math.PI * 2, c = Math.cos(t);
    pts.push([rx * Math.sin(t) * (1 - 0.16 * c), -ry * c]);
  }
  return xf(poly(pts), { rot, x: cx, y: cy });
}
/** A decorative band across an egg between y1..y2 (relative to centre); zig > 0 gives a zigzag top edge. */
export function eggBand(cx: number, cy: number, rx: number, ry: number, y1: number, y2: number, rot = 0, zig = 0, inset = 1): string {
  const pts: Pt[] = [];
  const k = 10;
  const w1 = eggHW(rx, ry, y1) - inset, w2 = eggHW(rx, ry, y2) - inset;
  // top edge left → right
  const teeth = 6;
  for (let i = 0; i <= teeth * 2; i++) {
    const x = -w1 + ((2 * w1) * i) / (teeth * 2);
    pts.push([x, y1 + (zig && i % 2 ? zig : 0)]);
  }
  for (let i = 1; i < k; i++) { const y = y1 + ((y2 - y1) * i) / k; pts.push([eggHW(rx, ry, y) - inset, y]); }
  for (let i = teeth * 2; i >= 0; i--) {
    const x = -w2 + ((2 * w2) * i) / (teeth * 2);
    pts.push([x, y2 + (zig && i % 2 ? zig : 0)]);
  }
  for (let i = k - 1; i > 0; i--) { const y = y1 + ((y2 - y1) * i) / k; pts.push([-(eggHW(rx, ry, y) - inset), y]); }
  return xf(poly(pts), { rot, x: cx, y: cy });
}

// ---------------------------------------------------------------- flowers
/** Five-petal blossom outline as one closed shape. */
export function blossom(cx: number, cy: number, r: number, rot = 0, petals = 5): string {
  const pts: Pt[] = [];
  const k = petals * 8;
  for (let i = 0; i < k; i++) {
    const a = (i / k) * Math.PI * 2 + (rot * Math.PI) / 180;
    const ph = (i % 8) / 8;
    const rr = r * (0.55 + 0.45 * Math.sin(Math.PI * ph) ** 0.6);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return poly(pts);
}

/** Tulip cup: outer cup and front petal, base at (x, y), height h, tilted by rot. */
export function tulip(x: number, y: number, h: number, rot = 0) {
  const w = h * 0.42;
  const cup = M(0, 0) + C(-w * 1.25, -h * 0.05, -w * 1.1, -h * 0.75, -w * 0.95, -h) + L(-w * 0.45, -h * 0.72) +
    L(0, -h * 1.02) + L(w * 0.45, -h * 0.72) + L(w * 0.95, -h) + C(w * 1.1, -h * 0.75, w * 1.25, -h * 0.05, 0, 0) + 'Z';
  const front = M(0, -h * 0.02) + C(-w * 0.8, -h * 0.1, -w * 0.62, -h * 0.66, -w * 0.12, -h * 0.9) +
    L(0, -h * 0.78) + L(w * 0.12, -h * 0.9) + C(w * 0.62, -h * 0.66, w * 0.8, -h * 0.1, 0, -h * 0.02) + 'Z';
  return { cup: xf(cup, { rot, x, y }), front: xf(front, { rot, x, y }) };
}

/** Lance-shaped leaf from base (x,y) growing len along rot (deg, 0 = up), with a gentle bend. */
export function bladeLeaf(x: number, y: number, len: number, wid: number, rot: number, bend = 0): string {
  const d = M(-wid / 2, 0) + C(-wid * 0.9 + bend * 0.3, -len * 0.4, -wid * 0.4 + bend, -len * 0.8, bend * 1.4, -len) +
    C(wid * 0.3 + bend, -len * 0.75, wid * 0.8 + bend * 0.3, -len * 0.4, wid / 2, 0) + 'Z';
  return xf(d, { rot, x, y });
}

// ---------------------------------------------------------------- fireworks
/** One spoke of a firework burst: a slim teardrop from radius r0 to r1 at angle a (deg). */
export function spoke(cx: number, cy: number, r0: number, r1: number, wid: number, a: number): string {
  const len = r1 - r0;
  const d = M(0, 0) + C(len * 0.3, -wid * 0.35, len * 0.7, -wid * 0.6, len, -wid * 0.18) +
    Q(len + wid * 0.5, 0, len, wid * 0.18) + C(len * 0.7, wid * 0.6, len * 0.3, wid * 0.35, 0, 0) + 'Z';
  return xf(xf(d, { x: r0 }), { rot: a, x: cx, y: cy });
}

/** Pennant triangle hanging from a sagging string between a and b. */
export function pennant(a: Pt, b: Pt, drop: number): string {
  const m = lerp(a, b, 0.5);
  return poly([a, b, [m[0], m[1] + drop]]);
}

/** Point on a quadratic sag curve from a to b with dip at the middle. */
export const sagAt = (a: Pt, b: Pt, dip: number, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + dip * 4 * t * (1 - t)];

/** Clip a polygon to an axis-aligned rectangle (Sutherland–Hodgman). */
export function clipRect(pts: Pt[], x0: number, y0: number, x1: number, y1: number): Pt[] {
  const edges: [(p: Pt) => boolean, (a: Pt, b: Pt) => Pt][] = [
    [(p) => p[0] >= x0, (a, b) => lerp(a, b, (x0 - a[0]) / (b[0] - a[0]))],
    [(p) => p[0] <= x1, (a, b) => lerp(a, b, (x1 - a[0]) / (b[0] - a[0]))],
    [(p) => p[1] >= y0, (a, b) => lerp(a, b, (y0 - a[1]) / (b[1] - a[1]))],
    [(p) => p[1] <= y1, (a, b) => lerp(a, b, (y1 - a[1]) / (b[1] - a[1]))],
  ];
  let out = pts;
  for (const [inside, cut] of edges) {
    const src = out; out = [];
    for (let i = 0; i < src.length; i++) {
      const a = src[i], b = src[(i + 1) % src.length];
      if (inside(b)) { if (!inside(a)) out.push(cut(a, b)); out.push(b); }
      else if (inside(a)) out.push(cut(a, b));
    }
  }
  return out;
}

/** Points of an arch-topped window opening: straight sides from yBot up to ySpring, round top to yTop. */
export function archPts(x0: number, x1: number, yTop: number, ySpring: number, yBot: number): Pt[] {
  const cx = (x0 + x1) / 2, rx = (x1 - x0) / 2, ry = ySpring - yTop;
  const pts: Pt[] = [[x0, yBot]];
  for (let i = 0; i <= 24; i++) { const a = Math.PI + (Math.PI * i) / 24; pts.push([cx + Math.cos(a) * rx, ySpring + Math.sin(a) * ry]); }
  pts.push([x1, yBot]);
  return pts;
}

/** Smooth ridge through pts (left to right), filled down to `bottom`. */
export function ridge(pts: Pt[], bottom: number): string {
  const s = sampleCurve(pts, 10);
  return poly([...s, [s[s.length - 1][0], bottom], [s[0][0], bottom]]);
}

/** A clump of grass blades standing on (x, y): each blade is [x offset, height, lean]. */
export function tuft(x: number, y: number, s: number, blades: [number, number, number][] = [[-26, 50, -14], [-4, 74, -2], [18, 60, 12], [34, 40, 18]]): string {
  let d = M(x + (blades[0][0] - 9) * s, y);
  for (const [bx, bh, lean] of blades) {
    const x0 = x + (bx - 9) * s, x1 = x + (bx + 9) * s, tx = x + (bx + lean) * s, ty = y - bh * s;
    d += L(x0, y) + Q(x0 + lean * 0.2 * s, y - bh * 0.55 * s, tx, ty) + Q(x1 + lean * 0.1 * s, y - bh * 0.45 * s, x1, y);
  }
  return d + 'Z';
}

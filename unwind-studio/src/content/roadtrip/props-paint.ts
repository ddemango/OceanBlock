// Shared drawing helpers for the On the Road paint-by-number artworks.
import { poly, xf } from '../../art/kit';
import type { PaintRegion } from '../types';

export type Pt = [number, number];
export const n = (v: number) => String(Math.round(v * 10) / 10);
export const M = (x: number, y: number) => `M${n(x)} ${n(y)}`;
export const L = (x: number, y: number) => `L${n(x)} ${n(y)}`;
export const Q = (cx: number, cy: number, x: number, y: number) => `Q${n(cx)} ${n(cy)} ${n(x)} ${n(y)}`;

export const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const smooth = (t: number) => t * t * (3 - 2 * t);

/** Region collector. Pass `label` for long thin regions where the automatic placement struggles. */
export function collector() {
  const regions: PaintRegion[] = [];
  const R = (id: string, d: string, color: string, label?: [number, number]) => {
    regions.push(label ? { id, d, color, label } : { id, d, color });
  };
  return { regions, R };
}

/** Rounded rectangle with a separate radius per corner: [top-left, top-right, bottom-right, bottom-left]. */
export function rrect(x: number, y: number, w: number, h: number, r: [number, number, number, number]): string {
  const [a, b, c, d] = r.map((v) => Math.max(0, Math.min(v, w / 2, h / 2)));
  return (
    M(x + a, y) + L(x + w - b, y) + (b ? Q(x + w, y, x + w, y + b) : '') +
    L(x + w, y + h - c) + (c ? Q(x + w, y + h, x + w - c, y + h) : '') +
    L(x + d, y + h) + (d ? Q(x, y + h, x, y + h - d) : '') +
    L(x, y + a) + (a ? Q(x, y, x + a, y) : '') + 'Z'
  );
}

/** A hot-air balloon envelope centred on (cx, cy) with radius r; the neck sits at cy + 1.3r. */
export function balloon(cx: number, cy: number, r: number) {
  const yTop = cy - r, yNeck = cy + 1.3 * r;
  const hw = (y: number) => {
    if (y <= cy) return Math.sqrt(Math.max(0, r * r - (y - cy) * (y - cy)));
    const t = Math.min(1, (y - cy) / (1.3 * r));
    return r * (1 - 0.72 * smooth(t));
  };
  // sample heights densely near the crown where the outline turns fastest
  const ys = (ya: number, yb: number): number[] => {
    const out: number[] = [];
    const k = 40;
    for (let i = 0; i <= k; i++) {
      const s = i / k;
      const yUp = (y: number) => Math.acos(Math.max(-1, Math.min(1, (cy - y) / r)));
      // map through angle for the upper hemisphere, linear below
      if (yb <= cy) {
        const a0 = yUp(ya), a1 = yUp(yb), a = a0 + (a1 - a0) * s;
        out.push(cy - r * Math.cos(a));
      } else out.push(ya + (yb - ya) * s);
    }
    return out;
  };
  const xAt = (u: number, y: number) => cx + Math.sin((u * Math.PI) / 2) * hw(y);
  const strip = (u0: number, u1: number, ya: number, yb: number) => {
    const parts: number[] = ya < cy && yb > cy ? [...ys(ya, cy), ...ys(cy, yb).slice(1)] : ys(ya, yb);
    const left: Pt[] = parts.map((y) => [xAt(u0, y), y]);
    const right: Pt[] = parts.map((y) => [xAt(u1, y), y]).reverse();
    return poly([...left, ...right]);
  };
  return { yTop, yNeck, hw, xAt, strip, cap: (yb: number) => strip(-1, 1, yTop, yb) };
}

/** A drooping palm frond from (x, y) of length len and half-width wid along angle rot (deg, 0 = right), curling by `droop`. */
export function frond(x: number, y: number, len: number, wid: number, rot: number, droop: number): string {
  const k = 14;
  const spine: Pt[] = [];
  for (let i = 0; i <= k; i++) {
    const t = i / k;
    spine.push([len * t, droop * t * t]);
  }
  const left: Pt[] = [], right: Pt[] = [];
  for (let i = 0; i <= k; i++) {
    const t = i / k;
    const p = spine[i], q = spine[Math.min(k, i + 1)], o = spine[Math.max(0, i - 1)];
    const dx = q[0] - o[0], dy = q[1] - o[1], dl = Math.hypot(dx, dy) || 1;
    const nx = -dy / dl, ny = dx / dl;
    const w = wid * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.08 + 0.02)), 0.8);
    left.push([p[0] + nx * w, p[1] + ny * w]);
    right.push([p[0] - nx * w, p[1] - ny * w]);
  }
  return xf(poly([...left, ...right.reverse()]), { rot, x, y });
}

/** The upper (lighter) half of a frond. */
export function frondHalf(x: number, y: number, len: number, wid: number, rot: number, droop: number): string {
  const k = 14;
  const spine: Pt[] = [], edge: Pt[] = [];
  for (let i = 0; i <= k; i++) {
    const t = i / k;
    spine.push([len * t, droop * t * t]);
  }
  for (let i = 0; i <= k; i++) {
    const t = i / k;
    const p = spine[i], q = spine[Math.min(k, i + 1)], o = spine[Math.max(0, i - 1)];
    const dx = q[0] - o[0], dy = q[1] - o[1], dl = Math.hypot(dx, dy) || 1;
    const w = wid * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.08 + 0.02)), 0.8);
    edge.push([p[0] + (dy / dl) * w, p[1] - (dx / dl) * w]);
  }
  return xf(poly([...spine, ...edge.reverse()]), { rot, x, y });
}

/** A tapering, gently curved trunk. Returns the full outline and a function for a band between t0..t1 (0 = base). */
export function trunk(base: Pt, top: Pt, bend: number, w0: number, w1: number) {
  const at = (t: number): Pt => {
    const p = lerp(base, top, t);
    const dx = top[0] - base[0], dy = top[1] - base[1], dl = Math.hypot(dx, dy);
    const off = bend * Math.sin(Math.PI * t);
    return [p[0] + (-dy / dl) * off, p[1] + (dx / dl) * off];
  };
  const band = (t0: number, t1: number) => {
    const k = Math.max(2, Math.ceil((t1 - t0) * 24));
    const l: Pt[] = [], r: Pt[] = [];
    for (let i = 0; i <= k; i++) {
      const t = t0 + ((t1 - t0) * i) / k;
      const p = at(t), q = at(Math.min(1, t + 0.01)), o = at(Math.max(0, t - 0.01));
      const dx = q[0] - o[0], dy = q[1] - o[1], dl = Math.hypot(dx, dy) || 1;
      const w = (w0 + (w1 - w0) * t) / 2;
      l.push([p[0] + (-dy / dl) * w, p[1] + (dx / dl) * w]);
      r.push([p[0] - (-dy / dl) * w, p[1] - (dx / dl) * w]);
    }
    return poly([...l, ...r.reverse()]);
  };
  return { at, band, outline: () => band(0, 1) };
}

/** Clip a polygon to the rectangle [x0, x1] × [y0, y1] (Sutherland–Hodgman). */
export function clipRect(pts: Pt[], x0: number, y0: number, x1: number, y1: number): Pt[] {
  const edges: [(p: Pt) => boolean, (a: Pt, b: Pt) => Pt][] = [
    [(p) => p[0] >= x0, (a, b) => lerp(a, b, (x0 - a[0]) / (b[0] - a[0]))],
    [(p) => p[0] <= x1, (a, b) => lerp(a, b, (x1 - a[0]) / (b[0] - a[0]))],
    [(p) => p[1] >= y0, (a, b) => lerp(a, b, (y0 - a[1]) / (b[1] - a[1]))],
    [(p) => p[1] <= y1, (a, b) => lerp(a, b, (y1 - a[1]) / (b[1] - a[1]))],
  ];
  let out = pts;
  for (const [inside, cut] of edges) {
    const src = out;
    out = [];
    for (let i = 0; i < src.length; i++) {
      const cur = src[i], prev = src[(i + src.length - 1) % src.length];
      if (inside(cur)) {
        if (!inside(prev)) out.push(cut(prev, cur));
        out.push(cur);
      } else if (inside(prev)) out.push(cut(prev, cur));
    }
    if (!out.length) break;
  }
  return out;
}

/** The part of a circle between heights y1 and y2 (a horizontal stripe through a disc). */
export function chordBand(cx: number, cy: number, r: number, y1: number, y2: number): string {
  const k = 10, left: Pt[] = [], right: Pt[] = [];
  for (let i = 0; i <= k; i++) {
    const y = y1 + ((y2 - y1) * i) / k;
    const w = Math.sqrt(Math.max(0, r * r - (y - cy) * (y - cy)));
    left.push([cx - w, y]);
    right.push([cx + w, y]);
  }
  return poly([...left, ...right.reverse()]);
}

/** The part of an ellipse between x1 and x2 (a vertical stripe across a board or lozenge). */
export function ellipseSlice(cx: number, cy: number, rx: number, ry: number, x1: number, x2: number): string {
  const k = 8, top: Pt[] = [], bot: Pt[] = [];
  for (let i = 0; i <= k; i++) {
    const x = x1 + ((x2 - x1) * i) / k;
    const h = ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2));
    top.push([x, cy - h]);
    bot.push([x, cy + h]);
  }
  return poly([...top, ...bot.reverse()]);
}

/** A Cappadocia-style rock chimney standing on (x, y): a tapering cone of soft tuff with a darker cap stone. */
export function chimney(x: number, y: number, bw: number, h: number) {
  const pts: Pt[] = [[-bw / 2, 0], [-bw * 0.36, -h * 0.45], [-bw * 0.2, -h * 0.82], [0, -h], [bw * 0.2, -h * 0.82], [bw * 0.36, -h * 0.45], [bw / 2, 0]];
  const body = xf(poly(pts.map(([px, py]): Pt => [px, py])), { x, y });
  const capW = bw * 0.3, capH = Math.max(12, bw * 0.15);
  const cap = xf(M(-capW, 0) + Q(-capW, -capH * 1.6, 0, -capH * 1.6) + Q(capW, -capH * 1.6, capW, 0) + Q(0, capH * 0.5, -capW, 0) + 'Z', { x, y: y - h + capH * 0.6 });
  const shade = xf(poly([[bw * 0.05, -h * 0.9], [bw * 0.2, -h * 0.82], [bw * 0.36, -h * 0.45], [bw / 2, 0], [bw * 0.14, 0], [bw * 0.06, -h * 0.5]]), { x, y });
  return { body, cap, shade };
}

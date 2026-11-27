// Shared drawing helpers for the Down on the Farm paint-by-number artworks.
import { blob, circle, poly, stroke, xf } from '../../art/kit';
import type { Pt } from '../../art/geometry';
import type { Shape } from '../../art/types';
import type { PaintRegion } from '../types';

export const W = 1000, H = 1250;
export type { Pt };

export interface Canvas {
  regions: PaintRegion[];
  detail: Shape[];
  /** Add a region. */
  R(id: string, d: string, color: string, label?: Pt): void;
  /** Add a thin decorative stroke. */
  D(d: string, color: string, width: number, opacity?: number): void;
}

export function canvas(): Canvas {
  const regions: PaintRegion[] = [];
  const detail: Shape[] = [];
  return {
    regions,
    detail,
    R: (id, d, color, label) => { regions.push(label ? { id, d, color, label } : { id, d, color }); },
    D: (d, color, width, opacity = 1) => { detail.push(stroke(d, color, width, opacity < 1 ? { opacity } : {})); },
  };
}

const rad = (deg: number) => (deg * Math.PI) / 180;
export const polar = (cx: number, cy: number, r: number, deg: number): Pt => [cx + Math.cos(rad(deg)) * r, cy + Math.sin(rad(deg)) * r];
export const clampPt = ([x, y]: Pt): Pt => [Math.max(0, Math.min(W, x)), Math.max(0, Math.min(H, y))];

/** Dense samples of a smooth open Catmull-Rom curve through pts. */
export function sample(pts: Pt[], per = 10): Pt[] {
  const out: Pt[] = [];
  const at = (i: number) => pts[Math.max(0, Math.min(pts.length - 1, i))];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    for (let k = 0; k < per; k++) {
      const t = k / per, t2 = t * t, t3 = t2 * t;
      out.push([
        0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
      ]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

function ribbon(pts: Pt[], width: (t: number) => number): string {
  const s = sample(pts);
  const left: Pt[] = [], right: Pt[] = [];
  s.forEach((p, i) => {
    const a = s[Math.max(0, i - 1)], b = s[Math.min(s.length - 1, i + 1)];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const nx = -(b[1] - a[1]) / len, ny = (b[0] - a[0]) / len;
    const w = width(i / (s.length - 1)) / 2;
    left.push([p[0] + nx * w, p[1] + ny * w]);
    right.push([p[0] - nx * w, p[1] - ny * w]);
  });
  return poly([...left, ...right.reverse()]);
}

/** A ribbon of linearly tapering width following a smooth curve (stems, straps, tails). */
export const band = (pts: Pt[], w0: number, w1: number) => ribbon(pts, (t) => w0 + (w1 - w0) * t);

/** A feather: starts at width w0, swells to wMax around `peak`, then tapers to a soft point. */
export function plume(pts: Pt[], w0: number, wMax: number, peak = 0.5): string {
  return ribbon(pts, (t) => {
    if (t < peak) { const u = t / peak; return w0 + (wMax - w0) * (u * u * (3 - 2 * u)); }
    const u = (t - peak) / (1 - peak);
    return wMax * Math.cos((u * Math.PI) / 2) + 1;
  });
}

/** Smooth edge through pts, closed with straight lines through the given corner points. */
export function edged(pts: Pt[], corners: Pt[] = [[W, H], [0, H]]): string {
  return poly([...sample(pts, 8).map(clampPt), ...corners]);
}

/** Region between two smooth edges (both given left→right). */
export function between(top: Pt[], bottom: Pt[]): string {
  return poly([...sample(top, 8).map(clampPt), ...sample(bottom, 8).map(clampPt).reverse()]);
}

/** Closed smooth shape through pts, kept inside the canvas. */
export function soft(pts: Pt[], per = 8): string {
  const n = pts.length;
  const s = sample([pts[n - 1], ...pts, pts[0], pts[1]], per);
  return poly(s.slice(per, per + n * per).map(clampPt));
}

/** A puffy cloud or tree crown. */
export function puff(cx: number, cy: number, rx: number, ry: number, bumps: number, seed = 0, flatBase = false): string {
  const pts: Pt[] = [];
  const n = bumps * 2;
  for (let i = 0; i < n; i++) {
    const a = rad(-90 + (i * 360) / n + seed);
    const bump = i % 2 ? 0.82 : 1 + 0.06 * Math.sin(i * 2.3 + seed);
    let y = cy + Math.sin(a) * ry * bump;
    if (flatBase && Math.sin(a) > 0.3) y = cy + ry * 0.45 + (Math.sin(a) - 0.3) * ry * 0.2;
    pts.push([cx + Math.cos(a) * rx * bump, y]);
  }
  return blob(pts, 1);
}

/** Lobed outline with n rounded bumps (flower heads). */
export function lobed(cx: number, cy: number, r: number, n = 5, inner = 0.5, rot = -90): string {
  const pts: Pt[] = [];
  for (let i = 0; i < n * 2; i++) pts.push(polar(cx, cy, i % 2 ? r * inner : r, rot + (i * 180) / n));
  return blob(pts, 1.1);
}

/** A daisy outline: n rounded petals with crisp notches between them. */
export function daisy(cx: number, cy: number, r: number, n = 9, inner = 0.5, rot = -90): string {
  const pts: Pt[] = [];
  const steps = n * 12;
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const k = Math.pow(Math.abs(Math.sin((n * a) / 2)), 0.55);
    pts.push(polar(cx, cy, r * (inner + (1 - inner) * k), rot + (a * 180) / Math.PI - 180 / n));
  }
  return poly(pts);
}

/** Clip a convex polygon to the canvas rectangle (Sutherland–Hodgman). */
export function clipToCanvas(pts: Pt[]): Pt[] {
  const edges: [(p: Pt) => boolean, (a: Pt, b: Pt) => Pt][] = [
    [(p) => p[0] >= 0, (a, b) => [0, a[1] + ((b[1] - a[1]) * (0 - a[0])) / (b[0] - a[0])]],
    [(p) => p[0] <= W, (a, b) => [W, a[1] + ((b[1] - a[1]) * (W - a[0])) / (b[0] - a[0])]],
    [(p) => p[1] >= 0, (a, b) => [a[0] + ((b[0] - a[0]) * (0 - a[1])) / (b[1] - a[1]), 0]],
    [(p) => p[1] <= H, (a, b) => [a[0] + ((b[0] - a[0]) * (H - a[1])) / (b[1] - a[1]), H]],
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

/** A simple round flower: lobed petals with a round centre. Adds `${id}-petals` and `${id}-centre`. */
export function flower(c: Canvas, id: string, cx: number, cy: number, r: number, petals: string, centre: string, n = 8, inner = 0.6, rot = -90) {
  c.R(`${id}-petals`, n >= 7 ? daisy(cx, cy, r, n, inner * 0.8, rot) : lobed(cx, cy, r, n, inner, rot), petals);
  c.R(`${id}-centre`, circle(cx, cy, Math.max(7, r * 0.32)), centre);
}

/**
 * A little gambrel barn seen at three-quarters, front gable on the left.
 * (x, y) is the bottom-left of the front wall; s scales it. Returns named paths.
 */
export function barn(x: number, y: number, s: number) {
  const t = (d: string) => xf(d, { s, x, y });
  return {
    front: t(poly([[0, 0], [0, -66], [22, -96], [70, -116], [118, -96], [140, -66], [140, 0]])),
    side: t(poly([[140, -66], [262, -62], [262, 0], [140, 0]])),
    roof: t(poly([[70, -116], [192, -110], [238, -90], [262, -62], [140, -66], [118, -96]])),
    door: t(poly([[42, 0], [42, -50], [98, -50], [98, 0]])),
    loft: t(poly([[56, -66], [56, -90], [84, -90], [84, -66]])),
    doorCross: t('M42 0L98 -50M98 0L42 -50'),
  };
}

/** A fence post with a rounded top. */
export const post = (cx: number, top: number, w: number, bottom: number) =>
  `M${cx - w / 2} ${bottom}L${cx - w / 2} ${top + w * 0.3}Q${cx - w / 2} ${top} ${cx} ${top}Q${cx + w / 2} ${top} ${cx + w / 2} ${top + w * 0.3}L${cx + w / 2} ${bottom}Z`;

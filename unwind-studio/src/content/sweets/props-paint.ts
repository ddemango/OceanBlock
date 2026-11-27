// Shared drawing helpers for The Sweet Shop paint-by-number artworks.
import { ellipse, poly, xf } from '../../art/kit';
import type { PaintRegion } from '../types';

export type Pt = [number, number];
const n = (v: number) => String(Math.round(v * 10) / 10);
export const M = (x: number, y: number) => `M${n(x)} ${n(y)}`;
export const L = (x: number, y: number) => `L${n(x)} ${n(y)}`;
export const Q = (cx: number, cy: number, x: number, y: number) => `Q${n(cx)} ${n(cy)} ${n(x)} ${n(y)}`;
export const C = (a: number, b: number, c: number, d: number, x: number, y: number) => `C${n(a)} ${n(b)} ${n(c)} ${n(d)} ${n(x)} ${n(y)}`;

export const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
/** Point inside a quad (a top-left, b top-right, c bottom-right, d bottom-left) at (u, v) in 0..1. */
export const quadAt = (a: Pt, b: Pt, c: Pt, d: Pt, u: number, v: number): Pt => lerp(lerp(a, b, u), lerp(d, c, u), v);
/** Sub-quad of a quad between u0..u1, v0..v1. */
export const subQuad = (a: Pt, b: Pt, c: Pt, d: Pt, u0: number, u1: number, v0: number, v1: number) =>
  poly([quadAt(a, b, c, d, u0, v0), quadAt(a, b, c, d, u1, v0), quadAt(a, b, c, d, u1, v1), quadAt(a, b, c, d, u0, v1)]);

export type AddRegion = (id: string, d: string, color: string, label?: [number, number]) => void;

/** Region collector. */
export function collector() {
  const regions: PaintRegion[] = [];
  const R: AddRegion = (id, d, color, label) => {
    regions.push(label ? { id, d, color, label } : { id, d, color });
  };
  return { regions, R };
}

/** A turned vessel (glass, jar) seen slightly from above: profile of [y, half-width]. */
export function vessel(cx: number, prof: [number, number][], ratio: number) {
  const hw = (y: number) => {
    const k = prof.length;
    if (y <= prof[0][0]) return prof[0][1];
    if (y >= prof[k - 1][0]) return prof[k - 1][1];
    let i = 0;
    while (y > prof[i + 1][0]) i++;
    const [y0, v0] = prof[i], [y1, v1] = prof[i + 1];
    return v0 + ((v1 - v0) * (y - y0)) / (y1 - y0);
  };
  const arc = (y: number, dir: 1 | -1, inset = 0): Pt[] => {
    const pts: Pt[] = [], w = hw(y) - inset;
    for (let i = 0; i <= 18; i++) { const a = (Math.PI * i) / 18; pts.push([cx - dir * Math.cos(a) * w, y + Math.sin(a) * w * ratio]); }
    return pts;
  };
  const side = (ya: number, yb: number, sgn: 1 | -1, inset = 0): Pt[] => {
    const pts: Pt[] = [], k = Math.max(2, Math.ceil(Math.abs(yb - ya) / 6));
    for (let i = 0; i <= k; i++) { const y = ya + ((yb - ya) * i) / k; pts.push([cx + sgn * (hw(y) - inset), y]); }
    return pts;
  };
  const yTop = prof[0][0], yBot = prof[prof.length - 1][0];
  return {
    hw,
    body: () => poly([...arc(yTop, 1), ...side(yTop, yBot, 1).slice(1), ...arc(yBot, -1).slice(1), ...side(yBot, yTop, -1).slice(1, -1)]),
    band: (y1: number, y2: number, inset = 0.8) => poly([...arc(y1, 1, inset), ...side(y1, y2, 1, inset).slice(1), ...arc(y2, -1, inset).slice(1), ...side(y2, y1, -1, inset).slice(1, -1)]),
    /** A ribbon of light running down the inside of one wall between y1 and y2. */
    glint: (y1: number, y2: number, sgn: 1 | -1, inset: number, w: number) =>
      poly([...side(y1, y2, sgn, inset), ...side(y2, y1, sgn, inset + w)]),
  };
}

/** Crescent hugging the edge of an ellipse between angles a0..a1 (degrees, 0 = right, 90 = down). */
export function crescent(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, depth: number, rot = 0): string {
  const out: Pt[] = [], inn: Pt[] = [], k = 20;
  for (let i = 0; i <= k; i++) {
    const t = i / k, a = ((a0 + (a1 - a0) * t) * Math.PI) / 180;
    const ex = Math.cos(a) * rx, ey = Math.sin(a) * ry;
    out.push([ex, ey]);
    const f = 1 - depth * Math.sin(Math.PI * t);
    inn.push([ex * f, ey * f]);
  }
  return xf(poly([...out, ...inn.reverse().slice(1, -1)]), { rot, x: cx, y: cy });
}

/** A rectangle of size w×h centred on (cx, cy), rotated by rot degrees, with rounded corners r. */
export function rotRect(cx: number, cy: number, w: number, h: number, rot: number, r = 0): string {
  const hw = w / 2, hh = h / 2;
  const rr = Math.min(r, hw, hh);
  const d = rr > 0
    ? M(-hw + rr, -hh) + L(hw - rr, -hh) + Q(hw, -hh, hw, -hh + rr) + L(hw, hh - rr) + Q(hw, hh, hw - rr, hh) + L(-hw + rr, hh) + Q(-hw, hh, -hw, hh - rr) + L(-hw, -hh + rr) + Q(-hw, -hh, -hw + rr, -hh) + 'Z'
    : poly([[-hw, -hh], [hw, -hh], [hw, hh], [-hw, hh]]);
  return xf(d, { rot, x: cx, y: cy });
}

/** Map a local point (relative to a rotated box centre) to the page. */
export function rotPt(cx: number, cy: number, rot: number, x: number, y: number): Pt {
  const a = (rot * Math.PI) / 180;
  return [cx + x * Math.cos(a) - y * Math.sin(a), cy + x * Math.sin(a) + y * Math.cos(a)];
}

/** A straight bar of width w from a to b (a stick, a straw, a candy cane). */
export function bar(a: Pt, b: Pt, w: number): string {
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
  const nx = (-dy / len) * (w / 2), ny = (dx / len) * (w / 2);
  return poly([[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny]]);
}

/** A heart centred on (cx, cy) of width w. */
export function heart(cx: number, cy: number, w: number, rot = 0): string {
  const s = w / 2;
  const d = M(0, s * 0.95) + C(-s * 0.2, s * 0.7, -s, s * 0.25, -s, -s * 0.25) + C(-s, -s * 0.8, -s * 0.2, -s * 0.85, 0, -s * 0.35) +
    C(s * 0.2, -s * 0.85, s, -s * 0.8, s, -s * 0.25) + C(s, s * 0.25, s * 0.2, s * 0.7, 0, s * 0.95) + 'Z';
  return xf(d, { rot, x: cx, y: cy });
}

/** An ellipse with a scalloped (lace) edge of `count` lobes. */
export function scallopEllipse(cx: number, cy: number, rx: number, ry: number, count: number, dip = 0.08): string {
  const pts: Pt[] = [];
  for (let i = 0; i < count * 4; i++) {
    const a = (i / (count * 4)) * Math.PI * 2;
    const f = 1 - dip * (0.5 + 0.5 * Math.cos((i / 4) * Math.PI * 2));
    pts.push([cx + Math.cos(a) * rx * f, cy + Math.sin(a) * ry * f]);
  }
  return poly(pts);
}

/** A sweet in a twisted wrapper, 160 units long at s = 1: two fanned ends, the sweet and a centre band. */
export function wrappedSweet(R: AddRegion, id: string, cx: number, cy: number, s: number, rot: number, body: string, wrap: string, band: string) {
  const t = { s, rot, x: cx, y: cy };
  R(`${id}-end-left`, xf(poly([[-36, -8], [-80, -28], [-70, 0], [-80, 28], [-36, 8]]), t), wrap);
  R(`${id}-end-right`, xf(poly([[36, -8], [80, -28], [70, 0], [80, 28], [36, 8]]), t), wrap);
  R(id, xf(ellipse(0, 0, 46, 29), t), body);
  R(`${id}-band`, xf(M(-11, -28.1) + Q(0, -29.6, 11, -28.1) + L(11, 28.1) + Q(0, 29.6, -11, 28.1) + 'Z', t), band);
}

/** A round lollipop of three rings centred on (cx, cy). */
export function lollipop(R: AddRegion, id: string, cx: number, cy: number, r: number, a: string, b: string) {
  R(`${id}-outer`, ellipse(cx, cy, r, r), a);
  R(`${id}-ring`, ellipse(cx, cy, r * 0.68, r * 0.68), b);
  R(`${id}-centre`, ellipse(cx, cy, r * 0.35, r * 0.35), a);
}

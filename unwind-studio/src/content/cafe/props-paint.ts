// Shared drawing helpers for the Coffee & Good Company paint-by-number artworks.
import { ellipse, poly, leaf, xf } from '../../art/kit';
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

/** Region collector. */
export function collector() {
  const regions: PaintRegion[] = [];
  const R = (id: string, d: string, color: string, label?: [number, number]) => {
    regions.push(label ? { id, d, color, label } : { id, d, color });
  };
  return { regions, R };
}

/** A turned vessel (mug, pot, glass) seen slightly from above: profile of [y, half-width]. */
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
    opening: (inset = 0, dy = 0) => ellipse(cx, yTop + dy, hw(yTop) - inset, (hw(yTop) - inset) * ratio),
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

/** The lighter half of a leaf (pair with kit `leaf`). */
export const halfLeaf = (x: number, y: number, len: number, wid: number, rot: number, flip = false) =>
  xf(M(0, 0) + Q(len * 0.45, flip ? wid : -wid, len, 0) + 'Z', { rot, x, y });

/** A mug handle on the right (dir 1) or left (dir -1) of a mug side at x, from y0 down to y1. */
export function mugHandle(x: number, y0: number, y1: number, reach: number, thick: number, dir: 1 | -1 = 1): string {
  const h = y1 - y0;
  return M(x - dir * 6, y0) + C(x + dir * reach * 1.25, y0 - h * 0.12, x + dir * reach * 1.3, y1 + h * 0.08, x - dir * 6, y1) +
    L(x - dir * 6, y1 - thick) + C(x + dir * (reach - thick) * 1.2, y1 - thick, x + dir * (reach - thick) * 1.2, y0 + thick, x - dir * 6, y0 + thick) + 'Z';
}

/** A rising wisp of steam: a tapering ribbon that sways sideways as it climbs from (x, y) by `h`. */
export function steam(x: number, y: number, h: number, amp: number, w: number, phase = 0): string {
  const a: Pt[] = [], b: Pt[] = [], k = 24;
  for (let i = 0; i <= k; i++) {
    const t = i / k, yy = y - h * t;
    const cx = x + Math.sin(t * Math.PI * 1.6 + phase) * amp * (0.4 + t * 0.6);
    const ww = (w / 2) * (1 - t * 0.75) * (t < 0.12 ? 0.55 + t * 3.75 : 1);
    a.push([cx - ww, yy]);
    b.push([cx + ww, yy]);
  }
  return poly([...a, ...b.reverse()]);
}

/** A thick ribbon along a quadratic curve a→c→b, width tapering by `taper` (0..1). */
export function ribbon(a: Pt, c: Pt, b: Pt, w: number, taper = 0.3): string {
  const L0: Pt[] = [], L1: Pt[] = [];
  for (let i = 0; i <= 16; i++) {
    const t = i / 16, u = 1 - t;
    const x = u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], y = u * u * a[1] + 2 * u * t * c[1] + t * t * b[1];
    const dx = 2 * u * (c[0] - a[0]) + 2 * t * (b[0] - c[0]), dy = 2 * u * (c[1] - a[1]) + 2 * t * (b[1] - c[1]);
    const len = Math.hypot(dx, dy) || 1, ww = (w * (1 - t * taper)) / 2;
    L0.push([x - (dy / len) * ww, y + (dx / len) * ww]);
    L1.push([x + (dy / len) * ww, y - (dx / len) * ww]);
  }
  return poly([...L0, ...L1.reverse()]);
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

/** A heart centred on (cx, cy) of width w. */
export function heart(cx: number, cy: number, w: number, rot = 0): string {
  const s = w / 2;
  const d = M(0, s * 0.95) + C(-s * 0.2, s * 0.7, -s, s * 0.25, -s, -s * 0.25) + C(-s, -s * 0.8, -s * 0.2, -s * 0.85, 0, -s * 0.35) +
    C(s * 0.2, -s * 0.85, s, -s * 0.8, s, -s * 0.25) + C(s, s * 0.25, s * 0.2, s * 0.7, 0, s * 0.95) + 'Z';
  return xf(d, { rot, x: cx, y: cy });
}

export { leaf };

// Shared props for the Paws & Whiskers hidden-object scenes. Every prop is drawn
// around the origin and returns Shape[]; position it with place(). Unless a comment
// says otherwise the origin is the bottom centre (the prop stands on y = 0).
import { rect, ellipse, circle, poly, line, curve, blob, leaf, sh, stroke, shade, mix, rng, xf, place } from '../../art/kit';
import type { Shape } from '../../art/types';

export type Pt = [number, number];
const INK = '#2b2622';
const hl = (d: string, op = 0.5): Shape => sh(d, '#ffffff', { opacity: op });
const ol = (d: string, fill: string, w = 1, amt = -0.3): Shape => sh(d, fill, { stroke: shade(fill, amt), strokeWidth: w });
const shadow = (cx: number, cy: number, rx: number, ry: number, op = 0.2): Shape => sh(ellipse(cx, cy, rx, ry), '#3b2a1c', { opacity: op });
const sc = (shapes: Shape[], s: number): Shape[] => place(shapes, { s: s / 100 });
/** Several overlapping parts drawn as one silhouette with a single outline. */
function uni(parts: string[], fill: string, w = 1.2, amt = -0.3): Shape[] {
  return [stroke(parts.join(''), shade(fill, amt), w * 2), ...parts.map((d) => sh(d, fill))];
}
/** A thick line with an outline (tails, straps). */
function tube(d: string, col: string, w: number, amt = -0.3): Shape[] {
  return [stroke(d, shade(col, amt), w + 2.2), stroke(d, col, w)];
}

export const PET = {
  golden: '#e0a850', tan: '#d9a86c', brown: '#9a6238', choc: '#6a4028', cream: '#f6ead2', white: '#fbf6ec', grey: '#9a9aa0', slate: '#6f7480',
  black: '#3a3640', ginger: '#e3924a', sand: '#e8cfa0', red: '#c8473a', teal: '#3f7f7a', mustard: '#d9a53a', blue: '#4f86c0', pink: '#e89ab0',
  green: '#5c8a4e', plum: '#7a4a62', wood: '#b07a4a', woodDk: '#6a4428', woodLt: '#d0a070',
};

/** Paw print path centred on (x,y); r is the pad radius. */
export function pawPrint(x: number, y: number, r: number, rot = 0): string {
  const d = ellipse(0, r * 0.35, r * 0.72, r * 0.6) + ellipse(-r * 0.78, -r * 0.3, r * 0.26, r * 0.34, -20) + ellipse(-r * 0.28, -r * 0.72, r * 0.26, r * 0.36, -6) + ellipse(r * 0.28, -r * 0.72, r * 0.26, r * 0.36, 6) + ellipse(r * 0.78, -r * 0.3, r * 0.26, r * 0.34, 20);
  return xf(d, { rot, x, y });
}
/** Dog-bone path centred on the origin, length l. */
export function bonePath(l: number): string {
  const r = l * 0.13;
  return rect(-l * 0.34, -r * 0.62, l * 0.68, r * 1.24) + circle(-l * 0.37, -r * 0.7, r) + circle(-l * 0.37, r * 0.7, r) + circle(l * 0.37, -r * 0.7, r) + circle(l * 0.37, r * 0.7, r);
}
/** Simple fish silhouette path, nose to the left, length l, centred on the origin. */
export function fishPath(l: number): string {
  return blob([[-l * 0.5, 0], [-l * 0.2, -l * 0.22], [l * 0.14, -l * 0.14], [l * 0.26, 0], [l * 0.14, l * 0.14], [-l * 0.2, l * 0.22]], 1) + poly([[l * 0.2, 0], [l * 0.5, -l * 0.22], [l * 0.42, 0], [l * 0.5, l * 0.22]]);
}
/** Heart path centred on (x,y). */
export function heartPath(x: number, y: number, r: number): string {
  return `M${x} ${y + r}C${x - r * 1.6} ${y - r * 0.2} ${x - r * 0.7} ${y - r * 1.3} ${x} ${y - r * 0.4}C${x + r * 0.7} ${y - r * 1.3} ${x + r * 1.6} ${y - r * 0.2} ${x} ${y + r}Z`;
}

// =====================================================================
// dogs
// =====================================================================
export interface DogOpt {
  patch?: string; ear?: 'flop' | 'point' | 'long' | 'fold'; tail?: 'up' | 'curl' | 'down' | 'stub' | 'plume'; leg?: number; bodyH?: number; len?: number;
  snout?: number; head?: number; run?: boolean; collar?: string; spots?: number; saddle?: string; socks?: string; muzzle?: string; fluffy?: boolean;
  pom?: boolean; tongue?: boolean; earCol?: string; mask?: string; beard?: boolean; item?: Shape[];
}
/** Dog seen side-on facing left. s is roughly the nose-to-rump length. `item` is carried in the mouth (drawn around the mouth point). */
export function dog(s: number, col: string, o: DogOpt = {}): Shape[] {
  const l = o.len ?? 1, L = o.leg ?? 30, B = o.bodyH ?? 28, sn = o.snout ?? 1, hr = 13 * (o.head ?? 1);
  const by = -L, ty = -L - B, dk = shade(col, -0.3), far = shade(col, -0.16);
  const hx = -30 * l - 8, hy = ty - 8;
  const out: Shape[] = [shadow(0, 0, 44 * l, 5)];
  const lw = B < 24 ? 6.5 : 8.5;
  const legD = (x: number, rot: number) => xf(rect(x - lw / 2, by - 8, lw, L + 8 - 2, lw / 2) + ellipse(x - 2, -2.8, lw * 0.8, 3.4), { rot, ox: x, oy: by - 4 });
  const fr = o.run ? [52, 34] : [0, 0], bk = o.run ? [-52, -36] : [0, 0];
  const farLegs = [legD(-13 * l, fr[1]), legD(19 * l, bk[1])];
  out.push(...farLegs.map((d) => ol(d, far, 1.2, -0.25)));
  // tail
  const tx = 33 * l, tyy = ty + 6;
  const tail = o.tail ?? 'up';
  if (tail === 'up') out.push(...tube(curve([[tx, tyy], [tx + 11, ty - 8], [tx + 9, ty - 24]]), col, 5.5));
  else if (tail === 'curl') out.push(...tube(curve([[tx, tyy], [tx + 9, ty - 10], [tx + 2, ty - 20], [tx - 5, ty - 12], [tx, ty - 7]]), col, 5));
  else if (tail === 'down') out.push(...tube(curve([[tx, tyy], [tx + 9, ty + 18], [tx + 11, by + 4]]), col, 5));
  else if (tail === 'stub') out.push(ol(circle(tx + 2, tyy, 5), col, 1.2));
  else out.push(ol(blob([[tx - 2, ty + 3], [tx + 10, ty - 12], [tx + 18, ty - 32], [tx + 12, ty - 36], [tx + 3, ty - 18], [tx - 4, ty + 10]], 1), shade(col, 0.12), 1.2));
  // silhouette
  const body = blob([[-30 * l, ty + B * 0.45], [-24 * l, ty + 1], [0, ty + 2], [26 * l, ty + 1], [35 * l, ty + B * 0.4], [30 * l, by - 1], [5 * l, by - (B < 24 ? 3 : 0)], [-22 * l, by]], 0.9);
  const neck = poly([[hx + 2, hy + hr * 0.8], [hx + hr * 0.9, hy - hr * 0.3], [-14 * l, ty + 3], [-28 * l, ty + B * 0.6]]);
  const head = circle(hx, hy, hr);
  const nx = hx - hr * (1.0 + 0.75 * sn);
  const snout = blob([[hx - hr * 0.4, hy - hr * 0.3], [hx - hr * (0.9 + 0.7 * sn), hy - hr * 0.08], [nx, hy + hr * 0.28], [hx - hr * (0.8 + 0.6 * sn), hy + hr * 0.62], [hx - hr * 0.2, hy + hr * 0.8]], 0.9);
  const thigh = xf(ellipse(26 * l, by - 9, 10, 13), { rot: bk[0] * 0.5, ox: 27 * l, oy: by - 4 });
  const nearLegs = [legD(-21 * l, fr[0]), legD(27 * l, bk[0])];
  out.push(...uni([body, neck, thigh, ...nearLegs, head, snout], col));
  // markings
  if (o.saddle) out.push(sh(blob([[-12 * l, ty + 2.6], [8 * l, ty + 2.8], [25 * l, ty + 2.8], [31 * l, ty + B * 0.42], [10 * l, ty + B * 0.62], [-8 * l, ty + B * 0.45]], 0.9), o.saddle));
  if (o.patch) out.push(sh(blob([[-28 * l, ty + B * 0.62], [-20 * l, ty + B * 0.55], [-17 * l, by - 2], [-25 * l, by - 1.5]], 0.9), o.patch));
  if (o.spots !== undefined) {
    const g = rng(o.spots);
    let d = '';
    for (let i = 0; i < 15; i++) { const a = g.range(0, 6.283), rr = Math.sqrt(g.next()); d += circle(3 * l + Math.cos(a) * rr * 25 * l, by - B / 2 + Math.sin(a) * rr * B * 0.36, g.range(1.8, 4.2)); }
    d += circle(hx + hr * 0.3, hy - hr * 0.4, 2.6) + circle(hx + hr * 0.1, hy + hr * 0.4, 2) + circle(-21 * l, by + 8, 2.2) + circle(27 * l, by + 10, 2.4);
    out.push(sh(d, o.patch ?? INK));
  }
  if (o.socks) out.push(...nearLegs.map((_, i) => sh(xf(rect((i ? 27 * l : -21 * l) - lw / 2, -11, lw, 9, lw / 2) + ellipse((i ? 27 * l : -21 * l) - 2, -2.8, lw * 0.8, 3.4), { rot: i ? bk[0] : fr[0], ox: i ? 27 * l : -21 * l, oy: by - 4 }), o.socks!)));
  if (o.fluffy) {
    const g = rng(Math.round(s) + 7);
    let d = '';
    for (let i = 0; i < 14; i++) { const x = g.range(-24, 30) * l, y = g.range(ty + 4, by - 4); d += curve([[x - 4, y], [x, y + 3], [x + 4, y]]); }
    out.push(stroke(d, dk, 1.2, { opacity: 0.55 }));
  }
  if (o.muzzle) out.push(sh(blob([[hx - hr * 0.45, hy + hr * 0.0], [hx - hr * (0.9 + 0.66 * sn), hy + hr * 0.02], [nx + 1.2, hy + hr * 0.3], [hx - hr * (0.8 + 0.56 * sn), hy + hr * 0.56], [hx - hr * 0.3, hy + hr * 0.66]], 0.9), o.muzzle));
  if (o.mask) out.push(sh(ellipse(hx - hr * 0.2, hy - hr * 0.2, hr * 0.5, hr * 0.55), o.mask));
  if (o.beard) out.push(ol(blob([[nx + 1, hy + hr * 0.4], [hx - hr * 0.5, hy + hr * 0.5], [hx - hr * 0.7, hy + hr * 1.25], [nx + 2, hy + hr * 1.0]], 0.9), shade(col, 0.1), 1));
  // collar
  if (o.collar) {
    const ax = hx + hr * 0.55, ay = hy + hr * 0.55, bx = -21 * l, bY = ty + B * 0.32;
    const mx = ax + (bx - ax) * 0.42, my = ay + (bY - ay) * 0.42, ang = (Math.atan2(bY - ay, bx - ax) * 180) / Math.PI;
    out.push(ol(xf(rect(-2.8, -hr * 0.74, 5.6, hr * 1.5, 2), { rot: ang, x: mx, y: my }), o.collar, 1), ol(circle(mx - 3.5, my + hr * 0.72, 2.6), '#e8c04a', 0.8));
  }
  // face
  const earC = o.earCol ?? shade(col, -0.24);
  const ear = o.ear ?? 'flop';
  if (o.tongue) out.push(ol(ellipse(hx - hr * (0.62 + 0.3 * sn), hy + hr * 0.92, hr * 0.17, hr * 0.32, 8), '#e8798a', 0.8));
  out.push(stroke(curve([[hx - hr * (0.88 + 0.6 * sn), hy + hr * 0.5], [hx - hr * (0.6 + 0.3 * sn), hy + hr * 0.62], [hx - hr * 0.42, hy + hr * 0.5]]), INK, 1.1));
  out.push(sh(ellipse(nx + 1.4, hy + hr * 0.16, hr * 0.22, hr * 0.18), INK));
  out.push(sh(circle(hx - hr * 0.36, hy - hr * 0.2, hr * 0.13), INK), sh(circle(hx - hr * 0.4, hy - hr * 0.25, hr * 0.045), '#ffffff'));
  if (ear === 'flop') out.push(ol(blob([[hx + hr * 0.05, hy - hr * 0.85], [hx + hr * 0.75, hy - hr * 0.62], [hx + hr * 0.88, hy + hr * 0.45], [hx + hr * 0.45, hy + hr * 0.95], [hx + hr * 0.12, hy + hr * 0.3]], 1), earC, 1.2));
  else if (ear === 'long') out.push(ol(blob([[hx + hr * 0.05, hy - hr * 0.85], [hx + hr * 0.8, hy - hr * 0.6], [hx + hr * 0.95, hy + hr * 0.9], [hx + hr * 0.5, hy + hr * 1.65], [hx + hr * 0.1, hy + hr * 0.7]], 1), earC, 1.2));
  else if (ear === 'fold') out.push(ol(poly([[hx - hr * 0.1, hy - hr * 0.95], [hx + hr * 0.75, hy - hr * 0.9], [hx + hr * 0.05, hy - hr * 0.15]]), earC, 1.2));
  else out.push(ol(poly([[hx - hr * 0.1, hy - hr * 0.72], [hx + hr * 0.32, hy - hr * 1.8], [hx + hr * 0.82, hy - hr * 0.5]]), col, 1.2), sh(poly([[hx + hr * 0.1, hy - hr * 0.8], [hx + hr * 0.32, hy - hr * 1.5], [hx + hr * 0.62, hy - hr * 0.66]]), '#f0b8a8'));
  if (o.pom) {
    const pc = shade(col, 0.04);
    out.push(ol(circle(hx + hr * 0.15, hy - hr * 0.95, hr * 0.62), pc, 1.2), ol(circle(hx + hr * 0.75, hy + hr * 0.5, hr * 0.5), pc, 1.2));
    out.push(ol(circle(tx + 9, ty - 26, 6.5), pc, 1.2), ol(circle(-21 * l - 1, -9, 6), pc, 1.2), ol(circle(27 * l - 1, -9, 6), pc, 1.2), ol(circle(-6 * l, ty + 6, 9) + circle(-18 * l, ty + 10, 9), pc, 1.2));
  }
  if (o.item) out.push(...place(o.item, { x: hx - hr * (0.75 + 0.5 * sn), y: hy + hr * 0.55 }));
  return sc(out, s);
}

export interface PupOpt { patch?: string; ear?: 'flop' | 'point'; collar?: string; tongue?: boolean; earCol?: string; blaze?: boolean; bow?: string; eyePatch?: string; tail?: boolean }
/** Puppy sitting and facing the viewer, height s. */
export function pup(s: number, col: string, o: PupOpt = {}): Shape[] {
  const lt = o.patch ?? shade(col, 0.3), earC = o.earCol ?? shade(col, -0.25);
  const out: Shape[] = [shadow(0, 0, 32, 5)];
  if (o.tail !== false) out.push(...tube(curve([[20, -8], [36, -14], [40, -30]]), col, 6));
  const ear = o.ear ?? 'flop';
  if (ear === 'point') out.push(ol(poly([[-22, -80], [-18, -104], [-4, -88]]), col, 1.2), ol(poly([[22, -80], [18, -104], [4, -88]]), col, 1.2), sh(poly([[-18, -84], [-16.5, -97], [-9, -88]]) + poly([[18, -84], [16.5, -97], [9, -88]]), '#f0b8a8'));
  out.push(...uni([blob([[-24, 0], [-28, -28], [-16, -52], [16, -52], [28, -28], [24, 0]], 0.9), ellipse(-22, -5, 11, 6), ellipse(22, -5, 11, 6)], col));
  out.push(sh(ellipse(0, -30, 12, 19), lt));
  out.push(ol(rect(-13, -36, 11, 35, 5.5), col, 1.2), ol(rect(2, -36, 11, 35, 5.5), col, 1.2), sh(ellipse(-7.5, -4, 6.5, 4) + ellipse(7.5, -4, 6.5, 4), lt));
  if (o.collar) out.push(ol(rect(-15, -54, 30, 6.5, 3), o.collar, 1), ol(circle(0, -45, 3.6), '#e8c04a', 0.8));
  out.push(ol(ellipse(0, -72, 25, 22), col, 1.2));
  if (o.eyePatch) out.push(sh(ellipse(10, -76, 9, 9.5), o.eyePatch));
  if (o.blaze) out.push(sh(blob([[-3, -92], [3, -92], [5, -76], [0, -70], [-5, -76]], 0.9), lt));
  out.push(sh(ellipse(0, -63, 12.5, 9.5), lt));
  if (o.tongue) out.push(ol(ellipse(0, -55, 3.6, 5.5), '#e8798a', 0.8));
  out.push(sh(ellipse(0, -67, 4.6, 3.3), INK), stroke(line([[0, -64], [0, -60]]) + curve([[-6, -59], [-3, -57], [0, -60], [3, -57], [6, -59]]), INK, 1.1));
  out.push(sh(circle(-10, -76, 2.9) + circle(10, -76, 2.9), INK), sh(circle(-10.8, -77, 1) + circle(9.2, -77, 1), '#ffffff'));
  if (ear === 'flop') out.push(ol(blob([[-17, -91], [-29, -84], [-35, -62], [-27, -53], [-20, -68]], 1), earC, 1.2), ol(blob([[17, -91], [29, -84], [35, -62], [27, -53], [20, -68]], 1), earC, 1.2));
  if (o.bow) out.push(ol(poly([[0, -52], [-10, -58], [-10, -46]]) + poly([[0, -52], [10, -58], [10, -46]]), o.bow, 1), sh(circle(0, -52, 2.6), shade(o.bow, -0.25)));
  return sc(out, s);
}

// =====================================================================
// cats
// =====================================================================
export interface CatOpt { pat?: 'plain' | 'tabby' | 'tux' | 'calico' | 'siam'; eyes?: 'open' | 'closed'; eye?: string; lt?: string; head?: number; collar?: string }
const catLt = (col: string, o: CatOpt) => o.lt ?? (o.pat === 'tux' || o.pat === 'calico' ? '#fbf6ec' : shade(col, 0.45));
/** Cat face centred on (cx,cy), radius r (base units, not scaled). */
function catHead(cx: number, cy: number, r: number, col: string, o: CatOpt = {}): Shape[] {
  const dk = shade(col, -0.3), lt = catLt(col, o), pat = o.pat ?? 'plain';
  const earCol = pat === 'siam' ? '#5a4238' : pat === 'calico' ? '#e3924a' : col;
  const out: Shape[] = [];
  const earL = poly([[cx - r * 0.98, cy - r * 0.2], [cx - r * 0.84, cy - r * 1.32], [cx - r * 0.12, cy - r * 0.78]]);
  const earR = poly([[cx + r * 0.98, cy - r * 0.2], [cx + r * 0.84, cy - r * 1.32], [cx + r * 0.12, cy - r * 0.78]]);
  out.push(ol(earL, earCol, 1.2), ol(earR, pat === 'calico' ? '#4a4048' : earCol, 1.2));
  out.push(sh(poly([[cx - r * 0.82, cy - r * 0.5], [cx - r * 0.76, cy - r * 1.08], [cx - r * 0.36, cy - r * 0.78]]) + poly([[cx + r * 0.82, cy - r * 0.5], [cx + r * 0.76, cy - r * 1.08], [cx + r * 0.36, cy - r * 0.78]]), '#f2b8b0'));
  out.push(ol(ellipse(cx, cy, r * 1.06, r * 0.9), col, 1.2));
  if (pat === 'tabby') out.push(stroke(line([[cx, cy - r * 0.86], [cx, cy - r * 0.5]]) + line([[cx - r * 0.28, cy - r * 0.8], [cx - r * 0.22, cy - r * 0.52]]) + line([[cx + r * 0.28, cy - r * 0.8], [cx + r * 0.22, cy - r * 0.52]]) + line([[cx - r * 1.0, cy + r * 0.1], [cx - r * 0.72, cy + r * 0.16]]) + line([[cx + r * 1.0, cy + r * 0.1], [cx + r * 0.72, cy + r * 0.16]]) + line([[cx - r * 0.94, cy + r * 0.34], [cx - r * 0.7, cy + r * 0.34]]) + line([[cx + r * 0.94, cy + r * 0.34], [cx + r * 0.7, cy + r * 0.34]]), dk, r * 0.09));
  if (pat === 'calico') out.push(sh(blob([[cx - r * 0.9, cy - r * 0.3], [cx - r * 0.6, cy - r * 0.72], [cx - r * 0.1, cy - r * 0.8], [cx - r * 0.12, cy - r * 0.2], [cx - r * 0.6, cy + r * 0.05]], 0.9), '#e3924a'), sh(blob([[cx + r * 0.9, cy - r * 0.3], [cx + r * 0.6, cy - r * 0.72], [cx + r * 0.14, cy - r * 0.8], [cx + r * 0.16, cy - r * 0.25], [cx + r * 0.62, cy + r * 0.0]], 0.9), '#4a4048'));
  if (pat === 'siam') out.push(sh(ellipse(cx, cy + r * 0.14, r * 0.62, r * 0.6), '#5a4238'));
  if (pat === 'tux') out.push(sh(blob([[cx, cy - r * 0.6], [cx + r * 0.2, cy - r * 0.05], [cx + r * 0.66, cy + r * 0.35], [cx + r * 0.36, cy + r * 0.8], [cx - r * 0.36, cy + r * 0.8], [cx - r * 0.66, cy + r * 0.35], [cx - r * 0.2, cy - r * 0.05]], 0.9), lt));
  else out.push(sh(ellipse(cx, cy + r * 0.4, r * 0.44, r * 0.3), pat === 'siam' ? '#6a5046' : lt));
  if (o.eyes === 'closed') out.push(stroke(curve([[cx - r * 0.6, cy - r * 0.04], [cx - r * 0.42, cy + r * 0.08], [cx - r * 0.24, cy - r * 0.04]]) + curve([[cx + r * 0.24, cy - r * 0.04], [cx + r * 0.42, cy + r * 0.08], [cx + r * 0.6, cy - r * 0.04]]), INK, r * 0.08));
  else {
    const ec = o.eye ?? (pat === 'siam' ? '#6fb0e0' : '#b8cc4a');
    out.push(ol(ellipse(cx - r * 0.42, cy - r * 0.04, r * 0.2, r * 0.22) + ellipse(cx + r * 0.42, cy - r * 0.04, r * 0.2, r * 0.22), ec, 0.8, -0.5));
    out.push(sh(ellipse(cx - r * 0.42, cy - r * 0.04, r * 0.075, r * 0.19) + ellipse(cx + r * 0.42, cy - r * 0.04, r * 0.075, r * 0.19), INK), sh(circle(cx - r * 0.47, cy - r * 0.12, r * 0.05) + circle(cx + r * 0.37, cy - r * 0.12, r * 0.05), '#ffffff'));
  }
  out.push(sh(poly([[cx - r * 0.1, cy + r * 0.24], [cx + r * 0.1, cy + r * 0.24], [cx, cy + r * 0.37]]), '#e08a8a'));
  out.push(stroke(curve([[cx - r * 0.2, cy + r * 0.5], [cx - r * 0.08, cy + r * 0.55], [cx, cy + r * 0.38], [cx + r * 0.08, cy + r * 0.55], [cx + r * 0.2, cy + r * 0.5]]), INK, r * 0.05));
  const wc = pat === 'plain' && col === PET.white ? '#b8b0a4' : '#fbf6ec';
  out.push(stroke(line([[cx - r * 0.36, cy + r * 0.36], [cx - r * 1.22, cy + r * 0.26]]) + line([[cx - r * 0.36, cy + r * 0.46], [cx - r * 1.18, cy + r * 0.56]]) + line([[cx + r * 0.36, cy + r * 0.36], [cx + r * 1.22, cy + r * 0.26]]) + line([[cx + r * 0.36, cy + r * 0.46], [cx + r * 1.18, cy + r * 0.56]]), wc, 0.9, { opacity: 0.9 }));
  return out;
}
const bodyMarks = (col: string, o: CatOpt, pts: Pt[][], patches: [string, string][] = []): Shape[] => {
  const out: Shape[] = [];
  if (o.pat === 'tabby') out.push(stroke(pts.map((p) => curve(p)).join(''), shade(col, -0.3), 2.6));
  if (o.pat === 'calico') patches.forEach(([d, c]) => out.push(sh(d, c)));
  return out;
};
const tailCol = (col: string, o: CatOpt) => (o.pat === 'siam' ? '#5a4238' : o.pat === 'calico' ? '#4a4048' : col);

/** Cat sitting upright facing the viewer, height s. */
export function catSit(s: number, col: string, o: CatOpt = {}): Shape[] {
  const lt = catLt(col, o), hs = o.head ?? 1;
  const out: Shape[] = [shadow(0, 0, 32, 5)];
  out.push(...tube(curve([[18, -6], [38, -6], [42, -26], [34, -40]]), tailCol(col, o), 7));
  out.push(ol(blob([[-24, 0], [-27, -26], [-15, -55], [14, -55], [26, -26], [24, 0]], 0.9), col, 1.2));
  out.push(...bodyMarks(col, o, [[[-25, -22], [-19, -24], [-15, -20]], [[-23, -34], [-17, -35], [-13, -31]], [[25, -22], [19, -24], [15, -20]], [[23, -34], [17, -35], [13, -31]]], [[blob([[-24, -8], [-25, -30], [-14, -40], [-10, -18]], 0.9), '#e3924a'], [blob([[23, -6], [24, -26], [12, -30], [10, -10]], 0.9), '#4a4048']]));
  if (o.pat === 'tux' || o.pat === 'calico' || o.pat === 'plain' || !o.pat) out.push(sh(blob([[-8, -52], [8, -52], [11, -30], [0, -18], [-11, -30]], 0.9), lt));
  out.push(stroke(line([[-1, -30], [-1, -4]]), shade(col, -0.25), 1.2), ol(ellipse(-8, -4, 8.5, 4.6) + ellipse(8, -4, 8.5, 4.6), o.pat === 'siam' ? '#5a4238' : lt, 1, -0.2));
  if (o.collar) out.push(ol(rect(-13, -57, 26, 5.5, 2.5), o.collar, 1), ol(circle(0, -49, 3.4), '#e8c04a', 0.8));
  out.push(...catHead(0, -70 - (hs - 1) * 12, 21 * hs, col, o));
  return sc(out, s);
}

/** Cat tucked up like a loaf of bread, head at the left, width s. */
export function catLoaf(s: number, col: string, o: CatOpt = {}): Shape[] {
  const lt = catLt(col, o);
  const out: Shape[] = [shadow(0, 0, 50, 5)];
  out.push(ol(blob([[-44, 0], [-50, -20], [-36, -42], [8, -47], [38, -38], [50, -16], [44, 0]], 0.9), col, 1.2));
  out.push(...bodyMarks(col, o, [[[0, -46], [3, -38], [0, -30]], [[14, -45], [18, -36], [15, -28]], [[28, -41], [32, -33], [30, -25]], [[40, -34], [43, -27], [42, -20]]], [[blob([[2, -45], [30, -40], [34, -22], [8, -24]], 0.9), '#e3924a'], [blob([[36, -34], [48, -18], [44, -4], [30, -10]], 0.9), '#4a4048']]));
  out.push(...tube(curve([[44, -8], [36, -3], [10, -3]]), tailCol(col, o), 6));
  out.push(ol(ellipse(-34, -3.4, 8, 4) + ellipse(-17, -3.4, 8, 4), o.pat === 'siam' ? '#5a4238' : lt, 1, -0.2));
  out.push(...catHead(-30, -44, 19, col, o));
  return sc(out, s);
}

/** Cat lying along a shelf (y = 0) with a paw and its tail dangling below, head at the left, width s. */
export function catLie(s: number, col: string, o: CatOpt = {}): Shape[] {
  const lt = catLt(col, o);
  const out: Shape[] = [];
  out.push(...tube(curve([[42, -8], [52, 6], [50, 24], [44, 36]]), tailCol(col, o), 6.5));
  out.push(ol(blob([[-36, 0], [-44, -14], [-32, -30], [8, -34], [38, -27], [49, -10], [42, 0]], 0.9), col, 1.2));
  out.push(...bodyMarks(col, o, [[[2, -33], [5, -25], [2, -18]], [[16, -32], [19, -24], [17, -17]], [[30, -29], [33, -21], [31, -14]]], [[blob([[4, -32], [30, -28], [32, -12], [10, -14]], 0.9), '#e3924a'], [blob([[34, -26], [46, -12], [40, -3], [30, -8]], 0.9), '#4a4048']]));
  out.push(ol(rect(-22, -6, 9, 24, 4.5), col, 1.2), sh(ellipse(-17.5, 14, 4.6, 4.4), o.pat === 'siam' ? '#5a4238' : lt));
  out.push(ol(ellipse(-2, -3.6, 9, 4), lt, 1, -0.2));
  out.push(...catHead(-38, -27, 17, col, o));
  return sc(out, s);
}

/** Cat curled up asleep, width s. */
export function catCurl(s: number, col: string, o: CatOpt = {}): Shape[] {
  const o2: CatOpt = { ...o, eyes: 'closed' };
  const out: Shape[] = [shadow(0, 0, 44, 5)];
  out.push(ol(blob([[-40, -2], [-44, -20], [-26, -38], [8, -42], [34, -32], [44, -14], [38, -1], [0, 2]], 0.9), col, 1.2));
  out.push(...bodyMarks(col, o, [[[2, -41], [5, -33], [3, -26]], [[16, -39], [20, -31], [18, -24]], [[29, -33], [33, -26], [32, -19]]], [[blob([[0, -40], [26, -35], [30, -18], [8, -20]], 0.9), '#e3924a'], [blob([[32, -30], [42, -14], [36, -4], [26, -10]], 0.9), '#4a4048']]));
  out.push(...catHead(-22, -17, 15, col, o2));
  out.push(...tube(curve([[40, -10], [30, 0], [0, 1], [-18, -3]]), tailCol(col, o), 6.5));
  return sc(out, s);
}

/** Cat walking side-on facing left with its tail up, length s. */
export function catWalk(s: number, col: string, o: CatOpt = {}): Shape[] {
  const far = shade(col, -0.16), lt = catLt(col, o);
  const leg = (x: number, rot: number) => xf(rect(x - 3.2, -30, 6.4, 29, 3.2) + ellipse(x - 1.5, -2.4, 5, 2.6), { rot, ox: x, oy: -28 });
  const out: Shape[] = [shadow(2, 0, 38, 4)];
  out.push(ol(leg(-14, -12), far, 1.2), ol(leg(20, 14), far, 1.2));
  out.push(...tube(curve([[30, -42], [44, -52], [46, -72], [40, -86]]), tailCol(col, o), 5.5));
  out.push(...uni([blob([[-30, -40], [-12, -50], [20, -48], [34, -38], [32, -25], [0, -22], [-26, -25]], 0.9), leg(-22, 12), leg(28, -10)], col));
  out.push(...bodyMarks(col, o, [[[-4, -48], [-2, -40], [-5, -33]], [[9, -48], [12, -40], [10, -32]], [[22, -45], [25, -38], [24, -31]]], [[blob([[-6, -47], [16, -46], [18, -30], [-2, -28]], 0.9), '#e3924a'], [blob([[20, -44], [32, -36], [30, -27], [20, -28]], 0.9), '#4a4048']]));
  out.push(sh(ellipse(-23.5, -2.4, 5, 2.6) + ellipse(26.5, -2.4, 5, 2.6), o.pat === 'siam' ? '#5a4238' : lt, { opacity: 0.9 }));
  out.push(...catHead(-34, -50, 15, col, o));
  return sc(out, s);
}

/** Cat peeking over an edge at y = 0: head and two paws. s is the head width. */
export function catPeek(s: number, col: string, o: CatOpt = {}): Shape[] {
  const lt = catLt(col, o);
  const out: Shape[] = [...catHead(0, -30, 44, col, o)];
  out.push(ol(ellipse(-30, -3, 15, 10) + ellipse(30, -3, 15, 10), o.pat === 'siam' ? '#5a4238' : lt, 1.2, -0.25));
  out.push(stroke(line([[-34, -1], [-34, 5]]) + line([[-27, -1], [-27, 5]]) + line([[34, -1], [34, 5]]) + line([[27, -1], [27, 5]]), shade(lt, -0.3), 1.2));
  return sc(out, s);
}

// =====================================================================
// small animals
// =====================================================================
/** Fish facing left, length s, origin centre. */
export function fish(s: number, col: string, fin = shade(col, 0.25)): Shape[] {
  return sc([
    ol(poly([[18, 0], [48, -22], [40, 0], [48, 22]]), fin, 1, -0.35),
    sh(poly([[-10, -16], [8, -32], [14, -12]]) + poly([[-8, 16], [4, 28], [10, 12]]), fin),
    ol(blob([[-48, 0], [-22, -20], [10, -15], [24, 0], [10, 15], [-22, 20]], 1), col, 1.2, -0.35),
    sh(blob([[-30, 4], [-10, 12], [8, 8], [-6, 16], [-24, 14]], 1), '#ffffff', { opacity: 0.3 }),
    stroke(curve([[-18, -14], [-12, 0], [-18, 14]]), shade(col, -0.3), 1.6),
    sh(leaf(-8, 2, 16, 5, 20), fin),
    sh(circle(-33, -4, 4.6), '#ffffff'), sh(circle(-34, -4, 2.4), INK),
  ], s);
}

/** Round goldfish bowl with one fish, height s. */
export function fishBowl(s: number, fishCol = '#f08a2a'): Shape[] {
  const out: Shape[] = [shadow(0, 0, 36, 5)];
  out.push(sh(circle(0, -44, 44), '#cfeaf0', { opacity: 0.75 }));
  out.push(sh(blob([[-41, -56], [-20, -60], [0, -56], [20, -60], [41, -56], [40, -24], [22, -4], [-22, -4], [-40, -24]], 0.8), '#8fd0dc', { opacity: 0.85 }));
  let gr = '';
  const g = rng(4);
  for (let i = 0; i < 16; i++) gr += circle(g.range(-22, 22), g.range(-9, -3), g.range(2.4, 4));
  out.push(sh(gr, '#e8cfa0'), sh(leaf(-14, -6, 34, 5, -80) + leaf(-10, -6, 26, 5, -100) + leaf(-18, -6, 22, 4, -66), '#5c9a5a'));
  out.push(...place(fish(40, fishCol), { x: 8, y: -34 }));
  out.push(stroke(circle(-22, -40, 2) + circle(-26, -50, 1.4), '#ffffff', 1, { opacity: 0.8 }));
  out.push(stroke(circle(0, -44, 44), '#7aa0aa', 1.6), ol(ellipse(0, -84, 24, 5), '#dff2f5', 1.4, -0.35), hl(blob([[-34, -62], [-28, -74], [-20, -78], [-30, -56]], 1), 0.7));
  return sc(out, s);
}

export interface TankOpt { fishCols?: string[]; n?: number; castle?: boolean; lid?: string }
/** Rectangular aquarium w × h with gravel, plants and fish; origin bottom centre (not scaled from a base size). */
export function fishTank(w: number, h: number, seed: number, o: TankOpt = {}): Shape[] {
  const g = rng(seed);
  const x0 = -w / 2, lid = o.lid ?? '#3b3532';
  const out: Shape[] = [];
  out.push(sh(rect(x0, -h, w, h), '#7cc4d0'), sh(rect(x0, -h, w, h * 0.3), '#a4dce2'), sh(rect(x0, -h * 0.34, w, h * 0.34), '#62aebe'));
  // light rays
  let rays = '';
  for (let i = 0; i < 4; i++) { const x = x0 + w * (0.12 + i * 0.25); rays += poly([[x, -h], [x + w * 0.06, -h], [x - w * 0.02, -h * 0.2], [x - w * 0.12, -h * 0.2]]); }
  out.push(sh(rays, '#ffffff', { opacity: 0.1 }));
  // back plants
  let p1 = '', p2 = '';
  for (let i = 0; i < 7; i++) { const x = x0 + g.range(8, w - 8), hh = g.range(h * 0.3, h * 0.7); for (let k = 0; k < 4; k++) { const d = leaf(x + k * 3 - 5, -h * 0.1, hh * g.range(0.6, 1), 4.5, -90 + g.range(-22, 22)); if (i % 2) p1 += d; else p2 += d; } }
  out.push(sh(p1, '#3f8f6a'), sh(p2, '#5aa860'));
  if (o.castle !== false) {
    const cx = x0 + w * 0.72, cw = Math.min(w * 0.22, h * 0.5);
    out.push(ol(rect(cx - cw / 2, -h * 0.12 - cw * 0.9, cw, cw * 0.9) + rect(cx - cw * 0.62, -h * 0.12 - cw * 1.3, cw * 0.36, cw * 1.3) + rect(cx + cw * 0.26, -h * 0.12 - cw * 1.15, cw * 0.36, cw * 1.15), '#c9a8a0', 1, -0.3));
    out.push(sh(poly([[cx - cw * 0.68, -h * 0.12 - cw * 1.3], [cx - cw * 0.44, -h * 0.12 - cw * 1.72], [cx - cw * 0.2, -h * 0.12 - cw * 1.3]]) + poly([[cx + cw * 0.2, -h * 0.12 - cw * 1.15], [cx + cw * 0.44, -h * 0.12 - cw * 1.55], [cx + cw * 0.68, -h * 0.12 - cw * 1.15]]), '#c8473a'));
    out.push(sh(rect(cx - cw * 0.14, -h * 0.12 - cw * 0.5, cw * 0.28, cw * 0.5, cw * 0.14) + rect(cx - cw * 0.5, -h * 0.12 - cw * 0.95, cw * 0.12, cw * 0.2, 2) + rect(cx + cw * 0.38, -h * 0.12 - cw * 0.85, cw * 0.12, cw * 0.2, 2), '#3a5a68'));
  }
  // gravel
  const gcols = ['#e8cfa0', '#d9b888', '#f2e0b8', '#c8a878'];
  const gd = gcols.map(() => '');
  for (let x = x0 + 3; x < w / 2 - 2; x += 5) for (let r = 0; r < 3; r++) gd[g.int(0, 3)] += circle(Math.min(w / 2 - 4, x + g.range(-2, 2)), -3 - r * 5 - g.range(0, 3), g.range(2.6, 4.2));
  out.push(sh(rect(x0, -h * 0.1, w, h * 0.1), '#d9b888'), ...gd.map((d, i) => sh(d, gcols[i])));
  // rocks
  out.push(ol(blob([[x0 + w * 0.2, -4], [x0 + w * 0.22, -h * 0.2], [x0 + w * 0.3, -h * 0.26], [x0 + w * 0.37, -h * 0.16], [x0 + w * 0.36, -4]], 0.9), '#8a8f98', 1), ol(blob([[x0 + w * 0.32, -4], [x0 + w * 0.34, -h * 0.13], [x0 + w * 0.41, -h * 0.14], [x0 + w * 0.43, -4]], 0.9), '#a4a8b0', 1));
  // fish
  const cols = o.fishCols ?? ['#f08a2a', '#f2c84a', '#e85a5a', '#5a8ae0', '#f6f0e6', '#b07ad8'];
  const n = o.n ?? Math.max(3, Math.round(w / 34));
  for (let i = 0; i < n; i++) {
    const fx = x0 + w * ((i + 0.5) / n) + g.range(-6, 6), fy = -h * g.range(0.3, 0.82), fs = Math.min(h * 0.3, g.range(20, 32)), flip = g.next() < 0.45 ? -1 : 1;
    out.push(...place(fish(fs, cols[(i + seed) % cols.length]), { x: Math.max(x0 + fs * 0.6, Math.min(w / 2 - fs * 0.6, fx)), y: fy, sx: flip, sy: 1 }));
  }
  // bubbles
  let bub = '';
  for (let i = 0; i < 9; i++) bub += circle(x0 + w * 0.12 + g.range(-5, 5), -h * (0.2 + i * 0.08), g.range(1.4, 3.2));
  out.push(stroke(bub, '#ffffff', 1, { opacity: 0.85 }));
  // glass, frame
  out.push(hl(poly([[x0 + w * 0.08, -h], [x0 + w * 0.16, -h], [x0 + w * 0.06, -h * 0.1], [x0 + w * 0.0, -h * 0.1]]), 0.14));
  out.push(stroke(rect(x0, -h, w, h), '#5a8a98', 1.6), stroke(line([[x0, -h * 0.9], [w / 2, -h * 0.9]]), '#ffffff', 1.2, { opacity: 0.6 }));
  out.push(ol(rect(x0 - 3, -h - 9, w + 6, 10, 2), lid, 1), sh(rect(x0 - 3, -h - 9, w + 6, 3, 1.5), shade(lid, 0.2)), ol(rect(x0 - 3, -3, w + 6, 6, 2), lid, 1));
  return out;
}

/** Budgie perched facing left, height s; origin at its feet. */
export function parakeet(s: number, col = '#7ac74a', head = '#f6e060'): Shape[] {
  return sc([
    ol(poly([[10, -34], [22, 30], [30, 28], [24, -30]]), shade(col, -0.25), 1),
    ol(blob([[-16, -50], [-4, -66], [14, -62], [24, -40], [18, -12], [4, -2], [-10, -14]], 1), col, 1.2),
    ol(circle(-4, -70, 15), head, 1.2),
    ol(blob([[4, -52], [18, -50], [24, -26], [16, -6], [8, -22]], 1), shade(col, -0.15), 1),
    stroke(curve([[8, -44], [14, -40], [20, -42]]) + curve([[9, -34], [15, -30], [21, -32]]) + curve([[10, -24], [15, -20], [20, -22]]), shade(col, -0.45), 1.3),
    stroke(curve([[2, -80], [8, -78], [10, -72]]) + curve([[-2, -84], [6, -84], [12, -78]]), shade(head, -0.35), 1.1),
    ol(blob([[-17, -74], [-24, -70], [-22, -62], [-15, -66]], 1), '#e8a04a', 0.8),
    sh(circle(-13, -64, 2.6), '#5a7ad8'),
    sh(circle(-9, -74, 2.6), INK), sh(circle(-9.8, -75, 0.9), '#ffffff'),
    stroke(line([[-2, -4], [-6, 0]]) + line([[4, -3], [2, 0]]) + line([[-9, 0], [6, 0]]), '#c98a7a', 2),
  ], s);
}

/** Hamster sitting up, facing left, height s. */
export function hamster(s: number, col = '#e0a860'): Shape[] {
  const lt = '#fbf0dc';
  return sc([
    shadow(0, 0, 34, 5),
    ol(circle(20, -66, 9), shade(col, -0.1), 1.2), sh(circle(20, -66, 5), '#f2b8b0'),
    ol(blob([[-30, 0], [-38, -30], [-28, -62], [0, -74], [28, -58], [38, -28], [30, 0]], 0.9), col, 1.2),
    sh(blob([[-34, -22], [-30, -46], [-10, -40], [-6, -10], [-24, -2]], 0.9), lt),
    ol(circle(-2, -70, 9), shade(col, -0.1), 1.2), sh(circle(-2, -70, 5), '#f2b8b0'),
    sh(ellipse(-26, -36, 10, 9), '#f6c8b8', { opacity: 0.7 }),
    sh(circle(-18, -50, 4), INK), sh(circle(-19.2, -51.4, 1.3), '#ffffff'),
    sh(ellipse(-37, -40, 3.4, 2.8), '#e08a8a'),
    stroke(line([[-34, -36], [-48, -40]]) + line([[-34, -33], [-48, -30]]), '#fbf6ec', 1),
    ol(ellipse(-24, -18, 7, 4.5, -20), lt, 1, -0.25), ol(ellipse(-20, -3, 9, 4), lt, 1, -0.25), ol(ellipse(12, -3, 10, 4), lt, 1, -0.25),
  ], s);
}

/** Small turtle facing left, length s. */
export function turtle(s: number, shell = '#5c8a4e'): Shape[] {
  return sc([
    shadow(0, 0, 44, 5),
    ol(ellipse(-26, -6, 8, 6) + ellipse(22, -6, 8, 6), '#9ab86a', 1.2),
    ol(blob([[-36, -18], [-52, -26], [-56, -16], [-46, -8], [-34, -10]], 1), '#a8c474', 1.2),
    ol(poly([[30, -10], [44, -6], [32, -4]]), '#9ab86a', 1),
    ol(blob([[-36, -8], [-32, -32], [-6, -46], [22, -38], [36, -12], [30, -6]], 0.9), shell, 1.4),
    stroke(poly([[-12, -40], [4, -42], [10, -30], [-2, -22], [-16, -28]]) + line([[10, -30], [26, -30]]) + line([[-16, -28], [-30, -24]]) + line([[-2, -22], [-2, -8]]) + line([[4, -42], [10, -44]]), shade(shell, -0.35), 1.6),
    sh(ellipse(-4, -9, 32, 3.6), shade(shell, 0.3)),
    sh(circle(-49, -20, 2), INK),
  ], s);
}

// =====================================================================
// pet-shop furniture and goods
// =====================================================================
/** Back of a domed wire bird cage (bars behind the bird). Draw the bird, then birdCageFront. */
export function birdCageBack(w: number, h: number, col = '#c9a24a'): Shape[] {
  const hw = w / 2, bh = h * 0.1, dome = h * 0.6;
  let bars = '';
  for (let i = 1; i < 6; i += 2) { const x = -hw + (w * i) / 6; bars += `M${x} ${-bh}L${x} ${-dome}Q${x} ${-h * 0.94} 0 ${-h * 0.96}`; }
  return [
    sh(rect(-hw, -dome, w, dome - bh) + `M${-hw} ${-dome}Q${-hw} ${-h * 0.96} 0 ${-h * 0.96}Q${hw} ${-h * 0.96} ${hw} ${-dome}Z`, '#ffffff', { opacity: 0.16 }),
    stroke(bars, shade(col, -0.25), 1.6),
    stroke(line([[-hw * 0.62, -h * 0.34], [hw * 0.62, -h * 0.34]]), '#8a5a36', 4),
    stroke(line([[-hw * 0.2, -h * 0.94], [-hw * 0.2, -h * 0.66]]) + line([[hw * 0.2, -h * 0.94], [hw * 0.2, -h * 0.66]]) + line([[-hw * 0.26, -h * 0.66], [hw * 0.26, -h * 0.66]]), shade(col, -0.35), 1.6),
  ];
}
export function birdCageFront(w: number, h: number, col = '#c9a24a'): Shape[] {
  const hw = w / 2, bh = h * 0.1, dome = h * 0.6;
  let bars = '';
  for (let i = 0; i <= 6; i += 2) { const x = -hw + (w * i) / 6; bars += `M${x} ${-bh}L${x} ${-dome}Q${x} ${-h * 0.94} 0 ${-h * 0.96}`; }
  return [
    stroke(bars + line([[-hw, -dome], [hw, -dome]]) + line([[-hw, -h * 0.32], [hw, -h * 0.32]]), col, 2),
    ol(rect(-hw - 4, -bh, w + 8, bh, 3), col, 1.2), sh(rect(-hw - 4, -bh, w + 8, bh * 0.3, 2), shade(col, 0.25)),
    ol(rect(-hw * 0.28, -bh - h * 0.07, hw * 0.56, h * 0.07, 2), '#f6efe0', 1),
    ol(circle(0, -h * 0.97, w * 0.05), col, 1.2), stroke(circle(0, -h * 1.04, w * 0.07), shade(col, -0.2), 2.4),
  ];
}

/** Hamster wheel, radius r, origin centre. */
export function hamsterWheel(r: number, col = '#e8798a'): Shape[] {
  let sp = '';
  for (let i = 0; i < 6; i++) { const a = (i * Math.PI) / 3; sp += line([[0, 0], [Math.cos(a) * r * 0.9, Math.sin(a) * r * 0.9]]); }
  let rungs = '';
  for (let i = 0; i < 20; i++) { const a = (i * Math.PI) / 10; rungs += line([[Math.cos(a) * r * 0.84, Math.sin(a) * r * 0.84], [Math.cos(a) * r, Math.sin(a) * r]]); }
  return [
    stroke(line([[0, 0], [-r * 0.62, r * 1.16]]) + line([[0, 0], [r * 0.62, r * 1.16]]) + line([[-r * 0.8, r * 1.16], [r * 0.8, r * 1.16]]), shade(col, -0.35), r * 0.09),
    sh(circle(0, 0, r), '#ffffff', { opacity: 0.25 }),
    stroke(sp, shade(col, -0.15), r * 0.045), stroke(rungs, shade(col, -0.3), 1.2),
    stroke(circle(0, 0, r * 0.92), col, r * 0.16), stroke(circle(0, 0, r), shade(col, -0.3), 1.2), ol(circle(0, 0, r * 0.12), '#fbf6ec', 1),
  ];
}

/** Wire hamster cage with a wheel, a little house, a water bottle and a hamster; w × h. */
export function hamsterCage(w: number, h: number, base = '#4f86c0', wheel = '#e8798a'): Shape[] {
  const hw = w / 2, bh = h * 0.24;
  const g = rng(9);
  let bars = '', bed = '';
  for (let x = -hw + 6; x < hw - 2; x += 9) bars += line([[x, -h], [x, -bh]]);
  for (let i = 0; i < 26; i++) bed += xf(rect(-4, -1.2, 8, 2.4, 1), { rot: g.range(-40, 40), x: g.range(-hw + 8, hw - 8), y: -bh + g.range(-5, 1) });
  const out: Shape[] = [shadow(0, 0, hw, 5), sh(rect(-hw, -h, w, h - bh), '#fbf6ec', { opacity: 0.35 })];
  out.push(...place(hamsterWheel(h * 0.22, wheel), { x: -hw * 0.5, y: -bh - h * 0.31 }));
  // little house
  const hx = hw * 0.48, hs = h * 0.26;
  out.push(ol(rect(hx - hs * 0.6, -bh - hs * 0.7, hs * 1.2, hs * 0.7), '#d9a86c', 1), ol(poly([[hx - hs * 0.78, -bh - hs * 0.7], [hx, -bh - hs * 1.25], [hx + hs * 0.78, -bh - hs * 0.7]]), '#c8473a', 1), sh(rect(hx - hs * 0.2, -bh - hs * 0.46, hs * 0.4, hs * 0.46, hs * 0.2), '#5a3a24'));
  out.push(sh(bed, '#f2dcae'));
  out.push(...place(hamster(h * 0.24), { x: 2, y: -bh + 1 }));
  // water bottle
  out.push(ol(rect(hw - 13, -h * 0.86, 10, h * 0.3, 4), '#cfeaf0', 1, -0.4), sh(rect(hw - 13, -h * 0.72, 10, h * 0.16, 3), '#8fd0dc'), stroke(line([[hw - 8, -h * 0.56], [hw - 16, -h * 0.5]]), '#9aa2a8', 2.4), sh(rect(hw - 13, -h * 0.88, 10, 5, 2), '#c8473a'));
  out.push(stroke(bars + line([[-hw, -h * 0.66], [hw, -h * 0.66]]), '#aab2b8', 1.3), stroke(rect(-hw, -h, w, h - bh, 4), '#8a9298', 2));
  out.push(ol(`M${-hw - 4} ${-bh}L${hw + 4} ${-bh}L${hw - 2} 0L${-hw + 2} 0Z`, base, 1.2), sh(rect(-hw - 4, -bh, w + 8, bh * 0.22, 2), shade(base, 0.22)), sh(pawPrint(0, -bh * 0.42, bh * 0.2), shade(base, 0.35)));
  out.push(stroke(`M${-hw * 0.4} ${-h}Q0 ${-h * 1.22} ${hw * 0.4} ${-h}`, '#8a9298', 3));
  return out;
}

/** Round pet bed: draw petBed, then the animal, then petBedFront. Width w. */
export function petBed(w: number, col: string): Shape[] {
  const hw = w / 2;
  return [shadow(0, 0, hw * 1.02, w * 0.06), ol(ellipse(0, -w * 0.2, hw, w * 0.22), shade(col, -0.12), 1.2), sh(ellipse(0, -w * 0.18, hw * 0.8, w * 0.13), shade(col, 0.32)), stroke(ellipse(0, -w * 0.18, hw * 0.8, w * 0.13), shade(col, -0.2), 1)];
}
export function petBedFront(w: number, col: string, trim = '#fbf6ec'): Shape[] {
  const hw = w / 2;
  const front = `M${-hw} ${-w * 0.2}Q${-hw} ${-w * 0.02} ${-hw * 0.7} 0L${hw * 0.7} 0Q${hw} ${-w * 0.02} ${hw} ${-w * 0.2}Q${hw * 0.9} ${-w * 0.07} 0 ${-w * 0.06}Q${-hw * 0.9} ${-w * 0.07} ${-hw} ${-w * 0.2}Z`;
  let st = '';
  for (let i = 1; i < 8; i++) { const x = -hw + (w * i) / 8; st += line([[x, -w * 0.065 - Math.abs(x / hw) ** 2 * w * 0.05], [x * 0.94, -1]]); }
  return [ol(front, col, 1.2), stroke(st, shade(col, -0.18), 1.2, { opacity: 0.7 }), stroke(`M${-hw * 0.94} ${-w * 0.1}Q0 ${-w * 0.01} ${hw * 0.94} ${-w * 0.1}`, trim, 2.2, { opacity: 0.85 })];
}

/** Leash hanging from a hook; origin at the hook, length l. */
export function leash(l: number, col: string): Shape[] {
  return [
    ...tube(ellipse(0, l * 0.13, l * 0.075, l * 0.13), col, l * 0.035),
    ...tube(curve([[0, l * 0.26], [l * 0.03, l * 0.5], [-l * 0.02, l * 0.82]]), col, l * 0.04),
    stroke(line([[-l * 0.018, l * 0.3], [l * 0.012, l * 0.5]]) + line([[l * 0.016, l * 0.56], [-l * 0.006, l * 0.74]]), shade(col, 0.35), 1, { opacity: 0.8 }),
    ol(rect(-l * 0.045, l * 0.82, l * 0.05, l * 0.07, 2), '#c9d0d5', 1, -0.4),
    stroke(ellipse(-l * 0.02, l * 0.94, l * 0.028, l * 0.05), '#aab2b8', 2.4),
  ];
}

/** Buckled collar with a tag, lying flat as a ring; origin centre, width s. */
export function collar(s: number, col: string, tag = '#e8c04a'): Shape[] {
  let holes = '';
  for (let i = 0; i < 3; i++) holes += circle(-s * 0.3 + i * s * 0.09, s * 0.19 - i * s * 0.022, s * 0.016);
  return [
    stroke(ellipse(0, 0, s * 0.44, s * 0.24), shade(col, -0.3), s * 0.13 + 2), stroke(ellipse(0, 0, s * 0.44, s * 0.24), col, s * 0.13),
    stroke(ellipse(0, 0, s * 0.44, s * 0.24), shade(col, 0.3), 1, { opacity: 0.7 }),
    sh(holes, shade(col, -0.45)),
    ol(rect(s * 0.02, s * 0.15, s * 0.16, s * 0.17, 2), '#c9d0d5', 1.2, -0.4), sh(rect(s * 0.06, s * 0.185, s * 0.08, s * 0.1, 1), col),
    stroke(line([[-s * 0.08, s * 0.3], [-s * 0.08, s * 0.38]]), '#aab2b8', 1.6), ol(bonePathAt(-s * 0.08, s * 0.44, s * 0.24), tag, 1, -0.35),
  ];
}
const bonePathAt = (x: number, y: number, l: number) => xf(bonePath(l), { x, y });

/** Dog bone biscuit/toy, length l, origin centre. */
export function bone(l: number, col = '#f2e6cc'): Shape[] {
  const d = bonePath(l);
  return [stroke(d, shade(col, -0.32), 2.2), sh(rect(-l * 0.34, -l * 0.08, l * 0.68, l * 0.16), col), sh(d, col), hl(rect(-l * 0.26, -l * 0.05, l * 0.4, l * 0.03, 1), 0.6)];
}

export type Icon = 'paw' | 'bone' | 'fish' | 'heart';
const iconPath = (icon: Icon, x: number, y: number, r: number) => (icon === 'paw' ? pawPrint(x, y, r * 0.62) : icon === 'bone' ? xf(bonePath(r * 1.8), { x, y, rot: -18 }) : icon === 'fish' ? xf(fishPath(r * 1.8), { x, y }) : heartPath(x, y, r * 0.75));

/** Stand-up bag of pet food, w × h. */
export function foodBag(w: number, h: number, col: string, icon: Icon = 'paw', accent = '#fbf6ec'): Shape[] {
  const hw = w / 2;
  const body = `M${-hw * 0.92} 0L${-hw} ${-h * 0.86}Q${-hw * 0.5} ${-h * 0.9} 0 ${-h * 0.86}Q${hw * 0.5} ${-h * 0.9} ${hw} ${-h * 0.86}L${hw * 0.92} 0Z`;
  return [
    ol(body, col, 1.2),
    sh(`M${hw * 0.5} ${-h * 0.87}L${hw} ${-h * 0.86}L${hw * 0.92} 0L${hw * 0.46} 0Z`, '#000000', { opacity: 0.1 }),
    ol(rect(-hw, -h, w, h * 0.14, 2), shade(col, -0.12), 1.2), stroke(line([[-hw + 2, -h * 0.94], [hw - 2, -h * 0.94]]), shade(col, -0.35), 1),
    sh(rect(-hw * 0.96, -h * 0.26, w * 0.96, h * 0.1), shade(col, -0.2)),
    sh(circle(0, -h * 0.55, w * 0.3), accent), sh(iconPath(icon, 0, -h * 0.55, w * 0.2), shade(col, -0.25)),
    stroke(line([[-hw * 0.5, -h * 0.17], [hw * 0.5, -h * 0.17]]) + line([[-hw * 0.32, -h * 0.1], [hw * 0.32, -h * 0.1]]), accent, 2, { opacity: 0.85 }),
    hl(rect(-hw * 0.84, -h * 0.8, w * 0.06, h * 0.66, 2), 0.22),
  ];
}

/** Tin of pet food, height s. */
export function foodCan(s: number, col: string, icon: Icon = 'fish'): Shape[] {
  const w = s * 0.92;
  return [
    ol(rect(-w / 2, -s, w, s, 2), '#c9d0d5', 1, -0.4),
    sh(rect(-w / 2, -s * 0.84, w, s * 0.68), col), sh(ellipse(0, -s * 0.5, w * 0.34, s * 0.26), '#fbf6ec'), sh(iconPath(icon, 0, -s * 0.5, s * 0.2), shade(col, -0.25)),
    ol(ellipse(0, -s, w / 2, s * 0.09), '#dfe5e8', 0.8, -0.35), hl(rect(-w * 0.42, -s * 0.82, w * 0.08, s * 0.64, 1), 0.3),
  ];
}

/** Pet bowl with a motif, optionally filled; width w. */
export function petBowl(w: number, col: string, food?: string, icon: Icon = 'bone'): Shape[] {
  const hw = w / 2, h = w * 0.36;
  const out: Shape[] = [shadow(0, 0, hw * 0.98, w * 0.05)];
  if (food) {
    const g = rng(Math.round(w));
    let k = '';
    for (let i = 0; i < 16; i++) k += circle(g.range(-hw * 0.62, hw * 0.62), -h - g.range(-1, w * 0.07), w * 0.05);
    out.push(sh(ellipse(0, -h, hw * 0.74, w * 0.08), food), ol(k, food, 0.8, -0.25));
  }
  out.push(ol(`M${-hw * 0.78} ${-h}L${hw * 0.78} ${-h}L${hw} 0L${-hw} 0Z`, col, 1.2), sh(`M${hw * 0.3} ${-h}L${hw * 0.78} ${-h}L${hw} 0L${hw * 0.36} 0Z`, '#000000', { opacity: 0.1 }));
  out.push(ol(rect(-hw * 0.82, -h - w * 0.04, w * 0.82, w * 0.07, w * 0.03), shade(col, 0.15), 1));
  out.push(sh(iconPath(icon, 0, -h * 0.45, h * 0.36), '#fbf6ec'));
  return out;
}

/** Glass treat jar full of bone biscuits, height s. */
export function treatJar(s: number, lid = '#c8473a'): Shape[] {
  const g = rng(23);
  const out: Shape[] = [shadow(0, 0, s * 0.36, s * 0.05), sh(rect(-s * 0.34, -s * 0.8, s * 0.68, s * 0.8, s * 0.12), '#dfeef0', { opacity: 0.6 })];
  for (let i = 0; i < 9; i++) out.push(...place(bone(s * 0.3, i % 3 ? '#d9a860' : '#c98a4a'), { x: g.range(-s * 0.16, s * 0.16), y: -s * (0.1 + (i / 9) * 0.56), rot: g.range(-60, 60) }));
  out.push(stroke(rect(-s * 0.34, -s * 0.8, s * 0.68, s * 0.8, s * 0.12), '#8aa0a8', 1.4), hl(rect(-s * 0.27, -s * 0.72, s * 0.06, s * 0.6, 3), 0.6));
  out.push(ol(rect(-s * 0.2, -s * 0.48, s * 0.4, s * 0.24, 3), '#fbf6ec', 1, -0.25), sh(pawPrint(0, -s * 0.36, s * 0.07), lid));
  out.push(ol(rect(-s * 0.37, -s * 0.9, s * 0.74, s * 0.12, 4), lid, 1.2), ol(circle(0, -s * 0.95, s * 0.07), shade(lid, -0.15), 1));
  return out;
}

/** Knotted rope tug toy, length l, origin centre. */
export function ropeToy(l: number, a = '#e85a5a', b = '#fbf6ec'): Shape[] {
  let tw = '', fray = '';
  for (let i = 0; i < 9; i++) { const x = -l * 0.26 + i * l * 0.065; tw += line([[x - l * 0.02, -l * 0.06], [x + l * 0.02, l * 0.06]]); }
  for (let i = 0; i < 5; i++) { fray += line([[-l * 0.42, (i - 2) * l * 0.03], [-l * 0.5, (i - 2) * l * 0.05]]) + line([[l * 0.42, (i - 2) * l * 0.03], [l * 0.5, (i - 2) * l * 0.05]]); }
  return [
    stroke(fray, b, l * 0.03), stroke(fray, shade(a, -0.1), 1),
    ol(rect(-l * 0.3, -l * 0.065, l * 0.6, l * 0.13, l * 0.06), b, 1.2), stroke(tw, a, l * 0.035),
    ol(circle(-l * 0.33, 0, l * 0.11), a, 1.2), ol(circle(l * 0.33, 0, l * 0.11), a, 1.2),
    stroke(curve([[-l * 0.4, -l * 0.04], [-l * 0.33, l * 0.03], [-l * 0.26, -l * 0.04]]) + curve([[l * 0.26, -l * 0.04], [l * 0.33, l * 0.03], [l * 0.4, -l * 0.04]]), b, l * 0.03),
  ];
}

/** Rubber duck squeaky toy, height s. */
export function rubberDuck(s: number, col = '#f6cf3a'): Shape[] {
  return sc([
    shadow(0, 0, 40, 5),
    ol(blob([[-40, -22], [-34, -6], [0, 0], [34, -6], [48, -34], [30, -30], [10, -40], [-20, -40]], 0.9), col, 1.4),
    ol(circle(-20, -62, 24), col, 1.4),
    ol(blob([[-40, -62], [-58, -58], [-56, -50], [-40, -52]], 0.9), '#f08a2a', 1.2),
    sh(leaf(-4, -22, 34, 9, 10), shade(col, -0.14)),
    sh(circle(-26, -68, 4), INK), sh(circle(-27.4, -69.4, 1.4), '#ffffff'),
    hl(ellipse(-12, -76, 8, 4, -20), 0.5),
  ], s);
}

/** Felt toy mouse with a string tail, length s, nose to the left. */
export function toyMouse(s: number, col = '#9aa2b0'): Shape[] {
  return sc([
    stroke(curve([[30, -8], [46, -4], [52, -18], [44, -26]]), '#e8798a', 2.6),
    ol(circle(8, -30, 10), '#e89ab0', 1.2),
    ol(blob([[-44, -4], [-20, -22], [10, -28], [30, -18], [34, -4], [20, 0], [-30, 0]], 0.9), col, 1.4),
    ol(circle(-2, -28, 10), '#e89ab0', 1.2), sh(circle(-2, -28, 5.4), '#f6c8d0'),
    sh(circle(-44, -4, 3.4), '#e8798a'), sh(circle(-24, -12, 2.8), INK),
    stroke(line([[-38, -5], [-50, -12]]) + line([[-38, -3], [-52, -2]]), INK, 0.9),
    stroke(curve([[2, -14], [8, -8], [4, -2]]) + curve([[14, -16], [20, -10], [16, -3]]), shade(col, -0.3), 1.4),
  ], s);
}

/** Feather teaser wand; origin at the handle end, wand pointing up and to the right, length l. */
export function featherWand(l: number, col = '#e85a8a'): Shape[] {
  const tx = l * 0.62, ty = -l * 0.72;
  const fe = (rot: number, c: string, len: number) => [ol(leaf(tx, ty, len, len * 0.2, rot), c, 1), stroke(xf(line([[0, 0], [len * 0.9, 0]]), { rot, x: tx, y: ty }), shade(c, -0.35), 1)];
  return [
    stroke(line([[0, 0], [tx, ty]]), '#8a5a36', l * 0.03 + 1.4), stroke(line([[0, 0], [l * 0.16, -l * 0.19]]), '#3f7f7a', l * 0.045 + 1.4),
    ...fe(-80, '#f2c84a', l * 0.3), ...fe(-40, col, l * 0.34), ...fe(-5, '#5aa8d8', l * 0.3), ...fe(-115, '#8a6ad0', l * 0.24),
    ol(circle(tx, ty, l * 0.035), '#e8c04a', 1),
  ];
}

/** Multi-level cat tree, height h. Perches: top (-22,-94), middle (21,-66), low (-2,-39) and the cubby hole (-17,-19) in units of h/100. */
export function catTree(h: number, col = '#d8c4a6', sisal = '#c9a46a'): Shape[] {
  const post = (x: number, y0: number, y1: number): Shape[] => {
    let w = '';
    for (let y = y0 + 3; y < y1; y += 4) w += line([[x, y], [x + 9, y - 1.6]]);
    return [ol(rect(x, y0, 9, y1 - y0), sisal, 1.2), stroke(w, shade(sisal, -0.25), 1), sh(rect(x + 6, y0, 3, y1 - y0), '#000000', { opacity: 0.12 })];
  };
  const plat = (x: number, y: number, w: number): Shape[] => [ol(rect(x, y, w, 5, 2.5), col, 1.2), sh(rect(x + 2, y + 3.4, w - 4, 1.6, 0.8), shade(col, -0.2)), hl(rect(x + 3, y + 0.8, w - 6, 1.2, 0.6), 0.5)];
  const out: Shape[] = [shadow(0, 0, 42, 5)];
  out.push(...post(15, -62, -5), ...post(-27, -90, -39));
  out.push(ol(rect(-36, -35, 38, 30, 3), col, 1.2), sh(rect(-36, -35, 38, 5, 2.5), shade(col, 0.2)), ol(circle(-17, -18, 10.5), '#4a3a30', 1.2, 0.2));
  out.push(...plat(-40, -5, 80), ...plat(-40, -39, 48), ...plat(4, -66, 36));
  // top bolster bed
  out.push(ol(rect(-42, -94, 40, 5, 2.5), col, 1.2), ol(rect(-44, -101, 9, 11, 4.5), shade(col, -0.08), 1.2), ol(rect(-9, -101, 9, 11, 4.5), shade(col, -0.08), 1.2));
  // dangling pom
  out.push(stroke(line([[34, -61], [34, -50]]), '#8a5a36', 1), ol(circle(34, -47, 3.6), '#e85a5a', 1));
  return sc(out, h);
}

/** Sisal scratching post with a dangling ball, height h. */
export function scratchPost(h: number, col = '#e89ab0', sisal = '#c9a46a'): Shape[] {
  let w = '';
  for (let y = -84; y < -8; y += 5) w += line([[-7, y], [7, y - 2.4]]);
  return sc([
    shadow(0, 0, 30, 4),
    ol(rect(-28, -8, 56, 8, 3), col, 1.2), hl(rect(-25, -7, 50, 1.6, 0.8), 0.4),
    ol(rect(-7, -90, 14, 82), sisal, 1.2), stroke(w, shade(sisal, -0.25), 1.1), sh(rect(3, -90, 4, 82), '#000000', { opacity: 0.12 }),
    ol(rect(-13, -98, 26, 9, 4), col, 1.2),
    stroke(curve([[11, -94], [24, -90], [24, -74]]), '#8a5a36', 1.1), ol(circle(24, -69, 5.5), '#f2c84a', 1.1),
  ], h);
}

/** Cardboard box with open flaps; draw boxBack, then whatever is inside, then boxFront. Width w, height h. */
export function boxBack(w: number, h: number, col = '#c9a070'): Shape[] {
  const hw = w / 2;
  return [shadow(0, 0, hw * 1.05, h * 0.07), ol(poly([[-hw, -h], [hw, -h], [hw * 0.92, -h * 1.12], [-hw * 0.92, -h * 1.12]]), shade(col, -0.3), 1), ol(poly([[-hw, -h], [-hw * 1.34, -h * 1.22], [-hw * 1.2, -h * 1.34], [-hw * 0.92, -h * 1.12]]), shade(col, -0.06), 1), ol(poly([[hw, -h], [hw * 1.34, -h * 1.22], [hw * 1.2, -h * 1.34], [hw * 0.92, -h * 1.12]]), shade(col, -0.06), 1)];
}
export function boxFront(w: number, h: number, col = '#c9a070'): Shape[] {
  const hw = w / 2;
  return [
    ol(rect(-hw, -h, w, h), col, 1.2), sh(rect(hw * 0.5, -h, hw * 0.5, h), '#000000', { opacity: 0.08 }),
    sh(rect(-hw * 0.16, -h, hw * 0.32, h), '#e8d2a8', { opacity: 0.8 }),
    ol(poly([[-hw, -h], [hw, -h], [hw * 1.1, -h * 0.82], [-hw * 1.1, -h * 0.82]]), shade(col, 0.1), 1.2),
    sh(pawPrint(-hw * 0.55, -h * 0.36, h * 0.13), shade(col, -0.25)), stroke(line([[hw * 0.3, -h * 0.3], [hw * 0.8, -h * 0.3]]) + line([[hw * 0.3, -h * 0.2], [hw * 0.66, -h * 0.2]]), shade(col, -0.3), 1.4),
  ];
}

/** Plastic pet carrier with a wire door, width w. */
export function petCarrier(w: number, col = '#4f86c0'): Shape[] {
  const h = w * 0.72, hw = w / 2;
  let grid = '';
  for (let i = 1; i < 5; i++) grid += line([[-hw * 0.5 + (hw * i) / 5, -h * 0.68], [-hw * 0.5 + (hw * i) / 5, -h * 0.14]]);
  for (let i = 1; i < 3; i++) grid += line([[-hw * 0.5, -h * 0.68 + (h * 0.54 * i) / 3], [hw * 0.5, -h * 0.68 + (h * 0.54 * i) / 3]]);
  let vents = '';
  for (let i = 0; i < 3; i++) vents += rect(hw * 0.62, -h * 0.66 + i * h * 0.09, hw * 0.26, h * 0.04, 2) + rect(-hw * 0.88, -h * 0.66 + i * h * 0.09, hw * 0.26, h * 0.04, 2);
  return [
    shadow(0, 0, hw, w * 0.05),
    stroke(`M${-hw * 0.34} ${-h * 0.9}Q${-hw * 0.34} ${-h * 1.12} 0 ${-h * 1.12}Q${hw * 0.34} ${-h * 1.12} ${hw * 0.34} ${-h * 0.9}`, shade(col, -0.35), w * 0.06),
    ol(rect(-hw, -h * 0.92, w, h * 0.92, w * 0.12), col, 1.4), sh(rect(-hw, -h * 0.46, w, h * 0.05), shade(col, -0.2)),
    sh(rect(-hw, -h * 0.4, w, h * 0.4, w * 0.1), '#000000', { opacity: 0.08 }),
    ol(rect(-hw * 0.5, -h * 0.68, hw, h * 0.54, 6), '#3a3a40', 1.2, 0.3), stroke(grid, '#c9d0d5', 1.6), stroke(rect(-hw * 0.5, -h * 0.68, hw, h * 0.54, 6), '#dfe5e8', 2.4),
    sh(vents, shade(col, -0.35)), hl(rect(-hw * 0.8, -h * 0.86, w * 0.5, h * 0.05, 3), 0.3),
  ];
}

/** Old-fashioned shop till, width w. */
export function till(w: number, col = '#3f7f7a'): Shape[] {
  const hw = w / 2, h = w * 0.8;
  let keys = '';
  for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) keys += circle(-hw * 0.56 + c * hw * 0.28, -h * 0.5 + r * h * 0.1, w * 0.035);
  return [
    shadow(0, 0, hw, w * 0.05),
    ol(rect(-hw, -h * 0.26, w, h * 0.26, 3), shade(col, -0.15), 1.2), ol(rect(-hw * 0.4, -h * 0.16, hw * 0.8, h * 0.05, 2), '#e8c04a', 0.8),
    ol(`M${-hw * 0.9} ${-h * 0.26}L${-hw * 0.8} ${-h * 0.62}L${hw * 0.8} ${-h * 0.62}L${hw * 0.9} ${-h * 0.26}Z`, col, 1.2), sh(keys, '#fbf6ec'), stroke(keys, shade(col, -0.4), 0.8),
    ol(rect(-hw * 0.7, -h, hw * 1.4, h * 0.38, 4), col, 1.2), ol(rect(-hw * 0.56, -h * 0.93, hw * 1.12, h * 0.22, 2), '#f6efe0', 1), sh(pawPrint(-hw * 0.3, -h * 0.82, h * 0.06) + pawPrint(hw * 0.3, -h * 0.82, h * 0.06), shade(col, -0.1)), sh(heartPath(0, -h * 0.83, h * 0.06), '#c8473a'),
    stroke(line([[hw * 0.9, -h * 0.34], [hw * 1.14, -h * 0.5]]), '#8a9298', 3), ol(circle(hw * 1.16, -h * 0.52, w * 0.045), '#c8473a', 1),
    hl(rect(-hw * 0.64, -h * 0.98, hw * 0.5, h * 0.03, 2), 0.4),
  ];
}

/** Pump bottle of pet shampoo, height h. */
export function shampoo(h: number, col = '#7ac0d0'): Shape[] {
  const w = h * 0.4;
  return [
    stroke(line([[0, -h * 0.74], [0, -h * 0.92]]) + line([[0, -h * 0.92], [-w * 0.5, -h * 0.92]]), '#8a9298', h * 0.05),
    ol(rect(-w * 0.2, -h * 0.8, w * 0.4, h * 0.1, 2), '#fbf6ec', 1), ol(rect(-w / 2, -h * 0.72, w, h * 0.72, w * 0.2), col, 1.2),
    ol(rect(-w * 0.36, -h * 0.5, w * 0.72, h * 0.3, 2), '#fbf6ec', 0.8), sh(pawPrint(0, -h * 0.35, h * 0.07), shade(col, -0.3)), hl(rect(-w * 0.4, -h * 0.66, w * 0.1, h * 0.56, 2), 0.35),
  ];
}

/** Grooming brush, length l, lying flat; origin centre. */
export function brush(l: number, col = '#e89ab0'): Shape[] {
  let br = '';
  for (let i = 0; i < 9; i++) br += line([[-l * 0.44 + i * l * 0.06, 0], [-l * 0.44 + i * l * 0.06, l * 0.1]]);
  return [stroke(br, '#5a4a40', 1.6), ol(rect(-l * 0.5, -l * 0.1, l * 0.6, l * 0.13, l * 0.05), col, 1.2), ol(rect(l * 0.06, -l * 0.07, l * 0.44, l * 0.07, l * 0.035), shade(col, -0.15), 1.2), hl(rect(-l * 0.44, -l * 0.08, l * 0.4, l * 0.025, 1), 0.5)];
}

/** Little knitted dog jumper on a hanger; origin at the hook, width w. */
export function dogJumper(w: number, col = '#c8473a', stripe = '#fbf6ec'): Shape[] {
  const hw = w / 2, h = w * 0.86;
  const body = `M${-hw * 0.5} ${h * 0.22}L${-hw} ${h * 0.34}L${-hw * 0.86} ${h * 0.62}L${-hw * 0.56} ${h * 0.52}L${-hw * 0.56} ${h}L${hw * 0.56} ${h}L${hw * 0.56} ${h * 0.52}L${hw * 0.86} ${h * 0.62}L${hw} ${h * 0.34}L${hw * 0.5} ${h * 0.22}Q0 ${h * 0.38} ${-hw * 0.5} ${h * 0.22}Z`;
  return [
    stroke(`M0 0L0 ${h * 0.1}L${-hw * 0.7} ${h * 0.28}M0 ${h * 0.1}L${hw * 0.7} ${h * 0.28}`, '#8a9298', 2),
    ol(body, col, 1.2), sh(rect(-hw * 0.56, h * 0.6, w * 0.56, h * 0.08) + rect(-hw * 0.56, h * 0.74, w * 0.56, h * 0.05), stripe),
    sh(rect(-hw * 0.56, h * 0.92, w * 0.56, h * 0.08), shade(col, -0.2)), sh(bonePathAt(0, h * 0.44, w * 0.3), stripe),
  ];
}

/** Hanging shop sign with a paw; origin top centre (hangs from two chains), width w. */
export function shopSign(w: number, col = '#3f7f7a', icon: Icon = 'paw'): Shape[] {
  const hw = w / 2, h = w * 0.5;
  return [
    stroke(line([[-hw * 0.7, 0], [-hw * 0.7, h * 0.3]]) + line([[hw * 0.7, 0], [hw * 0.7, h * 0.3]]), '#6a5a48', 2),
    sh(rect(-hw + 3, h * 0.3 + 4, w, h, h * 0.2), '#000000', { opacity: 0.14 }),
    ol(rect(-hw, h * 0.3, w, h, h * 0.2), col, 1.4), stroke(rect(-hw + 5, h * 0.3 + 5, w - 10, h - 10, h * 0.16), '#fbf6ec', 1.6, { opacity: 0.85 }),
    sh(iconPath(icon, 0, h * 0.8, h * 0.44), '#fbf6ec'),
  ];
}

/** Framed cat silhouette portrait, w × h, origin top-left. */
export function catPortrait(w: number, h: number, bg: string, cat = '#3a3640', frame = '#6a4428'): Shape[] {
  const cx = w / 2, by = h * 0.9, r = w * 0.2;
  return [
    sh(rect(4, 6, w, h, 3), '#000000', { opacity: 0.14 }), ol(rect(0, 0, w, h, 3), frame, 1.2), sh(rect(w * 0.09, h * 0.08, w * 0.82, h * 0.84), bg), sh(circle(cx, h * 0.46, w * 0.34), shade(bg, 0.25), { opacity: 0.7 }),
    sh(blob([[cx - r * 1.3, by], [cx - r * 1.2, by - h * 0.26], [cx - r * 0.5, by - h * 0.4], [cx + r * 0.5, by - h * 0.4], [cx + r * 1.2, by - h * 0.26], [cx + r * 1.3, by]], 0.8), cat),
    sh(circle(cx, by - h * 0.46, r) + poly([[cx - r * 0.98, by - h * 0.5], [cx - r * 0.82, by - h * 0.46 - r * 1.5], [cx - r * 0.1, by - h * 0.46 - r * 0.8]]) + poly([[cx + r * 0.98, by - h * 0.5], [cx + r * 0.82, by - h * 0.46 - r * 1.5], [cx + r * 0.1, by - h * 0.46 - r * 0.8]]), cat),
    sh(ellipse(cx - r * 0.4, by - h * 0.47, r * 0.16, r * 0.2) + ellipse(cx + r * 0.4, by - h * 0.47, r * 0.16, r * 0.2), '#f2c84a'),
  ];
}

/** Fish-shaped biscuit, length l, origin centre. */
export function fishBiscuit(l: number, col = '#d9a860'): Shape[] {
  return [ol(fishPath(l), col, 1.1), sh(circle(-l * 0.3, -l * 0.04, l * 0.035), '#5a3a24'), stroke(curve([[-l * 0.12, -l * 0.12], [-l * 0.06, 0], [-l * 0.12, l * 0.12]]) + curve([[0, -l * 0.1], [l * 0.05, 0], [0, l * 0.1]]), shade(col, -0.3), 1)];
}

// =====================================================================
// dog park
// =====================================================================
/** Flying disc; r is the radius, origin centre. `tilt` flattens it (1 = seen from above). */
export function frisbee(r: number, col: string, tilt = 0.42): Shape[] {
  return [
    ol(ellipse(0, 0, r, r * tilt), col, 1.2), sh(ellipse(0, r * tilt * 0.16, r * 0.98, r * tilt * 0.84), shade(col, -0.14)),
    ol(ellipse(0, -r * tilt * 0.12, r * 0.9, r * tilt * 0.82), col, 0.8, -0.2), stroke(ellipse(0, -r * tilt * 0.12, r * 0.62, r * tilt * 0.56), '#fbf6ec', r * 0.07, { opacity: 0.9 }),
    sh(ellipse(0, -r * tilt * 0.12, r * 0.24, r * tilt * 0.22), shade(col, 0.3)), hl(ellipse(-r * 0.4, -r * tilt * 0.5, r * 0.3, r * tilt * 0.14, -8), 0.45),
  ];
}

/** Tennis ball, radius r, origin centre. */
export function tennisBall(r: number): Shape[] {
  return [ol(circle(0, 0, r), '#d2e04a', 1, -0.35), stroke(`M${-r * 0.7} ${-r * 0.7}Q0 0 ${-r * 0.7} ${r * 0.7}M${r * 0.7} ${-r * 0.7}Q0 0 ${r * 0.7} ${r * 0.7}`, '#fbf6ec', r * 0.14), hl(circle(-r * 0.3, -r * 0.4, r * 0.2), 0.4)];
}

/** Agility tyre jump: a striped hoop hung in a frame, height h. */
export function agilityHoop(h: number, col = '#4f86c0', hoop = '#e85a5a'): Shape[] {
  const out: Shape[] = [shadow(0, 0, 44, 4)];
  out.push(...tube(line([[-36, 0], [-36, -98]]) + line([[36, 0], [36, -98]]) + line([[-36, -98], [36, -98]]), col, 5));
  out.push(ol(rect(-48, -5, 24, 6, 3), shade(col, -0.15), 1.2), ol(rect(24, -5, 24, 6, 3), shade(col, -0.15), 1.2));
  out.push(stroke(line([[-24, -86], [-34, -96]]) + line([[24, -86], [34, -96]]) + line([[-26, -30], [-35, -22]]) + line([[26, -30], [35, -22]]), '#8a9298', 1.6));
  out.push(stroke(circle(0, -58, 27), shade(hoop, -0.35), 12.4), stroke(circle(0, -58, 27), hoop, 10));
  let st = '';
  for (let i = 0; i < 6; i++) { const a = (i * Math.PI) / 3 + 0.3; st += line([[Math.cos(a) * 22.6, -58 + Math.sin(a) * 22.6], [Math.cos(a + 0.34) * 31.4, -58 + Math.sin(a + 0.34) * 31.4]]); }
  out.push(stroke(st, '#fbf6ec', 5.5));
  return sc(out, h);
}

/** Agility hurdle with a striped pole, width w. */
export function hurdle(w: number, col = '#f2c84a', pole = '#e85a5a'): Shape[] {
  const hw = w / 2, h = w * 0.62;
  let st = '';
  for (let i = 0; i < 5; i++) st += rect(-hw * 0.78 + i * hw * 0.36, -h * 0.56, hw * 0.16, h * 0.08);
  return [
    shadow(0, 0, hw, w * 0.04),
    ol(poly([[-hw, 0], [-hw * 0.9, -h], [-hw * 0.78, -h], [-hw * 0.68, 0]]), col, 1.2), ol(poly([[hw, 0], [hw * 0.9, -h], [hw * 0.78, -h], [hw * 0.68, 0]]), col, 1.2),
    ol(rect(-hw * 0.84, -h * 0.56, hw * 1.68, h * 0.08, 2), '#fbf6ec', 1), sh(st, pole),
    ol(rect(-hw * 0.84, -h * 0.3, hw * 1.68, h * 0.06, 2), shade(col, 0.2), 1),
  ];
}

/** Row of slalom weave poles, n poles gap apart, height h; origin at the first pole's foot. */
export function weavePoles(n: number, gap: number, h: number, a = '#e85a5a', b = '#fbf6ec'): Shape[] {
  const out: Shape[] = [sh(rect(-6, -3, (n - 1) * gap + 12, 5, 2.5), '#6f7480')];
  for (let i = 0; i < n; i++) {
    const x = i * gap;
    let st = '';
    for (let k = 0; k < 3; k++) st += rect(x - 2.6, -h * (0.9 - k * 0.3), 5.2, h * 0.14);
    out.push(ol(rect(x - 2.6, -h, 5.2, h, 2.6), i % 2 ? a : b, 1, -0.35), sh(st, i % 2 ? b : a), sh(circle(x, -h, 3.4), i % 2 ? a : '#4f86c0'));
  }
  return out;
}

/** Fabric agility tunnel seen from the open end at the left, length w. */
export function tunnel(w: number, col = '#3f9a8a'): Shape[] {
  const h = w * 0.46, hw = w / 2;
  let ribs = '';
  for (let i = 1; i < 7; i++) { const x = -hw * 0.62 + (i * w * 0.78) / 7; ribs += `M${x} ${-h * 0.96}Q${x + h * 0.26} ${-h * 0.5} ${x} ${-h * 0.03}`; }
  return [
    shadow(0, 0, hw, w * 0.04),
    ol(`M${-hw * 0.62} ${-h}L${hw * 0.8} ${-h * 0.94}Q${hw} ${-h * 0.5} ${hw * 0.8} ${-h * 0.04}L${-hw * 0.62} 0Z`, col, 1.4),
    sh(`M${-hw * 0.62} ${-h * 0.34}L${hw * 0.9} ${-h * 0.3}Q${hw * 0.94} ${-h * 0.14} ${hw * 0.8} ${-h * 0.04}L${-hw * 0.62} 0Z`, '#000000', { opacity: 0.12 }),
    stroke(ribs, shade(col, 0.3), 2.4, { opacity: 0.8 }),
    ol(ellipse(-hw * 0.62, -h * 0.5, h * 0.3, h * 0.5), shade(col, 0.15), 1.4), sh(ellipse(-hw * 0.6, -h * 0.48, h * 0.23, h * 0.42), '#2a3a3a'),
    stroke(ellipse(-hw * 0.62, -h * 0.5, h * 0.3, h * 0.5), '#f2c84a', 3),
  ];
}

/** Two-tier stone fountain with jets of water, width w. */
export function fountain(w: number, stone = '#cdc4b4', water = '#8fd0dc'): Shape[] {
  const hw = w / 2;
  const jet = (x0: number, y0: number, x1: number, y1: number, top: number) => `M${x0} ${y0}Q${(x0 + x1) / 2} ${top} ${x1} ${y1}`;
  const jets = jet(0, -w * 0.84, -hw * 0.34, -w * 0.52, -w * 1.02) + jet(0, -w * 0.84, hw * 0.34, -w * 0.52, -w * 1.02) + jet(-hw * 0.3, -w * 0.5, -hw * 0.74, -w * 0.2, -w * 0.62) + jet(hw * 0.3, -w * 0.5, hw * 0.74, -w * 0.2, -w * 0.62) + jet(-hw * 0.14, -w * 0.5, -hw * 0.44, -w * 0.2, -w * 0.6) + jet(hw * 0.14, -w * 0.5, hw * 0.44, -w * 0.2, -w * 0.6);
  let blocks = '';
  for (let i = 1; i < 8; i++) blocks += line([[-hw + (w * i) / 8, -w * 0.15], [-hw * 0.96 + (w * 0.96 * i) / 8, -2]]);
  let drops = '';
  const g = rng(6);
  for (let i = 0; i < 14; i++) drops += circle(g.range(-hw * 0.8, hw * 0.8), -w * g.range(0.24, 0.9), g.range(1, 2.2));
  return [
    shadow(0, 0, hw * 1.08, w * 0.05),
    ol(ellipse(0, -w * 0.2, hw, w * 0.07), shade(stone, -0.14), 1.2), sh(ellipse(0, -w * 0.2, hw * 0.9, w * 0.052), water), stroke(ellipse(0, -w * 0.2, hw * 0.6, w * 0.03) + ellipse(hw * 0.3, -w * 0.19, hw * 0.3, w * 0.014), '#ffffff', 1.2, { opacity: 0.7 }),
    ol(`M${-hw} ${-w * 0.2}Q0 ${-w * 0.08} ${hw} ${-w * 0.2}L${hw * 0.94} 0L${-hw * 0.94} 0Z`, stone, 1.4), stroke(blocks, shade(stone, -0.22), 1.2), sh(`M${hw * 0.4} ${-w * 0.14}L${hw} ${-w * 0.2}L${hw * 0.94} 0L${hw * 0.4} 0Z`, '#000000', { opacity: 0.08 }),
    ol(rect(-hw - 3, -w * 0.215, w + 6, w * 0.045, w * 0.02), shade(stone, 0.14), 1.2),
    ol(`M${-hw * 0.12} ${-w * 0.2}L${-hw * 0.08} ${-w * 0.46}L${hw * 0.08} ${-w * 0.46}L${hw * 0.12} ${-w * 0.2}Z`, stone, 1.2),
    ol(`M${-hw * 0.46} ${-w * 0.52}Q0 ${-w * 0.36} ${hw * 0.46} ${-w * 0.52}Z`, stone, 1.2), ol(ellipse(0, -w * 0.52, hw * 0.46, w * 0.03), shade(stone, 0.14), 1), sh(ellipse(0, -w * 0.52, hw * 0.4, w * 0.02), water),
    ol(`M${-hw * 0.06} ${-w * 0.52}L${-hw * 0.04} ${-w * 0.8}L${hw * 0.04} ${-w * 0.8}L${hw * 0.06} ${-w * 0.52}Z`, stone, 1.2), ol(circle(0, -w * 0.84, w * 0.04), shade(stone, 0.1), 1.2),
    stroke(jets, '#ffffff', 3.2, { opacity: 0.55 }), stroke(jets, water, 1.6), sh(drops, '#ffffff', { opacity: 0.8 }),
  ];
}

/** Coffee cart with a striped awning, width w. */
export function coffeeCart(w: number, col = '#3f7f7a', a = '#c8473a', b = '#fbf6ec'): Shape[] {
  const hw = w / 2, bh = w * 0.42, top = -w * 0.14 - bh, roof = -w * 1.06;
  const out: Shape[] = [shadow(0, 0, hw * 1.05, w * 0.045)];
  // poles
  out.push(sh(rect(-hw * 0.94, roof, w * 0.03, -roof + top) + rect(hw * 0.94 - w * 0.03, roof, w * 0.03, -roof + top), '#5a4a40'));
  // back board with menu
  out.push(ol(rect(-hw * 0.5, top - w * 0.36, hw, w * 0.26, 3), '#2f3533', 1.2, 0.3));
  out.push(stroke(line([[-hw * 0.4, top - w * 0.3], [hw * 0.1, top - w * 0.3]]) + line([[-hw * 0.4, top - w * 0.24], [hw * 0.3, top - w * 0.24]]) + line([[-hw * 0.4, top - w * 0.18], [0, top - w * 0.18]]), '#f1eee4', 1.6, { opacity: 0.85 }), sh(pawPrint(hw * 0.32, top - w * 0.2, w * 0.03), '#f2c84a'));
  // wheels
  for (const s of [-1, 1]) {
    const cx = s * hw * 0.56, r = w * 0.15;
    let sp = '';
    for (let i = 0; i < 8; i++) { const an = (i * Math.PI) / 4; sp += line([[cx, -r], [cx + Math.cos(an) * r * 0.86, -r + Math.sin(an) * r * 0.86]]); }
    out.push(stroke(sp, '#8a6a48', 1.6), stroke(circle(cx, -r, r * 0.92), '#4a3a30', r * 0.2), ol(circle(cx, -r, r * 0.18), '#c9a24a', 1));
  }
  // body
  out.push(ol(rect(-hw, top, w, bh, 5), col, 1.4), sh(rect(hw * 0.5, top, hw * 0.5, bh, 5), '#000000', { opacity: 0.1 }));
  let slats = '';
  for (let i = 1; i < 9; i++) slats += line([[-hw + (w * i) / 9, top + bh * 0.16], [-hw + (w * i) / 9, -w * 0.16]]);
  out.push(stroke(slats, shade(col, -0.2), 1.3), ol(ellipse(0, top + bh * 0.52, hw * 0.4, bh * 0.3), '#f5ead2', 1.2, -0.25));
  out.push(stroke(`M${hw * 0.1} ${top + bh * 0.42}Q${hw * 0.24} ${top + bh * 0.44} ${hw * 0.18} ${top + bh * 0.56}`, shade(col, -0.2), 2.4), sh(`M${-hw * 0.14} ${top + bh * 0.36}L${hw * 0.12} ${top + bh * 0.36}Q${hw * 0.1} ${top + bh * 0.7} ${-hw * 0.01} ${top + bh * 0.7}Q${-hw * 0.12} ${top + bh * 0.7} ${-hw * 0.14} ${top + bh * 0.36}Z`, shade(col, -0.2)));
  out.push(ol(rect(-hw - 6, top - 7, w + 12, 9, 3), '#b07a4a', 1.2), hl(rect(-hw - 2, top - 6, w + 4, 2, 1), 0.3));
  // handle
  out.push(stroke(`M${hw} ${top + bh * 0.2}L${hw * 1.2} ${top + bh * 0.1}`, '#5a4a40', 4), stroke(line([[hw * 1.2, top + bh * 0.02], [hw * 1.2, top + bh * 0.2]]), '#5a4a40', 5));
  // awning
  const n = 8, sw = (w * 1.16) / n, ax = -hw * 1.16, ah = w * 0.2;
  let sa = '', sb = '';
  for (let i = 0; i < n; i++) { const x = ax + i * sw; const p = `M${x} ${roof}L${x + sw} ${roof}L${x + sw} ${roof + ah}Q${x + sw / 2} ${roof + ah + sw * 0.6} ${x} ${roof + ah}Z`; if (i % 2) sb += p; else sa += p; }
  out.push(sh(sa, a), sh(sb, b), sh(rect(ax, roof, w * 1.16, ah * 0.2), '#000000', { opacity: 0.1 }), ol(rect(ax - 3, roof - 7, w * 1.16 + 6, 9, 3), shade(a, -0.25), 1));
  return out;
}

/** Takeaway cup, height s. */
export function paperCup(s: number, sleeve = '#b98552', icon: Icon = 'paw'): Shape[] {
  return [
    ol(poly([[-s * 0.3, -s * 0.86], [s * 0.3, -s * 0.86], [s * 0.22, 0], [-s * 0.22, 0]]), '#fbf6ec', 1, -0.25),
    ol(poly([[-s * 0.285, -s * 0.64], [s * 0.285, -s * 0.64], [s * 0.25, -s * 0.26], [-s * 0.25, -s * 0.26]]), sleeve, 0.8), sh(iconPath(icon, 0, -s * 0.45, s * 0.14), '#fbf3df'),
    ol(rect(-s * 0.33, -s * 0.94, s * 0.66, s * 0.09, 3), '#3b3532', 1), ol(rect(-s * 0.26, -s, s * 0.52, s * 0.07, 3), '#4f4844', 1),
  ];
}

/** Old-style park lamp post, height h. */
export function lampPost(h: number, col = '#2f3a38'): Shape[] {
  return sc([
    shadow(0, 0, 12, 2.4),
    ol(rect(-5, -8, 10, 8, 2), col, 1), ol(rect(-1.8, -84, 3.6, 78), col, 1), sh(rect(-3.2, -60, 6.4, 3, 1) + rect(-3.2, -30, 6.4, 3, 1), shade(col, 0.15)),
    sh(circle(0, -91, 12), '#ffe9a8', { opacity: 0.25 }),
    ol(poly([[-6, -84], [6, -84], [8, -97], [-8, -97]]), '#ffefb8', 1, -0.3), ol(poly([[-10, -97], [10, -97], [0, -104]]), col, 1), sh(circle(0, -105, 1.6), col),
    stroke(line([[0, -84], [0, -97]]), col, 1),
  ], h);
}

/** Wooden park sign on two posts, width w. */
export function parkSign(w: number, col = '#5c8a4e'): Shape[] {
  const hw = w / 2, h = w * 0.5;
  return [
    ol(rect(-hw * 0.82, -h * 1.56, w * 0.06, h * 1.56), '#8a5a36', 1), ol(rect(hw * 0.82 - w * 0.06, -h * 1.56, w * 0.06, h * 1.56), '#8a5a36', 1),
    ol(rect(-hw, -h * 1.5, w, h, h * 0.14), col, 1.4), stroke(rect(-hw + 5, -h * 1.5 + 5, w - 10, h - 10, h * 0.1), '#fbf6ec', 1.6, { opacity: 0.85 }),
    sh(pawPrint(-hw * 0.5, -h * 0.98, h * 0.2), '#fbf6ec'), sh(bonePathAt(hw * 0.24, -h * 1.0, w * 0.4), '#fbf6ec'),
  ];
}

/** Dog-waste bag station on a post, height h. */
export function bagStation(h: number, col = '#3f7f7a'): Shape[] {
  return sc([
    shadow(0, 0, 14, 3), ol(rect(-2.4, -76, 4.8, 76), '#6f7480', 1),
    ol(rect(-13, -100, 26, 30, 3), col, 1.2), ol(rect(-9, -78, 18, 5, 1.5), '#2a3a3a', 0.8, 0.3), sh(pawPrint(0, -88, 5.4), '#fbf6ec'),
    ol(poly([[-4, -75], [4, -75], [5, -64], [-5, -64]]), '#9ad28a', 0.8),
    ol(poly([[-11, -52], [11, -52], [9, -22], [-9, -22]]), shade(col, -0.2), 1.2), ol(rect(-12, -55, 24, 5, 2), '#6f7480', 1),
  ], h);
}

/** Dog drinking fountain: a post with a tap and a steel bowl at its foot, height h. */
export function waterStation(h: number, col = '#4f86c0'): Shape[] {
  return sc([
    shadow(4, 0, 30, 4),
    ol(rect(-9, -92, 18, 92, 4), col, 1.2), sh(rect(3, -92, 6, 92, 3), '#000000', { opacity: 0.12 }), ol(rect(-12, -98, 24, 9, 4), shade(col, 0.2), 1.2),
    sh(pawPrint(-1, -66, 5.5), '#fbf6ec'),
    stroke(`M9 -40L20 -40Q25 -40 25 -34L25 -30`, '#aab2b8', 4), stroke(line([[25, -28], [25, -14]]), '#8fd0dc', 2, { opacity: 0.9 }),
    ol(`M10 -12L40 -12L36 0L14 0Z`, '#c9d0d5', 1.2, -0.4), ol(ellipse(25, -12, 15, 3.6), '#dfe5e8', 1, -0.4), sh(ellipse(25, -11.6, 12, 2.4), '#8fd0dc'),
  ], h);
}

/** Wrought-iron park railing from x0 to x1 with the top rail at y - h. */
export function railing(x0: number, x1: number, y: number, h: number, col = '#2f3a38', gap = 16): Shape[] {
  let bars = '', tips = '', posts = '', caps = '';
  for (let x = x0 + gap / 2; x < x1; x += gap) { bars += line([[x, y], [x, y - h * 0.98]]); tips += leaf(x, y - h * 0.92, h * 0.16, 2.6, -90); }
  for (let x = x0; x <= x1 + 1; x += gap * 6) { posts += rect(x - 3.5, y - h * 1.12, 7, h * 1.12 + 2, 2); caps += circle(x, y - h * 1.16, 5); }
  return [stroke(bars, col, 2.2), sh(tips, col), sh(rect(x0, y - h * 0.92, x1 - x0, 4, 2) + rect(x0, y - h * 0.16, x1 - x0, 4, 2), col), sh(posts, shade(col, -0.1)), sh(caps, shade(col, 0.1))];
}

/** Soft backpack, height s. */
export function backpack(s: number, col = '#d9a53a'): Shape[] {
  return sc([
    shadow(0, 0, 32, 4),
    stroke(`M-12 -92Q0 -110 12 -92`, shade(col, -0.35), 5),
    ol(rect(-30, -92, 60, 92, 18), col, 1.4), sh(rect(10, -92, 20, 92, 14), '#000000', { opacity: 0.08 }),
    ol(rect(-22, -46, 44, 38, 8), shade(col, -0.12), 1.2), stroke(line([[-16, -34], [16, -34]]), shade(col, -0.4), 1.6), ol(rect(-3, -38, 6, 8, 2), '#c9d0d5', 0.8, -0.4),
    stroke(`M-26 -70Q0 -60 26 -70`, shade(col, -0.35), 1.6), sh(pawPrint(0, -80, 5), '#fbf6ec'),
    ol(rect(-36, -40, 8, 26, 4), shade(col, -0.2), 1), ol(rect(28, -40, 8, 26, 4), shade(col, -0.2), 1),
  ], s);
}

/** Sports water bottle, height h. */
export function waterBottle(h: number, col = '#5aa8d8'): Shape[] {
  const w = h * 0.34;
  return [
    ol(rect(-w * 0.22, -h, w * 0.44, h * 0.1, 2), '#3b3532', 1), ol(rect(-w * 0.36, -h * 0.92, w * 0.72, h * 0.12, 3), '#fbf6ec', 1),
    ol(rect(-w / 2, -h * 0.82, w, h * 0.82, w * 0.24), col, 1.2), sh(rect(-w / 2, -h * 0.5, w, h * 0.14), '#fbf6ec', { opacity: 0.85 }), hl(rect(-w * 0.36, -h * 0.76, w * 0.14, h * 0.64, 2), 0.35),
  ];
}

/** A simple skyline block: rows of windows on a flat building, origin bottom-left. */
export function towerBlock(w: number, h: number, col: string, seed: number, roof = 0): Shape[] {
  const g = rng(seed);
  let wins = '', lit = '';
  for (let y = -h + 14; y < -12; y += 22) for (let x = 8; x + 10 < w - 4; x += 18) { const r = rect(x, y, 10, 13, 1); if (g.next() < 0.22) lit += r; else wins += r; }
  const out: Shape[] = [sh(rect(0, -h, w, h), col), sh(rect(w * 0.7, -h, w * 0.3, h), '#000000', { opacity: 0.06 }), sh(rect(-2, -h - 4, w + 4, 6), shade(col, -0.14))];
  if (roof === 1) out.push(sh(rect(w * 0.3, -h - 20, w * 0.22, 18) + rect(w * 0.6, -h - 12, w * 0.1, 10), shade(col, -0.1)));
  if (roof === 2) out.push(sh(poly([[0, -h - 3], [w / 2, -h - 28], [w, -h - 3]]), shade(col, -0.18)));
  if (roof === 3) out.push(stroke(line([[w * 0.5, -h - 4], [w * 0.5, -h - 34]]), shade(col, -0.3), 2), sh(ellipse(w * 0.3, -h - 12, w * 0.12, 9), shade(col, -0.2)), sh(rect(w * 0.27, -h - 6, w * 0.06, 6), shade(col, -0.3)));
  if (wins) out.push(sh(wins, shade(col, 0.22)));
  if (lit) out.push(sh(lit, '#fff1c4'));
  return out;
}

void mix;

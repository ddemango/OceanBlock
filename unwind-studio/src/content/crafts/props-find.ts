// Shared props for The Craft Room hidden-object scenes (sewing room, yarn shop,
// potter's studio). Every prop is drawn around the origin and returns Shape[];
// position it with place(). Unless a comment says otherwise the origin is the
// bottom centre (the prop stands on y = 0).
import { rect, ellipse, circle, poly, line, curve, blob, leaf, petal, star, sh, stroke, shade, mix, rng, xf, place } from '../../art/kit';
import type { Shape } from '../../art/types';
import { M, L, Q, ol, shadow } from '../kitchen/props-find';
import { ribbon, sample } from '../library/props';

export type Pt = [number, number];
const hl = (d: string, op = 0.5): Shape => sh(d, '#ffffff', { opacity: op });
const dk = (d: string, op = 0.15): Shape => sh(d, '#2a1a10', { opacity: op });

export const Y = {
  cream: '#f6ecd6', paper: '#fbf5e6', linen: '#e9dcc0', wood: '#b98552', woodLt: '#d7a970', woodDk: '#7a5232', ink: '#3b2f2a',
  steel: '#b9c2c8', steelDk: '#6f7a82', steelLt: '#e8eef1', brass: '#c9a24a',
  red: '#cf4a3c', coral: '#e8836a', mustard: '#e0a93a', butter: '#f3d77a', sage: '#9cb48a', green: '#5c8a4e', teal: '#3f8a84', sky: '#7fb0d0',
  navy: '#3a4f7a', plum: '#7a4a6e', rose: '#e79ab0', lilac: '#b39ad0', terracotta: '#c56a44',
  wetClay: '#9c8472', greenware: '#b9a492', bisque: '#ecd3bb', glow: '#ffe3a0',
};
export const RAINBOW = ['#c8473a', '#de6a3c', '#eb9238', '#f0bf45', '#b9c458', '#7fb463', '#4f9e7a', '#3f8f9a', '#4f7fc0', '#5a5fae', '#8a5aa8', '#c46a9e', '#e79ab0'];

/** Dashes along a polyline (for stitching and pattern markings). */
export function dash(pts: Pt[], on = 7, off = 5): string {
  let d = '', carry = 0, draw = true;
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[i + 1];
    const len = Math.hypot(bx - ax, by - ay);
    if (len < 0.01) continue;
    let t = 0;
    while (t < len) {
      const seg = Math.min((draw ? on : off) - carry, len - t);
      if (draw) d += line([[ax + ((bx - ax) * t) / len, ay + ((by - ay) * t) / len], [ax + ((bx - ax) * (t + seg)) / len, ay + ((by - ay) * (t + seg)) / len]]);
      t += seg; carry += seg;
      if (carry >= (draw ? on : off) - 0.001) { carry = 0; draw = !draw; }
    }
  }
  return d;
}

// =====================================================================
// room pieces
// =====================================================================
/** Garden view for a window: sky, hills, trees and a flower border. Draws inside (x, y, w, h). */
export function gardenView(x: number, y: number, w: number, h: number, sky: string, seed: number): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [sh(rect(x, y, w, h), sky), sh(circle(x + w * 0.76, y + h * 0.2, h * 0.16), '#fff6d0', { opacity: 0.55 }), sh(circle(x + w * 0.76, y + h * 0.2, h * 0.09), '#fffbe6')];
  let cl = '';
  for (const [cx, cy, s] of [[0.2, 0.16, 1], [0.52, 0.3, 0.7], [0.9, 0.42, 0.6]] as [number, number, number][]) cl += ellipse(x + w * cx, y + h * cy, w * 0.1 * s, h * 0.035 * s) + ellipse(x + w * cx + w * 0.05 * s, y + h * cy - h * 0.025 * s, w * 0.06 * s, h * 0.035 * s) + ellipse(x + w * cx - w * 0.05 * s, y + h * cy - h * 0.012 * s, w * 0.05 * s, h * 0.028 * s);
  out.push(sh(cl, '#ffffff', { opacity: 0.85 }));
  const hill = (y0: number, amp: number, ph: number) => { const pts: Pt[] = []; for (let i = 0; i <= 12; i++) pts.push([x + (w * i) / 12, y + h * y0 + Math.sin(i * 0.7 + ph) * h * amp]); return line(pts) + L(x + w, y + h) + L(x, y + h) + 'Z'; };
  out.push(sh(hill(0.56, 0.035, 0.4), '#b9d2a0'), sh(hill(0.66, 0.03, 2.2), '#9cc084'));
  let t1 = '', t2 = '', tr = '';
  for (let i = 0; i < 5; i++) {
    const tx = x + w * (0.08 + i * 0.21 + g.range(-0.03, 0.03)), ty = y + h * g.range(0.62, 0.7), r = h * g.range(0.07, 0.11);
    tr += rect(tx - 2.5, ty, 5, h * 0.14);
    const c = circle(tx, ty - r * 0.4, r) + circle(tx - r * 0.7, ty + r * 0.1, r * 0.7) + circle(tx + r * 0.7, ty + r * 0.1, r * 0.7);
    if (i % 2) t1 += c; else t2 += c;
  }
  out.push(sh(tr, '#7a5a3a'), sh(t1, '#6f9e5c'), sh(t2, '#5c8a4e'), sh(hill(0.82, 0.015, 1.1), '#7fae66'));
  // picket fence and flowers
  let fence = rect(x, y + h * 0.84, w, 3);
  for (let fx = x + 6; fx < x + w; fx += 16) fence += poly([[fx, y + h * 0.9], [fx, y + h * 0.79], [fx + 4, y + h * 0.77], [fx + 8, y + h * 0.79], [fx + 8, y + h * 0.9]]);
  out.push(sh(fence, '#fbf6ea'), sh(rect(x, y + h * 0.9, w, h * 0.1), '#6f9e5c'));
  const fc = ['#e8836a', '#f3d77a', '#e79ab0', '#ffffff'];
  const fl = fc.map(() => '');
  for (let i = 0; i < 46; i++) fl[i % 4] += circle(x + g.range(4, w - 4), y + h * g.range(0.9, 0.985), g.range(2.2, 4));
  fl.forEach((d, i) => out.push(sh(d, fc[i])));
  return out;
}

/** Window frame with mullions, sheen and a sill; the pane area is (x, y, w, h). */
export function windowFrame(x: number, y: number, w: number, h: number, col: string, nx = 2, ny = 2, sill = '#d7a970'): Shape[] {
  let mul = '';
  for (let i = 1; i < nx; i++) mul += rect(x + (w * i) / nx - 4, y, 8, h);
  for (let i = 1; i < ny; i++) mul += rect(x, y + (h * i) / ny - 4, w, 8);
  return [
    sh(poly([[x + w * 0.12, y], [x + w * 0.24, y], [x + w * 0.02, y + h], [x - w * 0.1, y + h]]) + poly([[x + w * 0.62, y], [x + w * 0.68, y], [x + w * 0.46, y + h], [x + w * 0.4, y + h]]), '#ffffff', { opacity: 0.12 }),
    sh(rect(x - 14, y - 14, w + 28, 14) + rect(x - 14, y + h, w + 28, 10) + rect(x - 14, y, 14, h) + rect(x + w, y, 14, h), col),
    sh(mul, col), sh(rect(x - 14, y - 14, w + 28, 4), shade(col, 0.3)), stroke(rect(x - 14, y - 14, w + 28, h + 24), shade(col, -0.25), 1.4),
    ol(rect(x - 30, y + h + 8, w + 60, 18, 3), sill, 1, -0.3), sh(rect(x - 30, y + h + 8, w + 60, 5, 3), shade(sill, 0.2)), sh(rect(x - 22, y + h + 26, w + 44, 6), '#000000', { opacity: 0.12 }),
  ];
}

/** Tied-back curtain panel hanging from (x, y); dir 1 = hangs on the left of a window, -1 = on the right. */
export function curtain(x: number, y: number, w: number, h: number, col: string, dir = 1, accent = '#ffffff'): Shape[] {
  const X = (t: number) => x + dir * t * w;
  const body = M(X(0), y) + L(X(1), y) + Q(X(1.02), y + h * 0.36, X(0.28), y + h * 0.6) + Q(X(0.62), y + h * 0.82, X(0.7), y + h) + L(X(0), y + h) + 'Z';
  let folds = '', dots = '';
  for (let i = 1; i < 5; i++) folds += M(X(i * 0.2), y + 6) + Q(X(i * 0.2 * 0.8), y + h * 0.34, X(0.18 + i * 0.02), y + h * 0.58) + M(X(0.14 + i * 0.03), y + h * 0.64) + Q(X(i * 0.14), y + h * 0.82, X(i * 0.15), y + h - 6);
  for (let r = 0; r < 9; r++) for (let c = 0; c < 2; c++) dots += circle(X(0.08 + c * 0.11 + (r % 2) * 0.05), y + h * (0.08 + r * 0.105), 3);
  return [
    ol(body, col, 1.2, -0.25), sh(dots, accent, { opacity: 0.7 }), stroke(folds, shade(col, -0.2), 1.6, { opacity: 0.7 }),
    ol(xf(rect(-w * 0.2, -7, w * 0.4, 14, 5), { x: X(0.2), y: y + h * 0.6, rot: dir * -12 }), shade(col, -0.25), 1), sh(circle(X(0.02), y + h * 0.6, 5), Y.brass),
  ];
}

/** Bunting flags on a sagging cord through anchor points. */
export function bunting(pts: Pt[], sag: number, gap: number, cols: string[], size = 22): Shape[] {
  let cord = '';
  const by = cols.map(() => '');
  let k = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i], [bx, by2] = pts[i + 1];
    const mx = (ax + bx) / 2, my = (ay + by2) / 2 + sag;
    cord += M(ax, ay) + Q(mx, my, bx, by2);
    const n = Math.max(2, Math.round(Math.hypot(bx - ax, by2 - ay) / gap));
    for (let j = 0; j < n; j++) {
      const t = (j + 0.5) / n;
      const px = (1 - t) * (1 - t) * ax + 2 * t * (1 - t) * mx + t * t * bx, py = (1 - t) * (1 - t) * ay + 2 * t * (1 - t) * my + t * t * by2;
      by[k++ % cols.length] += poly([[px - size / 2, py - 1], [px + size / 2, py - 1], [px, py + size * 1.15]]);
    }
  }
  return [...by.map((d, i) => ol(d, cols[i], 0.8, -0.2)).filter((p) => p.d), stroke(cord, '#8a6a4a', 1.8)];
}

/** Patchwork quilt panel: cols × rows blocks of size s, origin top-left. */
export function patchwork(cols: number, rows: number, s: number, pal: string[], seed: number): Shape[] {
  const g = rng(seed);
  const by = pal.map(() => '');
  let seams = '', st = '';
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const x = c * s, y = r * s, a = g.int(0, pal.length - 1);
    let b = g.int(0, pal.length - 1); if (b === a) b = (a + 1) % pal.length;
    const t = (r * 3 + c * 5 + g.int(0, 1)) % 4;
    if (t === 0) { by[a] += rect(x, y, s, s); by[b] += poly([[x + s / 2, y + s * 0.18], [x + s * 0.82, y + s / 2], [x + s / 2, y + s * 0.82], [x + s * 0.18, y + s / 2]]); }
    else if (t === 1) { by[a] += poly([[x, y], [x + s, y], [x, y + s]]); by[b] += poly([[x + s, y], [x + s, y + s], [x, y + s]]); seams += line([[x + s, y], [x, y + s]]); }
    else if (t === 2) { by[a] += poly([[x, y], [x + s, y], [x + s / 2, y + s / 2]]) + poly([[x, y + s], [x + s, y + s], [x + s / 2, y + s / 2]]); by[b] += poly([[x, y], [x, y + s], [x + s / 2, y + s / 2]]) + poly([[x + s, y], [x + s, y + s], [x + s / 2, y + s / 2]]); seams += line([[x, y], [x + s, y + s]]) + line([[x + s, y], [x, y + s]]); }
    else { by[a] += rect(x, y, s, s); by[b] += rect(x + s * 0.3, y + s * 0.3, s * 0.4, s * 0.4) + rect(x, y, s * 0.22, s * 0.22) + rect(x + s * 0.78, y, s * 0.22, s * 0.22) + rect(x, y + s * 0.78, s * 0.22, s * 0.22) + rect(x + s * 0.78, y + s * 0.78, s * 0.22, s * 0.22); }
    st += dash([[x + 4, y + 4], [x + s - 4, y + 4], [x + s - 4, y + s - 4], [x + 4, y + s - 4], [x + 4, y + 4]], 4, 4);
  }
  for (let c = 0; c <= cols; c++) seams += line([[c * s, 0], [c * s, rows * s]]);
  for (let r = 0; r <= rows; r++) seams += line([[0, r * s], [cols * s, r * s]]);
  return [...by.map((d, i) => sh(d, pal[i])).filter((p) => p.d), stroke(seams, '#5a4636', 1, { opacity: 0.45 }), stroke(st, '#ffffff', 1, { opacity: 0.55 })];
}

/** Round woven basket seen from the front, origin bottom centre; contents go behind it at y = -h. */
export function wovenBasket(w: number, h: number, col = '#c99a5b'): Shape[] {
  const body = M(-w * 0.46, -h) + L(w * 0.46, -h) + Q(w * 0.58, -h * 0.4, w * 0.4, 0) + L(-w * 0.4, 0) + Q(-w * 0.58, -h * 0.4, -w * 0.46, -h) + 'Z';
  let rows = '', vs = '';
  const n = Math.max(4, Math.round(h / 11));
  for (let i = 1; i < n; i++) {
    const yy = (-h * i) / n;
    rows += M(-w * 0.47, yy) + Q(0, yy + h * 0.05, w * 0.47, yy);
    for (let k = -5; k <= 5; k++) vs += line([[(k + (i % 2) * 0.5) * w * 0.078, yy + 1], [(k + (i % 2) * 0.5) * w * 0.078, yy + h / n - 1]]);
  }
  return [
    shadow(0, 0, w * 0.5, h * 0.08), stroke(M(-w * 0.5, -h * 0.82) + Q(-w * 0.66, -h * 0.7, -w * 0.52, -h * 0.5) + M(w * 0.5, -h * 0.82) + Q(w * 0.66, -h * 0.7, w * 0.52, -h * 0.5), shade(col, -0.25), 5),
    ol(body, col, 1.2, -0.35), sh(M(w * 0.2, -h) + L(w * 0.46, -h) + Q(w * 0.58, -h * 0.4, w * 0.4, 0) + L(w * 0.16, 0) + 'Z', '#000000', { opacity: 0.1 }),
    stroke(vs, shade(col, -0.3), 1.2, { opacity: 0.8 }), stroke(rows, shade(col, 0.28), 1.6, { opacity: 0.8 }),
    ol(rect(-w * 0.5, -h - h * 0.07, w, h * 0.14, h * 0.07), shade(col, 0.12), 1, -0.4), stroke(dash([[-w * 0.46, -h], [w * 0.46, -h]], 5, 4), shade(col, -0.3), 1.2),
  ];
}

/** Wooden chair seen from behind, height h. */
export function chairBack(h: number, col = Y.wood, pad = Y.red): Shape[] {
  const w = h * 0.46, sy = -h * 0.46;
  let slats = '';
  for (let i = -1; i <= 1; i++) slats += rect(i * w * 0.24 - w * 0.07, -h * 0.9, w * 0.14, h * 0.4, 3);
  return [
    shadow(0, 0, w * 0.62, h * 0.03),
    sh(rect(-w * 0.44, sy, w * 0.08, -sy) + rect(w * 0.36, sy, w * 0.08, -sy), shade(col, -0.2)),
    sh(rect(-w * 0.3, sy, w * 0.06, -sy * 0.94) + rect(w * 0.24, sy, w * 0.06, -sy * 0.94), shade(col, -0.32)), sh(rect(-w * 0.4, -h * 0.2, w * 0.8, h * 0.025), shade(col, -0.25)),
    ol(rect(-w * 0.5, sy - h * 0.045, w, h * 0.06, 4), pad, 1, -0.3), ol(rect(-w * 0.52, sy, w * 1.04, h * 0.05, 3), col, 1, -0.35),
    ol(slats, shade(col, 0.08), 1, -0.35), ol(rect(-w * 0.46, -h * 0.96, w * 0.09, h * 0.52, 3) + rect(w * 0.37, -h * 0.96, w * 0.09, h * 0.52, 3), col, 1, -0.35),
    ol(M(-w * 0.5, -h * 0.9) + Q(0, -h * 1.04, w * 0.5, -h * 0.9) + L(w * 0.5, -h * 0.8) + Q(0, -h * 0.92, -w * 0.5, -h * 0.8) + 'Z', col, 1, -0.35),
  ];
}

/** Angle-poise desk lamp, height s, leaning towards -x. */
export function deskLamp(s: number, col = Y.teal, lit = true): Shape[] {
  const out: Shape[] = [];
  if (lit) out.push(sh(poly([[-s * 0.5, -s * 0.72], [-s * 0.24, -s * 0.66], [-s * 0.1, 0], [-s * 0.86, 0]]), Y.glow, { opacity: 0.16 }), sh(circle(-s * 0.4, -s * 0.66, s * 0.3), Y.glow, { opacity: 0.2 }));
  out.push(
    shadow(s * 0.1, 0, s * 0.24, s * 0.03), ol(rect(-s * 0.08, -s * 0.06, s * 0.36, s * 0.06, s * 0.03), shade(col, -0.2), 1),
    stroke(line([[s * 0.1, -s * 0.06], [s * 0.26, -s * 0.52], [-s * 0.18, -s * 0.88]]), Y.steelDk, s * 0.035), sh(circle(s * 0.26, -s * 0.52, s * 0.035) + circle(s * 0.1, -s * 0.07, s * 0.03), Y.ink),
    ol(poly([[-s * 0.1, -s * 0.96], [-s * 0.22, -s * 0.82], [-s * 0.56, -s * 0.74], [-s * 0.26, -s * 0.58]]), col, 1, -0.3), sh(ellipse(-s * 0.41, -s * 0.66, s * 0.17, s * 0.05, 28), lit ? '#fff6d2' : '#d9d0bc'),
  );
  return out;
}

// =====================================================================
// sewing
// =====================================================================
/** Spool of thread, height s. */
export function spool(s: number, col: string, wood = Y.woodLt): Shape[] {
  const w = s * 0.66;
  let wraps = '';
  for (let i = 1; i < 6; i++) wraps += line([[-w * 0.4, -s * 0.15 - i * s * 0.11], [w * 0.4, -s * 0.18 - i * s * 0.11]]);
  return [
    ol(rect(-w * 0.4, -s * 0.86, w * 0.8, s * 0.72, s * 0.07), col, 1), stroke(wraps, shade(col, -0.22), 0.9), hl(rect(-w * 0.3, -s * 0.82, w * 0.13, s * 0.64, 2), 0.3),
    ol(rect(-w / 2, -s * 0.16, w, s * 0.16, s * 0.05), wood, 0.9, -0.35), ol(rect(-w / 2, -s, w, s * 0.16, s * 0.05), wood, 0.9, -0.35),
  ];
}

/** Spool with a loose thread tail (a nicer silhouette for a target). */
export function spoolLoose(s: number, col: string): Shape[] {
  return [stroke(curve([[s * 0.24, -s * 0.5], [s * 0.6, -s * 0.36], [s * 0.5, -s * 0.08], [s * 0.86, -s * 0.02]]), col, 1.6), ...spool(s, col)];
}

/** Wall rack of thread spools, origin top-left. */
export function threadRack(cols: number, rows: number, s: number, pal: string[], seed: number, wood = Y.wood): Shape[] {
  const g = rng(seed);
  const cw = s * 0.92, rh = s * 1.42, W = cols * cw + s * 0.5, H = rows * rh + s * 0.34;
  const out: Shape[] = [sh(rect(4, 6, W, H, 6), '#000000', { opacity: 0.14 }), ol(rect(0, 0, W, H, 6), wood, 1.4, -0.35), sh(rect(6, 6, W - 12, H - 12, 4), shade(wood, 0.12))];
  for (let r = 0; r < rows; r++) {
    const by = (r + 1) * rh;
    for (let c = 0; c < cols; c++) {
      const cx = s * 0.25 + cw * (c + 0.5);
      if (g.next() < 0.08) { out.push(stroke(line([[cx, by - s * 0.06], [cx, by - s * 0.8]]), shade(wood, -0.35), 2.4)); continue; }
      out.push(...place(spool(s, pal[(c + r * 3 + g.int(0, 2)) % pal.length]), { x: cx, y: by - s * 0.04 }));
    }
    out.push(ol(rect(s * 0.12, by - s * 0.06, W - s * 0.24, s * 0.1, 2), shade(wood, -0.12), 0.8, -0.35));
  }
  return out;
}

/** Sewing button seen face-on, origin centre. */
export function button(r: number, col: string, holes = 4): Shape[] {
  let hd = '';
  if (holes === 4) for (const [x, y] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) hd += circle(x * r * 0.24, y * r * 0.24, r * 0.12);
  else hd = circle(-r * 0.24, 0, r * 0.12) + circle(r * 0.24, 0, r * 0.12);
  return [ol(circle(0, 0, r), col, 1, -0.35), stroke(circle(0, 0, r * 0.66), shade(col, -0.18), r * 0.1), sh(hd, shade(col, -0.55)), hl(ellipse(-r * 0.4, -r * 0.5, r * 0.3, r * 0.14, -35), 0.4)];
}

/** Glass jar full of mixed buttons. */
export function buttonJar(w: number, h: number, seed: number, lid = Y.brass, pal = [Y.red, Y.mustard, Y.teal, Y.cream, Y.navy, Y.rose]): Shape[] {
  const g = rng(seed);
  const by = pal.map(() => '');
  let rim = '';
  for (let i = 0; i < 46; i++) { const x = g.range(-w * 0.36, w * 0.36), y = -g.range(h * 0.1, h * 0.84), r = w * g.range(0.07, 0.11); by[g.int(0, pal.length - 1)] += circle(x, y, r); rim += circle(x, y, r * 0.5); }
  return [
    shadow(0, 0, w * 0.5, h * 0.04), sh(rect(-w / 2, -h, w, h, w * 0.2), '#dbe8e8', { opacity: 0.9 }),
    ...by.map((d, i) => ol(d, pal[i], 0.6, -0.3)).filter((p) => p.d), stroke(rim, '#3b2f2a', 0.6, { opacity: 0.3 }),
    hl(rect(-w * 0.4, -h * 0.9, w * 0.1, h * 0.76, 3), 0.5), stroke(rect(-w / 2, -h, w, h, w * 0.2), '#8fa6a8', 1.2),
    ol(rect(-w * 0.46, -h * 1.1, w * 0.92, h * 0.13, 3), lid, 0.9, -0.35), hl(rect(-w * 0.4, -h * 1.08, w * 0.8, h * 0.03, 2), 0.4),
  ];
}

/** Tomato pin cushion stuck with pins, width s. */
export function pinCushion(s: number, col = Y.red): Shape[] {
  let seg = '', pins = '';
  for (const k of [-0.8, -0.42, 0, 0.42, 0.8]) seg += M(0, -s * 0.62) + Q(k * s * 0.62, -s * 0.36, k * s * 0.42, -s * 0.02);
  const heads: [number, number, string][] = [[-0.34, -0.86, '#fbf6ec'], [-0.12, -0.98, Y.butter], [0.14, -0.94, Y.sky], [0.36, -0.8, '#fbf6ec'], [0.5, -0.6, Y.sage]];
  const hs: Shape[] = [];
  heads.forEach(([x, y, c], i) => { pins += line([[x * s * 0.6, y * s * 0.45 - s * 0.08], [x * s, y * s]]); hs.push(ol(circle(x * s, y * s, s * 0.05), c, 0.7, -0.4)); void i; });
  return [
    shadow(0, 0, s * 0.5, s * 0.05), stroke(pins, '#8a9298', 1.3),
    ol(ellipse(0, -s * 0.32, s * 0.5, s * 0.32), col, 1.2, -0.3), stroke(seg, shade(col, -0.28), 1.2), hl(ellipse(-s * 0.22, -s * 0.46, s * 0.12, s * 0.06, -25), 0.35),
    sh(star(0, -s * 0.62, s * 0.15, s * 0.06, 6), Y.green), ...hs,
  ];
}

/** Dressmaking shears lying flat, blades pointing right; origin at the pivot. */
export function shears(s: number, col = Y.ink): Shape[] {
  const blade = (rot: number, c: string): Shape => ol(xf(poly([[-s * 0.04, -s * 0.05], [s * 0.3, -s * 0.045], [s * 0.6, 0], [-s * 0.04, s * 0.04]]), { rot }), c, 0.9, -0.4);
  return [
    stroke(xf(line([[0, 0], [-s * 0.2, -s * 0.06]]), { rot: 12 }) + xf(line([[0, 0], [-s * 0.2, s * 0.06]]), { rot: -12 }), col, s * 0.07),
    stroke(xf(ellipse(-s * 0.36, -s * 0.11, s * 0.16, s * 0.09, -14), { rot: 12 }), col, s * 0.055), stroke(xf(ellipse(-s * 0.38, s * 0.13, s * 0.19, s * 0.11, 16), { rot: -12 }), col, s * 0.055),
    blade(9, '#aab4ba'), blade(-7, '#d5dde1'), hl(xf(poly([[s * 0.02, -s * 0.03], [s * 0.5, -s * 0.004], [s * 0.02, -s * 0.012]]), { rot: -7 }), 0.6), ol(circle(0, 0, s * 0.035), Y.brass, 0.8, -0.4),
  ];
}

/** Coiled tape measure with a loose tail running left, width ≈ s; origin centre of the coil. */
export function tapeMeasure(s: number, col = '#f2c94c'): Shape[] {
  const tail: Pt[] = [[0, s * 0.2], [-s * 0.22, s * 0.25], [-s * 0.42, s * 0.12], [-s * 0.62, s * 0.2], [-s * 0.78, s * 0.1]];
  let ticks = '';
  sample(tail, 5).forEach(([x, y], i) => { if (i > 1) ticks += line([[x, y - s * 0.055], [x, y - s * (i % 5 === 0 ? -0.02 : 0.005)]]); });
  let coil = '';
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; coil += line([[Math.cos(a) * s * 0.215, Math.sin(a) * s * 0.215], [Math.cos(a) * s * 0.25, Math.sin(a) * s * 0.25]]); }
  return [
    shadow(-s * 0.1, s * 0.28, s * 0.5, s * 0.04, 0.14), ol(ribbon(tail, s * 0.13, 5), col, 1, -0.35), stroke(ticks, '#3b2f2a', 0.9),
    ol(xf(rect(-s * 0.05, -s * 0.075, s * 0.07, s * 0.15, 1.5), { x: -s * 0.78, y: s * 0.1, rot: -25 }), Y.steel, 0.8, -0.4),
    ol(circle(0, 0, s * 0.26), col, 1.1, -0.35), stroke(circle(0, 0, s * 0.2) + circle(0, 0, s * 0.14) + circle(0, 0, s * 0.085), shade(col, -0.28), 1), stroke(coil, '#3b2f2a', 0.8),
    sh(circle(0, 0, s * 0.045), Y.red), hl(ellipse(-s * 0.1, -s * 0.12, s * 0.08, s * 0.04, -40), 0.45),
  ];
}

/** Silver thimble, height s. */
export function thimble(s: number, col = Y.steel): Shape[] {
  let dots = '';
  for (let r = 0; r < 4; r++) for (let c = -2; c <= 2; c++) dots += circle(c * s * 0.1 + (r % 2) * s * 0.05, -s * 0.36 - r * s * 0.13, s * 0.022);
  const body = M(-s * 0.36, -s * 0.12) + L(-s * 0.28, -s * 0.74) + Q(-s * 0.26, -s, 0, -s) + Q(s * 0.26, -s, s * 0.28, -s * 0.74) + L(s * 0.36, -s * 0.12) + 'Z';
  return [shadow(0, 0, s * 0.42, s * 0.05), ol(body, col, 1, -0.4), sh(dots, shade(col, -0.35)), hl(rect(-s * 0.22, -s * 0.84, s * 0.07, s * 0.6, 2), 0.6), ol(rect(-s * 0.4, -s * 0.16, s * 0.8, s * 0.16, s * 0.06), shade(col, 0.12), 1, -0.45)];
}

/** Vintage sewing machine with its needle on the left, width w. */
export function sewingMachine(w: number, col = '#2f3f4a', thread = Y.red): Shape[] {
  const h = w * 0.7, gold = '#dcb65e';
  const body = M(-w * 0.46, -h * 0.36) + L(-w * 0.46, -h * 0.76) + Q(-w * 0.46, -h * 0.9, -w * 0.34, -h * 0.9) + L(w * 0.34, -h * 0.9) + Q(w * 0.46, -h * 0.9, w * 0.46, -h * 0.74) + L(w * 0.46, -h * 0.13) + L(w * 0.2, -h * 0.13) + L(w * 0.2, -h * 0.5) + Q(w * 0.2, -h * 0.6, w * 0.1, -h * 0.6) + L(-w * 0.22, -h * 0.6) + Q(-w * 0.27, -h * 0.6, -w * 0.27, -h * 0.5) + L(-w * 0.27, -h * 0.36) + 'Z';
  let fl = '';
  for (const s of [-1, 1]) fl += M(0, -h * 0.75) + Q(s * w * 0.06, -h * 0.84, s * w * 0.13, -h * 0.75) + Q(s * w * 0.18, -h * 0.68, s * w * 0.24, -h * 0.75) + M(s * w * 0.05, -h * 0.7) + Q(s * w * 0.1, -h * 0.66, s * w * 0.14, -h * 0.7);
  return [
    shadow(0, 0, w * 0.54, h * 0.04),
    stroke(line([[w * 0.08, -h * 0.9], [w * 0.08, -h * 1.16]]), Y.steelDk, 2.4), ...place(spool(h * 0.22, thread), { x: w * 0.08, y: -h * 0.9 }),
    stroke(line([[-w * 0.3, -h * 0.9], [-w * 0.3, -h * 1.0]]), Y.steelDk, 2), stroke(circle(-w * 0.3, -h * 1.02, h * 0.02), Y.steelDk, 1.6),
    ol(rect(w * 0.43, -h * 0.86, w * 0.09, h * 0.36, w * 0.035), '#d5dde1', 1, -0.45), stroke(line([[w * 0.46, -h * 0.8], [w * 0.46, -h * 0.56]]) + line([[w * 0.49, -h * 0.8], [w * 0.49, -h * 0.56]]), '#8a9298', 1),
    ol(rect(-w / 2, -h * 0.14, w, h * 0.14, h * 0.04), col, 1.2, -0.45), ol(body, col, 1.2, -0.45),
    hl(rect(-w * 0.36, -h * 0.87, w * 0.7, h * 0.03, 3), 0.2), hl(rect(-w * 0.47, -h * 0.125, w * 0.94, h * 0.02, 2), 0.16), dk(rect(w * 0.34, -h * 0.88, w * 0.12, h * 0.74, 6), 0.22),
    ol(rect(-w * 0.44, -h * 0.76, w * 0.15, h * 0.38, 4), '#cfd7db', 0.9, -0.4), stroke(line([[-w * 0.365, -h * 0.72], [-w * 0.365, -h * 0.44]]), '#8a9298', 1.2), sh(circle(-w * 0.365, -h * 0.68, h * 0.018) + circle(-w * 0.365, -h * 0.46, h * 0.018), Y.steelDk),
    stroke(line([[-w * 0.385, -h * 0.38], [-w * 0.385, -h * 0.21]]) + line([[-w * 0.33, -h * 0.38], [-w * 0.33, -h * 0.19]]), Y.steelDk, 2.6), stroke(line([[-w * 0.385, -h * 0.22], [-w * 0.385, -h * 0.14]]), '#9aa2a8', 1.2),
    sh(poly([[-w * 0.43, -h * 0.185], [-w * 0.3, -h * 0.185], [-w * 0.29, -h * 0.145], [-w * 0.44, -h * 0.145]]), Y.steel), sh(rect(-w * 0.47, -h * 0.15, w * 0.22, h * 0.025, 2), Y.steelLt),
    stroke(fl, gold, 1.6), sh(circle(0, -h * 0.75, h * 0.024) + circle(-w * 0.24, -h * 0.75, h * 0.014) + circle(w * 0.24, -h * 0.75, h * 0.014), gold),
    stroke(rect(-w * 0.44, -h * 0.105, w * 0.6, h * 0.07, 3), gold, 1), stroke(dash([[-w * 0.4, -h * 0.07], [w * 0.12, -h * 0.07]], 3, 5), gold, 1.2),
    ol(circle(w * 0.33, -h * 0.7, h * 0.075), Y.cream, 1, -0.5), stroke(line([[w * 0.33, -h * 0.7], [w * 0.36, -h * 0.75]]), Y.red, 1.6), ol(circle(w * 0.33, -h * 0.44, h * 0.05), Y.steel, 1, -0.4), ol(rect(w * 0.3, -h * 0.3, w * 0.06, h * 0.08, 2), gold, 0.8, -0.4),
    stroke(curve([[w * 0.1, -h * 1.02], [-w * 0.12, -h * 1.0], [-w * 0.3, -h * 1.02]]) + line([[-w * 0.3, -h * 1.02], [-w * 0.4, -h * 0.76]]) + line([[-w * 0.385, -h * 0.4], [-w * 0.385, -h * 0.16]]), thread, 1),
  ];
}

/** Dressmaker's form on a wooden stand, height h. */
export function dressForm(h: number, col = Y.linen, wood = Y.woodDk): Shape[] {
  const R: Pt[] = [[0.045, -0.955], [0.05, -0.9], [0.15, -0.87], [0.165, -0.82], [0.135, -0.73], [0.095, -0.62], [0.13, -0.52], [0.15, -0.44], [0.13, -0.405]];
  const pts: Pt[] = [...R.map(([x, y]) => [x * h, y * h] as Pt), ...R.map(([x, y]) => [-x * h, y * h] as Pt).reverse()];
  const torso = blob(pts, 0.75);
  return [
    shadow(0, 0, h * 0.2, h * 0.02),
    stroke(line([[0, -h * 0.03], [-h * 0.17, 0]]) + line([[0, -h * 0.03], [h * 0.17, 0]]) + line([[0, -h * 0.03], [0, h * 0.012]]), wood, h * 0.022), sh(circle(-h * 0.17, 0, h * 0.012) + circle(h * 0.17, 0, h * 0.012), Y.ink),
    ol(rect(-h * 0.014, -h * 0.42, h * 0.028, h * 0.4, 2), wood, 1, -0.35), ol(rect(-h * 0.026, -h * 0.2, h * 0.052, h * 0.03, 3), Y.brass, 0.8, -0.4),
    ol(torso, col, 1.3, -0.3), dk(blob([[h * 0.06, -h * 0.86], [h * 0.15, -h * 0.84], [h * 0.125, -h * 0.72], [h * 0.09, -h * 0.62], [h * 0.125, -h * 0.52], [h * 0.14, -h * 0.42], [h * 0.07, -h * 0.41], [h * 0.05, -h * 0.62]], 0.75), 0.1),
    stroke(line([[0, -h * 0.9], [0, -h * 0.405]]) + curve([[-h * 0.1, -h * 0.84], [-h * 0.07, -h * 0.72], [-h * 0.055, -h * 0.62], [-h * 0.08, -h * 0.41]]) + curve([[h * 0.1, -h * 0.84], [h * 0.07, -h * 0.72], [h * 0.055, -h * 0.62], [h * 0.08, -h * 0.41]]), shade(col, -0.25), 1),
    stroke(curve([[-h * 0.098, -h * 0.62], [0, -h * 0.605], [h * 0.098, -h * 0.62]]), shade(col, -0.3), 1.2), stroke(dash([[-h * 0.132, -h * 0.425], [h * 0.132, -h * 0.425]], 4, 3), shade(col, -0.35), 1),
    ol(ellipse(-h * 0.158, -h * 0.82, h * 0.016, h * 0.04, 8) + ellipse(h * 0.158, -h * 0.82, h * 0.016, h * 0.04, -8), shade(col, -0.12), 0.8),
    ol(rect(-h * 0.05, -h * 0.965, h * 0.1, h * 0.022, 3), wood, 0.9, -0.35), ol(circle(0, -h * 0.985, h * 0.02), wood, 0.9, -0.35),
  ];
}

/** Stack of folded fabrics, width w; one layer per colour (bottom first). */
export function fabricStack(w: number, cols: string[], seed: number, t = 15): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [];
  cols.forEach((c, i) => {
    const x = g.range(-3, 3), y = -(i + 1) * t, ww = w + g.range(-8, 2);
    out.push(ol(rect(x - ww / 2, y, ww, t - 1, t * 0.42), c, 1, -0.3));
    const k = (i + seed) % 3;
    if (k === 0) { let d = ''; for (let px = x - ww / 2 + 16; px < x + ww / 2 - 5; px += 9) d += circle(px, y + t * 0.5, 1.7); out.push(sh(d, '#ffffff', { opacity: 0.7 })); }
    else if (k === 1) { let d = ''; for (let px = x - ww / 2 + 16; px < x + ww / 2 - 5; px += 8) d += line([[px, y + 2.5], [px, y + t - 3.5]]); out.push(stroke(d, shade(c, 0.4), 1.6, { opacity: 0.8 })); }
    out.push(stroke(M(x - ww / 2 + 10, y + 1.5) + Q(x - ww / 2 + 3, y + t / 2, x - ww / 2 + 10, y + t - 2.5) + line([[x - ww / 2 + 10, y + t * 0.5], [x + ww / 2 - 6, y + t * 0.5]]), shade(c, -0.25), 1, { opacity: 0.7 }));
  });
  return out;
}

/** Bolt of fabric standing on end, w × h. pat 0 plain, 1 stripes, 2 dots, 3 checks. */
export function bolt(w: number, h: number, col: string, pat = 0): Shape[] {
  const out: Shape[] = [ol(rect(-w / 2, -h, w, h, w * 0.28), col, 1.1, -0.3)];
  let d = '';
  if (pat === 1) { for (let x = -w * 0.3; x <= w * 0.31; x += w * 0.2) d += line([[x, -h + w * 0.5], [x, -4]]); out.push(stroke(d, shade(col, 0.45), w * 0.06, { opacity: 0.8 })); }
  if (pat === 2) { for (let r = 0, y = -h + w * 0.6; y < -5; y += w * 0.26, r++) for (let x = -w * 0.26 + (r % 2) * w * 0.13; x < w * 0.36; x += w * 0.26) d += circle(x, y, w * 0.045); out.push(sh(d, '#ffffff', { opacity: 0.75 })); }
  if (pat === 3) { for (let y = -h + w * 0.6; y < -5; y += w * 0.3) d += line([[-w * 0.44, y], [w * 0.44, y]]); for (let x = -w * 0.25; x <= w * 0.26; x += w * 0.25) d += line([[x, -h + w * 0.5], [x, -4]]); out.push(stroke(d, shade(col, -0.25), 1.2, { opacity: 0.7 })); }
  out.push(dk(rect(w * 0.2, -h, w * 0.3, h, w * 0.2), 0.12), ol(ellipse(0, -h + w * 0.2, w * 0.46, w * 0.2), shade(col, 0.25), 0.9, -0.4), stroke(ellipse(0, -h + w * 0.2, w * 0.3, w * 0.12) + ellipse(0, -h + w * 0.2, w * 0.15, w * 0.06), shade(col, -0.2), 0.9), sh(ellipse(0, -h + w * 0.2, w * 0.07, w * 0.03), '#c9a46a'));
  return out;
}

/** Steam iron seen side-on, pointing left, length s. */
export function iron(s: number, col = Y.teal): Shape[] {
  return [
    shadow(0, 0, s * 0.5, s * 0.04), stroke(curve([[s * 0.42, -s * 0.2], [s * 0.6, -s * 0.24], [s * 0.66, -s * 0.06], [s * 0.82, -s * 0.03]]), Y.ink, 2.2),
    stroke(M(-s * 0.12, -s * 0.36) + Q(-s * 0.12, -s * 0.62, s * 0.1, -s * 0.62) + L(s * 0.3, -s * 0.62) + Q(s * 0.42, -s * 0.62, s * 0.4, -s * 0.38), Y.ink, s * 0.075),
    ol(M(-s * 0.48, -s * 0.07) + Q(-s * 0.22, -s * 0.38, s * 0.08, -s * 0.4) + L(s * 0.42, -s * 0.4) + L(s * 0.42, -s * 0.07) + 'Z', col, 1.2, -0.35), hl(M(-s * 0.34, -s * 0.16) + Q(-s * 0.16, -s * 0.34, s * 0.04, -s * 0.35) + L(s * 0.04, -s * 0.31) + Q(-s * 0.14, -s * 0.3, -s * 0.28, -s * 0.16) + 'Z', 0.3),
    ol(poly([[-s * 0.52, 0], [s * 0.43, 0], [s * 0.43, -s * 0.075], [-s * 0.46, -s * 0.075]]), Y.steelLt, 1, -0.45), ol(circle(s * 0.24, -s * 0.24, s * 0.06), Y.cream, 0.9, -0.4), stroke(line([[s * 0.24, -s * 0.24], [s * 0.27, -s * 0.28]]), Y.red, 1.4),
  ];
}

/** Metal bobbin wound with thread, origin centre. */
export function bobbin(r: number, thread = Y.teal): Shape[] {
  let holes = '';
  for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; holes += circle(Math.cos(a) * r * 0.6, Math.sin(a) * r * 0.6, r * 0.14); }
  return [
    stroke(curve([[r * 0.8, r * 0.4], [r * 1.5, r * 0.8], [r * 1.3, r * 1.4], [r * 2.0, r * 1.5]]), thread, 1.4),
    ol(circle(0, 0, r), Y.steel, 1, -0.45), sh(holes, thread), stroke(holes, shade(thread, -0.3), 0.6), sh(circle(0, 0, r * 0.22), Y.ink), hl(ellipse(-r * 0.3, -r * 0.62, r * 0.36, r * 0.12, -20), 0.6),
  ];
}

/** Safety pin lying flat, length s, origin centre. */
export function safetyPin(s: number, col = Y.brass): Shape[] {
  return [
    stroke(M(-s * 0.4, -s * 0.07) + L(s * 0.34, -s * 0.11) + M(-s * 0.4, s * 0.07) + L(s * 0.36, s * 0.1), col, s * 0.05), stroke(circle(-s * 0.43, 0, s * 0.075), col, s * 0.05),
    ol(blob([[s * 0.3, -s * 0.15], [s * 0.46, -s * 0.13], [s * 0.5, 0], [s * 0.46, s * 0.14], [s * 0.3, s * 0.15], [s * 0.34, 0]], 0.8), col, 0.9, -0.35), hl(ellipse(s * 0.42, -s * 0.07, s * 0.05, s * 0.025), 0.6),
  ];
}

/** Embroidery hoop with a stitched flower, origin centre. */
export function embroideryHoop(r: number, flower = Y.coral, cloth = '#fbf5e6', wood = Y.woodLt): Shape[] {
  let pt = '';
  for (let k = 0; k < 6; k++) pt += petal(0, -r * 0.14, r * 0.34, r * 0.13, k * 60 + 30);
  return [
    ol(rect(-r * 0.13, -r * 1.2, r * 0.26, r * 0.24, 2), Y.brass, 0.8, -0.4), stroke(line([[-r * 0.2, -r * 1.12], [r * 0.2, -r * 1.12]]), Y.steelDk, 1.6),
    ol(circle(0, 0, r), wood, 1.2, -0.4), sh(circle(0, 0, r * 0.86), cloth), stroke(circle(0, 0, r * 0.86), shade(wood, -0.3), 1),
    stroke(curve([[0, -r * 0.1], [r * 0.06, r * 0.3], [-r * 0.04, r * 0.66]]), Y.green, r * 0.05), sh(leaf(r * 0.03, r * 0.3, r * 0.34, r * 0.11, -30) + leaf(0, r * 0.46, r * 0.3, r * 0.1, 205), Y.green),
    ol(pt, flower, 0.7, -0.25), sh(circle(0, -r * 0.14, r * 0.1), Y.butter), stroke(dash(sample([[-r * 0.66, -r * 0.2], [-r * 0.56, r * 0.3], [-r * 0.24, r * 0.66]], 6), 3, 3), Y.sky, 1.2),
  ];
}

/** Reel of ribbon with a loose tail, origin centre of the reel. */
export function ribbonReel(r: number, col = Y.rose): Shape[] {
  const tail: Pt[] = [[r * 0.5, r * 0.5], [r * 1.0, r * 0.96], [r * 1.5, r * 0.74], [r * 2.0, r * 1.0]];
  return [
    ol(ribbon(tail, r * 0.34, 5), col, 0.9, -0.3), stroke(curve(tail), shade(col, 0.3), 1, { opacity: 0.7 }),
    ol(circle(0, 0, r), Y.cream, 1, -0.35), stroke(circle(0, 0, r * 0.62), col, r * 0.4), stroke(circle(0, 0, r * 0.62) + circle(0, 0, r * 0.5) + circle(0, 0, r * 0.74), shade(col, -0.25), 0.8),
    ol(circle(0, 0, r * 0.2), Y.woodLt, 0.8, -0.4), hl(ellipse(-r * 0.4, -r * 0.5, r * 0.28, r * 0.1, -40), 0.35),
  ];
}

/** Tailor's chalk, a worn rounded triangle; origin centre. */
export function tailorsChalk(s: number, col = Y.sky): Shape[] {
  return [
    shadow(0, s * 0.36, s * 0.46, s * 0.06, 0.16), ol(blob([[-s * 0.5, s * 0.3], [0, -s * 0.42], [s * 0.5, s * 0.3], [0, s * 0.36]], 0.45), col, 1, -0.3),
    stroke(curve([[-s * 0.3, s * 0.18], [0, -s * 0.22], [s * 0.3, s * 0.18]]), shade(col, 0.4), 1.6), hl(ellipse(-s * 0.1, -s * 0.02, s * 0.1, s * 0.05, -50), 0.4), dk(blob([[-s * 0.5, s * 0.3], [0, s * 0.24], [s * 0.5, s * 0.3], [0, s * 0.37]], 0.5), 0.14),
  ];
}

/** Paper pattern envelope with a dress sketch, width w. */
export function patternEnvelope(w: number, col = Y.coral): Shape[] {
  const h = w * 1.36;
  const dress = M(-w * 0.1, -h * 0.74) + Q(0, -h * 0.7, w * 0.1, -h * 0.74) + L(w * 0.075, -h * 0.56) + L(w * 0.25, -h * 0.2) + Q(0, -h * 0.16, -w * 0.25, -h * 0.2) + L(-w * 0.075, -h * 0.56) + 'Z';
  return [
    sh(rect(-w / 2 + 3, -h + 3, w, h, 3), '#000000', { opacity: 0.14 }), ol(rect(-w / 2, -h, w, h, 3), '#fbf3df', 1, -0.3), sh(rect(-w / 2, -h, w, h * 0.14, 3), col),
    stroke(line([[-w * 0.36, -h * 0.93], [w * 0.1, -h * 0.93]]), '#ffffff', 2.4), sh(rect(w * 0.24, -h * 0.97, w * 0.18, h * 0.08, 2), '#ffffff', { opacity: 0.85 }),
    stroke(line([[-w * 0.08, -h * 0.74], [-w * 0.06, -h * 0.82]]) + line([[w * 0.08, -h * 0.74], [w * 0.06, -h * 0.82]]), shade(col, -0.25), 1.4),
    ol(dress, col, 1, -0.3), sh(rect(-w * 0.08, -h * 0.575, w * 0.16, h * 0.025), shade(col, -0.3)), stroke(curve([[-w * 0.1, -h * 0.5], [-w * 0.13, -h * 0.34], [-w * 0.15, -h * 0.2]]) + curve([[w * 0.03, -h * 0.5], [w * 0.05, -h * 0.34], [w * 0.06, -h * 0.19]]), shade(col, -0.2), 1),
    stroke(line([[-w * 0.36, -h * 0.1], [w * 0.36, -h * 0.1]]) + line([[-w * 0.36, -h * 0.05], [w * 0.12, -h * 0.05]]), '#9a8a70', 1.2),
  ];
}

/** Tissue pattern piece (a bodice) with seam allowance and grain line; origin centre, about w × w·1.1. */
export function patternPiece(w: number, tint = '#f3e2bd'): Shape[] {
  const o: Pt[] = [[-w * 0.4, -w * 0.5], [-w * 0.12, -w * 0.55], [0, -w * 0.4], [w * 0.2, -w * 0.52], [w * 0.4, -w * 0.4], [w * 0.3, -w * 0.12], [w * 0.44, w * 0.5], [-w * 0.44, w * 0.52]];
  const inner = o.map(([x, y]) => [x * 0.86, y * 0.86 + w * 0.01] as Pt);
  return [
    ol(poly(o), tint, 1, -0.35), stroke(dash([...inner, inner[0]], 6, 4), '#7a6a52', 1),
    stroke(line([[-w * 0.16, -w * 0.26], [-w * 0.16, w * 0.32]]) + line([[-w * 0.2, -w * 0.2], [-w * 0.16, -w * 0.26], [-w * 0.12, -w * 0.2]]) + line([[-w * 0.2, w * 0.26], [-w * 0.16, w * 0.32], [-w * 0.12, w * 0.26]]), '#7a6a52', 1.2),
    sh(poly([[w * 0.42, w * 0.2], [w * 0.36, w * 0.24], [w * 0.43, w * 0.28]]) + poly([[-w * 0.44, w * 0.1], [-w * 0.38, w * 0.14], [-w * 0.44, w * 0.18]]), '#7a6a52'), stroke(circle(w * 0.12, 0, w * 0.035) + circle(w * 0.12, w * 0.22, w * 0.035), '#7a6a52', 1),
  ];
}

// =====================================================================
// yarn
// =====================================================================
/** Ball of yarn, radius r, origin centre. */
export function yarnBall(r: number, col: string, tail = false): Shape[] {
  let a = '';
  for (const y of [-0.5, -0.15, 0.2, 0.55]) { const c = Math.sqrt(1 - y * y) * 0.96; a += M(-r * c, r * y) + Q(0, r * (y - 0.45), r * c, r * y); }
  const out: Shape[] = [];
  if (tail) out.push(stroke(curve([[r * 0.6, r * 0.6], [r * 1.25, r * 0.95], [r * 1.0, r * 1.3], [r * 1.7, r * 1.36]]), col, Math.max(1.6, r * 0.09)));
  out.push(ol(circle(0, 0, r), col, 1.1, -0.3), stroke(a, shade(col, -0.22), 1.1), stroke(xf(a, { rot: 62 }), shade(col, 0.22), 1.1), stroke(xf(a, { rot: -58 }), shade(col, -0.12), 1.1), hl(ellipse(-r * 0.36, -r * 0.42, r * 0.22, r * 0.12, -35), 0.25));
  return out;
}

/** Twisted hank of yarn lying on its side, width w, origin centre. */
export function skein(w: number, col: string, band = true): Shape[] {
  const h = w * 0.34;
  let tw = '', tw2 = '';
  for (let i = -3; i <= 3; i++) { const x = i * w * 0.115; const c = curve([[x - w * 0.06, -h * 0.43], [x, 0], [x + w * 0.06, h * 0.43]]); if (i % 2) tw2 += c; else tw += c; }
  const out: Shape[] = [
    ol(blob([[-w / 2, 0], [-w * 0.36, -h / 2], [0, -h * 0.44], [w * 0.36, -h / 2], [w / 2, 0], [w * 0.36, h / 2], [0, h * 0.44], [-w * 0.36, h / 2]], 0.9), col, 1.1, -0.3),
    stroke(tw, shade(col, -0.24), 1.3), stroke(tw2, shade(col, 0.2), 1.3), sh(ellipse(-w * 0.44, 0, w * 0.04, h * 0.22) + ellipse(w * 0.44, 0, w * 0.04, h * 0.22), shade(col, -0.3)),
  ];
  if (band) out.push(ol(rect(-w * 0.1, -h * 0.5, w * 0.2, h, 2), '#fbf5e6', 0.8, -0.3), stroke(line([[-w * 0.05, -h * 0.12], [w * 0.05, -h * 0.12]]) + line([[-w * 0.05, h * 0.1], [w * 0.05, h * 0.1]]), '#9a8a70', 1));
  return out;
}

/** Centre-pull cake of yarn, width w. */
export function yarnCake(w: number, col: string): Shape[] {
  const h = w * 0.62;
  let a = '', b = '';
  for (let i = -3; i <= 3; i++) { a += line([[i * w * 0.14 - w * 0.07, -h * 0.94], [i * w * 0.14 + w * 0.07, -h * 0.04]]); b += line([[i * w * 0.14 + w * 0.07, -h * 0.94], [i * w * 0.14 - w * 0.07, -h * 0.04]]); }
  return [ol(rect(-w / 2, -h, w, h, w * 0.13), col, 1.1, -0.3), stroke(a, shade(col, -0.2), 1.1), stroke(b, shade(col, 0.2), 1.1), dk(rect(w * 0.24, -h, w * 0.26, h, w * 0.12), 0.1), ol(ellipse(0, -h, w * 0.5, w * 0.15), shade(col, 0.16), 1, -0.4), stroke(ellipse(0, -h, w * 0.32, w * 0.09), shade(col, -0.15), 1), sh(ellipse(0, -h, w * 0.12, w * 0.04), shade(col, -0.45))];
}

/** Yarn filling one cubby (cw × ch); origin bottom-left of the opening. kind 0 balls, 1 skeins, 2 cakes. */
export function cubbyYarn(kind: number, cw: number, ch: number, col: string, seed: number): Shape[] {
  const g = rng(seed);
  const v = () => shade(col, g.range(-0.14, 0.16));
  const out: Shape[] = [];
  if (kind === 0) {
    const r = cw / 6.6;
    for (let i = 0; i < 3; i++) out.push(...place(yarnBall(r, v()), { x: cw * (0.19 + i * 0.31), y: -r - 1, rot: g.range(-40, 40) }));
    for (let i = 0; i < 2; i++) out.push(...place(yarnBall(r, v()), { x: cw * (0.345 + i * 0.31), y: -r * 2.72 - 1, rot: g.range(-40, 40) }));
    if (ch > r * 6.4) out.push(...place(yarnBall(r, v()), { x: cw * 0.5, y: -r * 4.44 - 1, rot: g.range(-40, 40) }));
  } else if (kind === 1) {
    const w = cw * 0.86, h = w * 0.34, n = Math.min(4, Math.floor((ch - 6) / (h * 0.9)));
    for (let i = 0; i < n; i++) out.push(...place(skein(w, v(), i % 2 === 0), { x: cw / 2 + g.range(-3, 3), y: -h / 2 - 1 - i * h * 0.9 }));
  } else {
    const w = cw * 0.44;
    out.push(...place(yarnCake(w, v()), { x: cw * 0.26, y: -1 }), ...place(yarnCake(w, v()), { x: cw * 0.74, y: -1 }), ...place(yarnCake(w, v()), { x: cw * 0.5, y: -w * 0.64 }));
  }
  return out;
}

/** Fluffy pompom, origin centre. */
export function pompom(r: number, col: string): Shape[] {
  return [ol(star(0, 0, r, r * 0.74, 13), col, 0.9, -0.25), sh(star(0, 0, r * 0.72, r * 0.48, 11, -70), shade(col, 0.22)), sh(star(0, 0, r * 0.4, r * 0.24, 9, -50), shade(col, -0.1))];
}

/** Bobble hat, width s. */
export function bobbleHat(s: number, col = Y.red, band = Y.cream): Shape[] {
  let ribs = '', zig = M(-s * 0.39, -s * 0.46), dots = '';
  for (let i = -5; i <= 5; i++) ribs += line([[i * s * 0.075, -s * 0.22], [i * s * 0.075, -s * 0.03]]);
  for (let i = 0; i <= 8; i++) zig += L(-s * 0.39 + (i + 0.5) * s * 0.0867 - s * 0.0433, -s * 0.46 + (i % 2 ? -s * 0.09 : 0));
  for (let i = -3; i <= 3; i++) dots += circle(i * s * 0.1, -s * 0.66, s * 0.02);
  return [
    ol(M(-s * 0.42, -s * 0.2) + Q(-s * 0.44, -s * 0.86, 0, -s * 0.9) + Q(s * 0.44, -s * 0.86, s * 0.42, -s * 0.2) + 'Z', col, 1.2, -0.3), stroke(zig, band, s * 0.04), sh(dots, band),
    stroke(M(-s * 0.41, -s * 0.34) + Q(0, -s * 0.3, s * 0.41, -s * 0.34), shade(col, -0.25), 1.2), ol(rect(-s * 0.46, -s * 0.25, s * 0.92, s * 0.25, s * 0.07), band, 1.1, -0.3), stroke(ribs, shade(band, -0.25), 1.2),
    ...place(pompom(s * 0.18, band), { y: -s * 0.98 }),
  ];
}

/** Knitted sock hanging from its cuff; origin top centre, length s. */
export function sock(s: number, col = Y.teal, stripe = Y.cream): Shape[] {
  const body = M(-s * 0.16, 0) + L(s * 0.16, 0) + L(s * 0.16, s * 0.55) + Q(s * 0.18, s * 0.72, s * 0.42, s * 0.76) + Q(s * 0.62, s * 0.8, s * 0.58, s * 0.93) + Q(s * 0.55, s, s * 0.3, s) + L(-s * 0.02, s) + Q(-s * 0.18, s * 0.98, -s * 0.16, s * 0.7) + 'Z';
  let ribs = '';
  for (let i = -2; i <= 2; i++) ribs += line([[i * s * 0.06, s * 0.02], [i * s * 0.06, s * 0.13]]);
  return [
    ol(body, col, 1.2, -0.3), sh(rect(-s * 0.155, s * 0.22, s * 0.31, s * 0.055) + rect(-s * 0.155, s * 0.34, s * 0.31, s * 0.055) + rect(-s * 0.155, s * 0.46, s * 0.31, s * 0.055), stripe),
    ol(blob([[s * 0.44, s * 0.775], [s * 0.6, s * 0.83], [s * 0.57, s * 0.95], [s * 0.42, s * 0.99], [s * 0.4, s * 0.88]], 0.8), stripe, 0.9, -0.3), ol(circle(-s * 0.03, s * 0.86, s * 0.09), stripe, 0.9, -0.3),
    ol(rect(-s * 0.19, 0, s * 0.38, s * 0.15, s * 0.04), stripe, 1.1, -0.3), stroke(ribs, shade(stripe, -0.25), 1.1),
  ];
}

/** Mitten hanging from its cuff; origin top centre, length s. */
export function mitten(s: number, col = Y.red, trim = Y.cream): Shape[] {
  let ribs = '', fl = '';
  for (let i = -3; i <= 3; i++) ribs += line([[i * s * 0.055, s * 0.02], [i * s * 0.055, s * 0.18]]);
  for (let k = 0; k < 4; k++) fl += xf(line([[0, -s * 0.11], [0, s * 0.11]]), { rot: k * 45, x: s * 0.02, y: s * 0.6 });
  return [
    ol(blob([[-s * 0.18, s * 0.36], [-s * 0.4, s * 0.38], [-s * 0.46, s * 0.56], [-s * 0.34, s * 0.64], [-s * 0.2, s * 0.56]], 0.85), col, 1.2, -0.3),
    ol(blob([[-s * 0.2, s * 0.2], [s * 0.2, s * 0.2], [s * 0.27, s * 0.55], [s * 0.21, s * 0.9], [0, s], [-s * 0.2, s * 0.9], [-s * 0.26, s * 0.55]], 0.8), col, 1.2, -0.3), stroke(fl, trim, s * 0.03), sh(circle(s * 0.02, s * 0.6, s * 0.035), trim),
    ol(rect(-s * 0.23, 0, s * 0.46, s * 0.21, s * 0.05), trim, 1.1, -0.3), stroke(ribs, shade(trim, -0.25), 1.1),
  ];
}

/** Tiny knitted sweater sample hanging flat; origin top centre (neck), length s. */
export function miniSweater(s: number, col = Y.mustard, accent = Y.cream): Shape[] {
  let zig = M(-s * 0.29, s * 0.3);
  for (let i = 0; i <= 8; i++) zig += L(-s * 0.29 + (i + 0.5) * s * 0.0644, s * 0.3 + (i % 2 ? 0 : -s * 0.07));
  const sleeve = (k: number) => poly([[k * s * 0.28, s * 0.08], [k * s * 0.62, s * 0.52], [k * s * 0.5, s * 0.62], [k * s * 0.28, s * 0.4]]);
  return [
    ol(sleeve(-1), shade(col, -0.08), 1.1, -0.3), ol(sleeve(1), shade(col, -0.08), 1.1, -0.3), sh(poly([[-s * 0.62, s * 0.52], [-s * 0.5, s * 0.62], [-s * 0.54, s * 0.66], [-s * 0.66, s * 0.56]]) + poly([[s * 0.62, s * 0.52], [s * 0.5, s * 0.62], [s * 0.54, s * 0.66], [s * 0.66, s * 0.56]]), accent),
    ol(M(-s * 0.3, s * 0.06) + L(-s * 0.12, s * 0.02) + Q(0, s * 0.12, s * 0.12, s * 0.02) + L(s * 0.3, s * 0.06) + L(s * 0.3, s * 0.82) + L(-s * 0.3, s * 0.82) + 'Z', col, 1.2, -0.3),
    stroke(zig, accent, s * 0.035), sh(circle(-s * 0.16, s * 0.42, s * 0.025) + circle(0, s * 0.42, s * 0.025) + circle(s * 0.16, s * 0.42, s * 0.025), accent),
    sh(rect(-s * 0.3, s * 0.74, s * 0.6, s * 0.08), accent), stroke(M(-s * 0.12, s * 0.02) + Q(0, s * 0.12, s * 0.12, s * 0.02), accent, s * 0.05), stroke(rect(-s * 0.3, s * 0.74, s * 0.6, s * 0.08), shade(col, -0.3), 0.9),
  ];
}

/** Wooden clothes peg, origin centre. */
export const peg = (s: number): Shape[] => [ol(rect(-s * 0.14, -s * 0.5, s * 0.28, s, 2), Y.woodLt, 0.8, -0.4), stroke(line([[0, -s * 0.1], [0, s * 0.5]]), shade(Y.woodLt, -0.4), 1), stroke(line([[-s * 0.16, -s * 0.12], [s * 0.16, -s * 0.12]]), Y.steelDk, 1.4)];

/** Knitting in progress: a swatch on two needles; origin centre, width ≈ s. */
export function knitting(s: number, col = Y.teal, needle = Y.woodLt): Shape[] {
  let vs = '', loops = '';
  for (let r = 0; r < 5; r++) { let z = M(-s * 0.33, -s * 0.02 + r * s * 0.1); for (let i = 0; i <= 10; i++) z += L(-s * 0.33 + (i + 0.5) * s * 0.06, -s * 0.02 + r * s * 0.1 + (i % 2 ? 0 : s * 0.05)); vs += z; }
  for (let i = 0; i < 9; i++) loops += circle(-s * 0.3 + i * s * 0.075, -s * 0.14 - i * s * 0.012, s * 0.04);
  return [
    stroke(curve([[s * 0.34, s * 0.3], [s * 0.6, s * 0.5], [s * 0.42, s * 0.62], [s * 0.72, s * 0.7]]), col, 2),
    stroke(line([[s * 0.5, -s * 0.52], [-s * 0.16, s * 0.2]]), needle, s * 0.045), sh(circle(s * 0.5, -s * 0.52, s * 0.045), Y.red),
    ol(M(-s * 0.36, -s * 0.12) + L(s * 0.36, -s * 0.2) + L(s * 0.36, s * 0.44) + Q(0, s * 0.5, -s * 0.36, s * 0.44) + 'Z', col, 1.2, -0.3), stroke(vs, shade(col, 0.28), 1.1, { opacity: 0.8 }),
    stroke(line([[-s * 0.62, -s * 0.09], [s * 0.6, -s * 0.24]]), needle, s * 0.045), stroke(line([[-s * 0.62, -s * 0.09], [s * 0.6, -s * 0.24]]), shade(needle, -0.35), 0.8), ol(loops, shade(col, 0.1), 0.8, -0.35), sh(circle(-s * 0.63, -s * 0.09, s * 0.05), Y.red),
  ];
}

/** Crochet hook lying flat, length l, origin centre. */
export function crochetHook(l: number, col = Y.plum): Shape[] {
  return [
    stroke(line([[-l * 0.12, 0], [l * 0.45, 0]]), '#aeb8be', l * 0.035), stroke(M(l * 0.45, 0) + Q(l * 0.52, 0, l * 0.5, -l * 0.045) + L(l * 0.45, -l * 0.04), '#aeb8be', l * 0.03),
    ol(rect(-l * 0.5, -l * 0.04, l * 0.42, l * 0.08, l * 0.04), col, 0.9, -0.3), hl(rect(-l * 0.44, -l * 0.026, l * 0.3, l * 0.018, 2), 0.35), sh(rect(-l * 0.2, -l * 0.04, l * 0.03, l * 0.08), shade(col, -0.3)),
  ];
}

/** Ceramic yarn bowl with a ball inside and a strand through its swirl slot, width w. */
export function yarnBowl(w: number, col = Y.sky, yarn = Y.mustard): Shape[] {
  return [
    shadow(0, 0, w * 0.4, w * 0.05), sh(ellipse(0, -w * 0.5, w * 0.5, w * 0.1), shade(col, -0.4)), ...place(yarnBall(w * 0.3, yarn), { y: -w * 0.56 }),
    ol(M(-w / 2, -w * 0.5) + Q(-w * 0.5, 0, -w * 0.2, 0) + L(w * 0.2, 0) + Q(w * 0.5, 0, w / 2, -w * 0.5) + Q(0, -w * 0.38, -w / 2, -w * 0.5) + 'Z', col, 1.2, -0.3),
    dk(M(w * 0.2, -w * 0.44) + Q(w * 0.36, -w * 0.46, w / 2, -w * 0.5) + Q(w * 0.5, 0, w * 0.2, 0) + 'Z', 0.1), stroke(M(-w * 0.44, -w * 0.3) + Q(0, -w * 0.2, w * 0.44, -w * 0.3), '#ffffff', 2, { opacity: 0.6 }),
    stroke(M(w * 0.14, -w * 0.43) + Q(w * 0.2, -w * 0.2, w * 0.04, -w * 0.2) + Q(-w * 0.08, -w * 0.2, -w * 0.05, -w * 0.3), shade(col, -0.5), w * 0.04),
    stroke(curve([[-w * 0.05, -w * 0.3], [-w * 0.2, -w * 0.16], [-w * 0.5, -w * 0.06], [-w * 0.72, 0]]), yarn, 2), hl(ellipse(-w * 0.3, -w * 0.3, w * 0.04, w * 0.1, 20), 0.4),
  ];
}

/** Umbrella swift holding a hank of yarn, clamped at y = 0; height h. */
export function swift(h: number, yarn = Y.coral, wood = Y.woodLt): Shape[] {
  const r = h * 0.4, top = -h * 0.92, bot = -h * 0.22, mid = -h * 0.57;
  let back = '', front = '', strands = '';
  for (let i = 0; i <= 6; i++) { const x = -r + (i * r) / 3; const d = line([[x * 0.12, top], [x, mid], [x * 0.12, bot]]) + line([[x * 0.55, (top + mid) / 2], [x * 0.55 - (x > 0 ? r * 0.3 : -r * 0.3), mid]]); if (i % 2) front += d; else back += d; }
  for (let i = -1; i <= 1; i++) strands += M(-r * 1.02, mid + i * h * 0.022) + Q(0, mid + i * h * 0.022 + h * 0.012, r * 1.02, mid + i * h * 0.022);
  return [
    ol(rect(-h * 0.07, -h * 0.05, h * 0.14, h * 0.05, 2), shade(wood, -0.2), 1, -0.4), stroke(line([[0, 0], [0, h * 0.1]]) + line([[-h * 0.04, h * 0.1], [h * 0.04, h * 0.1]]), Y.steelDk, 2.4),
    stroke(line([[0, -h * 0.05], [0, -h]]), wood, h * 0.03), stroke(back, shade(wood, -0.2), 2.2),
    ol(rect(-r * 1.04, mid - h * 0.045, r * 2.08, h * 0.09, h * 0.04), yarn, 1.1, -0.3), stroke(strands, shade(yarn, -0.22), 1), hl(rect(-r * 0.9, mid - h * 0.036, r * 1.2, h * 0.014, 3), 0.25),
    stroke(front, wood, 2.4), ol(rect(-h * 0.035, top - h * 0.02, h * 0.07, h * 0.05, 2), shade(wood, -0.15), 0.9, -0.4), ol(rect(-h * 0.035, bot - h * 0.02, h * 0.07, h * 0.05, 2), shade(wood, -0.15), 0.9, -0.4), ol(circle(0, -h, h * 0.03), wood, 0.9, -0.4),
  ];
}

/** Hand-cranked ball winder with a cake of yarn on it, width ≈ s. */
export function ballWinder(s: number, col = Y.teal, yarn = Y.coral): Shape[] {
  return [
    shadow(0, 0, s * 0.42, s * 0.04), stroke(M(s * 0.26, -s * 0.24) + L(s * 0.46, -s * 0.74) + L(s * 0.36, -s * 0.8), Y.steelDk, 2.6), stroke(circle(s * 0.33, -s * 0.82, s * 0.035), Y.steelDk, 2),
    stroke(line([[s * 0.02, -s * 0.3], [s * 0.1, -s * 0.9]]), Y.steelDk, 3), ...place(yarnCake(s * 0.46, yarn), { x: s * 0.03, y: -s * 0.3, rot: 8 }),
    ol(rect(-s * 0.34, -s * 0.3, s * 0.68, s * 0.3, s * 0.06), col, 1.2, -0.35), hl(rect(-s * 0.3, -s * 0.27, s * 0.6, s * 0.04, 3), 0.25), dk(rect(s * 0.14, -s * 0.3, s * 0.2, s * 0.3, s * 0.05), 0.14),
    ol(circle(-s * 0.16, -s * 0.15, s * 0.1), Y.cream, 1, -0.4), stroke(line([[-s * 0.16, -s * 0.15], [-s * 0.4, -s * 0.34]]), Y.steelDk, 3), ol(rect(-s * 0.46, -s * 0.5, s * 0.1, s * 0.18, s * 0.04), Y.red, 1, -0.35), sh(circle(-s * 0.16, -s * 0.15, s * 0.03), Y.ink),
    stroke(curve([[s * 0.33, -s * 0.82], [s * 0.24, -s * 0.74], [s * 0.2, -s * 0.6]]), yarn, 1.4),
  ];
}

/** Jar bristling with knitting needles, jar height s. */
export function needleJar(s: number, seed: number, col = Y.cream, band = Y.teal): Shape[] {
  const g = rng(seed);
  const pal = [Y.woodLt, Y.steel, Y.red, Y.mustard, Y.sky, Y.rose, Y.sage];
  const out: Shape[] = [shadow(0, 0, s * 0.34, s * 0.04)];
  for (let i = 0; i < 9; i++) {
    const x0 = (-0.2 + i * 0.05) * s, x1 = x0 * 2.2 + g.range(-0.06, 0.06) * s, y1 = -s * g.range(1.3, 1.85), c = pal[i % pal.length];
    out.push(stroke(line([[x0, -s * 0.6], [x1, y1]]), c, s * 0.035), sh(circle(x1, y1, s * 0.04), shade(c, -0.25)));
  }
  out.push(ol(rect(-s * 0.3, -s * 0.72, s * 0.6, s * 0.72, s * 0.07), col, 1.1, -0.3), sh(rect(-s * 0.3, -s * 0.46, s * 0.6, s * 0.14), band), dk(rect(s * 0.1, -s * 0.72, s * 0.2, s * 0.72, s * 0.06), 0.1), ol(ellipse(0, -s * 0.72, s * 0.3, s * 0.06), shade(col, -0.3), 0.8), hl(rect(-s * 0.23, -s * 0.66, s * 0.06, s * 0.56, 2), 0.35));
  return out;
}

/** Cat curled up asleep, width s. */
export function sleepingCat(s: number, col = '#e39a52', belly = '#fbead0'): Shape[] {
  const d = shade(col, -0.26);
  let str = '';
  for (let i = 0; i < 4; i++) str += curve([[s * (0.02 + i * 0.1), -s * 0.41 + i * s * 0.012], [s * (0.06 + i * 0.1), -s * 0.32], [s * (0.03 + i * 0.1), -s * 0.24]]);
  return [
    shadow(0, 0, s * 0.52, s * 0.05),
    ol(ellipse(s * 0.04, -s * 0.21, s * 0.46, s * 0.21), col, 1.2, -0.28), stroke(str, d, s * 0.03),
    stroke(M(s * 0.46, -s * 0.16) + Q(s * 0.4, s * 0.0, s * 0.0, -s * 0.045) + Q(-s * 0.1, -s * 0.05, -s * 0.14, -s * 0.07), d, s * 0.1), stroke(M(s * 0.46, -s * 0.16) + Q(s * 0.4, s * 0.0, s * 0.0, -s * 0.045) + Q(-s * 0.1, -s * 0.05, -s * 0.14, -s * 0.07), col, s * 0.075),
    ol(poly([[-s * 0.43, -s * 0.3], [-s * 0.42, -s * 0.47], [-s * 0.3, -s * 0.37]]) + poly([[-s * 0.24, -s * 0.38], [-s * 0.14, -s * 0.47], [-s * 0.12, -s * 0.3]]), col, 1, -0.28), sh(poly([[-s * 0.405, -s * 0.33], [-s * 0.4, -s * 0.42], [-s * 0.33, -s * 0.36]]) + poly([[-s * 0.21, -s * 0.37], [-s * 0.155, -s * 0.42], [-s * 0.145, -s * 0.33]]), '#f6c9b0'),
    ol(ellipse(-s * 0.27, -s * 0.21, s * 0.18, s * 0.16), col, 1.2, -0.28), sh(ellipse(-s * 0.27, -s * 0.14, s * 0.1, s * 0.065), belly),
    stroke(curve([[-s * 0.37, -s * 0.23], [-s * 0.335, -s * 0.2], [-s * 0.3, -s * 0.23]]) + curve([[-s * 0.24, -s * 0.23], [-s * 0.205, -s * 0.2], [-s * 0.17, -s * 0.23]]), '#3b2a1c', s * 0.018),
    sh(poly([[-s * 0.29, -s * 0.17], [-s * 0.25, -s * 0.17], [-s * 0.27, -s * 0.145]]), '#d9736a'), stroke(line([[-s * 0.33, -s * 0.15], [-s * 0.5, -s * 0.17]]) + line([[-s * 0.33, -s * 0.13], [-s * 0.49, -s * 0.11]]) + line([[-s * 0.21, -s * 0.15], [-s * 0.05, -s * 0.18]]) + line([[-s * 0.21, -s * 0.13], [-s * 0.06, -s * 0.12]]), '#fbf1dc', 0.9),
  ];
}

/** Woolly toy sheep, width s. */
export function toySheep(s: number, wool = '#fbf3e2', face = '#4a3f3a'): Shape[] {
  let w = '', w2 = '';
  const cs: Pt[] = [[-0.18, -0.52], [0.02, -0.6], [0.22, -0.55], [0.34, -0.42], [0.26, -0.28], [0.06, -0.24], [-0.14, -0.27], [-0.24, -0.4], [0.04, -0.42]];
  for (const [x, y] of cs) { w += circle(x * s, y * s, s * 0.155); w2 += circle(x * s, y * s, s * 0.175); }
  return [
    shadow(0, 0, s * 0.4, s * 0.04), sh(rect(-s * 0.2, -s * 0.24, s * 0.07, s * 0.24, 2) + rect(-s * 0.06, -s * 0.24, s * 0.07, s * 0.24, 2) + rect(s * 0.12, -s * 0.24, s * 0.07, s * 0.24, 2) + rect(s * 0.26, -s * 0.24, s * 0.07, s * 0.24, 2), face),
    sh(w2, shade(wool, -0.28)), sh(w, wool), stroke(curve([[-s * 0.06, -s * 0.5], [0.0, -s * 0.44], [s * 0.08, -s * 0.5]]) + curve([[s * 0.1, -s * 0.36], [s * 0.18, -s * 0.3], [s * 0.26, -s * 0.36]]), shade(wool, -0.2), 1.2),
    ol(ellipse(-s * 0.48, -s * 0.52, s * 0.07, s * 0.035, 25) + ellipse(-s * 0.22, -s * 0.56, s * 0.07, s * 0.035, -25), face, 0.8), ol(ellipse(-s * 0.35, -s * 0.46, s * 0.12, s * 0.15), face, 1),
    sh(circle(-s * 0.35, -s * 0.62, s * 0.08) + circle(-s * 0.28, -s * 0.6, s * 0.06) + circle(-s * 0.42, -s * 0.6, s * 0.06), wool), sh(circle(-s * 0.39, -s * 0.48, s * 0.022) + circle(-s * 0.31, -s * 0.48, s * 0.022), '#ffffff'), sh(circle(-s * 0.39, -s * 0.48, s * 0.01) + circle(-s * 0.31, -s * 0.48, s * 0.01), '#1a1412'),
  ];
}

/** Old-fashioned shop till, width w. */
export function till(w: number, col = '#4a7a68'): Shape[] {
  const h = w * 0.86;
  let keys = '';
  for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) keys += circle(-w * 0.26 + c * w * 0.13 + r * w * 0.012, -h * 0.4 - r * h * 0.1, w * 0.042);
  return [
    shadow(0, 0, w * 0.54, h * 0.04), stroke(line([[w * 0.42, -h * 0.5], [w * 0.6, -h * 0.62]]), Y.steelDk, 3), ol(circle(w * 0.6, -h * 0.62, w * 0.04), Y.ink, 0.8),
    ol(rect(-w * 0.34, -h, w * 0.68, h * 0.26, 4), col, 1.2, -0.35), ol(rect(-w * 0.27, -h * 0.94, w * 0.54, h * 0.14, 2), Y.paper, 0.9, -0.3), sh(rect(-w * 0.2, -h * 0.91, w * 0.08, h * 0.08) + rect(-w * 0.06, -h * 0.91, w * 0.08, h * 0.08) + rect(w * 0.08, -h * 0.91, w * 0.08, h * 0.08), Y.red),
    ol(poly([[-w * 0.42, -h * 0.28], [w * 0.42, -h * 0.28], [w * 0.36, -h * 0.76], [-w * 0.36, -h * 0.76]]), col, 1.2, -0.35), ol(keys, Y.cream, 0.8, -0.4),
    ol(rect(-w / 2, -h * 0.28, w, h * 0.28, 4), shade(col, -0.1), 1.2, -0.35), stroke(rect(-w * 0.44, -h * 0.23, w * 0.88, h * 0.17, 3), Y.brass, 1.4), ol(rect(-w * 0.08, -h * 0.17, w * 0.16, h * 0.05, 3), Y.brass, 0.8, -0.4), hl(rect(-w * 0.32, -h * 0.985, w * 0.64, h * 0.02, 2), 0.25),
  ];
}

/** Canvas tote bag printed with a ball of yarn, width ≈ s·0.7. */
export function toteBag(s: number, col = Y.cream, print = Y.coral): Shape[] {
  return [
    shadow(0, 0, s * 0.4, s * 0.04), stroke(M(-s * 0.2, -s * 0.7) + Q(-s * 0.2, -s * 1.08, 0, -s * 1.08) + Q(s * 0.2, -s * 1.08, s * 0.2, -s * 0.7), shade(col, -0.3), s * 0.05),
    ol(poly([[-s * 0.36, -s * 0.72], [s * 0.36, -s * 0.72], [s * 0.4, 0], [-s * 0.4, 0]]), col, 1.2, -0.3), dk(poly([[s * 0.2, -s * 0.72], [s * 0.36, -s * 0.72], [s * 0.4, 0], [s * 0.22, 0]]), 0.08),
    ...place(yarnBall(s * 0.16, print), { y: -s * 0.36 }), stroke(curve([[s * 0.12, -s * 0.26], [s * 0.26, -s * 0.2], [s * 0.2, -s * 0.12]]), print, 2), stroke(dash([[-s * 0.33, -s * 0.66], [s * 0.33, -s * 0.66]], 4, 3), shade(col, -0.3), 1),
  ];
}

// =====================================================================
// pottery
// =====================================================================
/** Closed symmetric silhouette from a right-hand profile (top to bottom). */
export function lathe(pr: Pt[], t = 0.8): string {
  const r = curve(pr, t), l = curve(pr.map(([x, y]) => [-x, y] as Pt).reverse(), t);
  return r + 'L' + l.slice(1) + 'Z';
}
/** A vertical band of a lathe silhouette between k0 and k1 times the radius. */
export function latheBand(pr: Pt[], k0: number, k1: number, t = 0.8): string {
  const a = curve(pr.map(([x, y]) => [x * k1, y] as Pt), t), b = curve(pr.map(([x, y]) => [x * k0, y] as Pt).reverse(), t);
  return a + 'L' + b.slice(1) + 'Z';
}

const PROFILES: Pt[][] = [
  [[0.1, -1], [0.09, -0.8], [0.24, -0.58], [0.3, -0.35], [0.24, -0.1], [0.16, 0]], // 0 bottle vase
  [[0.22, -1], [0.22, -0.9], [0.42, -0.68], [0.45, -0.42], [0.34, -0.13], [0.22, 0]], // 1 ginger jar
  [[0.21, -1], [0.2, -0.6], [0.2, -0.3], [0.2, -0.06], [0.17, 0]], // 2 cylinder
  [[0.21, -1], [0.12, -0.84], [0.14, -0.6], [0.25, -0.34], [0.22, -0.1], [0.14, 0]], // 3 flared vase
  [[0.62, -1], [0.56, -0.62], [0.38, -0.22], [0.22, -0.06], [0.2, 0]], // 4 bowl (h is the bowl height)
  [[0.3, -1], [0.27, -0.9], [0.41, -0.62], [0.43, -0.4], [0.31, -0.12], [0.2, 0]], // 5 wide-mouthed belly pot
  [[0.07, -1], [0.07, -0.76], [0.21, -0.64], [0.23, -0.3], [0.2, -0.05], [0.16, 0]], // 6 shouldered bottle
];

export interface PotOpts { dip?: string; band?: string; handle?: boolean; speck?: string; lid?: boolean; rings?: boolean }
/** Thrown pot. kind picks the profile (see PROFILES), h is its height. */
export function pot(kind: number, h: number, col: string, o: PotOpts = {}): Shape[] {
  const pr = PROFILES[kind].map(([x, y]) => [x * h, y * h] as Pt);
  const base = pr[pr.length - 1][0], r0 = pr[0][0];
  const out: Shape[] = [shadow(0, 0, base * 1.5, Math.max(2, h * 0.03))];
  if (o.handle) out.push(stroke(M(pr[1][0] * 0.9, pr[1][1] + h * 0.04) + Q(pr[2][0] + h * 0.26, pr[1][1], pr[2][0] + h * 0.2, pr[2][1] + h * 0.1) + Q(pr[3][0] + h * 0.1, pr[3][1] + h * 0.04, pr[3][0] * 0.92, pr[3][1]), shade(col, -0.12), h * 0.055));
  out.push(sh(lathe(pr), col));
  if (o.dip) {
    const top = pr.slice(0, 3);
    let drips = '';
    for (const k of [-0.62, -0.2, 0.3, 0.66]) drips += rect(top[2][0] * k - h * 0.022, top[2][1] - h * 0.02, h * 0.044, h * (0.07 + Math.abs(k) * 0.08), h * 0.022);
    out.push(sh(lathe(top), o.dip), sh(drips, o.dip));
  }
  if (o.band) { const i = Math.min(3, pr.length - 2); out.push(stroke(M(-pr[i][0], pr[i][1]) + Q(0, pr[i][1] + h * 0.05, pr[i][0], pr[i][1]), o.band, h * 0.05), stroke(M(-pr[i][0] * 0.98, pr[i][1] + h * 0.07) + Q(0, pr[i][1] + h * 0.12, pr[i][0] * 0.98, pr[i][1] + h * 0.07), o.band, h * 0.018)); }
  if (o.rings) { let rg = ''; for (let i = 1; i < 7; i++) { const yy = -h * (i / 7.4); rg += M(-h * 0.19, yy) + Q(0, yy + h * 0.03, h * 0.19, yy); } out.push(stroke(rg, shade(col, -0.2), 1, { opacity: 0.7 })); }
  if (o.speck) { const g = rng(Math.round(h * 7 + kind)); let sp = ''; for (let i = 0; i < 14; i++) { const t = g.range(0.12, 0.9), idx = Math.min(pr.length - 1, Math.round(t * (pr.length - 1))); sp += circle(g.range(-0.7, 0.7) * pr[idx][0], pr[idx][1] + g.range(-0.04, 0.04) * h, Math.max(0.9, h * 0.012)); } out.push(sh(sp, o.speck, { opacity: 0.8 })); }
  out.push(dk(latheBand(pr, 0.5, 1), 0.13), hl(latheBand(pr, -0.82, -0.6), 0.22), stroke(lathe(pr), shade(col, -0.35), 1.1));
  if (o.lid) out.push(ol(M(-r0 * 1.08, -h) + Q(0, -h - r0 * 0.9, r0 * 1.08, -h) + 'Z', o.dip ?? col, 1, -0.35), ol(circle(0, -h - r0 * 0.56, r0 * 0.2), shade(o.dip ?? col, -0.15), 0.8));
  else out.push(ol(ellipse(0, -h, r0, Math.max(1.5, r0 * 0.2)), shade(col, -0.4), 0.9, -0.2));
  return out;
}

/** Stack of plates seen side-on, width w. */
export function plateStack(w: number, cols: string[]): Shape[] {
  const out: Shape[] = [shadow(0, 0, w * 0.5, 3)];
  cols.forEach((c, i) => out.push(ol(M(-w * 0.5, -i * 6 - 7) + L(w * 0.5, -i * 6 - 7) + Q(w * 0.36, -i * 6, w * 0.2, -i * 6) + L(-w * 0.2, -i * 6) + Q(-w * 0.36, -i * 6, -w * 0.5, -i * 6 - 7) + 'Z', c, 0.9, -0.35)));
  return out;
}

/** Electric potter's wheel, width w. The wheel head's top is at y = -w·0.72. */
export function potteryWheel(w: number, col = '#5f8590'): Shape[] {
  const h = w * 0.75;
  return [
    shadow(0, 0, w * 0.56, h * 0.05),
    sh(rect(-w * 0.38, -h * 0.5, w * 0.07, h * 0.5) + rect(w * 0.31, -h * 0.5, w * 0.07, h * 0.5), '#4a5258'), sh(rect(-w * 0.4, -h * 0.03, w * 0.11, h * 0.03, 2) + rect(w * 0.29, -h * 0.03, w * 0.11, h * 0.03, 2), Y.ink),
    ol(rect(-w * 0.32, -h * 0.66, w * 0.64, h * 0.5, 8), col, 1.3, -0.35), dk(rect(w * 0.14, -h * 0.66, w * 0.18, h * 0.5, 8), 0.14), hl(rect(-w * 0.29, -h * 0.63, w * 0.58, h * 0.03, 3), 0.2),
    ol(rect(-w * 0.26, -h * 0.5, w * 0.2, h * 0.14, 3), Y.ink, 0.8), sh(circle(-w * 0.21, -h * 0.43, h * 0.03), '#8fd08a') , sh(rect(-w * 0.16, -h * 0.46, w * 0.07, h * 0.06, 2), Y.red),
    ol(circle(w * 0.12, -h * 0.4, h * 0.07), Y.cream, 1, -0.45), stroke(line([[w * 0.12, -h * 0.4], [w * 0.15, -h * 0.45]]), Y.ink, 1.8),
    ol(rect(-w * 0.44, -h * 0.7, w * 0.88, h * 0.06, 3), '#4a5258', 1),
    ol(poly([[-w * 0.5, -h * 0.92], [w * 0.5, -h * 0.92], [w * 0.44, -h * 0.7], [-w * 0.44, -h * 0.7]]), '#e9dfc6', 1.2, -0.3), sh(rect(-w * 0.51, -h * 0.94, w * 1.02, h * 0.045, 4), '#f6efdc'), stroke(rect(-w * 0.51, -h * 0.94, w * 1.02, h * 0.045, 4), '#b8ab8c', 1),
    sh(blob([[-w * 0.4, -h * 0.86], [-w * 0.3, -h * 0.88], [-w * 0.26, -h * 0.8], [-w * 0.36, -h * 0.76]], 0.9) + blob([[w * 0.1, -h * 0.85], [w * 0.24, -h * 0.87], [w * 0.32, -h * 0.78], [w * 0.16, -h * 0.76]], 0.9) + circle(-w * 0.1, -h * 0.78, h * 0.02) + circle(w * 0.38, -h * 0.84, h * 0.018) + circle(-w * 0.2, -h * 0.84, h * 0.014), Y.wetClay, { opacity: 0.75 }),
    ol(rect(-w * 0.25, -h * 0.96, w * 0.5, h * 0.045, 2), Y.steel, 1, -0.45), stroke(line([[-w * 0.2, -h * 0.94], [w * 0.2, -h * 0.94]]), '#ffffff', 1, { opacity: 0.6 }),
    stroke(curve([[w * 0.32, -h * 0.2], [w * 0.5, -h * 0.02], [w * 0.62, -h * 0.06]]), Y.ink, 2.4), ol(poly([[w * 0.56, -h * 0.12], [w * 0.84, -h * 0.04], [w * 0.84, 0], [w * 0.54, 0]]), '#4a5258', 1), sh(poly([[w * 0.58, -h * 0.1], [w * 0.8, -h * 0.04], [w * 0.6, -h * 0.05]]), '#6f7a82'),
  ];
}

/** Wet pot being thrown: a cylinder with throwing rings and slip. Height h. */
export function wetPot(h: number, col = Y.wetClay): Shape[] {
  const pr: Pt[] = [[0.3, -1], [0.27, -0.86], [0.36, -0.6], [0.4, -0.36], [0.36, -0.12], [0.34, 0]].map(([x, y]) => [x * h, y * h] as Pt);
  let rings = '';
  for (let i = 1; i < 8; i++) { const t = i / 8.4, idx = Math.min(pr.length - 1, Math.round(t * (pr.length - 1))), rr = pr[idx][0] * 0.97; rings += M(-rr, -h * (1 - t)) + Q(0, -h * (1 - t) + h * 0.05, rr, -h * (1 - t)); }
  return [
    sh(ellipse(0, 0, h * 0.5, h * 0.06), shade(col, 0.12)), sh(lathe(pr), col), stroke(rings, shade(col, -0.2), 1.3, { opacity: 0.8 }),
    dk(latheBand(pr, 0.5, 1), 0.15), hl(latheBand(pr, -0.84, -0.66), 0.4), stroke(lathe(pr), shade(col, -0.35), 1.2), ol(ellipse(0, -h, h * 0.3, h * 0.07), shade(col, -0.4), 1, -0.2), stroke(ellipse(0, -h, h * 0.3, h * 0.07), shade(col, 0.25), 1.6),
  ];
}

/** Front-loading electric kiln on a stand, w × h. */
export function kiln(w: number, h: number, col = '#93a7ac'): Shape[] {
  let riv = '';
  for (let i = 0; i <= 6; i++) riv += circle(-w * 0.36 + i * w * 0.09, -h * 0.9, 2.2) + circle(-w * 0.36 + i * w * 0.09, -h * 0.24, 2.2);
  for (let i = 1; i < 6; i++) riv += circle(-w * 0.36, -h * 0.9 + i * h * 0.11, 2.2) + circle(w * 0.18, -h * 0.9 + i * h * 0.11, 2.2);
  return [
    shadow(0, 0, w * 0.56, h * 0.03),
    sh(rect(-w * 0.44, -h * 0.16, w * 0.07, h * 0.16) + rect(w * 0.37, -h * 0.16, w * 0.07, h * 0.16), '#4a5258'), sh(rect(-w * 0.44, -h * 0.08, w * 0.88, h * 0.025), '#3b4348'),
    stroke(curve([[w * 0.06, -h], [w * 0.02, -h * 1.05], [w * 0.1, -h * 1.1], [w * 0.05, -h * 1.16]]) + curve([[w * 0.16, -h], [w * 0.12, -h * 1.04], [w * 0.2, -h * 1.09]]), '#ffffff', 2, { opacity: 0.45 }), ol(rect(w * 0.02, -h * 1.02, w * 0.18, h * 0.04, 2), '#6f7a82', 0.9),
    ol(rect(-w / 2, -h, w, h * 0.86, 7), col, 1.4, -0.35), dk(rect(w * 0.3, -h, w * 0.2, h * 0.86, 7), 0.12), hl(rect(-w * 0.47, -h * 0.985, w * 0.94, h * 0.02, 3), 0.3),
    ol(rect(-w * 0.42, -h * 0.95, w * 0.66, h * 0.76, 5), shade(col, 0.16), 1.2, -0.4), stroke(rect(-w * 0.33, -h * 0.87, w * 0.48, h * 0.6, 3), shade(col, -0.2), 1.2), sh(riv, shade(col, -0.35)),
    ol(rect(-w * 0.47, -h * 0.84, w * 0.07, h * 0.1, 2) + rect(-w * 0.47, -h * 0.4, w * 0.07, h * 0.1, 2), '#4a5258', 0.8),
    sh(circle(-w * 0.09, -h * 0.57, h * 0.085), '#ffb04a', { opacity: 0.28 }), ol(circle(-w * 0.09, -h * 0.57, h * 0.05), '#3b3532', 1), sh(circle(-w * 0.09, -h * 0.57, h * 0.032), '#ff8a2a'), sh(circle(-w * 0.1, -h * 0.575, h * 0.014), '#ffe08a'),
    ol(rect(w * 0.16, -h * 0.64, w * 0.07, h * 0.16, 3), '#3b4348', 0.9), ol(rect(w * 0.1, -h * 0.6, w * 0.16, h * 0.035, 3), Y.ink, 0.8),
    ol(rect(w * 0.28, -h * 0.92, w * 0.19, h * 0.4, 4), '#3b4348', 1), sh(rect(w * 0.3, -h * 0.89, w * 0.15, h * 0.1, 2), '#1c2a22'), sh(rect(w * 0.315, -h * 0.865, w * 0.025, h * 0.05) + rect(w * 0.35, -h * 0.865, w * 0.025, h * 0.05) + rect(w * 0.385, -h * 0.865, w * 0.025, h * 0.05) + rect(w * 0.42, -h * 0.865, w * 0.012, h * 0.05), '#ff7a3a'),
    sh(circle(w * 0.33, -h * 0.73, w * 0.018) + circle(w * 0.375, -h * 0.73, w * 0.018) + circle(w * 0.42, -h * 0.73, w * 0.018), '#c9d0d5'), ol(circle(w * 0.375, -h * 0.62, w * 0.04), Y.cream, 0.9, -0.5), stroke(line([[w * 0.375, -h * 0.62], [w * 0.395, -h * 0.65]]), Y.red, 1.6),
    ol(poly([[w * 0.375, -h * 0.4], [w * 0.43, -h * 0.3], [w * 0.32, -h * 0.3]]), '#f3c84a', 0.9, -0.4), stroke(line([[w * 0.375, -h * 0.37], [w * 0.375, -h * 0.33]]), Y.ink, 1.8),
  ];
}

/** Bucket of glaze with drips down the side, w × h. */
export function glazeBucket(w: number, h: number, glaze: string, col = '#f4f0e6', open = true): Shape[] {
  const body = poly([[-w * 0.5, -h], [w * 0.5, -h], [w * 0.42, 0], [-w * 0.42, 0]]);
  let dr = '';
  for (const [k, l] of [[-0.3, 0.34], [-0.12, 0.2], [0.24, 0.42], [0.4, 0.16]] as Pt[]) dr += rect(k * w - w * 0.035, -h * 0.94, w * 0.07, h * l, w * 0.035);
  const out: Shape[] = [
    shadow(0, 0, w * 0.5, h * 0.05), ol(body, col, 1.2, -0.3), dk(poly([[w * 0.18, -h], [w * 0.5, -h], [w * 0.42, 0], [w * 0.16, 0]]), 0.09),
    stroke(line([[-w * 0.49, -h * 0.82], [w * 0.49, -h * 0.82]]) + line([[-w * 0.48, -h * 0.74], [w * 0.48, -h * 0.74]]), shade(col, -0.25), 1),
    ol(rect(-w * 0.28, -h * 0.6, w * 0.56, h * 0.36, 3), '#fbf8f0', 0.8, -0.3), sh(rect(-w * 0.22, -h * 0.54, w * 0.16, h * 0.24, 2), glaze), stroke(line([[-w * 0.01, -h * 0.5], [w * 0.22, -h * 0.5]]) + line([[-w * 0.01, -h * 0.42], [w * 0.22, -h * 0.42]]) + line([[-w * 0.01, -h * 0.34], [w * 0.14, -h * 0.34]]), '#8a7a66', 1.2),
    sh(dr, glaze), stroke(M(-w * 0.5, -h * 0.88) + Q(0, -h * 0.2, w * 0.5, -h * 0.88), '#7a848a', 2), sh(circle(-w * 0.5, -h * 0.88, 3) + circle(w * 0.5, -h * 0.88, 3), '#5a646a'),
  ];
  if (open) out.push(ol(ellipse(0, -h, w * 0.5, w * 0.13), shade(col, -0.1), 1, -0.3), sh(ellipse(0, -h + 1.5, w * 0.44, w * 0.1), glaze), hl(ellipse(-w * 0.14, -h, w * 0.14, w * 0.03), 0.4));
  else out.push(ol(rect(-w * 0.54, -h - h * 0.08, w * 1.08, h * 0.1, 3), shade(col, -0.06), 1, -0.3));
  return out;
}

/** Potter's apron hanging from a hook; origin at the hook, length h. */
export function apron(h: number, col = Y.navy, smudge = Y.wetClay): Shape[] {
  const body = M(-h * 0.13, h * 0.16) + Q(0, h * 0.19, h * 0.13, h * 0.16) + Q(h * 0.15, h * 0.36, h * 0.28, h * 0.42) + L(h * 0.31, h * 0.98) + Q(0, h * 1.03, -h * 0.31, h * 0.98) + L(-h * 0.28, h * 0.42) + Q(-h * 0.15, h * 0.36, -h * 0.13, h * 0.16) + 'Z';
  return [
    stroke(M(-h * 0.11, h * 0.17) + Q(-h * 0.1, h * 0.04, 0, 0) + Q(h * 0.1, h * 0.04, h * 0.11, h * 0.17), shade(col, 0.25), h * 0.03),
    stroke(curve([[-h * 0.28, h * 0.43], [-h * 0.38, h * 0.56], [-h * 0.33, h * 0.78]]) + curve([[h * 0.28, h * 0.43], [h * 0.37, h * 0.6], [h * 0.35, h * 0.84]]), shade(col, 0.25), h * 0.028),
    ol(body, col, 1.3, -0.3), stroke(curve([[-h * 0.12, h * 0.5], [-h * 0.16, h * 0.74], [-h * 0.14, h * 0.97]]) + curve([[h * 0.1, h * 0.5], [h * 0.16, h * 0.74], [h * 0.14, h * 0.97]]), shade(col, -0.22), 1.4, { opacity: 0.7 }),
    ol(rect(-h * 0.14, h * 0.56, h * 0.28, h * 0.19, h * 0.02), shade(col, 0.1), 1, -0.4), stroke(dash([[-h * 0.12, h * 0.585], [h * 0.12, h * 0.585]], 4, 3), shade(col, 0.5), 1), stroke(line([[0, h * 0.585], [0, h * 0.75]]), shade(col, -0.3), 1),
    sh(blob([[-h * 0.2, h * 0.8], [-h * 0.12, h * 0.78], [-h * 0.1, h * 0.86], [-h * 0.19, h * 0.9]], 0.9) + blob([[h * 0.06, h * 0.3], [h * 0.11, h * 0.3], [h * 0.09, h * 0.38], [h * 0.04, h * 0.36]], 0.9) + circle(h * 0.18, h * 0.66, h * 0.022) + circle(h * 0.12, h * 0.86, h * 0.016), smudge, { opacity: 0.75 }),
    sh(circle(0, 0, 5), Y.woodDk), sh(circle(0, -1, 2.2), Y.woodLt),
  ];
}

/** Throwing sponge, width w. */
export function sponge(w: number, col = '#f2c84a'): Shape[] {
  const g = rng(Math.round(w * 3));
  let pores = '';
  for (let i = 0; i < 16; i++) pores += ellipse(g.range(-w * 0.38, w * 0.38), -g.range(w * 0.1, w * 0.48), w * g.range(0.025, 0.05), w * g.range(0.02, 0.04));
  return [shadow(0, 0, w * 0.5, w * 0.05), ol(blob([[-w * 0.48, -w * 0.06], [-w * 0.46, -w * 0.5], [-w * 0.1, -w * 0.6], [w * 0.36, -w * 0.56], [w * 0.5, -w * 0.3], [w * 0.44, -w * 0.02], [0, 0]], 0.75), col, 1.1, -0.3), sh(pores, shade(col, -0.3)), hl(ellipse(-w * 0.18, -w * 0.48, w * 0.2, w * 0.05, -6), 0.35)];
}

/** Wire clay cutter with two wooden toggles, length l, origin centre. */
export function wireCutter(l: number): Shape[] {
  const tog = (x: number, rot: number) => ol(xf(rect(-l * 0.1, -l * 0.04, l * 0.2, l * 0.08, l * 0.04), { rot, x }), Y.woodLt, 0.9, -0.4);
  return [stroke(curve([[-l * 0.4, 0], [-l * 0.2, -l * 0.14], [-l * 0.02, l * 0.06], [l * 0.12, -l * 0.12], [l * 0.02, -l * 0.2], [-l * 0.04, -l * 0.08], [l * 0.2, l * 0.06], [l * 0.4, 0]]), '#7a848a', 1.6), tog(-l * 0.42, 70), tog(l * 0.42, 110), stroke(xf(line([[-l * 0.06, 0], [l * 0.06, 0]]), { rot: 70, x: -l * 0.42 }) + xf(line([[-l * 0.06, 0], [l * 0.06, 0]]), { rot: 110, x: l * 0.42 }), shade(Y.woodLt, -0.3), 1)];
}

/** Double-ended loop trimming tool, length l, origin centre. */
export function loopTool(l: number, col = Y.red): Shape[] {
  return [
    stroke(ellipse(-l * 0.4, 0, l * 0.1, l * 0.07), '#7a848a', l * 0.022), stroke(poly([[l * 0.3, -l * 0.02], [l * 0.47, -l * 0.08], [l * 0.47, l * 0.08], [l * 0.3, l * 0.02]]), '#7a848a', l * 0.022),
    ol(rect(-l * 0.26, -l * 0.04, l * 0.52, l * 0.08, l * 0.03), col, 0.9, -0.3), sh(rect(-l * 0.31, -l * 0.03, l * 0.06, l * 0.06, 1.5) + rect(l * 0.25, -l * 0.03, l * 0.06, l * 0.06, 1.5), Y.brass), hl(rect(-l * 0.2, -l * 0.026, l * 0.36, l * 0.018, 2), 0.35),
  ];
}

/** Kidney-shaped wooden rib, width s, origin centre. */
export function woodRib(s: number, col = Y.woodLt): Shape[] {
  return [
    ol(blob([[-s * 0.5, s * 0.02], [-s * 0.34, -s * 0.26], [0, -s * 0.3], [s * 0.38, -s * 0.2], [s * 0.5, s * 0.06], [s * 0.3, s * 0.24], [0, s * 0.14], [-s * 0.3, s * 0.24]], 0.9), col, 1.1, -0.35),
    stroke(curve([[-s * 0.36, -s * 0.1], [0, -s * 0.2], [s * 0.36, -s * 0.06]]) + curve([[-s * 0.3, 0], [0, -s * 0.08], [s * 0.3, s * 0.04]]), shade(col, -0.2), 0.9), ol(circle(s * 0.16, -s * 0.06, s * 0.055), shade(col, -0.5), 0.8),
  ];
}

/** Glaze brush lying flat, length l, origin centre; bristles on the right. */
export function brush(l: number, col = Y.teal, tip = Y.sky): Shape[] {
  return [
    ol(poly([[-l * 0.5, -l * 0.012], [l * 0.16, -l * 0.032], [l * 0.16, l * 0.032], [-l * 0.5, l * 0.012]]), col, 0.9, -0.3), ol(rect(l * 0.16, -l * 0.034, l * 0.12, l * 0.068, 1.5), Y.steel, 0.8, -0.4),
    ol(M(l * 0.28, -l * 0.036) + Q(l * 0.42, -l * 0.05, l * 0.5, 0) + Q(l * 0.42, l * 0.05, l * 0.28, l * 0.036) + 'Z', '#5a4636', 0.8), sh(M(l * 0.38, -l * 0.04) + Q(l * 0.45, -l * 0.035, l * 0.5, 0) + Q(l * 0.45, l * 0.035, l * 0.38, l * 0.04) + 'Z', tip),
  ];
}

/** Jar of brushes and modelling tools, jar height s. */
export function toolJar(s: number, seed: number, col = Y.terracotta): Shape[] {
  const g = rng(seed);
  const pal = [Y.woodLt, Y.red, Y.teal, Y.mustard, Y.woodDk, Y.navy];
  const out: Shape[] = [shadow(0, 0, s * 0.34, s * 0.04)];
  for (let i = 0; i < 7; i++) {
    const x0 = (-0.18 + i * 0.06) * s, x1 = x0 * 2.4 + g.range(-0.05, 0.05) * s, y1 = -s * g.range(1.25, 1.8), c = pal[i % pal.length];
    out.push(stroke(line([[x0, -s * 0.6], [x1, y1]]), c, s * 0.04));
    if (i % 3 === 0) out.push(sh(leaf(x1, y1, s * 0.22, s * 0.05, -90 + (x1 - x0) * 0.6), '#5a4636'), stroke(line([[x1, y1], [x1 - (x1 - x0) * 0.08, y1 + s * 0.1]]), Y.steel, s * 0.05));
    else if (i % 3 === 1) out.push(stroke(ellipse(x1, y1 - s * 0.07, s * 0.05, s * 0.08), '#7a848a', 1.6));
    else out.push(sh(ellipse(x1, y1 - s * 0.03, s * 0.035, s * 0.08), shade(c, 0.1)));
  }
  out.push(...pot(2, s * 0.74, col, { band: shade(col, 0.35) }).slice(1));
  return out;
}

/** Bag of clay: a wrapped block with a twisted top, width w. */
export function clayBag(w: number, clay = '#a98c78', tie = Y.red): Shape[] {
  const h = w * 0.62;
  return [
    shadow(0, 0, w * 0.52, h * 0.06), ol(rect(-w / 2, -h, w, h, w * 0.09), clay, 1.2, -0.3), dk(rect(w * 0.2, -h, w * 0.3, h, w * 0.08), 0.12),
    ol(M(-w * 0.2, -h) + Q(-w * 0.04, -h * 1.1, -w * 0.05, -h * 1.22) + L(w * 0.05, -h * 1.22) + Q(w * 0.04, -h * 1.1, w * 0.2, -h) + 'Z', shade(clay, 0.25), 1, -0.35),
    ol(poly([[-w * 0.05, -h * 1.22], [-w * 0.16, -h * 1.44], [0, -h * 1.36], [w * 0.15, -h * 1.46], [w * 0.05, -h * 1.22]]), shade(clay, 0.4), 1, -0.35), ol(rect(-w * 0.07, -h * 1.26, w * 0.14, h * 0.07, 2), tie, 0.8, -0.3),
    hl(poly([[-w * 0.42, -h * 0.94], [-w * 0.3, -h * 0.94], [-w * 0.4, -h * 0.1], [-w * 0.46, -h * 0.1]]), 0.3), hl(poly([[-w * 0.1, -h * 0.96], [-w * 0.04, -h * 0.96], [-w * 0.16, -h * 0.5], [-w * 0.2, -h * 0.5]]), 0.22), stroke(curve([[-w * 0.44, -h * 0.3], [0, -h * 0.24], [w * 0.44, -h * 0.34]]) + curve([[-w * 0.3, -h * 0.98], [-w * 0.2, -h * 0.7], [-w * 0.34, -h * 0.5]]), '#ffffff', 1, { opacity: 0.4 }),
    ol(rect(w * 0.0, -h * 0.74, w * 0.38, h * 0.42, 3), '#fbf8f0', 0.8, -0.3), sh(rect(w * 0.04, -h * 0.68, w * 0.3, h * 0.1), tie), stroke(line([[w * 0.05, -h * 0.5], [w * 0.33, -h * 0.5]]) + line([[w * 0.05, -h * 0.42], [w * 0.24, -h * 0.42]]), '#8a7a66', 1.2),
  ];
}

/** Banding wheel (decorating turntable), width w. */
export function bandingWheel(w: number): Shape[] {
  return [shadow(0, 0, w * 0.4, w * 0.04), ol(rect(-w * 0.32, -w * 0.08, w * 0.64, w * 0.08, 3), '#4a5258', 1), ol(rect(-w * 0.07, -w * 0.3, w * 0.14, w * 0.22), '#6f7a82', 1), ol(rect(-w / 2, -w * 0.38, w, w * 0.09, 3), Y.steel, 1, -0.45), stroke(line([[-w * 0.44, -w * 0.35], [w * 0.44, -w * 0.35]]), '#ffffff', 1, { opacity: 0.6 })];
}

/** Trigger spray bottle, height s. */
export function sprayBottle(s: number, col = Y.sky): Shape[] {
  return [
    shadow(0, 0, s * 0.24, s * 0.03), ol(M(-s * 0.2, 0) + L(-s * 0.2, -s * 0.5) + Q(-s * 0.2, -s * 0.62, -s * 0.07, -s * 0.66) + L(s * 0.07, -s * 0.66) + Q(s * 0.2, -s * 0.62, s * 0.2, -s * 0.5) + L(s * 0.2, 0) + 'Z', '#dceef2', 1.1, -0.35),
    sh(rect(-s * 0.185, -s * 0.4, s * 0.37, s * 0.39, 2), col, { opacity: 0.75 }), hl(rect(-s * 0.14, -s * 0.54, s * 0.05, s * 0.46, 2), 0.6),
    ol(rect(-s * 0.07, -s * 0.74, s * 0.14, s * 0.09, 2), Y.ink, 0.8), ol(poly([[-s * 0.26, -s * 0.94], [s * 0.14, -s * 0.94], [s * 0.14, -s * 0.74], [-s * 0.12, -s * 0.74], [-s * 0.14, -s * 0.82], [-s * 0.26, -s * 0.84]]), Y.red, 1, -0.3),
    stroke(M(-s * 0.12, -s * 0.76) + Q(-s * 0.24, -s * 0.7, -s * 0.2, -s * 0.58), Y.red, s * 0.04), sh(rect(-s * 0.31, -s * 0.92, s * 0.06, s * 0.06, 1), Y.ink),
  ];
}

/** Little glazed clay bird, width s, facing left. */
export function clayBird(s: number, col = Y.sky, wing = '#fbf6ea'): Shape[] {
  return [
    shadow(0, 0, s * 0.3, s * 0.04), ol(poly([[s * 0.24, -s * 0.34], [s * 0.56, -s * 0.52], [s * 0.5, -s * 0.28]]), shade(col, -0.12), 1, -0.3),
    ol(blob([[-s * 0.3, -s * 0.3], [-s * 0.1, -s * 0.52], [s * 0.2, -s * 0.46], [s * 0.36, -s * 0.3], [s * 0.2, -s * 0.04], [-s * 0.1, 0], [-s * 0.28, -s * 0.1]], 0.9), col, 1.2, -0.3),
    ol(circle(-s * 0.26, -s * 0.48, s * 0.17), col, 1.2, -0.3), sh(poly([[-s * 0.42, -s * 0.5], [-s * 0.56, -s * 0.45], [-s * 0.42, -s * 0.41]]), Y.mustard), sh(circle(-s * 0.3, -s * 0.52, s * 0.03), '#1a1412'), hl(circle(-s * 0.31, -s * 0.53, s * 0.011), 0.9),
    ol(petal(-s * 0.02, -s * 0.28, s * 0.34, s * 0.13, 12), wing, 0.9, -0.3), sh(circle(-s * 0.1, -s * 0.12, s * 0.02) + circle(0, -s * 0.08, s * 0.02) + circle(s * 0.1, -s * 0.1, s * 0.02), wing), hl(ellipse(-s * 0.06, -s * 0.42, s * 0.1, s * 0.035, -20), 0.35),
  ];
}

/** Potter's calipers hanging from their pivot; origin at the pivot, length s. */
export function calipers(s: number, col = Y.woodLt): Shape[] {
  const arm = (k: number) => M(0, 0) + Q(k * s * 0.44, s * 0.36, k * s * 0.3, s * 0.74) + Q(k * s * 0.24, s * 0.92, k * s * 0.06, s);
  return [stroke(arm(-1) + arm(1), shade(col, -0.4), s * 0.085), stroke(arm(-1) + arm(1), col, s * 0.055), ol(circle(0, 0, s * 0.06), Y.brass, 0.9, -0.4), sh(circle(0, 0, s * 0.02), Y.ink)];
}

/** Board of glaze test tiles, origin top-left. */
export function testTiles(cols: number, rows: number, s: number, pal: string[], seed: number): Shape[] {
  const g = rng(seed);
  const W = cols * s + 10, H = rows * s + 10;
  const out: Shape[] = [sh(rect(3, 4, W, H, 3), '#000000', { opacity: 0.14 }), ol(rect(0, 0, W, H, 3), Y.woodLt, 1, -0.35)];
  const by = pal.map(() => ''), lt = pal.map(() => '');
  let holes = '';
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const k = g.int(0, pal.length - 1), x = 7 + c * s, y = 7 + r * s; by[k] += rect(x, y, s - 4, s - 4, 2); lt[k] += rect(x, y + (s - 4) * 0.55, s - 4, (s - 4) * 0.45, 2); holes += circle(x + (s - 4) / 2, y + 4, 1.6); }
  pal.forEach((c, i) => { if (by[i]) out.push(ol(by[i], c, 0.7, -0.3), sh(lt[i], shade(c, -0.18))); });
  out.push(sh(holes, '#3b2f2a'));
  return out;
}

/** Shallow puddle / splash of clay slip on the floor, origin centre. */
export function splat(s: number, col = Y.wetClay, seed = 1): Shape[] {
  const g = rng(seed);
  const pts: Pt[] = [];
  for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2, r = s * g.range(0.55, 1); pts.push([Math.cos(a) * r, Math.sin(a) * r * 0.32]); }
  let dots = '';
  for (let i = 0; i < 5; i++) dots += ellipse(g.range(-1.5, 1.5) * s, g.range(-0.5, 0.5) * s, s * g.range(0.05, 0.12), s * g.range(0.02, 0.05));
  return [sh(blob(pts, 0.9) + dots, col, { opacity: 0.5 })];
}

void leaf; void mix; void ellipse;

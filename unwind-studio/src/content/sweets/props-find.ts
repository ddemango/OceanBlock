// Shared props for The Sweet Shop hidden-object scenes. Every prop is drawn
// around the origin and returns Shape[]; position it with place(). Unless a
// comment says otherwise the origin is the bottom centre (the prop stands on y = 0).
import { rect, ellipse, circle, poly, line, curve, leaf, star, sh, stroke, shade, mix, rng, xf, place } from '../../art/kit';
import type { Shape } from '../../art/types';

export type Pt = [number, number];
const n = (v: number) => String(Math.round(v * 10) / 10);
export const M = (x: number, y: number) => `M${n(x)} ${n(y)}`;
export const L = (x: number, y: number) => `L${n(x)} ${n(y)}`;
export const Q = (cx: number, cy: number, x: number, y: number) => `Q${n(cx)} ${n(cy)} ${n(x)} ${n(y)}`;
export const CB = (a: number, b: number, c: number, d: number, x: number, y: number) => `C${n(a)} ${n(b)} ${n(c)} ${n(d)} ${n(x)} ${n(y)}`;

/** Filled shape with a darker outline of the same hue. */
export const ol = (d: string, fill: string, w = 1, amt = -0.3): Shape => sh(d, fill, { stroke: shade(fill, amt), strokeWidth: w });
/** Union of overlapping subpaths with one outer outline (dark under-shape, then the fill). */
export const un = (d: string, fill: string, w = 1, amt = -0.3): Shape[] => [sh(d, shade(fill, amt), { stroke: shade(fill, amt), strokeWidth: w * 2 }), sh(d, fill)];
export const shadow = (cx: number, cy: number, rx: number, ry: number, op = 0.2): Shape => sh(ellipse(cx, cy, rx, ry), '#4a2a2a', { opacity: op });
export const hl = (d: string, op = 0.55): Shape => sh(d, '#ffffff', { opacity: op });
const rad = (a: number) => (a * Math.PI) / 180;
const pol = (cx: number, cy: number, a: number, r: number): Pt => [cx + Math.cos(rad(a)) * r, cy + Math.sin(rad(a)) * r];

export const C = {
  pink: '#f6a6bd', hot: '#e8648c', red: '#d8432f', redDk: '#a52e22', cherry: '#c2203a', mint: '#a9dcc4', teal: '#4aa9a0', tealDk: '#2f7d76',
  lemon: '#f7d75a', orange: '#f39a3d', lilac: '#b99ad9', purple: '#8a62b8', sky: '#8ec9e8', blue: '#4f86c6', green: '#7cc36a', greenDk: '#4d9450',
  cream: '#fbf3e0', creamDk: '#ecdcbc', white: '#fffaf2', choc: '#6b3e26', chocDk: '#4a2a1a', milk: '#a86a44', caramel: '#c98a4a', waffle: '#e0a85a',
  brass: '#d2a84a', brassDk: '#9a742a', brassLt: '#ecd28a', chrome: '#c3ccd2', chromeDk: '#7c8890', chromeLt: '#eef2f4', ink: '#33292a',
  wood: '#b07a4a', woodDk: '#7a4e2c', woodLt: '#d0a070', glass: '#dff0f2', glassLn: '#8fb0b8', banana: '#f6e08a',
};
export const RAINBOW = [C.red, C.orange, C.lemon, C.green, C.sky, C.lilac];
export const CANDY = [C.hot, C.lemon, C.mint, C.orange, C.sky, C.lilac, C.red, C.green];

// =====================================================================
// textures and room pieces
// =====================================================================
/** Vertical wallpaper stripes. */
export function stripes(x: number, y: number, w: number, h: number, sw: number, a: string, b: string, thin?: string): Shape[] {
  let d = '', t = '';
  for (let i = 0, sx = x; sx < x + w; sx += sw, i++) {
    if (i % 2) d += rect(sx, y, Math.min(sw, x + w - sx), h);
    else if (thin) t += line([[sx + sw / 2, y], [sx + sw / 2, y + h]]);
  }
  const out = [sh(rect(x, y, w, h), a), sh(d, b)];
  if (thin && t) out.push(stroke(t, thin, 2, { opacity: 0.7 }));
  return out;
}

/** Polka-dot wallpaper on an offset grid. */
export function polka(x: number, y: number, w: number, h: number, gap: number, base: string, dot: string, r: number, dot2?: string): Shape[] {
  let d = '', e = '';
  for (let j = 0, cy = y + gap / 2; cy < y + h - r; cy += gap * 0.86, j++) {
    for (let i = 0, cx = x + (j % 2 ? gap : gap / 2); cx < x + w - r; cx += gap, i++) {
      if (dot2 && (i + j) % 3 === 0) e += circle(cx, cy, r * 0.8); else d += circle(cx, cy, r);
    }
  }
  const out = [sh(rect(x, y, w, h), base), sh(d, dot)];
  if (dot2 && e) out.push(sh(e, dot2));
  return out;
}

/** Checkerboard floor in one-point perspective from y0 (far) down to y1 (near). */
export function checker(y0: number, y1: number, W: number, vx: number, vy: number, tile: number, a: string, b: string, grow = 1.2): Shape[] {
  const ys: number[] = [y0];
  let step = (y0 - vy) * (grow - 1);
  while (ys[ys.length - 1] < y1) { ys.push(Math.min(y1, ys[ys.length - 1] + step)); step *= grow; }
  const xAt = (xb: number, y: number) => vx + ((xb - vx) * (y - vy)) / (y1 - vy);
  const sc = (y0 - vy) / (y1 - vy);
  const i0 = Math.floor((vx - vx / sc - vx) / tile) - 1, i1 = Math.ceil(((W - vx) / sc) / tile) + 1;
  let d = '', seams = '';
  for (let k = 0; k < ys.length - 1; k++) {
    const ya = ys[k], yb = ys[k + 1];
    for (let i = i0; i < i1; i++) {
      if ((((i + k) % 2) + 2) % 2 === 0) continue;
      const xa = vx + i * tile, xb = xa + tile;
      const p: Pt[] = [[xAt(xa, ya), ya], [xAt(xb, ya), ya], [xAt(xb, yb), yb], [xAt(xa, yb), yb]];
      if (Math.max(p[1][0], p[2][0]) < 0 || Math.min(p[0][0], p[3][0]) > W) continue;
      d += poly(p.map(([px, py]) => [Math.max(-4, Math.min(W + 4, px)), py] as Pt));
    }
    seams += line([[0, ya], [W, ya]]);
  }
  return [sh(rect(0, y0, W, y1 - y0), a), sh(d, b), stroke(seams, shade(b, -0.25), 1, { opacity: 0.3 })];
}

/** Horizontal floorboards from y0 to y1, getting taller toward the viewer. */
export function boards(y0: number, y1: number, W: number, cols: string[], seed: number, row = 20): Shape[] {
  const g = rng(seed), by = cols.map(() => '');
  let seams = '', y = y0, rowH = row;
  while (y < y1) {
    const h = Math.min(rowH, y1 - y);
    let x = -g.range(0, 160);
    while (x < W) { const len = g.range(130, 260) * (rowH / 40 + 0.5); by[g.int(0, cols.length - 1)] += rect(Math.max(0, x), y, Math.min(W, x + len) - Math.max(0, x), h); if (x > 0) seams += line([[x, y], [x, y + h]]); x += len; }
    seams += line([[0, y], [W, y]]);
    y += h; rowH *= 1.08;
  }
  return [sh(rect(0, y0, W, y1 - y0), cols[0]), ...by.map((d, i) => sh(d, cols[i])).filter((p) => p.d), stroke(seams, shade(cols[0], -0.5), 1.4, { opacity: 0.35 })];
}

/** Wooden panel with recessed insets (counter fronts, wainscot). */
export function panels(x: number, y: number, w: number, h: number, count: number, col: string, inset = 14): Shape[] {
  let p = '', hi = '';
  const pw = w / count;
  for (let i = 0; i < count; i++) { p += rect(x + i * pw + inset, y + inset, pw - inset * 2, h - inset * 2, 4); hi += line([[x + i * pw + inset + 3, y + h - inset - 2], [x + (i + 1) * pw - inset - 3, y + h - inset - 2]]); }
  return [sh(rect(x, y, w, h), col), sh(p, shade(col, -0.08), { stroke: shade(col, -0.28), strokeWidth: 2 }), stroke(hi, shade(col, 0.25), 2, { opacity: 0.7 })];
}

/** A shelf board with a lit top edge and a shadow beneath; origin is the board's top-left. */
export function shelf(x: number, y: number, w: number, t = 12, col = C.wood): Shape[] {
  return [sh(rect(x, y + t, w, 10), '#3b2218', { opacity: 0.18 }), ol(rect(x, y, w, t, 2), col, 1, -0.35), sh(rect(x, y, w, t * 0.3, 2), shade(col, 0.25))];
}

/** Scalloped valance: alternating tabs with rounded ends hanging from y. */
export function scallop(x: number, y: number, w: number, count: number, depth: number, a: string, b: string): Shape[] {
  const tw = w / count;
  let da = '', db = '';
  for (let i = 0; i < count; i++) {
    const x0 = x + i * tw, x1 = x0 + tw, r = tw / 2;
    const d = M(x0, y) + L(x1, y) + L(x1, y + depth) + CB(x1, y + depth + r * 1.33, x0, y + depth + r * 1.33, x0, y + depth) + 'Z';
    if (i % 2) db += d; else da += d;
  }
  return [ol(da, a, 1, -0.2), ol(db, b, 1, -0.2)];
}

/** Striped shop awning seen from the front: sloping stripes with a scalloped edge. Origin top-left. */
export function awning(x: number, y: number, w: number, h: number, count: number, a: string, b: string, inset = 0.08): Shape[] {
  const tw = w / count, ix = w * inset;
  let da = '', db = '';
  for (let i = 0; i < count; i++) {
    const t0 = i / count, t1 = (i + 1) / count;
    const d = poly([[x + ix + (w - ix * 2) * t0, y], [x + ix + (w - ix * 2) * t1, y], [x + tw * (i + 1), y + h], [x + tw * i, y + h]]);
    if (i % 2) db += d; else da += d;
  }
  return [sh(da, a), sh(db, b), sh(rect(x, y + h - 5, w, 5), '#000000', { opacity: 0.12 }), ...scallop(x, y + h, w, count, h * 0.12, a, b), stroke(line([[x + ix, y], [x + w - ix, y]]), shade(a, -0.3), 3)];
}

function quadPts(pts: Pt[], sag: number, gap: number): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[i + 1];
    const mx = (ax + bx) / 2, my = (ay + by) / 2 + sag;
    const k = Math.max(2, Math.round(Math.hypot(bx - ax, by - ay) / gap));
    for (let j = i ? 1 : 0; j <= k; j++) { const t = j / k; out.push([(1 - t) * (1 - t) * ax + 2 * t * (1 - t) * mx + t * t * bx, (1 - t) * (1 - t) * ay + 2 * t * (1 - t) * my + t * t * by]); }
  }
  return out;
}

/** Sagging string of triangular flags through the anchor points. */
export function bunting(pts: Pt[], sag: number, gap: number, cols: string[], size = gap): Shape[] {
  const p = quadPts(pts, sag, gap), by = cols.map(() => '');
  let mark = '';
  for (let i = 0; i < p.length - 1; i++) {
    const [ax, ay] = p[i], [bx, by2] = p[i + 1];
    const mx = (ax + bx) / 2, my = (ay + by2) / 2, len = Math.hypot(bx - ax, by2 - ay) || 1;
    const nx = -(by2 - ay) / len, ny = (bx - ax) / len;
    by[i % cols.length] += poly([[ax + (bx - ax) * 0.06, ay + (by2 - ay) * 0.06], [bx - (bx - ax) * 0.06, by2 - (by2 - ay) * 0.06], [mx + nx * size, my + ny * size]]);
    if (i % 2 === 0) mark += circle(mx + nx * size * 0.36, my + ny * size * 0.36, size * 0.11);
  }
  return [...by.map((d, i) => ol(d, cols[i], 1, -0.25)).filter((s) => s.d), sh(mark, '#ffffff', { opacity: 0.75 }), stroke(line(p), '#8a6a4a', 2)];
}

/** Twisted crêpe-paper streamer along a smooth path. */
export function streamer(pts: Pt[], col: string, w = 12): Shape[] {
  const fine: Pt[] = [];
  for (let i = 0; i < pts.length - 1; i++) for (let k = 0; k < 6; k++) { const t = k / 6; fine.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t]); }
  fine.push(pts[pts.length - 1]);
  let tw = '';
  for (let i = 1; i < fine.length - 1; i += 2) tw += line([fine[i], fine[i + 1]]);
  return [stroke(curve(pts), shade(col, -0.28), w + 2), stroke(curve(pts), col, w), stroke(tw, shade(col, 0.35), w * 0.55, { opacity: 0.8 })];
}

/** Scattered confetti inside a box. */
export function confetti(x: number, y: number, w: number, h: number, count: number, cols: string[], seed: number, s = 5): Shape[] {
  const g = rng(seed), by = cols.map(() => '');
  for (let i = 0; i < count; i++) {
    const cx = x + g.next() * w, cy = y + g.next() * h, k = g.int(0, cols.length - 1), q = s * g.range(0.7, 1.4);
    by[k] += g.next() < 0.4 ? circle(cx, cy, q * 0.5) : xf(rect(-q * 0.7, -q * 0.35, q * 1.4, q * 0.7, 1), { rot: g.range(0, 180), x: cx, y: cy });
  }
  return by.map((d, i) => sh(d, cols[i])).filter((p) => p.d);
}

/** Hanging pendant lamp; origin is the ceiling fixing, drop is the cord length. */
export function pendant(drop: number, w: number, col: string): Shape[] {
  return [
    sh(circle(0, drop + w * 0.5, w * 1.5), '#fff2c0', { opacity: 0.16 }),
    stroke(line([[0, 0], [0, drop]]), C.ink, 2),
    sh(rect(-w * 0.1, drop - 4, w * 0.2, 10, 2), C.ink),
    sh(ellipse(0, drop + w * 0.46, w * 0.2, w * 0.14), '#fff2c0'),
    ol(M(-w * 0.5, drop + w * 0.44) + Q(-w * 0.44, drop + 4, 0, drop + 4) + Q(w * 0.44, drop + 4, w * 0.5, drop + w * 0.44) + 'Z', col, 1.2, -0.3),
    sh(M(-w * 0.34, drop + w * 0.34) + Q(-w * 0.3, drop + 12, -w * 0.08, drop + 9) + Q(-w * 0.24, drop + 16, -w * 0.26, drop + w * 0.34) + 'Z', '#ffffff', { opacity: 0.35 }),
    sh(rect(-w * 0.52, drop + w * 0.42, w * 1.04, w * 0.07, 2), shade(col, -0.25)),
  ];
}

/** Leafy pot plant, height h. */
export function plant(h: number, pot: string, seed: number, leafCol = '#5c9a5a'): Shape[] {
  const g = rng(seed), out: Shape[] = [];
  let a = '', b = '', veins = '';
  for (let i = 0; i < 11; i++) {
    const ang = -90 + (i - 5) * 15 + g.range(-5, 5), len = h * g.range(0.48, 0.7), d = leaf(g.range(-h * 0.04, h * 0.04), -h * 0.3, len, len * 0.2, ang);
    if (i % 2) a += d; else b += d;
    veins += line([[0, -h * 0.3], pol(0, -h * 0.3, ang, len * 0.85)]);
  }
  out.push(ol(b, shade(leafCol, -0.15), 1, -0.25), ol(a, leafCol, 1, -0.3), stroke(veins, shade(leafCol, 0.3), 1, { opacity: 0.5 }));
  out.push(shadow(0, 0, h * 0.2, h * 0.03), ol(poly([[-h * 0.17, -h * 0.32], [h * 0.17, -h * 0.32], [h * 0.12, 0], [-h * 0.12, 0]]), pot, 1.2, -0.3), ol(rect(-h * 0.19, -h * 0.36, h * 0.38, h * 0.07, 3), shade(pot, 0.12), 1, -0.3), sh(poly([[h * 0.05, -h * 0.29], [h * 0.16, -h * 0.29], [h * 0.115, 0], [h * 0.04, 0]]), '#000000', { opacity: 0.1 }));
  return out;
}

/** Round wall clock; origin at its centre. */
export function wallClock(r: number, rim: string): Shape[] {
  let ticks = '';
  for (let i = 0; i < 12; i++) ticks += line([pol(0, 0, i * 30, r * 0.66), pol(0, 0, i * 30, r * (i % 3 ? 0.74 : 0.78))]);
  return [
    sh(circle(2, 4, r), '#000000', { opacity: 0.18 }), ol(circle(0, 0, r), rim, 1.4, -0.35), sh(circle(0, 0, r * 0.9), shade(rim, 0.25)), ol(circle(0, 0, r * 0.82), C.cream, 1, -0.2),
    stroke(ticks, C.ink, r * 0.05), stroke(line([[0, 0], pol(0, 0, -60, r * 0.42)]), C.ink, r * 0.09), stroke(line([[0, 0], pol(0, 0, 60, r * 0.62)]), C.ink, r * 0.06), sh(circle(0, 0, r * 0.08), C.red),
  ];
}

// =====================================================================
// candy
// =====================================================================
/** Pinwheel of curved wedges (lollipops, peppermints). */
export function swirlDisc(cx: number, cy: number, r: number, cols: string[], nW = 8, twist = 55): Shape[] {
  const by = cols.map(() => '');
  for (let i = 0; i < nW; i++) {
    const a0 = (i * 360) / nW, a1 = ((i + 1) * 360) / nW;
    const c0 = pol(cx, cy, a0 - twist, r * 0.55), c1 = pol(cx, cy, a1 - twist, r * 0.55), p0 = pol(cx, cy, a0, r);
    let d = M(cx, cy) + Q(c0[0], c0[1], p0[0], p0[1]);
    for (let k = 1; k <= 4; k++) { const p = pol(cx, cy, a0 + ((a1 - a0) * k) / 4, r); d += L(p[0], p[1]); }
    d += Q(c1[0], c1[1], cx, cy) + 'Z';
    by[i % cols.length] += d;
  }
  return by.map((d, i) => sh(d, cols[i]));
}

/** Swirl lollipop of radius r on a stick; origin at the bottom of the stick. */
export function lollipop(r: number, cols: string[], stick = r * 2.2, stickCol = C.white): Shape[] {
  const cy = -stick - r * 0.75;
  return [
    ol(rect(-r * 0.09, -stick - r * 0.2, r * 0.18, stick + r * 0.2, r * 0.08), stickCol, 0.8, -0.3),
    ...swirlDisc(0, cy, r, cols, cols.length * Math.max(2, Math.round(8 / cols.length))),
    stroke(circle(0, cy, r), shade(cols[0], -0.35), 1.2),
    hl(ellipse(-r * 0.38, cy - r * 0.42, r * 0.24, r * 0.13, -35), 0.5),
  ];
}

/** Red-and-white peppermint; origin at its centre. */
export function peppermint(r: number, col = C.red): Shape[] {
  return [...swirlDisc(0, 0, r, [col, C.white], 10, 40), stroke(circle(0, 0, r), shade(col, -0.3), 1), hl(ellipse(-r * 0.36, -r * 0.4, r * 0.22, r * 0.12, -35), 0.5)];
}

/** Striped candy cane of height h hooking to the right. */
export function candyCane(h: number, col = C.red, t = h * 0.13): Shape[] {
  const R = h * 0.19, cy = -h + R + t / 2, step = t * 0.45, pts: Pt[] = [];
  for (let y = -t / 2; y > cy; y -= step) pts.push([0, y]);
  for (let a = 180; a <= 360; a += 15) pts.push(pol(R, cy, a, R));
  for (let y = cy + step; y < cy + h * 0.13; y += step) pts.push([2 * R, y]);
  let st = '';
  const hw = t * 0.5, d = t * 0.2, sk = t * 0.45;
  for (let i = 2; i < pts.length - 2; i += 3) {
    const [px, py] = pts[i], tx0 = pts[i + 1][0] - pts[i - 1][0], ty0 = pts[i + 1][1] - pts[i - 1][1], len = Math.hypot(tx0, ty0) || 1;
    const tx = tx0 / len, ty = ty0 / len, nx = -ty, ny = tx;
    st += poly([[px + nx * hw - tx * d, py + ny * hw - ty * d], [px + nx * hw + tx * d, py + ny * hw + ty * d], [px - nx * hw + tx * (d + sk), py - ny * hw + ty * (d + sk)], [px - nx * hw - tx * (d - sk), py - ny * hw - ty * (d - sk)]]);
  }
  return [stroke(line(pts), shade(col, -0.35), t + 2), stroke(line(pts), C.white, t), sh(st, col), stroke(line(pts.slice(1, Math.floor(pts.length * 0.45)).map(([x, y]) => [x - t * 0.22, y] as Pt)), '#ffffff', t * 0.14, { opacity: 0.6 })];
}

/** Twist-wrapped sweet, about w wide; origin at its centre. */
export function wrapped(w: number, col: string, band = C.white): Shape[] {
  return [
    ol(poly([[-w * 0.22, 0], [-w * 0.5, -w * 0.17], [-w * 0.46, 0], [-w * 0.5, w * 0.17]]) + poly([[w * 0.22, 0], [w * 0.5, -w * 0.17], [w * 0.46, 0], [w * 0.5, w * 0.17]]), shade(col, 0.2), 0.8, -0.4),
    ol(ellipse(0, 0, w * 0.27, w * 0.17), col, 0.9, -0.3), sh(rect(-w * 0.05, -w * 0.165, w * 0.1, w * 0.33), band, { opacity: 0.85 }), hl(ellipse(-w * 0.13, -w * 0.07, w * 0.07, w * 0.035, -20), 0.6),
  ];
}

export type JarKind = 'balls' | 'beans' | 'mints' | 'cubes' | 'wrapped' | 'sticks' | 'drops';
export interface JarOpts { lid?: string; fill?: number; round?: boolean; label?: string; size?: number }
/** Glass sweet jar, w wide and h tall (plus its lid), filled with one kind of candy. */
export function candyJar(w: number, h: number, kind: JarKind, cols: string[], seed: number, o: JarOpts = {}): Shape[] {
  const g = rng(seed), out: Shape[] = [], lid = o.lid ?? C.red, fill = o.fill ?? 0.84, s = (o.size ?? 1) * Math.min(w * 0.1, 9);
  const body = o.round ? ellipse(0, -h * 0.5, w / 2, h / 2) + rect(-w * 0.3, -h * 1.02, w * 0.6, h * 0.14, 3) + rect(-w * 0.26, -h * 0.06, w * 0.52, h * 0.06, 2) : rect(-w / 2, -h, w, h, w * 0.2);
  const inside = (x: number, y: number, m: number) => {
    if (y < -h * fill || y > -m) return false;
    if (o.round) return (x / (w / 2 - m)) ** 2 + ((y + h / 2) / (h / 2 - m)) ** 2 <= 1;
    const lim = w / 2 - m - (y > -w * 0.14 ? (w * 0.14 + y) * 0.7 : 0);
    return Math.abs(x) <= lim;
  };
  out.push(sh(body, C.glass, { opacity: 0.7 }));
  const by = cols.map(() => '');
  let extra = '', dark = '';
  if (kind === 'sticks') {
    const cnt = Math.max(4, Math.floor((w - 8) / (s * 1.15)));
    for (let i = 0; i < cnt; i++) {
      const x = -w / 2 + 6 + ((i + 0.5) * (w - 12)) / cnt, top = -h * g.range(0.62, 0.92);
      by[i % cols.length] += rect(x - s * 0.42, top, s * 0.84, -top - 4, s * 0.3);
      for (let y = top + s; y < -6; y += s * 1.5) extra += line([[x - s * 0.3, y], [x + s * 0.3, y - s * 0.6]]);
    }
  } else {
    const cell = s * (kind === 'beans' ? 1.75 : kind === 'wrapped' ? 2.9 : kind === 'cubes' ? 2.5 : 2.05);
    const rowH = cell * (kind === 'wrapped' ? 0.62 : 0.9);
    for (let j = 0, y = -s * 1.1 - 2; y > -h * fill - s; y -= rowH, j++) {
      for (let x = -w / 2 + (j % 2 ? cell * 0.5 : cell * 0.1); x < w / 2; x += cell) {
        const px = x + g.range(-s * 0.3, s * 0.3), py = y + g.range(-s * 0.25, s * 0.25), k = g.int(0, cols.length - 1);
        if (!inside(px, py, s * (kind === 'wrapped' ? 1.5 : 1.05) + 1.5)) continue;
        if (kind === 'balls') { by[k] += circle(px, py, s); extra += circle(px - s * 0.3, py - s * 0.35, s * 0.22); }
        else if (kind === 'drops') { by[k] += ellipse(px, py, s, s * 0.82); extra += ellipse(px - s * 0.25, py - s * 0.3, s * 0.3, s * 0.16); }
        else if (kind === 'beans') by[k] += ellipse(px, py, s * 0.85, s * 0.52, g.range(0, 180));
        else if (kind === 'mints') { by[k] += circle(px, py, s); extra += circle(px, py, s * 0.45); }
        else if (kind === 'cubes') { const q = xf(rect(-s, -s, s * 2, s * 2, 2), { rot: g.range(-25, 25), x: px, y: py }); by[k] += q; dark += xf(rect(-s, -s * 0.3, s * 2, s * 0.6), { rot: g.range(-25, 25), x: px, y: py }); }
        else { const r0 = g.range(-35, 35); by[k] += xf(ellipse(0, 0, s * 1.05, s * 0.66) + poly([[-s * 0.9, 0], [-s * 1.8, -s * 0.6], [-s * 1.8, s * 0.6]]) + poly([[s * 0.9, 0], [s * 1.8, -s * 0.6], [s * 1.8, s * 0.6]]), { rot: r0, x: px, y: py }); extra += xf(rect(-s * 0.2, -s * 0.62, s * 0.4, s * 1.24), { rot: r0, x: px, y: py }); }
      }
    }
  }
  by.forEach((d, i) => { if (d) out.push(sh(d, cols[i], { stroke: shade(cols[i], -0.3), strokeWidth: 0.7 })); });
  if (dark) out.push(sh(dark, C.chocDk, { opacity: 0.85 }));
  if (extra) out.push(kind === 'sticks' ? stroke(extra, '#ffffff', s * 0.26, { opacity: 0.85 }) : sh(extra, '#ffffff', { opacity: kind === 'mints' || kind === 'wrapped' ? 0.9 : 0.55 }));
  out.push(stroke(body, C.glassLn, 1.4));
  out.push(hl(o.round ? ellipse(-w * 0.26, -h * 0.6, w * 0.05, h * 0.2, 14) : rect(-w * 0.38, -h * 0.9, w * 0.09, h * 0.72, w * 0.04), 0.5));
  if (o.label) out.push(ol(rect(-w * 0.26, -h * 0.5, w * 0.52, h * 0.2, 2), C.cream, 0.8, -0.3), sh(heart(0, -h * 0.41, h * 0.1), o.label));
  const ly = o.round ? -h * 1.02 : -h, lw = o.round ? w * 0.68 : w * 0.94;
  out.push(ol(rect(-lw / 2, ly - h * 0.1, lw, h * 0.12, 3), lid, 1, -0.35), sh(rect(-lw / 2 + 2, ly - h * 0.1 + 1.5, lw - 4, h * 0.03, 1), '#ffffff', { opacity: 0.35 }), ol(circle(0, ly - h * 0.1 - w * 0.07, w * 0.085), lid, 1, -0.35));
  return out;
}

/** Open glass jar (no lid, no contents) to draw over things standing in it. */
export function openJar(w: number, h: number): Shape[] {
  return [sh(rect(-w / 2, -h, w, h, w * 0.16), C.glass, { opacity: 0.5 }), stroke(rect(-w / 2, -h, w, h, w * 0.16), C.glassLn, 1.4), stroke(ellipse(0, -h, w / 2, w * 0.07), C.glassLn, 1.4), hl(rect(-w * 0.38, -h * 0.9, w * 0.09, h * 0.74, w * 0.04), 0.5)];
}

export const heart = (cx: number, cy: number, s: number) =>
  M(cx, cy + s * 0.45) + CB(cx - s * 0.9, cy - s * 0.1, cx - s * 0.5, cy - s * 0.75, cx, cy - s * 0.28) + CB(cx + s * 0.5, cy - s * 0.75, cx + s * 0.9, cy - s * 0.1, cx, cy + s * 0.45) + 'Z';

/** Ribbon bow centred on (cx, cy); s is the half-width. */
export function bow(cx: number, cy: number, s: number, col: string): Shape[] {
  const loop = (k: number) => M(cx, cy) + CB(cx + k * s * 0.4, cy - s * 0.65, cx + k * s * 1.05, cy - s * 0.55, cx + k * s * 0.95, cy) + CB(cx + k * s * 1.05, cy + s * 0.45, cx + k * s * 0.4, cy + s * 0.4, cx, cy) + 'Z';
  const tail = (k: number) => M(cx, cy) + Q(cx + k * s * 0.3, cy + s * 0.5, cx + k * s * 0.62, cy + s * 0.85) + L(cx + k * s * 0.24, cy + s * 0.8) + 'Z';
  return [ol(tail(-1) + tail(1), shade(col, -0.15), 0.8), ol(loop(-1) + loop(1), col, 0.9), sh(ellipse(cx - s * 0.55, cy - s * 0.12, s * 0.2, s * 0.1, -20) + ellipse(cx + s * 0.55, cy - s * 0.12, s * 0.2, s * 0.1, 20), '#ffffff', { opacity: 0.35 }), ol(ellipse(cx, cy, s * 0.2, s * 0.25), shade(col, 0.15), 0.8)];
}

/** Open tray of assorted chocolates, w wide, propped up to face the viewer. */
export function chocBox(w: number, col: string, seed: number): Shape[] {
  const h = w * 0.62, g = rng(seed), out: Shape[] = [];
  out.push(ol(rect(-w / 2, -h, w, h, 4), col, 1.2, -0.35), ol(rect(-w * 0.45, -h * 0.92, w * 0.9, h * 0.84, 3), C.chocDk, 1), sh(rect(-w * 0.45, -h * 0.92, w * 0.9, h * 0.1, 3), '#000000', { opacity: 0.25 }));
  let a = '', b = '', c = '', dz = '', cup = '';
  for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++) {
    const cx = -w * 0.33 + i * w * 0.22, cy = -h * 0.76 + j * h * 0.26, r = w * 0.075, k = g.int(0, 2);
    cup += circle(cx, cy, r * 1.22);
    const d = (i + j) % 3 === 0 ? rect(cx - r, cy - r, r * 2, r * 2, 3) : (i + j) % 3 === 1 ? circle(cx, cy, r) : ellipse(cx, cy, r * 1.1, r * 0.8);
    if (k === 0) a += d; else if (k === 1) b += d; else c += d;
    dz += g.next() < 0.5 ? line([[cx - r * 0.6, cy - r * 0.3], [cx, cy + r * 0.3], [cx + r * 0.6, cy - r * 0.3]]) : circle(cx, cy, r * 0.25);
  }
  out.push(sh(cup, C.brass, { opacity: 0.8 }), ol(a, C.choc, 0.8), ol(b, C.milk, 0.8), ol(c, '#f3e2c4', 0.8), stroke(dz, C.cream, 1.2, { opacity: 0.85 }));
  return out;
}

/** Heart-shaped chocolate box with a ribbon; s is its width. */
export function heartBox(s: number, col = C.red): Shape[] {
  const k = s * 0.84;
  return [
    sh(xf(heart(0, -s * 0.42, k), { x: 3, y: 4 }), '#000000', { opacity: 0.18 }), ol(heart(0, -s * 0.42, k), col, 1.4, -0.35), stroke(heart(0, -s * 0.43, k * 0.8), shade(col, 0.3), 1.6, { opacity: 0.8 }),
    sh(M(-s * 0.36, -s * 0.5) + L(-s * 0.24, -s * 0.62) + L(s * 0.3, -s * 0.2) + L(s * 0.2, -s * 0.1) + 'Z', C.brassLt, { opacity: 0.95 }),
    ...bow(-s * 0.02, -s * 0.4, s * 0.17, C.brassLt), hl(ellipse(-s * 0.26, -s * 0.66, s * 0.09, s * 0.045, -30), 0.5),
  ];
}

/** Half-unwrapped chocolate bar standing up, w wide. */
export function chocBar(w: number, wrap = C.teal): Shape[] {
  const h = w * 1.5;
  let sq = '', hi = '';
  for (let j = 0; j < 2; j++) for (let i = 0; i < 3; i++) { sq += rect(-w * 0.42 + i * w * 0.29, -h * 0.96 + j * h * 0.2, w * 0.26, h * 0.17, 2); hi += line([[-w * 0.4 + i * w * 0.29, -h * 0.94 + j * h * 0.2], [-w * 0.2 + i * w * 0.29, -h * 0.94 + j * h * 0.2]]); }
  let foil = M(-w * 0.5, -h * 0.5);
  for (let i = 0; i <= 8; i++) foil += L(-w * 0.5 + (i * w) / 8, -h * (i % 2 ? 0.63 : 0.56));
  foil += L(w * 0.5, -h * 0.5) + 'Z';
  return [
    ol(rect(-w * 0.46, -h, w * 0.92, h * 0.6, 3), C.choc, 1.2, -0.4), sh(sq, C.milk, { stroke: C.chocDk, strokeWidth: 0.8 }), stroke(hi, '#ffffff', 1.4, { opacity: 0.3 }),
    ol(foil, C.chromeLt, 0.8, -0.3), ol(rect(-w * 0.5, -h * 0.52, w, h * 0.52, 3), wrap, 1.2, -0.35), sh(rect(-w * 0.5, -h * 0.4, w, h * 0.14), C.cream), sh(star(0, -h * 0.33, h * 0.055, h * 0.025), C.brass), sh(rect(w * 0.26, -h * 0.52, w * 0.24, h * 0.52, 3), '#000000', { opacity: 0.1 }),
  ];
}

/** Brass shop scale with a dial and a pan of sweets, w wide. */
export function brassScale(w: number): Shape[] {
  let ticks = '';
  for (let a = -210; a <= 30; a += 30) ticks += line([pol(0, -w * 0.4, a, w * 0.13), pol(0, -w * 0.4, a, w * 0.165)]);
  const g = rng(7);
  const sweets: Shape[] = [];
  for (let i = 0; i < 9; i++) sweets.push(ol(circle(-w * 0.3 + i * w * 0.075 + g.range(-3, 3), -w * 0.9 - g.range(0, w * 0.06) - (i > 1 && i < 7 ? w * 0.04 : 0), w * 0.055), CANDY[i % CANDY.length], 0.7));
  return [
    shadow(0, 0, w * 0.46, w * 0.04), ol(rect(-w * 0.42, -w * 0.1, w * 0.84, w * 0.1, 4), C.brassDk, 1.2, -0.35), sh(rect(-w * 0.4, -w * 0.095, w * 0.8, w * 0.025, 2), C.brassLt, { opacity: 0.6 }),
    ol(poly([[-w * 0.31, -w * 0.1], [w * 0.31, -w * 0.1], [w * 0.22, -w * 0.64], [-w * 0.22, -w * 0.64]]), C.brass, 1.2, -0.35), sh(poly([[w * 0.1, -w * 0.1], [w * 0.31, -w * 0.1], [w * 0.22, -w * 0.64], [w * 0.1, -w * 0.64]]), '#000000', { opacity: 0.1 }),
    ol(circle(0, -w * 0.4, w * 0.21), C.brassDk, 1.2, -0.3), ol(circle(0, -w * 0.4, w * 0.18), C.cream, 0.8, -0.3), stroke(ticks, C.ink, 1.3), stroke(line([[0, -w * 0.4], pol(0, -w * 0.4, -55, w * 0.14)]), C.red, 2), sh(circle(0, -w * 0.4, w * 0.025), C.ink),
    ol(rect(-w * 0.035, -w * 0.78, w * 0.07, w * 0.15), C.brassDk, 1), ...sweets,
    ol(M(-w * 0.5, -w * 0.9) + L(w * 0.5, -w * 0.9) + Q(w * 0.36, -w * 0.72, 0, -w * 0.72) + Q(-w * 0.36, -w * 0.72, -w * 0.5, -w * 0.9) + 'Z', C.brass, 1.2, -0.35),
    sh(rect(-w * 0.5, -w * 0.915, w, w * 0.035, 3), C.brassLt), hl(M(-w * 0.4, -w * 0.87) + Q(-w * 0.3, -w * 0.77, -w * 0.12, -w * 0.75) + Q(-w * 0.28, -w * 0.8, -w * 0.34, -w * 0.87) + 'Z', 0.5),
  ];
}

/** Paper sweet bag with vertical stripes and a pinked top, height h. */
export function paperBag(h: number, col: string, stripe = C.white): Shape[] {
  const wt = h * 0.36, wb = h * 0.3;
  let top = M(-wb, 0) + L(wb, 0) + L(wt, -h * 0.94);
  for (let i = 1; i <= 10; i++) top += L(wt - (i * wt * 2) / 10, -h * (i % 2 ? 1 : 0.94));
  top += 'Z';
  let st = '';
  for (let i = 0; i < 6; i += 2) { const t0 = i / 6 + 1 / 12, t1 = t0 + 1 / 6; st += poly([[-wb + wb * 2 * t0, 0], [-wb + wb * 2 * t1, 0], [-wt + wt * 2 * t1, -h * 0.93], [-wt + wt * 2 * t0, -h * 0.93]]); }
  return [ol(top, stripe, 1.1, -0.3), sh(st, col), sh(poly([[wb * 0.5, 0], [wb, 0], [wt, -h * 0.94], [wt * 0.55, -h * 0.94]]), '#000000', { opacity: 0.09 }), stroke(line([[-wt * 0.96, -h * 0.8], [wt * 0.96, -h * 0.8]]), '#000000', 1, { opacity: 0.18 })];
}

/** Gumball machine, height h (globe, coin mechanism and base). */
export function gumballMachine(h: number, col = C.red): Shape[] {
  const g = rng(41), gy = -h * 0.66, gr = h * 0.25, out: Shape[] = [];
  out.push(shadow(0, 0, h * 0.24, h * 0.03), ol(poly([[-h * 0.21, 0], [h * 0.21, 0], [h * 0.16, -h * 0.1], [-h * 0.16, -h * 0.1]]), shade(col, -0.15), 1.2, -0.35));
  out.push(ol(rect(-h * 0.17, -h * 0.43, h * 0.34, h * 0.34, h * 0.02), col, 1.2, -0.35), sh(rect(h * 0.08, -h * 0.43, h * 0.09, h * 0.34, h * 0.02), '#000000', { opacity: 0.13 }), hl(rect(-h * 0.15, -h * 0.41, h * 0.03, h * 0.28, 2), 0.3));
  out.push(ol(rect(-h * 0.09, -h * 0.385, h * 0.18, h * 0.13, 3), C.chrome, 1, -0.4), ol(circle(0, -h * 0.32, h * 0.04), C.chromeLt, 1, -0.45), sh(rect(-h * 0.008, -h * 0.355, h * 0.016, h * 0.07, 1), C.chromeDk));
  out.push(ol(rect(-h * 0.07, -h * 0.21, h * 0.14, h * 0.08, 2), C.ink, 1), ol(rect(-h * 0.07, -h * 0.21, h * 0.14, h * 0.035, 2), C.chrome, 0.8, -0.4));
  out.push(sh(circle(0, gy, gr), C.glass, { opacity: 0.75 }));
  const by = RAINBOW.map(() => '');
  let dots = '';
  for (let i = 0; i < 90; i++) {
    const a = g.range(0, 360), rr = Math.sqrt(g.next()) * (gr - h * 0.04), [x, y] = pol(0, gy, a, rr);
    if (y < gy - gr * 0.42) continue;
    by[g.int(0, RAINBOW.length - 1)] += circle(x, y, h * 0.03); dots += circle(x - h * 0.009, y - h * 0.011, h * 0.008);
  }
  by.forEach((d, i) => { if (d) out.push(sh(d, RAINBOW[i], { stroke: shade(RAINBOW[i], -0.3), strokeWidth: 0.7 })); });
  out.push(sh(dots, '#ffffff', { opacity: 0.6 }), stroke(circle(0, gy, gr), C.glassLn, 1.6), hl(M(-gr * 0.72, gy - gr * 0.2) + Q(-gr * 0.62, gy - gr * 0.7, -gr * 0.14, gy - gr * 0.82) + Q(-gr * 0.5, gy - gr * 0.56, -gr * 0.56, gy - gr * 0.16) + 'Z', 0.6));
  out.push(ol(rect(-h * 0.15, -h * 0.47, h * 0.3, h * 0.055, 3), shade(col, -0.12), 1, -0.35));
  out.push(ol(M(-h * 0.13, -h * 0.885) + Q(0, -h * 0.99, h * 0.13, -h * 0.885) + 'Z', col, 1.2, -0.35), ol(circle(0, -h * 0.965, h * 0.028), C.chrome, 1, -0.4));
  return out;
}

/** Old brass cash register, w wide. */
export function cashRegister(w: number, col = C.brass): Shape[] {
  const out: Shape[] = [];
  out.push(shadow(0, 0, w * 0.54, w * 0.04), ol(rect(-w / 2, -w * 0.2, w, w * 0.2, 3), C.woodDk, 1.2, -0.35), ol(rect(-w * 0.44, -w * 0.165, w * 0.88, w * 0.13, 2), C.wood, 1, -0.35), ol(circle(0, -w * 0.1, w * 0.03), C.brass, 1, -0.4));
  out.push(stroke(M(w * 0.46, -w * 0.4) + L(w * 0.6, -w * 0.4) + L(w * 0.6, -w * 0.58), C.brassDk, w * 0.035), ol(circle(w * 0.6, -w * 0.6, w * 0.045), C.choc, 1));
  out.push(ol(M(-w * 0.46, -w * 0.2) + L(w * 0.46, -w * 0.2) + L(w * 0.46, -w * 0.42) + Q(w * 0.44, -w * 0.64, w * 0.3, -w * 0.67) + L(-w * 0.3, -w * 0.67) + Q(-w * 0.44, -w * 0.64, -w * 0.46, -w * 0.42) + 'Z', col, 1.3, -0.35));
  out.push(sh(M(w * 0.26, -w * 0.2) + L(w * 0.46, -w * 0.2) + L(w * 0.46, -w * 0.42) + Q(w * 0.44, -w * 0.64, w * 0.3, -w * 0.67) + 'Z', '#000000', { opacity: 0.1 }), hl(M(-w * 0.43, -w * 0.25) + L(-w * 0.43, -w * 0.42) + Q(-w * 0.41, -w * 0.6, -w * 0.3, -w * 0.64) + Q(-w * 0.39, -w * 0.5, -w * 0.39, -w * 0.25) + 'Z', 0.35));
  let keys = '', keys2 = '';
  for (let j = 0; j < 3; j++) for (let i = 0; i < 7; i++) { const d = circle(-w * 0.3 + i * w * 0.1 + (j % 2 ? w * 0.02 : 0), -w * 0.29 - j * w * 0.095, w * 0.034); if (i === 6 || (i + j) % 5 === 0) keys2 += d; else keys += d; }
  out.push(sh(keys, C.cream, { stroke: C.ink, strokeWidth: 1 }), sh(keys2, C.red, { stroke: C.ink, strokeWidth: 1 }));
  out.push(ol(rect(-w * 0.32, -w * 0.92, w * 0.64, w * 0.25, 4), shade(col, -0.12), 1.2, -0.35), ol(rect(-w * 0.26, -w * 0.87, w * 0.52, w * 0.15, 2), C.ink, 1));
  for (let i = 0; i < 3; i++) out.push(ol(rect(-w * 0.21 + i * w * 0.15, -w * 0.85, w * 0.12, w * 0.11, 1), C.cream, 0.8), sh(circle(-w * 0.15 + i * w * 0.15, -w * 0.795, w * 0.03), [C.red, C.teal, C.ink][i]));
  out.push(ol(M(-w * 0.32, -w * 0.92) + Q(0, -w * 1.06, w * 0.32, -w * 0.92) + 'Z', col, 1.2, -0.35), sh(star(0, -w * 0.95, w * 0.035, w * 0.015), C.brassLt));
  out.push(stroke(M(-w * 0.4, -w * 0.24) + Q(-w * 0.36, -w * 0.2, -w * 0.3, -w * 0.225) + M(w * 0.4, -w * 0.24) + Q(w * 0.36, -w * 0.2, w * 0.3, -w * 0.225), C.brassDk, 1.5));
  return out;
}

/** Counter service bell, s wide. */
export function bell(s: number, col = C.brass): Shape[] {
  return [
    shadow(0, 0, s * 0.56, s * 0.06), ol(rect(-s * 0.5, -s * 0.1, s, s * 0.1, 3), C.ink, 1), ol(M(-s * 0.42, -s * 0.1) + Q(-s * 0.42, -s * 0.62, 0, -s * 0.62) + Q(s * 0.42, -s * 0.62, s * 0.42, -s * 0.1) + 'Z', col, 1.2, -0.35),
    hl(M(-s * 0.32, -s * 0.16) + Q(-s * 0.32, -s * 0.5, -s * 0.1, -s * 0.56) + Q(-s * 0.24, -s * 0.44, -s * 0.24, -s * 0.16) + 'Z', 0.55), ol(rect(-s * 0.05, -s * 0.72, s * 0.1, s * 0.12), shade(col, -0.2), 1), ol(ellipse(0, -s * 0.74, s * 0.1, s * 0.05), shade(col, 0.15), 1, -0.4),
  ];
}

/** Iced gingerbread man, height h. */
export function gingerbread(h: number, col = C.caramel): Shape[] {
  const limbs = line([[-h * 0.3, -h * 0.56], [h * 0.3, -h * 0.56]]) + line([[0, -h * 0.5], [-h * 0.17, -h * 0.1]]) + line([[0, -h * 0.5], [h * 0.17, -h * 0.1]]);
  const dk = shade(col, -0.35);
  return [
    stroke(limbs, dk, h * 0.2 + 2.4), sh(circle(0, -h * 0.82, h * 0.18) + ellipse(0, -h * 0.47, h * 0.17, h * 0.2), dk, { stroke: dk, strokeWidth: 2.4 }),
    stroke(limbs, col, h * 0.2), sh(circle(0, -h * 0.82, h * 0.18) + ellipse(0, -h * 0.47, h * 0.17, h * 0.2), col),
    stroke(line([[-h * 0.3, -h * 0.63], [-h * 0.3, -h * 0.49]]) + line([[h * 0.3, -h * 0.63], [h * 0.3, -h * 0.49]]) + line([[-h * 0.25, -h * 0.13], [-h * 0.11, -h * 0.07]]) + line([[h * 0.25, -h * 0.13], [h * 0.11, -h * 0.07]]), C.white, h * 0.035),
    sh(circle(-h * 0.065, -h * 0.85, h * 0.022) + circle(h * 0.065, -h * 0.85, h * 0.022), C.chocDk), stroke(M(-h * 0.07, -h * 0.78) + Q(0, -h * 0.72, h * 0.07, -h * 0.78), C.white, h * 0.025),
    sh(circle(0, -h * 0.55, h * 0.03), C.red), sh(circle(0, -h * 0.45, h * 0.03), C.green), sh(circle(0, -h * 0.35, h * 0.03), C.red),
  ];
}

/** Glossy toffee apple on a stick, height h. */
export function candyApple(h: number, col = C.cherry): Shape[] {
  const r = h * 0.3;
  return [
    ol(rect(-h * 0.03, -h, h * 0.06, h * 0.5, 2), C.woodLt, 0.9, -0.35), ol(ellipse(0, -h * 0.03, r * 0.9, h * 0.045), shade(col, -0.2), 1),
    ol(M(0, -h * 0.56) + CB(-r * 0.6, -h * 0.66, -r * 1.15, -h * 0.5, -r * 1.05, -h * 0.28) + CB(-r * 0.95, -h * 0.06, -r * 0.4, 0, 0, -h * 0.03) + CB(r * 0.4, 0, r * 0.95, -h * 0.06, r * 1.05, -h * 0.28) + CB(r * 1.15, -h * 0.5, r * 0.6, -h * 0.66, 0, -h * 0.56) + 'Z', col, 1.2, -0.35),
    hl(M(-r * 0.78, -h * 0.3) + Q(-r * 0.8, -h * 0.5, -r * 0.4, -h * 0.55) + Q(-r * 0.62, -h * 0.44, -r * 0.62, -h * 0.3) + 'Z', 0.6), sh(circle(r * 0.3, -h * 0.2, r * 0.07) + circle(r * 0.5, -h * 0.32, r * 0.05) + circle(r * 0.1, -h * 0.12, r * 0.05), C.lemon),
  ];
}

/** Candy floss on a paper cone, height h. */
export function cottonCandy(h: number, col = C.pink): Shape[] {
  const g = rng(13);
  let f = '', l = '';
  for (let i = 0; i < 12; i++) { const [x, y] = pol(0, -h * 0.68, i * 30, h * 0.17); f += circle(x * 0.92, y, h * g.range(0.1, 0.14)); }
  f += ellipse(0, -h * 0.66, h * 0.2, h * 0.24);
  for (let i = 0; i < 5; i++) l += circle(g.range(-h * 0.14, h * 0.06), -h * g.range(0.62, 0.84), h * g.range(0.05, 0.08));
  return [
    ol(poly([[-h * 0.09, -h * 0.46], [h * 0.09, -h * 0.46], [0, 0]]), C.white, 1, -0.3), sh(poly([[-h * 0.045, -h * 0.23], [h * 0.045, -h * 0.23], [h * 0.03, -h * 0.15], [-h * 0.03, -h * 0.15]]) + poly([[-h * 0.08, -h * 0.4], [h * 0.08, -h * 0.4], [h * 0.063, -h * 0.32], [-h * 0.063, -h * 0.32]]), C.sky),
    ...un(f, col, 1.1, -0.25), sh(l, '#ffffff', { opacity: 0.35 }), stroke(curve([[-h * 0.1, -h * 0.56], [0, -h * 0.5], [h * 0.12, -h * 0.58]]) + curve([[-h * 0.02, -h * 0.74], [h * 0.08, -h * 0.68], [h * 0.16, -h * 0.74]]), shade(col, -0.2), 1.2, { opacity: 0.7 }),
  ];
}

/** Gummy bear, height h. */
export function gummyBear(h: number, col: string): Shape[] {
  const d = circle(-h * 0.14, -h * 0.9, h * 0.07) + circle(h * 0.14, -h * 0.9, h * 0.07) + circle(0, -h * 0.76, h * 0.19) + ellipse(0, -h * 0.36, h * 0.22, h * 0.27) + ellipse(-h * 0.24, -h * 0.46, h * 0.09, h * 0.07, -30) + ellipse(h * 0.24, -h * 0.46, h * 0.09, h * 0.07, 30) + ellipse(-h * 0.14, -h * 0.07, h * 0.1, h * 0.075) + ellipse(h * 0.14, -h * 0.07, h * 0.1, h * 0.075);
  return [...un(d, col, 1.1, -0.3), sh(ellipse(0, -h * 0.34, h * 0.12, h * 0.16), '#ffffff', { opacity: 0.22 }), sh(circle(-h * 0.07, -h * 0.79, h * 0.022) + circle(h * 0.07, -h * 0.79, h * 0.022) + ellipse(0, -h * 0.72, h * 0.03, h * 0.02), shade(col, -0.55)), hl(ellipse(-h * 0.1, -h * 0.86, h * 0.05, h * 0.025, -30), 0.6)];
}

/** Sitting teddy bear with a bow tie, height h. */
export function teddy(h: number, col = '#b5814f', tie = C.red): Shape[] {
  const d = circle(-h * 0.17, -h * 0.9, h * 0.08) + circle(h * 0.17, -h * 0.9, h * 0.08) + circle(0, -h * 0.74, h * 0.21) + ellipse(0, -h * 0.32, h * 0.25, h * 0.3) + ellipse(-h * 0.28, -h * 0.42, h * 0.1, h * 0.08, -40) + ellipse(h * 0.28, -h * 0.42, h * 0.1, h * 0.08, 40) + ellipse(-h * 0.2, -h * 0.08, h * 0.13, h * 0.09) + ellipse(h * 0.2, -h * 0.08, h * 0.13, h * 0.09);
  return [
    ...un(d, col, 1.2, -0.35), sh(circle(-h * 0.17, -h * 0.9, h * 0.04) + circle(h * 0.17, -h * 0.9, h * 0.04) + ellipse(0, -h * 0.3, h * 0.15, h * 0.19) + circle(-h * 0.2, -h * 0.08, h * 0.05) + circle(h * 0.2, -h * 0.08, h * 0.05), shade(col, 0.4)),
    sh(ellipse(0, -h * 0.69, h * 0.09, h * 0.07), shade(col, 0.5)), sh(ellipse(0, -h * 0.72, h * 0.035, h * 0.025) + circle(-h * 0.08, -h * 0.79, h * 0.022) + circle(h * 0.08, -h * 0.79, h * 0.022), C.ink), stroke(M(-h * 0.04, -h * 0.67) + Q(0, -h * 0.64, h * 0.04, -h * 0.67), C.ink, 1.2),
    ...bow(0, -h * 0.55, h * 0.1, tie),
  ];
}

/** Metal sweet scoop with a wooden handle, w long; origin at its centre. */
export function scoop(w: number): Shape[] {
  return [
    ol(rect(w * 0.08, -w * 0.06, w * 0.42, w * 0.12, w * 0.06), C.wood, 1, -0.35), ol(rect(w * 0.04, -w * 0.075, w * 0.08, w * 0.15, 2), C.chromeDk, 0.8),
    ol(M(-w * 0.5, -w * 0.1) + L(w * 0.06, -w * 0.17) + L(w * 0.06, w * 0.17) + L(-w * 0.34, w * 0.17) + Q(-w * 0.48, w * 0.12, -w * 0.5, -w * 0.1) + 'Z', C.chrome, 1.1, -0.4),
    sh(M(-w * 0.46, -w * 0.07) + L(w * 0.03, -w * 0.13) + L(w * 0.03, -w * 0.02) + L(-w * 0.42, w * 0.02) + 'Z', C.chromeLt), sh(M(-w * 0.3, w * 0.1) + L(w * 0.04, w * 0.1) + L(w * 0.04, w * 0.15) + L(-w * 0.3, w * 0.15) + 'Z', C.chromeDk, { opacity: 0.4 }),
  ];
}

/** Wooden barrel, w wide and h tall. */
export function barrel(w: number, h: number, col = C.wood): Shape[] {
  const body = M(-w * 0.4, 0) + L(w * 0.4, 0) + Q(w * 0.56, -h * 0.5, w * 0.42, -h) + L(-w * 0.42, -h) + Q(-w * 0.56, -h * 0.5, -w * 0.4, 0) + 'Z';
  let st = '';
  for (let i = -2; i <= 2; i++) st += M(i * w * 0.15, -2) + Q(i * w * 0.21, -h * 0.5, i * w * 0.155, -h + 2);
  const hoop = (y: number, k: number) => M(-w * k, y) + Q(0, y + h * 0.05, w * k, y) + L(w * k, y + h * 0.07) + Q(0, y + h * 0.12, -w * k, y + h * 0.07) + 'Z';
  return [shadow(0, 0, w * 0.5, h * 0.04), ol(body, col, 1.3, -0.35), stroke(st, shade(col, -0.25), 1.4), sh(M(w * 0.2, 0) + L(w * 0.4, 0) + Q(w * 0.56, -h * 0.5, w * 0.42, -h) + L(w * 0.26, -h) + Q(w * 0.34, -h * 0.5, w * 0.2, 0) + 'Z', '#000000', { opacity: 0.12 }), ol(hoop(-h * 0.86, 0.455) + hoop(-h * 0.2, 0.47), C.chromeDk, 1, -0.3)];
}

/** Slatted wooden crate front, w wide and h tall. */
export function crate(w: number, h: number, col = C.woodLt): Shape[] {
  const out: Shape[] = [shadow(0, 0, w * 0.52, h * 0.06), sh(rect(-w / 2, -h, w, h), shade(col, -0.45))];
  const nS = 3, sh2 = h / nS;
  let slats = '', nails = '';
  for (let i = 0; i < nS; i++) { slats += rect(-w / 2, -h + i * sh2 + 1.5, w, sh2 - 3, 2); nails += circle(-w * 0.43, -h + (i + 0.5) * sh2, 1.6) + circle(w * 0.43, -h + (i + 0.5) * sh2, 1.6); }
  out.push(ol(slats, col, 1, -0.35), ol(rect(-w / 2, -h, w * 0.1, h, 1) + rect(w * 0.4, -h, w * 0.1, h, 1), shade(col, -0.1), 1, -0.35), sh(nails, C.ink, { opacity: 0.6 }));
  return out;
}

// =====================================================================
// cakes and ice cream
// =====================================================================
/** Cupcake, about s tall before its topping. top: 'cherry' | 'sprinkles' | 'star' | 'candle'. */
export function cupcake(s: number, wrap: string, icing: string, top: 'cherry' | 'sprinkles' | 'star' | 'candle' = 'cherry'): Shape[] {
  const out: Shape[] = [];
  let pl = '';
  for (let i = -3; i <= 3; i++) pl += line([[i * s * 0.085, -s * 0.4], [i * s * 0.064, -2]]);
  out.push(ol(poly([[-s * 0.3, -s * 0.42], [s * 0.3, -s * 0.42], [s * 0.22, 0], [-s * 0.22, 0]]), wrap, 1, -0.3), stroke(pl, shade(wrap, -0.25), 1));
  out.push(ol(ellipse(0, -s * 0.48, s * 0.37, s * 0.15), icing, 1, -0.25), ol(ellipse(0, -s * 0.63, s * 0.28, s * 0.13), icing, 1, -0.25), ol(ellipse(0, -s * 0.77, s * 0.17, s * 0.1), icing, 1, -0.25), hl(ellipse(-s * 0.16, -s * 0.52, s * 0.1, s * 0.035, -8), 0.5));
  if (top === 'cherry') out.push(stroke(M(0, -s * 0.92) + Q(s * 0.04, -s * 1.08, s * 0.14, -s * 1.1), C.greenDk, 1.4), ol(circle(0, -s * 0.9, s * 0.09), C.cherry, 0.9), hl(circle(-s * 0.03, -s * 0.93, s * 0.025), 0.7));
  else if (top === 'star') out.push(ol(star(0, -s * 0.94, s * 0.13, s * 0.06), C.lemon, 0.9, -0.35));
  else if (top === 'candle') out.push(ol(rect(-s * 0.035, -s * 1.12, s * 0.07, s * 0.3, 1), C.sky, 0.8), sh(leaf(0, -s * 1.12, s * 0.16, s * 0.06, -90), C.orange), sh(leaf(0, -s * 1.12, s * 0.1, s * 0.03, -90), C.lemon));
  else { const g = rng(Math.round(s * 7)); for (let i = 0; i < 7; i++) out.push(sh(xf(rect(-s * 0.035, -s * 0.012, s * 0.07, s * 0.024, 1), { rot: g.range(0, 180), x: g.range(-s * 0.22, s * 0.22), y: -s * g.range(0.48, 0.8) }), CANDY[i % CANDY.length])); }
  return out;
}

/** One scoop of ice cream with a ruffled skirt, centred on (cx, cy). */
export function scoopBall(cx: number, cy: number, r: number, col: string, chips?: string): Shape[] {
  let sk = '';
  for (let i = 0; i < 5; i++) sk += circle(cx - r * 0.84 + i * r * 0.42, cy + r * 0.66, r * 0.27);
  const out = [...un(sk, shade(col, -0.06), 0.9, -0.28), ol(circle(cx, cy, r), col, 1, -0.28), hl(ellipse(cx - r * 0.38, cy - r * 0.42, r * 0.26, r * 0.14, -35), 0.5)];
  if (chips) out.push(sh(circle(cx + r * 0.3, cy - r * 0.1, r * 0.08) + circle(cx - r * 0.1, cy + r * 0.3, r * 0.07) + circle(cx + r * 0.1, cy - r * 0.5, r * 0.06) + circle(cx - r * 0.5, cy + r * 0.05, r * 0.06) + circle(cx + r * 0.55, cy + r * 0.3, r * 0.06), chips));
  return out;
}

/** Waffle cone pointing down from a rim at y = -hc; origin at the tip. */
export function cone(hc: number, w = hc * 0.55, col = C.waffle): Shape[] {
  const Lp = (t: number): Pt => [(-w / 2) * (1 - t), -hc * (1 - t)], Rp = (t: number): Pt => [(w / 2) * (1 - t), -hc * (1 - t)];
  let hatch = '';
  for (let t = 0; t <= 0.76; t += 0.19) hatch += line([Lp(t), Rp(Math.min(1, t + 0.24))]) + line([Rp(t), Lp(Math.min(1, t + 0.24))]);
  for (let u = 0.25; u < 1; u += 0.25) hatch += line([[-w / 2 + u * w, -hc], Rp(0.24 * (1 - u))]) + line([[w / 2 - u * w, -hc], Lp(0.24 * (1 - u))]);
  return [ol(poly([[-w / 2, -hc], [w / 2, -hc], [0, 0]]), col, 1, -0.35), stroke(hatch, shade(col, -0.28), 1), sh(poly([[w * 0.12, -hc], [w / 2, -hc], [0, 0]]), '#000000', { opacity: 0.08 }), ol(rect(-w / 2 - 1.5, -hc - hc * 0.05, w + 3, hc * 0.08, 2), shade(col, 0.12), 0.9, -0.35)];
}

/** Ice-cream cone with stacked scoops; origin at the cone tip. `chips` flecks every scoop. */
export function iceCreamCone(hc: number, scoops: string[], chips?: string): Shape[] {
  const w = hc * 0.55, r = w * 0.6, out: Shape[] = [];
  const balls: Shape[][] = scoops.map((c, i) => scoopBall(0, -hc - r * 0.62 - i * r * 1.22, r * (1 - i * 0.06), c, chips));
  for (let i = balls.length - 1; i >= 1; i--) out.push(...balls[i]);
  out.push(...cone(hc, w), ...balls[0]);
  // upper scoops sit on top of the first one
  for (let i = 1; i < balls.length; i++) out.push(...balls[i]);
  return out;
}

/** Whipped-cream swirl sitting on y = cy; w is its width. */
export function cream(cx: number, cy: number, w: number, col = C.white): Shape[] {
  return [ol(ellipse(cx, cy - w * 0.12, w * 0.5, w * 0.17), col, 0.9, -0.2), ol(ellipse(cx, cy - w * 0.3, w * 0.36, w * 0.15), col, 0.9, -0.2), ol(ellipse(cx, cy - w * 0.46, w * 0.22, w * 0.12), col, 0.9, -0.2), ol(M(cx - w * 0.1, cy - w * 0.52) + Q(cx, cy - w * 0.8, cx + w * 0.06, cy - w * 0.7) + Q(cx + w * 0.06, cy - w * 0.58, cx + w * 0.1, cy - w * 0.52) + 'Z', col, 0.9, -0.2)];
}

/** Cherry with a stem; origin at its centre. */
export function cherry(r: number): Shape[] {
  return [stroke(M(0, -r * 0.8) + Q(r * 0.3, -r * 2.2, r * 1.3, -r * 2.5), C.greenDk, Math.max(1.2, r * 0.18)), ol(circle(0, 0, r), C.cherry, 1, -0.35), hl(ellipse(-r * 0.35, -r * 0.4, r * 0.25, r * 0.15, -30), 0.7)];
}

/** Striped drinking straw between two points. */
export function straw(x0: number, y0: number, x1: number, y1: number, w: number, col = C.red): Shape[] {
  const len = Math.hypot(x1 - x0, y1 - y0), k = Math.max(3, Math.round(len / (w * 1.6)));
  let d = '';
  for (let i = 0; i < k; i++) { const t0 = (i + 0.2) / k, t1 = (i + 0.6) / k; d += line([[x0 + (x1 - x0) * t0, y0 + (y1 - y0) * t0], [x0 + (x1 - x0) * t1, y0 + (y1 - y0) * t1]]); }
  return [stroke(line([[x0, y0], [x1, y1]]), shade(col, -0.3), w + 1.6), stroke(line([[x0, y0], [x1, y1]]), C.white, w), sh('M0 0L0.1 0L0 0.1Z', 'none'), stroke(d, col, w, { opacity: 0.95 })].filter((s) => s.fill !== 'none' || s.stroke);
}

/** Ice-cream sundae in a tulip glass, height h. */
export function sundae(h: number, cols: string[], sauce = C.choc): Shape[] {
  const bowl = M(-h * 0.23, -h * 0.6) + Q(-h * 0.21, -h * 0.3, -h * 0.035, -h * 0.26) + L(h * 0.035, -h * 0.26) + Q(h * 0.21, -h * 0.3, h * 0.23, -h * 0.6) + 'Z';
  const inner = M(-h * 0.2, -h * 0.58) + Q(-h * 0.18, -h * 0.33, -h * 0.03, -h * 0.29) + L(h * 0.03, -h * 0.29) + Q(h * 0.18, -h * 0.33, h * 0.2, -h * 0.58) + 'Z';
  return [
    shadow(0, 0, h * 0.2, h * 0.025), ol(ellipse(0, -h * 0.025, h * 0.16, h * 0.03), C.glass, 1, -0.35), ol(rect(-h * 0.025, -h * 0.27, h * 0.05, h * 0.25), C.glass, 1, -0.35),
    ol(rect(h * 0.06, -h * 0.98, h * 0.05, h * 0.4, 1), C.waffle, 0.8, -0.35),
    sh(inner, cols[0]), sh(M(-h * 0.2, -h * 0.58) + L(h * 0.2, -h * 0.58) + L(h * 0.19, -h * 0.47) + Q(0, -h * 0.42, -h * 0.19, -h * 0.47) + 'Z', cols[1] ?? cols[0]),
    ...scoopBall(-h * 0.09, -h * 0.66, h * 0.115, cols[1] ?? cols[0]), ...scoopBall(h * 0.09, -h * 0.66, h * 0.115, cols[2] ?? cols[0]),
    sh(bowl, C.glass, { opacity: 0.3 }), stroke(bowl, C.glassLn, 1.3), hl(M(-h * 0.19, -h * 0.56) + Q(-h * 0.17, -h * 0.36, -h * 0.07, -h * 0.31) + Q(-h * 0.14, -h * 0.38, -h * 0.15, -h * 0.56) + 'Z', 0.55),
    ...cream(0, -h * 0.72, h * 0.22), stroke(M(-h * 0.1, -h * 0.76) + Q(-h * 0.06, -h * 0.7, -h * 0.02, -h * 0.77) + Q(h * 0.03, -h * 0.7, h * 0.07, -h * 0.76), sauce, h * 0.022),
    ...place(cherry(h * 0.045), { x: 0, y: -h * 0.93 }),
  ];
}

/** Tall milkshake with cream, a cherry and a straw, height h. */
export function milkshake(h: number, col: string, strawCol = C.red): Shape[] {
  const gl = poly([[-h * 0.17, -h * 0.72], [h * 0.17, -h * 0.72], [h * 0.11, -h * 0.07], [-h * 0.11, -h * 0.07]]);
  return [
    shadow(0, 0, h * 0.17, h * 0.025), ...straw(h * 0.03, -h * 0.6, h * 0.17, -h * 1.02, h * 0.035, strawCol),
    ol(rect(-h * 0.13, -h * 0.07, h * 0.26, h * 0.07, 3), C.glass, 1, -0.35), sh(poly([[-h * 0.155, -h * 0.68], [h * 0.155, -h * 0.68], [h * 0.1, -h * 0.09], [-h * 0.1, -h * 0.09]]), col),
    sh(poly([[h * 0.04, -h * 0.68], [h * 0.155, -h * 0.68], [h * 0.1, -h * 0.09], [h * 0.03, -h * 0.09]]), '#000000', { opacity: 0.08 }), stroke(gl, C.glassLn, 1.3), hl(poly([[-h * 0.13, -h * 0.66], [-h * 0.095, -h * 0.66], [-h * 0.06, -h * 0.14], [-h * 0.085, -h * 0.14]]), 0.5),
    ...cream(-h * 0.01, -h * 0.7, h * 0.3), ...place(cherry(h * 0.045), { x: -h * 0.03, y: -h * 0.94 }),
  ];
}

/** Banana split in a glass boat, w wide. */
export function bananaSplit(w: number): Shape[] {
  const dish = M(-w * 0.52, -w * 0.2) + Q(-w * 0.42, -w * 0.03, -w * 0.16, -w * 0.03) + L(w * 0.16, -w * 0.03) + Q(w * 0.42, -w * 0.03, w * 0.52, -w * 0.2) + 'Z';
  const ban = (k: number) => M(-w * 0.5, -w * 0.25) + Q(-w * 0.4, -w * (0.04 + k), 0, -w * (0.05 + k)) + Q(w * 0.4, -w * (0.04 + k), w * 0.5, -w * 0.25) + Q(w * 0.3, -w * 0.17, 0, -w * 0.17) + Q(-w * 0.3, -w * 0.17, -w * 0.5, -w * 0.25) + 'Z';
  return [
    shadow(0, 0, w * 0.3, w * 0.03), ol(rect(-w * 0.14, -w * 0.04, w * 0.28, w * 0.04, 2), C.glass, 1, -0.35), ol(ban(0.03), C.banana, 1, -0.35),
    ...scoopBall(-w * 0.24, -w * 0.28, w * 0.115, C.pink), ...scoopBall(0, -w * 0.3, w * 0.115, C.cream), ...scoopBall(w * 0.24, -w * 0.28, w * 0.115, C.milk),
    stroke(M(-w * 0.32, -w * 0.33) + Q(-w * 0.26, -w * 0.25, -w * 0.2, -w * 0.33) + M(w * 0.16, -w * 0.33) + Q(w * 0.22, -w * 0.25, w * 0.3, -w * 0.33), C.choc, w * 0.02),
    ...cream(-w * 0.24, -w * 0.36, w * 0.13), ...cream(0, -w * 0.38, w * 0.13), ...cream(w * 0.24, -w * 0.36, w * 0.13),
    ...place(cherry(w * 0.03), { x: -w * 0.24, y: -w * 0.47 }), ...place(cherry(w * 0.03), { x: 0, y: -w * 0.49 }), ...place(cherry(w * 0.03), { x: w * 0.24, y: -w * 0.47 }),
    sh(dish, C.glass, { opacity: 0.55 }), stroke(dish, C.glassLn, 1.3), stroke(M(-w * 0.52, -w * 0.2) + Q(0, -w * 0.13, w * 0.52, -w * 0.2), C.banana, w * 0.05), stroke(M(-w * 0.52, -w * 0.2) + Q(0, -w * 0.13, w * 0.52, -w * 0.2), '#d9b84a', 1, { opacity: 0.6 }),
    hl(M(-w * 0.42, -w * 0.14) + Q(-w * 0.34, -w * 0.06, -w * 0.18, -w * 0.05) + Q(-w * 0.32, -w * 0.09, -w * 0.38, -w * 0.15) + 'Z', 0.6),
  ];
}

/** Chrome soda fountain with three taps, height h. */
export function sodaFountain(h: number): Shape[] {
  const w = h * 0.72, out: Shape[] = [];
  let grill = '', ribs = '';
  for (let i = 0; i < 14; i++) grill += line([[-w * 0.44 + i * w * 0.068, -h * 0.062], [-w * 0.44 + i * w * 0.068, -h * 0.02]]);
  for (let i = 0; i < 5; i++) ribs += line([[-w * 0.24 + i * w * 0.12, -h * 0.38], [-w * 0.24 + i * w * 0.12, -h * 0.12]]);
  out.push(shadow(0, 0, w * 0.54, h * 0.03), ol(rect(-w * 0.5, -h * 0.08, w, h * 0.08, 3), C.chrome, 1.2, -0.4), stroke(grill, C.chromeDk, 1.3));
  const knobs = [C.hot, C.choc, C.lemon];
  for (let i = 0; i < 3; i++) { const x = (i - 1) * w * 0.24; out.push(stroke(line([[x, -h * 0.74], [x + (i - 1) * h * 0.03, -h * 0.93]]), C.chromeDk, h * 0.028), ol(circle(x + (i - 1) * h * 0.03, -h * 0.95, h * 0.045), knobs[i], 1, -0.35), hl(circle(x + (i - 1) * h * 0.03 - h * 0.014, -h * 0.964, h * 0.012), 0.7)); }
  out.push(ol(M(-w * 0.38, -h * 0.7) + Q(0, -h * 0.86, w * 0.38, -h * 0.7) + 'Z', C.chromeLt, 1.2, -0.45));
  out.push(ol(rect(-w * 0.38, -h * 0.72, w * 0.76, h * 0.62, w * 0.06), C.chrome, 1.2, -0.4), stroke(ribs, C.chromeDk, 1.4, { opacity: 0.7 }), sh(rect(w * 0.2, -h * 0.72, w * 0.18, h * 0.62, w * 0.06), '#000000', { opacity: 0.1 }), hl(rect(-w * 0.34, -h * 0.68, w * 0.06, h * 0.54, 3), 0.6));
  out.push(ol(rect(-w * 0.3, -h * 0.64, w * 0.6, h * 0.17, 5), C.hot, 1, -0.3), sh(circle(-w * 0.16, -h * 0.555, h * 0.03) + circle(0, -h * 0.57, h * 0.04) + circle(w * 0.16, -h * 0.545, h * 0.025) + circle(w * 0.07, -h * 0.5, h * 0.016) + circle(-w * 0.08, -h * 0.5, h * 0.014), '#ffffff', { opacity: 0.85 }));
  for (let i = 0; i < 3; i++) { const x = (i - 1) * w * 0.24; out.push(ol(rect(x - h * 0.03, -h * 0.44, h * 0.06, h * 0.05, 2), C.chromeDk, 1), ol(poly([[x - h * 0.022, -h * 0.39], [x + h * 0.022, -h * 0.39], [x + h * 0.014, -h * 0.3], [x - h * 0.014, -h * 0.3]]), C.chromeLt, 1, -0.45)); }
  return out;
}

/** Ice lolly on a stick, height h. */
export function popsicle(h: number, col: string, col2?: string): Shape[] {
  const a = h * 0.19, body = rect(-a, -h, a * 2, a * 2.4, a) + rect(-a, -h + a, a * 2, h * 0.7 - a, 4);
  const out = [ol(rect(-h * 0.05, -h * 0.34, h * 0.1, h * 0.34, h * 0.04), C.woodLt, 0.9, -0.35), ...un(body, col, 1.1, -0.3)];
  if (col2) out.push(sh(rect(-a, -h * 0.62, a * 2, h * 0.32, 4), col2), sh(rect(-a, -h * 0.64, a * 2, h * 0.04), '#ffffff', { opacity: 0.5 }));
  out.push(stroke(line([[-a * 0.4, -h * 0.84], [-a * 0.4, -h * 0.42]]) + line([[a * 0.4, -h * 0.84], [a * 0.4, -h * 0.42]]), '#000000', h * 0.03, { opacity: 0.1 }), hl(rect(-a * 0.8, -h * 0.9, a * 0.26, h * 0.3, a * 0.13), 0.5));
  return out;
}

/** Chrome napkin dispenser, height h. */
export function napkinDispenser(h: number): Shape[] {
  const w = h * 0.74;
  return [
    shadow(0, 0, w * 0.56, h * 0.04), ol(rect(-w / 2, -h, w, h, h * 0.1), C.chrome, 1.2, -0.4), sh(rect(w * 0.26, -h, w * 0.24, h, h * 0.1), '#000000', { opacity: 0.1 }), hl(rect(-w * 0.44, -h * 0.92, w * 0.07, h * 0.8, 2), 0.6),
    ol(rect(-w * 0.32, -h * 0.76, w * 0.64, h * 0.5, h * 0.2), C.chromeDk, 1), ol(M(-w * 0.26, -h * 0.5) + L(-w * 0.2, -h * 0.72) + L(w * 0.04, -h * 0.64) + L(w * 0.22, -h * 0.74) + L(w * 0.26, -h * 0.5) + 'Z', C.white, 0.9, -0.25),
    stroke(line([[-w * 0.3, -h * 0.14], [w * 0.3, -h * 0.14]]), C.chromeDk, 1.4),
  ];
}

/** Jar of striped straws, height h to the straw tips. */
export function strawJar(h: number): Shape[] {
  const w = h * 0.36, jh = h * 0.56, cols = [C.red, C.teal, C.hot, C.blue, C.orange, C.purple], out: Shape[] = [shadow(0, 0, w * 0.56, h * 0.025)];
  for (let i = 0; i < 6; i++) { const t = (i - 2.5) / 2.5; out.push(...straw(t * w * 0.26, -h * 0.05, t * w * 0.62, -h * (0.9 + (i % 2) * 0.1), h * 0.045, cols[i])); }
  out.push(sh(rect(-w / 2, -jh, w, jh, w * 0.14), C.glass, { opacity: 0.45 }), stroke(rect(-w / 2, -jh, w, jh, w * 0.14), C.glassLn, 1.4), hl(rect(-w * 0.38, -jh * 0.9, w * 0.1, jh * 0.76, w * 0.05), 0.55), ol(rect(-w * 0.53, -jh - h * 0.03, w * 1.06, h * 0.07, 3), C.chrome, 1, -0.4));
  return out;
}

/** Sprinkle shaker with a chrome top, height h. */
export function sprinkleShaker(h: number): Shape[] {
  const w = h * 0.46, g = rng(23), out: Shape[] = [shadow(0, 0, w * 0.54, h * 0.03), sh(rect(-w / 2, -h * 0.74, w, h * 0.74, w * 0.18), C.glass, { opacity: 0.7 })];
  const by = CANDY.map(() => '');
  for (let i = 0; i < 46; i++) by[i % CANDY.length] += xf(rect(-h * 0.045, -h * 0.014, h * 0.09, h * 0.028, 1), { rot: g.range(0, 180), x: g.range(-w * 0.36, w * 0.36), y: -h * g.range(0.06, 0.6) });
  by.forEach((d, i) => out.push(sh(d, CANDY[i])));
  out.push(stroke(rect(-w / 2, -h * 0.74, w, h * 0.74, w * 0.18), C.glassLn, 1.3), hl(rect(-w * 0.38, -h * 0.66, w * 0.1, h * 0.52, 2), 0.5));
  out.push(ol(M(-w * 0.54, -h * 0.72) + L(w * 0.54, -h * 0.72) + L(w * 0.44, -h * 0.9) + Q(0, -h * 1.04, -w * 0.44, -h * 0.9) + 'Z', C.chrome, 1.1, -0.4), sh(circle(-w * 0.2, -h * 0.86, 1.6) + circle(0, -h * 0.9, 1.6) + circle(w * 0.2, -h * 0.86, 1.6) + circle(-w * 0.1, -h * 0.8, 1.6) + circle(w * 0.1, -h * 0.8, 1.6), C.ink, { opacity: 0.7 }));
  return out;
}

/** Jar of cocktail cherries, height h. */
export function cherryJar(h: number): Shape[] {
  const w = h * 0.62, g = rng(29), out: Shape[] = [shadow(0, 0, w * 0.54, h * 0.03), sh(rect(-w / 2, -h * 0.8, w, h * 0.8, w * 0.2), '#f6c8cf', { opacity: 0.8 })];
  let ch = '', dots = '', stems = '';
  for (let j = 0; j < 4; j++) for (let i = 0; i < 3; i++) { const x = -w * 0.26 + i * w * 0.26 + g.range(-3, 3) + (j % 2 ? w * 0.06 : 0), y = -h * 0.12 - j * h * 0.15 + g.range(-2, 2), r = h * 0.085; ch += circle(x, y, r); dots += circle(x - r * 0.35, y - r * 0.35, r * 0.25); if (j === 3) stems += M(x, y - r * 0.8) + Q(x + r * 0.5, y - r * 2.2, x + r * 1.4, y - r * 2); }
  out.push(stroke(stems, C.greenDk, 1.3), ol(ch, C.cherry, 0.8, -0.35), sh(dots, '#ffffff', { opacity: 0.6 }), stroke(rect(-w / 2, -h * 0.8, w, h * 0.8, w * 0.2), C.glassLn, 1.4), hl(rect(-w * 0.4, -h * 0.72, w * 0.09, h * 0.56, 2), 0.5));
  out.push(ol(rect(-w * 0.44, -h * 0.92, w * 0.88, h * 0.14, 3), C.brass, 1, -0.35), sh(rect(-w * 0.4, -h * 0.9, w * 0.8, h * 0.03, 1), '#ffffff', { opacity: 0.35 }));
  return out;
}

/** Folded paper server's hat, w wide. */
export function paperHat(w: number, band = C.red): Shape[] {
  return [
    ol(M(-w * 0.5, 0) + L(w * 0.5, 0) + L(w * 0.42, -w * 0.36) + Q(0, -w * 0.5, -w * 0.42, -w * 0.36) + 'Z', C.white, 1.2, -0.25), sh(M(-w * 0.5, 0) + L(w * 0.5, 0) + L(w * 0.47, -w * 0.13) + L(-w * 0.47, -w * 0.13) + 'Z', band),
    stroke(M(-w * 0.2, -w * 0.4) + Q(0, -w * 0.3, w * 0.24, -w * 0.4) + M(-w * 0.47, -w * 0.13) + L(w * 0.47, -w * 0.13), shade(C.white, -0.2), 1.1), sh(rect(-w * 0.47, -w * 0.075, w * 0.94, w * 0.025), C.white, { opacity: 0.8 }),
  ];
}

/** Ice-cream sandwich, w wide. */
export function iceCreamSandwich(w: number): Shape[] {
  let holes = '';
  for (let i = 0; i < 6; i++) holes += circle(-w * 0.38 + i * w * 0.152, -w * 0.39, w * 0.018) + circle(-w * 0.38 + i * w * 0.152, -w * 0.065, w * 0.018);
  return [
    shadow(0, 0, w * 0.5, w * 0.03), ol(rect(-w * 0.47, -w * 0.33, w * 0.94, w * 0.22, 3), C.cream, 1, -0.25), sh(rect(-w * 0.47, -w * 0.33, w * 0.31, w * 0.22, 3), C.pink), sh(rect(w * 0.16, -w * 0.33, w * 0.31, w * 0.22, 3), C.milk),
    ol(rect(-w / 2, -w * 0.13, w, w * 0.13, 3), C.choc, 1, -0.4), ol(rect(-w / 2, -w * 0.46, w, w * 0.14, 3), C.choc, 1, -0.4), sh(holes, C.chocDk), hl(rect(-w * 0.44, -w * 0.445, w * 0.5, w * 0.025, 1), 0.2),
  ];
}

/** Nested stack of waffle cones, points down; origin at the lowest tip. */
export function coneStack(hc: number, count: number): Shape[] {
  const out: Shape[] = [];
  for (let i = count - 1; i >= 0; i--) out.push(...place(cone(hc), { y: -i * hc * 0.2 }));
  return out;
}

/** Ice-cream scoop tool, w long, bowl to the left; origin at its centre. */
export function iceScoop(w: number): Shape[] {
  return [
    ol(rect(-w * 0.08, -w * 0.055, w * 0.58, w * 0.11, w * 0.055), C.teal, 1, -0.35), hl(rect(0, -w * 0.035, w * 0.4, w * 0.025, 1), 0.4), ol(rect(-w * 0.2, -w * 0.035, w * 0.16, w * 0.07, 2), C.chromeDk, 0.9),
    ol(circle(-w * 0.34, 0, w * 0.16), C.chrome, 1.1, -0.4), sh(ellipse(-w * 0.34, w * 0.02, w * 0.12, w * 0.1), C.chromeDk, { opacity: 0.45 }), hl(ellipse(-w * 0.4, -w * 0.07, w * 0.05, w * 0.03, -30), 0.8),
    stroke(M(-w * 0.2, -w * 0.05) + Q(-w * 0.06, -w * 0.17, w * 0.06, -w * 0.07), C.chromeDk, w * 0.035),
  ];
}

/** Tub of ice cream seen from above at an angle, for a display freezer. Origin at the centre. */
export function tub(w: number, h: number, col: string, fleck?: string, seed = 1): Shape[] {
  const g = rng(seed), out: Shape[] = [ol(rect(-w / 2, -h / 2, w, h, 6), C.chromeLt, 1, -0.35), ol(rect(-w * 0.44, -h * 0.42, w * 0.88, h * 0.84, 5), col, 1, -0.25)];
  let sw = '', fl = '';
  for (let i = 0; i < 3; i++) { const y = -h * 0.24 + i * h * 0.22; sw += M(-w * 0.34, y) + Q(-w * 0.16, y - h * 0.12, 0, y) + Q(w * 0.16, y + h * 0.12, w * 0.34, y); }
  if (fleck) for (let i = 0; i < 9; i++) fl += circle(g.range(-w * 0.36, w * 0.36), g.range(-h * 0.34, h * 0.34), g.range(1.5, 3));
  out.push(stroke(sw, shade(col, -0.16), 2.2), stroke(xf(sw, { y: -2.5 }), shade(col, 0.3), 1.4, { opacity: 0.8 }));
  if (fl && fleck) out.push(sh(fl, fleck));
  return out;
}

// =====================================================================
// furniture
// =====================================================================
/** Chrome soda-fountain stool with a padded seat, height h. */
export function stool(h: number, seat: string): Shape[] {
  return [
    shadow(0, 0, h * 0.26, h * 0.035), ol(M(-h * 0.22, 0) + L(h * 0.22, 0) + Q(h * 0.06, -h * 0.05, h * 0.04, -h * 0.14) + L(-h * 0.04, -h * 0.14) + Q(-h * 0.06, -h * 0.05, -h * 0.22, 0) + 'Z', C.chrome, 1.2, -0.4),
    ol(rect(-h * 0.032, -h * 0.88, h * 0.064, h * 0.76), C.chrome, 1.1, -0.4), hl(rect(-h * 0.02, -h * 0.86, h * 0.014, h * 0.72), 0.7),
    stroke(ellipse(0, -h * 0.36, h * 0.17, h * 0.035), C.chromeDk, h * 0.022), stroke(M(-h * 0.17, -h * 0.36) + Q(0, -h * 0.3, h * 0.17, -h * 0.36), C.chromeLt, h * 0.01),
    ol(rect(-h * 0.25, -h * 0.9, h * 0.5, h * 0.055, 2), C.chrome, 1, -0.4), ol(rect(-h * 0.26, -h, h * 0.52, h * 0.12, h * 0.055), seat, 1.2, -0.3), hl(rect(-h * 0.2, -h * 0.985, h * 0.3, h * 0.025, h * 0.012), 0.4),
  ];
}

/** Round pedestal table: top w wide at height h. */
export function roundTable(w: number, h: number, top: string, leg = C.chrome): Shape[] {
  return [
    shadow(0, 0, w * 0.3, h * 0.035), ol(ellipse(0, -h * 0.02, w * 0.24, h * 0.03), leg, 1.1, -0.4), ol(rect(-w * 0.03, -h * 0.94, w * 0.06, h * 0.92), leg, 1.1, -0.4), hl(rect(-w * 0.018, -h * 0.9, w * 0.012, h * 0.84), 0.6),
    ol(ellipse(0, -h * 0.95, w * 0.5, w * 0.11), shade(top, -0.25), 1.2, -0.3), ol(ellipse(0, -h, w * 0.5, w * 0.11), top, 1.2, -0.3), hl(ellipse(-w * 0.16, -h - w * 0.03, w * 0.2, w * 0.025), 0.35),
  ];
}

/** Painted dining chair seen from the front, height h. */
export function chair(h: number, col: string): Shape[] {
  const w = h * 0.44;
  let sp = '';
  for (let i = -1; i <= 1; i++) sp += rect(i * w * 0.24 - w * 0.045, -h * 0.9, w * 0.09, h * 0.4, 2);
  return [
    ol(rect(-w * 0.5, -h, w * 0.1, h, 3) + rect(w * 0.4, -h, w * 0.1, h, 3), col, 1.1, -0.3), ol(sp, shade(col, 0.1), 1, -0.3),
    ol(M(-w * 0.52, -h * 0.86) + Q(0, -h * 1.06, w * 0.52, -h * 0.86) + L(w * 0.52, -h * 0.98) + Q(0, -h * 1.14, -w * 0.52, -h * 0.98) + 'Z', col, 1.1, -0.3), ol(rect(-w * 0.56, -h * 0.52, w * 1.12, h * 0.07, 3), shade(col, 0.12), 1.1, -0.35),
  ];
}

// =====================================================================
// party
// =====================================================================
/** Balloon of radius r centred on the origin with a string hanging `len` below, ending `dx` to the side. */
export function balloon(r: number, col: string, len = r * 3, dx = 0): Shape[] {
  const ky = r * 1.2;
  return [
    stroke(curve([[0, ky + r * 0.1], [dx * 0.2 + r * 0.25, ky + len * 0.35], [dx * 0.7 - r * 0.2, ky + len * 0.7], [dx, ky + len]]), '#8d8078', 1.3),
    ol(poly([[-r * 0.11, ky + r * 0.12], [r * 0.11, ky + r * 0.12], [0, ky - r * 0.06]]), shade(col, -0.1), 0.9), ol(ellipse(0, 0, r, r * 1.2), col, 1.2, -0.28),
    sh(M(r * 0.3, -r * 1.1) + Q(r * 1.0, -r * 0.5, r * 0.82, r * 0.5) + Q(r * 0.6, r * 1.0, r * 0.14, r * 1.17) + Q(r * 0.9, r * 0.5, r * 0.3, -r * 1.1) + 'Z', '#000000', { opacity: 0.08 }),
    hl(ellipse(-r * 0.4, -r * 0.5, r * 0.2, r * 0.34, 22), 0.5), hl(circle(-r * 0.56, r * 0.06, r * 0.07), 0.5),
  ];
}

/** Foil star balloon; origin at its centre. */
export function starBalloon(r: number, col: string, len = r * 3, dx = 0): Shape[] {
  return [
    stroke(curve([[0, r * 0.8], [dx * 0.3 + r * 0.2, r * 0.8 + len * 0.4], [dx, r * 0.8 + len]]), '#8d8078', 1.3),
    sh(star(0, 0, r, r * 0.52), col, { stroke: shade(col, -0.3), strokeWidth: r * 0.16 }), sh(star(0, 0, r, r * 0.52), col), sh(star(0, 0, r * 0.62, r * 0.33), shade(col, 0.3), { opacity: 0.7 }),
    hl(ellipse(-r * 0.2, -r * 0.3, r * 0.1, r * 0.2, 25), 0.6), ol(poly([[-r * 0.08, r * 0.86], [r * 0.08, r * 0.86], [0, r * 0.7]]), shade(col, -0.15), 0.8),
  ];
}

/** Cone party hat with a pom-pom, height h. pattern: 'bands' | 'dots'. */
export function partyHat(h: number, col: string, col2: string, pattern: 'bands' | 'dots' = 'bands'): Shape[] {
  const hw = h * 0.36, wAt = (t: number) => hw * (1 - t), out: Shape[] = [ol(poly([[-hw, 0], [hw, 0], [0, -h]]), col, 1.2, -0.3)];
  let d = '';
  if (pattern === 'bands') for (let t = 0.14; t < 0.86; t += 0.24) d += poly([[-wAt(t), -h * t], [wAt(t), -h * t], [wAt(t + 0.1), -h * (t + 0.1)], [-wAt(t + 0.1), -h * (t + 0.1)]]);
  else for (let j = 0; j < 4; j++) { const t = 0.16 + j * 0.19, k = 3 - j; for (let i = 0; i < k; i++) d += circle((i - (k - 1) / 2) * hw * 0.5 * (j % 2 ? 0.9 : 1), -h * t, h * 0.04); }
  out.push(sh(d, col2), sh(poly([[hw * 0.3, 0], [hw, 0], [0, -h]]), '#000000', { opacity: 0.09 }));
  let fr = '';
  for (let i = 0; i <= 6; i++) fr += circle(-hw + (i * hw * 2) / 6, 0, h * 0.055);
  let pp = '';
  for (let i = 0; i < 6; i++) { const [x, y] = pol(0, -h, i * 60, h * 0.05); pp += circle(x, y, h * 0.055); }
  out.push(...un(fr, col2, 0.9, -0.25), ...un(pp, col2, 0.9, -0.25));
  return out;
}

/** Wrapped present with a lid, ribbon and bow; w wide and h tall. pattern: 'plain' | 'dots' | 'stripes'. */
export function present(w: number, h: number, col: string, rib: string, pattern: 'plain' | 'dots' | 'stripes' = 'plain'): Shape[] {
  const out: Shape[] = [shadow(0, 0, w * 0.54, h * 0.04), ol(rect(-w / 2, -h * 0.84, w, h * 0.84, 2), col, 1.2, -0.3)];
  let d = '';
  if (pattern === 'dots') for (let j = 0, y = -h * 0.72; y < -h * 0.06; y += w * 0.17, j++) for (let x = -w * 0.4 + (j % 2 ? w * 0.09 : 0); x < w * 0.46; x += w * 0.18) d += circle(x, y, w * 0.035);
  if (pattern === 'stripes') for (let x = -w * 0.44; x < w * 0.46; x += w * 0.16) d += rect(x, -h * 0.84, w * 0.06, h * 0.84);
  if (d) out.push(sh(d, C.white, { opacity: 0.8 }));
  out.push(sh(rect(w * 0.3, -h * 0.84, w * 0.2, h * 0.84, 2), '#000000', { opacity: 0.09 }), ol(rect(-w * 0.07, -h * 0.84, w * 0.14, h * 0.84), rib, 0.9, -0.25));
  out.push(ol(rect(-w * 0.54, -h, w * 1.08, h * 0.2, 3), shade(col, 0.14), 1.2, -0.35), sh(rect(-w * 0.54, -h * 0.82, w * 1.08, h * 0.03), '#000000', { opacity: 0.12 }), ol(rect(-w * 0.07, -h, w * 0.14, h * 0.2), rib, 0.9, -0.25), ...bow(0, -h - w * 0.04, w * 0.2, rib));
  return out;
}

/** Donkey piñata covered in rows of tissue fringe, facing right; w is its body length, origin mid-body. */
export function pinata(w: number, cols: string[] = [C.hot, C.orange, C.lemon, C.green, C.sky, C.purple]): Shape[] {
  const out: Shape[] = [], bh = w * 0.085;
  type Part = { y0: number; y1: number; xl: (y: number) => number; xr: (y: number) => number };
  const box = (x0: number, x1: number, y0: number, y1: number): Part => ({ y0: y0 * w, y1: y1 * w, xl: () => x0 * w, xr: () => x1 * w });
  const fringe = (p: Part) => {
    for (let y = p.y0, i = 0; y < p.y1 - 1; y += bh, i++) {
      const yb = Math.min(p.y1, y + bh), xl = p.xl(y), xr = p.xr(y), xl2 = p.xl(yb), xr2 = p.xr(yb);
      let d = M(xl, y) + L(xr, y);
      const teeth = Math.max(2, Math.round((xr2 - xl2) / (bh * 0.5)));
      for (let k = 0; k <= teeth; k++) d += L(xr2 - ((xr2 - xl2) * k) / teeth, yb + (k % 2 ? bh * 0.42 : 0));
      out.push(ol(d + 'Z', cols[(((Math.round(y / bh) + i * 0) % cols.length) + cols.length) % cols.length], 0.8, -0.25));
    }
  };
  // tail streamers
  cols.slice(0, 4).forEach((c, i) => out.push(stroke(curve([[-w * 0.45, -w * 0.1], [-w * (0.56 + i * 0.02), w * 0.02], [-w * (0.52 + i * 0.03), w * (0.2 + i * 0.03)]]), c, w * 0.022)));
  // ears
  out.push(ol(poly([[w * 0.3, -w * 0.66], [w * 0.36, -w * 0.94], [w * 0.43, -w * 0.66]]), cols[0], 1), ol(poly([[w * 0.42, -w * 0.66], [w * 0.5, -w * 0.92], [w * 0.55, -w * 0.66]]), cols[2], 1));
  [box(-0.43, -0.31, 0.16, 0.52), box(-0.25, -0.13, 0.16, 0.5), box(0.13, 0.25, 0.16, 0.5), box(0.31, 0.43, 0.16, 0.52)].forEach(fringe);
  fringe(box(-0.46, 0.46, -0.18, 0.18));
  fringe({ y0: -w * 0.5, y1: -w * 0.18, xl: (y) => w * 0.18 + (-w * 0.18 - y) * 0.42, xr: (y) => w * 0.46 + (-w * 0.18 - y) * 0.3 });
  fringe(box(0.28, 0.76, -0.68, -0.46));
  out.push(ol(circle(w * 0.5, -w * 0.59, w * 0.036), C.white, 0.8, -0.4), sh(circle(w * 0.507, -w * 0.588, w * 0.018), C.ink), sh(ellipse(w * 0.71, -w * 0.53, w * 0.012, w * 0.018), C.ink, { opacity: 0.6 }));
  out.push(stroke(circle(0, -w * 0.21, w * 0.035), C.woodDk, 2));
  return out;
}

/** Wavy icing edge from x0..x1 hanging from y with drips of varying length. */
export function drip(x0: number, x1: number, y: number, depth: number, count: number, seed: number): string {
  const g = rng(seed), w = (x1 - x0) / count;
  let d = M(x0, y) + L(x1, y) + L(x1, y + depth * 0.5);
  for (let i = count - 1; i >= 0; i--) { const xa = x0 + i * w, dd = depth * g.range(0.6, 1.5); d += CB(xa + w, y + dd, xa + w * 0.5, y + dd * 1.3, xa + w * 0.5, y + depth * 0.5) + L(xa, y + depth * 0.5); }
  return d + 'Z';
}

/** Small strawberry; origin at its centre. */
export function strawberry(s: number): Shape[] {
  return [ol(M(0, s * 0.6) + CB(-s * 0.8, s * 0.1, -s * 0.7, -s * 0.6, 0, -s * 0.45) + CB(s * 0.7, -s * 0.6, s * 0.8, s * 0.1, 0, s * 0.6) + 'Z', C.red, 0.9, -0.3), sh(circle(-s * 0.2, 0, s * 0.05) + circle(s * 0.2, -s * 0.05, s * 0.05) + circle(0, s * 0.25, s * 0.05) + circle(0, -s * 0.2, s * 0.05), C.lemon), sh(star(0, -s * 0.48, s * 0.34, s * 0.12, 5), C.greenDk)];
}

/** Lit birthday candle standing on y = 0 at x. */
export function candle(x: number, h: number, col: string): Shape[] {
  let st = '';
  for (let y = -h * 0.8; y < -h * 0.1; y += h * 0.26) st += poly([[x - h * 0.07, y], [x + h * 0.07, y - h * 0.1], [x + h * 0.07, y], [x - h * 0.07, y + h * 0.1]]);
  return [sh(circle(x, -h * 1.22, h * 0.34), '#fff2b0', { opacity: 0.22 }), ol(rect(x - h * 0.07, -h, h * 0.14, h, 1), C.white, 0.8, -0.3), sh(st, col), stroke(line([[x, -h], [x, -h * 1.08]]), C.ink, 1), sh(leaf(x, -h * 1.06, h * 0.36, h * 0.12, -90), C.orange), sh(leaf(x, -h * 1.07, h * 0.22, h * 0.06, -90), C.lemon)];
}

/** Three-tier birthday cake on a stand with candles; w is the bottom tier's width. */
export function birthdayCake(w: number): Shape[] {
  const out: Shape[] = [];
  const by = -w * 0.26;
  out.push(shadow(0, 0, w * 0.36, w * 0.03), ol(ellipse(0, -w * 0.02, w * 0.26, w * 0.035), C.white, 1.1, -0.25), ol(poly([[-w * 0.06, by], [w * 0.06, by], [w * 0.14, -w * 0.03], [-w * 0.14, -w * 0.03]]), C.white, 1.1, -0.25), ol(ellipse(0, by, w * 0.64, w * 0.055), C.white, 1.2, -0.25), sh(ellipse(0, by - w * 0.01, w * 0.56, w * 0.035), shade(C.white, -0.1)));
  const tier = (tw: number, th: number, y: number, col: string, ic: string, seed: number, count: number) => {
    out.push(ol(rect(-tw / 2, y - th, tw, th, 7), col, 1.2, -0.28), sh(rect(tw * 0.28, y - th, tw * 0.22, th, 7), '#000000', { opacity: 0.07 }), hl(rect(-tw * 0.46, y - th * 0.8, tw * 0.04, th * 0.6, 2), 0.35));
    out.push(ol(drip(-tw / 2 - 2, tw / 2 + 2, y - th - 3, th * 0.26, count, seed), ic, 1, -0.2));
    let pb = '';
    const k = Math.round(tw / (w * 0.065));
    for (let i = 0; i <= k; i++) pb += circle(-tw / 2 + (i * tw) / k, y - w * 0.012, w * 0.026);
    out.push(...un(pb, C.white, 0.8, -0.2));
  };
  const y1 = by - w * 0.01, h1 = w * 0.3, h2 = w * 0.26, h3 = w * 0.22;
  tier(w, h1, y1, C.pink, C.white, 3, 9);
  let dots = '';
  for (let i = 0; i < 9; i++) dots += circle(-w * 0.4 + i * w * 0.1, y1 - h1 * 0.36 + (i % 2 ? w * 0.03 : 0), w * 0.017);
  out.push(sh(dots, C.lemon), sh(xf(dots, { x: w * 0.05, y: w * 0.05 }), C.teal, { opacity: 0.9 }));
  tier(w * 0.72, h2, y1 - h1, C.cream, C.hot, 5, 7);
  let zz = M(-w * 0.32, y1 - h1 - h2 * 0.3);
  for (let i = 1; i <= 12; i++) zz += L(-w * 0.32 + (i * w * 0.64) / 12, y1 - h1 - h2 * (i % 2 ? 0.46 : 0.3));
  out.push(stroke(zz, C.teal, w * 0.014), ...place(strawberry(w * 0.04), { x: -w * 0.43, y: y1 - h1 - w * 0.04 }), ...place(strawberry(w * 0.04), { x: w * 0.43, y: y1 - h1 - w * 0.04 }));
  tier(w * 0.46, h3, y1 - h1 - h2, C.mint, C.white, 8, 5);
  out.push(sh(heart(-w * 0.12, y1 - h1 - h2 - h3 * 0.36, w * 0.05) + heart(0, y1 - h1 - h2 - h3 * 0.36, w * 0.05) + heart(w * 0.12, y1 - h1 - h2 - h3 * 0.36, w * 0.05), C.hot));
  out.push(...place(strawberry(w * 0.04), { x: -w * 0.3, y: y1 - h1 - h2 - w * 0.04 }), ...place(strawberry(w * 0.04), { x: w * 0.3, y: y1 - h1 - h2 - w * 0.04 }));
  const top = y1 - h1 - h2 - h3 - 3;
  [C.hot, C.sky, C.orange, C.green, C.purple].forEach((c, i) => out.push(...place(candle(0, w * 0.13, c), { x: (i - 2) * w * 0.085, y: top })));
  return out;
}

/** Slice of layer cake on a plate, s wide. */
export function cakeSlice(s: number, icing = C.pink): Shape[] {
  return [
    shadow(0, 0, s * 0.6, s * 0.05), ol(ellipse(0, -s * 0.05, s * 0.62, s * 0.09), C.white, 1.1, -0.25), sh(ellipse(0, -s * 0.06, s * 0.44, s * 0.05), shade(C.white, -0.1)),
    ol(poly([[-s * 0.46, -s * 0.1], [s * 0.36, -s * 0.1], [s * 0.36, -s * 0.52], [-s * 0.46, -s * 0.52]]), '#f6dfa6', 1.1, -0.35), sh(rect(-s * 0.46, -s * 0.35, s * 0.82, s * 0.06), icing), sh(rect(-s * 0.46, -s * 0.21, s * 0.82, s * 0.035), C.cherry, { opacity: 0.8 }),
    ol(drip(-s * 0.48, s * 0.38, -s * 0.62, s * 0.1, 5, 4), icing, 1, -0.25), sh(rect(s * 0.22, -s * 0.5, s * 0.14, s * 0.4), '#000000', { opacity: 0.08 }), ...place(strawberry(s * 0.13), { x: -s * 0.05, y: -s * 0.7 }),
  ];
}

/** Glass jug of lemonade with lemon slices and ice, height h; handle on the right. */
export function lemonadePitcher(h: number): Shape[] {
  const w = h * 0.62;
  const body = M(-w * 0.6, -h * 0.98) + L(-w * 0.36, -h * 0.88) + L(w * 0.4, -h * 0.92) + Q(w * 0.5, -h * 0.4, w * 0.38, 0) + L(-w * 0.38, 0) + Q(-w * 0.5, -h * 0.4, -w * 0.4, -h * 0.84) + 'Z';
  const liq = M(-w * 0.43, -h * 0.68) + L(w * 0.43, -h * 0.68) + Q(w * 0.45, -h * 0.3, w * 0.35, -h * 0.03) + L(-w * 0.35, -h * 0.03) + Q(-w * 0.45, -h * 0.3, -w * 0.43, -h * 0.68) + 'Z';
  const hd = M(w * 0.42, -h * 0.78) + Q(w * 0.92, -h * 0.76, w * 0.84, -h * 0.46) + Q(w * 0.78, -h * 0.26, w * 0.44, -h * 0.24);
  const slice = (x: number, y: number, r: number): Shape[] => { let sg = ''; for (let i = 0; i < 6; i++) sg += line([[x, y], pol(x, y, i * 60, r * 0.78)]); return [ol(circle(x, y, r), C.lemon, 1, -0.3), sh(circle(x, y, r * 0.8), '#fbeea0'), stroke(sg, C.white, 1.1, { opacity: 0.9 })]; };
  return [
    shadow(0, 0, w * 0.44, h * 0.03), stroke(hd, C.glassLn, h * 0.075 + 2), stroke(hd, '#eaf6f7', h * 0.075),
    sh(body, C.glass, { opacity: 0.6 }), sh(liq, '#f9e27a'), sh(M(-w * 0.43, -h * 0.68) + L(w * 0.43, -h * 0.68) + L(w * 0.43, -h * 0.64) + L(-w * 0.43, -h * 0.64) + 'Z', '#fff3b0'),
    ...slice(-w * 0.14, -h * 0.4, h * 0.11), ...slice(w * 0.16, -h * 0.2, h * 0.1), ...slice(w * 0.2, -h * 0.56, h * 0.085),
    sh(xf(rect(-h * 0.06, -h * 0.06, h * 0.12, h * 0.12, 3), { rot: 15, x: -w * 0.2, y: -h * 0.14 }) + xf(rect(-h * 0.055, -h * 0.055, h * 0.11, h * 0.11, 3), { rot: -20, x: -w * 0.1, y: -h * 0.62 }), '#ffffff', { opacity: 0.6 }),
    sh(leaf(w * 0.02, -h * 0.7, h * 0.14, h * 0.045, -40) + leaf(w * 0.02, -h * 0.7, h * 0.12, h * 0.04, -120), C.greenDk),
    stroke(body, C.glassLn, 1.5), hl(M(-w * 0.36, -h * 0.8) + Q(-w * 0.42, -h * 0.4, -w * 0.32, -h * 0.1) + L(-w * 0.26, -h * 0.1) + Q(-w * 0.35, -h * 0.4, -w * 0.3, -h * 0.8) + 'Z', 0.55),
  ];
}

/** Tumbler of lemonade with a straw and a lemon wedge, height h. */
export function lemonadeGlass(h: number, strawCol = C.teal): Shape[] {
  const gl = poly([[-h * 0.24, -h], [h * 0.24, -h], [h * 0.18, 0], [-h * 0.18, 0]]);
  return [
    ...straw(-h * 0.04, -h * 0.2, h * 0.16, -h * 1.34, h * 0.06, strawCol), sh(gl, C.glass, { opacity: 0.6 }), sh(poly([[-h * 0.22, -h * 0.78], [h * 0.22, -h * 0.78], [h * 0.17, -h * 0.04], [-h * 0.17, -h * 0.04]]), '#f9e27a'),
    sh(xf(rect(-h * 0.07, -h * 0.07, h * 0.14, h * 0.14, 2), { rot: 20, x: -h * 0.03, y: -h * 0.62 }), '#ffffff', { opacity: 0.55 }), stroke(gl, C.glassLn, 1.3), hl(poly([[-h * 0.19, -h * 0.9], [-h * 0.14, -h * 0.9], [-h * 0.11, -h * 0.12], [-h * 0.15, -h * 0.12]]), 0.5),
    ol(M(-h * 0.36, -h * 1.02) + Q(-h * 0.36, -h * 1.26, -h * 0.12, -h * 1.26) + Q(-h * 0.2, -h * 1.02, -h * 0.36, -h * 1.02) + 'Z', C.lemon, 1, -0.3),
  ];
}

/** Party blower with a curled end, w long; origin at its centre. */
export function partyBlower(w: number, col = C.hot, col2 = C.lemon): Shape[] {
  const pts: Pt[] = [];
  for (let a = 0; a <= 560; a += 30) pts.push(pol(w * 0.3, -w * 0.12, 90 - a, w * 0.19 * (1 - a / 760)));
  let st = '';
  for (let i = 0; i < 5; i++) st += poly([[-w * 0.36 + i * w * 0.11, -w * 0.065], [-w * 0.31 + i * w * 0.11, -w * 0.065], [-w * 0.27 + i * w * 0.11, w * 0.065], [-w * 0.32 + i * w * 0.11, w * 0.065]]);
  return [
    stroke(line(pts), shade(col, -0.3), w * 0.1 + 2), stroke(line(pts), col, w * 0.1), stroke(line(pts.filter((_, i) => i % 3 !== 2)), col2, w * 0.028, { opacity: 0.9 }),
    ol(rect(-w * 0.4, -w * 0.065, w * 0.72, w * 0.13, 2), col, 1, -0.3), sh(st, col2), ol(poly([[-w * 0.52, -w * 0.035], [-w * 0.4, -w * 0.05], [-w * 0.4, w * 0.05], [-w * 0.52, w * 0.035]]), C.white, 1, -0.3),
  ];
}

/** Party popper mid-pop: a cone standing on its tip with a burst of confetti, height h. */
export function partyPopper(h: number, col = C.purple): Shape[] {
  const out: Shape[] = [];
  const wAt = (t: number) => h * 0.19 * t;
  let bands = '';
  for (let t = 0.2; t < 0.95; t += 0.3) bands += poly([[-wAt(t), -h * 0.5 * t], [wAt(t), -h * 0.5 * t], [wAt(t + 0.14), -h * 0.5 * (t + 0.14)], [-wAt(t + 0.14), -h * 0.5 * (t + 0.14)]]);
  out.push(stroke(curve([[0, -h * 0.5], [-h * 0.2, -h * 0.7], [-h * 0.12, -h * 0.84], [-h * 0.26, -h * 0.96]]), C.hot, h * 0.035), stroke(curve([[0, -h * 0.5], [h * 0.14, -h * 0.72], [h * 0.06, -h * 0.86], [h * 0.22, -h]]), C.teal, h * 0.035), stroke(curve([[0, -h * 0.5], [h * 0.02, -h * 0.66], [-h * 0.03, -h * 0.8]]), C.lemon, h * 0.035));
  out.push(ol(poly([[0, 0], [-h * 0.19, -h * 0.5], [h * 0.19, -h * 0.5]]), col, 1.1, -0.3), sh(bands, C.lemon), ol(ellipse(0, -h * 0.5, h * 0.19, h * 0.045), shade(col, -0.3), 1));
  out.push(...confetti(-h * 0.34, -h * 1.02, h * 0.68, h * 0.44, 16, [C.hot, C.lemon, C.teal, C.orange, C.sky], Math.round(h), h * 0.05), sh(star(-h * 0.2, -h * 0.74, h * 0.05, h * 0.022) + star(h * 0.26, -h * 0.8, h * 0.045, h * 0.02), C.brass));
  return out;
}

/** Gold paper crown with jewels, w wide. */
export function paperCrown(w: number, col = '#f2c84b'): Shape[] {
  const d = poly([[-w * 0.5, 0], [w * 0.5, 0], [w * 0.5, -w * 0.5], [w * 0.26, -w * 0.28], [0, -w * 0.58], [-w * 0.26, -w * 0.28], [-w * 0.5, -w * 0.5]]);
  return [
    ol(d, col, 1.2, -0.35), sh(rect(-w * 0.5, -w * 0.14, w, w * 0.14), shade(col, -0.14)), hl(poly([[-w * 0.46, -w * 0.4], [-w * 0.4, -w * 0.34], [-w * 0.4, -w * 0.16], [-w * 0.46, -w * 0.16]]), 0.4),
    ol(circle(0, -w * 0.07, w * 0.045), C.cherry, 0.8), ol(circle(-w * 0.28, -w * 0.07, w * 0.04), C.teal, 0.8), ol(circle(w * 0.28, -w * 0.07, w * 0.04), C.teal, 0.8),
    ol(circle(0, -w * 0.58, w * 0.045), C.hot, 0.8), ol(circle(-w * 0.5, -w * 0.5, w * 0.04), C.hot, 0.8), ol(circle(w * 0.5, -w * 0.5, w * 0.04), C.hot, 0.8),
  ];
}

/** Compact camera with a wrist strap, w wide. */
export function camera(w: number, col = C.mint): Shape[] {
  return [
    stroke(curve([[-w * 0.5, -w * 0.46], [-w * 0.72, -w * 0.3], [-w * 0.66, -w * 0.06], [-w * 0.5, -w * 0.04]]), C.ink, w * 0.035), shadow(0, 0, w * 0.5, w * 0.035),
    ol(rect(-w * 0.2, -w * 0.74, w * 0.4, w * 0.16, 4), shade(col, -0.2), 1.1, -0.35), ol(rect(-w * 0.42, -w * 0.69, w * 0.14, w * 0.08, 2), C.red, 0.9),
    ol(rect(-w / 2, -w * 0.62, w, w * 0.62, w * 0.08), col, 1.3, -0.35), sh(rect(-w / 2, -w * 0.2, w, w * 0.11), shade(col, -0.25)), hl(rect(-w * 0.44, -w * 0.58, w * 0.3, w * 0.03, 2), 0.5),
    ol(circle(0, -w * 0.31, w * 0.22), C.chromeLt, 1.1, -0.45), ol(circle(0, -w * 0.31, w * 0.17), C.ink, 1), sh(circle(0, -w * 0.31, w * 0.11), '#4a6a9a'), hl(circle(-w * 0.05, -w * 0.36, w * 0.04), 0.7),
    ol(rect(w * 0.24, -w * 0.56, w * 0.18, w * 0.11, 2), C.cream, 0.9, -0.35), ol(circle(-w * 0.34, -w * 0.48, w * 0.035), C.ink, 0.8),
  ];
}

/** Sitting cat in a party hat, height h (to the top of the head). */
export function partyCat(h: number, col = '#e8a45a', hat = C.purple): Shape[] {
  const d = poly([[-h * 0.2, -h * 0.84], [-h * 0.23, -h * 1.02], [-h * 0.07, -h * 0.94]]) + poly([[h * 0.2, -h * 0.84], [h * 0.23, -h * 1.02], [h * 0.07, -h * 0.94]]) + ellipse(0, -h * 0.76, h * 0.23, h * 0.2) + ellipse(0, -h * 0.3, h * 0.25, h * 0.31) + ellipse(-h * 0.11, -h * 0.05, h * 0.1, h * 0.06) + ellipse(h * 0.11, -h * 0.05, h * 0.1, h * 0.06);
  const tail = M(h * 0.2, -h * 0.08) + Q(h * 0.5, -h * 0.04, h * 0.46, -h * 0.34);
  return [
    shadow(0, 0, h * 0.34, h * 0.035), stroke(tail, shade(col, -0.35), h * 0.1 + 2.2), stroke(tail, col, h * 0.1), ...un(d, col, 1.2, -0.35),
    sh(ellipse(0, -h * 0.3, h * 0.13, h * 0.2) + ellipse(0, -h * 0.69, h * 0.11, h * 0.08), C.cream), stroke(line([[-h * 0.16, -h * 0.86], [-h * 0.12, -h * 0.94]]) + line([[0, -h * 0.88], [0, -h * 0.95]]) + line([[h * 0.16, -h * 0.86], [h * 0.12, -h * 0.94]]), shade(col, -0.3), h * 0.025),
    stroke(M(-h * 0.14, -h * 0.78) + Q(-h * 0.09, -h * 0.83, -h * 0.05, -h * 0.78) + M(h * 0.05, -h * 0.78) + Q(h * 0.09, -h * 0.83, h * 0.14, -h * 0.78) + M(-h * 0.04, -h * 0.68) + Q(0, -h * 0.65, 0, -h * 0.7) + Q(0, -h * 0.65, h * 0.04, -h * 0.68), C.ink, 1.4),
    sh(poly([[-h * 0.025, -h * 0.73], [h * 0.025, -h * 0.73], [0, -h * 0.7]]), C.hot), stroke(line([[-h * 0.1, -h * 0.71], [-h * 0.3, -h * 0.74]]) + line([[-h * 0.1, -h * 0.69], [-h * 0.3, -h * 0.67]]) + line([[h * 0.1, -h * 0.71], [h * 0.3, -h * 0.74]]) + line([[h * 0.1, -h * 0.69], [h * 0.3, -h * 0.67]]), C.white, 1),
    ...place(partyHat(h * 0.3, hat, C.lemon, 'dots'), { x: 0, y: -h * 0.93, rot: -8 }),
  ];
}

/** Striped box of popcorn, height h. */
export function popcornBox(h: number, col = C.red): Shape[] {
  const g = rng(17), wt = h * 0.24, wb = h * 0.17;
  let st = '', pc = '', pc2 = '';
  for (let i = 0; i < 5; i += 2) { const t0 = i / 5, t1 = (i + 1) / 5; st += poly([[-wb + wb * 2 * t0, 0], [-wb + wb * 2 * t1, 0], [-wt + wt * 2 * t1, -h * 0.62], [-wt + wt * 2 * t0, -h * 0.62]]); }
  for (let i = 0; i < 16; i++) { const d = circle(g.range(-wt * 0.95, wt * 0.95), -h * g.range(0.6, 0.86), h * g.range(0.05, 0.075)); if (i % 3) pc += d; else pc2 += d; }
  return [shadow(0, 0, wb * 1.2, h * 0.03), ...un(pc + pc2, '#fbeeb8', 1, -0.3), sh(pc2, '#f6d870'), ol(poly([[-wt, -h * 0.62], [wt, -h * 0.62], [wb, 0], [-wb, 0]]), C.white, 1.1, -0.3), sh(st, col), sh(poly([[wt * 0.4, -h * 0.62], [wt, -h * 0.62], [wb, 0], [wb * 0.4, 0]]), '#000000', { opacity: 0.08 })];
}

/** Toy rocket standing on its fins, height h. */
export function toyRocket(h: number, col = C.red): Shape[] {
  const body = M(0, -h) + Q(h * 0.2, -h * 0.78, h * 0.16, -h * 0.22) + L(-h * 0.16, -h * 0.22) + Q(-h * 0.2, -h * 0.78, 0, -h) + 'Z';
  const nose = M(0, -h) + Q(h * 0.13, -h * 0.88, h * 0.165, -h * 0.72) + L(-h * 0.165, -h * 0.72) + Q(-h * 0.13, -h * 0.88, 0, -h) + 'Z';
  return [
    shadow(0, 0, h * 0.3, h * 0.03), ol(poly([[-h * 0.15, -h * 0.5], [-h * 0.33, 0], [-h * 0.14, -h * 0.2]]) + poly([[h * 0.15, -h * 0.5], [h * 0.33, 0], [h * 0.14, -h * 0.2]]), col, 1.1, -0.3), ol(rect(-h * 0.1, -h * 0.24, h * 0.2, h * 0.1, 2), C.chromeDk, 1),
    ol(body, C.white, 1.2, -0.3), sh(M(h * 0.05, -h * 0.72) + L(h * 0.175, -h * 0.72) + L(h * 0.16, -h * 0.22) + L(h * 0.06, -h * 0.22) + 'Z', '#000000', { opacity: 0.07 }), ol(nose, col, 1.1, -0.3), sh(rect(-h * 0.168, -h * 0.34, h * 0.336, h * 0.06), C.blue),
    ol(circle(0, -h * 0.55, h * 0.085), C.chrome, 1, -0.4), sh(circle(0, -h * 0.55, h * 0.058), C.sky), hl(circle(-h * 0.02, -h * 0.57, h * 0.02), 0.8), ol(poly([[-h * 0.03, -h * 0.34], [h * 0.03, -h * 0.34], [h * 0.02, 0], [-h * 0.02, 0]]), shade(col, -0.1), 1),
  ];
}

/** Paper cup with dots, height h. */
export function paperCup(h: number, col: string, dot = C.white): Shape[] {
  return [ol(poly([[-h * 0.34, -h], [h * 0.34, -h], [h * 0.24, 0], [-h * 0.24, 0]]), col, 1, -0.3), sh(circle(-h * 0.12, -h * 0.7, h * 0.05) + circle(h * 0.12, -h * 0.7, h * 0.05) + circle(0, -h * 0.45, h * 0.05) + circle(-h * 0.12, -h * 0.22, h * 0.05) + circle(h * 0.12, -h * 0.22, h * 0.05), dot, { opacity: 0.85 }), ol(rect(-h * 0.37, -h * 1.03, h * 0.74, h * 0.09, 2), shade(col, 0.2), 0.9, -0.35)];
}

/** Paper plate seen at an angle; origin at its centre. */
export function plate(r: number, col = C.white, rim = C.pink): Shape[] {
  return [sh(ellipse(0, r * 0.08, r, r * 0.26), '#000000', { opacity: 0.12 }), ol(ellipse(0, 0, r, r * 0.26), col, 1, -0.25), stroke(ellipse(0, 0, r * 0.82, r * 0.2), rim, r * 0.07), sh(ellipse(0, r * 0.01, r * 0.6, r * 0.14), shade(col, -0.06))];
}

/** Gift bag with rope handles and tissue paper, height h. */
export function giftBag(h: number, col: string, tissue = C.white): Shape[] {
  const w = h * 0.66;
  return [
    shadow(0, 0, w * 0.54, h * 0.035), ol(poly([[-w * 0.36, -h * 0.72], [-w * 0.2, -h * 0.92], [-w * 0.04, -h * 0.76], [w * 0.14, -h * 0.94], [w * 0.36, -h * 0.72]]), tissue, 0.9, -0.2),
    ol(rect(-w / 2, -h * 0.76, w, h * 0.76, 2), col, 1.2, -0.3), sh(rect(w * 0.3, -h * 0.76, w * 0.2, h * 0.76, 2), '#000000', { opacity: 0.1 }), sh(heart(0, -h * 0.38, h * 0.26), C.white, { opacity: 0.85 }),
    stroke(M(-w * 0.26, -h * 0.74) + Q(-w * 0.24, -h * 1.02, 0, -h * 1.0) + Q(w * 0.24, -h * 1.02, w * 0.26, -h * 0.74), shade(col, -0.4), 2),
  ];
}

void mix;

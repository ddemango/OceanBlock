// Shared props for the Under the Sea hidden-object scenes. Most props are
// designed in a 100-unit box around the origin and scaled with `s`; each
// returns Shape[] to be positioned with place().
import { rect, ellipse, circle, poly, line, curve, blob, leaf, petal, star, sector, sh, stroke, shade, rng, xf, place } from '../../art/kit';
import type { Pt } from '../../art/geometry';
import type { Shape } from '../../art/types';

const n = (v: number) => String(Math.round(v * 10) / 10);
export const M = (x: number, y: number) => `M${n(x)} ${n(y)}`;
export const L = (x: number, y: number) => `L${n(x)} ${n(y)}`;
export const Q = (cx: number, cy: number, x: number, y: number) => `Q${n(cx)} ${n(cy)} ${n(x)} ${n(y)}`;
export const C = (a: number, b: number, c: number, d: number, x: number, y: number) => `C${n(a)} ${n(b)} ${n(c)} ${n(d)} ${n(x)} ${n(y)}`;

/** Filled shape with a darker outline of the same hue. */
export const ol = (d: string, fill: string, w = 1, amt = -0.3): Shape => sh(d, fill, { stroke: shade(fill, amt), strokeWidth: w });
export const hl = (d: string, op = 0.5): Shape => sh(d, '#ffffff', { opacity: op });
export const shadow = (cx: number, cy: number, rx: number, ry: number, op = 0.2, col = '#12303f'): Shape => sh(ellipse(cx, cy, rx, ry), col, { opacity: op });

const RAD = Math.PI / 180;
export const pp = (cx: number, cy: number, r: number, deg: number): Pt => [cx + Math.cos(deg * RAD) * r, cy + Math.sin(deg * RAD) * r];
const fit = (shapes: Shape[], s: number) => place(shapes.filter((p) => p.d), { s: s / 100 });

/** Sample a smooth (Catmull-Rom) curve through the points. */
export function smooth(pts: Pt[], per = 6): Pt[] {
  const out: Pt[] = [];
  const at = (i: number) => pts[Math.max(0, Math.min(pts.length - 1, i))];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    for (let k = 0; k < per; k++) {
      const t = k / per, t2 = t * t, t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

/** A filled ribbon following a smooth centre line; `ws` are widths spread evenly along it. Round tip. */
export function tube(pts: Pt[], ws: number[], per = 6): string {
  const c = smooth(pts, per), m = c.length;
  const Ls: Pt[] = [], Rs: Pt[] = [];
  const wAt = (i: number) => {
    const t = (i / (m - 1)) * (ws.length - 1), k = Math.min(ws.length - 2, Math.floor(t)), f = t - k;
    return (ws[k] + (ws[k + 1] - ws[k]) * f) / 2;
  };
  let nx = 0, ny = 0, dx = 1, dy = 0;
  for (let i = 0; i < m; i++) {
    const a = c[Math.max(0, i - 1)], b = c[Math.min(m - 1, i + 1)];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    dx = (b[0] - a[0]) / len; dy = (b[1] - a[1]) / len;
    nx = -dy; ny = dx;
    const w = wAt(i);
    Ls.push([c[i][0] + nx * w, c[i][1] + ny * w]);
    Rs.push([c[i][0] - nx * w, c[i][1] - ny * w]);
  }
  const tip = c[m - 1], w = ws[ws.length - 1] / 2, cap: Pt[] = [];
  for (const a of [30, 60, 90, 120, 150]) cap.push([tip[0] + nx * w * Math.cos(a * RAD) + dx * w * Math.sin(a * RAD), tip[1] + ny * w * Math.cos(a * RAD) + dy * w * Math.sin(a * RAD)]);
  return poly([...Ls, ...cap, ...Rs.reverse()]);
}
export const taper = (pts: Pt[], w0: number, w1: number, per = 5) => tube(pts, [w0, w1], per);

const eye = (x: number, y: number, r: number): Shape[] => [
  sh(circle(x, y, r), '#ffffff'), sh(circle(x + r * 0.15, y, r * 0.58), '#2b2a33'), sh(circle(x + r * 0.38, y - r * 0.3, r * 0.2), '#ffffff'),
];

// =====================================================================
// water, sand and rock
// =====================================================================
/** Rising bubbles scattered in a column `w` wide and `h` tall above the origin. */
export function bubbles(seed: number, count: number, w: number, h: number, rMin = 3, rMax = 9): Shape[] {
  const g = rng(seed);
  let fills = '', glints = '';
  for (let i = 0; i < count; i++) {
    const x = g.range(-w / 2, w / 2), y = -g.range(0, h), r = g.range(rMin, rMax);
    fills += circle(x, y, r);
    glints += ellipse(x - r * 0.35, y - r * 0.35, r * 0.28, r * 0.18, -40);
  }
  return [sh(fills, '#ffffff', { opacity: 0.16 }), stroke(fills, '#ffffff', 1.1, { opacity: 0.75 }), sh(glints, '#ffffff', { opacity: 0.9 })];
}

/** A boulder; origin bottom-centre. */
export function rock(seed: number, w: number, h: number, col: string): Shape[] {
  const g = rng(seed);
  const top: Pt[] = [];
  const k = 6;
  for (let i = 0; i <= k; i++) {
    const t = i / k;
    top.push([-w / 2 + w * t + (i && i < k ? g.range(-w * 0.04, w * 0.04) : 0), -h * Math.pow(Math.sin(Math.PI * (0.08 + t * 0.84)), 0.7) * g.range(0.8, 1.05)]);
  }
  const body = blob([...top, [w * 0.36, h * 0.06], [-w * 0.36, h * 0.06]], 0.55);
  const facet = blob([top[1], top[2], top[3], [top[3][0] - w * 0.04, top[3][1] * 0.45], [top[1][0] + w * 0.08, top[1][1] * 0.35]], 0.5);
  const dark = blob([top[4], top[5], top[6], [w * 0.3, h * 0.04], [top[4][0] - w * 0.06, top[4][1] * 0.35]], 0.5);
  let specks = '', cracks = '';
  for (let i = 0; i < 7; i++) specks += circle(g.range(-w * 0.34, w * 0.34), -g.range(h * 0.08, h * 0.5), g.range(1, 2.4));
  for (let i = 0; i < 2; i++) { const x = g.range(-w * 0.25, w * 0.25); cracks += curve([[x, -h * 0.62], [x + g.range(-8, 8), -h * 0.4], [x + g.range(-10, 10), -h * 0.14]]); }
  return [sh(body, col), sh(facet, shade(col, 0.14)), sh(dark, shade(col, -0.14)), stroke(cracks, shade(col, -0.3), 1.2, { opacity: 0.6 }), sh(specks, shade(col, -0.28), { opacity: 0.55 })];
}

/** Scattered pebbles in a `w` × `h` box centred on the origin. */
export function pebbles(seed: number, count: number, w: number, h: number, cols: string[], size = 5): Shape[] {
  const g = rng(seed);
  const by = cols.map(() => '');
  let hls = '';
  for (let i = 0; i < count; i++) {
    const x = g.range(-w / 2, w / 2), y = g.range(-h / 2, h / 2), r = size * g.range(0.5, 1.3), a = g.range(-30, 30);
    by[g.int(0, cols.length - 1)] += ellipse(x, y, r, r * 0.62, a);
    if (g.next() < 0.5) hls += ellipse(x - r * 0.2, y - r * 0.2, r * 0.35, r * 0.16, a);
  }
  return [...cols.map((c, i) => sh(by[i], c)), sh(hls, '#ffffff', { opacity: 0.4 })].filter((p) => p.d);
}

// =====================================================================
// corals and plants (origin at the base, growing up)
// =====================================================================
/** Branching staghorn coral about `h` tall. */
export function branchCoral(seed: number, h: number, col: string): Shape[] {
  const g = rng(seed);
  const lv = ['', '', '', ''];
  let tips = '';
  const grow = (x: number, y: number, a: number, len: number, d: number) => {
    const [x2, y2] = pp(x, y, len, a);
    lv[d] += line([[x, y], [x2, y2]]);
    if (d === 3) { tips += circle(x2, y2, 2.3); return; }
    const k = d === 0 ? 3 : 2;
    for (let i = 0; i < k; i++) grow(x2, y2, a + (i - (k - 1) / 2) * g.range(34, 52) + g.range(-10, 10), len * g.range(0.62, 0.82), d + 1);
  };
  for (const a of [-120, -90, -60]) grow(g.range(-5, 5), 0, a + g.range(-8, 8), g.range(26, 34), 0);
  const w = [9.5, 7, 5, 3.8];
  const out: Shape[] = [sh(ellipse(0, 0, 20, 6), shade(col, -0.35))];
  lv.forEach((d, i) => out.push(stroke(d, shade(col, -0.2 + i * 0.08), w[i])));
  out.push(stroke(xf(lv[0] + lv[1], { x: -1.6, y: -0.6 }), shade(col, 0.2), 2, { opacity: 0.7 }), stroke(xf(lv[2] + lv[3], { x: -0.9, y: -0.4 }), shade(col, 0.3), 1.2, { opacity: 0.8 }), sh(tips, shade(col, 0.45)));
  return fit(out, h);
}

/** Domed brain coral `w` wide. */
export function brainCoral(seed: number, w: number, col: string): Shape[] {
  const g = rng(seed);
  const dome = M(-50, 0) + C(-52, -62, 52, -62, 50, 0) + 'Z';
  let sq = '';
  for (let k = 0; k < 6; k++) {
    const y = -6 - k * 7, hw = 48 * Math.sqrt(Math.max(0, 1 - Math.pow(y / 47, 2))) - 4;
    const steps = Math.max(3, Math.round(hw / 5));
    const pts: Pt[] = [];
    for (let i = 0; i <= steps; i++) pts.push([-hw + (2 * hw * i) / steps, y + (i % 2 ? -2.6 : 2.6) + g.range(-0.8, 0.8)]);
    sq += curve(pts);
  }
  return fit([
    shadow(0, 1, 54, 6, 0.22), sh(dome, col), sh(M(-50, 0) + C(-30, -9, 30, -9, 50, 0) + 'Z', shade(col, -0.18)),
    stroke(sq, shade(col, -0.3), 2.4), stroke(xf(sq, { y: -1.7 }), shade(col, 0.25), 1), hl(ellipse(-18, -31, 12, 6, -25), 0.28),
  ], w);
}

/** Lacy sea fan about `h` tall. */
export function fanCoral(seed: number, h: number, col: string): Shape[] {
  const g = rng(seed);
  const lv = ['', ''];
  let tips = '';
  const grow = (x: number, y: number, a: number, len: number, d: number) => {
    const [x2, y2] = pp(x, y, len, a);
    lv[d < 2 ? 0 : 1] += line([[x, y], [x2, y2]]);
    if (d === 4) { tips += circle(x2, y2, 1.5); return; }
    for (let i = 0; i < 2; i++) grow(x2, y2, a + (i ? 1 : -1) * g.range(10, 22), len * g.range(0.66, 0.8), d + 1);
  };
  for (let i = 0; i < 6; i++) grow(0, -6, -152 + i * 25 + g.range(-4, 4), g.range(28, 34), 0);
  return fit([
    sh(sector(0, -4, 88, -165, -15), col, { opacity: 0.2 }), sh(rect(-3.5, -10, 7, 12, 2), shade(col, -0.35)),
    stroke(lv[0], shade(col, -0.18), 3.4), stroke(lv[1], col, 1.7), sh(tips, shade(col, 0.4)),
  ], h);
}

/** Cluster of tube sponges, the tallest about `h`. */
export function tubeSponge(seed: number, count: number, h: number, col: string): Shape[] {
  const g = rng(seed);
  let bodies = '', sides = '', rims = '', holes = '', dots = '';
  for (let i = 0; i < count; i++) {
    const c = i - (count - 1) / 2;
    const x = c * 24 + g.range(-4, 4), hh = g.range(55, 100), w = g.range(20, 28);
    const t = { rot: c * g.range(5, 10), ox: x, oy: 0 };
    bodies += xf(M(x - w * 0.32, 0) + L(x - w / 2, -hh) + L(x + w / 2, -hh) + L(x + w * 0.32, 0) + Q(x, 6, x - w * 0.32, 0) + 'Z', t);
    sides += xf(poly([[x + w * 0.14, -hh], [x + w / 2, -hh], [x + w * 0.32, 0], [x + w * 0.1, 0]]), t);
    rims += xf(ellipse(x, -hh, w / 2 + 1, w * 0.2), t);
    holes += xf(ellipse(x, -hh, w * 0.36, w * 0.12), t);
    for (let k = 0; k < 6; k++) dots += xf(circle(x + g.range(-w * 0.32, w * 0.06), -g.range(8, hh - 10), g.range(1.2, 2.2)), t);
  }
  return fit([sh(bodies, col), sh(sides, shade(col, -0.16)), sh(dots, shade(col, -0.32), { opacity: 0.6 }), sh(rims, shade(col, 0.28)), sh(holes, shade(col, -0.55))], h);
}

/** Flat table coral on a stalk, `w` wide. */
export function tableCoral(seed: number, w: number, col: string): Shape[] {
  const g = rng(seed);
  let dots = '';
  for (let i = 0; i < 22; i++) { const a = g.range(0, 360), r = Math.sqrt(g.next()) * 40; dots += ellipse(Math.cos(a * RAD) * r, -28 + Math.sin(a * RAD) * r * 0.16, 2.2, 1); }
  return fit([
    sh(poly([[-8, 0], [8, 0], [15, -22], [-15, -22]]), shade(col, -0.4)), sh(ellipse(0, -21, 50, 10), shade(col, -0.25)),
    sh(ellipse(0, -27, 50, 10), col), sh(ellipse(0, -28.5, 43, 7), shade(col, 0.16)), sh(dots, shade(col, -0.2)),
  ], w);
}

/** Mound of rounded coral lobes, `w` wide. */
export function bubbleCoral(seed: number, w: number, col: string): Shape[] {
  const g = rng(seed);
  const lobes: [number, number, number][] = [];
  for (let i = 0; i < 12; i++) { const a = 180 + g.range(8, 172), r = g.range(4, 34); lobes.push([Math.cos(a * RAD) * r * 1.15, Math.sin(a * RAD) * r * 0.85 - 10, g.range(11, 17)]); }
  lobes.sort((p, q) => p[1] - q[1]);
  let back = '', front = '', hls = '', mouths = '';
  lobes.forEach(([x, y, r], i) => {
    if (i % 2) front += circle(x, y, r); else back += circle(x, y, r);
    hls += ellipse(x - r * 0.3, y - r * 0.35, r * 0.34, r * 0.2, -30);
    mouths += circle(x + r * 0.1, y + r * 0.1, r * 0.14);
  });
  return fit([shadow(0, 2, 52, 6, 0.22), sh(ellipse(0, -6, 44, 12), shade(col, -0.3)), sh(back, shade(col, -0.12)), sh(front, col), sh(mouths, shade(col, -0.4)), hl(hls, 0.4)], w);
}

/** Finger coral: a fan of rounded fingers about `h` tall. */
export function fingerCoral(seed: number, count: number, h: number, col: string): Shape[] {
  const g = rng(seed);
  let back = '', front = '', lines = '';
  for (let i = 0; i < count; i++) {
    const c = i - (count - 1) / 2, a = -90 + c * g.range(13, 19), len = g.range(60, 98);
    const b: Pt = [c * 7, 0], t = pp(b[0], 0, len, a), mid = pp(b[0], 0, len * 0.5, a - c * 3);
    const d = tube([b, mid, t], [15, 13, 12], 4);
    if (i % 2) front += d; else back += d;
    lines += line([pp(b[0] - 2, 0, len * 0.2, a), pp(b[0] - 2, 0, len * 0.86, a)]);
  }
  return fit([sh(ellipse(0, 0, 26, 7), shade(col, -0.35)), sh(back, shade(col, -0.16)), sh(front, col), stroke(lines, shade(col, 0.3), 2.2, { opacity: 0.7 })], h);
}

/** Sea anemone `w` wide with coloured tentacle tips. */
export function anemone(seed: number, w: number, col: string, tip: string): Shape[] {
  const g = rng(seed);
  let back = '', front = '', tips = '';
  for (let i = 0; i < 17; i++) {
    const t = i / 16 - 0.5, len = g.range(34, 54), sway = g.range(-8, 8);
    const end: Pt = [t * 76 + sway + t * 14, -10 - len * (1 - Math.abs(t) * 0.5)];
    const d = taper([[t * 36, -8], [t * 58 + sway * 0.3, -10 - len * 0.5], end], 8, 5, 4);
    if (i % 2) front += d; else back += d;
    tips += circle(end[0], end[1], 3.6);
  }
  return fit([
    sh(back, shade(col, -0.18)), sh(M(-32, 0) + C(-36, -27, 36, -27, 32, 0) + 'Z', shade(col, -0.32)), sh(ellipse(0, -16, 22, 5), shade(col, -0.45)),
    sh(front, col), sh(tips, tip),
  ], w);
}

/** Tall kelp strand `h` high with alternating leaves `lf` long. */
export function kelp(seed: number, h: number, col: string, lf = 44): Shape[] {
  const g = rng(seed);
  const k = Math.max(4, Math.round(h / 70));
  const pts: Pt[] = [];
  for (let i = 0; i <= k; i++) pts.push([i ? Math.sin(i * 1.3 + seed) * 14 : 0, (-h * i) / k]);
  const c = smooth(pts, 5);
  let la = '', lb = '', bulbs = '';
  c.forEach(([x, y], i) => {
    if (i < 2) return;
    const side = i % 2 ? 1 : -1, len = lf * g.range(0.75, 1.15) * (1 - (i / c.length) * 0.35);
    const d = leaf(x, y, len, len * 0.2, -90 + side * g.range(48, 72));
    if (i % 4 < 2) la += d; else lb += d;
    bulbs += circle(x + side * 2.5, y - 1, 2.6);
  });
  return [stroke(curve(pts), shade(col, -0.28), 4.5), sh(la, col), sh(lb, shade(col, 0.14)), sh(bulbs, shade(col, 0.3))];
}

/** Clump of sea grass blades. */
export function seagrass(seed: number, w: number, h: number, col: string, count = 9): Shape[] {
  const g = rng(seed);
  let a = '', b = '';
  for (let i = 0; i < count; i++) {
    const x = g.range(-w / 2, w / 2), hh = h * g.range(0.55, 1), lean = g.range(-h * 0.25, h * 0.25);
    const d = taper([[x, 0], [x + lean * 0.3, -hh * 0.5], [x + lean, -hh]], 5.5, 1.6, 4);
    if (i % 2) a += d; else b += d;
  }
  return [sh(b, shade(col, -0.16)), sh(a, col)];
}

// =====================================================================
// fish (facing right, about `s` long)
// =====================================================================
const band = (x0: number, x1: number, rx: number, ry: number): string => {
  const hy = (x: number) => ry * Math.sqrt(Math.max(0, 1 - (x / rx) * (x / rx))) * 0.985;
  const xs = [0, 0.25, 0.5, 0.75, 1].map((t) => x0 + (x1 - x0) * t);
  return poly([...xs.map((x): Pt => [x, -hy(x)]), ...xs.reverse().map((x): Pt => [x, hy(x)])]);
};

export type FishKind = 'oval' | 'angel' | 'butterfly' | 'tang' | 'slim' | 'round' | 'parrot';

export function fish(kind: FishKind, s: number, c1: string, c2: string, c3 = '#ffffff'): Shape[] {
  const dk = shade(c1, -0.35);
  let out: Shape[];
  if (kind === 'oval') {
    out = [
      sh(blob([[-34, 0], [-58, -21], [-51, 0], [-58, 21]], 0.5), c2), sh(M(-22, -19) + Q(-6, -42, 24, -20) + 'Z' + M(-18, 19) + Q(-4, 36, 12, 21) + 'Z', c2),
      sh(ellipse(0, 0, 40, 24), c1), sh(ellipse(3, 9, 30, 11), shade(c1, 0.3), { opacity: 0.55 }),
      sh(band(-24, -13, 40, 24) + band(-3, 8, 40, 24), c3), sh(leaf(10, 5, 17, 5, 150), dk, { opacity: 0.7 }),
      ...eye(25, -5, 5.2), stroke(line([[39, 4], [33, 6]]), dk, 1.4),
    ];
  } else if (kind === 'angel') {
    out = [
      sh(M(2, -28) + Q(-18, -72, -54, -64) + Q(-30, -42, -24, -18) + 'Z' + M(2, 28) + Q(-18, 72, -54, 64) + Q(-30, 42, -24, 18) + 'Z', shade(c1, -0.12)),
      sh(M(-27, 0) + L(-50, -17) + Q(-44, 0, -50, 17) + 'Z', c2), sh(leaf(12, 24, 44, 3, 112), c2),
      sh(blob([[39, 0], [20, -25], [-6, -34], [-27, -17], [-32, 0], [-27, 17], [-6, 34], [20, 25]], 0.9), c1),
      sh(poly([[7, -29], [14, -27], [14, 27], [7, 29]]) + poly([[-17, -29], [-9, -33], [-9, 33], [-17, 29]]) + poly([[24, -19], [29, -14], [29, 14], [24, 19]]), c3),
      sh(M(2, -28) + Q(-12, -52, -40, -60) + Q(-18, -44, -10, -30) + 'Z', '#ffffff', { opacity: 0.22 }),
      ...eye(29, -4, 4.4), stroke(line([[38, 3], [34, 5]]), dk, 1.3),
    ];
  } else if (kind === 'butterfly') {
    out = [
      sh(M(-27, -17) + Q(-4, -46, 25, -19) + 'Z' + M(-27, 17) + Q(-4, 46, 25, 19) + 'Z', c2), sh(M(-31, 0) + L(-48, -14) + L(-48, 14) + 'Z', shade(c1, 0.35)),
      sh(poly([[29, -8], [47, 0], [29, 9]]), c1), sh(ellipse(0, 0, 34, 30), c1), sh(ellipse(2, 12, 24, 13), '#ffffff', { opacity: 0.3 }),
      stroke(line([[-12, -25], [-2, 24]]) + line([[-2, -28], [8, 22]]) + line([[-22, -19], [-13, 21]]), c3, 1.6, { opacity: 0.55 }),
      sh(band(18, 25, 34, 30), '#2b2a33'), sh(circle(-19, -12, 4.6), '#2b2a33', { opacity: 0.85 }),
      ...eye(21.5, -4, 3.6),
    ];
  } else if (kind === 'tang') {
    out = [
      sh(M(-34, 0) + L(-58, -23) + Q(-47, 0, -58, 23) + 'Z', c2), sh(M(-30, -14) + Q(0, -40, 30, -14) + 'Z' + M(-30, 14) + Q(0, 40, 30, 14) + 'Z', shade(c1, -0.22)),
      sh(ellipse(0, 0, 40, 26), c1), sh(blob([[-24, -4], [-4, -13], [18, -8], [6, 1], [-14, 6]], 1), c3, { opacity: 0.8 }),
      sh(ellipse(4, 11, 28, 10), '#ffffff', { opacity: 0.2 }), sh(leaf(12, 4, 15, 5, 150), c2), ...eye(26, -6, 4.6), stroke(line([[39, 3], [35, 5]]), dk, 1.3),
    ];
  } else if (kind === 'slim') {
    out = [
      sh(poly([[-36, 0], [-56, -12], [-50, 0], [-56, 12]]), c2), sh(M(-24, -9) + Q(2, -22, 28, -9) + 'Z', c2),
      sh(blob([[49, 0], [30, -10], [-10, -12], [-40, -5], [-40, 5], [-10, 12], [30, 10]], 0.9), c1),
      sh(tube([[42, -1], [0, -3], [-38, 0]], [5, 5, 3], 4), c3), sh(ellipse(4, 6, 30, 4), '#ffffff', { opacity: 0.3 }), ...eye(36, -3, 3.6),
    ];
  } else if (kind === 'round') {
    out = [
      sh(M(-27, 0) + L(-50, -19) + L(-43, 0) + L(-50, 19) + 'Z', c2), sh(M(-20, -20) + Q(-2, -40, 20, -20) + 'Z' + M(-16, 20) + Q(-2, 36, 12, 21) + 'Z', c2),
      sh(ellipse(0, 0, 32, 26), c1), sh(M(-30, -6) + Q(0, -34, 30, -6) + Q(0, -16, -30, -6) + 'Z', c3, { opacity: 0.75 }),
      sh(ellipse(3, 11, 22, 10), '#ffffff', { opacity: 0.25 }), sh(leaf(6, 5, 14, 5, 150), c2), ...eye(19, -5, 4.8), stroke(line([[31, 4], [27, 6]]), dk, 1.3),
    ];
  } else {
    let scales = '';
    for (let r = 0; r < 4; r++) for (let k = 0; k < 6; k++) { const x = -22 + k * 9 + (r % 2) * 4.5, y = -11 + r * 7; scales += M(x - 4, y) + Q(x, y + 5, x + 4, y); }
    out = [
      sh(M(-32, 0) + L(-56, -20) + Q(-48, 0, -56, 20) + 'Z', c2), sh(M(-28, -12) + Q(0, -34, 32, -13) + 'Z' + M(-22, 13) + Q(-4, 30, 14, 20) + 'Z', c2),
      sh(blob([[47, 2], [34, -17], [4, -24], [-28, -14], [-36, 0], [-28, 14], [4, 23], [34, 15]], 0.9), c1),
      stroke(scales, shade(c1, -0.25), 1.1, { opacity: 0.7 }), sh(blob([[20, 6], [34, 4], [38, 14], [24, 16]], 1), c2, { opacity: 0.85 }),
      sh(poly([[40, -3], [50, 1], [41, 7]]), c3), sh(leaf(8, 6, 16, 5, 145), c3), ...eye(31, -6, 4.4),
    ];
  }
  return fit(out, s);
}

/** A shoal of small fish facing right, spread over `w` × `h` around the origin. */
export function school(seed: number, count: number, w: number, h: number, s: number, col: string): Shape[] {
  const g = rng(seed);
  let bodies = '', tails = '', bellies = '', eyes = '';
  for (let i = 0; i < count; i++) {
    const x = g.range(-w / 2, w / 2), y = g.range(-h / 2, h / 2), k = s * g.range(0.75, 1.2), a = g.range(-10, 10);
    const t = { rot: a, ox: x, oy: y };
    bodies += xf(leaf(x - k * 0.4, y, k * 0.85, k * 0.24, 0), t);
    tails += xf(poly([[x - k * 0.34, y], [x - k * 0.6, y - k * 0.16], [x - k * 0.6, y + k * 0.16]]), t);
    bellies += xf(leaf(x - k * 0.25, y + k * 0.04, k * 0.55, k * 0.09, 0), t);
    eyes += xf(circle(x + k * 0.26, y - k * 0.02, k * 0.045), t);
  }
  return [sh(tails, shade(col, -0.18)), sh(bodies, col), sh(bellies, shade(col, 0.4), { opacity: 0.8 }), sh(eyes, '#22303a')];
}

// =====================================================================
// reef creatures
// =====================================================================
const hex = (cx: number, cy: number, r: number) => poly([0, 60, 120, 180, 240, 300].map((a) => pp(cx, cy, r, a)));

/** Swimming sea turtle seen from above, facing right, `s` long. */
export function turtle(s: number, shell = '#7a8f4a', skin = '#9cc27a'): Shape[] {
  const sk = shade(skin, -0.22);
  const fy = (x: number) => 25 * Math.sqrt(Math.max(0, 1 - (x / 36) * (x / 36)));
  let side = '';
  for (let i = 0; i < 4; i++) {
    const x0 = -30 + i * 15, x1 = x0 + 13.5;
    side += poly([[x0 + 1.5, -11.5], [x1, -11.5], [x1, -fy(x1)], [x0, -fy(x0)]]) + poly([[x0 + 1.5, 11.5], [x1, 11.5], [x1, fy(x1)], [x0, fy(x0)]]);
  }
  let spots = '';
  for (const [x, y] of [[26, -44], [22, -54], [30, -34], [36, 44], [30, 52], [28, 38], [-44, -22], [-46, 20], [54, -3], [48, 4]]) spots += circle(x, y, 2);
  return fit([
    sh(blob([[16, -18], [34, -40], [31, -63], [18, -59], [9, -36], [5, -20]], 0.9) + blob([[16, 18], [40, 33], [47, 58], [33, 61], [15, 40], [5, 22]], 0.9), skin),
    sh(blob([[-26, -16], [-44, -29], [-53, -24], [-44, -12], [-32, -8]], 0.9) + blob([[-26, 16], [-46, 27], [-55, 20], [-44, 10], [-32, 8]], 0.9) + poly([[-34, -4], [-51, 0], [-34, 4]]), skin),
    sh(ellipse(40, 0, 13, 8), skin), sh(blob([[44, -9], [58, -8.5], [67, 0], [58, 8.5], [44, 9]], 0.9), skin), sh(spots, sk),
    sh(ellipse(0, 0, 39, 30), shade(shell, -0.38)), sh(ellipse(0, 0, 36, 27), shade(shell, -0.18)),
    sh(hex(-20.5, 0, 9.6) + hex(0, 0, 9.6) + hex(20.5, 0, 9.6), shade(shell, 0.12)), sh(side, shell),
    hl(ellipse(-8, -15, 16, 5, -8), 0.2), sh(circle(59, -4.5, 2.2), '#2b2a33'), sh(circle(59.6, -5.1, 0.7), '#ffffff'),
    stroke(curve([[62, 3], [58, 5], [54, 4]]), sk, 1.2),
  ], s);
}

/** Seahorse, `s` tall, facing right. */
export function seahorse(s: number, col = '#f2b441'): Shape[] {
  const dk = shade(col, -0.28);
  let ridges = '';
  for (const [x, y, hw] of [[-5, -22, 8], [-3, -14, 9.5], [0, -5, 10], [3, 4, 9], [6, 12, 7.5], [5, 20, 5.5], [1, 28, 4]]) ridges += line([[x - hw, y + 1], [x + hw, y - 1]]);
  return fit([
    sh(sector(-8, -9, 17, 135, 235), shade(col, 0.4)), stroke(line([[-8, -9], pp(-8, -9, 16, 160)]) + line([[-8, -9], pp(-8, -9, 16, 185)]) + line([[-8, -9], pp(-8, -9, 16, 210)]), dk, 0.8),
    sh(tube([[2, -36], [-5, -22], [0, -4], [6, 12], [2, 28], [-10, 36], [-18, 28], [-12, 20], [-7, 25]], [11, 19, 22, 17, 10, 7, 5, 3.5, 2.5], 6), col),
    sh(tube([[5, -26], [5, -6], [10, 10], [6, 24]], [4, 8, 6, 3], 4), shade(col, 0.32), { opacity: 0.85 }), stroke(ridges, dk, 1.1, { opacity: 0.7 }),
    sh(poly([[-3, -47], [-1, -56], [3, -50], [7, -57], [10, -47]]), dk), sh(xf(rect(10, -43, 21, 7, 3), { rot: 12, ox: 10, oy: -39 }), col),
    sh(ellipse(5, -40, 11.5, 9.5, -20), col), sh(xf(rect(28, -43, 4, 7, 1.5), { rot: 12, ox: 10, oy: -39 }), dk), ...eye(8, -42, 3.4),
    sh(circle(-2, -18, 1.6) + circle(3, 2, 1.6) + circle(8, 16, 1.4) + circle(-1, -36, 1.3), shade(col, 0.45)),
  ], s);
}

/** Five-armed starfish `s` across. */
export function starfish(s: number, col: string, rot = 0): Shape[] {
  const pts: Pt[] = [];
  for (let i = 0; i < 10; i++) pts.push(pp(0, 0, i % 2 ? 19 : 50, -90 + i * 36));
  let dots = '';
  for (let a = 0; a < 5; a++) for (const [r, k] of [[13, 2.6], [23, 2.2], [32, 1.8], [40, 1.4]]) { const [x, y] = pp(0, 0, r, -90 + a * 72); dots += circle(x, y, k); }
  return place(fit([ol(blob(pts, 0.5), col, 1.4, -0.28), sh(dots, shade(col, 0.42)), sh(circle(0, 0, 4.4), shade(col, 0.25)), hl(ellipse(-5, -22, 3, 9, 12), 0.25)], s), { rot });
}

const scallopParts = (col: string): Shape[] => {
  const edge: Pt[] = [];
  let ribs = '';
  for (let i = 0; i <= 12; i++) {
    const a = -172 + i * (164 / 12);
    edge.push(pp(0, 12, i % 2 ? 51 : 46, a));
    if (i % 2) ribs += line([[0, 20], pp(0, 12, 45, a)]);
  }
  const arc = (r: number) => curve([-165, -130, -90, -50, -15].map((a) => pp(0, 12, r, a)));
  return [
    ol(poly([[-24, 10], [-13, 27], [13, 27], [24, 10]]), shade(col, -0.18), 1), ol(blob([...edge, [9, 23], [-9, 23]], 0.7), col, 1.3, -0.3),
    stroke(ribs, shade(col, -0.26), 1.6), stroke(arc(31) + arc(19), shade(col, 0.4), 1.4, { opacity: 0.7 }), hl(ellipse(-20, -14, 5, 12, 30), 0.25),
  ];
};

/** Scallop shell `s` wide. */
export const scallop = (s: number, col: string): Shape[] => fit(scallopParts(col), s);

/** Whelk-like spiral shell lying on its side, `s` long. */
export function spiralShell(s: number, col: string): Shape[] {
  const dk = shade(col, -0.32);
  const whorls: [number, number, number, number][] = [[-38, -5, 8, 8], [-27, -3, 13, 12], [-10, 0, 20, 18], [18, 4, 30, 24]];
  let a = '', b = '', lines = '', nubs = '';
  whorls.forEach(([x, y, rx, ry], i) => {
    if (i % 2) a += ellipse(x, y, rx, ry); else b += ellipse(x, y, rx, ry);
    lines += curve([[x - rx * 0.1, y - ry * 0.92], [x - rx * 0.45, y], [x - rx * 0.1, y + ry * 0.92]]) + curve([[x + rx * 0.35, y - ry * 0.88], [x + rx * 0.05, y], [x + rx * 0.35, y + ry * 0.88]]);
    nubs += circle(x, y - ry * 0.86, Math.max(1.4, rx * 0.11));
  });
  return fit([
    ol(poly([[-43, -10], [-55, -7], [-43, -1]]), col, 1), ol(poly([[34, 18], [54, 31], [40, 29]]), col, 1),
    ol(b, shade(col, 0.12), 1.2), ol(a, col, 1.2), ol(ellipse(18, 4, 30, 24), col, 1.2), stroke(lines, dk, 1.3, { opacity: 0.6 }), sh(nubs, shade(col, 0.4)),
    ol(blob([[20, -8], [40, 0], [45, 16], [31, 25], [16, 14]], 1), '#f7cdbd', 1.2), sh(blob([[25, 0], [38, 4], [40, 15], [31, 20], [22, 12]], 1), '#dd9388'),
    hl(ellipse(6, -10, 9, 4, -20), 0.3),
  ], s);
}

const snailParts = (col: string): Shape[] => {
  const sp: Pt[] = [];
  for (let i = 0; i <= 22; i++) { const t = i / 22; sp.push(pp(0, 0, 35 * (1 - t) + 3, 20 + t * 800)); }
  return [
    ol(ellipse(30, 24, 17, 12, 25), shade(col, -0.2), 1.2), ol(circle(0, 0, 40), col, 1.5), stroke(curve(sp), shade(col, -0.35), 4),
    stroke(curve(sp.slice(0, 9).map(([x, y]): Pt => [x * 0.88 - 2, y * 0.88 - 2])), shade(col, 0.35), 2, { opacity: 0.7 }), hl(ellipse(-14, -22, 9, 5, -30), 0.3),
  ];
};

/** Round coiled snail shell `s` wide (origin at the centre of the coil). */
export const snailShell = (s: number, col: string): Shape[] => fit(snailParts(col), s);

/** Hermit crab peeping from a coiled shell, `s` wide; origin bottom-centre. */
export function hermitCrab(s: number, shellCol = '#d9a66a', col = '#e0734f'): Shape[] {
  const dk = shade(col, -0.3);
  return fit([
    stroke(line([[14, -14], [30, -6], [36, 0]]) + line([[8, -10], [20, -2], [22, 0]]) + line([[20, -18], [40, -12], [48, 0]]), dk, 4),
    stroke(line([[22, -22], [22, -42]]) + line([[31, -22], [34, -40]]), dk, 2.2),
    ...place(snailParts(shellCol), { s: 0.62, x: -10, y: -34, rot: -15 }),
    sh(blob([[10, -30], [26, -30], [34, -20], [26, -10], [10, -12]], 1), col),
    ol(ellipse(44, -24, 11, 8, -15), col, 1.2), sh(leaf(50, -28, 15, 4.5, -30), col), sh(leaf(50, -22, 13, 4, 5), dk),
    ol(ellipse(30, -6, 7, 5, 20), col, 1), sh(leaf(34, -5, 9, 3, 25), dk),
    sh(circle(22, -44, 4) + circle(34.5, -42, 4), '#ffffff'), sh(circle(23, -44, 2) + circle(35.5, -42, 2), '#2b2a33'),
  ], s);
}

/** Round, spiky pufferfish `s` wide, facing right. */
export function pufferfish(s: number, col = '#e9c468', fin = '#d99a4a'): Shape[] {
  let spikes = '', spots = '';
  for (let i = 0; i < 26; i++) { const a = (i * 360) / 26; if (a > 160 && a < 200) continue; spikes += poly([pp(0, 0, 35, a - 5.5), pp(0, 0, 47, a), pp(0, 0, 35, a + 5.5)]); }
  for (const [x, y, r] of [[-20, -18, 3.4], [-6, -26, 3], [8, -24, 2.6], [-28, -4, 2.8], [-12, -10, 2.4], [-24, 6, 2], [2, -14, 2]]) spots += circle(x, y, r);
  return fit([
    sh(spikes, shade(col, -0.25)), sh(poly([[-33, 0], [-53, -13], [-48, 0], [-53, 13]]), fin), sh(poly([[-15, -33], [-7, -49], [4, -35]]), fin),
    ol(circle(0, 0, 38), col, 1.3), sh(M(-37, 6) + Q(0, 24, 37, 6) + C(30, 47, -30, 47, -37, 6) + 'Z', '#fbf3df'), sh(spots, shade(col, -0.35), { opacity: 0.75 }),
    ol(ellipse(-6, 8, 9, 6, 30), fin, 1), sh(circle(25, 7, 5.5), '#f29a8a', { opacity: 0.55 }),
    ...eye(17, -10, 9.5), ol(ellipse(36.5, 5, 3.6, 5), '#ee8f7c', 1), sh(ellipse(37, 5, 1.4, 2.6), '#7a3a35'),
  ], s);
}

/** Jellyfish with a bell `s` wide; origin at the middle of the bell. */
export function jellyfish(s: number, col = '#f2a0c0'): Shape[] {
  let tent = '', arms = '', rim = '';
  for (const x of [-36, -22, -8, 8, 22, 36]) tent += curve([[x, 6], [x + 5, 30], [x - 4, 56], [x + 4, 82], [x - 2, 104]]);
  for (const x of [-16, 0, 16]) arms += tube([[x, 2], [x + 7, 24], [x - 6, 46], [x + 4, 70]], [10, 8, 6, 2.5], 5);
  for (let i = 0; i < 7; i++) rim += circle(-39 + i * 13, -2, 1.8);
  const bell = M(-46, 4) + C(-48, -54, 48, -54, 46, 4) + Q(38, 13, 30, 4) + Q(22, 13, 15, 4) + Q(7, 13, 0, 4) + Q(-7, 13, -15, 4) + Q(-22, 13, -30, 4) + Q(-38, 13, -46, 4) + 'Z';
  return fit([
    stroke(tent, shade(col, 0.25), 1.7, { opacity: 0.85 }), sh(arms, shade(col, 0.45), { opacity: 0.9 }),
    ol(bell, col, 1.2, -0.2), sh(M(-33, -1) + C(-33, -38, 33, -38, 33, -1) + Q(0, 9, -33, -1) + 'Z', shade(col, 0.3), { opacity: 0.75 }),
    stroke(circle(-8, -16, 6) + circle(8, -16, 6) + circle(0, -24, 6) + circle(0, -9, 6), shade(col, -0.15), 1.5, { opacity: 0.8 }),
    sh(rim, shade(col, -0.25)), hl(ellipse(-22, -24, 6, 13, 32), 0.4),
  ], s);
}

/** Crab `s` wide, seen from the front. */
export function crab(s: number, col = '#d9553f'): Shape[] {
  const dk = shade(col, -0.25);
  let legs = '', arms = '';
  for (const m of [-1, 1]) {
    for (let k = 0; k < 3; k++) legs += line([[m * 22, 3 + k * 4], [m * (38 + k * 3), -6 + k * 9], [m * (46 + k * 3), 13 + k * 5]]);
    arms += line([[m * 22, -8], [m * 36, -20]]);
  }
  const claw = (m: number) => [
    ol(xf(ellipse(41, -27, 11, 9, -25), { sx: m }), col, 1.2), sh(xf(leaf(46, -33, 17, 5, -62), { sx: m }), col), sh(xf(leaf(49, -28, 13, 4, -28), { sx: m }), dk),
  ];
  return fit([
    stroke(legs, dk, 4.6), stroke(arms, dk, 6.5), ...claw(-1), ...claw(1),
    stroke(line([[-9, -13], [-10, -27]]) + line([[9, -13], [10, -27]]), dk, 2.6),
    ol(blob([[-30, 0], [-24, -14], [0, -18], [24, -14], [30, 0], [20, 12], [0, 15], [-20, 12]], 0.9), col, 1.4),
    sh(circle(-14, -4, 2) + circle(-6, -9, 1.6) + circle(8, -8, 1.8) + circle(15, -2, 1.5) + circle(0, -2, 1.4), dk, { opacity: 0.7 }), hl(ellipse(-6, -11, 13, 3.5, -4), 0.3),
    sh(circle(-10, -29, 4.8) + circle(10, -29, 4.8), '#ffffff'), sh(circle(-9.4, -29, 2.4) + circle(10.6, -29, 2.4), '#2b2a33'),
    stroke(curve([[-6, 5], [0, 8], [6, 5]]), shade(col, -0.5), 1.4),
  ], s);
}

/** Spiny sea urchin `s` across. */
export function urchin(seed: number, s: number, col = '#6b4a9c'): Shape[] {
  const g = rng(seed);
  let a = '', b = '', dots = '';
  for (let i = 0; i < 30; i++) {
    const ang = i * 12 + g.range(-3, 3), [x, y] = pp(0, 0, 12, ang);
    const d = leaf(x, y, g.range(30, 38), 2.8, ang);
    if (i % 2) a += d; else b += d;
  }
  for (let k = 0; k < 5; k++) for (const r of [6, 12, 17]) { const [x, y] = pp(0, 0, r, k * 72 - 90); dots += circle(x, y, 1.7); }
  return fit([sh(b, shade(col, -0.3)), sh(a, shade(col, -0.1)), ol(circle(0, 0, 22), col, 1.2), sh(dots, shade(col, 0.45)), hl(ellipse(-8, -9, 6, 3.5, -30), 0.3)], s);
}

/** Open clam with a pearl, `s` wide; origin bottom-centre. */
export function pearlClam(s: number, col = '#b9a6d8'): Shape[] {
  const inner = '#f9ead8';
  return fit([
    ...place(scallopParts(shade(col, 0.1)), { rot: -6, y: -50, s: 0.98 }),
    ol(blob([[-48, -26], [-34, -8], [0, 0], [34, -8], [48, -26], [30, -36], [0, -40], [-30, -36]], 0.9), col, 1.3, -0.3),
    sh(blob([[-41, -27], [-30, -13], [0, -7], [30, -13], [41, -27], [26, -34], [0, -37], [-26, -34]], 0.9), inner),
    sh(tube([[-34, -25], [-17, -17], [0, -20], [17, -17], [34, -25]], [5, 9, 8, 9, 5], 5), '#e59ac0'),
    stroke(line([[-30, -6], [-36, -14]]) + line([[-15, -2], [-18, -11]]) + line([[0, 0], [0, -9]]) + line([[15, -2], [18, -11]]) + line([[30, -6], [36, -14]]), shade(col, -0.3), 1.4),
    sh(ellipse(1, -19, 12, 4), '#8a5a7a', { opacity: 0.3 }), ol(circle(0, -27, 10.5), '#fffaf0', 1, -0.2), sh(M(-9, -24) + Q(0, -14, 9, -24) + Q(0, -19, -9, -24) + 'Z', '#d9cbe8', { opacity: 0.8 }),
    sh(circle(-3.5, -31, 2.6), '#ffffff'),
  ], s);
}

/** Manta ray gliding to the right, about `s` wing tip to wing tip. */
export function mantaRay(s: number, col = '#4f6f96'): Shape[] {
  const body = M(30, -7) + Q(10, -16, -4, -50) + Q(-12, -20, -28, -4) + L(-28, 4) + Q(-12, 20, -4, 50) + Q(10, 16, 30, 7) + Q(25, 0, 30, -7) + 'Z';
  return fit([
    sh(taper([[-26, 0], [-52, 3], [-80, -2]], 4, 1.2, 5), shade(col, -0.25)), sh(leaf(27, -6, 13, 4, -18) + leaf(27, 6, 13, 4, 18), shade(col, -0.15)),
    ol(body, col, 1.2, -0.3), sh(poly([[-4, -50], [-9, -34], [1, -37]]) + poly([[-4, 50], [-9, 34], [1, 37]]), shade(col, -0.3)),
    sh(ellipse(5, -19, 6, 12, -22) + ellipse(5, 19, 6, 12, 22), shade(col, 0.4), { opacity: 0.75 }), sh(ellipse(-6, 0, 12, 5), shade(col, 0.25), { opacity: 0.6 }),
    stroke(line([[18, 0], [-24, 0]]), shade(col, -0.3), 1.2, { opacity: 0.6 }), sh(circle(23, -8.5, 1.9) + circle(23, 8.5, 1.9), '#1f2530'),
    sh(circle(-12, -22, 1.4) + circle(-14, 16, 1.4) + circle(-18, -8, 1.2) + circle(-8, 30, 1.2) + circle(-6, -34, 1.2), '#ffffff', { opacity: 0.7 }),
  ], s);
}

/** Friendly spotted eel rising in an S-curve; origin at the tail (bottom). */
export function eel(s: number, col = '#8aa64a'): Shape[] {
  const spine: Pt[] = [[0, 0], [-8, -22], [6, -44], [26, -54], [40, -66], [52, -72]];
  let spots = '';
  smooth(spine, 4).forEach(([x, y], i) => { if (i % 2) spots += circle(x + (i % 4 === 1 ? -3 : 3), y, 2); });
  return fit([
    sh(tube([[-7, -3], [-17, -24], [0, -52], [24, -63], [42, -76]], [3, 6, 6, 6, 3], 5), shade(col, -0.3)),
    ol(tube(spine, [15, 15, 14, 13, 12, 11], 6), col, 1.2), sh(tube([[4, -2], [-2, -22], [10, -39], [28, -49], [44, -61]], [4, 5, 5, 4, 3], 5), shade(col, 0.4), { opacity: 0.7 }),
    sh(spots, shade(col, -0.35), { opacity: 0.8 }), ol(ellipse(57, -74, 13.5, 9.5, -22), col, 1.2),
    stroke(curve([[69, -76], [61, -70], [52, -69]]), shade(col, -0.5), 1.5), ...eye(59, -79, 3.6), sh(circle(67, -80, 1), shade(col, -0.5)),
  ], s);
}

/** Smiling octopus; the head is about `s` × 0.5 wide and the arms spread about `s` × 1.3. Origin under the head. */
export function octopus(s: number, col = '#d9698f'): Shape[] {
  const left: Pt[][] = [
    [[-14, 2], [-36, 12], [-56, 6], [-66, -10], [-56, -20], [-48, -12]],
    [[-10, 6], [-28, 26], [-50, 34], [-64, 26], [-60, 14]],
    [[-6, 8], [-16, 34], [-32, 48], [-46, 44], [-42, 34]],
    [[-2, 10], [-2, 36], [-12, 56], [-22, 54], [-20, 44]],
  ];
  const right = left.map((a) => a.map(([x, y]): Pt => [-x * 0.96 + 2, y + (x < -40 ? 3 : 0)]));
  const ws = [12, 10, 8, 6, 4, 3];
  let back = '', front = '', suck = '';
  [...left, ...right].forEach((a, i) => {
    const d = tube(a, ws, 6);
    if (i % 2) { front += d; smooth(a, 3).forEach(([x, y], k) => { if (k > 1 && k % 2 === 0) suck += circle(x, y + 1.5, 1.7); }); } else back += d;
  });
  return fit([
    sh(back, shade(col, -0.2)), sh(front, col), sh(suck, shade(col, 0.5), { opacity: 0.85 }),
    ol(M(-25, 2) + C(-36, -30, -22, -57, 0, -57) + C(22, -57, 36, -30, 25, 2) + Q(0, 16, -25, 2) + 'Z', col, 1.3, -0.25),
    sh(circle(-12, -40, 3.4) + circle(4, -46, 2.8) + circle(15, -36, 3) + circle(-3, -34, 2.2) + circle(-20, -28, 2.2) + circle(21, -26, 2), shade(col, 0.35), { opacity: 0.8 }),
    hl(ellipse(-13, -30, 5, 12, 22), 0.22), sh(ellipse(-10, -10, 7, 8.5) + ellipse(10, -10, 7, 8.5), '#ffffff'),
    sh(ellipse(-9, -9, 3.6, 5) + ellipse(11, -9, 3.6, 5), '#2b2a33'), sh(circle(-7.6, -11.5, 1.3) + circle(12.4, -11.5, 1.3), '#ffffff'),
    sh(circle(-19, 0, 4) + circle(19, 0, 4), '#f6a0a0', { opacity: 0.55 }), stroke(curve([[-6, 2], [0, 5.5], [6, 2]]), shade(col, -0.55), 1.7),
  ], s);
}

// =====================================================================
// shipwreck props
// =====================================================================
const WOOD = '#9a6238', BRASS = '#d9b24c', IRON = '#56636f', GOLD = '#f2c94c';

/** Coins scattered over a `w` wide patch. */
export function coins(seed: number, count: number, w: number, h = 10): Shape[] {
  const g = rng(seed);
  let d = '', gl = '';
  for (let i = 0; i < count; i++) { const x = g.range(-w / 2, w / 2), y = g.range(-h / 2, h / 2), a = g.range(-20, 20); d += ellipse(x, y, 5.5, 2.8, a); gl += ellipse(x - 1, y - 0.6, 2.6, 1, a); }
  return [ol(d, GOLD, 1, -0.35), sh(gl, '#fff3b8', { opacity: 0.9 })];
}

/** Open treasure chest `s` wide; origin bottom-centre. */
export function chest(s: number): Shape[] {
  let coin = '', glint = '', studs = '';
  for (const [x, y] of [[-30, -50], [-18, -56], [-4, -60], [10, -60], [24, -55], [34, -49], [-10, -51], [6, -52], [20, -48], [-24, -47]]) { coin += ellipse(x, y, 6, 3); glint += ellipse(x - 1, y - 0.8, 3, 1.1); }
  for (const x of [-31.5, 31.5]) for (const y of [-38, -22, -8]) studs += circle(x, y, 1.7);
  const lid = M(-48, -46) + L(-44, -80) + Q(0, -100, 44, -80) + L(48, -46) + 'Z';
  return fit([
    ol(lid, shade(WOOD, -0.38), 2.5, -0.3), sh(rect(-33, -89, 8, 43) + rect(25, -89, 8, 43), shade(BRASS, -0.25)),
    stroke(M(-44, -80) + Q(0, -100, 44, -80), BRASS, 3.5), stroke(curve([[-40, -62], [0, -70], [40, -62]]), shade(WOOD, -0.55), 1.2, { opacity: 0.6 }),
    sh(M(-45, -44) + Q(-30, -63, -8, -67) + Q(22, -69, 45, -44) + 'Z', GOLD), ol(coin, '#f7d868', 0.9, -0.35), sh(glint, '#fff6c8'),
    ol(poly([[-16, -66], [-10, -60], [-16, -54], [-22, -60]]), '#e0465a', 0.8), ol(poly([[14, -68], [20, -62], [14, -56], [8, -62]]), '#3fae8a', 0.8), ol(circle(30, -55, 4.2), '#4a8fd6', 0.8),
    sh(circle(-34, -45, 2.6) + circle(-30, -41, 2.6) + circle(-25, -38, 2.6) + circle(-19.5, -37, 2.6) + circle(-14, -38.5, 2.6), '#fdf7ea', { stroke: '#c9b79a', strokeWidth: 0.6 }),
    ol(rect(-50, -46, 100, 46, 3), WOOD, 1.5, -0.35), sh(rect(-50, -46, 100, 6, 3), shade(WOOD, 0.18)), sh(rect(22, -46, 28, 46, 3), '#000000', { opacity: 0.12 }),
    stroke(line([[-48, -30], [48, -30]]) + line([[-48, -15], [48, -15]]), shade(WOOD, -0.4), 1.2),
    ol(rect(-36, -46, 9, 46) + rect(27, -46, 9, 46), BRASS, 1, -0.35), sh(studs, shade(BRASS, -0.45)),
    ol(rect(-7.5, -42, 15, 17, 3), shade(BRASS, 0.15), 1, -0.4), sh(circle(0, -35, 2.2) + rect(-1, -35, 2, 6), '#3b2a1c'), sh(rect(-52, -5, 104, 6, 2), shade(WOOD, -0.4)),
    sh(star(-36, -70, 7, 1.6, 4) + star(26, -74, 5.5, 1.3, 4) + star(2, -80, 4.5, 1.1, 4), '#fffbe0'),
  ], s);
}

/** Iron anchor `s` tall; origin at its centre. */
export function anchor(s: number): Shape[] {
  return fit([
    ol(sector(0, -43, 9.5, 0, 360, 5.5), IRON, 1), ol(rect(-25, -34, 50, 7, 3), '#8a5a3c', 1), sh(circle(-25, -30.5, 4.5) + circle(25, -30.5, 4.5), '#6f4429'),
    ol(tube([[-36, 8], [-27, 29], [0, 42], [27, 29], [36, 8]], [5, 9, 11, 9, 5], 6), IRON, 1.2),
    ol(poly([[-41, -4], [-49, 17], [-28, 13]]) + poly([[41, -4], [49, 17], [28, 13]]), IRON, 1.2),
    ol(poly([[-3.8, -36], [3.8, -36], [5, 38], [-5, 38]]), IRON, 1.2), sh(circle(0, 42, 6.5), shade(IRON, -0.2)),
    stroke(line([[-1.8, -32], [-2.4, 34]]), shade(IRON, 0.4), 1.4, { opacity: 0.7 }),
    sh(blob([[-3, -8], [3, -12], [5, 2], [-2, 6]], 1) + blob([[14, 32], [24, 28], [28, 34], [18, 38]], 1) + blob([[-30, 16], [-24, 14], [-22, 22], [-28, 24]], 1), '#b0683c', { opacity: 0.75 }),
    sh(circle(-12, 36, 1.8) + circle(-8, 39, 1.4) + circle(3, 20, 1.5) + circle(34, 14, 1.6), '#efe6d2'),
  ], s);
}

/** Wooden barrel `s` tall; origin bottom-centre. */
export function barrel(s: number, col = WOOD): Shape[] {
  const hw = (t: number) => 28 + 32 * t * (1 - t);
  let staves = '', hoops = '';
  for (const f of [-0.62, -0.22, 0.2, 0.6]) staves += curve([[28 * f, 0], [36 * f, -50], [28 * f, -100]]);
  for (const t of [0.1, 0.3, 0.7, 0.9]) { const y = -100 * t, w = hw(t) + 0.8; hoops += M(-w, y - 4) + Q(0, y + 1, w, y - 4) + L(w, y + 3) + Q(0, y + 8, -w, y + 3) + 'Z'; }
  return fit([
    ol(M(-28, 0) + Q(-44, -50, -28, -100) + L(28, -100) + Q(44, -50, 28, 0) + Q(0, 7, -28, 0) + 'Z', col, 1.4, -0.35),
    sh(M(8, 2) + Q(14, -50, 8, -100) + L(28, -100) + Q(44, -50, 28, 0) + 'Z', '#000000', { opacity: 0.14 }), stroke(staves, shade(col, -0.35), 1.1, { opacity: 0.8 }),
    sh(hoops, IRON), hl(rect(-24, -86, 4, 70, 2), 0.2), ol(ellipse(0, -100, 28, 6), shade(col, 0.22), 1.2, -0.4), sh(ellipse(0, -100, 22, 4), shade(col, -0.08)),
  ], s);
}

/** Ship's wheel `s` across. */
export function shipWheel(s: number): Shape[] {
  let spokes = '', knobs = '', studs = '';
  for (let i = 0; i < 4; i++) spokes += xf(rect(-3, -50, 6, 100, 2), { rot: i * 45 });
  for (let i = 0; i < 8; i++) { const [x, y] = pp(0, 0, 48, i * 45); knobs += circle(x, y, 4.4); const [u, v] = pp(0, 0, 32, i * 45 + 22.5); studs += circle(u, v, 1.6); }
  return fit([
    ol(spokes, shade(WOOD, 0.12), 1, -0.4), ol(knobs, shade(WOOD, 0.12), 1, -0.4), ol(sector(0, 0, 37, 0, 360, 27), WOOD, 1.3, -0.4),
    stroke(circle(0, 0, 33.5), shade(WOOD, 0.3), 1.6, { opacity: 0.7 }), sh(studs, BRASS), ol(circle(0, 0, 11), shade(WOOD, -0.2), 1.2), ol(circle(0, 0, 5.5), BRASS, 1),
  ], s);
}

/** Glowing brass lantern `s` tall; origin at its centre. */
export function lantern(s: number): Shape[] {
  return fit([
    sh(circle(0, 2, 36), '#fff3b0', { opacity: 0.2 }), stroke(M(-10, -36) + Q(0, -58, 10, -36), shade(BRASS, -0.2), 3), ol(sector(0, -49, 5.5, 0, 360, 3), BRASS, 0.8),
    ol(poly([[-15, -28], [15, -28], [8, -39], [-8, -39]]), BRASS, 1.2), ol(rect(-15, -25, 30, 50, 5), '#fff0a8', 1.2, -0.35), sh(circle(0, 3, 10), '#ffd45e'),
    sh(leaf(0, 12, 18, 5.5, -90), '#ff9d3c'), sh(leaf(0, 10, 10, 3, -90), '#fff6c8'), stroke(line([[-15, -24], [-15, 24]]) + line([[15, -24], [15, 24]]) + line([[0, -24], [0, -8]]), shade(BRASS, -0.3), 2.6),
    ol(rect(-18, -30, 36, 6, 2), BRASS, 1), ol(rect(-18, 23, 36, 6, 2), BRASS, 1), ol(poly([[-13, 29], [13, 29], [16, 38], [-16, 38]]), shade(BRASS, -0.15), 1), hl(rect(-10, -20, 4, 30, 2), 0.55),
  ], s);
}

/** Corked bottle with a rolled message, `s` long, lying on its side (neck to the right). */
export function bottle(s: number): Shape[] {
  const glass = '#9fd6bf';
  return fit([
    ol(rect(-48, -15, 62, 30, 10) + poly([[12, -15], [27, -6], [27, 6], [12, 15]]) + rect(25, -6, 15, 12, 2), glass, 1.3, -0.35),
    sh(rect(-46, 5, 58, 9, 6), shade(glass, -0.2), { opacity: 0.55 }), ol(rect(-37, -8.5, 38, 17, 3), '#f7ecd0', 1), sh(ellipse(-37, 0, 3, 8.5), '#dcc99c'),
    sh(rect(-21, -9, 5.5, 18), '#d8493b'), stroke(line([[-12, -3], [-3, -3]]) + line([[-12, 1], [-5, 1]]) + line([[-32, -3], [-25, -3]]) + line([[-32, 1], [-26, 1]]), '#8a7a5c', 1),
    ol(rect(38, -7.5, 5, 15, 2), shade(glass, -0.25), 1), ol(rect(42.5, -5, 9, 10, 2), '#c89a62', 1), hl(rect(-40, -11.5, 42, 3.4, 2), 0.65), hl(circle(18, -5, 2), 0.7),
  ], s);
}

/** Jewelled gold crown `s` wide; origin bottom-centre. */
export function crown(s: number): Shape[] {
  let balls = '';
  for (const [x, y] of [[-46, -44], [-23, -52], [0, -58], [23, -52], [46, -44]]) balls += circle(x, y, 5);
  return fit([
    sh(ellipse(0, -16, 38, 9), '#b23a48'),
    ol(poly([[-40, 0], [-46, -44], [-34, -22], [-23, -52], [-11, -24], [0, -58], [11, -24], [23, -52], [34, -22], [46, -44], [40, 0]]), GOLD, 1.4, -0.35),
    ol(balls, '#f9de7a', 1, -0.35), ol(rect(-41, -15, 82, 15, 3), shade(GOLD, -0.14), 1.2), stroke(line([[-39, -15], [39, -15]]), '#fff3b8', 1.2),
    ol(ellipse(0, -7.5, 6.5, 4.8), '#e0465a', 0.8), ol(circle(-22, -7.5, 3.8), '#4a8fd6', 0.8), ol(circle(22, -7.5, 3.8), '#3fae8a', 0.8), sh(circle(-34, -7.5, 2) + circle(34, -7.5, 2), '#fdf7ea'),
    hl(poly([[-42, -36], [-38, -28], [-37, -2], [-40, -2]]), 0.45),
  ], s);
}

/** Ornate golden key `s` long (bow on the left). */
export function key(s: number): Shape[] {
  return fit([
    ol(rect(-22, -3.6, 68, 7.2, 3), GOLD, 1.2, -0.38), ol(poly([[30, 3], [30, 21], [36, 21], [36, 12], [40, 12], [40, 21], [46, 21], [46, 3]]), GOLD, 1.2, -0.38),
    ol(sector(-35, 0, 17, 0, 360, 9.5), GOLD, 1.3, -0.38), ol(sector(-54, 0, 5.5, 0, 360, 2.4) + circle(-35, -19, 4) + circle(-35, 19, 4), GOLD, 1, -0.38),
    ol(rect(-21, -6.5, 6, 13, 2) + rect(-9, -5.5, 4, 11, 1.5), shade(GOLD, -0.12), 1), stroke(line([[-12, -1.4], [42, -1.4]]), '#fff3b8', 1.3, { opacity: 0.8 }),
  ], s);
}

/** Brass ship's bell `s` tall; origin at its centre. */
export function bell(s: number): Shape[] {
  const body = M(-12, -30) + Q(-27, -26, -29, 6) + Q(-31, 22, -43, 30) + L(43, 30) + Q(31, 22, 29, 6) + Q(27, -26, 12, -30) + 'Z';
  return fit([
    ol(sector(0, -41, 8.5, 0, 360, 4.6), shade(BRASS, -0.15), 1), sh(rect(-1.6, 32, 3.2, 8), shade(BRASS, -0.4)), ol(circle(0, 43, 6.5), shade(BRASS, -0.25), 1),
    ol(body, BRASS, 1.4, -0.38), sh(M(6, -30) + Q(20, -24, 21, 6) + Q(22, 22, 30, 30) + L(43, 30) + Q(31, 22, 29, 6) + Q(27, -26, 12, -30) + 'Z', '#000000', { opacity: 0.13 }),
    stroke(curve([[-28, -4], [0, 0], [28, -4]]) + curve([[-31, 16], [0, 21], [31, 16]]), shade(BRASS, -0.35), 1.6), ol(rect(-45, 28, 90, 7.5, 3), shade(BRASS, -0.12), 1.2), ol(rect(-11, -35, 22, 6.5, 2), shade(BRASS, -0.1), 1),
    hl(blob([[-20, -14], [-14, -22], [-13, 6], [-19, 12]], 1), 0.45), sh(blob([[8, 4], [16, 2], [18, 10], [10, 12]], 1) + blob([[-26, 18], [-20, 17], [-22, 24]], 1), '#6fb8a0', { opacity: 0.7 }),
  ], s);
}

/** Iron cannon on a wooden carriage, `s` long; origin bottom-centre, muzzle to the right. */
export function cannon(s: number): Shape[] {
  const t = { rot: -9, y: -31 };
  const tb = (d: string) => xf(d, t);
  const wheel = (x: number): Shape[] => [
    ol(circle(x, -9, 10.5), shade(WOOD, -0.25), 1.2), stroke(line([[x - 9, -9], [x + 9, -9]]) + line([[x, -18], [x, 0]]) + line([[x - 6.4, -15.4], [x + 6.4, -2.6]]) + line([[x - 6.4, -2.6], [x + 6.4, -15.4]]), shade(WOOD, -0.5), 1.4),
    sh(circle(x, -9, 3.2), IRON),
  ];
  return fit([
    ol(poly([[-40, -4], [-40, -17], [-22, -17], [-22, -25], [22, -25], [22, -15], [36, -15], [36, -4]]), WOOD, 1.3, -0.38), stroke(line([[-38, -11], [34, -11]]), shade(WOOD, -0.4), 1.1),
    ol(tb(circle(-49, 0, 5.2)), IRON, 1), ol(tb(poly([[-44, -10], [40, -7], [40, 7], [-44, 10]])), IRON, 1.4, -0.35),
    sh(tb(rect(-31, -10.5, 5, 21, 1) + rect(-5, -9.5, 4.5, 19, 1) + rect(21, -8.5, 4.5, 17, 1)), shade(IRON, 0.22)), ol(tb(rect(38, -9, 7.5, 18, 2)), shade(IRON, 0.12), 1),
    sh(tb(ellipse(45.6, 0, 2.6, 5.4)), '#1c232b'), stroke(tb(line([[-40, -6], [36, -4]])), shade(IRON, 0.5), 1.4, { opacity: 0.7 }),
    ...wheel(-24), ...wheel(20),
  ], s);
}

/** Brass spyglass `s` long. */
export function spyglass(s: number): Shape[] {
  return fit([
    ol(rect(18, -6, 30, 12, 2), BRASS, 1.1, -0.38), ol(rect(-14, -8.5, 34, 17, 2), '#7a4b32', 1.1), ol(rect(-50, -11, 38, 22, 3), BRASS, 1.2, -0.38),
    ol(rect(-53, -13, 6.5, 26, 2) + rect(-15, -10, 5, 20, 1.5) + rect(17, -7.5, 4, 15, 1) + rect(46, -7.2, 5, 14.4, 2), shade(BRASS, 0.2), 1, -0.45),
    sh(ellipse(-51.5, 0, 2, 10), '#bfe6f2'), hl(rect(-44, -8, 28, 3, 1.5), 0.55), hl(rect(-8, -6, 24, 2.4, 1), 0.3), hl(rect(22, -4, 22, 2, 1), 0.55),
    stroke(line([[-8, 3], [14, 3]]) + line([[-8, 6], [14, 6]]), shade('#7a4b32', -0.35), 0.9),
  ], s);
}

/** Brass pocket compass `s` across. */
export function compass(s: number): Shape[] {
  let ticks = '';
  for (let i = 0; i < 12; i++) ticks += line([pp(0, 0, 33, i * 30), pp(0, 0, 37, i * 30)]);
  return fit([
    ol(sector(0, -53, 8.5, 0, 360, 4.6), BRASS, 1), ol(circle(0, 0, 46), BRASS, 1.5, -0.38), stroke(circle(0, 0, 42), '#fff3b8', 1.2, { opacity: 0.7 }),
    ol(circle(0, 0, 38), '#f7efd8', 1, -0.3), stroke(ticks, '#6b5a48', 1.3), sh(star(0, 0, 21, 6, 4, -45), '#c9b27a'), sh(star(0, 0, 31, 7, 4, -90), '#3d4a5c'),
    sh(xf(poly([[0, -30], [5, 0], [-5, 0]]), { rot: 24 }), '#d8493b'), sh(xf(poly([[0, 30], [5, 0], [-5, 0]]), { rot: 24 }), '#e9edf0'), ol(circle(0, 0, 3.6), BRASS, 0.8),
    hl(sector(0, 0, 36, 200, 260, 28), 0.35),
  ], s);
}

/** Golden goblet `s` tall; origin bottom-centre. */
export function goblet(s: number): Shape[] {
  return fit([
    ol(M(-24, 0) + Q(-22, -14, 0, -16) + Q(22, -14, 24, 0) + 'Z', GOLD, 1.2, -0.38), ol(rect(-26, -3.5, 52, 4.5, 2), shade(GOLD, -0.15), 1),
    ol(poly([[-4, -50], [4, -50], [5, -14], [-5, -14]]), GOLD, 1.1, -0.38), ol(ellipse(0, -34, 8.5, 6), shade(GOLD, 0.15), 1, -0.45),
    ol(M(-28, -96) + L(28, -96) + Q(28, -52, 0, -48) + Q(-28, -52, -28, -96) + 'Z', GOLD, 1.4, -0.38), sh(M(8, -96) + L(28, -96) + Q(28, -52, 0, -48) + Q(12, -60, 8, -96) + 'Z', '#000000', { opacity: 0.12 }),
    ol(ellipse(0, -96, 28, 5), '#f9de7a', 1, -0.4), sh(ellipse(0, -96, 23, 3.3), shade(GOLD, -0.4)),
    ol(circle(0, -73, 5.2), '#e0465a', 0.8), ol(circle(-15, -76, 3.2), '#4a8fd6', 0.7), ol(circle(15, -76, 3.2), '#3fae8a', 0.7), hl(rect(-22, -90, 4, 30, 2), 0.5),
  ], s);
}

/** Pearl necklace lying in a loop, `s` wide. */
export function necklace(s: number): Shape[] {
  let pearls = '', gl = '';
  for (let i = 0; i < 28; i++) {
    const a = -90 + (i + 0.5) * (360 / 28), x = Math.cos(a * RAD) * 44 + Math.sin(a * RAD * 2) * 3, y = Math.sin(a * RAD) * 27 - 6;
    pearls += circle(x, y, 4.8); gl += circle(x - 1.4, y - 1.5, 1.4);
  }
  return fit([
    stroke(ellipse(0, -6, 44, 27), '#c9b79a', 1.2), sh(pearls, '#fdf6ea', { stroke: '#b9a58c', strokeWidth: 0.8 }), sh(gl, '#ffffff'),
    ol(rect(-5, -37, 10, 7, 2), GOLD, 0.8, -0.4), ol(M(0, 21) + Q(11, 34, 0, 44) + Q(-11, 34, 0, 21) + 'Z', '#4a8fd6', 1.2, -0.4), ol(circle(0, 22, 3.6), GOLD, 0.8, -0.4), hl(ellipse(-2.5, 33, 2, 4, 20), 0.6),
  ], s);
}

/** Half-unrolled treasure map `s` wide. */
export function mapScroll(s: number): Shape[] {
  const paper = '#f1dfb4';
  let dash = '';
  const path = smooth([[-28, 16], [-16, 8], [-4, 14], [8, 4], [20, 4]], 4);
  for (let i = 0; i < path.length - 1; i += 2) dash += line([path[i], path[i + 1]]);
  return fit([
    ol(poly([[-40, -27], [40, -31], [42, 27], [-38, 31]]), paper, 1.2, -0.3), sh(poly([[-40, -27], [-28, -27], [-27, 30], [-38, 31]]), '#000000', { opacity: 0.08 }),
    sh(blob([[-26, -12], [-12, -18], [2, -12], [-2, -2], [-18, 0]], 1), '#bcd08e'), stroke(blob([[-26, -12], [-12, -18], [2, -12], [-2, -2], [-18, 0]], 1), '#8aa064', 1),
    stroke(curve([[10, -20], [16, -23], [22, -20], [28, -23], [34, -20]]) + curve([[-30, 22], [-24, 19], [-18, 22], [-12, 19]]), '#6fa8c4', 1.3),
    stroke(dash, '#6b4a2e', 1.6), stroke(line([[21, -1], [31, 9]]) + line([[31, -1], [21, 9]]), '#d8493b', 2.6), sh(star(28, -10, 5, 1.6, 4), '#6b4a2e'),
    sh(leaf(-12, -10, 8, 2, -120) + leaf(-12, -10, 8, 2, -60) + leaf(-12, -10, 7, 2, -90), '#5f8a45'), stroke(line([[-12, -10], [-12, -5]]), '#6b4a2e', 1.2),
    ol(xf(rect(-49, -31, 11, 64, 5.5), { rot: -2 }), '#e3cc98', 1.2, -0.35), ol(xf(rect(38, -35, 11, 66, 5.5), { rot: -2 }), '#e3cc98', 1.2, -0.35),
    sh(ellipse(-42.5, -30, 5, 2.2) + ellipse(44.5, -33.5, 5, 2.2), '#b99e68'),
  ], s);
}

/** Old leather boot `s` tall; origin bottom-centre, toe to the right. */
export function boot(s: number): Shape[] {
  const lea = '#7b5236';
  let lace = '', stitch = '';
  for (let i = 0; i < 4; i++) lace += line([[-2, -72 + i * 9], [8, -68 + i * 9]]) + line([[-2, -68 + i * 9], [8, -72 + i * 9]]);
  for (let i = 0; i < 8; i++) stitch += line([[-22 + i * 9, -9], [-18 + i * 9, -9]]);
  return fit([
    ol(M(-26, -92) + L(6, -96) + L(8, -44) + Q(12, -30, 34, -26) + Q(52, -22, 52, -8) + L(52, -4) + L(-28, -4) + Q(-30, -40, -26, -92) + 'Z', lea, 1.4, -0.38),
    sh(blob([[28, -26], [46, -22], [52, -8], [30, -6]], 0.8), shade(lea, -0.22)), sh(rect(-30, -7, 84, 7, 3) + rect(-30, -7, 22, 9, 2), shade(lea, -0.55)),
    ol(poly([[-29, -94], [9, -99], [10, -80], [-28, -76]]), shade(lea, 0.2), 1.2), stroke(lace, '#e9dcc0', 1.4), stroke(stitch, '#e9dcc0', 1, { opacity: 0.8 }),
    ol(xf(rect(-20, -56, 15, 13, 2), { rot: 8, ox: -12, oy: -50 }), '#b0764a', 1), hl(rect(-22, -72, 4, 44, 2), 0.18), sh(circle(22, -20, 1.6) + circle(30, -14, 1.3) + circle(-16, -30, 1.5), '#efe6d2'),
  ], s);
}

/** Round brass porthole of radius `r` with dark glass. */
export function porthole(r: number, glass = '#143642'): Shape[] {
  let bolts = '';
  for (let i = 0; i < 8; i++) { const [x, y] = pp(0, 0, r * 0.86, i * 45 + 22); bolts += circle(x, y, r * 0.06); }
  return [
    sh(circle(0, 0, r * 0.74), glass), ol(sector(0, 0, r, 0, 360, r * 0.72), BRASS, 1.2, -0.4), sh(bolts, shade(BRASS, -0.4)),
    stroke(curve([pp(0, 0, r * 0.52, 200), pp(0, 0, r * 0.52, 235), pp(0, 0, r * 0.52, 270)]), '#ffffff', r * 0.08, { opacity: 0.35 }),
  ];
}

/** Wooden crate `s` wide; origin bottom-centre. */
export function crate(s: number, col = '#a9763f'): Shape[] {
  return fit([
    ol(rect(-50, -100, 100, 100, 3), col, 1.6, -0.38), sh(rect(-38, -88, 76, 76), shade(col, -0.14)), stroke(line([[-38, -62], [38, -62]]) + line([[-38, -38], [38, -38]]), shade(col, -0.35), 1.2),
    ol(poly([[-38, -88], [-26, -88], [38, -12], [26, -12]]), shade(col, 0.1), 1.2, -0.4), ol(rect(-50, -100, 100, 13, 2) + rect(-50, -13, 100, 13, 2), shade(col, 0.1), 1.2, -0.4),
    sh(circle(-44, -93.5, 1.8) + circle(44, -93.5, 1.8) + circle(-44, -6.5, 1.8) + circle(44, -6.5, 1.8), shade(col, -0.5)),
  ], s);
}

/** Clay amphora `s` tall; origin bottom-centre. */
export function amphora(s: number, col = '#c9794a'): Shape[] {
  return fit([
    stroke(M(-9, -84) + Q(-30, -84, -22, -58) + M(9, -84) + Q(30, -84, 22, -58), shade(col, -0.25), 5),
    ol(blob([[0, 0], [-16, -18], [-27, -50], [-17, -72], [-8, -80], [8, -80], [17, -72], [27, -50], [16, -18]], 0.9), col, 1.3, -0.35),
    ol(rect(-8, -94, 16, 16, 2), col, 1.2, -0.35), ol(rect(-12, -100, 24, 7, 3), shade(col, 0.15), 1.2, -0.4),
    stroke(curve([[-26, -52], [0, -47], [26, -52]]) + curve([[-23, -40], [0, -35], [23, -40]]), '#f1dfb4', 2), hl(ellipse(-13, -52, 3.5, 15, 8), 0.3),
  ], s);
}

/** Chain of links along a smooth path. */
export function chain(pts: Pt[], link = 12, col = IRON): Shape[] {
  const c = smooth(pts, 10);
  let a = '', b = '', acc = 0, k = 0;
  for (let i = 1; i < c.length; i++) {
    const dx = c[i][0] - c[i - 1][0], dy = c[i][1] - c[i - 1][1];
    acc += Math.hypot(dx, dy);
    if (acc < link * 0.72) continue;
    acc = 0;
    const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (k++ % 2) a += ellipse(c[i][0], c[i][1], link * 0.5, link * 0.3, ang); else b += ellipse(c[i][0], c[i][1], link * 0.5, link * 0.16, ang);
  }
  return [stroke(b, shade(col, -0.25), link * 0.2), stroke(a, col, link * 0.2)];
}

// =====================================================================
// shore props
// =====================================================================
/** Soft puffy cloud path centred on (x,y). */
export const cloud = (x: number, y: number, s: number) =>
  blob([[x - 80 * s, y + 10 * s], [x - 64 * s, y - 16 * s], [x - 30 * s, y - 30 * s], [x - 4 * s, y - 44 * s], [x + 34 * s, y - 36 * s], [x + 60 * s, y - 18 * s], [x + 84 * s, y + 8 * s], [x, y + 18 * s]], 1);

/** Seaside bucket `s` tall with a carry handle; origin bottom-centre. */
export function bucket(s: number, col = '#d8493b'): Shape[] {
  return fit([
    stroke(M(-41, -97) + Q(0, -152, 41, -97), '#e9edf0', 3.6), stroke(M(-41, -97) + Q(0, -152, 41, -97), '#9aa7b3', 1.2),
    ol(M(-42, -100) + L(42, -100) + L(32, 0) + Q(0, 8, -32, 0) + 'Z', col, 1.5, -0.35), sh(M(12, -100) + L(42, -100) + L(32, 0) + Q(20, 4, 10, 5) + 'Z', '#000000', { opacity: 0.13 }),
    sh(M(-39.5, -74) + L(39.5, -74) + L(38, -60) + L(-38, -60) + 'Z', '#fbf6ea'), sh(star(0, -34, 14, 6, 5), '#fbf6ea'),
    ol(ellipse(0, -100, 43.5, 9), shade(col, 0.22), 1.3, -0.45), sh(ellipse(0, -100, 38, 6.4), shade(col, -0.38)), sh(ellipse(0, -98.5, 35, 4.6), '#8fd4d9'),
    hl(ellipse(-10, -99, 12, 1.6), 0.6), sh(circle(-41.5, -97, 4.2) + circle(41.5, -97, 4.2), '#e9edf0', { stroke: '#8a959e', strokeWidth: 1 }), hl(poly([[-34, -92], [-29, -92], [-25, -8], [-28, -8]]), 0.4),
  ], s);
}

/** Long-handled dip net `s` long (handle left, hoop right). */
export function dipNet(s: number, col = '#3e8a7a'): Shape[] {
  let mesh = '';
  for (let i = 0; i < 9; i++) { mesh += line([[20 + i * 5.5, -17 + Math.abs(i - 3) * 0.6], [20 + i * 5.5 + 9, 17 - i * 0.6]]) + line([[20 + i * 5.5 + 9, -17 + i * 0.4], [20 + i * 5.5, 17 - Math.abs(i - 3) * 0.5]]); }
  return fit([
    ol(poly([[-78, -2.4], [20, -2], [20, 2], [-78, 2.4]]), '#d9b06a', 1.1, -0.38), stroke(line([[-40, -2.2], [-40, 2.2]]) + line([[-8, -2.1], [-8, 2.1]]), '#a8834a', 1.1),
    ol(rect(-80, -3.6, 20, 7.2, 3.5), col, 1), sh(blob([[20, -17], [48, -19], [70, -7], [68, 12], [44, 20], [20, 17]], 0.9), '#eef6f0', { opacity: 0.6 }),
    stroke(mesh, '#6f968c', 0.8, { opacity: 0.85 }), stroke(blob([[20, -17], [48, -19], [70, -7], [68, 12], [44, 20], [20, 17]], 0.9), '#6f968c', 1.2), stroke(ellipse(34, 0, 15, 18.5), col, 4),
    stroke(ellipse(33.4, -0.6, 15, 18.5), shade(col, 0.35), 1.1, { opacity: 0.8 }), sh(rect(16, -3.4, 7, 6.8, 2), shade(col, -0.2)),
  ], s);
}

/** Gull standing, `s` tall; origin at its feet, facing right. */
export function gull(s: number): Shape[] {
  return fit([
    stroke(line([[-4, -24], [-4, -1]]) + line([[6, -24], [6, -1]]), '#e8a23a', 2.8), sh(poly([[-6, -3], [6, 1], [-10, 1]]) + poly([[4, -3], [16, 1], [0, 1]]), '#e8a23a'),
    sh(poly([[-32, -40], [-54, -31], [-34, -26]]), '#3a3f47'), ol(blob([[-34, -34], [-18, -52], [10, -56], [24, -44], [18, -26], [-6, -20], [-26, -24]], 1), '#fbfaf5', 1.1, -0.22),
    ol(blob([[8, -50], [12, -72], [28, -72], [26, -44]], 1), '#fbfaf5', 1, -0.22), sh(blob([[8, -48], [14, -66], [24, -66], [24, -46]], 1), '#fbfaf5'),
    sh(ellipse(-2, -27, 18, 5), '#9aa7b3', { opacity: 0.3 }), ol(blob([[-31, -41], [-8, -53], [13, -45], [4, -32], [-20, -28]], 1), '#a3b0bc', 1, -0.3),
    sh(poly([[-31, -41], [-50, -34], [-22, -30]]), '#3a3f47'), stroke(curve([[-22, -38], [-6, -42], [8, -40]]) + curve([[-18, -33], [-4, -36], [4, -35]]), '#7f8c98', 1),
    ol(circle(20, -71, 11.5), '#fbfaf5', 1, -0.22), ol(M(29, -75) + L(47, -70) + Q(46, -65, 42, -66) + L(30, -65) + 'Z', '#f2b83a', 1, -0.35), sh(circle(39.5, -67.5, 1.5), '#d8493b'),
    sh(circle(23.5, -74, 2.2), '#2b2a33'), sh(circle(24.1, -74.6, 0.7), '#ffffff'),
  ], s);
}

/** Gull in flight, `s` wing tip to wing tip. */
export function flyingGull(s: number): Shape[] {
  const wl = M(-2, 0) + Q(-22, -24, -50, -8) + Q(-26, -10, -4, 6) + 'Z', wr = M(2, 0) + Q(22, -26, 50, -12) + Q(26, -12, 4, 6) + 'Z';
  return fit([
    ol(wl + wr, '#fbfaf5', 0.9, -0.25), sh(M(-4, -1) + Q(-22, -22, -42, -10) + Q(-24, -14, -6, 2) + 'Z' + M(4, -1) + Q(22, -24, 42, -13) + Q(24, -16, 6, 2) + 'Z', '#a3b0bc'),
    sh(poly([[-50, -8], [-38, -12], [-40, -6]]) + poly([[50, -12], [38, -15], [40, -9]]), '#3a3f47'), ol(ellipse(0, 3, 10, 5.5), '#fbfaf5', 0.9, -0.25),
    sh(poly([[-8, 2], [-17, 6], [-8, 6]]), '#fbfaf5'), sh(circle(9, 0, 4.4), '#fbfaf5'), sh(poly([[12, -1.5], [19, 0.5], [12, 2]]), '#f2b83a'), sh(circle(10, -0.8, 0.9), '#2b2a33'),
  ], s);
}

/** Red-and-white lighthouse `h` tall with a keeper's cottage; origin base-centre. */
export function lighthouse(h: number): Shape[] {
  const hw = (y: number) => 11 + (4 * y) / 70;
  const bandAt = (y0: number, y1: number) => poly([[-hw(y0), y0], [hw(y0), y0], [hw(y1), y1], [-hw(y1), y1]]);
  let rail = '';
  for (let x = -9; x <= 9; x += 3) rail += line([[x, -73], [x, -78]]);
  return fit([
    sh(poly([[4, -80], [70, -96], [70, -64]]) + poly([[-4, -80], [-70, -92], [-70, -68]]), '#fff6c8', { opacity: 0.22 }),
    ol(rect(13, -15, 24, 15), '#fbf6ea', 0.6), ol(poly([[10, -15], [25, -25], [40, -15]]), '#c8553f', 0.6), sh(rect(30, -26, 4, 8), '#8a5a4a'),
    sh(rect(17, -10, 5, 5) + rect(28, -10, 5, 5), '#8fb8cc'), sh(rect(23.4, -8, 3.6, 8), '#5a7aa8'),
    ol(poly([[-11, 0], [11, 0], [7, -70], [-7, -70]]), '#fbf6ea', 0.7, -0.25), sh(bandAt(-12, -26) + bandAt(-40, -54), '#d8493b'),
    sh(poly([[3, 0], [11, 0], [7, -70], [2, -70]]), '#000000', { opacity: 0.12 }), sh(rect(-3, -9, 6, 9, 3), '#3b3633'), sh(rect(-1.6, -35, 3.2, 5.5, 1.6) + rect(-1.4, -64, 2.8, 4.5, 1.4), '#3b4a5c'),
    sh(rect(-10.5, -73.5, 21, 3.5, 1), '#3b3633'), stroke(rail + line([[-10, -78], [10, -78]]), '#3b3633', 0.8),
    ol(rect(-5.5, -85, 11, 11.5), '#fff2a8', 0.7, -0.4), stroke(line([[-1.8, -85], [-1.8, -73.5]]) + line([[1.8, -85], [1.8, -73.5]]), '#3b3633', 0.7),
    ol(poly([[-8, -85], [8, -85], [0, -96]]), '#d8493b', 0.7), sh(circle(0, -97, 1.5), '#3b3633'), stroke(line([[0, -98], [0, -103]]), '#3b3633', 0.8),
  ], h);
}

/** Limpets scattered in a `w` × `h` box centred on the origin. */
export function limpets(seed: number, count: number, w: number, h: number, col = '#c9b79a', size = 9): Shape[] {
  const g = rng(seed);
  let base = '', rays = '', apex = '';
  for (let i = 0; i < count; i++) {
    const x = g.range(-w / 2, w / 2), y = g.range(-h / 2, h / 2), r = size * g.range(0.7, 1.2);
    base += ellipse(x, y, r, r * 0.8);
    for (let a = 0; a < 360; a += 40) rays += line([[x - r * 0.1, y - r * 0.12], [x + Math.cos(a * RAD) * r * 0.86, y + Math.sin(a * RAD) * r * 0.68]]);
    apex += circle(x - r * 0.1, y - r * 0.12, r * 0.22);
  }
  return [ol(base, col, 1, -0.35), stroke(rays, shade(col, -0.3), 0.8, { opacity: 0.8 }), sh(apex, shade(col, 0.35))];
}

/** Barnacle crust scattered in a `w` × `h` box centred on the origin. */
export function barnacles(seed: number, count: number, w: number, h: number, size = 4): Shape[] {
  const g = rng(seed);
  let a = '', b = '';
  for (let i = 0; i < count; i++) { const x = g.range(-w / 2, w / 2), y = g.range(-h / 2, h / 2), r = size * g.range(0.6, 1.2); a += circle(x, y, r); b += ellipse(x, y, r * 0.42, r * 0.26, g.range(0, 180)); }
  return [sh(a, '#e9e2d0', { stroke: '#a89f8c', strokeWidth: 0.7 }), sh(b, '#5a5348')];
}

/** Cluster of blue-black mussels in a `w` × `h` box centred on the origin. */
export function mussels(seed: number, count: number, w: number, h: number, size = 16): Shape[] {
  const g = rng(seed);
  let a = '', b = '';
  for (let i = 0; i < count; i++) {
    const x = g.range(-w / 2, w / 2), y = g.range(-h / 2, h / 2), len = size * g.range(0.8, 1.2), rot = -90 + g.range(-40, 40);
    a += leaf(x, y, len, len * 0.38, rot);
    b += xf(leaf(x, y, len * 0.7, len * 0.1, rot), { x: -len * 0.07, y: -len * 0.03 });
  }
  return [ol(a, '#2f3b5c', 1, -0.4), sh(b, '#7f8fc0', { opacity: 0.7 })];
}

/** Pair of rubber boots `s` tall; origin bottom-centre. */
export function wellies(s: number, col = '#f2c230'): Shape[] {
  const one = (x: number, y: number, c: string): Shape[] => place([
    ol(M(-12, -80) + L(11, -80) + L(11, -30) + Q(13, -18, 28, -16) + Q(39, -14, 39, -6) + L(39, -2) + L(-14, -2) + Q(-15, -40, -12, -80) + 'Z', c, 1.4, -0.35),
    sh(rect(-15, -5, 55, 5.5, 2) + rect(-15, -5, 14, 7.5, 2), shade(c, -0.5)), ol(rect(-13.5, -84, 26, 8, 3), shade(c, 0.25), 1.2, -0.45), sh(ellipse(-0.5, -84, 10, 2.2), shade(c, -0.45)),
    hl(rect(-9, -70, 3.6, 44, 1.8), 0.4), stroke(curve([[11, -30], [20, -22], [34, -17]]), shade(c, -0.3), 1.2),
  ], { x, y });
  return fit([...one(-18, -6, shade(col, -0.08)), ...one(12, 0, col)], s);
}

/** Little sailing boat `s` wide; origin on the waterline. */
export function sailboat(s: number, hull: string, sail: string, sail2: string): Shape[] {
  return fit([
    stroke(line([[0, -96], [0, -8]]), '#5a4434', 2), sh(poly([[0, -96], [14, -92], [0, -88]]), '#d8493b'),
    ol(poly([[3, -90], [3, -16], [42, -16]]), sail, 1, -0.2), ol(poly([[-3, -80], [-3, -16], [-36, -16]]), sail2, 1, -0.25), stroke(line([[3, -52], [26, -34]]) + line([[3, -34], [34, -22]]), shade(sail, -0.15), 1),
    ol(M(-44, -10) + L(46, -10) + Q(36, 6, 20, 6) + L(-30, 6) + Q(-40, 4, -44, -10) + 'Z', hull, 1.2), sh(rect(-42, -10, 86, 3.4), '#fbf6ea'),
    stroke(line([[-36, 11], [-14, 11]]) + line([[-4, 14], [26, 14]]) + line([[-22, 18], [4, 18]]), '#ffffff', 1.6, { opacity: 0.6 }),
  ], s);
}

/** Toy beach spade `s` long, blade down. */
export function spade(s: number, col = '#3f7fc4'): Shape[] {
  return fit([
    ol(rect(-3, -36, 6, 54, 2), '#e3b76a', 1.1, -0.38), ol(sector(0, -43, 10, 0, 360, 5.4), col, 1.2), ol(rect(-9, -37, 18, 5, 2), col, 1),
    ol(M(-17, 14) + L(17, 14) + L(15, 38) + Q(0, 54, -15, 38) + 'Z', col, 1.4), ol(rect(-17.5, 11, 35, 6, 2), shade(col, -0.15), 1), hl(poly([[-12, 19], [-8, 19], [-7, 40], [-10, 38]]), 0.4),
  ], s);
}

/** Open sea anemone seen from above, radius `r`. */
export function poolAnemone(seed: number, r: number, col: string): Shape[] {
  const g = rng(seed);
  let outer = '', inner = '';
  for (let i = 0; i < 18; i++) { const a = i * 20 + g.range(-4, 4), [x, y] = pp(0, 0, 12, a); outer += petal(x, y, g.range(32, 40), 5.5, a); }
  for (let i = 0; i < 13; i++) { const a = i * 27.7 + 9 + g.range(-4, 4), [x, y] = pp(0, 0, 8, a); inner += petal(x, y, g.range(20, 27), 5, a); }
  return fit([sh(outer, shade(col, -0.16)), sh(inner, col), ol(circle(0, 0, 13), shade(col, 0.3), 1), sh(ellipse(0, 0, 4.4, 2.2), shade(col, -0.5))], r * 2);
}

/** Small fish seen from above, `s` long, heading right. */
export function goby(s: number, col: string): Shape[] {
  return fit([
    sh(poly([[-30, 0], [-50, -10], [-46, 0], [-50, 10]]) + leaf(6, -6, 16, 4, -140) + leaf(6, 6, 16, 4, 140), shade(col, 0.2), { opacity: 0.85 }),
    sh(leaf(-36, 0, 80, 11, 0), col), stroke(line([[-24, 0], [26, 0]]), shade(col, -0.3), 1.6, { opacity: 0.6 }), sh(circle(30, -4, 2) + circle(30, 4, 2), '#22303a'),
  ], s);
}

/** Weathered driftwood log `s` long. */
export function driftwood(s: number, col = '#b9a58c'): Shape[] {
  return fit([
    ol(taper([[12, -3], [22, -17], [31, -24]], 7, 3.5, 4), col, 1), ol(tube([[-50, 0], [-20, -5], [14, 3], [50, -2]], [14, 13, 12, 8], 6), col, 1.2),
    stroke(curve([[-40, -3], [-14, -8], [14, 0], [40, -4]]) + curve([[-36, 3], [-10, -1], [20, 6]]) + curve([[-20, -2], [0, -1], [24, 3]]), shade(col, -0.28), 1, { opacity: 0.8 }),
    ol(ellipse(-50, 0, 3.6, 7), shade(col, 0.2), 1), stroke(ellipse(-50, 0, 1.6, 3.4), shade(col, -0.3), 0.8), sh(ellipse(2, -1, 2.6, 1.6), shade(col, -0.4)),
  ], s);
}

/** Frosted sea-glass pieces scattered in a `w` × `h` box centred on the origin. */
export function seaGlass(seed: number, count: number, w: number, h: number): Shape[] {
  const g = rng(seed);
  const cols = ['#7fc9a8', '#8fc7e0', '#d9b06a', '#b9e0d2'];
  const by = cols.map(() => '');
  let hls = '';
  for (let i = 0; i < count; i++) {
    const x = g.range(-w / 2, w / 2), y = g.range(-h / 2, h / 2), r = g.range(4, 7), a = g.range(0, 90);
    by[i % cols.length] += xf(blob([[x - r, y], [x - r * 0.2, y - r * 0.7], [x + r, y - r * 0.2], [x + r * 0.5, y + r * 0.7], [x - r * 0.5, y + r * 0.6]], 0.7), { rot: a, ox: x, oy: y });
    hls += ellipse(x - r * 0.2, y - r * 0.2, r * 0.3, r * 0.14, -30);
  }
  return [...cols.map((c, i) => sh(by[i], c, { stroke: shade(c, -0.25), strokeWidth: 0.8 })), hl(hls, 0.6)].filter((p) => p.d);
}

/** Ribbon of kelp draped flat, following the points. */
export function kelpFrond(pts: Pt[], wid: number, col: string): Shape[] {
  const c = smooth(pts, 4);
  let ruffle = '';
  c.forEach(([x, y], i) => { if (i % 2 && i < c.length - 1) ruffle += circle(x + wid * 0.28, y - wid * 0.2, wid * 0.13); });
  return [ol(tube(pts, [wid * 0.3, wid, wid * 1.1, wid * 0.8, wid * 0.3], 6), col, 1, -0.3), stroke(curve(pts), shade(col, 0.3), wid * 0.14, { opacity: 0.8 }), sh(ruffle, shade(col, -0.25), { opacity: 0.6 })];
}

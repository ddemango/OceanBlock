// Shared props for the Fairytale Kingdom hidden-object scenes. Every prop is
// drawn around the origin (usually standing on y = 0) and returns Shape[];
// position it with place(). All motifs are generic, public-domain fairytale
// objects in an original flat storybook style.
import { blob, circle, curve, ellipse, leaf, line, mix, petal, place, poly, rect, rng, sector, sh, shade, star, stroke } from '../../art/kit';
import type { Shape } from '../../art/types';

export type Pt = [number, number];
const n = (v: number) => String(Math.round(v * 10) / 10);
export const M = (x: number, y: number) => `M${n(x)} ${n(y)}`;
export const L = (x: number, y: number) => `L${n(x)} ${n(y)}`;
export const Q = (cx: number, cy: number, x: number, y: number) => `Q${n(cx)} ${n(cy)} ${n(x)} ${n(y)}`;
export const C = (a: number, b: number, c: number, d: number, x: number, y: number) => `C${n(a)} ${n(b)} ${n(c)} ${n(d)} ${n(x)} ${n(y)}`;

/** Filled shape with a darker outline of the same hue. */
export const ol = (d: string, fill: string, w = 1.2, amt = -0.35): Shape => sh(d, fill, { stroke: shade(fill, amt), strokeWidth: w });
export const shadow = (cx: number, cy: number, rx: number, ry: number, op = 0.22): Shape => sh(ellipse(cx, cy, rx, ry), '#2a1a2e', { opacity: op });
export const hl = (d: string, op = 0.5): Shape => sh(d, '#ffffff', { opacity: op });
/** Soft layered glow. */
export const glow = (cx: number, cy: number, r: number, col: string, op = 0.3): Shape[] => [
  sh(circle(cx, cy, r), col, { opacity: op * 0.35 }), sh(circle(cx, cy, r * 0.62), col, { opacity: op * 0.5 }), sh(circle(cx, cy, r * 0.32), col, { opacity: op * 0.8 }),
];
/** Four-pointed twinkle. */
export const twinkle = (x: number, y: number, r: number) => star(x, y, r, r * 0.22, 4);

export const GOLD = '#dcab3e';
export const GOLD_DK = '#a67a22';
export const GOLD_LT = '#f3d27a';

/** Round-topped arch standing on `base`. */
export function arch(cx: number, base: number, w: number, h: number): string {
  const r = w / 2, k = 0.5523 * r, top = base - h, sp = top + r;
  return M(cx - r, base) + L(cx - r, sp) + C(cx - r, sp - k, cx - k, top, cx, top) + C(cx + k, top, cx + r, sp - k, cx + r, sp) + L(cx + r, base) + 'Z';
}
/** Pointed (gothic) arch standing on `base`. */
export function pointedArch(cx: number, base: number, w: number, h: number): string {
  const r = w / 2, top = base - h, sp = top + r * 1.1;
  return M(cx - r, base) + L(cx - r, sp) + Q(cx - r, top + r * 0.25, cx, top) + Q(cx + r, top + r * 0.25, cx + r, sp) + L(cx + r, base) + 'Z';
}
const interp = (pts: Pt[], x: number) => {
  for (let i = 0; i < pts.length - 1; i++) if (x >= pts[i][0] && x <= pts[i + 1][0]) return pts[i][1] + ((pts[i + 1][1] - pts[i][1]) * (x - pts[i][0])) / (pts[i + 1][0] - pts[i][0]);
  return x < pts[0][0] ? pts[0][1] : pts[pts.length - 1][1];
};

// =====================================================================
// royal things
// =====================================================================
export function crown(col = GOLD, gem = '#c8324a'): Shape[] {
  return [
    ol(poly([[-28, -10], [-35, -40], [-18, -24], [-9, -47], [0, -27], [9, -47], [18, -24], [35, -40], [28, -10]]), col, 1.4),
    sh(poly([[-26, -14], [-31, -33], [-18, -21], [-12, -14]]), shade(col, 0.3)),
    ol(rect(-30, -17, 60, 17, 3), col, 1.4),
    stroke(line([[-29, -5], [29, -5]]), shade(col, -0.3), 1),
    sh(circle(-35, -41, 4) + circle(-9, -48, 4) + circle(9, -48, 4) + circle(35, -41, 4), '#fbf3e4', { stroke: '#d8c8a8', strokeWidth: 0.8 }),
    ol(poly([[0, -15], [6, -9], [0, -3], [-6, -9]]), gem, 1),
    sh(circle(-18, -9, 3.5), '#3f6fc4'), sh(circle(18, -9, 3.5), '#3f9a6a'), sh(circle(0, -33, 3.5), gem),
    hl(ellipse(-15, -13, 8, 1.4), 0.55),
  ];
}

export function crownOnCushion(cush = '#a8324a'): Shape[] {
  const out: Shape[] = [shadow(0, 2, 62, 8)];
  for (const x of [-56, 56]) out.push(stroke(curve([[x, -10], [x + (x < 0 ? -4 : 4), 0], [x + (x < 0 ? -4 : 4), 6]]), GOLD, 2.4), sh(petal(x + (x < 0 ? -4 : 4), 4, 14, 4.5, 90), GOLD));
  out.push(ol(blob([[-58, -6], [-60, -18], [-48, -32], [0, -27], [48, -32], [60, -18], [58, -6], [0, 2]], 0.8), cush, 1.4));
  out.push(sh(blob([[-46, -28], [0, -24], [46, -28], [38, -16], [0, -13], [-38, -16]], 0.8), shade(cush, 0.18)));
  out.push(stroke(curve([[-58, -8], [0, 0], [58, -8]]), GOLD, 2.2), stroke(curve([[-48, -31], [0, -26], [48, -31]]), GOLD, 1.6));
  out.push(...place(crown(), { y: -16, s: 0.85 }));
  return out;
}

export function glassSlipper(): Shape[] {
  const g = '#cfeaf6', e = '#6fa4c0';
  return [
    shadow(-2, 1, 40, 5, 0.2),
    sh(poly([[21, -10], [31, -13], [28, 0], [25, 0]]), '#a9d4e6', { stroke: e, strokeWidth: 1 }),
    sh(blob([[-40, -3], [-42, -11], [-32, -17], [-12, -19], [8, -24], [22, -34], [32, -35], [35, -24], [31, -12], [18, -7], [-2, -3]], 0.55), g, { stroke: e, strokeWidth: 1.5 }),
    sh(ellipse(10, -26, 19, 5, -22), '#8ec4dc'),
    sh(ellipse(9, -25.5, 15, 3.2, -22), '#e6f6fc'),
    sh(blob([[-34, -12], [-14, -16], [-12, -14], [-32, -9]]), '#ffffff', { opacity: 0.85 }),
    hl(ellipse(30, -23, 2.2, 8, 10), 0.7),
    sh(petal(-30, -15, 8, 3.5, 200) + petal(-30, -15, 8, 3.5, 150), '#9fcfe4', { stroke: e, strokeWidth: 0.8 }),
    sh(twinkle(-22, -24, 7) + twinkle(36, -41, 6) + twinkle(-44, -18, 4), '#ffffff'),
  ];
}

export function harp(col = GOLD): Shape[] {
  const out: Shape[] = [shadow(8, 2, 52, 6)];
  const sb = (x: number) => -3 - 1.635 * (x + 22);
  const neck: Pt[] = [[-36, -162], [-12, -168], [14, -150], [36, -130], [56, -128]];
  out.push(ol(poly([[-32, -4], [-14, -1], [60, -122], [46, -131]]), shade(col, -0.1), 1.4, -0.4));
  out.push(stroke(line([[-22, -4], [52, -126]]), shade(col, -0.35), 1.2));
  let s = '';
  for (let x = -26; x <= 46; x += 6) { const y0 = interp(neck, x) + 5, y1 = sb(x) - 1; if (y1 - y0 > 10) s += line([[x, y0], [x, y1]]); }
  out.push(stroke(s, '#fbf0d8', 1));
  out.push(stroke(curve(neck), shade(col, -0.35), 12), stroke(curve(neck), col, 8), stroke(curve(neck.map(([x, y]) => [x, y - 2] as Pt)), shade(col, 0.35), 2));
  out.push(ol(rect(-41, -164, 10, 156, 4), col, 1.2), sh(rect(-38, -158, 3, 144), shade(col, 0.35)));
  out.push(ol(ellipse(-36, -168, 9, 7), col, 1.2), ol(blob([[-46, -8], [-44, -14], [20, -14], [24, -8], [20, 0], [-44, 0]], 0.5), shade(col, -0.15), 1.2));
  out.push(stroke(curve([[56, -128], [64, -136], [58, -142], [52, -136]]), col, 4));
  out.push(sh(circle(-36, -168, 3), '#c8324a'));
  return out;
}

export function throne(vel = '#7a2a4a', gold = GOLD): Shape[] {
  const out: Shape[] = [shadow(0, 2, 72, 9)];
  out.push(ol(rect(-62, -190, 13, 190, 4), gold, 1.4), ol(rect(49, -190, 13, 190, 4), gold, 1.4));
  out.push(ol(circle(-55.5, -198, 9), gold, 1.2), ol(circle(55.5, -198, 9), gold, 1.2));
  out.push(ol(arch(0, -74, 104, 186), gold, 1.4));
  out.push(sh(arch(0, -80, 86, 168), vel));
  let tuft = '';
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) tuft += circle(-24 + c * 24 + (r % 2 ? 12 : 0) - (r % 2 && c === 2 ? 48 : 0), -112 - r * 28, 2.4);
  out.push(sh(tuft, shade(vel, -0.35)));
  out.push(sh(arch(-10, -90, 26, 140), shade(vel, 0.12), { opacity: 0.6 }));
  out.push(...place(crown(gold, '#3f6fc4'), { y: -250, s: 0.55 }));
  out.push(ol(rect(-70, -108, 26, 12, 6), gold, 1.2), ol(rect(44, -108, 26, 12, 6), gold, 1.2));
  out.push(ol(rect(-60, -84, 120, 24, 9), vel, 1.4), sh(rect(-52, -82, 104, 6, 3), shade(vel, 0.2)));
  out.push(ol(rect(-56, -62, 112, 24, 4), shade(gold, -0.1), 1.2), stroke(curve([[-40, -50], [-20, -56], [0, -48], [20, -56], [40, -50]]), shade(gold, -0.4), 1.4));
  out.push(ol(rect(-54, -40, 12, 40, 3), gold, 1.2), ol(rect(42, -40, 12, 40, 3), gold, 1.2), sh(ellipse(-48, -2, 9, 4) + ellipse(48, -2, 9, 4), shade(gold, -0.3)));
  return out;
}

export function banner(w: number, h: number, col: string, emblem: 'star' | 'moon' | 'sun' | 'crown', trim = GOLD): Shape[] {
  const out: Shape[] = [];
  out.push(ol(poly([[-w / 2, 0], [w / 2, 0], [w / 2, h], [0, h - w * 0.32], [-w / 2, h]]), col, 1.2));
  out.push(sh(poly([[w * 0.2, 0], [w / 2, 0], [w / 2, h], [w * 0.2, h - w * 0.2]]), shade(col, -0.15)));
  out.push(stroke(line([[-w / 2 + 6, 8], [-w / 2 + 6, h - 8], [0, h - w * 0.32 - 8], [w / 2 - 6, h - 8], [w / 2 - 6, 8]]), trim, 2.4));
  const cy = h * 0.42;
  if (emblem === 'star') out.push(ol(star(0, cy, w * 0.27, w * 0.11, 5), trim, 1));
  else if (emblem === 'moon') out.push(sh(circle(0, cy, w * 0.24), trim), sh(circle(w * 0.1, cy - w * 0.05, w * 0.2), col), sh(twinkle(w * 0.15, cy + w * 0.12, w * 0.08), trim));
  else if (emblem === 'sun') { let p = ''; for (let k = 0; k < 12; k++) p += petal(0, cy, w * 0.3, w * 0.05, k * 30); out.push(sh(p, trim), sh(circle(0, cy, w * 0.14), shade(trim, 0.2), { stroke: trim, strokeWidth: 1 })); }
  else out.push(...place(crown(trim, shade(col, -0.3)), { y: cy + w * 0.17, s: w / 160 }));
  out.push(ol(rect(-w / 2 - 14, -6, w + 28, 7, 3.5), shade(trim, -0.1), 1), sh(circle(-w / 2 - 16, -2.5, 5) + circle(w / 2 + 16, -2.5, 5), trim));
  out.push(sh(petal(-w / 2, h, 14, 3.5, 90) + petal(w / 2, h, 14, 3.5, 90) + petal(0, h - w * 0.32, 14, 3.5, 90), trim));
  return out;
}

export function candle(h: number, col = '#f6eedb'): Shape[] {
  return [
    ...glow(0, -h - 9, 20, '#ffd98a', 0.45),
    ol(rect(-4.5, -h, 9, h, 2), col, 0.8, -0.2),
    sh(blob([[-4.5, -h + 1], [-2, -h + 9], [0, -h + 3], [4.5, -h + 1]], 0.6), shade(col, 0.4)),
    stroke(line([[0, -h], [0, -h - 4]]), '#3a2a20', 1),
    sh(petal(0, -h - 3, 13, 4.5, -90), '#f7a73b'),
    sh(petal(0, -h - 3, 8, 2.6, -90), '#fff1b0'),
  ];
}

export function candelabra(col = GOLD): Shape[] {
  const out: Shape[] = [shadow(0, 1, 26, 4)];
  out.push(ol(blob([[-20, 0], [-14, -8], [14, -8], [20, 0]], 0.5), col, 1), ol(rect(-3, -60, 6, 54, 2), col, 1), ol(ellipse(0, -36, 6, 4), col, 1));
  out.push(stroke(curve([[0, -58], [-26, -58], [-30, -74]]) + curve([[0, -58], [26, -58], [30, -74]]), shade(col, -0.3), 5), stroke(curve([[0, -58], [-26, -58], [-30, -74]]) + curve([[0, -58], [26, -58], [30, -74]]), col, 3));
  for (const x of [-30, 0, 30]) out.push(ol(ellipse(x, -76 - (x ? 0 : 10), 7, 2.5), col, 0.8), ...place(candle(x ? 22 : 26), { x, y: -77 - (x ? 0 : 10) }));
  return out;
}

export function chandelier(w: number, col = GOLD): Shape[] {
  const out: Shape[] = [];
  const ry = w * 0.14, cy = 120;
  out.push(stroke(line([[0, 0], [0, 70]]), shade(col, -0.3), 3));
  let links = '';
  for (let y = 4; y < 70; y += 9) links += ellipse(0, y, 3, 4.5);
  out.push(stroke(links, col, 1.4));
  // back half ring
  out.push(stroke(curve([[-w / 2, cy], [-w * 0.3, cy - ry * 0.9], [0, cy - ry], [w * 0.3, cy - ry * 0.9], [w / 2, cy]]), shade(col, -0.3), 4));
  // drops
  const g = rng(Math.round(w));
  let drops = '', drops2 = '';
  for (let k = 0; k <= 12; k++) {
    const a = Math.PI * (k / 12), x = -Math.cos(a) * w / 2, y = cy + Math.sin(a) * ry;
    const d = leaf(x, y + 2, 16 + g.range(0, 8), 4, 90);
    if (k % 2) drops += d; else drops2 += d;
  }
  out.push(sh(drops, '#e6f4fb', { opacity: 0.9 }), sh(drops2, '#bfe1f0', { opacity: 0.9 }));
  // arms
  let arms = '';
  for (const t of [-1, -0.5, 0.5, 1]) arms += curve([[0, cy + 6], [t * w * 0.25, cy + 20], [t * w * 0.45, cy + ry * 0.4], [t * w * 0.48, cy - 8]]);
  out.push(stroke(arms, shade(col, -0.3), 5), stroke(arms, col, 3));
  out.push(ol(blob([[-w * 0.14, cy - 6], [w * 0.14, cy - 6], [w * 0.06, cy + 34], [0, cy + 48], [-w * 0.06, cy + 34]], 0.8), col, 1.4));
  out.push(ol(ellipse(0, cy - 22, 10, 8), col, 1), ol(rect(-4, cy - 70, 8, 50, 3), col, 1), sh(leaf(0, cy + 48, 22, 6, 90), '#cfeaf6'));
  // front half ring
  out.push(stroke(curve([[-w / 2, cy], [-w * 0.3, cy + ry * 0.9], [0, cy + ry], [w * 0.3, cy + ry * 0.9], [w / 2, cy]]), shade(col, -0.3), 7), stroke(curve([[-w / 2, cy], [-w * 0.3, cy + ry * 0.9], [0, cy + ry], [w * 0.3, cy + ry * 0.9], [w / 2, cy]]), col, 4));
  // candles on ring
  for (const k of [0, 1, 2, 3, 4, 5, 6]) {
    const a = Math.PI * (k / 6), x = -Math.cos(a) * w / 2, y = cy + Math.sin(a) * ry * 0.95;
    out.push(ol(ellipse(x, y - 2, 7, 2.5), col, 0.8), ...place(candle(20), { x, y: y - 3 }));
  }
  return out;
}

export function tieredCake(icing = '#fbe9ee', deco = '#e0607e'): Shape[] {
  const out: Shape[] = [shadow(0, 2, 56, 6)];
  out.push(ol(blob([[-54, 0], [-48, -8], [48, -8], [54, 0], [0, 4]], 0.6), GOLD, 1), ol(rect(-6, -14, 12, 8, 2), GOLD, 1), ol(ellipse(0, -15, 48, 5), GOLD_LT, 1, -0.4));
  const tiers: [number, number, number][] = [[50, 34, -16], [38, 28, -50], [26, 24, -78]];
  tiers.forEach(([hw, h, y], i) => {
    out.push(ol(rect(-hw, y - h, hw * 2, h, 4), i === 1 ? mix(icing, '#f3c6d2', 0.6) : icing, 1, -0.15));
    let sc = '';
    for (let x = -hw + 6; x <= hw - 4; x += 10) sc += ellipse(x, y - h + 2, 5.5, 4 + (x % 20 ? 1 : 3));
    out.push(sh(sc + rect(-hw, y - h, hw * 2, 3, 2), '#ffffff'));
    let beads = '';
    for (let x = -hw + 5; x <= hw - 4; x += 8) beads += circle(x, y - 2.5, 2.2);
    out.push(sh(beads, i === 1 ? '#ffffff' : '#f3c6d2'));
  });
  out.push(sh(circle(-20, -30, 4) + circle(14, -36, 4) + circle(-8, -62, 3.5) + circle(22, -60, 3.5) + circle(32, -26, 4), deco));
  out.push(sh(leaf(-24, -30, 7, 2.5, 160) + leaf(18, -36, 7, 2.5, 20) + leaf(36, -26, 7, 2.5, 20), '#6f9a5a'));
  out.push(...place(candle(14, '#f3c6d2'), { y: -102 }));
  out.push(sh(circle(-10, -104, 5) + circle(10, -104, 5), deco), sh(circle(-10, -105, 2) + circle(10, -105, 2), '#ffffff', { opacity: 0.6 }));
  return out;
}

export function goblet(col = GOLD, gem = '#c8324a'): Shape[] {
  return [
    shadow(0, 1, 16, 3),
    ol(blob([[-14, 0], [-10, -5], [10, -5], [14, 0]], 0.6), col, 1),
    ol(rect(-2.5, -26, 5, 22, 1.5), col, 1), ol(ellipse(0, -16, 5, 3), col, 1),
    ol(blob([[-16, -54], [16, -54], [12, -34], [0, -26], [-12, -34]], 0.7), col, 1.2),
    sh(ellipse(0, -54, 16, 3.5), '#7a1a2e'),
    sh(circle(0, -41, 3.2), gem), hl(blob([[-12, -50], [-8, -50], [-5, -34], [-8, -36]]), 0.55),
  ];
}

export function teapot(col = '#f4efe6', accent = '#5f8fc8'): Shape[] {
  return [
    shadow(0, 1, 36, 5),
    stroke(curve([[26, -36], [44, -36], [42, -12], [24, -10]]), shade(col, -0.25), 6),
    sh(poly([[-26, -22], [-46, -44], [-50, -42], [-30, -10]]), col, { stroke: shade(col, -0.25), strokeWidth: 1 }),
    ol(ellipse(0, -24, 30, 24), col, 1.2, -0.25),
    sh(ellipse(8, -22, 14, 18), shade(col, -0.08), { opacity: 0.7 }),
    stroke(curve([[-28, -18], [0, -12], [28, -18]]), accent, 3),
    sh(circle(-12, -28, 4) + circle(0, -26, 4) + circle(12, -28, 4), accent),
    ol(ellipse(0, -46, 18, 5), col, 1, -0.25), ol(circle(0, -53, 5), accent, 1),
    hl(ellipse(-14, -34, 5, 8, -20), 0.6),
  ];
}

export function giftBox(col = '#4f86c6', ribbon = '#e8b938'): Shape[] {
  return [
    shadow(0, 1, 34, 5),
    ol(rect(-28, -40, 56, 40, 2), col, 1.2), sh(rect(8, -40, 20, 40, 2), shade(col, -0.12)),
    ol(rect(-32, -50, 64, 12, 2), shade(col, 0.1), 1.2),
    sh(rect(-5, -50, 10, 50), ribbon), sh(rect(-32, -47, 64, 6), ribbon),
    ol(blob([[0, -50], [-20, -66], [-26, -56], [-12, -50]], 0.8) + blob([[0, -50], [20, -66], [26, -56], [12, -50]], 0.8), ribbon, 1),
    ol(circle(0, -51, 4.5), shade(ribbon, -0.1), 1),
    sh(circle(-16, -22, 2.5) + circle(-4, -12, 2.5) + circle(18, -26, 2.5) + circle(16, -10, 2.5), '#ffffff', { opacity: 0.7 }),
  ];
}

export function mask(col = '#5a3f9a', trim = GOLD): Shape[] {
  return [
    stroke(line([[30, 8], [52, 64]]), shade(trim, -0.2), 4), sh(circle(52, 65, 3.5), trim),
    sh(leaf(36, -12, 44, 8, -64) + leaf(38, -10, 38, 7, -40), '#e8708e'), sh(leaf(36, -12, 40, 5, -82), '#f3c4cf'),
    stroke(line([[36, -12], [52, -52]]), '#b04a68', 0.9),
    sh(blob([[-40, -6], [-34, -16], [-14, -14], [0, -8], [14, -14], [34, -16], [40, -6], [30, 10], [12, 10], [0, 4], [-12, 10], [-30, 10]], 0.6), col, { stroke: trim, strokeWidth: 2.4 }),
    sh(ellipse(-17, -2, 9, 5, -8) + ellipse(17, -2, 9, 5, 8), '#24162e'),
    sh(circle(0, -6, 2.8) + circle(-30, 0, 1.6) + circle(30, 0, 1.6), trim),
    hl(ellipse(-26, -10, 7, 1.6, -10), 0.4),
  ];
}

export function fan(col = '#f2c9d4', lace = '#ffffff'): Shape[] {
  const out: Shape[] = [];
  let a = '', b = '', ribs = '', sc = '';
  for (let k = 0; k < 10; k++) {
    const a0 = 200 + k * 14, a1 = a0 + 14;
    const d = sector(0, 0, 48, a0, a1, 10);
    if (k % 2) a += d; else b += d;
    const r = ((a0 + 7) * Math.PI) / 180;
    ribs += line([[Math.cos(r) * 10, Math.sin(r) * 10], [Math.cos(r) * 47, Math.sin(r) * 47]]);
    sc += circle(Math.cos(r) * 49, Math.sin(r) * 49, 4.5);
  }
  out.push(sh(sc, lace), sh(a, col), sh(b, shade(col, -0.1)), stroke(ribs, shade(col, -0.35), 0.9));
  let fl = '';
  for (let k = 0; k < 5; k++) fl += petal(0, -30, 7, 3, k * 72);
  out.push(sh(fl, '#c8324a'), sh(circle(0, -30, 2.4), GOLD));
  out.push(ol(blob([[-6, 0], [6, 0], [3, 12], [-3, 12]], 0.4), '#8a5a3a', 1), stroke(curve([[0, 12], [6, 22], [0, 30]]), GOLD, 1.6), sh(petal(0, 30, 10, 3, 90), GOLD));
  return out;
}

export function rose(): Shape[] {
  return [
    stroke(curve([[0, 0], [10, 24], [16, 54]]), '#3f6a3a', 3),
    sh(leaf(8, 22, 18, 6, 30) + leaf(12, 36, 16, 5, 150), '#5f8f4a'),
    stroke(line([[8, 22], [22, 30]]) + line([[12, 36], [-2, 44]]), '#3f6a3a', 0.8),
    sh(blob([[-14, -4], [-10, -16], [4, -18], [14, -8], [10, 6], [-6, 8]], 0.9), '#b8203a'),
    sh(blob([[-8, -6], [-4, -13], [6, -12], [8, -4], [2, 3], [-6, 2]], 0.9), '#d8344e'),
    stroke(curve([[-2, -8], [3, -9], [4, -4], [0, -2], [-2, -5]]), '#8a1428', 1.2),
    sh(leaf(-6, 6, 10, 4, 120) + leaf(6, 6, 10, 4, 60), '#5f8f4a'),
  ];
}

export function violin(): Shape[] {
  const body = '#b8642a', dk = '#7a3a18';
  return [
    shadow(0, 4, 26, 8, 0.15),
    stroke(line([[-36, 30], [38, -50]]), '#6a4a2a', 2.2), stroke(line([[-34, 28], [36, -48]]), '#f3ead2', 0.8),
    ol(blob([[0, -40], [16, -38], [18, -22], [10, -12], [20, 0], [20, 22], [0, 30], [-20, 22], [-20, 0], [-10, -12], [-18, -22], [-16, -38]], 0.8), body, 1.4, -0.4),
    sh(blob([[4, -34], [14, -32], [14, -22], [8, -14], [16, -2], [14, 18], [6, 22], [6, -10]], 0.8), shade(body, 0.2), { opacity: 0.6 }),
    ol(rect(-3.5, -78, 7, 76, 2), '#2a1a12', 1),
    stroke(curve([[-7, -4], [-9, -2], [-7, 4], [-9, 8]]) + curve([[7, -4], [9, -2], [7, 4], [9, 8]]), dk, 1.6),
    ol(rect(-8, 14, 16, 4, 1), '#2a1a12', 0.8),
    ol(blob([[-4, -78], [4, -78], [6, -86], [0, -94], [-6, -88]], 0.8), body, 1, -0.4), sh(circle(0, -88, 2.4), dk),
    stroke(line([[-1.5, -76], [-1.5, 16]]) + line([[1.5, -76], [1.5, 16]]), '#e8dcc0', 0.6),
  ];
}

export function grandClock(r: number, col = GOLD): Shape[] {
  const out: Shape[] = [];
  let rays = '';
  for (let k = 0; k < 16; k++) rays += petal(0, 0, r * 1.55, r * 0.14, k * 22.5);
  out.push(sh(rays, col, { opacity: 0.85 }));
  out.push(ol(circle(0, 0, r * 1.12), shade(col, -0.1), 1.6), ol(circle(0, 0, r), '#fbf4e2', 1.4, -0.3));
  let ticks = '';
  for (let k = 0; k < 12; k++) { const a = (k * 30 * Math.PI) / 180; ticks += line([[Math.cos(a) * r * 0.78, Math.sin(a) * r * 0.78], [Math.cos(a) * r * 0.92, Math.sin(a) * r * 0.92]]); }
  out.push(stroke(ticks, '#3a2a3a', r * 0.06), stroke(circle(0, 0, r * 0.68), shade(col, -0.1), 1));
  out.push(stroke(line([[0, 0], [0, -r * 0.52]]), '#2a1a2a', r * 0.08), stroke(line([[0, 0], [-r * 0.06, -r * 0.76]]), '#2a1a2a', r * 0.05), sh(circle(0, 0, r * 0.08), col));
  out.push(...place(crown(col), { y: -r * 1.12, s: r / 70 }));
  return out;
}

// =====================================================================
// woodland magic
// =====================================================================
/** Cluster of round leaf clumps. */
export function foliage(seed: number, w: number, h: number, cols: string[], count = 18): Shape[] {
  const g = rng(seed);
  const by: string[] = cols.map(() => '');
  for (let i = 0; i < count; i++) {
    const t = i / count, x = g.range(-w / 2, w / 2) * (0.6 + 0.4 * t), y = g.range(-h / 2, h / 2) * (1 - 0.3 * t), r = g.range(0.16, 0.3) * Math.min(w, h);
    by[Math.min(cols.length - 1, Math.floor(t * cols.length + g.range(-0.6, 0.6)))] += blob([[x - r, y], [x - r * 0.6, y - r * 0.8], [x + r * 0.2, y - r], [x + r, y - r * 0.3], [x + r * 0.8, y + r * 0.6], [x, y + r * 0.8]], 1);
  }
  return by.map((d, i) => sh(d, cols[i])).filter((p) => p.d);
}

export function trunk(h: number, w: number, col: string, seed: number): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [];
  out.push(sh(blob([[-w / 2 - 30, 0], [-w / 2 - 4, -26], [-w / 2, -h * 0.4], [-w * 0.42, -h], [w * 0.42, -h], [w / 2, -h * 0.4], [w / 2 + 6, -26], [w / 2 + 34, 0], [0, 8]], 0.6), col));
  out.push(sh(blob([[w * 0.1, -16], [w * 0.14, -h], [w * 0.42, -h], [w / 2, -h * 0.4], [w / 2 + 6, -26], [w / 2 + 34, 0]], 0.6), shade(col, -0.2)));
  let bk = '';
  for (let i = 0; i < Math.round(h / 22); i++) { const x = g.range(-w * 0.4, w * 0.4), y = g.range(-h + 10, -30), l = g.range(30, 80); bk += curve([[x, y], [x + g.range(-4, 4), y + l / 2], [x + g.range(-3, 3), y + l]]); }
  out.push(stroke(bk, shade(col, -0.35), 1.8, { opacity: 0.8 }));
  return out;
}

export function toadstool(s = 1, cap = '#d8433a'): Shape[] {
  return [
    shadow(0, 1, 16 * s, 3 * s),
    sh(blob([[-6 * s, 0], [-5 * s, -18 * s], [5 * s, -18 * s], [7 * s, 0]], 0.5), '#f4ead6'),
    sh(blob([[1 * s, -2 * s], [2 * s, -16 * s], [5 * s, -18 * s], [7 * s, 0]], 0.5), '#ddd0b6'),
    sh(blob([[-20 * s, -16 * s], [-14 * s, -30 * s], [0, -36 * s], [14 * s, -30 * s], [20 * s, -16 * s], [0, -13 * s]], 0.9), cap),
    sh(circle(-9 * s, -26 * s, 3 * s) + circle(4 * s, -31 * s, 2.6 * s) + circle(11 * s, -22 * s, 2.4 * s) + circle(-2 * s, -21 * s, 2 * s) + circle(-15 * s, -19 * s, 1.8 * s), '#fbf6ea'),
  ];
}

export function grassTuft(s: number, col: string, seed: number): Shape[] {
  const g = rng(seed);
  let d = '';
  for (let i = 0; i < 6; i++) d += leaf(g.range(-8, 8) * s, 0, g.range(14, 26) * s, 2.6 * s, -90 + g.range(-30, 30));
  return [sh(d, col)];
}

export function fern(len: number, rot: number, col: string, seed: number): Shape[] {
  const g = rng(seed);
  const a = (rot * Math.PI) / 180, ux = Math.cos(a), uy = Math.sin(a);
  let d = '';
  const steps = 9;
  for (let i = 1; i < steps; i++) {
    const t = i / steps, x = ux * len * t, y = uy * len * t, l = len * 0.28 * (1 - t * 0.8);
    d += leaf(x, y, l, l * 0.22, rot - 60 + g.range(-6, 6)) + leaf(x, y, l, l * 0.22, rot + 60 + g.range(-6, 6));
  }
  return [stroke(line([[0, 0], [ux * len, uy * len]]), shade(col, -0.3), 1.6), sh(d, col)];
}

export function flowerSpray(seed: number, count: number, w: number, cols: string[]): Shape[] {
  const g = rng(seed);
  let stems = '';
  const heads: string[] = cols.map(() => '');
  let centres = '';
  for (let i = 0; i < count; i++) {
    const x = g.range(-w / 2, w / 2), h = g.range(14, 34), y = -h;
    stems += line([[x * 0.6, 0], [x, y]]);
    const k = g.int(0, cols.length - 1), r = g.range(3.5, 5.5);
    for (let p = 0; p < 5; p++) heads[k] += petal(x, y, r, r * 0.5, p * 72 + g.range(0, 30));
    centres += circle(x, y, r * 0.3);
  }
  return [stroke(stems, '#4e7a3e', 1.2), ...heads.map((d, i) => sh(d, cols[i])).filter((p) => p.d), sh(centres, '#f2c84b')];
}

export function firefly(r = 1): Shape[] {
  return [...glow(0, 0, 14 * r, '#f7f0a0', 0.5), sh(circle(0, 0, 2.6 * r), '#fffbd8')];
}

export function well(): Shape[] {
  const stone = '#a9a3b4', g = rng(5);
  const out: Shape[] = [shadow(0, 2, 82, 10)];
  out.push(ol(rect(-56, -196, 10, 140, 2), '#7a5233', 1), ol(rect(46, -196, 10, 140, 2), '#7a5233', 1));
  out.push(ol(blob([[-70, 0], [-72, -70], [72, -70], [70, 0], [0, 8]], 0.3), stone, 1.4, -0.4));
  const st: string[] = ['', '', ''];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) {
    const x = -66 + c * 20 + (r % 2 ? 10 : 0), y = -64 + r * 13;
    if (x > 62) continue;
    st[g.int(0, 2)] += rect(x, y, Math.min(17, 68 - x), 10, 3);
  }
  out.push(sh(st[0], shade(stone, 0.12)), sh(st[1], shade(stone, -0.08)), sh(st[2], shade(stone, 0.04)));
  out.push(ol(ellipse(0, -70, 74, 14), shade(stone, 0.15), 1.4, -0.4), sh(ellipse(0, -70, 60, 9), '#2a2236'));
  out.push(stroke(line([[-50, -150], [50, -150]]), '#5a3a22', 6), stroke(curve([[50, -150], [62, -150], [64, -140]]), '#5a3a22', 3));
  out.push(stroke(line([[0, -150], [0, -100]]), '#c9b48a', 1.6));
  out.push(ol(blob([[-80, -184], [0, -232], [80, -184], [74, -176], [-74, -176]], 0.2), '#8a4a3a', 1.4));
  let shingles = '';
  for (let r = 0; r < 3; r++) for (let c = -4; c <= 4; c++) shingles += ellipse(c * 16 + (r % 2 ? 8 : 0), -186 - r * 12 + Math.abs(c) * 3 * (r === 2 ? 1 : 0.4), 8, 5);
  out.push(sh(shingles, '#a35a46', { opacity: 0.8 }));
  out.push(sh(leaf(-60, -24, 20, 6, -150) + leaf(-62, -40, 16, 5, 170) + leaf(64, -30, 18, 6, -30), '#5f8a45'));
  return out;
}

export function bucket(col = '#9a6a3e'): Shape[] {
  return [
    stroke(curve([[-18, -30], [0, -50], [18, -30]]), '#6a6470', 2),
    ol(poly([[-18, -32], [18, -32], [14, 0], [-14, 0]]), col, 1.2),
    stroke(line([[-6, -32], [-5, 0]]) + line([[6, -32], [5, 0]]), shade(col, -0.25), 1),
    sh(rect(-17.4, -28, 34.8, 4) + rect(-15, -9, 30, 4), '#6a6470'),
    sh(ellipse(0, -32, 18, 4), shade(col, -0.4)), sh(ellipse(0, -31, 14, 2.4), '#6fa8c8'),
  ];
}

export function cottage(): Shape[] {
  const wall = '#f1e4c8', beam = '#6a4630', roof = '#7a5aa0';
  const out: Shape[] = [shadow(0, 4, 130, 12)];
  out.push(ol(rect(66, -260, 26, 70, 2), '#9a8478', 1.2), sh(rect(62, -266, 34, 10, 2), '#7a6458'));
  out.push(ol(rect(-110, -150, 220, 150), wall, 1.4, -0.3), sh(rect(30, -150, 80, 150), shade(wall, -0.1)));
  out.push(stroke(line([[-110, -76], [110, -76]]) + line([[-60, -150], [-60, 0]]) + line([[60, -150], [60, 0]]) + line([[-110, -150], [-60, -76]]) + line([[110, -150], [60, -76]]), beam, 5));
  out.push(ol(blob([[-140, -140], [-60, -250], [0, -282], [60, -250], [140, -140], [100, -132], [0, -138], [-100, -132]], 0.5), roof, 1.6));
  const g = rng(13);
  let sc = '';
  for (let r = 0; r < 6; r++) for (let c = -7; c <= 7; c++) { const y = -146 - r * 22, half = 120 - r * 20; const x = c * 18 + (r % 2 ? 9 : 0); if (Math.abs(x) < half) sc += ellipse(x, y + g.range(-2, 2), 10, 7); }
  out.push(sh(sc, shade(roof, 0.12), { opacity: 0.75 }));
  out.push(stroke(curve([[-140, -140], [0, -132], [140, -140]]), shade(roof, -0.3), 3));
  // round door
  out.push(ol(arch(0, 0, 50, 84), '#7a4a2e', 1.4), stroke(line([[-12, -70], [-12, 0]]) + line([[0, -84], [0, 0]]) + line([[12, -70], [12, 0]]), '#5a321c', 1.2), sh(circle(14, -36, 3), GOLD));
  // windows
  for (const x of [-82, 82]) {
    out.push(...glow(x, -40, 44, '#ffd36a', 0.35));
    out.push(ol(arch(x, -14, 40, 52), '#ffd77a', 2, -0.6), stroke(line([[x, -64], [x, -14]]) + line([[x - 20, -40], [x + 20, -40]]), '#6a4630', 2.4));
    out.push(ol(rect(x - 26, -16, 52, 10, 2), '#8a5a3a', 1));
    out.push(...place(flowerSpray(30 + x, 7, 44, ['#e86f8a', '#f2c84b', '#b48ad8']), { x, y: -16 }));
  }
  // upper gable window
  out.push(...glow(0, -200, 30, '#ffd36a', 0.3), ol(circle(0, -196, 16), '#ffd77a', 2, -0.6), stroke(line([[-16, -196], [16, -196]]) + line([[0, -212], [0, -180]]), '#6a4630', 2));
  // smoke
  out.push(sh(blob([[76, -270], [70, -300], [86, -320], [78, -350], [96, -324], [90, -298]], 1), '#e8e4f2', { opacity: 0.55 }), sh(circle(100, -362, 10) + circle(112, -384, 7), '#e8e4f2', { opacity: 0.4 }));
  return out;
}

export function unicorn(): Shape[] {
  const coat = '#f8f4fa', far = '#e4dcef', hoof = '#b9a6cf';
  const mane = ['#f3a7c4', '#c9a6ec', '#9fd8e0', '#f6d68a'];
  const out: Shape[] = [shadow(10, 1, 60, 6, 0.18)];
  // far legs
  out.push(sh(poly([[-16, -60], [-6, -60], [-8, -6], [-15, -6]]) + poly([[40, -62], [52, -60], [50, -6], [42, -6]]), far), sh(rect(-17, -7, 10, 7, 2) + rect(41, -7, 10, 7, 2), shade(hoof, -0.1)));
  // tail
  out.push(sh(blob([[56, -84], [76, -80], [86, -50], [80, -18], [70, -8], [72, -40], [60, -66]], 0.9), mane[1]), sh(blob([[58, -80], [70, -74], [76, -48], [74, -24], [66, -46]], 0.9), mane[0]), sh(blob([[60, -76], [68, -62], [66, -44], [62, -60]], 0.9), mane[2]));
  // body and near legs
  out.push(sh(ellipse(14, -74, 48, 25), coat, { stroke: '#cdbfdc', strokeWidth: 1.2 }));
  out.push(sh(poly([[-26, -64], [-14, -64], [-16, -6], [-24, -6]]) + poly([[30, -64], [44, -64], [36, -6], [28, -6]]), coat, { stroke: '#cdbfdc', strokeWidth: 1 }));
  out.push(sh(rect(-26, -7, 11, 7, 2) + rect(27, -7, 11, 7, 2), hoof));
  out.push(sh(ellipse(24, -64, 30, 10), far, { opacity: 0.5 }));
  // neck and head
  out.push(sh(blob([[-26, -60], [-36, -88], [-44, -116], [-28, -128], [-12, -102], [2, -84], [-4, -64]], 0.8), coat, { stroke: '#cdbfdc', strokeWidth: 1.2 }));
  out.push(sh(blob([[-28, -120], [-40, -134], [-56, -126], [-70, -112], [-76, -102], [-66, -96], [-48, -104], [-32, -108]], 0.8), coat, { stroke: '#cdbfdc', strokeWidth: 1.2 }));
  out.push(sh(ellipse(-70, -101, 7, 5), '#efe4f4'), sh(circle(-72, -103, 1.4), '#8a7a9a'));
  out.push(sh(leaf(-34, -128, 14, 4.5, -110), coat, { stroke: '#cdbfdc', strokeWidth: 1 }), sh(leaf(-35, -129, 9, 2, -110), '#f3c6d8'));
  // horn
  out.push(ol(poly([[-50, -128], [-42, -131], [-62, -168]]), GOLD_LT, 1, -0.4), stroke(line([[-48, -136], [-43, -137]]) + line([[-51, -145], [-46, -146]]) + line([[-55, -154], [-51, -155]]), GOLD_DK, 1));
  // eye
  out.push(sh(ellipse(-52, -116, 2.8, 3.4), '#3a2a4a'), sh(circle(-51.4, -117, 1), '#ffffff'), stroke(curve([[-56, -120], [-52, -121], [-48, -119]]), '#3a2a4a', 1));
  // mane
  const pts: Pt[] = [[-30, -130], [-24, -120], [-18, -108], [-12, -96], [-6, -84]];
  pts.forEach(([x, y], i) => out.push(sh(blob([[x - 4, y - 4], [x + 10, y - 8], [x + 20, y + 4], [x + 14, y + 12], [x + 2, y + 6]], 0.9), mane[i % 4])));
  out.push(sh(blob([[-38, -132], [-28, -134], [-36, -116], [-46, -114]], 0.9), mane[0]), sh(blob([[-34, -128], [-30, -122], [-40, -110]], 0.9), mane[2]));
  out.push(sh(twinkle(-70, -150, 7) + twinkle(-80, -130, 4) + twinkle(80, -90, 5), '#fff6c8'));
  return out;
}

export function crownedFrog(col = '#6aa84f'): Shape[] {
  const dk = shade(col, -0.25), belly = mix(col, '#f3edc8', 0.6);
  return [
    shadow(0, 1, 30, 5),
    sh(ellipse(-22, -8, 14, 9) + ellipse(22, -8, 14, 9), dk),
    sh(blob([[-24, -4], [-26, -22], [-14, -36], [14, -36], [26, -22], [24, -4], [0, 0]], 0.9), col, { stroke: dk, strokeWidth: 1.2 }),
    sh(ellipse(0, -14, 13, 11), belly),
    sh(ellipse(-11, -2, 6, 3) + ellipse(11, -2, 6, 3), col, { stroke: dk, strokeWidth: 1 }),
    sh(circle(-12, -36, 8) + circle(12, -36, 8), col, { stroke: dk, strokeWidth: 1.2 }),
    sh(circle(-12, -37, 5.5) + circle(12, -37, 5.5), '#fbf6e6'),
    sh(circle(-11, -37, 3) + circle(13, -37, 3), '#1e1a24'),
    sh(circle(-10, -38.5, 1) + circle(14, -38.5, 1), '#ffffff'),
    stroke(curve([[-12, -26], [0, -22], [12, -26]]), shade(col, -0.45), 1.4),
    sh(circle(-16, -28, 2.4) + circle(16, -28, 2.4), '#f3a7b8', { opacity: 0.7 }),
    ...place(crown(GOLD, '#c8324a'), { y: -40, s: 0.32 }),
  ];
}

export function spinningWheel(wood = '#9a6438'): Shape[] {
  const dk = shade(wood, -0.3);
  const out: Shape[] = [shadow(0, 2, 72, 7)];
  out.push(stroke(line([[-56, -40], [-64, 0]]) + line([[-40, -44], [-30, 0]]) + line([[56, -50], [62, 0]]), dk, 5));
  out.push(ol(poly([[-70, -48], [70, -58], [72, -48], [-68, -38]]), wood, 1.2));
  out.push(stroke(line([[14, -54], [18, -96]]) + line([[34, -56], [30, -96]]), dk, 5));
  out.push(ol(rect(-20, -6, 70, 6, 2), wood, 1), stroke(line([[0, -6], [24, -84]]), dk, 1.4));
  // wheel
  const cx = 24, cy = -98, r = 46;
  let spokes = '';
  for (let k = 0; k < 10; k++) { const a = (k * 36 * Math.PI) / 180; spokes += line([[cx + Math.cos(a) * 6, cy + Math.sin(a) * 6], [cx + Math.cos(a) * (r - 3), cy + Math.sin(a) * (r - 3)]]); }
  out.push(stroke(spokes, wood, 3), stroke(circle(cx, cy, r), dk, 8), stroke(circle(cx, cy, r), wood, 5), sh(circle(cx, cy, 7), dk), sh(circle(cx, cy, 3), GOLD));
  // flyer, distaff and wool
  out.push(stroke(line([[-50, -48], [-58, -120]]), dk, 4), sh(blob([[-70, -118], [-66, -140], [-56, -150], [-46, -138], [-48, -118], [-58, -110]], 1), '#f6efe0', { stroke: '#d8ccb4', strokeWidth: 1 }));
  out.push(stroke(curve([[-64, -134], [-56, -128], [-62, -122]]) + curve([[-52, -142], [-50, -132], [-56, -126]]), '#d8ccb4', 1));
  out.push(ol(rect(-62, -66, 30, 10, 4), wood, 1), sh(ellipse(-47, -61, 8, 6), '#f2e4c6'), stroke(curve([[-40, -62], [-6, -100], [cx - 20, cy - 40]]) + curve([[-40, -60], [0, -60], [cx + 10, cy + r - 2]]), '#c9a98a', 0.8));
  return out;
}

export function appleBasket(col = '#c49a5c'): Shape[] {
  const out: Shape[] = [shadow(0, 2, 48, 6)];
  out.push(stroke(curve([[-36, -30], [-30, -74], [30, -74], [36, -30]]), shade(col, -0.3), 6), stroke(curve([[-36, -30], [-30, -74], [30, -74], [36, -30]]), col, 3));
  const apples: [number, number, number, string][] = [[-26, -36, 12, '#c8323a'], [-8, -40, 13, '#d8433a'], [12, -38, 12, '#b8282e'], [28, -34, 11, '#d8433a'], [-16, -48, 11, '#e0584a'], [6, -52, 12, '#c8323a'], [22, -46, 10, '#8fb04a']];
  for (const [x, y, r, c] of apples) out.push(sh(blob([[x - r, y], [x - r * 0.7, y - r * 0.9], [x - r * 0.1, y - r * 0.8], [x, y - r * 0.65], [x + r * 0.1, y - r * 0.8], [x + r * 0.7, y - r * 0.9], [x + r, y], [x + r * 0.5, y + r * 0.85], [x - r * 0.5, y + r * 0.85]], 0.9), c), hl(ellipse(x - r * 0.4, y - r * 0.3, r * 0.22, r * 0.36, 20), 0.5), stroke(line([[x, y - r * 0.65], [x + 2, y - r - 3]]), '#5a3a22', 1.4));
  out.push(sh(leaf(8, -63, 12, 4.5, -30) + leaf(-14, -59, 10, 4, -150), '#5f8f4a'));
  out.push(ol(poly([[-44, -36], [44, -36], [36, 0], [-36, 0]]), col, 1.2));
  let wv = '';
  for (let k = 0; k < 4; k++) wv += curve([[-42 + k * 2, -28 + k * 8], [0, -26 + k * 8], [42 - k * 2, -28 + k * 8]]);
  for (let k = -3; k <= 3; k++) wv += line([[k * 12, -36], [k * 10, 0]]);
  out.push(stroke(wv, shade(col, -0.3), 1.2), ol(rect(-46, -40, 92, 7, 3), shade(col, 0.1), 1));
  out.push(sh(blob([[-8, -38], [-20, -46], [-22, -36]], 0.8) + blob([[-8, -38], [4, -46], [6, -36]], 0.8), '#e86f8a'));
  return out;
}

export function owl(body = '#9a7350', face = '#f1dfbf', eye = '#f7c948'): Shape[] {
  const dk = shade(body, -0.3);
  return [
    sh(ellipse(0, -26, 22, 27), body),
    sh(blob([[-21, -36], [-30, -18], [-22, -2], [-14, -20]], 0.8) + blob([[21, -36], [30, -18], [22, -2], [14, -20]], 0.8), dk),
    sh(ellipse(0, -18, 13, 15), shade(face, 0.1)),
    stroke(curve([[-7, -22], [-4, -19], [-1, -22]]) + curve([[1, -16], [4, -13], [7, -16]]) + curve([[-8, -12], [-5, -9], [-2, -12]]) + curve([[2, -24], [5, -21], [8, -24]]), dk, 1),
    sh(poly([[-20, -50], [-14, -40], [-8, -46]]) + poly([[20, -50], [14, -40], [8, -46]]), dk),
    sh(blob([[-18, -42], [0, -36], [18, -42], [14, -28], [0, -26], [-14, -28]], 0.9), face),
    sh(circle(-8, -37, 7) + circle(8, -37, 7), eye, { stroke: dk, strokeWidth: 1 }),
    sh(circle(-8, -37, 3.6) + circle(8, -37, 3.6), '#1e1a24'), sh(circle(-7, -38.4, 1.1) + circle(9, -38.4, 1.1), '#ffffff'),
    sh(poly([[-3, -32], [3, -32], [0, -26]]), '#e0a038'),
    stroke(line([[-8, 0], [-8, 4]]) + line([[-4, 0], [-4, 4]]) + line([[4, 0], [4, 4]]) + line([[8, 0], [8, 4]]), '#e0a038', 2),
  ];
}

export function lantern(col = '#3a3448'): Shape[] {
  return [
    ...glow(0, -30, 50, '#ffd36a', 0.55),
    stroke(curve([[0, -62], [0, -76], [8, -80]]), col, 2.4),
    ol(poly([[-14, -52], [14, -52], [8, -64], [-8, -64]]), col, 1),
    sh(rect(-13, -52, 26, 38), '#ffe08a', { opacity: 0.95 }),
    sh(petal(0, -20, 18, 6, -90), '#f7a73b'), sh(petal(0, -21, 10, 3.4, -90), '#fff6c8'),
    stroke(rect(-13, -52, 26, 38) + line([[0, -52], [0, -14]]), col, 2.2),
    ol(rect(-17, -16, 34, 6, 2), col, 1), ol(circle(0, -66, 4), col, 1),
  ];
}

export function goldenKey(col = GOLD): Shape[] {
  return [
    stroke(circle(-26, 0, 10), shade(col, -0.3), 7), stroke(circle(-26, 0, 10), col, 4.5),
    sh(petal(-26, -10, 7, 3, -90) + petal(-36, 0, 7, 3, 180) + petal(-26, 10, 7, 3, 90), col),
    ol(rect(-16, -3, 44, 6, 2), col, 1, -0.3),
    ol(poly([[18, 3], [18, 14], [23, 14], [23, 8], [27, 8], [27, 3]]), col, 1, -0.3),
    hl(rect(-14, -2, 38, 1.6), 0.6),
  ];
}

export function bluebird(col = '#4d86d0', breast = '#f0985a'): Shape[] {
  return [
    sh(poly([[16, -8], [30, -14], [30, -4]]), shade(col, -0.2)),
    sh(ellipse(0, -10, 18, 13), col),
    sh(blob([[-14, -6], [-4, 2], [8, 0], [0, -8]], 0.9), breast),
    sh(blob([[-2, -14], [14, -16], [22, -8], [6, -6]], 0.9), shade(col, -0.18)),
    sh(circle(-12, -20, 10), col),
    sh(poly([[-21, -22], [-30, -19], [-21, -17]]), '#e8a43a'),
    sh(circle(-14, -22, 2.2), '#1e1a24'), sh(circle(-13.4, -22.8, 0.7), '#ffffff'),
    stroke(line([[-2, 2], [-3, 8]]) + line([[4, 2], [4, 8]]), '#6a4a3a', 1.4),
  ];
}

export function rabbit(col = '#b9a48c'): Shape[] {
  const dk = shade(col, -0.2), lt = shade(col, 0.35);
  return [
    shadow(0, 1, 26, 4),
    sh(ellipse(4, -20, 22, 20), col),
    sh(circle(24, -14, 7), lt),
    sh(ellipse(-10, -4, 12, 5), dk),
    sh(circle(-14, -38, 12), col),
    sh(leaf(-12, -46, 26, 6, -100) + leaf(-8, -46, 24, 6, -70), col),
    sh(leaf(-12, -47, 20, 3, -100), '#f0c4c4'),
    sh(circle(-19, -40, 2), '#1e1a24'), sh(circle(-25, -35, 1.6), '#d88a8a'),
    sh(ellipse(-12, -26, 8, 8), lt, { opacity: 0.7 }),
  ];
}

export function snail(shell = '#c9874a'): Shape[] {
  return [
    sh(blob([[-30, 0], [-34, -8], [-26, -10], [24, -6], [28, 0]], 0.6), '#c9b89a'),
    stroke(line([[-30, -8], [-34, -20]]) + line([[-27, -9], [-28, -21]]), '#a8977a', 1.4), sh(circle(-34, -21, 1.8) + circle(-28, -22, 1.8), '#6a5a4a'),
    sh(circle(4, -18, 16), shell, { stroke: shade(shell, -0.35), strokeWidth: 1.2 }),
    stroke(curve([[4, -18], [8, -20], [8, -14], [0, -12], [-4, -20], [4, -28], [14, -24], [16, -14]]), shade(shell, -0.4), 1.6),
    hl(ellipse(-2, -28, 5, 2.4, -20), 0.4),
  ];
}

export function wand(): Shape[] {
  return [
    stroke(line([[-30, 20], [14, -10]]), '#3a2a4a', 4), stroke(line([[-30, 20], [-20, 13]]), GOLD, 4.4),
    sh(star(20, -14, 13, 5.5, 5, -70), GOLD_LT, { stroke: GOLD_DK, strokeWidth: 1 }),
    sh(twinkle(34, -28, 6) + twinkle(8, -30, 4) + twinkle(36, -4, 3.5), '#fff6c8'),
  ];
}

export function butterfly(col = '#b07ad8', spot = '#f6d68a'): Shape[] {
  return [
    sh(blob([[0, 0], [-6, -16], [-20, -22], [-22, -6], [-10, 2]], 0.9) + blob([[0, 0], [6, -16], [20, -22], [22, -6], [10, 2]], 0.9), col),
    sh(blob([[0, 2], [-12, 4], [-14, 14], [-4, 12]], 0.9) + blob([[0, 2], [12, 4], [14, 14], [4, 12]], 0.9), shade(col, -0.15)),
    sh(circle(-14, -12, 3) + circle(14, -12, 3), spot),
    sh(ellipse(0, 2, 2, 9), '#2a1e30'),
    stroke(curve([[0, -6], [-4, -16], [-8, -18]]) + curve([[0, -6], [4, -16], [8, -18]]), '#2a1e30', 0.9),
  ];
}

// =====================================================================
// wizard's study
// =====================================================================
/** A row of books standing on a shelf at y = 0, from x = 0 to w. */
export function bookRow(w: number, maxH: number, seed: number, cols: string[]): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [];
  let x = 0;
  while (x < w - 6) {
    const bw = Math.min(w - x, g.range(7, 15)), bh = maxH * g.range(0.66, 1);
    const c = g.pick(cols);
    if (g.next() < 0.1 && x + bh * 0.5 < w && x > 0) {
      out.push(ol(poly([[x, 0], [x + bw * 0.8, 0], [x + bh * 0.42 + bw * 0.8, -bh * 0.9], [x + bh * 0.42, -bh * 0.9 - bw * 0.3]]), c, 0.8));
      x += bh * 0.42 + bw + 2;
      continue;
    }
    out.push(ol(rect(x, -bh, bw, bh, 1), c, 0.8));
    out.push(sh(rect(x + 1, -bh + 5, bw - 2, 2.4) + rect(x + 1, -9, bw - 2, 2.4), g.next() < 0.6 ? GOLD : shade(c, 0.35)));
    if (bw > 10 && g.next() < 0.5) out.push(sh(rect(x + bw / 2 - 2, -bh * 0.62, 4, bh * 0.18, 1), shade(c, 0.3)));
    x += bw + g.range(0, 1.5);
  }
  return out;
}

export function potion(kind: number, liquid: string, glass = '#d8eef2'): Shape[] {
  const out: Shape[] = [];
  const gl = { stroke: '#8aaab4', strokeWidth: 1.2, opacity: 0.95 };
  if (kind === 0) {
    out.push(sh(circle(0, -18, 18) , glass, gl));
    const pts: Pt[] = [];
    for (let a = -15; a <= 195; a += 15) pts.push([Math.cos((a * Math.PI) / 180) * 16.5, -18 + Math.sin((a * Math.PI) / 180) * 16.5]);
    out.push(sh(poly(pts), liquid), sh(rect(-6, -46, 12, 14), glass, gl), ol(rect(-5, -52, 10, 8, 2), '#b88a5a', 1));
  } else if (kind === 1) {
    out.push(sh(rect(-11, -46, 22, 46, 4), glass, gl), sh(rect(-9.5, -32, 19, 30.5, 3), liquid), sh(rect(-5, -58, 10, 13), glass, gl), ol(rect(-6, -64, 12, 8, 2), '#8a5a3a', 1), ol(rect(-9, -26, 18, 12, 1), '#f3e6c4', 0.8));
  } else if (kind === 2) {
    out.push(sh(poly([[-6, -44], [6, -44], [6, -30], [20, -2], [18, 0], [-18, 0], [-20, -2], [-6, -30]]), glass, gl), sh(poly([[-12, -16], [12, -16], [18.5, -2.5], [-18.5, -2.5]]), liquid), ol(rect(-7, -50, 14, 7, 2), '#b88a5a', 1));
  } else {
    out.push(sh(blob([[0, -6], [-18, -22], [-14, -38], [0, -32], [14, -38], [18, -22]], 0.8), glass, gl), sh(blob([[0, -8], [-15, -21], [-12, -28], [12, -28], [15, -21]], 0.8), liquid), sh(rect(-4, -46, 8, 12), glass, gl), ol(circle(0, -48, 5), GOLD, 1), stroke(curve([[-4, -40], [-14, -38], [-12, -30]]), '#c8324a', 1.2));
  }
  out.push(hl(ellipse(-6, kind === 2 ? -12 : -22, 2, 6, 15), 0.6));
  return out;
}

export function telescope(col = '#c9963a'): Shape[] {
  const dk = shade(col, -0.35);
  const out: Shape[] = [];
  out.push(stroke(line([[0, -66], [-34, 0]]) + line([[0, -66], [30, 0]]) + line([[0, -66], [4, 2]]), '#5a3a26', 4));
  out.push(ol(circle(0, -66, 5), dk, 1));
  const tube = (d: string) => place([sh(d, '')], { rot: -28, x: 0, y: -70 })[0].d;
  out.push(sh(tube(poly([[-70, -6], [-20, -8], [-20, 8], [-70, 6]])), col, { stroke: dk, strokeWidth: 1.2 }));
  out.push(sh(tube(poly([[-20, -9], [40, -11], [40, 11], [-20, 9]])), shade(col, 0.1), { stroke: dk, strokeWidth: 1.2 }));
  out.push(sh(tube(poly([[40, -12], [80, -14], [80, 14], [40, 12]])), col, { stroke: dk, strokeWidth: 1.2 }));
  out.push(sh(tube(rect(-24, -10, 6, 20) + rect(36, -12, 6, 24) + rect(74, -15, 8, 30)), dk));
  out.push(sh(tube(ellipse(82, 0, 4, 14)), '#9fd0e4'), sh(tube(rect(-80, -4, 10, 8, 1)), '#3a2a1a'));
  out.push(sh(tube(rect(-60, -4, 90, 2.4)), '#ffffff', { opacity: 0.35 }));
  return out;
}

export function starChart(w = 90, h = 110): Shape[] {
  const paper = '#f1e2bd';
  const out: Shape[] = [shadow(0, 2, w * 0.55, 5, 0.18)];
  out.push(ol(rect(-w / 2, -h, w, h), paper, 1, -0.25));
  out.push(ol(rect(-w / 2 - 4, -h - 8, w + 8, 10, 5), shade(paper, -0.08), 1, -0.3), ol(rect(-w / 2 - 4, -6, w + 8, 10, 5), shade(paper, -0.08), 1, -0.3));
  const cx = 0, cy = -h * 0.55, r = w * 0.34;
  out.push(stroke(circle(cx, cy, r) + circle(cx, cy, r * 0.6), '#7a5a3a', 1), stroke(line([[cx - r, cy], [cx + r, cy]]) + line([[cx, cy - r], [cx, cy + r]]), '#7a5a3a', 0.6));
  const cons: Pt[] = [[-r * 0.7, cy - r * 0.3], [-r * 0.3, cy - r * 0.6], [r * 0.1, cy - r * 0.2], [r * 0.5, cy - r * 0.5], [r * 0.7, cy + r * 0.1], [r * 0.2, cy + r * 0.5]];
  out.push(stroke(line(cons), '#3f5a9a', 1), sh(cons.map(([x, y]) => circle(x, y, 2)).join(''), '#3f5a9a'));
  out.push(sh(star(-r * 0.4, cy + r * 0.4, 5, 2, 5) + star(r * 0.6, cy - r * 0.8, 4, 1.6, 5), GOLD_DK));
  out.push(sh(circle(-w * 0.3, -14, 4) + circle(-w * 0.1, -14, 4) + circle(w * 0.1, -14, 4) + circle(w * 0.3, -14, 4), '#3a3050'), sh(circle(-w * 0.1 + 2, -14, 4) + circle(w * 0.3 + 3.5, -14, 3.6), paper));
  return out;
}

export function crystalBall(fill = '#9a8ae0'): Shape[] {
  return [
    ...glow(0, -40, 50, '#b8a8ff', 0.4),
    shadow(0, 1, 26, 4),
    ol(poly([[-22, 0], [22, 0], [14, -14], [-14, -14]]), GOLD, 1.2),
    sh(rect(-18, -6, 36, 3), GOLD_DK),
    sh(circle(0, -38, 26), fill, { stroke: '#6a5ab0', strokeWidth: 1.4 }),
    stroke(curve([[-14, -30], [-4, -46], [10, -40], [6, -28], [-6, -34], [2, -44], [14, -50]]), '#e8e0ff', 1.6, { opacity: 0.8 }),
    sh(twinkle(-8, -44, 5) + twinkle(10, -32, 3.5), '#ffffff', { opacity: 0.9 }),
    hl(ellipse(-11, -51, 7, 4, -30), 0.6),
    ol(ellipse(0, -14, 15, 4), GOLD_LT, 1, -0.4),
  ];
}

export function cauldron(brew = '#7fd36a'): Shape[] {
  const iron = '#2e2a36';
  const out: Shape[] = [];
  out.push(...glow(0, -6, 60, '#ff9a3a', 0.4));
  out.push(sh(rect(-34, -6, 68, 8, 4), '#6a4228'), sh(rect(-28, -12, 56, 7, 3.5), '#7a4e30'));
  out.push(sh(petal(-16, -6, 26, 8, -100) + petal(14, -6, 24, 8, -80) + petal(0, -6, 32, 9, -90), '#f07a2a'), sh(petal(-8, -8, 16, 5, -95) + petal(8, -8, 16, 5, -85), '#ffd35a'));
  out.push(stroke(line([[-36, -30], [-44, -6]]) + line([[36, -30], [44, -6]]), iron, 6));
  out.push(sh(blob([[-56, -78], [-60, -56], [-46, -28], [0, -18], [46, -28], [60, -56], [56, -78]], 0.8), iron));
  out.push(sh(blob([[20, -74], [50, -74], [52, -54], [40, -34], [24, -28]], 0.8), '#46404e'));
  out.push(stroke(curve([[-50, -50], [0, -40], [50, -50]]), '#46404e', 2));
  out.push(sh(ellipse(0, -78, 60, 12), '#3e3848'), sh(ellipse(0, -78, 52, 8.5), brew));
  out.push(sh(circle(-20, -82, 7) + circle(4, -84, 9) + circle(24, -80, 6) + circle(-34, -78, 4), shade(brew, 0.25)), stroke(circle(4, -84, 9) + circle(-20, -82, 7), shade(brew, -0.25), 1));
  out.push(sh(circle(-10, -104, 5) + circle(12, -116, 4) + circle(0, -130, 3), shade(brew, 0.2), { opacity: 0.8 }));
  out.push(stroke(curve([[-20, -96], [-30, -116], [-16, -134], [-26, -156]]) + curve([[18, -98], [26, -122], [14, -140]]), '#dfe8e0', 3, { opacity: 0.5 }));
  return out;
}

export function sleepingPet(col: string, kind: 'cat' | 'dog'): Shape[] {
  const dk = shade(col, -0.22), lt = shade(col, 0.35);
  const out: Shape[] = [shadow(0, 2, 52, 6)];
  out.push(sh(blob([[-44, 0], [-48, -20], [-34, -40], [-4, -48], [26, -44], [44, -28], [48, -6], [30, 4], [-20, 4]], 0.9), col));
  if (kind === 'cat') out.push(stroke(curve([[-4, -46], [0, -36], [-2, -28]]) + curve([[12, -46], [14, -34], [12, -26]]) + curve([[26, -40], [26, -30], [22, -22]]), dk, 3.4));
  else out.push(sh(ellipse(16, -30, 14, 10), lt));
  out.push(stroke(curve([[44, -6], [20, 4], [-10, 6], [-36, 2]]), dk, kind === 'cat' ? 10 : 8), stroke(curve([[-24, 5], [-36, 2], [-42, -4]]), kind === 'cat' ? lt : col, kind === 'cat' ? 9 : 7));
  out.push(sh(circle(-28, -20, 20), col));
  if (kind === 'cat') out.push(sh(poly([[-46, -28], [-44, -50], [-30, -38]]) + poly([[-24, -40], [-12, -50], [-12, -30]]), col), sh(poly([[-43, -32], [-42, -45], [-34, -37]]), '#f0b8b8'));
  else out.push(sh(blob([[-44, -32], [-54, -20], [-48, -6], [-40, -18]], 0.9) + blob([[-14, -32], [-4, -20], [-8, -6], [-16, -18]], 0.9), dk));
  out.push(sh(ellipse(-30, -12, 10, 7), lt));
  out.push(stroke(curve([[-40, -22], [-36, -19], [-32, -22]]) + curve([[-26, -22], [-22, -19], [-18, -22]]), '#2a1e28', 1.4));
  out.push(sh(kind === 'cat' ? poly([[-31, -15], [-27, -15], [-29, -12]]) : ellipse(-29, -14, 4, 3), kind === 'cat' ? '#e08a8a' : '#2a1e28'));
  if (kind === 'cat') out.push(stroke(line([[-36, -12], [-50, -14]]) + line([[-36, -10], [-50, -8]]) + line([[-22, -12], [-10, -14]]) + line([[-22, -10], [-10, -8]]), '#fbf6ea', 0.7));
  out.push(stroke(line([[-6, -64], [2, -64], [-6, -56], [2, -56]]) + line([[6, -78], [12, -78], [6, -72], [12, -72]]), '#8a7aa8', 1.6));
  return out;
}

export function broom(): Shape[] {
  return [
    stroke(line([[0, -150], [0, -40]]), '#6a4228', 5), stroke(line([[-1, -148], [-1, -44]]), '#9a6a40', 1.4),
    sh(blob([[-6, -44], [6, -44], [20, -6], [24, 0], [-24, 0], [-20, -6]], 0.4), '#d6b25e'),
    stroke(line([[-2, -40], [-14, 0]]) + line([[2, -40], [12, 0]]) + line([[0, -40], [0, 0]]) + line([[-4, -38], [-20, -2]]) + line([[4, -38], [20, -2]]), '#a8823a', 1),
    sh(rect(-8, -46, 16, 7, 2) + rect(-10, -30, 20, 5, 2), '#8a3a3a'),
  ];
}

export function hourglass(): Shape[] {
  return [
    shadow(0, 1, 24, 4),
    ol(rect(-22, -8, 44, 8, 2), '#7a4e30', 1), ol(rect(-22, -74, 44, 8, 2), '#7a4e30', 1),
    stroke(line([[-18, -66], [-18, -8]]) + line([[18, -66], [18, -8]]), '#5a3a22', 3),
    sh(blob([[-13, -66], [13, -66], [12, -50], [2, -38], [12, -24], [13, -8], [-13, -8], [-12, -24], [-2, -38], [-12, -50]], 0.5), '#e4f2f6', { stroke: '#9ab8c0', strokeWidth: 1, opacity: 0.9 }),
    sh(poly([[-9, -54], [9, -54], [1, -42], [-1, -42]]), '#e0b860'), sh(poly([[-12, -8], [12, -8], [8, -16], [0, -22], [-8, -16]]), '#e0b860'),
    stroke(line([[0, -42], [0, -22]]), '#e0b860', 1),
  ];
}

export function quillAndInk(): Shape[] {
  return [
    shadow(0, 1, 20, 4),
    sh(blob([[-16, 0], [-18, -14], [-8, -22], [8, -22], [18, -14], [16, 0]], 0.7), '#28304a'),
    sh(rect(-7, -28, 14, 8, 2), '#3a4466'), hl(ellipse(-9, -12, 3, 5), 0.4),
    sh(leaf(2, -24, 64, 9, -62), '#f6f1e4', { stroke: '#cfc4ae', strokeWidth: 0.8 }),
    stroke(line([[2, -24], [32, -80]]), '#b8ac94', 1),
    stroke(curve([[8, -38], [16, -44]]) + curve([[14, -50], [22, -55]]) + curve([[20, -61], [26, -66]]), '#cfc4ae', 0.8),
  ];
}

export function wizardHat(col = '#3f4aa0'): Shape[] {
  return [
    shadow(0, 2, 44, 5),
    sh(ellipse(0, -4, 44, 9), shade(col, -0.15)),
    sh(blob([[-26, -8], [-14, -50], [0, -80], [14, -96], [26, -92], [12, -78], [8, -50], [26, -8]], 0.6), col),
    sh(rect(-25, -18, 50, 8, 2), GOLD),
    sh(star(-6, -40, 6, 2.4, 5) + star(8, -62, 4.5, 1.8, 5) + twinkle(-12, -26, 4), GOLD_LT),
    sh(circle(4, -32, 4.5), GOLD_LT), sh(circle(6, -33, 3.8), col),
  ];
}

export function spellbook(page = '#f6ecd2', cover = '#6a2a3a'): Shape[] {
  const out: Shape[] = [shadow(0, 2, 56, 6)];
  out.push(sh(blob([[-56, -2], [-52, -32], [0, -26], [52, -32], [56, -2], [0, 4]], 0.4), cover));
  out.push(sh(blob([[-50, -6], [-48, -34], [-20, -40], [0, -32], [0, -2], [-24, -8]], 0.5), page, { stroke: '#d8c8a4', strokeWidth: 0.8 }));
  out.push(sh(blob([[50, -6], [48, -34], [20, -40], [0, -32], [0, -2], [24, -8]], 0.5), shade(page, -0.04), { stroke: '#d8c8a4', strokeWidth: 0.8 }));
  let tx = '';
  for (let k = 0; k < 4; k++) tx += line([[-42, -28 + k * 6], [-8, -28 + k * 6 + 2]]);
  out.push(stroke(tx, '#8a7a68', 1));
  out.push(stroke(circle(24, -20, 9), '#8a3a4a', 1), sh(star(24, -20, 7, 3, 5), '#8a3a4a', { opacity: 0.8 }));
  out.push(sh(poly([[2, -4], [6, -4], [6, 10], [4, 7], [2, 10]]), '#c8324a'));
  return out;
}

export function spectacles(): Shape[] {
  return [
    stroke(circle(-12, 0, 9) + circle(12, 0, 9), GOLD_DK, 2.2),
    sh(circle(-12, 0, 8) + circle(12, 0, 8), '#dff2f8', { opacity: 0.5 }),
    stroke(curve([[-3, -1], [0, -4], [3, -1]]) + line([[-21, -2], [-32, 4]]) + line([[21, -2], [32, 4]]), GOLD_DK, 1.6),
    hl(ellipse(-15, -3, 2.5, 1.5, -30), 0.8),
  ];
}

export function planetMobile(): Shape[] {
  const out: Shape[] = [];
  out.push(stroke(line([[0, 0], [0, 24]]), '#8a7a68', 1), stroke(line([[-60, 24], [60, 24]]), GOLD_DK, 3), sh(circle(0, 24, 3), GOLD));
  out.push(stroke(line([[-60, 24], [-60, 60]]) + line([[-20, 24], [-20, 84]]) + line([[22, 24], [22, 56]]) + line([[60, 24], [60, 76]]), '#8a7a68', 0.9));
  out.push(sh(circle(-60, 72, 12), '#e07a5a'), sh(ellipse(-60, 72, 22, 5, -15), 'none', { stroke: GOLD_LT, strokeWidth: 2.4 }), stroke(curve([[-70, 68], [-60, 66], [-50, 70]]), '#b85a40', 1.4));
  out.push(sh(circle(-20, 94, 10), '#6a9ad8'), stroke(curve([[-28, 92], [-20, 96], [-12, 92]]), '#3f6aa8', 1.4));
  out.push(sh(circle(22, 66, 10), GOLD_LT), sh(circle(27, 63, 9), '#3a3050'));
  out.push(sh(star(60, 88, 12, 5, 5), GOLD, { stroke: GOLD_DK, strokeWidth: 1 }));
  return out;
}

export function stoneWall(x: number, y: number, w: number, h: number, rowH: number, cols: string[], mortar: string, seed: number): Shape[] {
  const g = rng(seed);
  const by: string[] = cols.map(() => '');
  for (let r = 0; r * rowH < h; r++) {
    let cx = x - (r % 2 ? g.range(10, 30) : 0);
    while (cx < x + w) {
      const bw = g.range(rowH * 1.4, rowH * 2.6);
      const x0 = Math.max(x, cx), x1 = Math.min(x + w, cx + bw), hh = Math.min(rowH, h - r * rowH) - 3;
      if (x1 - x0 > 6 && hh > 3) by[g.int(0, cols.length - 1)] += rect(x0 + 1.5, y + r * rowH + 1.5, x1 - x0 - 3, hh, 3);
      cx += bw;
    }
  }
  return [sh(rect(x, y, w, h), mortar), ...by.map((d, i) => sh(d, cols[i])).filter((p) => p.d)];
}

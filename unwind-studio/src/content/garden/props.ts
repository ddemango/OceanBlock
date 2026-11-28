// Shared props for the Secret Garden collection. Every prop returns Shape[]
// drawn around the origin (base at 0,0, growing upwards unless noted).
import { star, blob, circle, curve, ellipse, leaf, line, mix, petal, poly, rect, rng, sh, shade, stroke, xf, place, type Rng } from '../../art/kit';
import type { Pt } from '../../art/geometry';
import type { Shape } from '../../art/types';

export const C = {
  sage: '#9caf88', leaf: '#5f9150', leafDark: '#3d6b3c', leafLight: '#93c06c', moss: '#6f8f55', deep: '#2c5034',
  lime: '#b9d47a', teal: '#4f8a72',
  peony: '#ea8fae', peonyLight: '#f8c9d6', peonyDark: '#cc5f88', rose: '#d84a72', blush: '#fbe3e6',
  lavender: '#a591d6', lavDark: '#7460b0', lilac: '#cdbdea', violet: '#5d4a9c',
  stone: '#cdbfa6', stoneLight: '#e2d7c1', stoneDark: '#a09279', slate: '#7e8690',
  terracotta: '#cb7650', terraLight: '#e09a74', terraDark: '#9f5338',
  sky: '#bfe1ef', skyDeep: '#8fc3de', cream: '#fbf3df', yellow: '#f3c94f', gold: '#e0a53a', white: '#fffaf0',
  wood: '#a37548', woodLight: '#c59a69', woodDark: '#6e4a2e', bark: '#5c4633',
  brick: '#b8674c', brickDark: '#96503c', brickLight: '#cf8466', mortar: '#d9cbb4',
  ink: '#2f2a28', iron: '#3f4347', red: '#d6453b', orange: '#e8833a', blue: '#6f9fd0',
};

/** Merge shapes that share a style into multi-subpath shapes (only for sets that do not overlap each other). */
export function bucket(shapes: Shape[]): Shape[] {
  const map = new Map<string, Shape>();
  for (const s of shapes) {
    const k = `${s.fill}|${s.stroke}|${s.strokeWidth}|${s.opacity}`;
    const e = map.get(k);
    if (e) e.d += s.d;
    else map.set(k, { ...s });
  }
  return [...map.values()];
}

const rad = (deg: number) => (deg * Math.PI) / 180;
export const polar = (cx: number, cy: number, r: number, deg: number): Pt => [cx + Math.cos(rad(deg)) * r, cy + Math.sin(rad(deg)) * r];

/** Lobed flower outline with n rounded petals. */
export function blossomPath(cx: number, cy: number, r: number, n = 5, inner = 0.5, rot = -90): string {
  const pts: Pt[] = [];
  for (let i = 0; i < n * 2; i++) pts.push(polar(cx, cy, i % 2 ? r * inner : r, rot + (i * 180) / n));
  return blob(pts, 1.1);
}

/** Tiny flower: lobed outline plus centre (2 shapes). */
export function blossom(r: number, col: string, centre = C.yellow, n = 5, rot = -90): Shape[] {
  return [sh(blossomPath(0, 0, r, n, 0.52, rot), col), sh(circle(0, 0, r * 0.3), centre)];
}

/** Daisy with separate petals. */
export function daisy(r: number, col = C.white, centre = C.yellow, n = 11): Shape[] {
  const out: Shape[] = [];
  let d = '';
  for (let i = 0; i < n; i++) d += petal(0, 0, r, r * 0.2, (i * 360) / n);
  out.push(sh(d, col));
  let d2 = '';
  for (let i = 0; i < n; i++) d2 += line([polar(0, 0, r * 0.35, (i * 360) / n), polar(0, 0, r * 0.8, (i * 360) / n)]);
  out.push(stroke(d2, shade(col, -0.14), Math.max(0.5, r * 0.04)));
  out.push(sh(circle(0, 0, r * 0.3), centre), sh(circle(-r * 0.07, -r * 0.07, r * 0.14), shade(centre, 0.35)));
  return out;
}

/** Cabbage rose seen from the front, centred on the origin. */
export function rose(r: number, col: string, seed = 1): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [];
  const dark = shade(col, -0.2), light = shade(col, 0.28);
  const ring = (n: number, rr: number, c: string, off: number) => {
    let d = '';
    for (let i = 0; i < n; i++) {
      const a = off + (i * 360) / n + g.range(-8, 8);
      const [x, y] = polar(0, 0, rr * 0.45, a);
      d += ellipse(x, y, rr * 0.62, rr * 0.5, a + 90);
    }
    out.push(sh(d, c));
  };
  ring(6, r, dark, g.range(0, 60));
  ring(5, r * 0.84, col, g.range(0, 60));
  ring(5, r * 0.62, light, g.range(0, 60));
  out.push(sh(circle(0, 0, r * 0.34), col));
  out.push(stroke(curve([polar(0, 0, r * 0.26, 200), polar(0, 0, r * 0.2, 290), polar(0, 0, r * 0.12, 20), polar(0, 0, r * 0.05, 120)]), dark, Math.max(0.7, r * 0.07)));
  return out;
}

/** Small simple rose (3 shapes) for distant climbers. */
export function roseBud(r: number, col: string): Shape[] {
  return [
    sh(blossomPath(0, 0, r, 5, 0.78, -90), shade(col, -0.12)),
    sh(circle(-r * 0.1, -r * 0.1, r * 0.62), shade(col, 0.2)),
    sh(circle(r * 0.05, 0, r * 0.28), shade(col, -0.25)),
  ];
}

/** Big ruffled peony, centred on the origin. */
export function peony(r: number, col: string, seed = 1): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [];
  const layer = (n: number, rr: number, c: string, wid: number) => {
    const off = g.range(0, 360);
    let d = '';
    for (let i = 0; i < n; i++) d += petal(0, 0, rr * g.range(0.92, 1.05), rr * wid, off + (i * 360) / n + g.range(-6, 6));
    out.push(sh(d, c));
  };
  layer(8, r, shade(col, -0.16), 0.5);
  layer(7, r * 0.86, col, 0.5);
  layer(7, r * 0.68, shade(col, 0.22), 0.48);
  layer(6, r * 0.5, shade(col, 0.42), 0.46);
  layer(5, r * 0.32, shade(col, 0.12), 0.5);
  out.push(sh(blossomPath(0, 0, r * 0.16, 6, 0.6), C.yellow));
  return out;
}

/** Tulip on a stem; origin at the foot of the stem, flower at the top (height h). */
export function tulip(h: number, col: string, lean = 0): Shape[] {
  const top: Pt = [lean, -h];
  const r = h * 0.17;
  return [
    stroke(curve([[0, 0], [lean * 0.3, -h * 0.5], top]), C.leaf, Math.max(1.4, h * 0.03)),
    sh(leaf(0, 0, h * 0.6, h * 0.07, -100 - lean * 0.3), C.leafLight),
    sh(leaf(0, 0, h * 0.5, h * 0.07, -72), C.leaf),
    sh(petal(top[0], top[1] + r * 0.8, r * 2.1, r * 0.75, -108), shade(col, -0.15)),
    sh(petal(top[0], top[1] + r * 0.8, r * 2.1, r * 0.75, -72), shade(col, -0.15)),
    sh(petal(top[0], top[1] + r * 0.9, r * 2.2, r * 0.7, -90), shade(col, 0.12)),
  ];
}

/** Flower spike (lavender, foxglove, delphinium); origin at the foot. */
export function spike(h: number, col: string, seed = 1, fat = 1): Shape[] {
  const g = rng(seed);
  const lean = g.range(-0.12, 0.12) * h;
  const out: Shape[] = [stroke(curve([[0, 0], [lean * 0.4, -h * 0.5], [lean, -h]]), C.leaf, Math.max(1.2, h * 0.022))];
  const n = Math.max(5, Math.round(7 * fat + 3));
  let dA = '', dB = '';
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const y = -h * (0.4 + 0.6 * t);
    const x = lean * (0.4 + 0.6 * t) * (0.4 + 0.6 * t);
    const w = h * 0.075 * fat * (1.15 - t * 0.85);
    const side = i % 2 ? 1 : -1;
    const e = ellipse(x + side * w * 0.55, y, w, w * 0.8, side * 25);
    if (i % 2) dA += e; else dB += e;
  }
  out.push(sh(dB, shade(col, -0.14)), sh(dA, col));
  out.push(sh(ellipse(lean, -h - h * 0.01, h * 0.03 * fat, h * 0.045 * fat), shade(col, 0.25)));
  return out;
}

/** Allium: globe of starry florets on a tall stem. */
export function allium(h: number, col: string, seed = 1): Shape[] {
  const g = rng(seed);
  const r = h * 0.15;
  const out: Shape[] = [stroke(line([[0, 0], [0, -h + r]]), C.moss, Math.max(1.3, h * 0.025)), sh(circle(0, -h, r), shade(col, -0.12))];
  let d = '';
  for (let i = 0; i < 8; i++) {
    const [x, y] = polar(0, -h, r * g.range(0.1, 0.78), g.range(0, 360));
    d += star(x, y, r * 0.27, r * 0.1, 5, g.range(0, 72));
  }
  out.push(sh(d, shade(col, 0.3)));
  return out;
}

/** Fan of strap or broad leaves from the origin. */
export function leafClump(seed: number, n: number, len: number, wid: number, col: string, spread = 150): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [];
  for (let i = 0; i < n; i++) {
    const a = -90 - spread / 2 + (spread * (i + 0.5)) / n + g.range(-6, 6);
    const l = len * g.range(0.7, 1.05);
    const c = i % 3 === 0 ? shade(col, -0.14) : i % 3 === 1 ? col : shade(col, 0.16);
    out.push(sh(leaf(0, 0, l, wid * g.range(0.8, 1.1), a), c));
  }
  return out;
}

/** A leafy stem: curved stalk with paired leaves. Grows upward to height h. */
export function leafSpray(h: number, col: string, seed = 1, pairs = 4): Shape[] {
  const g = rng(seed);
  const lean = g.range(-0.25, 0.25) * h;
  const out: Shape[] = [stroke(curve([[0, 0], [lean * 0.4, -h * 0.55], [lean, -h]]), shade(col, -0.25), Math.max(1.2, h * 0.025))];
  for (let i = 0; i < pairs; i++) {
    const t = (i + 1) / (pairs + 0.6);
    const x = lean * t * t, y = -h * t;
    const l = h * 0.34 * (1.1 - t * 0.5);
    out.push(sh(leaf(x, y, l, l * 0.3, -150 - g.range(0, 25)), i % 2 ? col : shade(col, -0.12)));
    out.push(sh(leaf(x, y, l, l * 0.3, -30 + g.range(0, 25)), i % 2 ? shade(col, 0.14) : col));
  }
  out.push(sh(leaf(lean, -h, h * 0.26, h * 0.08, -90 + lean * 0.2), shade(col, 0.2)));
  return out;
}

/** Rounded shrub with leaf dabs; width w, height h, base at origin. */
export function bush(seed: number, w: number, h: number, col: string, dabs = 10): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [];
  const lump = (cx: number, cy: number, rx: number, ry: number, c: string) => {
    const pts: Pt[] = [];
    const n = 9;
    for (let i = 0; i < n; i++) {
      const a = (i * 360) / n;
      const k = g.range(0.82, 1.12);
      pts.push([cx + Math.cos(rad(a)) * rx * k, cy + Math.sin(rad(a)) * ry * k]);
    }
    out.push(sh(blob(pts, 1), c));
  };
  lump(0, -h * 0.48, w * 0.5, h * 0.5, shade(col, -0.2));
  lump(-w * 0.16, -h * 0.58, w * 0.3, h * 0.34, col);
  lump(w * 0.18, -h * 0.5, w * 0.27, h * 0.32, shade(col, -0.06));
  lump(-w * 0.02, -h * 0.74, w * 0.22, h * 0.2, shade(col, 0.16));
  let dl = '', dd = '';
  for (let i = 0; i < dabs; i++) {
    const x = g.range(-w * 0.42, w * 0.42), y = -g.range(h * 0.1, h * 0.9);
    const l = leaf(x, y, w * g.range(0.1, 0.16), w * 0.04, g.range(0, 360));
    if (i % 2) dl += l; else dd += l;
  }
  if (dl) out.push(sh(dl, shade(col, 0.3)));
  if (dd) out.push(sh(dd, shade(col, -0.32)));
  return out;
}

/** Terracotta flower pot; origin bottom-centre, rim width w, height h. */
export function pot(w: number, h: number, col = C.terracotta): Shape[] {
  const bw = w * 0.34, tw = w * 0.46, rimH = h * 0.2;
  return [
    sh(poly([[-tw, -h + rimH], [tw, -h + rimH], [bw, 0], [-bw, 0]]), col),
    sh(poly([[tw * 0.35, -h + rimH], [tw, -h + rimH], [bw, 0], [bw * 0.3, 0]]), shade(col, -0.16)),
    sh(poly([[-tw * 0.8, -h + rimH], [-tw * 0.55, -h + rimH], [-bw * 0.6, 0], [-bw * 0.82, 0]]), shade(col, 0.22)),
    sh(rect(-w / 2, -h, w, rimH, rimH * 0.3), shade(col, 0.08)),
    sh(rect(-w / 2 + w * 0.6, -h, w * 0.4, rimH, rimH * 0.3), shade(col, -0.1)),
    sh(rect(-tw, -h + rimH, tw * 2, h * 0.05), shade(col, -0.3), { opacity: 0.5 }),
  ];
}

/** Soil mound sitting in a pot of rim width w (origin at rim top-centre). */
export function soil(w: number): Shape[] {
  return [sh(ellipse(0, 0, w * 0.44, w * 0.09), '#5a4334'), sh(ellipse(-w * 0.1, -w * 0.02, w * 0.2, w * 0.04), '#6f5644')];
}

export interface BirdCols { back: string; breast: string; wing: string; beak?: string; cap?: string }
/** Small songbird in profile facing right; origin at its feet, about 70 long. */
export function bird(c: BirdCols, legs = true): Shape[] {
  const out: Shape[] = [];
  if (legs) out.push(stroke(line([[-3, -9], [-4, 0], [-9, 1]]) + line([[5, -9], [6, 0], [1, 1]]) + line([[-4, 0], [1, 1]]) + line([[6, 0], [11, 1]]), C.bark, 1.6));
  out.push(sh(poly([[-22, -26], [-56, -34], [-58, -27], [-54, -21], [-22, -13]]), shade(c.wing, -0.15)));
  out.push(sh(blob([[-28, -22], [-12, -38], [10, -44], [22, -34], [20, -18], [6, -8], [-14, -9]], 1), c.back));
  out.push(sh(blob([[-10, -12], [2, -26], [18, -30], [22, -20], [14, -10], [2, -7]], 1), c.breast));
  out.push(sh(circle(18, -41, 12.5), c.cap ?? c.back));
  out.push(sh(blob([[10, -36], [20, -40], [29, -37], [27, -28], [16, -27]], 1), c.breast));
  out.push(sh(blob([[-30, -22], [-18, -34], [2, -36], [8, -26], [-6, -17], [-22, -16]], 1), c.wing));
  out.push(stroke(curve([[-24, -22], [-10, -26], [2, -27]]) + curve([[-20, -19], [-8, -21], [0, -22]]), shade(c.wing, -0.3), 1.2));
  out.push(sh(poly([[28.5, -44], [42, -40], [28.5, -37]]), c.beak ?? C.gold));
  out.push(sh(circle(22, -43.5, 2.6), C.ink), sh(circle(22.8, -44.4, 0.9), '#ffffff'));
  return out;
}

/** Bird in flight seen from afar (simple silhouette, about 40 wide). */
export function flyingBird(col = C.ink): Shape[] {
  return [stroke(curve([[-20, -4], [-10, -10], [0, 0], [10, -10], [20, -4]]), col, 2.2)];
}

/** Butterfly from above, wings open; about 60 wide, centred on origin. */
export function butterfly(col: string, col2 = C.cream, body = C.ink): Shape[] {
  const wingU = blob([[3, -4], [14, -22], [30, -24], [32, -10], [18, 0]], 1);
  const wingL = blob([[3, 2], [18, 2], [26, 12], [18, 22], [8, 16]], 1);
  const flip = (d: string) => xf(d, { sx: -1 });
  const dotU = circle(22, -15, 4.2) + circle(14, -8, 2.4);
  const dotL = circle(17, 11, 3.2);
  return [
    sh(wingL + flip(wingL), shade(col, -0.12)),
    sh(wingU + flip(wingU), col),
    sh(dotU + flip(dotU) + dotL + flip(dotL), col2),
    stroke(curve([[4, -4], [16, -12], [28, -20]]) + flip(curve([[4, -4], [16, -12], [28, -20]])), shade(col, -0.3), 1),
    sh(ellipse(0, 0, 3, 13), body),
    sh(circle(0, -13, 3.4), body),
    stroke(curve([[-1, -15], [-5, -22], [-9, -25]]) + curve([[1, -15], [5, -22], [9, -25]]), body, 1.1),
  ];
}

/** Bumblebee in profile, about 34 long, centred on origin. */
export function bee(): Shape[] {
  return [
    sh(ellipse(-3, -11, 9, 5.5, -28) + ellipse(6, -11, 8, 5, 20), '#e9f3f6', { opacity: 0.9 }),
    stroke(ellipse(-3, -11, 9, 5.5, -28) + ellipse(6, -11, 8, 5, 20), '#9fb6bf', 0.8),
    sh(ellipse(0, 0, 13, 8.5), C.yellow),
    sh(poly([[-5, -8], [-1, -8.6], [-1, 8.6], [-5, 8]]) + poly([[3, -8.3], [7, -7.2], [7, 7.2], [3, 8.3]]), C.ink),
    sh(sectorish(-13, 0), C.ink),
    sh(circle(12, -1, 6), C.ink),
    sh(circle(14, -2.5, 1.3), '#ffffff'),
    stroke(curve([[14, -6], [18, -11], [21, -11]]), C.ink, 1),
  ];
}
function sectorish(x: number, y: number): string {
  return poly([[x + 3, y - 6.5], [x - 3, y], [x + 3, y + 6.5]]);
}

/** Ladybird from above, about 30 long, heading up. */
export function ladybird(): Shape[] {
  return [
    stroke(line([[-10, -6], [-16, -10]]) + line([[10, -6], [16, -10]]) + line([[-12, 2], [-18, 3]]) + line([[12, 2], [18, 3]]) + line([[-10, 9], [-15, 14]]) + line([[10, 9], [15, 14]]), C.ink, 1.6),
    sh(ellipse(0, -11, 7.5, 6), C.ink),
    sh(ellipse(0, 1, 13, 14), C.red),
    sh(ellipse(-5, -4, 4, 6, 20), shade(C.red, 0.25), { opacity: 0.7 }),
    stroke(line([[0, -12], [0, 15]]), C.ink, 1.6),
    sh(circle(-6, -2, 2.8) + circle(6, -2, 2.8) + circle(-5, 7, 2.5) + circle(5, 7, 2.5) + circle(-9, 3, 1.6) + circle(9, 3, 1.6), C.ink),
    sh(circle(-3.5, -13, 1.6) + circle(3.5, -13, 1.6), '#ffffff'),
    stroke(curve([[-2, -16], [-4, -21]]) + curve([[2, -16], [4, -21]]), C.ink, 1),
  ];
}

/** Garden snail in profile, heading right; origin at the foot, about 60 long. */
export function snail(shell = '#c98d54'): Shape[] {
  const out: Shape[] = [
    sh(blob([[-30, 0], [-22, -7], [0, -8], [22, -9], [30, -18], [36, -26], [41, -24], [38, -12], [34, -2], [20, 0]], 0.9), '#d9c58f'),
    sh(blob([[-28, -1], [0, -3], [30, -3], [20, 0], [-20, 0]], 0.9), '#bba76f'),
    stroke(line([[36, -25], [34, -37]]) + line([[40, -24], [43, -35]]), '#bba76f', 1.8),
    sh(circle(34, -38, 2.2) + circle(43, -36, 2.2), C.ink),
    sh(circle(-2, -24, 21), shade(shell, -0.15)),
    sh(circle(-2, -24, 17.5), shell),
    sh(circle(-3, -23, 11), shade(shell, 0.2)),
    sh(circle(-4, -22, 5.5), shell),
  ];
  out.push(stroke(curve([[-4, -22], [1, -27], [-7, -32], [-14, -22], [-3, -11], [12, -20], [6, -38]]), shade(shell, -0.4), 1.5));
  return out;
}

/** Watering can in profile, spout to the left; origin bottom-centre of the body, about 150 wide. */
export function wateringCan(col = '#6f9f8f'): Shape[] {
  const dk = shade(col, -0.22), lt = shade(col, 0.25);
  return [
    stroke(curve([[26, -62], [56, -84], [70, -44], [34, -16]]), dk, 7),
    stroke(curve([[-28, -70], [0, -96], [28, -70]]), dk, 6),
    sh(poly([[-36, -30], [-88, -74], [-82, -82], [-34, -48]]), dk),
    sh(poly([[-78, -70], [-96, -70], [-102, -92], [-86, -90]]), col),
    sh(ellipse(-99, -81, 4.5, 12, -15), lt),
    sh(circle(-100, -86, 1) + circle(-99, -80, 1) + circle(-98, -75, 1), dk),
    sh(poly([[-36, -70], [36, -70], [40, 0], [-40, 0]]), col),
    sh(poly([[12, -70], [36, -70], [40, 0], [16, 0]]), dk),
    sh(poly([[-30, -70], [-22, -70], [-25, 0], [-34, 0]]), lt),
    sh(rect(-40, -74, 80, 8, 3), lt),
    sh(rect(-41, -22, 82, 6), dk, { opacity: 0.7 }),
    sh(rect(-41, -6, 82, 6, 2), dk),
  ];
}

/** Brick courses filling a rectangle (running bond). Returns merged shapes. */
export function bricks(x: number, y: number, w: number, h: number, seed: number, bw = 46, bh = 18, gap = 3, base = C.brick): Shape[] {
  const g = rng(seed);
  const cols = [base, shade(base, -0.12), shade(base, 0.12), mix(base, '#8a5a52', 0.5), mix(base, '#d99a6c', 0.45), shade(base, -0.22)];
  const out: Shape[] = [];
  let row = 0;
  for (let yy = y; yy < y + h - 1; yy += bh, row++) {
    const hh = Math.min(bh, y + h - yy) - gap;
    if (hh < 2) continue;
    let xx = x - (row % 2 ? bw / 2 : 0) - g.range(0, 4);
    while (xx < x + w) {
      const ww = bw * g.range(0.92, 1.08);
      const x0 = Math.max(x, xx), x1 = Math.min(x + w, xx + ww - gap);
      if (x1 - x0 > 3) out.push(sh(rect(x0, yy, x1 - x0, hh, 1.5), g.pick(cols)));
      xx += ww;
    }
  }
  return bucket(out);
}

/** Puffy cloud centred on origin, about 2*w wide. */
export function cloud(w: number, col = '#ffffff'): Shape[] {
  return [
    sh(ellipse(0, 0, w, w * 0.22) + circle(-w * 0.4, -w * 0.14, w * 0.26) + circle(0, -w * 0.26, w * 0.34) + circle(w * 0.42, -w * 0.12, w * 0.24), col, { opacity: 0.9 }),
    sh(ellipse(w * 0.05, w * 0.06, w * 0.8, w * 0.1), '#dfeef5', { opacity: 0.8 }),
  ];
}

/** Garden bench facing the viewer; origin bottom-centre, width w. */
export function bench(w: number, col = C.wood): Shape[] {
  const out: Shape[] = [];
  const dk = shade(col, -0.25), lt = shade(col, 0.2);
  const hw = w / 2, seatY = -w * 0.26, backTop = -w * 0.58;
  out.push(sh(rect(-hw + 4, backTop, 9, -backTop, 2) + rect(hw - 13, backTop, 9, -backTop, 2), dk));
  for (let i = 0; i < 4; i++) out.push(sh(rect(-hw + 10, backTop + 6 + i * w * 0.07, w - 20, w * 0.05, 2), i % 2 ? col : lt));
  out.push(sh(rect(-hw - 4, seatY - 2, w + 8, w * 0.06, 3), lt));
  out.push(sh(rect(-hw - 2, seatY + w * 0.055, w + 4, w * 0.045, 2), dk));
  out.push(sh(rect(-hw + 6, seatY + w * 0.1, 10, -seatY - w * 0.1, 2) + rect(hw - 16, seatY + w * 0.1, 10, -seatY - w * 0.1, 2), col));
  out.push(sh(rect(-hw - 6, seatY - w * 0.13, 9, w * 0.14, 3) + rect(hw - 3, seatY - w * 0.13, 9, w * 0.14, 3), dk));
  out.push(sh(rect(-hw - 10, seatY - w * 0.15, 30, 7, 3) + rect(hw - 20, seatY - w * 0.15, 30, 7, 3), lt));
  out.push(sh(rect(-hw + 16, -w * 0.09, w - 32, 5, 2), dk));
  return out;
}

/** Tuft of grass blades at origin. */
export function tuftPath(x: number, y: number, s: number, g: Rng): string {
  let d = '';
  const n = 3 + g.int(0, 2);
  for (let i = 0; i < n; i++) d += leaf(x + g.range(-3, 3) * s, y, s * g.range(9, 18), s * 1.7, -90 + g.range(-32, 32));
  return d;
}

/** Sample a polyline: returns points every `step` units with the local angle (degrees). */
export function along(pts: Pt[], step: number): { p: Pt; a: number }[] {
  const out: { p: Pt; a: number }[] = [];
  let carry = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    const len = Math.hypot(x1 - x0, y1 - y0);
    const a = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
    let t = carry;
    while (t < len) {
      out.push({ p: [x0 + ((x1 - x0) * t) / len, y0 + ((y1 - y0) * t) / len], a });
      t += step;
    }
    carry = t - len;
  }
  return out;
}

/** Climbing vine following a guide polyline: stem, leaves and optional blooms. */
export function vine(pts: Pt[], seed: number, o: { leaf?: string; leafLen?: number; step?: number; bloom?: string[]; bloomR?: number; bloomEvery?: number; stem?: string; stemW?: number } = {}): Shape[] {
  const g = rng(seed);
  const lc = o.leaf ?? C.leaf, len = o.leafLen ?? 16, step = o.step ?? 14;
  const out: Shape[] = [stroke(curve(pts), o.stem ?? C.bark, o.stemW ?? 2.5)];
  let d1 = '', d2 = '', d3 = '';
  const blooms: Shape[] = [];
  along(pts, step).forEach(({ p, a }, i) => {
    const jx = g.range(-5, 5), jy = g.range(-5, 5);
    for (const side of [-1, 1]) {
      const l = leaf(p[0] + jx, p[1] + jy, len * g.range(0.7, 1.15), len * 0.32, a + side * g.range(40, 110));
      const k = g.int(0, 2);
      if (k === 0) d1 += l; else if (k === 1) d2 += l; else d3 += l;
    }
    if (o.bloom && i % (o.bloomEvery ?? 3) === 1) {
      const r = (o.bloomR ?? 8) * g.range(0.75, 1.2);
      blooms.push(...place(roseBud(r, g.pick(o.bloom)), { x: p[0] + g.range(-12, 12), y: p[1] + g.range(-12, 12), rot: g.range(0, 72) }));
    }
  });
  if (d1) out.push(sh(d1, shade(lc, -0.18)));
  if (d2) out.push(sh(d2, lc));
  if (d3) out.push(sh(d3, shade(lc, 0.2)));
  out.push(...blooms);
  return out;
}

/** Drooping fern / trailing plant for hanging baskets and shelf edges. */
export function trailer(len: number, col: string, seed = 1, n = 5): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [];
  for (let i = 0; i < n; i++) {
    const dx = g.range(-0.6, 0.6) * len;
    const l = len * g.range(0.6, 1);
    const pts: Pt[] = [[0, 0], [dx * 0.5, -l * 0.15], [dx, l * 0.5], [dx * 1.1, l]];
    out.push(stroke(curve(pts), shade(col, -0.25), 1.3));
    let d = '';
    along(pts, len * 0.13).forEach(({ p, a }, k) => {
      if (k === 0) return;
      d += leaf(p[0], p[1], len * 0.12, len * 0.045, a + 60) + leaf(p[0], p[1], len * 0.12, len * 0.045, a - 60);
    });
    out.push(sh(d, i % 2 ? col : shade(col, 0.18)));
  }
  return out;
}

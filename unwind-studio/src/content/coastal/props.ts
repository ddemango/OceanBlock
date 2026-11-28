// Shared props for the Coastal Escape collection. Every prop is drawn around
// the origin and returns Shape[]; position it with place().
import { rect, ellipse, circle, poly, line, curve, blob, leaf, sh, stroke, place, mix, shade, rng } from '../../art/kit';
import type { Shape } from '../../art/types';

export type Pt = [number, number];
const n = (v: number) => String(Math.round(v * 10) / 10);
export const M = (x: number, y: number) => `M${n(x)} ${n(y)}`;
export const L = (x: number, y: number) => `L${n(x)} ${n(y)}`;
export const Q = (cx: number, cy: number, x: number, y: number) => `Q${n(cx)} ${n(cy)} ${n(x)} ${n(y)}`;
export const CB = (a: number, b: number, c: number, d: number, x: number, y: number) => `C${n(a)} ${n(b)} ${n(c)} ${n(d)} ${n(x)} ${n(y)}`;

export const WALLS = ['#f4c9a8', '#f6dc9c', '#f2b5a0', '#e89a7c', '#f7ecd4', '#c9dfe0', '#f0cf7a', '#e6b8c4', '#dfe6c4', '#f5a878', '#bcd3e6', '#f9e4b8'];
export const SHUTTERS = ['#3f7d6e', '#2f6690', '#8c3b2e', '#4f6f52', '#c75f3c', '#1f5c73', '#6b4a2f', '#f7f2e4', '#356e8f', '#2e6b57'];
export const ROOFS = ['#c9673f', '#b85a38', '#d27a4c', '#b0552f', '#c86f48'];

/** Horizontal slat lines inside a rectangle, as one multi-subpath stroke path. */
export function slats(x: number, y: number, w: number, h: number, count: number): string {
  let d = '';
  for (let i = 1; i <= count; i++) d += line([[x, y + (h * i) / (count + 1)], [x + w, y + (h * i) / (count + 1)]]);
  return d;
}
/** Vertical bars inside a rectangle, as one multi-subpath stroke path. */
export function bars(x: number, y: number, w: number, h: number, count: number): string {
  let d = '';
  for (let i = 0; i <= count; i++) d += line([[x + (w * i) / count, y], [x + (w * i) / count, y + h]]);
  return d;
}

export interface WinOpts { shutter: string; lod: number; lit?: boolean; box?: boolean; closed?: boolean; frame?: string; seed?: number }
/** Shuttered window centred on the origin. w/h are the glass size; shutters hang outside. */
export function win(w: number, h: number, o: WinOpts): Shape[] {
  const out: Shape[] = [];
  const frame = o.frame ?? '#fbf1dc';
  const sw = w * 0.52, x0 = -w / 2, y0 = -h / 2;
  const glass = o.lit ? '#ffc861' : '#48697a';
  if (o.lod >= 1) out.push(sh(rect(x0 - 1.5, y0 - 1.5, w + 3, h + 3), frame));
  if (o.closed) {
    out.push(sh(rect(x0, y0, w / 2, h), o.shutter), sh(rect(0, y0, w / 2, h), shade(o.shutter, -0.14)));
    if (o.lod >= 1) out.push(stroke(slats(x0 + 1, y0, w - 2, h, Math.round(h / 3.2)), shade(o.shutter, -0.32), 0.7));
  } else {
    out.push(sh(rect(x0, y0, w, h), glass));
    if (o.lod >= 1) {
      out.push(sh(poly([[x0, y0], [x0 + w * 0.6, y0], [x0, y0 + h * 0.65]]), o.lit ? '#ffe9ae' : '#86aab6', { opacity: 0.85 }));
      out.push(stroke(line([[0, y0], [0, y0 + h]]) + line([[x0, -h * 0.12], [x0 + w, -h * 0.12]]), frame, Math.max(0.8, w * 0.08)));
    }
    out.push(sh(rect(x0 - sw, y0, sw, h), o.shutter), sh(rect(x0 + w, y0, sw, h), shade(o.shutter, -0.18)));
    if (o.lod >= 2) {
      const c = Math.round(h / 3.4);
      out.push(stroke(slats(x0 - sw + 1, y0, sw - 2, h, c) + slats(x0 + w + 1, y0, sw - 2, h, c), shade(o.shutter, -0.34), 0.7));
    }
  }
  if (o.lod >= 1) out.push(sh(rect(x0 - 3, y0 + h, w + 6, Math.max(1.6, h * 0.08)), shade(frame, -0.14)));
  if (o.box && o.lod >= 1) {
    const r = rng(o.seed ?? 7);
    const by = y0 + h + Math.max(1.6, h * 0.08);
    out.push(sh(rect(x0 - 3, by, w + 6, h * 0.17), '#93563a'));
    let g = '', f = '', f2 = '';
    for (let i = 0; i < 6; i++) g += ellipse(r.range(x0 - 3, -x0 + 3), by - r.range(0, h * 0.12), w * 0.2, h * 0.11);
    for (let i = 0; i < 6; i++) f += circle(r.range(x0 - 3, -x0 + 3), by - r.range(0, h * 0.2), Math.max(1.1, w * 0.09));
    for (let i = 0; i < 4; i++) f2 += circle(r.range(x0 - 3, -x0 + 3), by - r.range(0, h * 0.2), Math.max(0.9, w * 0.07));
    const fc = r.pick(['#d6336c', '#e4572e', '#c2255c', '#f06595']);
    out.push(sh(g, '#4f7a3f'), sh(f, fc), sh(f2, shade(fc, 0.35)));
  }
  return out;
}

/** Panelled door, origin at bottom centre. */
export function door(w: number, h: number, color: string, lod: number): Shape[] {
  const out: Shape[] = [];
  out.push(sh(rect(-w / 2 - 2.5, -h - 2.5, w + 5, h + 2.5, w * 0.5), '#f6ead0'));
  out.push(sh(rect(-w / 2, -h, w, h, w * 0.45), color));
  out.push(sh(rect(0, -h * 0.82, w / 2, h * 0.82), shade(color, -0.16)));
  if (lod >= 1) {
    out.push(stroke(rect(-w * 0.36, -h * 0.66, w * 0.28, h * 0.26) + rect(w * 0.08, -h * 0.66, w * 0.28, h * 0.26) + rect(-w * 0.36, -h * 0.32, w * 0.28, h * 0.24) + rect(w * 0.08, -h * 0.32, w * 0.28, h * 0.24), shade(color, -0.36), 0.8));
    out.push(sh(circle(w * 0.07, -h * 0.4, Math.max(0.9, w * 0.05)), '#e9c46a'));
    out.push(sh(rect(-w / 2 - 5, -2, w + 10, 3.5), '#cdbb9a'));
  }
  return out;
}

/** Striped awning, origin at top centre, hanging down by h. */
export function awning(w: number, h: number, c1: string, c2: string, stripes: number): Shape[] {
  const out: Shape[] = [];
  const top = w * 0.9;
  out.push(sh(poly([[-top / 2, 0], [top / 2, 0], [w / 2, h], [-w / 2, h]]), c1));
  let d = '', v = '';
  for (let i = 0; i < stripes; i += 2) {
    const a = i / stripes, b = (i + 1) / stripes;
    d += poly([[-top / 2 + top * a, 0], [-top / 2 + top * b, 0], [-w / 2 + w * b, h], [-w / 2 + w * a, h]]);
    v += M(-w / 2 + w * a, h) + L(-w / 2 + w * b, h) + L(-w / 2 + w * b, h + h * 0.22) + Q(-w / 2 + w * (a + b) / 2, h + h * 0.4, -w / 2 + w * a, h + h * 0.22) + 'Z';
  }
  let v1 = '';
  for (let i = 1; i < stripes; i += 2) {
    const a = i / stripes, b = (i + 1) / stripes;
    v1 += M(-w / 2 + w * a, h) + L(-w / 2 + w * b, h) + L(-w / 2 + w * b, h + h * 0.22) + Q(-w / 2 + w * (a + b) / 2, h + h * 0.4, -w / 2 + w * a, h + h * 0.22) + 'Z';
  }
  out.push(sh(v1, shade(c1, -0.1)), sh(d, c2), sh(v, shade(c2, -0.12)));
  out.push(sh(poly([[-top / 2, 0], [top / 2, 0], [top / 2 + 1, h * 0.12], [-top / 2 - 1, h * 0.12]]), '#ffffff', { opacity: 0.25 }));
  return out;
}

/** Bougainvillea / flowering climber filling roughly w × h around the origin (centre). */
export function bougainvillea(w: number, h: number, seed: number, color = '#c2257a'): Shape[] {
  const r = rng(seed);
  let g = '', g2 = '', f = '', f2 = '', f3 = '';
  const cnt = Math.max(6, Math.round((w * h) / 260));
  const pt = (): Pt => { const a = r.range(0, Math.PI * 2), q = Math.sqrt(r.next()); return [Math.cos(a) * q * w / 2, Math.sin(a) * q * h / 2]; };
  for (let i = 0; i < cnt; i++) { const [x, y] = pt(); g += ellipse(x, y, r.range(w * 0.1, w * 0.2), r.range(h * 0.07, h * 0.14), r.range(-40, 40)); }
  for (let i = 0; i < cnt / 2; i++) { const [x, y] = pt(); g2 += ellipse(x - w * 0.04, y - h * 0.04, r.range(w * 0.05, w * 0.1), r.range(h * 0.04, h * 0.07), r.range(-40, 40)); }
  const fr = Math.max(1.4, Math.min(w, h) * 0.055);
  for (let i = 0; i < cnt * 2.2; i++) { const [x, y] = pt(); f += circle(x, y, r.range(fr * 0.8, fr * 1.5)); }
  for (let i = 0; i < cnt * 1.6; i++) { const [x, y] = pt(); f2 += circle(x - 1, y - 1, r.range(fr * 0.6, fr * 1.2)); }
  for (let i = 0; i < cnt * 0.8; i++) { const [x, y] = pt(); f3 += circle(x - 1.5, y - 1.5, r.range(fr * 0.4, fr * 0.8)); }
  return [sh(g, '#3e6b3c'), sh(g2, '#6c9a4c'), sh(f, shade(color, -0.12)), sh(f2, color), sh(f3, shade(color, 0.45))];
}

/** Rounded tree clump; origin at bottom centre. */
export function treeClump(w: number, h: number, seed: number, col = '#55783f'): Shape[] {
  const r = rng(seed);
  let a = '', b = '', c = '';
  for (let i = 0; i < 7; i++) a += ellipse(r.range(-w * 0.3, w * 0.3), -r.range(h * 0.25, h * 0.7), r.range(w * 0.22, w * 0.34), r.range(h * 0.2, h * 0.3));
  for (let i = 0; i < 5; i++) b += ellipse(r.range(-w * 0.34, w * 0.1), -r.range(h * 0.45, h * 0.8), r.range(w * 0.1, w * 0.2), r.range(h * 0.08, h * 0.16));
  for (let i = 0; i < 4; i++) c += ellipse(r.range(-w * 0.05, w * 0.36), -r.range(h * 0.15, h * 0.45), r.range(w * 0.1, w * 0.2), r.range(h * 0.07, h * 0.14));
  return [sh(rect(-w * 0.04, -h * 0.3, w * 0.08, h * 0.3), '#6b4a2f'), sh(a, col), sh(b, mix(col, '#e8d27a', 0.4)), sh(c, shade(col, -0.25))];
}

/** Slim cypress; origin at bottom centre. */
export function cypress(h: number, col = '#3d5f3c'): Shape[] {
  const w = h * 0.2;
  return [
    sh(rect(-w * 0.08, -h * 0.1, w * 0.16, h * 0.1), '#5a3f2a'),
    sh(blob([[0, -h], [w * 0.42, -h * 0.55], [w * 0.5, -h * 0.2], [0, -h * 0.05], [-w * 0.5, -h * 0.2], [-w * 0.42, -h * 0.55]], 0.9), col),
    sh(blob([[-w * 0.05, -h * 0.95], [-w * 0.1, -h * 0.5], [-w * 0.18, -h * 0.15], [-w * 0.46, -h * 0.22], [-w * 0.38, -h * 0.55]], 0.9), mix(col, '#d9c66a', 0.35)),
  ];
}

/** Palm tree; origin at the base of the trunk. */
export function palm(h: number, seed: number): Shape[] {
  const r = rng(seed), out: Shape[] = [];
  const top: Pt = [h * 0.08, -h];
  out.push(stroke(curve([[0, 0], [-h * 0.03, -h * 0.4], [h * 0.02, -h * 0.75], top]), '#8a6a45', h * 0.055));
  out.push(stroke(curve([[-h * 0.012, 0], [-h * 0.04, -h * 0.4], [h * 0.008, -h * 0.75], [top[0] - h * 0.01, -h]]), '#b08a5c', h * 0.018));
  let ring = '';
  for (let i = 1; i < 9; i++) ring += line([[-h * 0.045 + (i > 4 ? h * 0.02 : 0), -h * i * 0.1], [h * 0.02 + (i > 4 ? h * 0.02 : 0), -h * i * 0.1 - 1]]);
  out.push(stroke(ring, '#6b4f33', 0.9));
  const angs = [-170, -140, -110, -75, -45, -15, 15, 195];
  let d1 = '', d2 = '';
  angs.forEach((a, i) => { const l = h * r.range(0.36, 0.5); const d = leaf(top[0], top[1], l, l * 0.17, a + r.range(-6, 6)); if (i % 2) d1 += d; else d2 += d; });
  out.push(sh(d2, '#3f6f45'), sh(d1, '#5c8f4f'));
  out.push(sh(circle(top[0], top[1] + 2, h * 0.035), '#7a5a35'));
  return out;
}

/** Soft cloud centred at origin. */
export function cloud(w: number, h: number, seed: number, top: string, under: string): Shape[] {
  const r = rng(seed);
  let a = '', b = '', c = '';
  const k = 6;
  for (let i = 0; i < k; i++) {
    const t = i / (k - 1), x = -w / 2 + w * t, ry = h * (0.35 + 0.65 * Math.sin(Math.PI * (0.12 + 0.76 * t))) * r.range(0.75, 1.05);
    b += ellipse(x, h * 0.18, w * 0.2, ry * 0.75);
    a += ellipse(x, -ry * 0.15, w * 0.19, ry * 0.72);
    if (i > 0 && i < k - 1) c += ellipse(x - w * 0.04, -ry * 0.45, w * 0.1, ry * 0.25);
  }
  return [sh(b, under), sh(a, top), sh(c, shade(top, 0.5), { opacity: 0.8 })];
}

/** Flying gull drawn with two wing strokes, centred at origin; `s` is the wingspan. */
export function gull(s: number, col = '#ffffff', tilt = 0): Shape[] {
  const d = M(-s / 2, -s * 0.06) + Q(-s * 0.3, -s * 0.34, 0, 0) + Q(s * 0.28, -s * 0.36, s / 2, -s * 0.1);
  const body = ellipse(0, s * 0.02, s * 0.11, s * 0.045);
  const tips = M(-s / 2, -s * 0.06) + Q(-s * 0.42, -s * 0.2, -s * 0.36, -s * 0.22) + M(s / 2, -s * 0.1) + Q(s * 0.42, -s * 0.22, s * 0.36, -s * 0.24);
  return place([stroke(d, col, Math.max(1.4, s * 0.075)), sh(body, col), stroke(tips, '#4a4a55', Math.max(1.4, s * 0.075)), sh(circle(s * 0.12, s * 0.015, s * 0.02), '#e9a13a')], { rot: tilt });
}

export interface HouseOpts {
  w: number; h: number; wall: string; shutter: string; roof: 'shed' | 'hip' | 'gable' | 'flat'; roofColor?: string;
  /** Approximate storey height; windows, roof and details scale from it. */
  unit: number; seed: number; lod: number; litChance?: number; door?: string; awning?: [string, string]; vine?: string; shop?: boolean;
}
/** Mediterranean town house, origin at bottom centre. */
export function house(o: HouseOpts): Shape[] {
  const r = rng(o.seed), out: Shape[] = [];
  const { w, h, wall, lod, unit } = o, x0 = -w / 2;
  const floors = Math.max(1, Math.round(h / unit)), cols = Math.max(1, Math.round(w / (unit * 0.86)));
  const fh = h / floors, cw = w / cols;
  out.push(sh(rect(x0, -h, w, h), wall));
  out.push(sh(poly([[x0, -h], [x0 + w * 0.45, -h], [x0 + w * 0.22, 0], [x0, 0]]), shade(wall, 0.25), { opacity: 0.55 }));
  out.push(sh(rect(x0 + w * 0.85, -h, w * 0.15, h), shade(wall, -0.12), { opacity: 0.85 }));
  if (lod >= 1) {
    let d = '';
    for (let i = 0; i < 4; i++) d += ellipse(r.range(x0 + 8, -x0 - 8), r.range(-h + 8, -8), r.range(5, w * 0.12), r.range(2.5, 7), r.range(-20, 20));
    out.push(sh(d, shade(wall, -0.07), { opacity: 0.7 }));
    let s = '';
    for (let f = 1; f < floors; f++) s += rect(x0, -fh * f - 1.2, w, 2.4);
    if (s) out.push(sh(s, shade(wall, 0.35), { opacity: 0.8 }));
    out.push(sh(rect(x0, -unit * 0.14, w, unit * 0.14), shade(wall, -0.22)));
  }
  const ww = cw * 0.33, wh = fh * 0.5;
  const doorCol = r.int(0, cols - 1), balCol = r.int(0, cols - 1), balFloor = floors > 1 ? r.int(1, floors - 1) : -1;
  const hasBal = lod >= 1 && r.next() < 0.6;
  for (let f = 0; f < floors; f++) for (let c = 0; c < cols; c++) {
    const cx = x0 + cw * (c + 0.5), cy = -fh * (f + 0.5);
    if (f === 0 && o.door && c === doorCol) { out.push(...place(door(ww * 1.7, fh * 0.76, o.door, lod), { x: cx, y: 0 })); continue; }
    if (f === 0 && o.shop) {
      const sw2 = cw * 0.72, sh2 = fh * 0.7;
      out.push(sh(rect(cx - sw2 / 2 - 2, -sh2 - 2, sw2 + 4, sh2 + 2, sw2 * 0.3), '#f6ead0'));
      out.push(sh(rect(cx - sw2 / 2, -sh2, sw2, sh2, sw2 * 0.28), '#5b3f30'));
      out.push(sh(rect(cx - sw2 / 2 + 3, -sh2 * 0.7, sw2 - 6, sh2 * 0.45), '#f3b95f', { opacity: 0.85 }));
      let it = '';
      for (let i = 0; i < 5; i++) it += circle(cx - sw2 / 2 + 6 + (i * (sw2 - 12)) / 4, -sh2 * 0.3, sw2 * 0.07);
      out.push(sh(it, r.pick(['#e4572e', '#f5cf3a', '#7fb069', '#f08a4b'])));
      out.push(sh(rect(cx - sw2 / 2, -sh2 * 0.24, sw2, sh2 * 0.24), '#7a5236'));
      continue;
    }
    const isBal = hasBal && f === balFloor && c === balCol;
    const tall = isBal ? 1.35 : 1;
    out.push(...place(win(ww, wh * tall, { shutter: o.shutter, lod, lit: r.next() < (o.litChance ?? 0.14), closed: !isBal && r.next() < 0.2, box: !isBal && r.next() < 0.3, seed: r.int(1, 99999) }), { x: cx, y: cy + (isBal ? wh * 0.1 : 0) }));
    if (isBal) {
      const by = cy + wh * 0.78, bw = cw * 0.86;
      out.push(sh(rect(cx - bw / 2, by, bw, Math.max(2, unit * 0.06)), shade(wall, -0.3)));
      out.push(stroke(bars(cx - bw / 2 + 1, by - wh * 0.5, bw - 2, wh * 0.5, Math.round(bw / 3.5)) + line([[cx - bw / 2, by - wh * 0.5], [cx + bw / 2, by - wh * 0.5]]), '#3a3a3f', Math.max(0.7, unit * 0.02)));
    }
  }
  if (lod >= 2 && cols >= 2 && floors >= 2 && r.next() < 0.5) {
    const f = r.int(1, floors - 1), ly = -fh * (f + 0.5) + wh * 0.5 + unit * 0.2;
    const xa = x0 + cw * 0.5, xb = x0 + cw * 1.5;
    out.push(stroke(curve([[xa, ly], [(xa + xb) / 2, ly + unit * 0.09], [xb, ly]]), '#6b5b4b', 0.8));
    const cols2 = ['#f7f2e4', '#e4572e', '#7fb4cf', '#f5cf3a', '#f7f2e4'];
    for (let i = 0; i < 4; i++) { const lx = xa + ((xb - xa) * (i + 0.6)) / 4.6; out.push(sh(rect(lx - unit * 0.05, ly + unit * 0.05, unit * 0.1, unit * r.range(0.12, 0.2)), cols2[(i + o.seed) % 5])); }
  }
  // roof
  const rc = o.roofColor ?? '#c9673f';
  out.push(sh(rect(x0, -h, w, Math.max(2, unit * 0.08)), shade(wall, -0.35), { opacity: 0.45 }));
  const rh = unit * 0.36, ov = unit * 0.1;
  if (o.roof === 'shed' || o.roof === 'hip') {
    const inset = o.roof === 'hip' ? Math.min(w * 0.16, rh * 1.1) : 1.5;
    out.push(sh(poly([[x0 - ov, -h], [x0 + inset, -h - rh], [-x0 - inset, -h - rh], [-x0 + ov, -h]]), rc));
    out.push(sh(poly([[x0 - ov, -h], [x0 + inset, -h - rh], [x0 + w * 0.5, -h - rh], [x0 + w * 0.35, -h]]), shade(rc, 0.16), { opacity: 0.8 }));
    if (lod >= 1) {
      let t = '';
      const cnt = Math.round(w / (unit * 0.11));
      for (let i = 1; i < cnt; i++) { const a = i / cnt; t += line([[x0 + inset + (w - inset * 2) * a, -h - rh], [x0 - ov + (w + ov * 2) * a, -h]]); }
      out.push(stroke(t, shade(rc, -0.24), 0.8));
      out.push(stroke(line([[x0 - ov + (inset + ov) * 0.5, -h - rh * 0.5], [-x0 + ov - (inset + ov) * 0.5, -h - rh * 0.5]]), shade(rc, -0.14), 0.8));
      out.push(stroke(line([[x0 - ov, -h], [-x0 + ov, -h]]), shade(rc, -0.38), Math.max(1.2, unit * 0.04)));
      out.push(stroke(line([[x0 + inset, -h - rh], [-x0 - inset, -h - rh]]), shade(rc, 0.3), Math.max(1, unit * 0.03)));
    }
  } else if (o.roof === 'gable') {
    const gh = Math.min(w * 0.28, unit * 0.8);
    out.push(sh(poly([[x0, -h], [0, -h - gh], [-x0, -h]]), shade(wall, 0.06)));
    out.push(sh(poly([[0, -h - gh], [-x0, -h], [w * 0.12, -h]]), shade(wall, -0.1), { opacity: 0.6 }));
    const th = Math.max(3, unit * 0.13);
    out.push(sh(poly([[x0 - ov, -h], [0, -h - gh - th * 0.6], [0, -h - gh + th * 0.7], [x0 - ov, -h + th]]), shade(rc, 0.12)));
    out.push(sh(poly([[-x0 + ov, -h], [0, -h - gh - th * 0.6], [0, -h - gh + th * 0.7], [-x0 + ov, -h + th]]), shade(rc, -0.14)));
    if (lod >= 1) out.push(sh(circle(0, -h - gh * 0.33, Math.max(2, gh * 0.16)), '#48697a'), stroke(circle(0, -h - gh * 0.33, Math.max(2, gh * 0.16)), '#fbf1dc', 1));
  } else {
    const ph = unit * 0.2;
    out.push(sh(rect(x0 - 1, -h - ph, w + 2, ph), shade(wall, 0.12)), sh(rect(x0 - 2, -h - ph - 2, w + 4, 2.6), shade(wall, -0.2)));
    if (lod >= 1) {
      const k = r.next();
      if (k < 0.45) {
        out.push(stroke(line([[x0 + 4, -h - ph - unit * 0.42], [x0 + 4, -h - ph]]) + line([[-x0 - 4, -h - ph - unit * 0.42], [-x0 - 4, -h - ph]]), '#6b5b4b', 1));
        out.push(stroke(curve([[x0 + 4, -h - ph - unit * 0.4], [0, -h - ph - unit * 0.33], [-x0 - 4, -h - ph - unit * 0.4]]), '#6b5b4b', 0.7));
        const cs = ['#f7f2e4', '#7fb4cf', '#e4572e', '#f7f2e4', '#f5cf3a', '#e6b8c4'];
        const m = Math.max(3, Math.round(w / (unit * 0.24)));
        for (let i = 0; i < m; i++) { const lx = x0 + 8 + ((w - 16) * (i + 0.3)) / m; out.push(sh(rect(lx, -h - ph - unit * 0.36, unit * 0.13, unit * r.range(0.14, 0.24)), cs[(i + o.seed) % cs.length])); }
      } else {
        for (let i = 0; i < 3; i++) {
          const px = x0 + w * (0.2 + 0.3 * i), s = unit * 0.11;
          out.push(sh(poly([[px - s, -h - ph - 2], [px + s, -h - ph - 2], [px + s * 0.75, -h - ph - 2 - s * 1.5], [px - s * 0.75, -h - ph - 2 - s * 1.5]]), '#c9673f'));
          out.push(sh(ellipse(px, -h - ph - 2 - s * 2.6, s * 1.5, s * 1.4), i % 2 ? '#4f7a3f' : '#6c9a4c'));
        }
      }
    }
  }
  if (o.roof !== 'flat' && o.roof !== 'gable' && r.next() < 0.55) {
    const cx = r.range(x0 + w * 0.25, -x0 - w * 0.25), cwid = unit * 0.16;
    out.push(sh(rect(cx - cwid / 2, -h - rh - unit * 0.22, cwid, unit * 0.34), shade(wall, -0.05)));
    out.push(sh(rect(cx, -h - rh - unit * 0.22, cwid / 2, unit * 0.34), shade(wall, -0.2)));
    out.push(sh(rect(cx - cwid / 2 - 1.5, -h - rh - unit * 0.26, cwid + 3, unit * 0.06), rc));
  }
  if (o.awning) {
    out.push(sh(rect(x0 + w * 0.04, -fh * 0.92 + fh * 0.3, w * 0.92, fh * 0.2), '#3b2a20', { opacity: 0.22 }));
    out.push(...place(awning(w * 0.94, fh * 0.26, o.awning[0], o.awning[1], cols * 4), { x: 0, y: -fh * 0.98 }));
  }
  if (o.vine) {
    const side = r.next() < 0.5 ? -1 : 1;
    out.push(...place(bougainvillea(w * 0.42, h * 0.42, o.seed + 5, o.vine), { x: side * w * 0.36, y: -h * 0.8 }));
    out.push(...place(bougainvillea(w * 0.22, h * 0.3, o.seed + 9, o.vine), { x: side * w * 0.43, y: -h * 0.5 }));
  }
  return out;
}

export interface BoatOpts { len: number; hull: string; stripe: string; keel?: string; cabin?: boolean; mast?: boolean; seed?: number; cargo?: boolean }
/** Small fishing boat in side view, bow to the right, origin at centre of the waterline. */
export function boat(o: BoatOpts): Shape[] {
  const Ln = o.len, hh = Ln * 0.16, out: Shape[] = [];
  const r = rng(o.seed ?? 3);
  const keel = o.keel ?? '#8c3b2e';
  const hullD = M(-Ln * 0.5, -hh * 1.05) + L(Ln * 0.5, -hh * 1.35) + Q(Ln * 0.46, -hh * 0.2, Ln * 0.36, 0) + L(-Ln * 0.42, 0) + Q(-Ln * 0.5, -hh * 0.2, -Ln * 0.5, -hh * 1.05) + 'Z';
  if (o.mast) {
    const mx = -Ln * 0.02, mh = Ln * 0.62;
    out.push(stroke(line([[mx, -hh], [mx, -hh - mh]]), '#7a5a3a', Math.max(1.6, Ln * 0.018)));
    out.push(stroke(line([[mx, -hh - mh * 0.9], [Ln * 0.46, -hh * 1.3]]) + line([[mx, -hh - mh * 0.9], [-Ln * 0.47, -hh]]), '#5b4a3a', 0.8));
    out.push(stroke(line([[mx - Ln * 0.3, -hh - mh * 0.28], [mx + Ln * 0.26, -hh - mh * 0.36]]), '#7a5a3a', Math.max(1.4, Ln * 0.014)));
    out.push(sh(blob([[mx - Ln * 0.29, -hh - mh * 0.3], [mx - Ln * 0.1, -hh - mh * 0.39], [mx + Ln * 0.25, -hh - mh * 0.4], [mx + Ln * 0.1, -hh - mh * 0.29], [mx - Ln * 0.12, -hh - mh * 0.25]], 0.8), '#f3e6c8'));
    out.push(stroke(line([[mx - Ln * 0.2, -hh - mh * 0.37], [mx - Ln * 0.2, -hh - mh * 0.27]]) + line([[mx - Ln * 0.02, -hh - mh * 0.41], [mx - Ln * 0.02, -hh - mh * 0.28]]) + line([[mx + Ln * 0.14, -hh - mh * 0.41], [mx + Ln * 0.14, -hh - mh * 0.31]]), '#b99a6a', 0.9));
    out.push(sh(poly([[mx, -hh - mh], [mx + Ln * 0.09, -hh - mh + Ln * 0.025], [mx, -hh - mh + Ln * 0.05]]), o.stripe));
  }
  if (o.cabin) {
    const cx = -Ln * 0.26, cw = Ln * 0.22, ch = Ln * 0.15;
    out.push(sh(rect(cx, -hh - ch, cw, ch + 2), '#f7f2e4'), sh(rect(cx + cw * 0.72, -hh - ch, cw * 0.28, ch + 2), '#d9cfb8'));
    out.push(sh(rect(cx - 2, -hh - ch - Ln * 0.022, cw + 4, Ln * 0.026), o.stripe));
    out.push(sh(rect(cx + cw * 0.14, -hh - ch * 0.78, cw * 0.46, ch * 0.42), '#48697a'), sh(poly([[cx + cw * 0.14, -hh - ch * 0.78], [cx + cw * 0.4, -hh - ch * 0.78], [cx + cw * 0.14, -hh - ch * 0.5]]), '#86aab6'));
  }
  if (o.cargo) {
    out.push(sh(blob([[Ln * 0.04, -hh * 1.1], [Ln * 0.1, -hh * 1.75], [Ln * 0.2, -hh * 1.9], [Ln * 0.3, -hh * 1.55], [Ln * 0.33, -hh * 1.15]], 0.9), '#d98a4a'));
    out.push(stroke(curve([[Ln * 0.08, -hh * 1.35], [Ln * 0.18, -hh * 1.6], [Ln * 0.3, -hh * 1.35]]) + curve([[Ln * 0.12, -hh * 1.7], [Ln * 0.2, -hh * 1.4], [Ln * 0.26, -hh * 1.7]]), '#a85f2e', 0.8));
    out.push(sh(circle(Ln * 0.37, -hh * 1.45, Ln * 0.03), '#e4572e'), sh(circle(Ln * 0.365, -hh * 1.47, Ln * 0.012), '#f7b59a'));
    out.push(sh(rect(-Ln * 0.02 - Ln * 0.07, -hh * 1.5, Ln * 0.09, hh * 0.5), '#6f8fb0'), sh(rect(-Ln * 0.02 - Ln * 0.07, -hh * 1.5, Ln * 0.09, hh * 0.12), '#9bb6cf'));
  }
  out.push(sh(hullD, o.hull));
  // sunlit top-left wash and shaded stern-to-bow underside
  out.push(sh(M(-Ln * 0.5, -hh * 1.05) + L(Ln * 0.5, -hh * 1.35) + Q(Ln * 0.485, -hh * 0.95, Ln * 0.455, -hh * 0.62) + L(-Ln * 0.49, -hh * 0.5) + 'Z', o.stripe));
  out.push(sh(M(-Ln * 0.5, -hh * 1.05) + L(Ln * 0.5, -hh * 1.35) + L(Ln * 0.49, -hh * 1.15) + L(-Ln * 0.5, -hh * 0.88) + 'Z', shade(o.hull, 0.1)));
  out.push(sh(M(-Ln * 0.47, -hh * 0.24) + L(Ln * 0.4, -hh * 0.3) + Q(Ln * 0.385, -hh * 0.1, Ln * 0.36, 0) + L(-Ln * 0.42, 0) + Q(-Ln * 0.455, -hh * 0.06, -Ln * 0.47, -hh * 0.24) + 'Z', keel));
  out.push(stroke(M(-Ln * 0.5, -hh * 1.05) + L(Ln * 0.5, -hh * 1.35), shade(o.hull, -0.3), Math.max(1.2, Ln * 0.014)));
  out.push(stroke(M(-Ln * 0.485, -hh * 0.5) + L(Ln * 0.45, -hh * 0.6), shade(o.stripe, -0.25), 0.8));
  out.push(sh(circle(Ln * 0.4, -hh * 0.9, Ln * 0.016), '#fbf1dc'), sh(circle(Ln * 0.402, -hh * 0.9, Ln * 0.007), '#27323a'));
  // fenders
  for (let i = 0; i < 3; i++) {
    const fx = -Ln * 0.3 + i * Ln * 0.27 + r.range(-3, 3);
    out.push(stroke(line([[fx, -hh * 1.12 - (fx / Ln) * hh * 0.3], [fx, -hh * 0.75]]), '#5b4a3a', 0.7));
    out.push(sh(ellipse(fx, -hh * 0.55, Ln * 0.017, hh * 0.24), i % 2 ? '#f08a4b' : '#f7f2e4'));
  }
  return out;
}

/** Mirror a prop through y = 0 as a soft water reflection. */
export function reflect(shapes: Shape[], squash = 0.55, opacity = 0.32): Shape[] {
  return place(shapes, { sy: -squash }).map((s) => ({ ...s, opacity: (s.opacity ?? 1) * opacity }));
}

/** Lemon lying on its side, centred at origin. rx is the half-length. */
export function lemon(rx: number, ry: number, rot = 0, col = '#f5cf3a'): Shape[] {
  const body = blob([[-rx * 1.16, 0], [-rx * 0.86, -ry * 0.58], [-rx * 0.3, -ry], [rx * 0.4, -ry * 0.96], [rx * 0.9, -ry * 0.5], [rx * 1.2, 0], [rx * 0.9, ry * 0.52], [rx * 0.35, ry], [-rx * 0.3, ry * 0.98], [-rx * 0.86, ry * 0.58]]);
  const under = blob([[-rx * 0.9, ry * 0.3], [0, ry * 0.55], [rx * 0.9, ry * 0.15], [rx * 1.15, 0.05 * ry], [rx * 0.9, ry * 0.52], [rx * 0.35, ry], [-rx * 0.3, ry * 0.98], [-rx * 0.86, ry * 0.58]]);
  return place([
    sh(body, col), sh(under, mix(col, '#c98a1e', 0.55), { opacity: 0.75 }),
    sh(ellipse(-rx * 0.3, -ry * 0.45, rx * 0.36, ry * 0.2, -12), shade(col, 0.55), { opacity: 0.85 }),
    sh(ellipse(rx * 1.13, 0, rx * 0.08, ry * 0.13), '#b9a53a'),
    sh(ellipse(-rx * 1.1, 0, rx * 0.07, ry * 0.12), '#8a8f3a'),
  ], { rot });
}

/** Citrus leaf with a lighter half and a midrib, growing from origin along rot. */
export function citrusLeaf(len: number, rot: number, col = '#3f6f3a'): Shape[] {
  const wid = len * 0.24;
  const top = M(0, 0) + Q(len * 0.45, -wid, len, 0) + 'Z';
  return place([sh(leaf(0, 0, len, wid), col), sh(top, shade(col, 0.2)), stroke(line([[0, 0], [len * 0.94, 0]]), shade(col, 0.45), Math.max(0.8, len * 0.02))], { rot });
}

export { rect, ellipse, circle, poly, line, curve, blob, leaf, sh, stroke, place, mix, shade, rng };

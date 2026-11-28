// Turns a photo into a paint-by-number artwork. Pure; runs in Node too.
//
// 1. Cluster the pixels into a small palette (k-means in Lab colour space).
// 2. Clean up: merge specks and slivers into their neighbours until every
//    area is big enough to see, tap and label.
// 3. Trace the outline of each connected area and simplify it.
//
// Areas are drawn largest-outline first, so an area that sits inside another
// is drawn on top of it — holes never need to be cut. Every outline is pushed
// out by a fraction of a pixel so neighbours overlap slightly instead of
// leaving hairline gaps; each area keeps a solid core no neighbour can reach,
// which is where its number goes.
import type { PaletteColor, PaintRegion } from '../content/types';
import { rng } from '../art/kit';

export interface Pixels { width: number; height: number; data: Uint8ClampedArray | number[] }

export interface PaintifyOptions {
  colors: number;
  /** Smallest area kept, in grid pixels. */
  minArea: number;
  /** Upper bound on the number of areas. */
  maxRegions: number;
  /** Artwork units per grid pixel. */
  scale: number;
  seed?: number;
}

export interface PaintifyResult { width: number; height: number; palette: PaletteColor[]; regions: PaintRegion[] }

// ---------- colour ----------
const lin = (c: number) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
function toLab(r: number, g: number, b: number): [number, number, number] {
  const R = lin(r), G = lin(g), B = lin(b);
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const x = f((R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047);
  const y = f(R * 0.2126 + G * 0.7152 + B * 0.0722);
  const z = f((R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883);
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}
const hex = (r: number, g: number, b: number) => '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');

function hsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  if (mx === mn) return [0, 0, l];
  const d = mx - mn;
  const s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  const h = mx === r ? ((g - b) / d + (g < b ? 6 : 0)) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}

/** A friendly name for a colour, e.g. "Light blue" or "Deep green". */
export function colorName(r: number, g: number, b: number): string {
  const [h, s, l] = hsl(r, g, b);
  if (s < 0.13 || (l > 0.93) || l < 0.08) {
    if (l > 0.9) return 'White';
    if (l > 0.7) return 'Light grey';
    if (l > 0.45) return 'Grey';
    if (l > 0.2) return 'Charcoal';
    return 'Black';
  }
  let base: string;
  if (h < 12 || h >= 345) base = 'red';
  else if (h < 40) base = l < 0.42 ? 'brown' : 'orange';
  else if (h < 64) base = l < 0.38 ? 'olive' : s < 0.45 && l > 0.6 ? 'sand' : 'yellow';
  else if (h < 90) base = 'lime';
  else if (h < 160) base = 'green';
  else if (h < 190) base = 'teal';
  else if (h < 250) base = 'blue';
  else if (h < 290) base = 'purple';
  else if (h < 330) base = 'magenta';
  else base = 'pink';
  if (base === 'red' && l > 0.68) base = 'pink';
  const tone = l > 0.8 ? 'Pale ' : l > 0.64 ? 'Light ' : l < 0.26 ? 'Dark ' : l < 0.4 ? 'Deep ' : '';
  const word = tone + base;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// ---------- clustering ----------
function kmeans(lab: Float32Array, n: number, k: number, seed: number): Uint8Array {
  const r = rng(seed);
  const cent = new Float32Array(k * 3);
  // k-means++ seeding on a sample
  const first = r.int(0, n - 1);
  cent.set(lab.subarray(first * 3, first * 3 + 3), 0);
  const dist = new Float32Array(n).fill(Infinity);
  for (let c = 1; c < k; c++) {
    let total = 0;
    for (let i = 0; i < n; i++) {
      const dl = lab[i * 3] - cent[(c - 1) * 3], da = lab[i * 3 + 1] - cent[(c - 1) * 3 + 1], db = lab[i * 3 + 2] - cent[(c - 1) * 3 + 2];
      const d = dl * dl + da * da + db * db;
      if (d < dist[i]) dist[i] = d;
      total += dist[i];
    }
    let pick = r.next() * total, idx = 0;
    for (; idx < n - 1; idx++) { pick -= dist[idx]; if (pick <= 0) break; }
    cent.set(lab.subarray(idx * 3, idx * 3 + 3), c * 3);
  }
  const lbl = new Uint8Array(n);
  const sum = new Float64Array(k * 3), cnt = new Uint32Array(k);
  for (let iter = 0; iter < 14; iter++) {
    sum.fill(0); cnt.fill(0);
    let moved = 0;
    for (let i = 0; i < n; i++) {
      let best = 0, bd = Infinity;
      for (let c = 0; c < k; c++) {
        const dl = lab[i * 3] - cent[c * 3], da = lab[i * 3 + 1] - cent[c * 3 + 1], db = lab[i * 3 + 2] - cent[c * 3 + 2];
        const d = dl * dl + da * da + db * db;
        if (d < bd) { bd = d; best = c; }
      }
      if (lbl[i] !== best) moved++;
      lbl[i] = best; cnt[best]++;
      sum[best * 3] += lab[i * 3]; sum[best * 3 + 1] += lab[i * 3 + 1]; sum[best * 3 + 2] += lab[i * 3 + 2];
    }
    for (let c = 0; c < k; c++) if (cnt[c]) for (let j = 0; j < 3; j++) cent[c * 3 + j] = sum[c * 3 + j] / cnt[c];
    if (iter > 2 && moved < n * 0.002) break;
  }
  return lbl;
}

/**
 * Edge-preserving smoothing (a small bilateral filter in Lab): evens out
 * grain and texture inside an area but keeps the outlines between areas sharp.
 */
function smooth(lab: Float32Array, w: number, h: number, passes: number, sigma = 12): Float32Array {
  let src = lab;
  const R = 2, k2 = 1 / (2 * sigma * sigma);
  const sw = new Float32Array((2 * R + 1) ** 2);
  for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) sw[(dy + R) * (2 * R + 1) + dx + R] = Math.exp(-(dx * dx + dy * dy) / 4.5);
  for (let pass = 0; pass < passes; pass++) {
    const out = new Float32Array(src.length);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 3;
      const l0 = src[i], a0 = src[i + 1], b0 = src[i + 2];
      let L = 0, A = 0, B = 0, W = 0;
      for (let dy = -R; dy <= R; dy++) {
        const yy = y + dy;
        if (yy < 0 || yy >= h) continue;
        for (let dx = -R; dx <= R; dx++) {
          const xx = x + dx;
          if (xx < 0 || xx >= w) continue;
          const j = (yy * w + xx) * 3;
          const dl = src[j] - l0, da = src[j + 1] - a0, db = src[j + 2] - b0;
          const wt = sw[(dy + R) * (2 * R + 1) + dx + R] * Math.exp(-(dl * dl + da * da + db * db) * k2);
          L += src[j] * wt; A += src[j + 1] * wt; B += src[j + 2] * wt; W += wt;
        }
      }
      out[i] = L / W; out[i + 1] = A / W; out[i + 2] = B / W;
    }
    src = out;
  }
  return src;
}

/** Majority filter over 3×3 neighbourhoods: removes salt-and-pepper speckle. */
function modeFilter(lbl: Uint8Array, w: number, h: number, k: number): Uint8Array {
  const out = new Uint8Array(lbl);
  const votes = new Uint16Array(k);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    votes.fill(0);
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const xx = x + dx, yy = y + dy;
      if (xx >= 0 && yy >= 0 && xx < w && yy < h) votes[lbl[yy * w + xx]]++;
    }
    const own = lbl[y * w + x];
    let best = own;
    for (let c = 0; c < k; c++) if (votes[c] > votes[best]) best = c;
    if (votes[best] >= 5) out[y * w + x] = best;
  }
  return out;
}

// ---------- connected areas ----------
interface Comps { id: Int32Array; size: number[]; count: number }

function components(lbl: Uint8Array, w: number, h: number): Comps {
  const id = new Int32Array(w * h).fill(-1);
  const size: number[] = [];
  const stack: number[] = [];
  let count = 0;
  for (let s = 0; s < w * h; s++) {
    if (id[s] >= 0) continue;
    const c = count++, L = lbl[s];
    let n = 0;
    id[s] = c; stack.push(s);
    while (stack.length) {
      const p = stack.pop()!;
      n++;
      const x = p % w, y = (p - x) / w;
      if (x > 0 && id[p - 1] < 0 && lbl[p - 1] === L) { id[p - 1] = c; stack.push(p - 1); }
      if (x < w - 1 && id[p + 1] < 0 && lbl[p + 1] === L) { id[p + 1] = c; stack.push(p + 1); }
      if (y > 0 && id[p - w] < 0 && lbl[p - w] === L) { id[p - w] = c; stack.push(p - w); }
      if (y < h - 1 && id[p + w] < 0 && lbl[p + w] === L) { id[p + w] = c; stack.push(p + w); }
    }
    size.push(n);
  }
  return { id, size, count };
}

const CORE = 2; // a core pixel has every pixel within this Chebyshev radius in the same area

/** Which areas contain at least one core pixel. */
function coreMask(cp: Comps, w: number, h: number): { has: Uint8Array; core: Uint8Array } {
  const { id } = cp;
  const row = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = CORE; x < w - CORE; x++) {
    const c = id[y * w + x];
    let ok = 1;
    for (let d = -CORE; d <= CORE && ok; d++) if (id[y * w + x + d] !== c) ok = 0;
    row[y * w + x] = ok;
  }
  const core = new Uint8Array(w * h);
  const has = new Uint8Array(cp.count);
  for (let y = CORE; y < h - CORE; y++) for (let x = CORE; x < w - CORE; x++) {
    const i = y * w + x, c = id[i];
    let ok = 1;
    for (let d = -CORE; d <= CORE && ok; d++) if (!row[i + d * w] || id[i + d * w] !== c) ok = 0;
    if (ok) { core[i] = 1; has[c] = 1; }
  }
  return { has, core };
}

/** Merge every area that is too small or has no core into the neighbour it shares the most border with. */
function cleanUp(lbl: Uint8Array, w: number, h: number, minArea: number, maxRegions: number): { cp: Comps; core: Uint8Array } {
  let min = minArea;
  for (let round = 0; round < 40; round++) {
    const cp = components(lbl, w, h);
    const { has, core } = coreMask(cp, w, h);
    const bad = new Uint8Array(cp.count);
    let nBad = 0;
    for (let c = 0; c < cp.count; c++) if (cp.size[c] < min || !has[c]) { bad[c] = 1; nBad++; }
    if (!nBad) {
      if (cp.count <= maxRegions) return { cp, core };
      min = Math.ceil(min * 1.35) + 1;
      continue;
    }
    // border counts: bad area → neighbouring area → shared edges
    const border = new Map<number, Map<number, number>>();
    const note = (c: number, o: number) => {
      let m = border.get(c);
      if (!m) border.set(c, (m = new Map()));
      m.set(o, (m.get(o) ?? 0) + 1);
    };
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = y * w + x, c = cp.id[i];
      if (!bad[c]) continue;
      if (x > 0 && cp.id[i - 1] !== c) note(c, cp.id[i - 1]);
      if (x < w - 1 && cp.id[i + 1] !== c) note(c, cp.id[i + 1]);
      if (y > 0 && cp.id[i - w] !== c) note(c, cp.id[i - w]);
      if (y < h - 1 && cp.id[i + w] !== c) note(c, cp.id[i + w]);
    }
    // Merge into the neighbour sharing the most border. Two bad neighbours never
    // merge into each other in the same round (they would just swap colours):
    // only the smaller one moves.
    const bigger = (a: number, b: number) => cp.size[a] > cp.size[b] || (cp.size[a] === cp.size[b] && a < b);
    const target = new Int16Array(cp.count).fill(-1);
    const compLabel = new Int16Array(cp.count);
    for (let i = 0; i < w * h; i++) compLabel[cp.id[i]] = lbl[i];
    for (const [c, m] of border) {
      let best = -1, bn = -1;
      for (const [o, n] of m) if (n > bn) { bn = n; best = o; }
      if (best < 0 || (bad[best] && !bigger(best, c))) continue;
      target[c] = compLabel[best];
    }
    let changed = false;
    for (let i = 0; i < w * h; i++) {
      const t = target[cp.id[i]];
      if (t >= 0 && t !== lbl[i]) { lbl[i] = t; changed = true; }
    }
    if (!changed) {
      // the only area left is "bad" (e.g. a tiny image): keep what we have
      return { cp, core };
    }
  }
  const cp = components(lbl, w, h);
  return { cp, core: coreMask(cp, w, h).core };
}

// ---------- outlines ----------
type P = [number, number];

/** Outer boundary of an area as an orthogonal polygon of pixel corners, clockwise (area on the right). */
function traceOuter(id: Int32Array, w: number, h: number, c: number, start: number): P[] {
  const inside = (x: number, y: number) => x >= 0 && y >= 0 && x < w && y < h && id[y * w + x] === c;
  const sx = start % w, sy = (start - sx) / w;
  let x = sx, y = sy, d = 0;
  const DX = [1, 0, -1, 0], DY = [0, 1, 0, -1];
  const pts: P[] = [[sx, sy]];
  for (let guard = 0; guard < 8 * w * h; guard++) {
    x += DX[d]; y += DY[d];
    let al: boolean, ar: boolean;
    if (d === 0) { ar = inside(x, y); al = inside(x, y - 1); }
    else if (d === 1) { ar = inside(x - 1, y); al = inside(x, y); }
    else if (d === 2) { ar = inside(x - 1, y - 1); al = inside(x - 1, y); }
    else { ar = inside(x, y - 1); al = inside(x - 1, y - 1); }
    const nd = al ? (d + 3) % 4 : ar ? d : (d + 1) % 4;
    if (x === sx && y === sy && nd === 0) break;
    if (nd !== d) pts.push([x, y]);
    d = nd;
  }
  return pts;
}

/** Push every corner of a clockwise orthogonal polygon outwards by `delta`. */
function grow(pts: P[], delta: number, w: number, h: number): P[] {
  const n = pts.length;
  // left normal of each edge direction (outwards, since the area is on the right)
  const nrm = (a: P, b: P): P => {
    const dx = Math.sign(b[0] - a[0]), dy = Math.sign(b[1] - a[1]);
    return [dy, -dx];
  };
  return pts.map((p, i) => {
    const a = nrm(pts[(i - 1 + n) % n], p), b = nrm(p, pts[(i + 1) % n]);
    // corners on the picture's edge are pushed well past it, so simplifying never pulls an outline in from the edge
    const ox = p[0] === 0 || p[0] === w ? 2 : 1, oy = p[1] === 0 || p[1] === h ? 2 : 1;
    return [p[0] + (a[0] + b[0]) * delta * ox, p[1] + (a[1] + b[1]) * delta * oy];
  });
}

function segDist(p: P, a: P, b: P): number {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const L = dx * dx + dy * dy;
  let t = L ? ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L : 0;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
}

function dp(pts: P[], tol: number): P[] {
  if (pts.length < 3) return pts.slice();
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack: [number, number][] = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop()!;
    let best = -1, bd = tol;
    for (let i = a + 1; i < b; i++) { const d = segDist(pts[i], pts[a], pts[b]); if (d > bd) { bd = d; best = i; } }
    if (best >= 0) { keep[best] = 1; stack.push([a, best], [best, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}

/** Douglas–Peucker for a closed ring. */
function simplifyRing(pts: P[], tol: number): P[] {
  if (pts.length <= 4) return pts;
  let far = 0, fd = -1;
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[0][0], pts[i][1] - pts[0][1]); if (d > fd) { fd = d; far = i; } }
  const a = dp(pts.slice(0, far + 1), tol);
  const b = dp([...pts.slice(far), pts[0]], tol);
  const out = [...a.slice(0, -1), ...b.slice(0, -1)];
  return out.length >= 3 ? out : pts;
}

const ringArea = (pts: P[]) => {
  let s = 0;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) s += (pts[j][0] - pts[i][0]) * (pts[j][1] + pts[i][1]);
  return Math.abs(s / 2);
};

// ---------- main ----------
export function paintify(px: Pixels, opt: PaintifyOptions): PaintifyResult {
  const { width: w, height: h } = px;
  const n = w * h;
  const lab = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) lab.set(toLab(px.data[i * 4], px.data[i * 4 + 1], px.data[i * 4 + 2]), i * 3);
  const k = Math.max(2, Math.min(opt.colors, 32));
  let lbl = kmeans(smooth(lab, w, h, 3), n, k, opt.seed ?? 7);
  lbl = modeFilter(modeFilter(lbl, w, h, k), w, h, k);
  const { cp, core } = cleanUp(lbl, w, h, opt.minArea, opt.maxRegions);

  // palette: the mean colour of what each label ended up covering
  const sum = new Float64Array(k * 3), cnt = new Uint32Array(k);
  for (let i = 0; i < n; i++) { const L = lbl[i]; cnt[L]++; for (let j = 0; j < 3; j++) sum[L * 3 + j] += px.data[i * 4 + j]; }
  const used = [...Array(k).keys()].filter((L) => cnt[L] > 0).map((L) => {
    const r = sum[L * 3] / cnt[L], g = sum[L * 3 + 1] / cnt[L], b = sum[L * 3 + 2] / cnt[L];
    const [hh, s, l] = hsl(r, g, b);
    return { L, r, g, b, key: s < 0.13 ? 1000 - l : hh + (1 - l) * 0.5 };
  }).sort((a, b) => a.key - b.key);
  const names = new Map<string, number>();
  const palette: PaletteColor[] = used.map((u, i) => {
    let name = colorName(u.r, u.g, u.b);
    const seen = names.get(name) ?? 0;
    names.set(name, seen + 1);
    if (seen) name += ` ${seen + 1}`;
    return { id: `c${i + 1}`, number: i + 1, name, hex: hex(u.r, u.g, u.b) };
  });
  const palOf = new Map(used.map((u, i) => [u.L, palette[i].id]));

  // label spot per area: the core pixel furthest from any other area (chamfer distance)
  const dist = new Float32Array(n).fill(1e9);
  for (let i = 0; i < n; i++) {
    const x = i % w, y = (i - x) / w, c = cp.id[i];
    if (x === 0 || y === 0 || x === w - 1 || y === h - 1 || cp.id[i - 1] !== c || cp.id[i + 1] !== c || cp.id[i - w] !== c || cp.id[i + w] !== c) dist[i] = 1;
  }
  for (let y = 1; y < h; y++) for (let x = 1; x < w - 1; x++) {
    const i = y * w + x;
    dist[i] = Math.min(dist[i], dist[i - 1] + 1, dist[i - w] + 1, dist[i - w - 1] + 1.414, dist[i - w + 1] + 1.414);
  }
  for (let y = h - 2; y >= 0; y--) for (let x = w - 2; x > 0; x--) {
    const i = y * w + x;
    dist[i] = Math.min(dist[i], dist[i + 1] + 1, dist[i + w] + 1, dist[i + w + 1] + 1.414, dist[i + w - 1] + 1.414);
  }
  const first = new Int32Array(cp.count).fill(-1), spot = new Int32Array(cp.count).fill(-1);
  for (let i = 0; i < n; i++) {
    const c = cp.id[i];
    if (first[c] < 0) first[c] = i;
    if (core[i] && (spot[c] < 0 || dist[i] > dist[spot[c]])) spot[c] = i;
  }

  const S = opt.scale;
  const f = (v: number) => String(Math.round(v * S * 10) / 10);
  const areas = [...Array(cp.count).keys()].map((c) => {
    const ring = traceOuter(cp.id, w, h, c, first[c]);
    return { c, ring, area: ringArea(ring) };
  }).sort((a, b) => b.area - a.area);

  const regions: PaintRegion[] = areas.map(({ c, ring }, idx) => {
    const pts = simplifyRing(grow(ring, 1, w, h), 1).map((p): P => [Math.max(0, Math.min(w, p[0])), Math.max(0, Math.min(h, p[1]))]);
    const d = 'M' + pts.map((p) => `${f(p[0])} ${f(p[1])}`).join('L') + 'Z';
    const s = spot[c] >= 0 ? spot[c] : first[c];
    const sx = s % w, sy = (s - sx) / w;
    return { id: `r${idx + 1}`, d, color: palOf.get(lbl[first[c]])!, label: [Math.round((sx + 0.5) * S * 10) / 10, Math.round((sy + 0.5) * S * 10) / 10] as [number, number] };
  });

  return { width: Math.round(w * S), height: Math.round(h * S), palette, regions };
}

/** Detail presets for photo paintings. */
export const PAINT_PRESETS = {
  Relaxed: { grid: 150, colors: 10, minArea: 45, maxRegions: 80 },
  Moderate: { grid: 190, colors: 14, minArea: 32, maxRegions: 150 },
  Detailed: { grid: 230, colors: 18, minArea: 22, maxRegions: 240 },
} as const;

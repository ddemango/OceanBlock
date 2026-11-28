// Hides little illustrated objects inside a photo for a hidden-object game.
// The objects come from the app's own scenes (every find target is a named,
// self-contained drawing), so they are original artwork. Pure; runs in Node too.
import { bboxOf, flattenPath } from '../art/geometry';
import { place, rng } from '../art/kit';
import type { Shape } from '../art/types';
import type { FindActivity, FindItem } from '../content/types';

export interface HideableObject { name: string; shapes: Shape[]; defs?: string; source: string }

/** Every named target from the given scenes, one per distinct name. */
export function objectPool(scenes: FindActivity[]): HideableObject[] {
  const seen = new Set<string>();
  const out: HideableObject[] = [];
  for (const s of scenes) for (const it of s.items) {
    if (!it.target || !it.name) continue;
    const key = it.name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ name: it.name, shapes: it.shapes, defs: s.defs, source: s.id });
  }
  return out;
}

export interface HideOptions {
  width: number;
  height: number;
  count: number;
  /** Object size (longest side) as a fraction of the photo's shorter side. */
  size: number;
  seed: number;
  /** How busy (detailed) the photo is around a point, 0..1, from relative coordinates. Busy spots hide objects better. */
  busy?: (u: number, v: number) => number;
}

/** A detail map of a small photo: local colour contrast, blurred, scaled to 0..1. */
export function busyMap(px: { width: number; height: number; data: ArrayLike<number> }): (u: number, v: number) => number {
  const { width: w, height: h, data } = px;
  const lum = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) lum[i] = data[i * 4] * 0.3 + data[i * 4 + 1] * 0.59 + data[i * 4 + 2] * 0.11;
  const edge = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const i = y * w + x;
    edge[i] = Math.abs(lum[i + 1] - lum[i - 1]) + Math.abs(lum[i + w] - lum[i - w]);
  }
  // box blur over ~6% of the picture so the score describes a neighbourhood, not a pixel
  const R = Math.max(2, Math.round(Math.max(w, h) * 0.03));
  const blur = (src: Float32Array, dx: number, dy: number) => {
    const out = new Float32Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      let s = 0, n = 0;
      for (let k = -R; k <= R; k++) {
        const xx = x + k * dx, yy = y + k * dy;
        if (xx >= 0 && yy >= 0 && xx < w && yy < h) { s += src[yy * w + xx]; n++; }
      }
      out[y * w + x] = s / n;
    }
    return out;
  };
  const b = blur(blur(edge, 1, 0), 0, 1);
  let max = 0;
  for (const v of b) if (v > max) max = v;
  return (u, v) => {
    const x = Math.min(w - 1, Math.max(0, Math.floor(u * w))), y = Math.min(h - 1, Math.max(0, Math.floor(v * h)));
    return max ? b[y * w + x] / max : 0;
  };
}

export function hideObjects(pool: HideableObject[], o: HideOptions): { items: FindItem[]; defs: string } {
  const r = rng(o.seed);
  const order = pool.map((p) => ({ p, k: r.next() })).sort((a, b) => a.k - b.k).map((x) => x.p);
  const placed: { x: number; y: number; rad: number }[] = [];
  const items: FindItem[] = [];
  const sources = new Set<string>();
  const defs: string[] = [];
  const short = Math.min(o.width, o.height);
  const margin = short * 0.03;
  for (const obj of order) {
    if (items.length >= o.count) break;
    const b = bboxOf(obj.shapes.flatMap((s) => flattenPath(s.d, 6)));
    const bw = b.x1 - b.x0, bh = b.y1 - b.y0;
    if (!(bw > 0 && bh > 0)) continue;
    // very long, thin objects are hard to spot at a small size; give them a little more length
    const target = short * o.size * (Math.max(bw, bh) / Math.min(bw, bh) > 2.5 ? 1.25 : 1);
    // Look at several free spots and take the busiest (with a little randomness),
    // so objects tuck into detail like leaves and flowers rather than plain sky.
    let size = target, spot: { x: number; y: number; rad: number } | null = null, bestScore = -1, found = 0;
    for (let attempt = 0; attempt < 600 && found < (o.busy ? 14 : 1); attempt++) {
      if (attempt && attempt % 150 === 0 && !spot) size *= 0.85;
      const s = size / Math.max(bw, bh);
      const rad = (Math.hypot(bw, bh) * s) / 2;
      if (rad * 2 + margin * 2 > short) continue;
      const x = r.range(margin + rad, o.width - margin - rad);
      const y = r.range(margin + rad, o.height - margin - rad);
      if (!placed.every((p) => Math.hypot(p.x - x, p.y - y) > (p.rad + rad) * 1.08)) continue;
      found++;
      const score = (o.busy ? o.busy(x / o.width, y / o.height) : 0) + r.next() * 0.25;
      if (score > bestScore && (!spot || rad === spot.rad)) { bestScore = score; spot = { x, y, rad }; }
    }
    if (!spot) continue;
    const s = size / Math.max(bw, bh);
    const rot = r.range(-22, 22);
    const cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2;
    const shapes = place(obj.shapes, { s, rot, ox: cx, oy: cy, x: spot.x - cx, y: spot.y - cy });
    placed.push(spot);
    items.push({ id: `o${items.length + 1}`, name: obj.name, target: true, shapes });
    if (obj.defs && !sources.has(obj.source)) { sources.add(obj.source); defs.push(obj.defs); }
  }
  return { items, defs: defs.join('') };
}

/** Number of objects and their size for each difficulty. */
export const FIND_PRESETS = {
  Relaxed: { count: 8, size: 0.11 },
  Moderate: { count: 12, size: 0.085 },
  Detailed: { count: 16, size: 0.065 },
} as const;

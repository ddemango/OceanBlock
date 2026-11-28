// Shared helpers for the travel paint-by-number artworks.
import { poly, blob } from '../../art/kit';

/** Format a number for a path string (one decimal). */
export const n = (v: number) => String(Math.round(v * 10) / 10);

/** A wall plane that starts at x0 and recedes toward a vanishing point (vx, vy). */
export interface Vanish { x0: number; vx: number; vy: number }

/** Height on the receding wall at x for a point that sits at height y where the wall starts. */
export const sidePt = (v: Vanish, x: number, y: number) => y + ((v.vy - y) * (x - v.x0)) / (v.vx - v.x0);

/** A rectangle painted on the receding wall, spanning xa..xb and (at the wall start) heights y1..y2. */
export const sideQuad = (v: Vanish, xa: number, xb: number, y1: number, y2: number) =>
  poly([[xa, sidePt(v, xa, y1)], [xb, sidePt(v, xb, y1)], [xb, sidePt(v, xb, y2)], [xa, sidePt(v, xa, y2)]]);

type P = [number, number];

/** A tapered limb (trunk, branch) following a centreline, width w0 at the start to w1 at the end. */
export function limb(pts: P[], w0: number, w1: number): string {
  const left: P[] = [], right: P[] = [];
  pts.forEach(([x, y], i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
    const w = (w0 + ((w1 - w0) * i) / (pts.length - 1)) / 2;
    left.push([x - (dy / len) * w, y + (dx / len) * w]);
    right.push([x + (dy / len) * w, y - (dx / len) * w]);
  });
  return blob([...left, ...right.reverse()], 0.5);
}

/** A soft scalloped cloud (blossom, foliage) around (cx, cy). */
export function scallop(cx: number, cy: number, rx: number, ry: number, bumps: number, phase = 0): string {
  const pts: P[] = [];
  for (let i = 0; i < bumps * 2; i++) {
    const a = phase + (i * Math.PI) / bumps;
    const k = i % 2 ? 0.86 : 1;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return blob(pts, 1);
}

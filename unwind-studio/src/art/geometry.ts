// Pure geometry helpers shared by content validation and all three engines.
// Paths are restricted to absolute M L H V C Q Z commands so they can be
// flattened, transformed and hit-tested without a DOM.

export type Pt = [number, number];
export type Poly = Pt[];
export interface BBox { x0: number; y0: number; x1: number; y1: number }
export type Matrix = [number, number, number, number, number, number]; // a b c d e f

export interface Cmd { c: 'M' | 'L' | 'C' | 'Q' | 'Z'; v: number[] }

const TOKEN = /([a-zA-Z])|(-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)/g;
const ARITY: Record<string, number> = { M: 2, L: 2, H: 1, V: 1, C: 6, Q: 4, Z: 0 };

export function parsePath(d: string): Cmd[] {
  const out: Cmd[] = [];
  let cmd = '';
  let nums: number[] = [];
  let cx = 0, cy = 0;
  const flush = () => {
    if (!cmd) return;
    const n = ARITY[cmd];
    if (n === undefined) throw new Error(`Unsupported path command "${cmd}" (use absolute M L H V C Q Z)`);
    if (n === 0) { out.push({ c: 'Z', v: [] }); return; }
    if (nums.length === 0 || nums.length % n !== 0) throw new Error(`Bad argument count for ${cmd} in path`);
    for (let i = 0; i < nums.length; i += n) {
      const v = nums.slice(i, i + n);
      if (cmd === 'H') { cx = v[0]; out.push({ c: 'L', v: [cx, cy] }); }
      else if (cmd === 'V') { cy = v[0]; out.push({ c: 'L', v: [cx, cy] }); }
      else {
        const c = (cmd === 'M' && i > 0 ? 'L' : cmd) as Cmd['c'];
        out.push({ c, v });
        cx = v[n - 2]; cy = v[n - 1];
      }
    }
  };
  let m: RegExpExecArray | null;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(d))) {
    if (m[1]) {
      flush();
      cmd = m[1] === 'z' ? 'Z' : m[1];
      nums = [];
    } else nums.push(parseFloat(m[2]));
  }
  flush();
  return out;
}

/** Flatten a path into one polygon per subpath. */
export function flattenPath(d: string, steps = 10): Poly[] {
  const polys: Poly[] = [];
  let cur: Poly = [];
  let x = 0, y = 0;
  for (const { c, v } of parsePath(d)) {
    if (c === 'M') {
      if (cur.length > 1) polys.push(cur);
      cur = [[v[0], v[1]]]; x = v[0]; y = v[1];
    } else if (c === 'L') {
      cur.push([v[0], v[1]]); x = v[0]; y = v[1];
    } else if (c === 'C') {
      for (let i = 1; i <= steps; i++) {
        const t = i / steps, u = 1 - t;
        cur.push([
          u * u * u * x + 3 * u * u * t * v[0] + 3 * u * t * t * v[2] + t * t * t * v[4],
          u * u * u * y + 3 * u * u * t * v[1] + 3 * u * t * t * v[3] + t * t * t * v[5],
        ]);
      }
      x = v[4]; y = v[5];
    } else if (c === 'Q') {
      for (let i = 1; i <= steps; i++) {
        const t = i / steps, u = 1 - t;
        cur.push([u * u * x + 2 * u * t * v[0] + t * t * v[2], u * u * y + 2 * u * t * v[1] + t * t * v[3]]);
      }
      x = v[2]; y = v[3];
    } else if (c === 'Z') {
      if (cur.length > 1) polys.push(cur);
      if (cur.length) { x = cur[0][0]; y = cur[0][1]; }
      cur = [];
    }
  }
  if (cur.length > 1) polys.push(cur);
  return polys;
}

export function isClosedSingle(d: string): boolean {
  const cmds = parsePath(d);
  const ms = cmds.filter((c) => c.c === 'M').length;
  return ms === 1 && cmds[cmds.length - 1]?.c === 'Z';
}

export function pointInPoly(poly: Poly, x: number, y: number): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export function distToSegment(x: number, y: number, ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax, dy = by - ay;
  const l2 = dx * dx + dy * dy;
  let t = l2 ? ((x - ax) * dx + (y - ay) * dy) / l2 : 0;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(x - (ax + t * dx), y - (ay + t * dy));
}

/** Minimum distance from a point to a polyline (closed when `closed`). */
export function distToPoly(poly: Poly, x: number, y: number, closed = true): number {
  let best = Infinity;
  const n = poly.length;
  for (let i = closed ? 0 : 1; i < n; i++) {
    const a = poly[(i + n - 1) % n], b = poly[i];
    const dd = distToSegment(x, y, a[0], a[1], b[0], b[1]);
    if (dd < best) best = dd;
  }
  return best;
}

export function bboxOf(polys: Poly[]): BBox {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of polys) for (const [x, y] of p) {
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  return { x0, y0, x1, y1 };
}

export const inBox = (b: BBox, x: number, y: number, pad = 0) =>
  x >= b.x0 - pad && x <= b.x1 + pad && y >= b.y0 - pad && y <= b.y1 + pad;

export const boxesOverlap = (a: BBox, b: BBox) => a.x0 <= b.x1 && a.x1 >= b.x0 && a.y0 <= b.y1 && a.y1 >= b.y0;

export function polyArea(poly: Poly): number {
  let a = 0;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) a += poly[j][0] * poly[i][1] - poly[i][0] * poly[j][1];
  return Math.abs(a) / 2;
}

const r1 = (n: number) => Math.round(n * 10) / 10;

export function cmdsToPath(cmds: Cmd[]): string {
  return cmds.map((c) => (c.c === 'Z' ? 'Z' : c.c + c.v.map(r1).join(' '))).join('');
}

export function transformPath(d: string, m: Matrix): string {
  const [a, b, c, dd, e, f] = m;
  return cmdsToPath(
    parsePath(d).map((cmd) => {
      const v: number[] = [];
      for (let i = 0; i < cmd.v.length; i += 2) {
        const x = cmd.v[i], y = cmd.v[i + 1];
        v.push(a * x + c * y + e, b * x + dd * y + f);
      }
      return { c: cmd.c, v };
    }),
  );
}

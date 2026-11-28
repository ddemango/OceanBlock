// Jigsaw piece geometry. Every interior edge is generated exactly once from a
// seeded random stream and shared by the two pieces on either side (one walks
// it forwards, the other backwards), so neighbours are complementary by
// construction and the same seed always rebuilds the same puzzle.
import { bboxOf, flattenPath, type BBox, type Poly, type Pt } from '../../art/geometry';
import { rng } from '../../art/kit';
import { gridFor } from './grid';

export const GEOMETRY_VERSION = 1;

/** An edge as a point list: [start, (c1, c2, end)*] for curves or [start, end] for straight borders. */
export type Edge = Pt[];

export interface PieceGeom {
  id: number;
  col: number;
  row: number;
  /** Solved position of the piece's cell (top-left), in image coordinates. */
  x: number;
  y: number;
  /** Closed outline in image coordinates. */
  path: string;
  poly: Poly;
  box: BBox;
  isEdge: boolean;
}

export interface JigsawGeom {
  count: number;
  cols: number;
  rows: number;
  width: number;
  height: number;
  pw: number;
  ph: number;
  /** How far tabs may extend beyond a cell. */
  margin: number;
  pieces: PieceGeom[];
  edges(col: number, row: number): { top: Edge; right: Edge; bottom: Edge; left: Edge };
}

const r2 = (n: number) => Math.round(n * 100) / 100;

function tabEdge(a: Pt, b: Pt, sign: number, rand: () => number): Edge {
  const t = 0.1; // tab size relative to edge length
  const j = 0.035;
  const jit = () => (rand() * 2 - 1) * j;
  const A = jit(), B = jit(), C = jit(), D = jit(), E = jit();
  const dx = b[0] - a[0], dy = b[1] - a[1];
  // normal (rotate the edge direction by +90°), scaled by edge length so tabs stay proportional
  const nx = -dy, ny = dx;
  const p = (l: number, w: number): Pt => [r2(a[0] + dx * l + nx * w * sign), r2(a[1] + dy * l + ny * w * sign)];
  return [
    p(0, 0),
    p(0.2, A), p(0.5 + B + D, -t + C), p(0.5 - t + B, t + C),
    p(0.5 - 2 * t + B - D, 3 * t + C), p(0.5 + 2 * t + B - D, 3 * t + C), p(0.5 + t + B, t + C),
    p(0.5 + B + D, -t + C), p(0.8, E), p(1, 0),
  ];
}

const reverse = (e: Edge): Edge => [...e].reverse();

function appendEdge(d: string, e: Edge): string {
  if (e.length === 2) return d + `L${e[1][0]} ${e[1][1]}`;
  for (let i = 1; i < e.length; i += 3) d += `C${e[i][0]} ${e[i][1]} ${e[i + 1][0]} ${e[i + 1][1]} ${e[i + 2][0]} ${e[i + 2][1]}`;
  return d;
}

export function buildJigsaw(width: number, height: number, count: number, seed: number): JigsawGeom {
  const { cols, rows } = gridFor(count, width / height);
  const pw = width / cols, ph = height / rows;
  const rand = rng((seed ^ (cols * 7919 + rows * 104729)) >>> 0).next;
  const X = (c: number) => r2(c * pw), Y = (r: number) => r2(r * ph);

  // h[r][c]: edge along the top of row r (r = 0..rows), left → right
  const h: Edge[][] = [];
  for (let r = 0; r <= rows; r++) {
    h.push([]);
    for (let c = 0; c < cols; c++) {
      const a: Pt = [X(c), Y(r)], b: Pt = [X(c + 1), Y(r)];
      h[r].push(r === 0 || r === rows ? [a, b] : tabEdge(a, b, rand() < 0.5 ? 1 : -1, rand));
    }
  }
  // v[r][c]: edge along the left of column c (c = 0..cols), top → bottom
  const v: Edge[][] = [];
  for (let r = 0; r < rows; r++) {
    v.push([]);
    for (let c = 0; c <= cols; c++) {
      const a: Pt = [X(c), Y(r)], b: Pt = [X(c), Y(r + 1)];
      v[r].push(c === 0 || c === cols ? [a, b] : tabEdge(a, b, rand() < 0.5 ? 1 : -1, rand));
    }
  }

  const edges = (c: number, r: number) => ({
    top: h[r][c],
    right: v[r][c + 1],
    bottom: reverse(h[r + 1][c]),
    left: reverse(v[r][c]),
  });

  const pieces: PieceGeom[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const e = edges(c, r);
    let d = `M${e.top[0][0]} ${e.top[0][1]}`;
    d = appendEdge(d, e.top); d = appendEdge(d, e.right); d = appendEdge(d, e.bottom); d = appendEdge(d, e.left);
    d += 'Z';
    const poly = flattenPath(d, 8)[0];
    pieces.push({
      id: r * cols + c, col: c, row: r, x: X(c), y: Y(r), path: d, poly, box: bboxOf([poly]),
      isEdge: r === 0 || c === 0 || r === rows - 1 || c === cols - 1,
    });
  }
  return { count, cols, rows, width, height, pw, ph, margin: Math.max(pw, ph) * 0.36, pieces, edges };
}

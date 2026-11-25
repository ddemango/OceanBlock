// Jigsaw game state and rules. Pure logic: no DOM, no rendering.
//
// A group is a set of connected pieces sharing one offset (x, y) from their
// solved positions, in board (image) coordinates. A single loose piece is a
// group of one. Locked groups sit exactly at offset (0, 0).
import { rng } from '../../art/kit';
import type { JigsawGeom } from './geometry';

export interface Group { id: number; pieces: number[]; x: number; y: number; locked: boolean }

export interface JigsawState {
  v: 1;
  count: number;
  seed: number;
  geometryVersion: number;
  /** Piece ids still in the tray, in display order. */
  tray: number[];
  /** Groups on the board, in draw order (last = on top). */
  groups: Group[];
  nextGroupId: number;
  guide: boolean;
  edgesOnly: boolean;
}

export type DropResult = 'none' | 'joined' | 'locked';

export function newGame(geom: JigsawGeom, seed: number, geometryVersion: number): JigsawState {
  const tray = geom.pieces.map((p) => p.id);
  const r = rng((seed * 31 + geom.count) >>> 0);
  for (let i = tray.length - 1; i > 0; i--) {
    const j = r.int(0, i);
    [tray[i], tray[j]] = [tray[j], tray[i]];
  }
  return { v: 1, count: geom.count, seed, geometryVersion, tray, groups: [], nextGroupId: 1, guide: false, edgesOnly: false };
}

export const findGroup = (s: JigsawState, id: number) => s.groups.find((g) => g.id === id);
export const groupOfPiece = (s: JigsawState, piece: number) => s.groups.find((g) => g.pieces.includes(piece));

/** Move a piece from the tray to the board with its cell's top-left at (x, y). */
export function takeFromTray(s: JigsawState, geom: JigsawGeom, piece: number, x: number, y: number): Group | null {
  const i = s.tray.indexOf(piece);
  if (i < 0) return null;
  s.tray.splice(i, 1);
  const p = geom.pieces[piece];
  const g: Group = { id: s.nextGroupId++, pieces: [piece], x: x - p.x, y: y - p.y, locked: false };
  s.groups.push(g);
  return g;
}

/** Put a single loose piece back in the tray. */
export function returnToTray(s: JigsawState, groupId: number, index?: number): boolean {
  const g = findGroup(s, groupId);
  if (!g || g.locked || g.pieces.length !== 1) return false;
  s.groups.splice(s.groups.indexOf(g), 1);
  s.tray.splice(Math.max(0, Math.min(s.tray.length, index ?? 0)), 0, g.pieces[0]);
  return true;
}

export function bringToFront(s: JigsawState, groupId: number) {
  const i = s.groups.findIndex((g) => g.id === groupId);
  if (i >= 0) s.groups.push(...s.groups.splice(i, 1));
}

/** Move a whole group; every piece keeps its position relative to the others. */
export function moveGroup(s: JigsawState, groupId: number, x: number, y: number) {
  const g = findGroup(s, groupId);
  if (!g || g.locked) return;
  g.x = x; g.y = y;
}

/**
 * Resolve a drop. A group snaps home when its offset from the solved position
 * is within `tol`; it joins another group only when the two contain pieces
 * that are true grid neighbours and their offsets agree within `tol` (i.e. the
 * shared edge is aligned). Nothing else ever snaps.
 */
export function dropGroup(s: JigsawState, geom: JigsawGeom, groupId: number, tol: number): DropResult {
  const g = findGroup(s, groupId);
  if (!g) return 'none';
  let result: DropResult = 'none';
  const owner = new Map<number, Group>();
  const index = () => { owner.clear(); for (const gr of s.groups) for (const p of gr.pieces) owner.set(p, gr); };
  index();
  for (;;) {
    if (!g.locked && Math.hypot(g.x, g.y) <= tol) {
      g.x = 0; g.y = 0; g.locked = true; result = 'locked';
    }
    let other: Group | undefined;
    outer: for (const id of g.pieces) {
      const p = geom.pieces[id];
      const nb: number[] = [];
      if (p.col > 0) nb.push(id - 1);
      if (p.col < geom.cols - 1) nb.push(id + 1);
      if (p.row > 0) nb.push(id - geom.cols);
      if (p.row < geom.rows - 1) nb.push(id + geom.cols);
      for (const q of nb) {
        const h = owner.get(q);
        if (!h || h === g) continue;
        if (Math.hypot(h.x - g.x, h.y - g.y) <= tol) { other = h; break outer; }
      }
    }
    if (!other) break;
    const locked = g.locked || other.locked;
    if (locked) { g.x = 0; g.y = 0; } else { g.x = other.x; g.y = other.y; }
    if (locked && result !== 'locked') result = 'locked';
    else if (result === 'none') result = 'joined';
    g.locked = locked;
    g.pieces.push(...other.pieces);
    s.groups.splice(s.groups.indexOf(other), 1);
    index();
  }
  // A fully assembled picture is correct wherever it sits: settle it on the board.
  if (!g.locked && g.pieces.length === geom.count) { g.x = 0; g.y = 0; g.locked = true; result = 'locked'; }
  return result;
}

export const lockedCount = (s: JigsawState) => s.groups.reduce((n, g) => n + (g.locked ? g.pieces.length : 0), 0);
export const progressOf = (s: JigsawState) => lockedCount(s) / s.count;
export const isComplete = (s: JigsawState) => s.tray.length === 0 && lockedCount(s) === s.count;

/** Check a restored save against the geometry it claims to belong to. */
export function isValidState(s: unknown, geom: JigsawGeom, seed: number, geometryVersion: number): s is JigsawState {
  const st = s as JigsawState;
  if (!st || st.v !== 1 || st.count !== geom.count || st.seed !== seed || st.geometryVersion !== geometryVersion) return false;
  if (!Array.isArray(st.tray) || !Array.isArray(st.groups)) return false;
  const seen = new Set<number>();
  const add = (p: unknown) => {
    if (typeof p !== 'number' || !Number.isInteger(p) || p < 0 || p >= geom.count || seen.has(p)) return false;
    seen.add(p); return true;
  };
  for (const p of st.tray) if (!add(p)) return false;
  for (const g of st.groups) {
    if (!g || !Array.isArray(g.pieces) || !g.pieces.length || !Number.isFinite(g.x) || !Number.isFinite(g.y)) return false;
    if (g.locked && (g.x !== 0 || g.y !== 0)) return false;
    for (const p of g.pieces) if (!add(p)) return false;
  }
  return seen.size === geom.count;
}

/** Topmost loose group whose piece outline contains the point (board coordinates). */
export function groupAt(s: JigsawState, geom: JigsawGeom, x: number, y: number, hit: (poly: [number, number][], x: number, y: number) => boolean): Group | null {
  for (let i = s.groups.length - 1; i >= 0; i--) {
    const g = s.groups[i];
    if (g.locked) continue;
    for (const id of g.pieces) {
      const p = geom.pieces[id];
      const lx = x - g.x, ly = y - g.y;
      if (lx < p.box.x0 || lx > p.box.x1 || ly < p.box.y0 || ly > p.box.y1) continue;
      if (hit(p.poly, lx, ly)) return g;
    }
  }
  return null;
}

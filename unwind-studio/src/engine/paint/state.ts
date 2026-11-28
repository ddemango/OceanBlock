// Paint game state and rules (paint-by-number and creative colouring). Pure logic.
import type { PaintActivity } from '../../content/types';

export type PaintVariant = 'pbn' | 'creative';

interface Action { region: string; prev: string | null; next: string | null }

export interface PaintState {
  v: 1;
  variant: PaintVariant;
  /** region id → palette colour id (pbn) or hex colour (creative). */
  fills: Record<string, string>;
  undo: Action[];
  redo: Action[];
  /** Selected palette id (pbn) or hex colour (creative). */
  selected: string | null;
}

export type FillResult = 'filled' | 'wrong' | 'already' | 'same' | 'invalid';

const MAX_HISTORY = 300;

export const newPaint = (variant: PaintVariant): PaintState => ({ v: 1, variant, fills: {}, undo: [], redo: [], selected: null });

function apply(s: PaintState, a: Action, value: string | null): Record<string, string> {
  const fills = { ...s.fills };
  if (value === null) delete fills[a.region]; else fills[a.region] = value;
  return fills;
}

/**
 * Fill one region. Paint-by-number only accepts the region's own colour and
 * never counts a region twice. Creative mode accepts any colour (null erases).
 */
export function fillRegion(s: PaintState, a: PaintActivity, regionId: string, color: string | null): { state: PaintState; result: FillResult } {
  const region = a.regions.find((r) => r.id === regionId);
  if (!region) return { state: s, result: 'invalid' };
  const prev = s.fills[regionId] ?? null;
  if (s.variant === 'pbn') {
    if (prev) return { state: s, result: 'already' };
    if (color !== region.color) return { state: s, result: 'wrong' };
  } else if (prev === color) return { state: s, result: 'same' };
  const act: Action = { region: regionId, prev, next: color };
  return {
    state: { ...s, fills: apply(s, act, color), undo: [...s.undo, act].slice(-MAX_HISTORY), redo: [] },
    result: 'filled',
  };
}

export function undo(s: PaintState): PaintState {
  const act = s.undo[s.undo.length - 1];
  if (!act) return s;
  return { ...s, fills: apply(s, act, act.prev), undo: s.undo.slice(0, -1), redo: [...s.redo, act] };
}

export function redo(s: PaintState): PaintState {
  const act = s.redo[s.redo.length - 1];
  if (!act) return s;
  return { ...s, fills: apply(s, act, act.next), redo: s.redo.slice(0, -1), undo: [...s.undo, act] };
}

/** Number of regions that count as done: correct colour (pbn) or any colour (creative). */
export function doneCount(s: PaintState, a: PaintActivity): number {
  let n = 0;
  for (const r of a.regions) {
    const f = s.fills[r.id];
    if (f && (s.variant === 'creative' || f === r.color)) n++;
  }
  return n;
}

export const progressOf = (s: PaintState, a: PaintActivity) => doneCount(s, a) / a.regions.length;
export const isComplete = (s: PaintState, a: PaintActivity) => doneCount(s, a) === a.regions.length;

/** Regions still to fill, per palette colour id. */
export function remainingByColor(s: PaintState, a: PaintActivity): Record<string, number> {
  const out: Record<string, number> = {};
  for (const p of a.palette) out[p.id] = 0;
  for (const r of a.regions) if (s.fills[r.id] !== r.color) out[r.color]++;
  return out;
}

/** The hex colour each filled region shows. */
export function fillHexes(s: PaintState, a: PaintActivity): Record<string, string> {
  if (s.variant === 'creative') return s.fills;
  const hex = new Map(a.palette.map((p) => [p.id, p.hex]));
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(s.fills)) { const h = hex.get(v); if (h) out[k] = h; }
  return out;
}

export function isValidState(s: unknown, a: PaintActivity, variant: PaintVariant): s is PaintState {
  const st = s as PaintState;
  if (!st || st.v !== 1 || st.variant !== variant || typeof st.fills !== 'object' || !Array.isArray(st.undo) || !Array.isArray(st.redo)) return false;
  const ids = new Set(a.regions.map((r) => r.id));
  const pal = new Set(a.palette.map((p) => p.id));
  for (const [k, v] of Object.entries(st.fills)) {
    if (!ids.has(k) || typeof v !== 'string') return false;
    if (variant === 'pbn' && !pal.has(v)) return false;
  }
  return true;
}

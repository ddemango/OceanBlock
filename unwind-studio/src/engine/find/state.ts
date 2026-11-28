// Hidden-object game state and rules. Pure logic.
import type { FindActivity } from '../../content/types';
import { hitTarget, type FindGeometry } from './geometry';

export interface FindState { v: 1; found: string[] }

export const newFind = (): FindState => ({ v: 1, found: [] });

export const targetsOf = (a: FindActivity) => a.items.filter((i) => i.target && i.id);

/** Guess at a scene point. A target is credited at most once. */
export function guess(s: FindState, a: FindActivity, geom: FindGeometry, x: number, y: number, tol: number): { state: FindState; hit: string | null } {
  const id = hitTarget(geom, a.items, x, y, tol, new Set(s.found));
  if (!id) return { state: s, hit: null };
  return { state: markFound(s, a, id), hit: id };
}

export function markFound(s: FindState, a: FindActivity, id: string): FindState {
  if (s.found.includes(id) || !targetsOf(a).some((t) => t.id === id)) return s;
  return { ...s, found: [...s.found, id] };
}

export const progressOf = (s: FindState, a: FindActivity) => s.found.length / targetsOf(a).length;
export const isComplete = (s: FindState, a: FindActivity) => targetsOf(a).every((t) => s.found.includes(t.id!));

/** A genuine remaining target to hint at, or null when all are found. */
export function nextHint(s: FindState, a: FindActivity): string | null {
  return targetsOf(a).find((t) => !s.found.includes(t.id!))?.id ?? null;
}

export function isValidState(s: unknown, a: FindActivity): s is FindState {
  const st = s as FindState;
  if (!st || st.v !== 1 || !Array.isArray(st.found)) return false;
  const ids = new Set(targetsOf(a).map((t) => t.id));
  return st.found.every((f) => ids.has(f)) && new Set(st.found).size === st.found.length;
}

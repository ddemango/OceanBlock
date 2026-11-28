import { describe, expect, it } from 'vitest';
import { circle, rect, sh, stroke, line } from '../src/art/kit';
import type { FindActivity } from '../src/content/types';
import { buildFindGeometry, hitTarget, visibleFraction } from '../src/engine/find/geometry';
import { guess, isComplete, isValidState, markFound, newFind, nextHint, progressOf } from '../src/engine/find/state';

const scene: FindActivity = {
  id: 'f', version: 1, mode: 'find', title: 'f', blurb: 'f', collectionId: 'c', categories: [], difficulty: 'Relaxed',
  width: 400, height: 400,
  items: [
    { shapes: [sh(rect(0, 0, 400, 400), '#eeeeee')] },
    { id: 'ball', name: 'Ball', target: true, shapes: [sh(circle(100, 100, 30), '#ff0000')] },
    { id: 'coin', name: 'Coin', target: true, shapes: [sh(circle(120, 100, 12), '#ffcc00')] }, // overlaps the ball, on top
    { shapes: [sh(rect(290, 290, 40, 40), '#333333')] }, // decoy
    { id: 'pin', name: 'Pin', target: true, shapes: [stroke(line([[300, 50], [340, 90]]), '#000000', 2), sh(circle(300, 50, 4), '#000000')] },
  ],
};
const geom = buildFindGeometry(scene.items);

describe('find hit testing', () => {
  it('hits targets, ignores scenery and empty space', () => {
    expect(hitTarget(geom, scene.items, 85, 100, 0, new Set())).toBe('ball');
    expect(hitTarget(geom, scene.items, 310, 310, 4, new Set())).toBeNull();
    expect(hitTarget(geom, scene.items, 200, 300, 4, new Set())).toBeNull();
  });
  it('resolves overlaps to the topmost unfound target, consistently', () => {
    expect(hitTarget(geom, scene.items, 120, 100, 0, new Set())).toBe('coin');
    expect(hitTarget(geom, scene.items, 120, 100, 0, new Set(['coin']))).toBe('ball');
    expect(hitTarget(geom, scene.items, 120, 100, 0, new Set(['coin', 'ball']))).toBeNull();
  });
  it('applies tolerance around thin shapes', () => {
    expect(hitTarget(geom, scene.items, 322, 68, 0.5, new Set())).toBeNull();
    expect(hitTarget(geom, scene.items, 322, 68, 6, new Set())).toBe('pin');
  });
  it('measures visibility', () => {
    expect(visibleFraction(geom, 2)).toBe(1);
    expect(visibleFraction(geom, 1)).toBeLessThan(1);
    expect(visibleFraction(geom, 1)).toBeGreaterThan(0.7);
  });
});

describe('find rules', () => {
  it('credits each object exactly once', () => {
    let s = newFind();
    let r = guess(s, scene, geom, 85, 100, 2);
    expect(r.hit).toBe('ball');
    s = r.state;
    r = guess(s, scene, geom, 85, 100, 2);
    expect(r.hit).toBeNull();
    expect(r.state).toBe(s);
    expect(markFound(s, scene, 'ball')).toBe(s);
    expect(markFound(s, scene, 'not-a-target')).toBe(s);
    expect(s.found).toEqual(['ball']);
    expect(progressOf(s, scene)).toBeCloseTo(1 / 3);
  });
  it('misses change nothing', () => {
    const s = newFind();
    const r = guess(s, scene, geom, 200, 300, 2);
    expect(r.hit).toBeNull();
    expect(r.state).toBe(s);
  });
  it('hints always name a remaining target and completion needs all of them', () => {
    let s = newFind();
    const seen: string[] = [];
    for (;;) {
      const h = nextHint(s, scene);
      if (!h) break;
      expect(s.found).not.toContain(h);
      expect(isComplete(s, scene)).toBe(false);
      seen.push(h);
      s = markFound(s, scene, h);
    }
    expect(seen.sort()).toEqual(['ball', 'coin', 'pin']);
    expect(isComplete(s, scene)).toBe(true);
  });
  it('validates saves', () => {
    const s = markFound(newFind(), scene, 'pin');
    expect(isValidState(JSON.parse(JSON.stringify(s)), scene)).toBe(true);
    expect(isValidState({ v: 1, found: ['pin', 'pin'] }, scene)).toBe(false);
    expect(isValidState({ v: 1, found: ['ghost'] }, scene)).toBe(false);
    expect(isValidState({ v: 2, found: [] }, scene)).toBe(false);
  });
});

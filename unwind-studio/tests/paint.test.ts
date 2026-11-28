import { describe, expect, it } from 'vitest';
import { rect, circle } from '../src/art/kit';
import type { PaintActivity } from '../src/content/types';
import { buildPaintGeometry } from '../src/engine/paint/geometry';
import { doneCount, fillHexes, fillRegion, isComplete, isValidState, newPaint, progressOf, redo, remainingByColor, undo } from '../src/engine/paint/state';

const art: PaintActivity = {
  id: 't', version: 1, mode: 'paint', title: 't', blurb: 't', collectionId: 'c', categories: [], difficulty: 'Relaxed',
  width: 200, height: 200,
  palette: [{ id: 'a', number: 1, name: 'A', hex: '#111111' }, { id: 'b', number: 2, name: 'B', hex: '#222222' }],
  regions: [
    { id: 'bg', d: rect(0, 0, 200, 200), color: 'a' },
    { id: 'disc', d: circle(100, 100, 40), color: 'b' },
    { id: 'dot', d: circle(100, 100, 10), color: 'a' },
  ],
};

describe('paint by number', () => {
  it('fills only with the matching colour', () => {
    let s = newPaint('pbn');
    let r = fillRegion(s, art, 'disc', 'a');
    expect(r.result).toBe('wrong');
    expect(r.state).toBe(s);
    expect(doneCount(s, art)).toBe(0);
    r = fillRegion(s, art, 'disc', 'b');
    expect(r.result).toBe('filled');
    s = r.state;
    expect(s.fills).toEqual({ disc: 'b' });
    expect(fillRegion(s, art, 'nope', 'a').result).toBe('invalid');
  });

  it('repeated taps never increase progress', () => {
    let s = fillRegion(newPaint('pbn'), art, 'bg', 'a').state;
    for (let i = 0; i < 5; i++) {
      const r = fillRegion(s, art, 'bg', 'a');
      expect(r.result).toBe('already');
      s = r.state;
    }
    expect(doneCount(s, art)).toBe(1);
    expect(s.undo).toHaveLength(1);
    expect(progressOf(s, art)).toBeCloseTo(1 / 3);
  });

  it('undo and redo restore fills exactly', () => {
    let s = newPaint('pbn');
    s = fillRegion(s, art, 'bg', 'a').state;
    s = fillRegion(s, art, 'disc', 'b').state;
    const two = s.fills;
    s = undo(s);
    expect(s.fills).toEqual({ bg: 'a' });
    s = undo(s);
    expect(s.fills).toEqual({});
    expect(undo(s)).toBe(s);
    s = redo(redo(s));
    expect(s.fills).toEqual(two);
    expect(redo(s)).toBe(s);
    // a new action clears the redo stack
    s = undo(s);
    s = fillRegion(s, art, 'dot', 'a').state;
    expect(s.redo).toHaveLength(0);
  });

  it('tracks remaining regions per colour and completion', () => {
    let s = newPaint('pbn');
    expect(remainingByColor(s, art)).toEqual({ a: 2, b: 1 });
    s = fillRegion(s, art, 'disc', 'b').state;
    expect(remainingByColor(s, art)).toEqual({ a: 2, b: 0 });
    expect(isComplete(s, art)).toBe(false);
    s = fillRegion(s, art, 'bg', 'a').state;
    s = fillRegion(s, art, 'dot', 'a').state;
    expect(isComplete(s, art)).toBe(true);
    expect(isComplete(undo(s), art)).toBe(false);
    expect(fillHexes(s, art)).toEqual({ disc: '#222222', bg: '#111111', dot: '#111111' });
  });
});

describe('creative colouring', () => {
  it('accepts any colour, recolours, erases, and keeps user colours', () => {
    let s = newPaint('creative');
    s = fillRegion(s, art, 'disc', '#ff00aa').state;
    expect(fillRegion(s, art, 'disc', '#ff00aa').result).toBe('same');
    s = fillRegion(s, art, 'disc', '#00ffaa').state;
    expect(fillHexes(s, art)).toEqual({ disc: '#00ffaa' });
    s = undo(s);
    expect(s.fills.disc).toBe('#ff00aa');
    s = fillRegion(s, art, 'disc', null).state;
    expect(s.fills).toEqual({});
    expect(doneCount(s, art)).toBe(0);
  });

  it('validates saves per variant', () => {
    const c = fillRegion(newPaint('creative'), art, 'bg', '#abcdef').state;
    const round = JSON.parse(JSON.stringify(c));
    expect(round).toEqual(c);
    expect(isValidState(round, art, 'creative')).toBe(true);
    expect(isValidState(round, art, 'pbn')).toBe(false);
    expect(isValidState({ ...round, fills: { ghost: '#000000' } }, art, 'creative')).toBe(false);
    expect(isValidState({ v: 1, variant: 'pbn', fills: { bg: 'zzz' }, undo: [], redo: [] }, art, 'pbn')).toBe(false);
    expect(isValidState(undefined, art, 'pbn')).toBe(false);
  });
});

describe('paint geometry', () => {
  const g = buildPaintGeometry(art.regions);
  it('hit testing returns the topmost region only', () => {
    expect(g.regionAt(100, 100)).toBe(2);
    expect(g.regionAt(125, 100)).toBe(1);
    expect(g.regionAt(10, 10)).toBe(0);
    expect(g.regionAt(-5, 10)).toBe(-1);
  });
  it('places each label inside the visible part of its own region', () => {
    g.labels.forEach((l, i) => {
      expect(g.regionAt(l.x, l.y)).toBe(i);
      expect(l.r).toBeGreaterThan(3);
    });
    // the ring's label must sit in the ring, not in the covered centre
    const ring = g.labels[1];
    expect(Math.hypot(ring.x - 100, ring.y - 100)).toBeGreaterThan(10);
  });
});

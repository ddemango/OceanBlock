import { describe, expect, it } from 'vitest';
import { pointInPoly } from '../src/art/geometry';
import { buildJigsaw } from '../src/engine/jigsaw/geometry';
import { gridFor, PIECE_COUNTS } from '../src/engine/jigsaw/grid';
import { cornerIds, dropGroup, groupAt, groupOfPiece, isComplete, isValidState, lockedCount, moveGroup, newGame, progressOf, returnToTray, takeFromTray } from '../src/engine/jigsaw/state';

const W = 1200, H = 1200, SEED = 4242;

describe('jigsaw grid', () => {
  it('uses exact grids for every offered count', () => {
    for (const n of PIECE_COUNTS) {
      const g = gridFor(n, 1);
      expect(g.cols * g.rows).toBe(n);
      expect(g.cols).toBe(g.rows);
    }
    expect(gridFor(36, 4 / 3)).toEqual({ cols: 6, rows: 6 });
    expect(gridFor(48, 4 / 3)).toEqual({ cols: 8, rows: 6 });
  });
});

describe('jigsaw geometry', () => {
  it('shared edges are exactly complementary', () => {
    for (const n of PIECE_COUNTS) {
      const g = buildJigsaw(W, H, n, SEED);
      for (let r = 0; r < g.rows; r++) for (let c = 0; c < g.cols; c++) {
        const e = g.edges(c, r);
        if (c < g.cols - 1) expect(g.edges(c + 1, r).left).toEqual([...e.right].reverse());
        if (r < g.rows - 1) expect(g.edges(c, r + 1).top).toEqual([...e.bottom].reverse());
      }
    }
  });

  it('exterior edges are straight and interior edges have tabs', () => {
    const g = buildJigsaw(W, H, 36, SEED);
    for (let c = 0; c < g.cols; c++) {
      expect(g.edges(c, 0).top).toHaveLength(2);
      expect(g.edges(c, g.rows - 1).bottom).toHaveLength(2);
      expect(g.edges(c, 0).bottom.length).toBeGreaterThan(2);
    }
    for (let r = 0; r < g.rows; r++) {
      expect(g.edges(0, r).left).toHaveLength(2);
      expect(g.edges(g.cols - 1, r).right).toHaveLength(2);
    }
  });

  it('is deterministic for a seed and differs between seeds', () => {
    const a = buildJigsaw(W, H, 64, SEED), b = buildJigsaw(W, H, 64, SEED), c = buildJigsaw(W, H, 64, SEED + 1);
    expect(a.pieces.map((p) => p.path)).toEqual(b.pieces.map((p) => p.path));
    expect(a.pieces.map((p) => p.path)).not.toEqual(c.pieces.map((p) => p.path));
  });

  it('pieces tile the image: every sample point belongs to exactly one piece', () => {
    const g = buildJigsaw(W, H, 100, SEED);
    for (let i = 0; i < 4000; i++) {
      const x = ((i * 7919) % 11987) / 10 % W, y = ((i * 104729) % 11969) / 10 % H;
      const owners = g.pieces.filter((p) => x >= p.box.x0 && x <= p.box.x1 && y >= p.box.y0 && y <= p.box.y1 && pointInPoly(p.poly, x, y));
      expect(owners.length).toBe(1);
    }
  });

  it('tabs stay inside the bitmap margin', () => {
    for (const n of PIECE_COUNTS) {
      const g = buildJigsaw(W, H, n, SEED);
      for (const p of g.pieces) {
        expect(p.box.x0).toBeGreaterThanOrEqual(p.x - g.margin);
        expect(p.box.y0).toBeGreaterThanOrEqual(p.y - g.margin);
        expect(p.box.x1).toBeLessThanOrEqual(p.x + g.pw + g.margin);
        expect(p.box.y1).toBeLessThanOrEqual(p.y + g.ph + g.margin);
      }
    }
  });
});

describe('jigsaw rules', () => {
  const geom = buildJigsaw(W, H, 36, SEED);
  const TOL = geom.pw * 0.2;
  const fresh = () => newGame(geom, SEED, 1);

  it('starts with every piece shuffled in the tray', () => {
    const s = fresh();
    expect([...s.tray].sort((a, b) => a - b)).toEqual(geom.pieces.map((p) => p.id));
    expect(s.tray).not.toEqual(geom.pieces.map((p) => p.id));
    expect(newGame(geom, SEED, 1).tray).toEqual(s.tray);
  });

  it('can start with the four corners locked in place', () => {
    for (const n of PIECE_COUNTS) {
      const g = buildJigsaw(W, H, n, SEED);
      const s = newGame(g, SEED, 1, true);
      const corners = cornerIds(g);
      expect(corners).toHaveLength(4);
      expect(lockedCount(s)).toBe(4);
      expect(s.tray).toHaveLength(n - 4);
      for (const c of corners) {
        expect(s.tray).not.toContain(c);
        expect(groupOfPiece(s, c)).toMatchObject({ locked: true, x: 0, y: 0 });
      }
      expect(isValidState(JSON.parse(JSON.stringify(s)), g, SEED, 1)).toBe(true);
      expect(isComplete(s)).toBe(false);
    }
  });

  it('a corner piece placed next to a starter corner joins it and locks', () => {
    const s = newGame(geom, SEED, 1, true);
    const g = takeFromTray(s, geom, 1, geom.pieces[1].x + 4, geom.pieces[1].y - 3)!;
    expect(dropGroup(s, geom, g.id, TOL)).toBe('locked');
    expect(groupOfPiece(s, 1)!.locked).toBe(true);
  });

  it('locks a piece dropped near its solved position and not one dropped elsewhere', () => {
    const s = fresh();
    const p = geom.pieces[7];
    const g = takeFromTray(s, geom, 7, p.x + TOL * 0.6, p.y - TOL * 0.5)!;
    expect(dropGroup(s, geom, g.id, TOL)).toBe('locked');
    expect(g).toMatchObject({ x: 0, y: 0, locked: true });
    const g2 = takeFromTray(s, geom, 8, geom.pieces[8].x + TOL * 3, geom.pieces[8].y)!;
    expect(dropGroup(s, geom, g2.id, TOL)).toBe('none');
    expect(g2.locked).toBe(false);
    expect(g2.x).toBeCloseTo(TOL * 3);
  });

  it('does not join pieces that are not neighbours, or neighbours that are misaligned', () => {
    const s = fresh();
    const off = 400;
    // pieces 0 and 2 are not adjacent: same offset, must not join
    const a = takeFromTray(s, geom, 0, geom.pieces[0].x + off, geom.pieces[0].y + off)!;
    const b = takeFromTray(s, geom, 2, geom.pieces[2].x + off, geom.pieces[2].y + off)!;
    expect(dropGroup(s, geom, b.id, TOL)).toBe('none');
    expect(s.groups).toHaveLength(2);
    // piece 1 is adjacent to 0 but placed on the wrong side (far offset): must not join
    const c = takeFromTray(s, geom, 1, geom.pieces[1].x + off - geom.pw * 2, geom.pieces[1].y + off)!;
    expect(dropGroup(s, geom, c.id, TOL)).toBe('none');
    expect(s.groups).toHaveLength(3);
    expect(a.pieces).toEqual([0]);
  });

  it('joins aligned neighbours away from the board and moves them as one group', () => {
    const s = fresh();
    const off = 300;
    takeFromTray(s, geom, 14, geom.pieces[14].x + off, geom.pieces[14].y + off);
    const b = takeFromTray(s, geom, 15, geom.pieces[15].x + off + 5, geom.pieces[15].y + off - 4)!;
    expect(dropGroup(s, geom, b.id, TOL)).toBe('joined');
    expect(s.groups).toHaveLength(1);
    const g = s.groups[0];
    expect(g.pieces.sort()).toEqual([14, 15]);
    expect(g.locked).toBe(false);
    expect([g.x, g.y]).toEqual([off, off]);
    // moving the group keeps relative positions: both pieces share one offset
    moveGroup(s, g.id, 123, -45);
    expect(groupOfPiece(s, 14)).toBe(groupOfPiece(s, 15));
    expect([g.x, g.y]).toEqual([123, -45]);
    // dropping the pair at home locks both
    moveGroup(s, g.id, 3, 3);
    expect(dropGroup(s, geom, g.id, TOL)).toBe('locked');
    expect(progressOf(s)).toBeCloseTo(2 / 36);
  });

  it('completes only when every piece is correctly placed', () => {
    const s = fresh();
    const order = [...s.tray];
    order.forEach((id, i) => {
      expect(isComplete(s)).toBe(false);
      const p = geom.pieces[id];
      const g = takeFromTray(s, geom, id, p.x + 4, p.y - 3)!;
      dropGroup(s, geom, g.id, TOL);
      expect(progressOf(s)).toBeCloseTo((i + 1) / 36);
    });
    expect(isComplete(s)).toBe(true);
    expect(s.groups.every((g) => g.locked && g.x === 0 && g.y === 0)).toBe(true);
  });

  it('a picture fully assembled off the board settles and completes', () => {
    const g4 = buildJigsaw(400, 400, 4, 9);
    const s = newGame(g4, 9, 1);
    for (const id of [0, 1, 2, 3]) {
      const p = g4.pieces[id];
      const g = takeFromTray(s, g4, id, p.x + 900, p.y + 900)!;
      dropGroup(s, g4, g.id, 20);
    }
    expect(isComplete(s)).toBe(true);
  });

  it('pieces can go back to the tray, and hit testing finds the top loose piece', () => {
    const s = fresh();
    const p = geom.pieces[20];
    const g = takeFromTray(s, geom, 20, p.x + 500, p.y + 500)!;
    expect(groupAt(s, geom, p.x + 500 + geom.pw / 2, p.y + 500 + geom.ph / 2, pointInPoly)).toBe(g);
    expect(groupAt(s, geom, p.x + geom.pw / 2, p.y + geom.ph / 2, pointInPoly)).toBeNull();
    expect(returnToTray(s, g.id)).toBe(true);
    expect(s.tray).toContain(20);
    expect(s.groups).toHaveLength(0);
  });

  it('restores an identical state from JSON and rejects mismatched or corrupt saves', () => {
    const s = fresh();
    const a = takeFromTray(s, geom, 3, 33.5, 700.25)!;
    dropGroup(s, geom, a.id, TOL);
    const b = takeFromTray(s, geom, 0, geom.pieces[0].x, geom.pieces[0].y)!;
    dropGroup(s, geom, b.id, TOL);
    const restored = JSON.parse(JSON.stringify(s));
    expect(isValidState(restored, geom, SEED, 1)).toBe(true);
    expect(restored).toEqual(s);
    expect(isValidState(restored, geom, SEED + 1, 1)).toBe(false);
    expect(isValidState(restored, geom, SEED, 2)).toBe(false);
    expect(isValidState(restored, buildJigsaw(W, H, 64, SEED), SEED, 1)).toBe(false);
    expect(isValidState({ ...restored, tray: [...restored.tray, 3] }, geom, SEED, 1)).toBe(false);
    expect(isValidState({ ...restored, tray: restored.tray.slice(1) }, geom, SEED, 1)).toBe(false);
    expect(isValidState(null, geom, SEED, 1)).toBe(false);
    expect(isValidState('garbage', geom, SEED, 1)).toBe(false);
  });
});

// Manifest validation. Used by the test suite, the art:validate script and at
// app start in development.
import { flattenPath, bboxOf, isClosedSingle } from '../art/geometry';
import type { Shape } from '../art/types';
import { buildFindGeometry, visibleFraction } from '../engine/find/geometry';
import { gridFor } from '../engine/jigsaw/grid';
import { buildPaintGeometry } from '../engine/paint/geometry';
import type { Activity, Collection, FindActivity, PaintActivity, PuzzleActivity } from './types';

export interface Issue { level: 'error' | 'warn'; where: string; msg: string }

export const MIN_LABEL_CLEARANCE = 3.5;

function checkShapes(shapes: Shape[], defs: string | undefined, where: string, out: Issue[]) {
  shapes.forEach((s, i) => {
    try {
      const polys = flattenPath(s.d, 4);
      if (!polys.length) out.push({ level: 'error', where, msg: `shape ${i} has an empty path` });
      if (polys.some((p) => p.some(([x, y]) => !Number.isFinite(x) || !Number.isFinite(y)))) out.push({ level: 'error', where, msg: `shape ${i} has non-finite coordinates` });
    } catch (e) {
      out.push({ level: 'error', where, msg: `shape ${i}: ${(e as Error).message}` });
    }
    for (const paint of [s.fill, s.stroke]) {
      const m = paint && /^url\(#([^)]+)\)$/.exec(paint);
      if (m && !(defs ?? '').includes(`id="${m[1]}"`)) out.push({ level: 'error', where, msg: `shape ${i} references missing gradient #${m[1]}` });
    }
  });
}

function validatePuzzle(a: PuzzleActivity, out: Issue[]) {
  const w = a.id;
  if (!(a.art.width > 0 && a.art.height > 0)) out.push({ level: 'error', where: w, msg: 'invalid artwork dimensions' });
  if (a.art.shapes.length < 20) out.push({ level: 'warn', where: w, msg: `only ${a.art.shapes.length} shapes; a jigsaw needs rich detail` });
  checkShapes(a.art.shapes, a.art.defs, w, out);
  if (!a.pieceCounts.length) out.push({ level: 'error', where: w, msg: 'no piece counts' });
  for (const n of a.pieceCounts) {
    const g = gridFor(n, a.art.width / a.art.height);
    const pw = a.art.width / g.cols, ph = a.art.height / g.rows;
    if (g.cols < 2 || g.rows < 2 || pw / ph > 1.6 || ph / pw > 1.6) out.push({ level: 'error', where: w, msg: `no valid grid for ${n} pieces` });
  }
}

function validatePaint(a: PaintActivity, out: Issue[]) {
  const w = a.id;
  if (!(a.width > 0 && a.height > 0)) out.push({ level: 'error', where: w, msg: 'invalid dimensions' });
  const pal = new Set<string>(), nums = new Set<number>();
  for (const p of a.palette) {
    if (pal.has(p.id)) out.push({ level: 'error', where: w, msg: `duplicate palette id ${p.id}` });
    if (nums.has(p.number)) out.push({ level: 'error', where: w, msg: `duplicate palette number ${p.number}` });
    if (!/^#[0-9a-f]{6}$/i.test(p.hex)) out.push({ level: 'error', where: w, msg: `palette ${p.id} needs a 6-digit hex colour` });
    pal.add(p.id); nums.add(p.number);
  }
  const ids = new Set<string>(), used = new Set<string>();
  let ok = true;
  for (const r of a.regions) {
    if (ids.has(r.id)) { out.push({ level: 'error', where: w, msg: `duplicate region id ${r.id}` }); }
    ids.add(r.id);
    if (!pal.has(r.color)) out.push({ level: 'error', where: w, msg: `region ${r.id} uses missing palette colour ${r.color}` });
    used.add(r.color);
    try {
      if (!isClosedSingle(r.d)) { ok = false; out.push({ level: 'error', where: w, msg: `region ${r.id} must be one closed subpath` }); continue; }
      const b = bboxOf(flattenPath(r.d));
      if (b.x0 < -2 || b.y0 < -2 || b.x1 > a.width + 2 || b.y1 > a.height + 2) out.push({ level: 'error', where: w, msg: `region ${r.id} is out of bounds` });
    } catch (e) { ok = false; out.push({ level: 'error', where: w, msg: `region ${r.id}: ${(e as Error).message}` }); }
  }
  for (const p of a.palette) if (!used.has(p.id)) out.push({ level: 'error', where: w, msg: `palette colour ${p.id} is unused` });
  if (a.regions.length < 40 || a.regions.length > 140) out.push({ level: 'warn', where: w, msg: `${a.regions.length} regions (aim for 40–120)` });
  if (a.detail) checkShapes(a.detail, undefined, w, out);
  if (!ok) return;
  const g = buildPaintGeometry(a.regions);
  a.regions.forEach((r, i) => {
    const l = g.labels[i];
    if (l.r <= 0) out.push({ level: 'error', where: w, msg: `region ${r.id} is hidden or has no room for its number` });
    else if (l.r < MIN_LABEL_CLEARANCE) out.push({ level: 'error', where: w, msg: `region ${r.id} is too small to tap (clear radius ${l.r.toFixed(1)}, need ${MIN_LABEL_CLEARANCE})` });
    else if (g.regionAt(l.x, l.y) !== i) out.push({ level: 'error', where: w, msg: `label of region ${r.id} is not inside it` });
  });
}

function validateFind(a: FindActivity, out: Issue[]) {
  const w = a.id;
  if (!(a.width > 0 && a.height > 0)) out.push({ level: 'error', where: w, msg: 'invalid dimensions' });
  const ids = new Set<string>(), names = new Set<string>();
  const geom = buildFindGeometry(a.items);
  let targets = 0, shapes = 0;
  a.items.forEach((it, i) => {
    shapes += it.shapes.length;
    checkShapes(it.shapes, a.defs, `${w}/${it.id ?? i}`, out);
    if (!it.target) return;
    targets++;
    const tw = `${w}/${it.id ?? '#' + i}`;
    if (!it.id) out.push({ level: 'error', where: tw, msg: 'target has no id' });
    else if (ids.has(it.id)) out.push({ level: 'error', where: tw, msg: 'duplicate target id' });
    if (!it.name?.trim()) out.push({ level: 'error', where: tw, msg: 'target has no name' });
    else if (names.has(it.name)) out.push({ level: 'error', where: tw, msg: `duplicate target name "${it.name}" (make the clue explicit)` });
    if (it.id) ids.add(it.id);
    if (it.name) names.add(it.name);
    const g = geom.items[i];
    if (!g.filled.length) { out.push({ level: 'error', where: tw, msg: 'target has no filled shape' }); return; }
    const b = g.box;
    if (b.x0 < 0 || b.y0 < 0 || b.x1 > a.width || b.y1 > a.height) out.push({ level: 'error', where: tw, msg: 'target is out of bounds' });
    if (Math.max(b.x1 - b.x0, b.y1 - b.y0) < 16) out.push({ level: 'error', where: tw, msg: 'target is too small (needs 16+ units)' });
    const vf = visibleFraction(geom, i);
    if (vf < 0.55) out.push({ level: 'error', where: tw, msg: `only ${(vf * 100).toFixed(0)}% of the target is visible` });
  });
  if (targets < 10 || targets > 20) out.push({ level: 'error', where: w, msg: `${targets} targets (need 10–20)` });
  if (shapes < 150) out.push({ level: 'warn', where: w, msg: `only ${shapes} shapes; hidden-object scenes need surrounding detail` });
}

export function validateActivity(a: Activity): Issue[] {
  const out: Issue[] = [];
  if (!a.id || !a.title || !a.blurb) out.push({ level: 'error', where: a.id || '?', msg: 'missing id, title or blurb' });
  if (!(a.version >= 1)) out.push({ level: 'error', where: a.id, msg: 'missing version' });
  if (a.mode === 'puzzle') validatePuzzle(a, out);
  else if (a.mode === 'paint') validatePaint(a, out);
  else validateFind(a, out);
  return out;
}

export function validateCatalog(activities: Activity[], collections: Collection[]): Issue[] {
  const out: Issue[] = [];
  const byId = new Map<string, Activity>();
  for (const a of activities) {
    if (byId.has(a.id)) out.push({ level: 'error', where: a.id, msg: 'duplicate activity id' });
    byId.set(a.id, a);
    out.push(...validateActivity(a));
  }
  const cids = new Set<string>();
  for (const c of collections) {
    if (cids.has(c.id)) out.push({ level: 'error', where: c.id, msg: 'duplicate collection id' });
    cids.add(c.id);
    if (!byId.has(c.coverActivityId)) out.push({ level: 'error', where: c.id, msg: 'cover activity is missing' });
    const modes = new Set<string>();
    for (const id of c.activityIds) {
      const a = byId.get(id);
      if (!a) out.push({ level: 'error', where: c.id, msg: `activity ${id} is missing` });
      else { modes.add(a.mode); if (a.collectionId !== c.id) out.push({ level: 'error', where: c.id, msg: `${id} belongs to ${a.collectionId}` }); }
    }
    for (const m of ['puzzle', 'paint', 'find']) if (!modes.has(m)) out.push({ level: 'error', where: c.id, msg: `collection has no ${m} activity` });
  }
  for (const a of activities) if (!cids.has(a.collectionId)) out.push({ level: 'error', where: a.id, msg: `unknown collection ${a.collectionId}` });
  return out;
}

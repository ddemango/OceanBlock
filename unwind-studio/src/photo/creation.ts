// A "creation": one of the user's photos, turned into a jigsaw, a
// paint-by-number and a hidden-object scene. Stored on the device as one
// record; the three activities are derived from it. Pure; runs in Node too.
import type { Activity, Collection, Difficulty, FindActivity, FindItem, PaintActivity, PaletteColor, PaintRegion, PuzzleActivity } from '../content/types';
import { busyMap, FIND_PRESETS, hideObjects, type HideableObject } from './hide';
import { PAINT_PRESETS, paintify, type Pixels } from './paintify';

export interface Creation {
  v: 1;
  id: string;
  title: string;
  createdAt: number;
  difficulty: Difficulty;
  /** The photo as a JPEG data URL. */
  image: string;
  /** Artwork size for the jigsaw and the scene (the photo's proportions). */
  width: number;
  height: number;
  paint: { width: number; height: number; palette: PaletteColor[]; regions: PaintRegion[] };
  find: { items: FindItem[]; defs: string };
}

/** Artwork units across the longer side of a photo jigsaw or scene. */
export const PHOTO_SIZE = 1000;
/** Paint artwork units across the longer side. */
const PAINT_SIZE = 800;

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

export function buildCreation(input: {
  id: string; title: string; difficulty: Difficulty; image: string; aspect: number;
  /** The photo resized so its longer side is the preset's grid size. */
  grid: Pixels;
  pool: HideableObject[];
  createdAt?: number;
}): Creation {
  const { id, aspect, difficulty } = input;
  const width = aspect >= 1 ? PHOTO_SIZE : Math.round(PHOTO_SIZE * aspect);
  const height = aspect >= 1 ? Math.round(PHOTO_SIZE / aspect) : PHOTO_SIZE;
  const p = PAINT_PRESETS[difficulty];
  const paint = paintify(input.grid, {
    colors: p.colors, minArea: p.minArea, maxRegions: p.maxRegions,
    scale: PAINT_SIZE / Math.max(input.grid.width, input.grid.height), seed: hash(id) % 100000,
  });
  const f = FIND_PRESETS[difficulty];
  const find = hideObjects(input.pool, { width, height, count: f.count, size: f.size, seed: hash(id + ':find'), busy: busyMap(input.grid) });
  return { v: 1, id, title: input.title, createdAt: input.createdAt ?? Date.now(), difficulty, image: input.image, width, height, paint, find };
}

export const photoIds = (id: string) => ({ puzzle: `${id}-puzzle`, paint: `${id}-paint`, find: `${id}-find` });

export function creationActivities(c: Creation): Activity[] {
  const ids = photoIds(c.id);
  const base = { version: 1, collectionId: c.id, categories: ['Your photos'], difficulty: c.difficulty, own: true };
  const puzzle: PuzzleActivity = {
    ...base, id: ids.puzzle, mode: 'puzzle', title: c.title,
    blurb: 'Your own photo, cut into a jigsaw. Choose how many pieces you would like.',
    art: { width: c.width, height: c.height, shapes: [], image: c.image },
    pieceCounts: [36, 64, 100, 196], geometrySeed: hash(c.id) % 100000, geometryVersion: 1,
  };
  const paint: PaintActivity = {
    ...base, id: ids.paint, mode: 'paint', title: c.title,
    blurb: `Your photo as a paint-by-number: each area you colour brings back that part of your photo, ${c.paint.regions.length} areas in all. Or colour it however you like.`,
    width: c.paint.width, height: c.paint.height, palette: c.paint.palette, regions: c.paint.regions, image: c.image,
  };
  const find: FindActivity = {
    ...base, id: ids.find, mode: 'find', title: c.title,
    blurb: `${c.find.items.length} little objects are hiding somewhere in your photo. Can you spot them all?`,
    width: c.width, height: c.height, defs: c.find.defs || undefined, image: c.image, items: c.find.items,
  };
  return [puzzle, paint, find];
}

export function creationCollection(c: Creation): Collection {
  const ids = photoIds(c.id);
  return {
    id: c.id, title: c.title, theme: 'Your photo', own: true,
    description: 'Made from your own photo: a jigsaw, a paint-by-number and a hidden-object scene. It stays on this device.',
    coverActivityId: ids.puzzle, activityIds: [ids.puzzle, ids.paint, ids.find],
  };
}

/** A loose check of a stored record, so a damaged entry is skipped instead of breaking the app. */
export function isCreation(v: unknown): v is Creation {
  const c = v as Creation;
  return !!c && typeof c === 'object' && c.v === 1 && typeof c.id === 'string' && c.id.startsWith('photo-') && typeof c.title === 'string' &&
    typeof c.image === 'string' && c.image.startsWith('data:image/') && c.width > 0 && c.height > 0 &&
    !!c.paint && Array.isArray(c.paint.regions) && c.paint.regions.length > 0 && Array.isArray(c.paint.palette) &&
    !!c.find && Array.isArray(c.find.items) && c.find.items.length > 0 && c.difficulty in PAINT_PRESETS;
}

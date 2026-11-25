import type { Activity, Collection, FindActivity, Mode, PuzzleActivity } from './types';
import coastalPuzzle from './coastal/puzzle';
import coastalPaint from './coastal/paint';
import coastalFind from './coastal/find';
import libraryPuzzle from './library/puzzle';
import libraryPaint from './library/paint';
import libraryFind from './library/find';
import gardenPuzzle from './garden/puzzle';
import gardenPaint from './garden/paint';
import gardenFind from './garden/find';
import woodlandPaint1 from './woodland/paint-1';
import woodlandPaint2 from './woodland/paint-2';
import woodlandPaint3 from './woodland/paint-3';
import woodlandFind1 from './woodland/find-1';
import woodlandFind2 from './woodland/find-2';
import woodlandFind3 from './woodland/find-3';
import kitchenPaint1 from './kitchen/paint-1';
import kitchenPaint2 from './kitchen/paint-2';
import kitchenPaint3 from './kitchen/paint-3';
import kitchenFind1 from './kitchen/find-1';
import kitchenFind2 from './kitchen/find-2';
import kitchenFind3 from './kitchen/find-3';
import travelPaint1 from './travel/paint-1';
import travelPaint2 from './travel/paint-2';
import travelPaint3 from './travel/paint-3';
import travelFind1 from './travel/find-1';
import travelFind2 from './travel/find-2';
import travelFind3 from './travel/find-3';
import bloomsPaint1 from './blooms/paint-1';
import bloomsPaint2 from './blooms/paint-2';
import bloomsPaint3 from './blooms/paint-3';
import bloomsFind1 from './blooms/find-1';
import bloomsFind2 from './blooms/find-2';
import bloomsFind3 from './blooms/find-3';

/**
 * Every hidden-object scene is a richly detailed picture, so each one is also
 * offered as a jigsaw. The puzzle is built from exactly the same artwork.
 */
function hashId(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) % 100000;
}
export function jigsawFromScene(f: FindActivity): PuzzleActivity {
  return {
    id: `${f.id}-jigsaw`, version: f.version, mode: 'puzzle', title: f.title,
    blurb: `${f.title}, as a jigsaw — every little detail, piece by piece.`,
    collectionId: f.collectionId, categories: f.categories, difficulty: f.difficulty, attribution: f.attribution,
    art: { width: f.width, height: f.height, defs: f.defs, shapes: f.items.flatMap((i) => i.shapes) },
    pieceCounts: [36, 64, 100, 196], geometrySeed: hashId(f.id), geometryVersion: 1,
  };
}

interface CollectionSpec { id: string; title: string; theme: string; description: string; puzzles: PuzzleActivity[]; paints: Activity[]; finds: FindActivity[] }

const SPECS: CollectionSpec[] = [
  { id: 'coastal', title: 'Coastal Escape', theme: 'Seaside', description: 'Sunlit seaside scenery, colourful houses, citrus, boats and unhurried travel details.', puzzles: [coastalPuzzle], paints: [coastalPaint], finds: [coastalFind] },
  { id: 'library', title: 'The Cozy Library', theme: 'Interiors', description: 'Warm shelves, well-loved books, tea, plants, lamps and inviting corners to settle into.', puzzles: [libraryPuzzle], paints: [libraryPaint], finds: [libraryFind] },
  { id: 'garden', title: 'Secret Garden', theme: 'Botanical', description: 'Flowers, birds, winding paths, garden tools and quiet botanical details.', puzzles: [gardenPuzzle], paints: [gardenPaint], finds: [gardenFind] },
  { id: 'woodland', title: 'Woodland Cottage', theme: 'Woodland', description: 'A thatched cottage at the edge of a quiet forest: ferns, mushrooms, foxes, firelight and gentle woodland life.', puzzles: [], paints: [woodlandPaint1, woodlandPaint2, woodlandPaint3], finds: [woodlandFind1, woodlandFind2, woodlandFind3] },
  { id: 'kitchen', title: 'Sunday Kitchen', theme: 'Kitchen', description: 'Slow mornings and warm kitchens: bread from the oven, fruit in a bowl, jars on the shelf and a pot of something good.', puzzles: [], paints: [kitchenPaint1, kitchenPaint2, kitchenPaint3], finds: [kitchenFind1, kitchenFind2, kitchenFind3] },
  { id: 'travel', title: 'Around the World', theme: 'Travel', description: 'Postcard views and well-worn suitcases: café terraces, temple gardens, whitewashed villages and the joy of somewhere new.', puzzles: [], paints: [travelPaint1, travelPaint2, travelPaint3], finds: [travelFind1, travelFind2, travelFind3] },
  { id: 'blooms', title: 'Birds & Blooms', theme: 'Botanical', description: 'Hummingbirds and hibiscus, robins in winter berries, a florist at dawn and a window seat made for birdwatching.', puzzles: [], paints: [bloomsPaint1, bloomsPaint2, bloomsPaint3], finds: [bloomsFind1, bloomsFind2, bloomsFind3] },
];

const ordered: Activity[] = [];
export const COLLECTIONS: Collection[] = SPECS.map((s) => {
  const puzzles = [...s.puzzles, ...s.finds.map(jigsawFromScene)];
  const acts: Activity[] = [...puzzles, ...s.paints, ...s.finds];
  ordered.push(...acts);
  return { id: s.id, title: s.title, theme: s.theme, description: s.description, coverActivityId: puzzles[0].id, activityIds: acts.map((a) => a.id) };
});

export const ACTIVITIES: Activity[] = ordered;

const byId = new Map(ACTIVITIES.map((a) => [a.id, a]));

// The user's own photo creations live on the device; the store registers them here.
const ownActs = new Map<string, Activity>();
let ownCols: Collection[] = [];
export function setOwnContent(cols: Collection[], acts: Activity[]) {
  ownCols = cols;
  ownActs.clear();
  for (const a of acts) ownActs.set(a.id, a);
}
/** The user's photo collections, newest first. */
export const ownCollections = () => ownCols;

export const getActivity = (id: string) => byId.get(id) ?? ownActs.get(id);
export const getCollection = (id: string) => COLLECTIONS.find((c) => c.id === id) ?? ownCols.find((c) => c.id === id);
export const activitiesInCollection = (id: string): Activity[] =>
  (getCollection(id)?.activityIds ?? []).map((x) => getActivity(x)).filter((a): a is Activity => !!a);
export const activitiesOf = (mode: Mode) => ACTIVITIES.filter((a) => a.mode === mode);
export const CATEGORIES = [...new Set(ACTIVITIES.flatMap((a) => a.categories))].sort();

export const MODE_LABEL: Record<Mode, string> = { puzzle: 'Puzzle', paint: 'Paint', find: 'Find' };

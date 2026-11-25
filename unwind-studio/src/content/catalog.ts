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

import holidaysPaint1 from './holidays/paint-1';
import holidaysPaint2 from './holidays/paint-2';
import holidaysPaint3 from './holidays/paint-3';
import holidaysFind1 from './holidays/find-1';
import holidaysFind2 from './holidays/find-2';
import holidaysFind3 from './holidays/find-3';
import seasonsPaint1 from './seasons/paint-1';
import seasonsPaint2 from './seasons/paint-2';
import seasonsPaint3 from './seasons/paint-3';
import seasonsFind1 from './seasons/find-1';
import seasonsFind2 from './seasons/find-2';
import seasonsFind3 from './seasons/find-3';
import sportsPaint1 from './sports/paint-1';
import sportsPaint2 from './sports/paint-2';
import sportsPaint3 from './sports/paint-3';
import sportsFind1 from './sports/find-1';
import sportsFind2 from './sports/find-2';
import sportsFind3 from './sports/find-3';
import citiesPaint1 from './cities/paint-1';
import citiesPaint2 from './cities/paint-2';
import citiesPaint3 from './cities/paint-3';
import citiesFind1 from './cities/find-1';
import citiesFind2 from './cities/find-2';
import citiesFind3 from './cities/find-3';
import roadtripPaint1 from './roadtrip/paint-1';
import roadtripPaint2 from './roadtrip/paint-2';
import roadtripPaint3 from './roadtrip/paint-3';
import roadtripFind1 from './roadtrip/find-1';
import roadtripFind2 from './roadtrip/find-2';
import roadtripFind3 from './roadtrip/find-3';
import fairytalePaint1 from './fairytale/paint-1';
import fairytalePaint2 from './fairytale/paint-2';
import fairytalePaint3 from './fairytale/paint-3';
import fairytaleFind1 from './fairytale/find-1';
import fairytaleFind2 from './fairytale/find-2';
import fairytaleFind3 from './fairytale/find-3';
import cafePaint1 from './cafe/paint-1';
import cafePaint2 from './cafe/paint-2';
import cafePaint3 from './cafe/paint-3';
import cafeFind1 from './cafe/find-1';
import cafeFind2 from './cafe/find-2';
import cafeFind3 from './cafe/find-3';

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
    collectionId: f.collectionId, categories: f.categories, difficulty: f.difficulty, attribution: f.attribution, season: f.season,
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
  // ---- added collections ----
  { id: 'holidays', title: "Holiday Traditions", theme: "Holidays", description: "Celebrations through the year: a glowing Halloween porch, a Thanksgiving table, Christmas morning, and sweet treats for Valentine's, Easter and the Fourth of July.", puzzles: [], paints: [holidaysPaint1, holidaysPaint2, holidaysPaint3], finds: [holidaysFind1, holidaysFind2, holidaysFind3] },
  { id: 'seasons', title: "Four Seasons", theme: "Seasons", description: "The turning year: spring flower stalls, a summer boardwalk, an autumn harvest fair, a snowman at dusk, cherry blossoms and fields of sunflowers.", puzzles: [], paints: [seasonsPaint1, seasonsPaint2, seasonsPaint3], finds: [seasonsFind1, seasonsFind2, seasonsFind3] },
  { id: 'sports', title: "Game Day", theme: "Sports", description: "Hot dogs at the ballpark, the bustle of a locker room, a sunny clubhouse, and quiet mornings with a ball, a hoop or a fishing rod.", puzzles: [], paints: [sportsPaint1, sportsPaint2, sportsPaint3], finds: [sportsFind1, sportsFind2, sportsFind3] },
  { id: 'cities', title: "City Lights", theme: "Cities", description: "Rooftop gardens at night, bookstalls by the river, a busy downtown diner, skylines at sunset, cable cars and red buses in the rain.", puzzles: [], paints: [citiesPaint1, citiesPaint2, citiesPaint3], finds: [citiesFind1, citiesFind2, citiesFind3] },
  { id: 'roadtrip', title: "On the Road", theme: "Travel", description: "The joy of setting off: a bright airport lounge, a lakeside campsite, a cruise ship deck, hot air balloons, a vintage camper van and a suitcase packed for adventure.", puzzles: [], paints: [roadtripPaint1, roadtripPaint2, roadtripPaint3], finds: [roadtripFind1, roadtripFind2, roadtripFind3] },
  { id: 'fairytale', title: "Fairytale Kingdom", theme: "Fairytale", description: "Once upon a time: a glittering ballroom, an enchanted forest, a wizard's tower, fireworks over castle towers, a pumpkin coach at midnight and a dragon asleep on its treasure.", puzzles: [], paints: [fairytalePaint1, fairytalePaint2, fairytalePaint3], finds: [fairytaleFind1, fairytaleFind2, fairytaleFind3] },
  { id: 'cafe', title: "Coffee & Good Company", theme: "Friends", description: "Good friends and good coffee: a corner coffeehouse, a lived-in city apartment, game night, two mugs by the window, a comfy sofa and pizza night.", puzzles: [], paints: [cafePaint1, cafePaint2, cafePaint3], finds: [cafeFind1, cafeFind2, cafeFind3] },
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

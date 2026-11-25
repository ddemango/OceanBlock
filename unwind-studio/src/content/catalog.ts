import type { Activity, Collection, Mode } from './types';
import coastalPuzzle from './coastal/puzzle';
import coastalPaint from './coastal/paint';
import coastalFind from './coastal/find';
import libraryPuzzle from './library/puzzle';
import libraryPaint from './library/paint';
import libraryFind from './library/find';
import gardenPuzzle from './garden/puzzle';
import gardenPaint from './garden/paint';
import gardenFind from './garden/find';

export const COLLECTIONS: Collection[] = [
  {
    id: 'coastal', title: 'Coastal Escape', theme: 'Seaside',
    description: 'Sunlit seaside scenery, colourful houses, citrus, boats and unhurried travel details.',
    coverActivityId: 'coastal-puzzle', activityIds: ['coastal-puzzle', 'coastal-paint', 'coastal-find'],
  },
  {
    id: 'library', title: 'The Cozy Library', theme: 'Interiors',
    description: 'Warm shelves, well-loved books, tea, plants, lamps and inviting corners to settle into.',
    coverActivityId: 'library-puzzle', activityIds: ['library-puzzle', 'library-paint', 'library-find'],
  },
  {
    id: 'garden', title: 'Secret Garden', theme: 'Botanical',
    description: 'Flowers, birds, winding paths, garden tools and quiet botanical details.',
    coverActivityId: 'garden-puzzle', activityIds: ['garden-puzzle', 'garden-paint', 'garden-find'],
  },
];

export const ACTIVITIES: Activity[] = [
  coastalPuzzle, coastalPaint, coastalFind,
  libraryPuzzle, libraryPaint, libraryFind,
  gardenPuzzle, gardenPaint, gardenFind,
];

const byId = new Map(ACTIVITIES.map((a) => [a.id, a]));
export const getActivity = (id: string) => byId.get(id);
export const getCollection = (id: string) => COLLECTIONS.find((c) => c.id === id);
export const activitiesOf = (mode: Mode) => ACTIVITIES.filter((a) => a.mode === mode);
export const CATEGORIES = [...new Set(ACTIVITIES.flatMap((a) => a.categories))].sort();

export const MODE_LABEL: Record<Mode, string> = { puzzle: 'Puzzle', paint: 'Paint', find: 'Find' };

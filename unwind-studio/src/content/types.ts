import type { Illustration, Shape } from '../art/types';

export type Mode = 'puzzle' | 'paint' | 'find';
export type Difficulty = 'Relaxed' | 'Moderate' | 'Detailed';

interface ActivityBase {
  /** Stable id, e.g. "coastal-puzzle". */
  id: string;
  /** Bump when geometry/regions/targets change so old saves are discarded safely. */
  version: number;
  mode: Mode;
  title: string;
  blurb: string;
  collectionId: string;
  categories: string[];
  difficulty: Difficulty;
  /** Attribution for external assets. Omit for original in-house artwork. */
  attribution?: { author: string; license: string; source?: string };
  /** Made by the user from their own photo (kept on this device). */
  own?: boolean;
  /** When this picture is in season, e.g. { from: '11-01', to: '11-30', label: 'Thanksgiving' }. Dates are MM-DD; a window may wrap past New Year. */
  season?: { from: string; to: string; label: string };
}

export interface PuzzleActivity extends ActivityBase {
  mode: 'puzzle';
  art: Illustration;
  pieceCounts: number[];
  geometrySeed: number;
  geometryVersion: number;
}

export interface PaletteColor { id: string; number: number; name: string; hex: string }

export interface PaintRegion {
  /** Stable, unique within the artwork. */
  id: string;
  /** A single closed subpath. Regions are drawn in array order (later ones on top). */
  d: string;
  /** Palette colour id this region should receive. */
  color: string;
  /** Optional manual label position; computed automatically when omitted. */
  label?: [number, number];
}

export interface PaintActivity extends ActivityBase {
  mode: 'paint';
  width: number;
  height: number;
  palette: PaletteColor[];
  regions: PaintRegion[];
  /** Non-interactive line work drawn above all regions (thin strokes only). */
  detail?: Shape[];
}

export interface FindItem {
  /** Required for targets. */
  id?: string;
  /** Required for targets: the name shown in the tray. */
  name?: string;
  target?: boolean;
  shapes: Shape[];
}

export interface FindActivity extends ActivityBase {
  mode: 'find';
  width: number;
  height: number;
  defs?: string;
  /** Optional photo (data URL) drawn under every item, filling the scene. */
  image?: string;
  /** Everything in the scene in painter's order (later items on top). Targets are items with target: true. */
  items: FindItem[];
}

export type Activity = PuzzleActivity | PaintActivity | FindActivity;

export interface Collection {
  id: string;
  title: string;
  description: string;
  theme: string;
  /** Activity whose artwork is used as the cover. */
  coverActivityId: string;
  activityIds: string[];
  /** A collection made from the user's own photo. */
  own?: boolean;
}

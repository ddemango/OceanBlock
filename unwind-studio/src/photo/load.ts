// Reading a photo the user picked and preparing it for the three games.
import type { Difficulty } from '../content/types';
import { loadImage } from '../lib/raster';
import { PAINT_PRESETS, type Pixels } from './paintify';

/** Longest side of the stored photo, in pixels. */
const STORE_PX = 1600;
/** Photos more extreme than this are cropped from the centre (very long panoramas make poor puzzles). */
const MIN_ASPECT = 0.6, MAX_ASPECT = 1.8;

export interface PickedPhoto { img: HTMLImageElement; url: string; name: string }

export async function readPhoto(file: File): Promise<PickedPhoto> {
  if (file.type && !file.type.startsWith('image/')) throw new Error('That file is not a photo. Please choose a picture.');
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    if (!img.naturalWidth || !img.naturalHeight) throw new Error('empty');
    if (Math.min(img.naturalWidth, img.naturalHeight) < 200) throw new Error('This photo is too small. Please choose one at least 200 pixels across.');
    return { img, url, name: file.name };
  } catch (e) {
    URL.revokeObjectURL(url);
    const msg = (e as Error).message;
    throw new Error(msg.startsWith('This photo') ? msg : 'That photo could not be opened. Please try a JPEG or PNG picture.');
  }
}

/** The centre crop used for a photo, in source pixels. */
export function cropOf(w: number, h: number): { sx: number; sy: number; sw: number; sh: number; aspect: number } {
  const a = w / h;
  if (a > MAX_ASPECT) { const sw = Math.round(h * MAX_ASPECT); return { sx: Math.round((w - sw) / 2), sy: 0, sw, sh: h, aspect: sw / h }; }
  if (a < MIN_ASPECT) { const sh = Math.round(w / MIN_ASPECT); return { sx: 0, sy: Math.round((h - sh) / 2), sw: w, sh, aspect: w / sh }; }
  return { sx: 0, sy: 0, sw: w, sh: h, aspect: a };
}

function draw(img: CanvasImageSource, crop: ReturnType<typeof cropOf>, w: number, h: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d', { willReadFrequently: true });
  if (!g) throw new Error('Canvas is unavailable');
  g.imageSmoothingQuality = 'high';
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, w, h);
  g.drawImage(img, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, w, h);
  return c;
}

export function preparePhoto(img: HTMLImageElement, difficulty: Difficulty): { image: string; aspect: number; grid: Pixels } {
  const crop = cropOf(img.naturalWidth, img.naturalHeight);
  const fit = (max: number): [number, number] => {
    const s = Math.min(1, max / Math.max(crop.sw, crop.sh));
    return [Math.max(1, Math.round(crop.sw * s)), Math.max(1, Math.round(crop.sh * s))];
  };
  const [sw, sh] = fit(STORE_PX);
  const stored = draw(img, crop, sw, sh);
  const image = stored.toDataURL('image/jpeg', 0.86);
  // Shrink in two steps for a smoother small image (browsers average poorly in one big jump).
  const grid = PAINT_PRESETS[difficulty].grid;
  const [gw, gh] = fit(grid);
  const mid = draw(stored, { sx: 0, sy: 0, sw, sh, aspect: crop.aspect }, gw * 3, gh * 3);
  const small = draw(mid, { sx: 0, sy: 0, sw: gw * 3, sh: gh * 3, aspect: crop.aspect }, gw, gh);
  const data = small.getContext('2d')!.getImageData(0, 0, gw, gh).data;
  return { image, aspect: crop.aspect, grid: { width: gw, height: gh, data } };
}

/** A friendly default title from a file name ("IMG_2041.jpg" → "My photo"). */
export function titleFromName(name: string, when = new Date()): string {
  const base = name.replace(/\.[a-z0-9]+$/i, '').replace(/[_-]+/g, ' ').trim();
  if (!base || /^(img|image|photo|dsc|pxl|screenshot|snapshot)?\s*\d[\d\s]*$/i.test(base) || /^(image|photo)$/i.test(base) || base.length > 40)
    return `My photo, ${when.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
  return base.charAt(0).toUpperCase() + base.slice(1);
}

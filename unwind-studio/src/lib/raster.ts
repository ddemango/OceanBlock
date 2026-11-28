// SVG → bitmap helpers: thumbnails, jigsaw source images and PNG export.
import { findSvg, illustrationSvg, paintSvg } from '../art/render';
import type { Illustration } from '../art/types';
import type { Activity } from '../content/types';
import { isNative } from './native';

export function activitySvg(a: Activity, fills?: Record<string, string>): string {
  if (a.mode === 'puzzle') return illustrationSvg(a.art);
  if (a.mode === 'paint') return paintSvg(a, fills ?? 'complete');
  return findSvg(a);
}

export function activitySize(a: Activity): { width: number; height: number } {
  return a.mode === 'puzzle' ? { width: a.art.width, height: a.art.height } : { width: a.width, height: a.height };
}

/** Rasterise SVG markup to a canvas `pxWidth` pixels wide. Rejects if the image cannot be decoded. */
export function rasterize(svg: string, pxWidth: number, aspect: number): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    const img = new Image();
    img.onload = () => {
      try {
        const c = document.createElement('canvas');
        c.width = Math.round(pxWidth);
        c.height = Math.round(pxWidth / aspect);
        const g = c.getContext('2d');
        if (!g) throw new Error('Canvas is unavailable');
        g.drawImage(img, 0, 0, c.width, c.height);
        resolve(c);
      } catch (e) { reject(e); } finally { URL.revokeObjectURL(url); }
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('The artwork could not be loaded')); };
    img.src = url;
  });
}

/** The photo under an activity's artwork, if it was made from one. */
const photoOf = (a: Activity) => (a.mode === 'puzzle' ? a.art.image : a.image);

/** A photo painting with no colours given, or with every area in its own colour, shows the photo. */
function photoPaintDone(a: Activity, fills: Record<string, string> | undefined): boolean {
  if (a.mode !== 'paint' || !a.image) return false;
  if (!fills) return true;
  const hex = new Map(a.palette.map((p) => [p.id, p.hex.toLowerCase()]));
  return a.regions.every((r) => fills[r.id]?.toLowerCase() === hex.get(r.color));
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('The photo could not be loaded'));
    img.src = src;
  });
}

/**
 * Draw a photo, then any vector artwork on top of it. Photos are drawn
 * straight onto the canvas rather than embedded in SVG, which some browsers
 * refuse to export from.
 */
async function rasterPhoto(photo: string, overlay: string | null, pxWidth: number, aspect: number): Promise<HTMLCanvasElement> {
  const img = await loadImage(photo);
  const c = document.createElement('canvas');
  c.width = Math.round(pxWidth);
  c.height = Math.round(pxWidth / aspect);
  const g = c.getContext('2d');
  if (!g) throw new Error('Canvas is unavailable');
  g.imageSmoothingQuality = 'high';
  g.drawImage(img, 0, 0, c.width, c.height);
  if (overlay) g.drawImage(await rasterize(overlay, pxWidth, aspect), 0, 0);
  return c;
}

/** Bitmap of a jigsaw's picture. */
export function rasterIllustration(art: Illustration, pxWidth: number): Promise<HTMLCanvasElement> {
  const aspect = art.width / art.height;
  if (!art.image) return rasterize(illustrationSvg(art), pxWidth, aspect);
  return rasterPhoto(art.image, art.shapes.length ? illustrationSvg({ ...art, image: undefined }) : null, pxWidth, aspect);
}

/** Bitmap of any activity's artwork (paint artworks with the given colours). */
export function rasterActivity(a: Activity, fills: Record<string, string> | undefined, pxWidth: number): Promise<HTMLCanvasElement> {
  const { width, height } = activitySize(a);
  const photo = photoOf(a);
  if (a.mode === 'paint' && !photoPaintDone(a, fills)) return rasterize(activitySvg(a, fills), pxWidth, width / height);
  if (!photo) return rasterize(activitySvg(a, fills), pxWidth, width / height);
  if (a.mode === 'puzzle') return rasterIllustration(a.art, pxWidth);
  return rasterPhoto(photo, a.mode === 'find' ? findSvg({ ...a, image: undefined }) : null, pxWidth, width / height);
}

const thumbs = new Map<string, Promise<string>>();

/** A cached PNG object URL for a card thumbnail. */
export function thumbUrl(a: Activity, fills?: Record<string, string>, stamp = ''): Promise<string> {
  const key = `${a.id}@${a.version}:${fills ? 'f' + stamp : 'full'}`;
  let p = thumbs.get(key);
  if (!p) {
    p = rasterActivity(a, fills, 480).then(
      (c) => new Promise<string>((res, rej) => c.toBlob((b) => (b ? res(URL.createObjectURL(b)) : rej(new Error('encode failed'))), 'image/png')),
    );
    p.catch(() => thumbs.delete(key));
    thumbs.set(key, p);
    if (thumbs.size > 140) thumbs.delete(thumbs.keys().next().value!);
  }
  return p;
}

/** Export artwork as a PNG without any app controls. Shares where supported, otherwise downloads. */
export async function exportPng(a: Activity, fills: Record<string, string> | undefined, name: string, pxWidth = 2000): Promise<'shared' | 'downloaded'> {
  const canvas = await rasterActivity(a, fills, pxWidth);
  const blob = await new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error('Could not create the image'))), 'image/png'));
  const filename = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.png';
  const file = new File([blob], filename, { type: 'image/png' });
  const coarse = typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches;
  if ((coarse || isNative) && navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title: name }); return 'shared'; } catch (e) { if ((e as Error).name === 'AbortError') return 'shared'; }
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = filename;
  document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  (window as unknown as { __lastExport?: unknown }).__lastExport = { filename, width: canvas.width, height: canvas.height, bytes: blob.size };
  return 'downloaded';
}

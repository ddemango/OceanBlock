// SVG → bitmap helpers: thumbnails, jigsaw source images and PNG export.
import { findSvg, illustrationSvg, paintSvg } from '../art/render';
import type { Activity } from '../content/types';

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

const thumbs = new Map<string, Promise<string>>();

/** A cached PNG object URL for a card thumbnail. */
export function thumbUrl(a: Activity, fills?: Record<string, string>, stamp = ''): Promise<string> {
  const key = `${a.id}@${a.version}:${fills ? 'f' + stamp : 'full'}`;
  let p = thumbs.get(key);
  if (!p) {
    const { width, height } = activitySize(a);
    p = rasterize(activitySvg(a, fills), 560, width / height).then(
      (c) => new Promise<string>((res, rej) => c.toBlob((b) => (b ? res(URL.createObjectURL(b)) : rej(new Error('encode failed'))), 'image/png')),
    );
    p.catch(() => thumbs.delete(key));
    thumbs.set(key, p);
    if (thumbs.size > 60) thumbs.delete(thumbs.keys().next().value!);
  }
  return p;
}

/** Export artwork as a PNG without any app controls. Shares where supported, otherwise downloads. */
export async function exportPng(a: Activity, fills: Record<string, string> | undefined, name: string, pxWidth = 2000): Promise<'shared' | 'downloaded'> {
  const { width, height } = activitySize(a);
  const canvas = await rasterize(activitySvg(a, fills), pxWidth, width / height);
  const blob = await new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error('Could not create the image'))), 'image/png'));
  const filename = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.png';
  const file = new File([blob], filename, { type: 'image/png' });
  const coarse = typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches;
  if (coarse && navigator.canShare?.({ files: [file] })) {
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

// Turns content into standalone SVG markup (strings), usable in the DOM,
// as <img> sources, for export and in Node scripts.
import type { FindActivity, FindItem, PaintActivity } from '../content/types';
import { bboxOf, flattenPath } from './geometry';
import { shade } from './kit';
import type { Illustration, Shape } from './types';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

export function shapeSvg(s: Shape): string {
  const fill = s.fill ?? (s.stroke ? 'none' : '#000');
  let a = `d="${s.d}" fill="${esc(fill)}"`;
  if (s.stroke) a += ` stroke="${esc(s.stroke)}" stroke-width="${s.strokeWidth ?? 1}" stroke-linejoin="round" stroke-linecap="round"`;
  if (s.opacity !== undefined && s.opacity < 1) a += ` opacity="${s.opacity}"`;
  return `<path ${a}/>`;
}

export const shapesSvg = (shapes: Shape[]) => shapes.map(shapeSvg).join('');

function wrap(w: number, h: number, inner: string, defs = '', pxWidth?: number): string {
  const size = pxWidth ? ` width="${pxWidth}" height="${Math.round((pxWidth * h) / w)}"` : ` width="${w}" height="${h}"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"${size}>${defs ? `<defs>${defs}</defs>` : ''}${inner}</svg>`;
}

/** A photo filling the artwork (for inline DOM use; bitmaps draw photos directly). */
export const imageTag = (href: string, w: number, h: number) => `<image href="${esc(href)}" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="none"/>`;

export function illustrationSvg(ill: Illustration, pxWidth?: number): string {
  return wrap(ill.width, ill.height, (ill.image ? imageTag(ill.image, ill.width, ill.height) : '') + shapesSvg(ill.shapes), ill.defs, pxWidth);
}

export const PAPER = '#fffdf8';
export const OUTLINE = '#9a958c';

/**
 * A paint artwork with the given fills. `fills` maps region id → hex colour;
 * pass 'complete' for the finished palette colours.
 */
export function paintSvg(a: PaintActivity, fills: Record<string, string> | 'complete', pxWidth?: number): string {
  const hex = new Map(a.palette.map((p) => [p.id, p.hex]));
  let inner = `<rect width="${a.width}" height="${a.height}" fill="${PAPER}"/>`;
  for (const r of a.regions) {
    const c = fills === 'complete' ? hex.get(r.color) : fills[r.id];
    inner += `<path d="${r.d}" fill="${c ?? PAPER}" stroke="${c ? shade(c, -0.22) : OUTLINE}" stroke-width="1" stroke-linejoin="round"/>`;
  }
  if (a.detail) inner += shapesSvg(a.detail);
  return wrap(a.width, a.height, inner, '', pxWidth);
}

export function findSvg(a: FindActivity, pxWidth?: number): string {
  return wrap(a.width, a.height, (a.image ? imageTag(a.image, a.width, a.height) : '') + a.items.map((it) => shapesSvg(it.shapes)).join(''), a.defs, pxWidth);
}

/** Square thumbnail of one scene item, drawn from the exact shapes used in the scene. */
export function findItemSvg(a: FindActivity, item: FindItem): string {
  const b = bboxOf(item.shapes.flatMap((s) => flattenPath(s.d, 6)));
  const w = b.x1 - b.x0, h = b.y1 - b.y0;
  const size = Math.max(w, h) * 1.16 + 4;
  const x = (b.x0 + b.x1) / 2 - size / 2, y = (b.y0 + b.y1) / 2 - size / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x.toFixed(1)} ${y.toFixed(1)} ${size.toFixed(1)} ${size.toFixed(1)}" width="96" height="96">${a.defs ? `<defs>${a.defs}</defs>` : ''}${shapesSvg(item.shapes)}</svg>`;
}

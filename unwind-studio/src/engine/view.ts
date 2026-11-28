// One transform system shared by rendering and input in every engine:
// screen = world * s + (x, y).
export interface View { s: number; x: number; y: number }
export interface Rect { x: number; y: number; w: number; h: number }

export const toWorld = (v: View, sx: number, sy: number) => ({ x: (sx - v.x) / v.s, y: (sy - v.y) / v.s });
export const toScreen = (v: View, wx: number, wy: number) => ({ x: wx * v.s + v.x, y: wy * v.s + v.y });

/** The view that fits `world` centred inside a viewport with padding. */
export function fitView(world: Rect, vw: number, vh: number, pad = 0): View {
  const s = Math.max(0.0001, Math.min((vw - pad * 2) / world.w, (vh - pad * 2) / world.h));
  return { s, x: (vw - world.w * s) / 2 - world.x * s, y: (vh - world.h * s) / 2 - world.y * s };
}

/** Zoom by `factor` keeping the world point under screen point (sx, sy) fixed. */
export function zoomAt(v: View, sx: number, sy: number, factor: number, min: number, max: number): View {
  const s = Math.max(min, Math.min(max, v.s * factor));
  const k = s / v.s;
  return { s, x: sx - (sx - v.x) * k, y: sy - (sy - v.y) * k };
}

/** Keep at least `keep` screen pixels of the world rect inside the viewport (centre it when it is smaller). */
export function clampView(v: View, world: Rect, vw: number, vh: number, keep = 80): View {
  const w = world.w * v.s, h = world.h * v.s;
  const left = world.x * v.s + v.x, top = world.y * v.s + v.y;
  let x = v.x, y = v.y;
  const kx = Math.min(keep, w), ky = Math.min(keep, h);
  if (left + w < kx) x += kx - (left + w);
  if (left > vw - kx) x -= left - (vw - kx);
  if (top + h < ky) y += ky - (top + h);
  if (top > vh - ky) y -= top - (vh - ky);
  return { s: v.s, x, y };
}

/** A screen-size-independent description of a view, for saving. */
export interface SavedView { cx: number; cy: number; z: number }

export function saveView(v: View, world: Rect, vw: number, vh: number, pad = 0): SavedView {
  const c = toWorld(v, vw / 2, vh / 2);
  return { cx: c.x, cy: c.y, z: v.s / fitView(world, vw, vh, pad).s };
}

export function restoreView(sv: SavedView, world: Rect, vw: number, vh: number, pad = 0): View {
  const s = fitView(world, vw, vh, pad).s * sv.z;
  return { s, x: vw / 2 - sv.cx * s, y: vh / 2 - sv.cy * s };
}

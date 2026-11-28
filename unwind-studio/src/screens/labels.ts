import type { Activity } from '../content/types';
import { gridFor } from '../engine/jigsaw/grid';
import { targetsOf } from '../engine/find/state';

export function variantLabel(a: Activity, variant: string): string {
  if (a.mode === 'puzzle') return `${variant} pieces`;
  if (a.mode === 'paint') return variant === 'creative' ? 'Free colouring' : 'Paint by number';
  return `${targetsOf(a).length} objects`;
}

export function defaultVariants(a: Activity): string[] {
  if (a.mode === 'puzzle') return a.pieceCounts.map(String);
  if (a.mode === 'paint') return ['pbn', 'creative'];
  return ['default'];
}

export function variantHint(a: Activity, variant: string): string {
  if (a.mode === 'puzzle') {
    const g = gridFor(Number(variant), a.art.width / a.art.height);
    const n = Number(variant);
    return `${g.cols} × ${g.rows} · ${n <= 36 ? 'a short session' : n <= 64 ? 'relaxed' : n <= 100 ? 'absorbing' : 'a long, detailed challenge'}`;
  }
  if (a.mode === 'paint') return variant === 'creative' ? 'Choose your own colours' : `${a.regions.length} areas · ${a.palette.length} colours`;
  return 'Untimed, no penalties';
}

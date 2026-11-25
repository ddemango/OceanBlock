/** Piece counts offered, and the grid that best matches an image's proportions. */
export const PIECE_COUNTS = [36, 64, 100, 196] as const;

export function gridFor(count: number, aspect: number): { cols: number; rows: number } {
  let best = { cols: 1, rows: count }, bestErr = Infinity;
  for (let cols = 1; cols <= count; cols++) {
    if (count % cols) continue;
    const rows = count / cols;
    // error of piece aspect from square, in log space
    const err = Math.abs(Math.log(aspect / (cols / rows)));
    if (err < bestErr - 1e-9) { bestErr = err; best = { cols, rows }; }
  }
  return best;
}

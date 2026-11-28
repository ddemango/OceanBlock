/** One drawable vector shape. `d` uses absolute M L H V C Q Z commands only. */
export interface Shape {
  d: string;
  /** Fill colour (hex), `url(#gradientId)` or `none`. Defaults to none when a stroke is given. */
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
}

/** A self-contained vector illustration. */
export interface Illustration {
  width: number;
  height: number;
  /** Raw SVG markup for <defs> (gradients). Gradient ids must be unique app-wide. */
  defs?: string;
  shapes: Shape[];
  /** Optional photo (data URL) drawn under the shapes, filling the whole artwork. */
  image?: string;
}

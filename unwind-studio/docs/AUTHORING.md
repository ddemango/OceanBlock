# Authoring content for Unwind with Ma Dukes

All artwork is original vector art written in TypeScript with the small drawing
toolkit in `src/art/kit.ts`. Nothing is downloaded at runtime, so every activity
works offline and scales cleanly to any zoom level.

An activity is one file that default-exports a typed object
(`src/content/types.ts`). Each collection lives in `src/content/<collection>/`
(for example `paint-1.ts`, `find-2.ts`, plus shared helper files such as
`props.ts`) and is listed in `src/content/catalog.ts`.

Every hidden-object scene is automatically offered as a jigsaw too (the same
artwork, id `<scene id>-jigsaw`), so a good scene gives you two activities.

## Workflow

```bash
npm run art:preview -- <collectionId|activityId>[,<id>…]   # PNGs written to .preview/
npm run art:validate -- <collectionId|activityId>[,<id>…]  # must print "No errors"
```

Look at the PNGs after every change. Validation proves the data is playable;
only your eyes prove it is attractive and recognisable.

To add a new activity: create the file, import it in `src/content/catalog.ts`,
add its id to a collection's `activityIds`, then validate. To change an
existing activity's regions, targets or puzzle seed, bump its `version` so
saved progress from the old version is discarded safely.

## The toolkit (`src/art/kit.ts`)

Path builders return a path string (`d`) using absolute `M L C Q Z` only — do
not hand-write arcs (`A`) or relative commands; the validator rejects them.

| Helper | Purpose |
| --- | --- |
| `rect(x,y,w,h,r?)`, `ellipse(cx,cy,rx,ry,rot?)`, `circle(cx,cy,r)` | basics |
| `poly(points)` / `blob(points, tension?)` | closed straight / smooth shape |
| `line(points)` / `curve(points)` | open paths, for strokes only |
| `leaf`, `petal`, `star`, `sector`, `waveBand` | organic and radial shapes |
| `xf(d, {x,y,s,sx,sy,rot,ox,oy})` | scale + rotate about (ox,oy), then translate |
| `sh(d, fill, extra?)`, `stroke(d, colour, width?)` | build a `Shape` |
| `place(shapes, xform)` | transform a list of shapes (a prop) |
| `mix`, `shade` | colour maths |
| `linearGradient`, `radialGradient` | `<defs>` markup; ids must be unique app-wide, so prefix them with the activity id |
| `rng(seed)` | seeded random for repeatable texture (bricks, foliage, book spines) |

Build reusable props as functions that return `Shape[]` drawn around the
origin, then `place()` them.

## Jigsaw (`PuzzleActivity`)

- `art`: an `Illustration`, **1200 × 1200**. Gradients are welcome.
- A good jigsaw image has detail everywhere: avoid large flat areas (a plain
  sky or wall makes dozens of identical pieces). Add texture, variation and
  distinct landmarks in every part of the image. Aim for 400+ shapes.
- `pieceCounts: [36, 64, 100, 196]`, any integer `geometrySeed`, `geometryVersion: 1`.

## Paint (`PaintActivity`)

- Canvas **1000 × 1250** (portrait).
- `regions` are closed single-subpath shapes drawn in array order; later
  regions sit on top of earlier ones, and only the visible part of a region is
  tappable. Start with background regions that together cover the canvas.
- Aim for **60–110 regions**. Every region must keep a visible area with a
  clear radius of at least 3.5 units for its number (the validator checks);
  avoid slivers left over when shapes overlap.
- Region `id`s are stable and unique (`lemon2-body`, `jug-handle`). Never
  derive them from random numbers.
- `palette`: 10–18 colours, `number` 1..N, each used by at least one region.
  The finished piece should read as a complete illustration, so give neighbours
  different colours and use light/dark pairs for form.
- `detail` (optional): a few thin strokes drawn above everything (veins, rims,
  stitching). They are not interactive.

## Find (`FindActivity`)

- Scene **1200 × 1500** (portrait). `items` is the whole scene in painter's
  order. Plain items are scenery; items with `target: true`, an `id` and a
  `name` are things to find.
- **12–16 targets.** Each target's thumbnail is rendered from its own shapes,
  so it always matches the scene — make each one recognisable on its own.
- A target must be at least 16 units across (aim for 30–90), inside the scene,
  and at least 55% visible (later items may overlap it a little).
- Names are unique. If several similar objects exist, name the intended one
  explicitly ("Red watering can").
- Difficulty comes from composition, scale and surrounding detail — tuck
  targets among similar colours and busy areas. Do not make them invisible.
  Fill the scene with non-target detail (aim for 600+ shapes in total).
- Gradients go in `defs`.

## Shared fields

`id` (`<collection>-<mode>`), `version`, `title`, `blurb` (one sentence),
`collectionId`, `difficulty` (`Relaxed` | `Moderate` | `Detailed`) and
`categories`, chosen from: `Seaside`, `Travel`, `Interiors`, `Still life`,
`Garden`, `Flowers`, `Birds`, `Architecture`, `Cozy`, `Woodland`, `Animals`,
`Kitchen`, `Food`, `Winter`, `Holidays`, `Seasons`, `Sports`, `Cities`,
`Fairytale`, `Coffeehouse`, `Pets`, `Ocean`, `Countryside`, `Treats`, `Crafts`,
`Nature`.

`season` (optional): `{ from: 'MM-DD', to: 'MM-DD', label }` marks a holiday
or seasonal picture. Home shows everything in season today under "In season"
(shortest windows first, so a holiday leads its season) and features that
collection. Windows may wrap past New Year (`12-01` → `02-28`). Every day of
the year should have at least one picture in season; a test checks this.

If you ever bundle external artwork instead, add `attribution`
(`author`, `license`, `source`); it is shown in Settings → Credits.

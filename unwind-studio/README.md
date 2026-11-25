# Unwind with Ma Dukes

*Find your moment.* A calm place to unwind with three activities built around
shared, themed artwork:

- **Puzzle** — a real jigsaw with interlocking pieces (36 / 64 / 100 / 196).
- **Paint** — paint by number, plus free colouring of the same picture.
- **Find** — detailed hidden-object scenes.

It is an installable, offline-capable web app (PWA), designed for phones first
and adapted for tablets and desktop. There are no accounts, no paid services
and no network calls: progress is kept on the device.

## Run it

Requires Node 20+.

```bash
cd unwind-studio
npm install
npm run dev        # development server (prints a URL; add --host is already on)
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build (needed for offline / install)
```

`dist/` is a static site with relative paths, so it can be hosted from any
folder on any static host. Offline play and "Add to Home Screen" need the
production build served over HTTPS (or localhost).

### Checks

```bash
npm test                 # unit tests for the game engines, saving and content
npm run art:validate     # manifest validation for all bundled content
npm run build && npm run e2e   # plays every mode for real in a headless browser
```

`npm run e2e` needs Playwright's Chromium available to Node (it is not listed
as a dependency; install `playwright` globally or run where it is provided).
Screenshots from the run are written to `.preview/e2e/`.

## iPhone and iPad app (TestFlight)

The same web app is wrapped as a native iOS app with [Capacitor](https://capacitorjs.com)
(project in `ios/`, bundle id `com.unwindstudio.app`). In the native app, haptics use the
Taptic Engine, saving an image opens the share sheet, and all content is bundled so it
works offline from first launch.

**One-time setup in App Store Connect** (Apple does not allow this step to be automated):

1. Go to App Store Connect → Apps → **+** → New App.
2. Platform iOS, name "Unwind with Ma Dukes", primary language, and
   bundle ID `com.unwindstudio.app`. If that ID is not offered yet, register it first at
   developer.apple.com → Identifiers → **+** → App IDs. SKU can be `unwind-studio`.

**Upload a build:** GitHub → Actions → **Unwind with Ma Dukes → TestFlight** → Run workflow.
It uses the repository's App Store Connect API key secrets (`ASC_KEY_P8`, `ASC_KEY_ID`,
`ASC_ISSUER_ID`), looks up the Apple team from the account, signs automatically, and uploads. The build appears
in TestFlight 5–20 minutes later.

**Add testers:** Actions → **App Store Connect** → Run workflow with action
`add-testers`, bundle_id `com.unwindstudio.app` and the tester emails.

Working on it locally (needs a Mac with Xcode):

```bash
npm run build && npx cap sync ios
npx cap open ios              # then press Run in Xcode
node scripts/ios-assets.mjs   # regenerate icon and launch image after changing public/icon.svg
```

To use a different bundle id, change `appId` in `capacitor.config.json` and
`PRODUCT_BUNDLE_IDENTIFIER` in `ios/App/App.xcodeproj/project.pbxproj`.

## Architecture

```
src/
  art/          Drawing toolkit and pure geometry (paths, hit tests, SVG output)
  content/      Typed manifests: collections + one file per activity, validation
  engine/       Game rules with no UI or DOM
    view.ts       the single screen ⇄ world transform used for drawing and input
    jigsaw/       grid, seeded piece geometry, groups / snapping / completion
    paint/        region hit-testing, label placement, fills, undo / redo
    find/         target hit-testing, found set, hints, completion
  lib/          Stage (pan / zoom / tap / drag), raster + export, sound, daily picks
  store/        IndexedDB persistence, preferences, progress, gallery, stats
  players/      The three play screens and the shared player shell
  screens/      Home, Explore, collection / activity pages, My Gallery, Settings
  ui/           Shared components and icons
tests/          Unit tests (Vitest)
scripts/        Art preview + validation, icon rendering, browser play-through
```

Key decisions:

- **Engines are pure.** Rules live in `src/engine` as plain functions over
  serialisable state, so they are unit-tested in Node and the UI only renders
  state and forwards input.
- **One transform per engine.** `engine/view.ts` defines `screen = world × s +
  (x, y)`. `lib/stage.ts` owns that view for every player, converts pointer
  input through its exact inverse, and separates taps from drags and pinches.
  All saved coordinates are in artwork units, never pixels, so saves survive
  resizing and rotation.
- **Artwork is code.** Every illustration is original vector art authored with
  `src/art/kit.ts`. The same shapes drive rendering, hit-testing, thumbnails
  and export, so a hidden object's thumbnail and hit area cannot drift from
  what is drawn. Nothing is fetched at runtime.
- **Jigsaw.** Each interior edge is generated once from a stored seed and
  walked forwards by one piece and backwards by its neighbour, so edges are
  complementary by construction. Pieces are clipped from one rasterised image
  into cached bitmaps and drawn on a canvas. A group is a set of pieces sharing
  one offset from their solved positions; groups join only when true grid
  neighbours agree on that offset, and lock when the offset is (near) zero.
- **Paint.** Regions are closed paths in painter's order; the topmost region
  under a tap is the one filled. Number positions are computed inside the
  *visible* part of each region. Paint-by-number and free colouring keep
  separate saves.
- **Find.** A tap hits the topmost not-yet-found target whose own shapes
  contain the point (with a fingertip tolerance that shrinks as you zoom in).
- **Saving.** State is held in memory and written through to IndexedDB with
  debouncing; pending writes are flushed when leaving an activity and
  journalled synchronously to `localStorage` when the page is hidden, then
  recovered on the next launch. Saves carry the content version (and, for
  puzzles, the geometry seed and version); anything incompatible or corrupt is
  discarded with a notice instead of breaking the activity. If storage is
  unavailable the app still runs and says progress will not be kept.
- **Offline.** The build writes a service worker that precaches every built
  file (app shell, content and artwork are all in the bundle) and serves
  cache-first.

## Adding content

See [`docs/AUTHORING.md`](docs/AUTHORING.md).

## Accessibility and comfort

Light and dark themes (artwork keeps its colours), reduced-motion support
(system setting or in-app override), optional sound and haptics, 44px touch
targets, visible focus, labelled controls and keyboard play:

| Where | Keys |
| --- | --- |
| Any play area | Arrow keys pan, `+` / `-` zoom, `0` resets the view |
| Puzzle | `Enter` on a tray piece picks it up; arrows move it (Shift = fine); `Enter` drops; `Esc` returns it; `N` picks up a loose group |
| Paint | `1`–`9`, `0` choose a colour; `N` / `P` next / previous open area; `Enter` fills it; `U` / `R` undo / redo |
| Find | `Enter` guesses at the centre crosshair |

Paint by number marks areas for the selected colour with stripes as well as
numbers, so colour is never the only cue.

## Known limitations

- Puzzle pieces do not rotate (deliberately left out of this release).
- Turning a photo into a colouring page is not included; it needs a real
  segmentation and region-authoring pipeline.
- Free colouring fills regions; there is no freehand brush.
- Artwork is flat vector illustration generated in code rather than painted
  or photographic imagery.
- Progress lives on one device; there is no sync between devices.

# Tidebreaker

A 3D physics cannon game for phones and desktop browsers. Aim your bronze harbor cannon,
fire cannonballs, and knock every crate, drum and buoy off the floating rafts before you
run out of shots.

## Features

- Real rigid-body physics (cannon-es): stacks topple, drums roll, cargo splashes and sinks
- Tap / click anywhere to fire; the cannon swivels and arcs the shot onto your target
- 8 handmade levels, then endless seeded procedural levels (single and twin rafts)
- Limited cannonballs per level, 1–3 star rating, coin rewards for spare shots
- Hearts (lives) that regenerate over time, coin shop for +5 shots and heart refills
- Synthesized sound effects, haptics, settings menu, progress saved in localStorage
- All art is procedural (no image/audio assets); installable as a PWA and works offline

## Run it

```bash
npm install
npm run dev      # dev server (open the printed URL on your phone on the same Wi-Fi)
npm run build    # production build into dist/
npm run preview  # serve the production build
```

## Project layout

| File | What it does |
| --- | --- |
| `src/main.js` | Game loop, physics world, aiming/firing, win/lose rules, UI and save data |
| `src/levels.js` | Block definitions, handmade levels and the procedural level generator |
| `src/scenery.js` | Sky, animated water, islands, stone pier, cannon and raft models |
| `src/textures.js` | Canvas-drawn textures (crates, drums, buoys, beams, stone) |
| `src/audio.js` | WebAudio sound effects |
| `public/` | PWA manifest, icon and offline service worker |

## Native apps (Android & iOS)

The game is wrapped as a native app with [Capacitor](https://capacitorjs.com). App id: `com.tidebreaker.game`.
Native extras: real haptics, hidden status bar, splash screen, portrait lock, app icons.

After any change to the game code, rebuild and copy it into the native projects:

```bash
npm run build && npx cap sync
```

### Android

Needs Android Studio (or the Android SDK + Java 21).

```bash
npx cap open android                       # open in Android Studio and press Run
# or from the command line:
cd android && ./gradlew assembleDebug      # -> android/app/build/outputs/apk/debug/app-debug.apk
```

For the Google Play Store, build a signed release bundle in Android Studio
(Build → Generate Signed App Bundle) and upload the `.aab` in the Play Console.

### iOS

Needs a Mac with Xcode.

```bash
npx cap open ios     # opens ios/App/App.xcworkspace in Xcode
```

Pick your Apple developer team under Signing & Capabilities, then Run on a device, or
Product → Archive to upload to TestFlight / the App Store.

### Icons & splash screens

Source images live in `assets/` (`icon-only.png`, `splash.png`). Regenerate all sizes with:

```bash
npx @capacitor/assets generate --iconBackgroundColor '#1b9fc9' --splashBackgroundColor '#1b9fc9'
```

// Renders the iOS app icon and launch images from public/icon.svg.
// Run after changing the icon: node scripts/ios-assets.mjs
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const svg = readFileSync('public/icon.svg', 'utf8').replace('<svg ', '<svg width="100%" height="100%" ');
const A = 'ios/App/App/Assets.xcassets';
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
// App icon: 1024px, square, opaque (Apple rounds the corners itself)
await page.setViewportSize({ width: 1024, height: 1024 });
await page.setContent(`<body style="margin:0">${svg}</body>`);
await page.screenshot({ path: `${A}/AppIcon.appiconset/AppIcon-512@2x.png`, omitBackground: false });
// Launch image: soft background with the mark centred
await page.setViewportSize({ width: 2732, height: 2732 });
await page.setContent(`<body style="margin:0;height:100vh;display:grid;place-items:center;background:linear-gradient(180deg,#fdf1ec,#f6f3fb 45%,#ecf1fb)"><div style="width:420px;height:420px;border-radius:96px;overflow:hidden;box-shadow:0 40px 90px -40px rgba(72,68,138,.5)">${svg}</div></body>`);
for (const f of ['splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png']) await page.screenshot({ path: `${A}/Splash.imageset/${f}` });
await browser.close();
console.log('iOS icon and launch images written');

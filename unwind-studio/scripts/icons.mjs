// Renders PNG app icons from public/icon.svg. Run once: node scripts/icons.mjs
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const svg = readFileSync('public/icon.svg', 'utf8');
const browser = await chromium.launch();
const page = await browser.newPage();
for (const [name, size, pad] of [['icon-192', 192, 0], ['icon-512', 512, 0], ['icon-180', 180, 0], ['icon-maskable-512', 512, 0.12]]) {
  await page.setViewportSize({ width: size, height: size });
  const inner = Math.round(size * (1 - pad * 2));
  await page.setContent(`<body style="margin:0;background:#101614;display:grid;place-items:center;height:100vh"><div style="width:${inner}px;height:${inner}px">${svg.replace('<svg ', '<svg width="100%" height="100%" ')}</div></body>`);
  await page.screenshot({ path: `public/${name}.png`, omitBackground: pad === 0 && name !== 'icon-180' });
}
await browser.close();

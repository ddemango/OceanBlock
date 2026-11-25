// Renders artwork to PNG so it can be inspected.
// Usage: npm run art:preview -- <collectionId|activityId|all>
// Output: .preview/<activityId>*.png
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { bboxOf, flattenPath } from '../src/art/geometry';
import { findItemSvg, findSvg, illustrationSvg, paintSvg } from '../src/art/render';
import { ACTIVITIES } from '../src/content/catalog';
import { buildPaintGeometry } from '../src/engine/paint/geometry';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const arg = process.argv[2] ?? 'all';
const acts = ACTIVITIES.filter((a) => arg === 'all' || a.collectionId === arg || a.id === arg);
if (!acts.length) { console.error(`Nothing matches "${arg}"`); process.exit(1); }
const out = resolve('.preview');
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
async function shot(name: string, html: string, w: number, h: number) {
  await page.setViewportSize({ width: Math.round(w), height: Math.round(h) });
  await page.setContent(`<body style="margin:0;background:#fff;font-family:sans-serif">${html}</body>`);
  await page.screenshot({ path: `${out}/${name}.png` });
  console.log(`.preview/${name}.png`);
}

for (const a of acts) {
  if (a.mode === 'puzzle') {
    await shot(a.id, illustrationSvg(a.art, 1200), 1200, (1200 * a.art.height) / a.art.width);
  } else if (a.mode === 'paint') {
    const W = 1000, H = (W * a.height) / a.width;
    await shot(`${a.id}-colour`, paintSvg(a, 'complete', W), W, H);
    const g = buildPaintGeometry(a.regions);
    const num = new Map(a.palette.map((p) => [p.id, p.number]));
    const labels = a.regions
      .map((r, i) => {
        const l = g.labels[i];
        const fs = Math.max(5, Math.min(22, l.r * 1.25));
        return `<text x="${l.x}" y="${l.y}" font-size="${fs}" text-anchor="middle" dominant-baseline="central" fill="${l.r < 3.5 ? 'red' : '#333'}">${num.get(r.color)}</text>`;
      })
      .join('');
    const blank = paintSvg(a, {}, 1400).replace('</svg>', labels + '</svg>');
    await shot(`${a.id}-numbers`, blank, 1400, (1400 * a.height) / a.width);
  } else {
    const W = 1400, H = (W * a.height) / a.width;
    await shot(a.id, findSvg(a, W), W, H);
    const targets = a.items.filter((i) => i.target);
    const boxes = targets
      .map((t, n) => {
        const b = bboxOf(t.shapes.flatMap((s) => flattenPath(s.d, 6)));
        return `<rect x="${b.x0 - 6}" y="${b.y0 - 6}" width="${b.x1 - b.x0 + 12}" height="${b.y1 - b.y0 + 12}" fill="none" stroke="#e11" stroke-width="3"/><text x="${b.x0 - 6}" y="${b.y0 - 10}" font-size="20" font-weight="bold" fill="#e11" stroke="#fff" stroke-width="4" paint-order="stroke">${n + 1}</text>`;
      })
      .join('');
    await shot(`${a.id}-key`, findSvg(a, W).replace('</svg>', boxes + '</svg>'), W, H);
    const cells = targets
      .map((t, n) => `<div style="width:150px;text-align:center;font-size:14px"><div style="background:#f3efe6;border-radius:12px;padding:6px">${findItemSvg(a, t)}</div>${n + 1}. ${t.name}</div>`)
      .join('');
    await shot(`${a.id}-targets`, `<div style="display:flex;flex-wrap:wrap;gap:10px;padding:10px;width:980px">${cells}</div>`, 1000, Math.ceil(targets.length / 6) * 150 + 20);
  }
}
await browser.close();

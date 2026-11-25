// Renders contact sheets of artwork for review. Usage: tsx scripts/contact.ts <paint|find> <out.png> [collection,...]
import { createRequire } from 'node:module';
import { findSvg, paintSvg } from '../src/art/render';
import { ACTIVITIES } from '../src/content/catalog';
const { chromium } = createRequire(import.meta.url)('playwright');
const [mode, out, cols] = process.argv.slice(2);
const want = cols ? cols.split(',') : null;
const acts = ACTIVITIES.filter((a) => a.mode === mode && (!want || want.includes(a.collectionId)));
const cells = acts.map((a) => {
  const svg = a.mode === 'paint' ? paintSvg(a, 'complete', 300) : a.mode === 'find' ? findSvg(a, 300) : '';
  return `<div style="width:300px;font:12px sans-serif;text-align:center">${svg}<div>${a.title}</div></div>`;
}).join('');
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1260, height: 800 } });
await p.setContent(`<body style="margin:0;background:#fff"><div style="display:flex;flex-wrap:wrap;gap:10px;padding:10px;width:1240px">${cells}</div></body>`);
await p.screenshot({ path: out, fullPage: true }); await b.close();

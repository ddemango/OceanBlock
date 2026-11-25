// Real-gameplay verification in a browser. Builds must exist: `npm run build` first.
// Usage: npm run e2e            (starts `vite preview` itself)
//        BASE=http://host:port npm run e2e
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');

const PORT = 4179;
const BASE = process.env.BASE ?? `http://localhost:${PORT}/`;
const SHOTS = process.env.SHOTS ?? '.preview/e2e';
mkdirSync(SHOTS, { recursive: true });
let server;
if (!process.env.BASE) {
  server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 2500));
}

const results = [];
const errors = [];
let failed = 0;
function check(name, ok, extra = '') {
  results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`);
  if (!ok) failed++;
  console.log(results[results.length - 1]);
}
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

async function open(hash) {
  await page.goto(BASE + hash);
  await page.waitForFunction(() => window.__unwind?.getApp().ready);
  await page.waitForTimeout(400);
  await dismissTutorial(page);
}
async function dismissTutorial(pg) {
  const ok = pg.getByTestId('tutorial-ok');
  if (!(await ok.count())) return;
  await pg.waitForTimeout(350); // let the sheet finish sliding in
  await ok.click();
  await ok.waitFor({ state: 'detached', timeout: 3000 });
}
const saved = () => page.waitForFunction(() => window.__unwind.getApp().saveStatus === 'saved', null, { timeout: 5000 });
const stageBox = () => page.getByTestId('stage').boundingBox();
/** world → page coordinates through the live view of whichever player is open */
async function toPage(key, x, y) {
  const v = await page.evaluate((k) => window[k].stage.view, key);
  const b = await stageBox();
  return { x: b.x + x * v.s + v.x, y: b.y + y * v.s + v.y };
}
async function shot(name) { await page.screenshot({ path: `${SHOTS}/${name}.png` }); }

// ================= STARTUP =================
// open the bare address with no #/ route, exactly as the installed iPhone app does
await page.goto(BASE);
await page.waitForSelector('.sky', { timeout: 8000 }).catch(() => {});
check('the app starts from a bare address (no #/ route), as the iOS app does', (await page.locator('.sky').count()) === 1);

// ================= JIGSAW =================
console.log('\n— Jigsaw —');
await open('#/play/coastal-puzzle/36');
await page.waitForFunction(() => window.__jigsaw?.assets);
const J = await page.evaluate(() => { const { geom } = window.__jigsaw; return { pw: geom.pw, ph: geom.ph, cols: geom.cols, rows: geom.rows, pieces: geom.pieces.map((p) => ({ id: p.id, x: p.x, y: p.y, col: p.col, row: p.row })) }; });
const jstate = () => page.evaluate(() => JSON.parse(JSON.stringify(window.__jigsaw.st)));
const groupOf = (s, id) => s.groups.find((g) => g.pieces.includes(id));

// clipping uses the right image coordinates: each sprite's centre pixel equals the source pixel at the piece centre
const clipOk = await page.evaluate(() => {
  const { geom, assets } = window.__jigsaw;
  const src = assets.src.getContext('2d'), res = assets.res, m = geom.margin;
  let bad = 0;
  for (const p of geom.pieces) {
    const avg = (ctx, x, y) => { const d = ctx.getImageData(Math.round(x) - 3, Math.round(y) - 3, 7, 7).data; let r = 0, g = 0, b = 0; for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; } return [r, g, b].map((v) => v / 49); };
    const a = avg(assets.sprites[p.id].getContext('2d'), (m + geom.pw / 2) * res, (m + geom.ph / 2) * res);
    const b = avg(src, (p.x + geom.pw / 2) * res, (p.y + geom.ph / 2) * res);
    if (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) > 24) bad++;
  }
  return bad;
});
check('piece bitmaps are clipped from the correct image coordinates', clipOk === 0, `${clipOk} mismatches`);

/** Drag a piece (from the tray or the board) so its cell's top-left lands at world (wx, wy). */
async function dragPiece(id, wx, wy) {
  const s = await jstate();
  let from;
  const g = groupOf(s, id);
  if (g) {
    const p = J.pieces[id];
    from = await toPage('__jigsaw', p.x + g.x + J.pw / 2, p.y + g.y + J.ph / 2);
  } else {
    const el = page.locator(`[data-piece="${id}"]`);
    await el.scrollIntoViewIfNeeded();
    const b = await el.boundingBox();
    from = { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  }
  const to = await toPage('__jigsaw', wx + J.pw / 2, wy + J.ph / 2);
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(from.x, from.y - 12, { steps: 2 });
  await page.mouse.move((from.x + to.x) / 2, (from.y + to.y) / 2, { steps: 3 });
  await page.mouse.move(to.x, to.y, { steps: 3 });
  await page.mouse.up();
  await page.waitForTimeout(40);
}
const home = (id, dx = 0, dy = 0) => dragPiece(id, J.pieces[id].x + dx, J.pieces[id].y + dy);

let s0 = await jstate();
check('starts with the four corners in place and the rest shuffled in the tray', s0.tray.length === 32 && [0, 5, 30, 35].every((c) => groupOf(s0, c)?.locked));

// 1. wrong cell does not snap
await dragPiece(14, J.pieces[20].x + J.pw * 0.5, J.pieces[20].y + J.ph * 0.5);
let s = await jstate();
check('a piece dropped in the wrong place does not snap or lock', groupOf(s, 14) && !groupOf(s, 14).locked && Math.hypot(groupOf(s, 14).x, groupOf(s, 14).y) > J.pw * 0.5);
// 2. true neighbour, but misaligned by a full piece: must not join
const g14 = groupOf(s, 14);
await dragPiece(15, J.pieces[15].x + g14.x, J.pieces[15].y + g14.y + J.ph * 1.3);
s = await jstate();
check('a misaligned neighbour does not join', s.groups.filter((g) => !g.locked).length === 2);
// 3. non-neighbour at the same offset must not join
await dragPiece(3, J.pieces[3].x + g14.x, J.pieces[3].y + g14.y);
s = await jstate();
check('a non-neighbouring piece does not join even at a matching offset', s.groups.filter((g) => !g.locked).length === 3 && groupOf(s, 3).pieces.length === 1);
await home(3);
// 4. aligned neighbour joins off its solved position
await dragPiece(15, J.pieces[15].x + g14.x + 6, J.pieces[15].y + g14.y - 5);
s = await jstate();
const pair = groupOf(s, 14);
check('correctly aligned neighbours connect', pair.pieces.length === 2 && pair.pieces.includes(15) && !pair.locked);
// 5. the group moves as one
await dragPiece(14, J.pieces[14].x + pair.x - 70, J.pieces[14].y + pair.y + 40);
s = await jstate();
const moved = groupOf(s, 14);
check('connected pieces move together keeping their relative positions', moved.pieces.length === 2 && groupOf(s, 15) && groupOf(s, 15).id === moved.id && Math.abs(moved.x - (pair.x - 70)) < 3 && Math.abs(moved.y - (pair.y + 40)) < 3);
// 6. snapping the group home locks both
await home(14, 5, -4);
s = await jstate();
check('a group dropped near its solved position snaps and locks', groupOf(s, 14).locked && groupOf(s, 14).x === 0 && groupOf(s, 15).locked);
// 7. place about a third, refresh, compare
for (const id of [1, 2, 6, 7, 8, 12, 13, 31, 34]) await home(id, 4, 4);
await dragPiece(22, J.pieces[22].x + 40, J.pieces[22].y + 140); // one loose piece too
await saved();
const before = await jstate();
await shot('jigsaw-midway');
await page.reload();
await page.waitForFunction(() => window.__jigsaw?.assets);
const after = await jstate();
check('refresh restores identical jigsaw progress (positions, groups, locks, tray order)', eq(before, after), `${before.groups.reduce((n, g) => n + g.pieces.length, 0)} pieces on the table`);
const sameGeom = await page.evaluate(() => window.__jigsaw.geom.pieces.map((p) => p.path).join('|').length);
check('refresh rebuilds the same piece geometry from the stored seed', sameGeom > 0 && eq(J.pieces.map((p) => [p.x, p.y]), await page.evaluate(() => window.__jigsaw.geom.pieces.map((p) => [p.x, p.y]))));
// 8. resize and rotate: state untouched, placing still works
await page.setViewportSize({ width: 844, height: 390 });
await page.waitForTimeout(300);
await page.setViewportSize({ width: 1024, height: 768 });
await page.waitForTimeout(300);
check('resizing the viewport does not change piece placement', eq(after, await jstate()));
// 9. zoom, then keep placing; finish the puzzle
const sb = await stageBox();
await page.mouse.move(sb.x + sb.width / 2, sb.y + sb.height / 2);
await page.mouse.wheel(0, -300);
await page.waitForTimeout(100);
await home(22, -3, 3);
s = await jstate();
check('snapping still works after zooming', groupOf(s, 22).locked);
await page.getByTestId('reset-view').click();
await page.waitForTimeout(450);
await page.getByTestId('hint').click();
check('hint highlights a real piece still in the tray', (await page.locator('.jpiece.hinted').count()) === 1);
check('not complete while pieces remain', (await page.getByTestId('completion').count()) === 0);
for (const id of (await jstate()).tray.slice()) await home(id, 3, -3);
await page.getByTestId('completion').waitFor({ timeout: 6000 });
s = await jstate();
check('completing every piece triggers completion', s.tray.length === 0 && s.groups.every((g) => g.locked));
await shot('jigsaw-complete');
check('completed puzzle is saved to the gallery', await page.evaluate(() => window.__unwind.getApp().gallery.some((g) => g.id === 'coastal-puzzle|36')));

// ================= PAINT =================
console.log('\n— Paint —');
await page.setViewportSize({ width: 390, height: 844 });
await open('#/play/coastal-paint/pbn');
await page.waitForFunction(() => window.__paint);
const P = await page.evaluate(() => ({ labels: window.__paint.geom.labels }));
const regions = await page.evaluate(() => [...document.querySelectorAll('[data-region]')].map((e) => e.getAttribute('data-region')));
const colours = await page.evaluate(() => [...document.querySelectorAll('.swatch[data-colour]')].map((e) => e.getAttribute('data-colour')));
const regionColour = await page.evaluate(() => window.__paint.regionColours);
const pstate = () => page.evaluate(() => JSON.parse(JSON.stringify(window.__paint.state)));
const filled = async () => Object.keys((await pstate()).fills).length;
async function tapRegion(i) {
  const l = P.labels[i];
  let pt = await toPage('__paint', l.x, l.y);
  // if a floating control covers the point (as it would for a player), move the view first
  const clear = await page.evaluate(([x, y]) => !!document.elementFromPoint(x, y)?.closest('[data-testid="stage"]'), [pt.x, pt.y]);
  if (!clear) {
    await page.evaluate(([x, y]) => window.__paint.stage.focus(x, y, 2), [l.x, l.y]);
    await page.waitForTimeout(520);
    pt = await toPage('__paint', l.x, l.y);
    await page.mouse.click(pt.x, pt.y);
    await page.getByTestId('reset-view').click(); await page.waitForTimeout(420);
    return;
  }
  await page.mouse.click(pt.x, pt.y);
  await page.waitForTimeout(15);
}
const pick = (c) => page.locator(`.swatch[data-colour="${c}"]`).click();
check('paint artwork has regions and a palette', regions.length >= 40 && colours.length >= 8, `${regions.length} regions, ${colours.length} colours`);

const first = regions.findIndex((_, i) => P.labels[i].r > 12);
const right = regionColour[first], wrongC = colours.find((c) => c !== right);
await pick(wrongC); await tapRegion(first);
check('tapping with the wrong number does not fill the region', (await filled()) === 0);
await pick(right); await tapRegion(first);
check('tapping with the matching number fills the region', (await filled()) === 1 && (await pstate()).fills[regions[first]] === right);
await tapRegion(first); await tapRegion(first);
check('repeated taps do not increase progress', (await filled()) === 1 && (await page.getByTestId('progress-label').textContent()).startsWith('1 of'));
// a fill affects only the intended region
check('a fill affects only the intended region', (await page.evaluate(() => document.querySelectorAll('.preg.filled').length)) === 1);
await page.getByTestId('undo').click();
check('undo removes the fill', (await filled()) === 0);
await page.getByTestId('redo').click();
check('redo restores the fill', (await filled()) === 1);
// panning must not paint
const b0 = await stageBox();
await page.mouse.move(b0.x + 200, b0.y + 300); await page.mouse.down(); await page.mouse.move(b0.x + 120, b0.y + 380, { steps: 5 }); await page.mouse.up();
check('dragging to pan does not colour anything', (await filled()) === 1);
await page.getByTestId('reset-view').click(); await page.waitForTimeout(450);
// complete one palette colour
const target = colours.map((c) => ({ c, n: regionColour.filter((x) => x === c).length })).sort((a, b) => a.n - b.n).find((x) => x.c !== right && x.n >= 2);
await pick(target.c);
for (let i = 0; i < regions.length; i++) if (regionColour[i] === target.c) {
  // small regions need zoom: zoom on the label point, tap, reset
  if (P.labels[i].r < 9) { const pt = await toPage('__paint', P.labels[i].x, P.labels[i].y); await page.mouse.move(pt.x, pt.y); await page.mouse.wheel(0, -900); await page.waitForTimeout(60); await tapRegion(i); await page.getByTestId('reset-view').click(); await page.waitForTimeout(420); }
  else await tapRegion(i);
}
check('a palette colour is recognised as complete', (await page.locator(`.swatch[data-colour="${target.c}"]`).getAttribute('data-left')) === '0' && (await page.locator(`.swatch[data-colour="${target.c}"].complete`).count()) === 1, `colour ${target.c}, ${target.n} regions`);
// smallest region after zooming
const small = regions.map((_, i) => i).filter((i) => !regionColour[i].includes(target.c) || regionColour[i] !== target.c).filter((i) => regionColour[i] !== target.c && i !== first).sort((a, b) => P.labels[a].r - P.labels[b].r)[0];
await pick(regionColour[small]);
{
  const pt = await toPage('__paint', P.labels[small].x, P.labels[small].y);
  await page.mouse.move(pt.x, pt.y); await page.mouse.wheel(0, -1100); await page.waitForTimeout(80);
  const n0 = await filled();
  await tapRegion(small);
  check('a small region can be filled after zooming', (await filled()) === n0 + 1 && !!(await pstate()).fills[regions[small]], `clear radius ${P.labels[small].r.toFixed(1)} units`);
  await shot('paint-zoomed');
}
await saved();
const pBefore = await pstate();
await page.reload();
await page.waitForFunction(() => window.__paint);
check('refresh restores every colour', eq(pBefore.fills, (await pstate()).fills), `${Object.keys(pBefore.fills).length} fills`);
check('refresh restores the view (zoom and position)', (await page.evaluate(() => window.__paint.stage.zoom)) > 1.5);
await page.getByTestId('reset-view').click(); await page.waitForTimeout(450);
await shot('paint-midway');
// creative colouring keeps separate progress and the user's colours
await open('#/play/coastal-paint/creative');
await page.waitForFunction(() => window.__paint);
check('creative colouring starts separately from paint by number', (await filled()) === 0);
await page.locator('.swatch[data-colour="#8e6bbf"]').click();
await tapRegion(first);
await page.getByTestId('custom-colour').fill('#12ab9c');
await tapRegion(small === first ? first + 1 : regions.findIndex((_, i) => i !== first && P.labels[i].r > 12));
let cs = await pstate();
check('creative colouring fills with the chosen and custom colours', cs.fills[regions[first]] === '#8e6bbf' && Object.values(cs.fills).includes('#12ab9c'));
await page.getByTestId('undo').click();
check('creative undo works', Object.keys((await pstate()).fills).length === 1);
await page.getByTestId('redo').click();
await saved();
await page.getByTestId('save-image').click();
await page.waitForFunction(() => window.__lastExport, null, { timeout: 15000 });
const exp1 = await page.evaluate(() => window.__lastExport);
check('creative export produces a full-resolution image', exp1.width === 2000 && exp1.bytes > 20000, JSON.stringify(exp1));
// finish paint by number
await open('#/play/coastal-paint/pbn');
await page.waitForFunction(() => window.__paint);
check('paint-by-number progress is untouched by creative colouring', eq((await pstate()).fills, pBefore.fills));
await page.getByTestId('reset-view').click(); await page.waitForTimeout(450);
for (const c of colours) {
  const todo = regions.map((_, i) => i).filter((i) => regionColour[i] === c);
  const st = await pstate();
  const open_ = todo.filter((i) => !st.fills[regions[i]]);
  if (!open_.length) continue;
  await pick(c);
  for (const i of open_) {
    if (P.labels[i].r < 9) { const pt = await toPage('__paint', P.labels[i].x, P.labels[i].y); await page.mouse.move(pt.x, pt.y); await page.mouse.wheel(0, -900); await page.waitForTimeout(60); await tapRegion(i); await page.getByTestId('reset-view').click(); await page.waitForTimeout(420); }
    else await tapRegion(i);
  }
}
await page.getByTestId('completion').waitFor({ timeout: 6000 });
check('filling every region completes the painting', (await filled()) === regions.length);
await shot('paint-complete');
await page.evaluate(() => { window.__lastExport = null; });
await page.getByTestId('export').click();
await page.waitForFunction(() => window.__lastExport, null, { timeout: 15000 });
check('finished painting exports without app controls at 2000px', (await page.evaluate(() => window.__lastExport.width)) === 2000);
check('finished painting is in the gallery with its colours', await page.evaluate((n) => { const g = window.__unwind.getApp().gallery.find((x) => x.id === 'coastal-paint|pbn'); return !!g && Object.keys(g.fills).length === n; }, regions.length));

// ================= FIND =================
console.log('\n— Find —');
await open('#/play/coastal-find/default');
await page.waitForFunction(() => window.__find);
const T = await page.evaluate(() => window.__find.targets.map((t) => ({ id: t.id, name: t.name, ...window.__find.pointInside(t.id) })));
const fstate = () => page.evaluate(() => JSON.parse(JSON.stringify(window.__find.state)));
async function tapWorld(x, y) {
  let pt = await toPage('__find', x, y);
  // as a player would: if the spot is off-screen or under a floating control, move the view first
  const clear = await page.evaluate(([px, py]) => !!document.elementFromPoint(px, py)?.closest('[data-testid="stage"]'), [pt.x, pt.y]);
  if (!clear) {
    await page.evaluate(([wx, wy]) => window.__find.stage.focus(wx, wy, 2), [x, y]);
    await page.waitForTimeout(560);
    pt = await toPage('__find', x, y);
  }
  await page.mouse.click(pt.x, pt.y);
  await page.waitForTimeout(30);
}
check('scene lists 10–20 targets, each with a thumbnail and name', T.length >= 10 && T.length <= 20 && (await page.locator('.target img').count()) === T.length, `${T.length} targets`);
// visible in the scene: every target's own pixels are present on screen (not fully covered)
const vis = await page.evaluate(() => window.__find.visibility());
check('every listed target is actually visible in the scene', vis.every((v) => v >= 0.55), 'min visible ' + Math.min(...vis).toFixed(2));
// a miss
const missPt = await page.evaluate(() => window.__find.emptyPoint());
await tapWorld(missPt.x, missPt.y);
check('a wrong guess changes nothing (no penalty)', (await fstate()).found.length === 0);
await tapWorld(T[0].x, T[0].y);
check('tapping a target finds it', eq((await fstate()).found, [T[0].id]) && (await page.locator(`.target.found[data-target="${T[0].id}"]`).count()) === 1);
await tapWorld(T[0].x, T[0].y); await tapWorld(T[0].x, T[0].y);
check('an object counts exactly once', (await fstate()).found.length === 1 && (await page.getByTestId('found-count').textContent()).startsWith('1 of'));
await page.getByTestId('hint').click();
await page.waitForTimeout(600);
const hinted = await page.locator('.target.hinted').getAttribute('data-target');
check('hint points at a genuine remaining target', !!hinted && hinted !== T[0].id && T.some((t) => t.id === hinted) && (await page.locator('.fhint').count()) === 1, hinted);
await shot('find-hint');
// hit testing after zoom + pan
const fb = await stageBox();
await page.mouse.move(fb.x + fb.width * 0.3, fb.y + fb.height * 0.6); await page.mouse.wheel(0, -700); await page.waitForTimeout(80);
await page.mouse.move(fb.x + 200, fb.y + 300); await page.mouse.down(); await page.mouse.move(fb.x + 150, fb.y + 240, { steps: 5 }); await page.mouse.up();
check('panning does not register a guess', (await fstate()).found.length === 1);
const t1 = T[1];
await page.evaluate((t) => window.__find.stage.focus(t.x, t.y, 3), t1); await page.waitForTimeout(600);
await tapWorld(t1.x, t1.y);
check('hit testing is accurate after zooming and panning', (await fstate()).found.includes(t1.id));
// a tap just outside the target at high zoom must miss
const t2 = T[2];
await page.evaluate((t) => window.__find.stage.focus(t.x, t.y, 6), t2); await page.waitForTimeout(600);
const outside = await page.evaluate((t) => window.__find.pointOutside(t.id), t2);
await tapWorld(outside.x, outside.y);
check('a tap beside a target (outside its shape) does not count', !(await fstate()).found.includes(t2.id));
await page.setViewportSize({ width: 900, height: 600 }); await page.waitForTimeout(350);
await tapWorld(t2.x, t2.y);
check('hit testing is accurate after resizing / rotating', (await fstate()).found.includes(t2.id));
await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(350);
await saved();
const fBefore = await fstate();
await page.reload();
await page.waitForFunction(() => window.__find);
check('refresh restores found objects', eq(fBefore, await fstate()), `${fBefore.found.length} found`);
await tapWorld(T[3].x, T[3].y);
check('hit testing is accurate after restoring progress', (await fstate()).found.includes(T[3].id));
await page.getByTestId('reset-view').click(); await page.waitForTimeout(450);
await shot('find-midway');
for (const t of T) if (!(await fstate()).found.includes(t.id)) await tapWorld(t.x, t.y);
await page.getByTestId('completion').waitFor({ timeout: 6000 });
check('finding every target completes the scene', (await fstate()).found.length === T.length);
await shot('find-complete');
await page.getByTestId('completion-close').click();
check('the scene can be reviewed after completion', (await page.locator('.fmark').count()) === T.length);

// ================= SHARED =================
console.log('\n— Shared —');
await open('#/play/garden-puzzle/64');
await page.waitForFunction(() => window.__jigsaw?.assets);
const J2 = await page.evaluate(() => window.__jigsaw.geom.pieces.map((p) => ({ x: p.x, y: p.y })));
Object.assign(J, await page.evaluate(() => ({ pw: window.__jigsaw.geom.pw, ph: window.__jigsaw.geom.ph })), { pieces: J2.map((p, id) => ({ id, ...p })) });
for (const id of [1, 2, 8, 9, 10]) await home(id, 3, 3);
await saved();
const g64 = await jstate();
await open('#/play/library-find/default');
await page.waitForFunction(() => window.__find);
const LT = await page.evaluate(() => window.__find.pointInside(window.__find.targets[0].id));
await tapWorld(LT.x, LT.y);
await saved();
await open('#/');
const cont = page.getByTestId('continue');
check('Home shows Continue playing with the most recent activities', (await cont.locator('[data-activity="library-find"]').count()) === 1 && (await cont.locator('[data-activity="garden-puzzle"]').count()) === 1);
await cont.locator('[data-activity="garden-puzzle"]').click();
await page.waitForFunction(() => window.__jigsaw?.assets && location.hash.includes('garden-puzzle/64'));
check('resuming from Continue playing restores that activity’s state after switching modes', eq(g64, await jstate()));
check('each mode keeps its own progress', await page.evaluate(() => { const p = window.__unwind.getApp().progress; return p['library-find|default'].state.found.length === 1 && p['garden-puzzle|64'].progress > 0 && p['coastal-paint|creative'].progress > 0; }));
check('daily picks are valid activities, one per mode', await (async () => { await open('#/'); return (await page.getByTestId('daily').locator('.card').count()) === 3; })());
// favourites
await open('#/explore');
await page.locator('[data-activity="garden-paint"] .fav').click();
await open('#/gallery?tab=favorites');
check('a favourited activity appears under Favourites', (await page.getByTestId('gallery-favorites').locator('[data-activity="garden-paint"]').count()) === 1);
await page.getByTestId('tab-completed').click();
await page.getByTestId('gallery-completed').waitFor();
check('finished activities appear in My Gallery', (await page.getByTestId('gallery-completed').locator('[data-entry]').count()) === 3);
await shot('gallery-completed');
await page.getByTestId('tab-progress').click();
await page.getByTestId('gallery-progress').waitFor();
check('in-progress activities are listed for resuming', (await page.getByTestId('gallery-progress').locator('.card').count()) >= 3);
// search + filters
await open('#/explore?mode=find');
{
  const all = await page.getByTestId('results').locator('.card').count();
  const finds = await page.getByTestId('results').locator('.card[data-mode="find"]').count();
  check('Explore filters by activity type', all >= 15 && finds === all, `${all} scenes`);
}
await page.getByLabel('Search activities').fill('Collector');
check('Explore search narrows results', (await page.getByTestId('results').locator('.card').count()) === 1);
// replay keeps the gallery entry, asks before discarding active progress
await open('#/activity/garden-puzzle');
await page.locator('[data-variant="64"]').click();
await page.getByTestId('restart').click();
check('resetting active progress asks for confirmation first', (await page.getByTestId('confirm').count()) === 1);
await page.keyboard.press('Escape');
check('cancelling keeps the progress', await page.evaluate(() => window.__unwind.getApp().progress['garden-puzzle|64'].progress > 0));
await open('#/activity/coastal-puzzle');
await page.locator('[data-variant="36"]').click();
await page.getByTestId('restart').click();
await page.waitForFunction(() => window.__jigsaw?.assets);
check('replaying a finished activity starts fresh but keeps its gallery entry', (await jstate()).tray.length === 32 && await page.evaluate(() => window.__unwind.getApp().gallery.some((g) => g.id === 'coastal-puzzle|36')));
// corrupted save is handled gracefully
await saved();
await page.evaluate(() => new Promise((res) => { const r = indexedDB.open('unwind-studio'); r.onsuccess = () => { const t = r.result.transaction('kv', 'readwrite'); const st = t.objectStore('kv'); const k = 'v1/progress/garden-puzzle|64'; const g = st.get(k); g.onsuccess = () => { const v = g.result; v.state = { v: 1, garbage: true }; st.put(v, k); }; t.oncomplete = res; }; }));
await open('#/play/garden-puzzle/64');
await page.reload();
await page.waitForFunction(() => window.__jigsaw?.assets);
check('a corrupted save is discarded gracefully and the activity starts fresh', (await jstate()).tray.length === 60 && (await page.locator('.notice').count()) === 1);

// in-game "Play again" after finishing
await open('#/play/coastal-find/default');
await page.waitForFunction(() => window.__find);
await page.getByText('Play again').first().click();
await page.getByTestId('confirm').click();
await page.waitForTimeout(400);
check('Play again inside an activity starts fresh and keeps the gallery entry', (await fstate()).found.length === 0 && await page.evaluate(() => window.__unwind.getApp().gallery.some((g) => g.id === 'coastal-find|default')));
await page.goto(BASE + '#/'); await page.waitForTimeout(300); await saved();
check('the fresh game is what gets saved', await page.evaluate(() => { const p = window.__unwind.getApp().progress['coastal-find|default']; return !p || p.state.found.length === 0; }));

// ---- touch input (emulated phone, real touch events) ----
{
  const tctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const tp = await tctx.newPage();
  tp.on('pageerror', (e) => errors.push('pageerror(touch): ' + e.message));
  const cdp = await tctx.newCDPSession(tp);
  const touch = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map((p, i) => ({ x: p.x, y: p.y, id: i })) });
  const topen = async (hash) => { await tp.goto(BASE + hash); await tp.waitForFunction(() => window.__unwind?.getApp().ready); await tp.waitForTimeout(500); await dismissTutorial(tp); };
  const tpage = async (key, x, y) => { const v = await tp.evaluate((k) => window[k].stage.view, key); const b = await tp.getByTestId('stage').boundingBox(); return { x: b.x + x * v.s + v.x, y: b.y + y * v.s + v.y }; };
  await topen('#/play/library-puzzle/36');
  await tp.waitForFunction(() => window.__jigsaw?.assets);
  const g = await tp.evaluate(() => ({ pw: window.__jigsaw.geom.pw, ph: window.__jigsaw.geom.ph, tray: window.__jigsaw.st.tray.slice(0, 3), pieces: window.__jigsaw.geom.pieces.map((p) => ({ x: p.x, y: p.y })) }));
  // swipe sideways on the tray: scrolls, takes no piece
  const scroller = tp.locator('.jtray-scroll');
  const sb2 = await scroller.boundingBox();
  await touch('touchStart', [{ x: sb2.x + 300, y: sb2.y + 50 }]);
  for (let i = 1; i <= 8; i++) await touch('touchMove', [{ x: sb2.x + 300 - i * 25, y: sb2.y + 50 }]);
  await touch('touchEnd', []);
  await tp.waitForTimeout(300);
  check('touch: swiping the tray sideways scrolls it without lifting a piece', (await tp.evaluate(() => window.__jigsaw.st.tray.length)) === 32 && (await scroller.evaluate((e) => e.scrollLeft)) > 40);
  await scroller.evaluate((e) => { e.scrollLeft = 0; });
  await tp.waitForTimeout(150);
  // drag a piece up out of the tray to its place (the piece rides 44px above the finger)
  const id = g.tray[0];
  const pb = await tp.locator(`[data-piece="${id}"]`).boundingBox();
  const from = { x: pb.x + pb.width / 2, y: pb.y + pb.height / 2 };
  const dest = await tpage('__jigsaw', g.pieces[id].x + g.pw / 2, g.pieces[id].y + g.ph / 2);
  const to = { x: dest.x, y: dest.y + 44 };
  await touch('touchStart', [from]);
  // lift straight up first (as the tutorial describes), then carry it across
  for (let i = 1; i <= 4; i++) await touch('touchMove', [{ x: from.x, y: from.y - i * 20 }]);
  const mid = { x: from.x, y: from.y - 80 };
  for (let i = 1; i <= 10; i++) await touch('touchMove', [{ x: mid.x + ((to.x - mid.x) * i) / 10, y: mid.y + ((to.y - mid.y) * i) / 10 }]);
  await touch('touchEnd', []);
  await tp.waitForTimeout(200);
  check('touch: dragging a piece up from the tray places and locks it', await tp.evaluate((pid) => window.__jigsaw.st.groups.some((gr) => gr.locked && gr.pieces.includes(pid)), id));
  // a quick tap on a tray piece sets it down on the table
  const tapId = await tp.evaluate(() => window.__jigsaw.st.tray[0]);
  const tb = await tp.locator(`[data-piece="${tapId}"]`).boundingBox();
  await tp.touchscreen.tap(tb.x + tb.width / 2, tb.y + tb.height / 2);
  await tp.waitForTimeout(200);
  check('touch: tapping a tray piece sets it on the table', await tp.evaluate((pid) => !window.__jigsaw.st.tray.includes(pid) && window.__jigsaw.st.groups.some((g) => g.pieces.includes(pid) && !g.locked), tapId));
  // pinch on a find scene: zooms, registers no guess
  await topen('#/play/library-find/default');
  await tp.waitForFunction(() => window.__find);
  const before = await tp.evaluate(() => ({ z: window.__find.stage.zoom, found: window.__find.state.found.length }));
  const fbx = await tp.getByTestId('stage').boundingBox();
  const cx = fbx.x + fbx.width / 2, cy = fbx.y + fbx.height / 2;
  await touch('touchStart', [{ x: cx - 30, y: cy }, { x: cx + 30, y: cy }]);
  for (let i = 1; i <= 8; i++) await touch('touchMove', [{ x: cx - 30 - i * 12, y: cy }, { x: cx + 30 + i * 12, y: cy }]);
  await touch('touchEnd', []);
  await tp.waitForTimeout(200);
  const after = await tp.evaluate(() => ({ z: window.__find.stage.zoom, found: window.__find.state.found.length }));
  check('touch: pinching zooms the scene and never counts as a guess', after.z > before.z * 2 && after.found === before.found, `zoom ${before.z.toFixed(2)} → ${after.z.toFixed(2)}`);
  const tgt = await tp.evaluate(() => { const f = window.__find; const t = f.targets.find((x) => !f.state.found.includes(x.id)); f.stage.focus(f.pointInside(t.id).x, f.pointInside(t.id).y, 3); return { id: t.id, ...f.pointInside(t.id) }; });
  await tp.waitForTimeout(600);
  const tpt = await tpage('__find', tgt.x, tgt.y);
  await tp.touchscreen.tap(tpt.x, tpt.y);
  await tp.waitForTimeout(150);
  check('touch: tapping a target after pinch-zoom finds it', await tp.evaluate((tid) => window.__find.state.found.includes(tid), tgt.id));
  await tctx.close();
}

// layouts
for (const [name, w, h] of [['phone', 390, 844], ['tablet', 820, 1180], ['desktop', 1440, 900]]) {
  await page.setViewportSize({ width: w, height: h });
  for (const [n, hash] of [['home', '#/'], ['explore', '#/explore'], ['detail', '#/activity/library-puzzle'], ['settings', '#/settings'], ['play-paint', '#/play/garden-paint/pbn'], ['play-find', '#/play/garden-find/default'], ['play-puzzle', '#/play/library-puzzle/100']]) {
    await open(hash);
    await page.waitForTimeout(700);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 1) check(`${name} ${n}: no horizontal overflow`, false, `${overflow}px`);
    await shot(`layout-${name}-${n}`);
  }
}
check('phone, tablet and desktop layouts render without horizontal overflow', true);
await page.setViewportSize({ width: 390, height: 844 });

// highest difficulty stays responsive
await open('#/play/library-puzzle/196');
await page.waitForFunction(() => window.__jigsaw?.assets, null, { timeout: 20000 });
const perf = await page.evaluate(() => new Promise((res) => {
  const { stage } = window.__jigsaw; let n = 0; const t0 = performance.now();
  const f = () => { stage.set({ ...stage.view, x: stage.view.x + (n % 2 ? 3 : -3) }); if (++n < 60) requestAnimationFrame(f); else res((performance.now() - t0) / 60); };
  requestAnimationFrame(f);
}));
check('196-piece puzzle redraws smoothly while panning', perf < 34, `${perf.toFixed(1)} ms/frame`);

// offline
if ((await page.evaluate(() => 'serviceWorker' in navigator)) && !BASE.includes(':5199')) {
  await open('#/settings');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => navigator.serviceWorker.controller, null, { timeout: 8000 }).catch(() => {});
  await page.reload(); await page.waitForTimeout(800);
  await ctx.setOffline(true);
  await open('#/play/garden-find/default');
  await page.waitForFunction(() => window.__find, null, { timeout: 8000 });
  const gt = await page.evaluate(() => window.__find.pointInside(window.__find.targets[0].id));
  await tapWorld(gt.x, gt.y);
  check('cached activities are playable offline', (await fstate()).found.length === 1);
  await open('#/play/garden-puzzle/36');
  await page.waitForFunction(() => window.__jigsaw?.assets, null, { timeout: 10000 });
  check('artwork loads offline from the cache', true);
  await open('#/settings');
  check('Settings reports offline readiness', (await page.getByTestId('offline-status').textContent()) === 'Ready');
  await ctx.setOffline(false);
} else console.log('SKIP  offline checks (need the production build with its service worker)');

check('no console errors or broken navigation during the run', errors.length === 0, errors.slice(0, 5).join(' | '));

await browser.close();
server?.kill();
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);

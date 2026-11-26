import { circle, curve, ellipse, line, petal, poly, rect, xf } from '../../art/kit';
import type { Pt } from '../../art/geometry';
import type { PaintActivity } from '../types';
import { W, H, band, canvas, edged, leafPair, lobed, polar, puff, soft } from './props-paint';

const c = canvas();
const { R, D } = c;

// ---------------------------------------------------------------- summer sky
R('sky', rect(0, 0, W, H), 'sky');
R('sky-haze', edged([[0, 380], [300, 368], [640, 384], [1000, 370]], [[1000, 1250], [0, 1250]]), 'haze');
R('sun', circle(170, 160, 74), 'sun');
R('cloud-1', puff(560, 130, 120, 40, 6, 0, true), 'cloud');
R('cloud-2', puff(880, 250, 90, 30, 5, 20, true), 'cloud');
R('swallow', poly([[588, 286], [612, 270], [634, 278], [648, 290], [664, 272], [692, 262], [672, 286], [652, 304], [640, 306], [624, 290], [608, 284]]), 'roof');

// ---------------------------------------------------------------- far hill with a red barn
R('hill', edged([[0, 560], [180, 540], [420, 556], [640, 520], [820, 500], [1000, 520]], [[1000, 1250], [0, 1250]]), 'hill');
R('barn-tree', soft([[920, 520], [904, 470], [920, 430], [956, 420], [986, 440], [994, 490], [980, 520]]), 'leafDark');
R('silo', rect(862, 430, 44, 100), 'cloud');
R('silo-dome', soft([[860, 432], [866, 410], [884, 400], [902, 410], [908, 432]]), 'roof');
R('barn-wall', poly([[700, 480], [740, 446], [780, 446], [820, 480], [820, 540], [700, 540]]), 'barn');
R('barn-roof', poly([[690, 484], [732, 438], [788, 438], [830, 484], [820, 490], [782, 450], [738, 450], [700, 490]]), 'roof');
R('barn-loft', rect(750, 458, 20, 18), 'cloud');
R('barn-door', rect(734, 494, 52, 46), 'barnDark');
R('barn-lean-to', poly([[820, 504], [866, 516], [866, 540], [820, 540]]), 'barnDark');

// ---------------------------------------------------------------- distant sunflower rows
R('field-far', edged([[0, 594], [250, 580], [520, 596], [780, 570], [1000, 584]], [[1000, 1250], [0, 1250]]), 'petal');
R('field-band', edged([[0, 660], [300, 648], [600, 664], [1000, 650]], [[1000, 1250], [0, 1250]]), 'field');
{
  let dots = '';
  for (let row = 0; row < 4; row++) {
    const y0 = 600 + row * 14;
    for (let x = 12 + (row % 2) * 14; x < W; x += 28) {
      const y = y0 + Math.sin(x / 90) * 6 + 2;
      if (Math.hypot(x - 740, y - 640) < 150 || (x > 320 && x < 372)) continue;
      dots += circle(x, y, 3 + row * 0.6);
    }
  }
  D(dots, '#9a6a2c', 2, 0.75);
}

// ---------------------------------------------------------------- mid-field sunflowers
const mids: [number, number, number][] = [[560, 700, 34], [860, 690, 30], [470, 760, 38], [960, 780, 36]];
mids.forEach(([x, y, r], i) => {
  R(`mid-${i + 1}-stem`, band([[x + 4, y + r], [x + 8, y + r + 90]], 10, 12), 'leaf');
  R(`mid-${i + 1}-petals`, lobed(x, y, r, 11, 0.72, i * 9), 'petal');
  R(`mid-${i + 1}-disc`, circle(x, y, r * 0.4), 'seed');
});

// ---------------------------------------------------------------- the three tall sunflowers
function leaf(id: string, at: Pt, len: number, wid: number, rot: number) {
  const [up, dn] = leafPair(len, wid);
  R(`${id}-a`, xf(up, { rot, x: at[0], y: at[1] }), 'leaf');
  R(`${id}-b`, xf(dn, { rot, x: at[0], y: at[1] }), 'leafDark');
  D(xf(curve([[8, 0], [len * 0.5, wid * 0.04], [len - 8, 0]]), { rot, x: at[0], y: at[1] }), '#2a5a2c', 1.6, 0.7);
}
function sunflower(id: string, cx: number, cy: number, r: number, n: number, rot: number, stem: Pt[], stemW: number) {
  R(`${id}-stem`, band(stem, stemW, stemW * 0.7), 'leaf');
  const len = r * 1.2;
  R(`${id}-back`, lobed(cx, cy, r + len * 0.92, n, (r + len * 0.25) / (r + len * 0.92), rot + 180 / n), 'petalDeep');
  for (let i = 0; i < n; i++) {
    const a = rot + (i * 360) / n;
    const s = polar(cx, cy, r * 0.82, a);
    R(`${id}-petal-${i + 1}`, petal(s[0], s[1], len, (Math.PI * r) / n * 0.92, a), 'petal');
  }
  R(`${id}-disc`, circle(cx, cy, r), 'seed');
  R(`${id}-centre`, circle(cx + r * 0.06, cy + r * 0.06, r * 0.56), 'seedDark');
  // seed spiral dots
  let dots = '';
  for (let k = 1; k < 80; k++) {
    const rr = Math.sqrt(k / 80) * r * 0.92, a = k * 137.5;
    if (rr < r * 0.6 || rr > r * 0.92) continue;
    const p = polar(cx, cy, rr, a);
    dots += line([p, [p[0] + 1.4, p[1] + 1.4]]);
  }
  D(dots, '#f2b04a', 2.6, 0.75);
}

sunflower('flower-tall', 330, 400, 82, 12, -90, [[400, 1250], [380, 1000], [352, 720], [334, 480]], 30);
leaf('flower-tall-leaf-1', [370, 900], 190, 58, -20);
leaf('flower-tall-leaf-2', [362, 760], 170, 52, 200);
sunflower('flower-right', 740, 640, 66, 12, -80, [[700, 1250], [716, 1020], [736, 820], [740, 700]], 26);
leaf('flower-right-leaf-1', [714, 1010], 170, 52, 195);
leaf('flower-right-leaf-2', [730, 860], 150, 46, -30);
sunflower('flower-low', 150, 870, 58, 11, -95, [[120, 1250], [132, 1100], [146, 930]], 22);
leaf('flower-low-leaf', [134, 1090], 150, 44, -36);

// ---------------------------------------------------------------- a bumblebee
{
  const t = { x: 556, y: 330, rot: -14 };
  R('bee-wing-back', xf(ellipse(6, -26, 16, 24, 20), t), 'haze');
  R('bee-body', xf(ellipse(0, 0, 36, 24), t), 'petal');
  R('bee-stripe-1', xf(poly([[-8, -23], [6, -22], [6, 22], [-8, 23]]), t), 'seedDark');
  R('bee-stripe-2', xf(poly([[16, -18], [27, -14], [27, 14], [16, 18]]), t), 'seedDark');
  R('bee-head', xf(circle(-38, 2, 16), t), 'seedDark');
  R('bee-wing-front', xf(ellipse(-4, -30, 15, 26, -18), t), 'cloud');
  D(xf(curve([[-46, -12], [-56, -30], [-50, -38]]) + curve([[-38, -14], [-42, -34], [-34, -40]]), t), '#3d2519', 2);
  D(curve([[598, 360], [640, 380], [660, 350], [700, 360], [720, 340]]), '#7a6a50', 1.6, 0.6);
}

// ---------------------------------------------------------------- foreground grass
R('grass-front', edged([[0, 1150], [240, 1130], [520, 1160], [800, 1132], [1000, 1150]], [[1000, 1250], [0, 1250]]), 'leafDark');
{
  let blades = '';
  for (let x = 20; x < W; x += 46) blades += curve([[x, 1250], [x + 6, 1196], [x + 16, 1160]]);
  D(blades, '#6fae55', 2.4, 0.8);
}
D(line([[734, 494], [786, 540]]) + line([[786, 494], [734, 540]]) + line([[760, 458], [760, 476]]), '#f6efe0', 2.4);

const activity: PaintActivity = {
  id: 'seasons-paint-3', version: 1, mode: 'paint', title: 'Sunflower Field',
  blurb: 'Tall sunflowers turn their faces to a bright summer sky while a bumblebee drifts by and a red barn naps on the far hill.',
  added: '2026-11-25', collectionId: 'seasons', categories: ["Seasons"], difficulty: 'Moderate',
  season: { from: '06-01', to: '08-31', label: 'summer' },
  width: W, height: H,
  palette: [
    { id: 'sky', number: 1, name: 'Summer blue', hex: '#86c5e6' },
    { id: 'haze', number: 2, name: 'Pale haze', hex: '#cfe9f3' },
    { id: 'cloud', number: 3, name: 'Cloud white', hex: '#fffaf0' },
    { id: 'sun', number: 4, name: 'Sunshine', hex: '#ffe797' },
    { id: 'hill', number: 5, name: 'Far hills', hex: '#b7d16f' },
    { id: 'field', number: 6, name: 'Field green', hex: '#86b55a' },
    { id: 'leaf', number: 7, name: 'Leaf green', hex: '#4f8f3e' },
    { id: 'leafDark', number: 8, name: 'Deep green', hex: '#2f6531' },
    { id: 'petal', number: 9, name: 'Sunflower yellow', hex: '#ffcb35' },
    { id: 'petalDeep', number: 10, name: 'Marigold', hex: '#f0951f' },
    { id: 'seed', number: 11, name: 'Seed brown', hex: '#7a4826' },
    { id: 'seedDark', number: 12, name: 'Dark chocolate', hex: '#3d2519' },
    { id: 'barn', number: 13, name: 'Barn red', hex: '#c4442f' },
    { id: 'barnDark', number: 14, name: 'Brick shadow', hex: '#84291f' },
    { id: 'roof', number: 15, name: 'Slate', hex: '#5d6072' },
  ],
  regions: c.regions,
  detail: c.detail,
};
export default activity;

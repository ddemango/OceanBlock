import { rect, ellipse, circle, poly, line, star, sh, stroke, place, shade, linearGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  C, CANDY, ol, shadow, stripes, polka, boards, shelf, scallop, bunting, streamer, confetti, plant, lollipop, wrapped,
  cupcake, birthdayCake, cakeSlice, lemonadePitcher, lemonadeGlass, balloon, starBalloon, partyHat, present, pinata, partyBlower, partyPopper, paperCrown, camera, partyCat,
  popcornBox, toyRocket, paperCup, plate, giftBag, chair, type Pt,
} from './props-find';

const ID = 'sweets-find-3';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };
const at = (s: Shape[], x: number, y: number, k = 1, rot = 0) => place(s, { x, y, s: k, rot });

const defs = linearGradient(`${ID}-sky`, [[0, '#a8dcf2'], [1, '#eaf7ee']]);
const PARTY = [C.hot, C.lemon, C.teal, C.orange, C.purple, C.sky];

// =====================================================================
// wall and ceiling
// =====================================================================
scene(polka(0, 40, W, 860, 62, '#bfe6ee', '#ffffff', 9, '#fbd3dc'));
scene(sh(rect(0, 0, W, 48), C.purple), sh(rect(0, 40, W, 8), shade(C.purple, -0.25)));
scene(ol(rect(0, 866, W, 36), C.white, 1.2, -0.2), sh(rect(0, 866, W, 6), '#ffffff'));

// window with curtains
{
  const x0 = 76, y0 = 196, w = 260, h = 340;
  scene(sh(rect(x0, y0, w, h), `url(#${ID}-sky)`), sh(ellipse(x0 + 70, y0 + 80, 44, 14) + ellipse(x0 + 100, y0 + 70, 30, 14) + ellipse(x0 + 200, y0 + 130, 36, 12), '#ffffff', { opacity: 0.9 }));
  scene(sh(rect(x0, y0 + h - 70, w, 70), '#9fd68a'), sh(rect(x0, y0 + h - 70, w, 8), '#b7e3a0'), sh(rect(x0 + 186, y0 + 190, 12, 110), '#8a5a3a'), sh(circle(x0 + 192, y0 + 170, 46) + circle(x0 + 160, y0 + 200, 30) + circle(x0 + 224, y0 + 204, 30), '#6fb86a'), sh(circle(x0 + 176, y0 + 160, 6) + circle(x0 + 210, y0 + 186, 6) + circle(x0 + 190, y0 + 206, 6), C.red));
  scene(ol(rect(x0 - 14, y0 - 14, w + 28, 14) + rect(x0 - 14, y0, 14, h) + rect(x0 + w, y0, 14, h) + rect(x0 - 14, y0 + h, w + 28, 14), C.white, 1.2, -0.22), sh(rect(x0 + w / 2 - 4, y0, 8, h) + rect(x0, y0 + h / 2 - 4, w, 8), C.white, { stroke: '#cfc8c0', strokeWidth: 1 }));
  const curtain = (k: number) => { const bx = k < 0 ? x0 - 24 : x0 + w + 24; return [ol(poly([[bx, y0 - 24], [bx - k * 90, y0 - 24], [bx - k * 70, y0 + 150], [bx - k * 30, y0 + 260], [bx - k * 50, y0 + h + 30], [bx, y0 + h + 30]]), C.lemon, 1.2, -0.25), stroke(line([[bx - k * 30, y0 - 20], [bx - k * 24, y0 + h + 26]]) + line([[bx - k * 60, y0 - 20], [bx - k * 46, y0 + 190]]), shade(C.lemon, -0.18), 2), ol(rect(Math.min(bx, bx - k * 44), y0 + 246, 44, 14, 4), C.hot, 1)]; };
  scene(curtain(-1), curtain(1), ol(rect(x0 - 40, y0 - 34, w + 80, 12, 6), C.woodDk, 1));
}

// shelf on the right wall
scene(shelf(880, 580, 300, 14, C.white), sh(poly([[900, 594], [920, 594], [900, 628]]) + poly([[1140, 594], [1160, 594], [1160, 628]]), '#d8d0c8'));
target('camera', 'Camera', at(camera(84), 936, 580));
scene(ol(rect(996, 520, 16, 60, 2), C.hot, 1), ol(rect(1012, 510, 14, 70, 2), C.teal, 1), ol(rect(1026, 526, 18, 54, 2), C.lemon, 1), ol(rect(1044, 516, 13, 64, 2), C.purple, 1));
target('toy-rocket', 'Toy rocket', at(toyRocket(116), 1100, 580));
scene(at(plant(90, C.hot, 6), 1158, 580, 0.8));

// hanging streamers and bunting
([[60, C.hot], [380, C.teal], [520, C.lemon], [700, C.hot], [1010, C.orange], [1150, C.teal]] as [number, string][]).forEach(([x, c], i) => {
  const pts: Pt[] = [[x, 48]];
  for (let k = 1; k <= 4 + (i % 2); k++) pts.push([x + (k % 2 ? 16 : -16), 48 + k * 36]);
  scene(streamer(pts, c, 10));
});
scene(bunting([[0, 80], [400, 92], [800, 92], [1200, 80]], 46, 50, PARTY, 44));

// piñata on a rope
scene(stroke(line([[850, 48], [850, 262]]), C.woodDk, 3));
target('pinata', 'Piñata', at(pinata(210), 850, 310));

// balloons tied to the chairs
{
  const tie = (bx: number, by: number, r: number, col: string, tx: number, ty: number) => scene(at(balloon(r, col, ty - by - r * 1.2, tx - bx), bx, by));
  tie(396, 250, 46, C.hot, 262, 668); tie(470, 180, 50, C.lemon, 262, 668); tie(430, 330, 42, C.teal, 262, 668);
  tie(1050, 190, 46, C.sky, 940, 668); tie(1130, 280, 50, C.orange, 940, 668); tie(1040, 320, 40, C.hot, 940, 668);
  scene(stroke(line([[520, 300], [596, 668]]), '#8d8078', 1.3));
  target('star-balloon', 'Star balloon', at(starBalloon(52, '#f2c84b', 0, 0), 520, 262, 1, 8));
  tie(604, 190, 44, C.purple, 600, 668);
}

// =====================================================================
// floor, chairs and the party table
// =====================================================================
scene(boards(902, H, W, ['#d9a56a', '#cf9a5e', '#e0b078', '#c89052'], 9, 24));
scene(sh(rect(0, 902, W, 12), '#000000', { opacity: 0.14 }));
scene(at(chair(440, C.teal), 262, 1100), at(chair(440, C.hot), 600, 1100), at(chair(440, C.teal), 940, 1100));
// table legs, cloth and top
scene(shadow(600, 1262, 520, 26, 0.16), ol(rect(110, 1070, 26, 190, 4), C.woodDk, 1.2), ol(rect(1064, 1070, 26, 190, 4), C.woodDk, 1.2));
scene(stripes(70, 846, 1060, 226, 53, '#fff6ea', '#f9b8c8'));
scene(sh(rect(70, 846, 1060, 16), '#000000', { opacity: 0.1 }), scallop(70, 1072, 1060, 20, 10, C.white, C.hot));
scene(ol(poly([[100, 796], [1100, 796], [1136, 850], [64, 850]]), '#fffaf2', 1.3, -0.2), stroke(line([[88, 836], [1112, 836]]), C.pink, 3, { opacity: 0.7 }));
scene(confetti(120, 802, 960, 42, 40, PARTY, 6, 5));
// garland and stars pinned to the cloth
scene(bunting([[90, 880], [430, 890], [770, 890], [1110, 880]], 60, 46, [C.teal, C.lemon, C.purple, C.orange, C.sky], 40));
[[180, 1010], [345, 1030], [600, 1040], [855, 1030], [1020, 1010]].forEach(([x, y], i) => scene(ol(star(x, y, 22, 10), [C.lemon, C.teal, C.hot, C.teal, C.lemon][i], 1.2, -0.3), sh(circle(x, y, 4), C.white, { opacity: 0.8 })));

// back row on the table
scene(at(lemonadeGlass(58, C.hot), 110, 822));
target('lemonade', 'Jug of lemonade', at(lemonadePitcher(156), 196, 824));
scene(at(lemonadeGlass(58, C.teal), 290, 826));
// cupcake stand
{
  const cx = 404, y = 826;
  scene(shadow(cx, y, 60, 6), ol(ellipse(cx, y - 4, 40, 7), C.white, 1.1, -0.25), ol(rect(cx - 6, y - 196, 12, 192), C.white, 1.1, -0.25));
  scene(ol(ellipse(cx, y - 40, 96, 13), C.white, 1.2, -0.25), stroke(ellipse(cx, y - 40, 84, 9), C.pink, 2.4));
  [-64, -22, 22, 64].forEach((dx, i) => scene(at(cupcake(48, [C.sky, C.lemon, C.pink, C.mint][i], [C.pink, C.white, C.choc, C.lilac][i], (['sprinkles', 'star', 'sprinkles', 'star'] as const)[i]), cx + dx, y - 42)));
  scene(ol(ellipse(cx, y - 134, 62, 10), C.white, 1.2, -0.25), stroke(ellipse(cx, y - 134, 52, 7), C.pink, 2.4));
  scene(at(cupcake(46, C.lilac, C.lemon, 'sprinkles'), cx - 28, y - 136));
  target('cherry-cupcake', 'Cherry cupcake', at(cupcake(48, C.hot, C.white, 'cherry'), cx + 26, y - 136));
  scene(ol(circle(cx, y - 200, 8), C.hot, 1));
}
// the cake
scene(at(birthdayCake(236), 636, 826));
target('paper-crown', 'Paper crown', at(paperCrown(84), 826, 826));
target('popcorn', 'Box of popcorn', at(popcornBox(116), 908, 824));
scene(at(paperCup(46, C.teal), 968, 818), at(paperCup(46, C.orange), 1090, 816));
target('purple-hat', 'Purple party hat', at(partyHat(104, C.purple, C.lemon, 'bands'), 1034, 824));
// front row on the table
target('party-blower', 'Party blower', at(partyBlower(96), 296, 846, 1, -6));
scene(at(plate(40, C.white, C.teal), 160, 842), at(wrapped(34, C.hot), 150, 838, 1, 20), at(wrapped(34, C.teal), 176, 842, 1, -30));
scene(at(partyHat(70, C.hot, C.white, 'dots'), 500, 846, 1, -62), at(paperCup(40, C.hot), 800, 846));
target('cake-slice', 'Slice of cake', at(cakeSlice(84), 962, 848));
scene(at(plate(36, C.white, C.hot), 1076, 844), at(lollipop(15, [C.orange, C.white], 34), 1060, 846, 1, 70));

// =====================================================================
// foreground
// =====================================================================
scene(sh(ellipse(640, 1420, 430, 78), C.teal), stroke(ellipse(640, 1420, 396, 68), C.cream, 4), stroke(ellipse(640, 1420, 340, 56), C.lemon, 3, { opacity: 0.9 }), stroke(ellipse(640, 1420, 280, 44), C.cream, 2, { opacity: 0.8 }));
scene(confetti(0, 1110, W, 380, 110, PARTY, 12, 7));
// presents on the left
scene(at(giftBag(120, C.orange), 60, 1400), at(present(180, 150, C.teal, C.lemon, 'stripes'), 180, 1470));
target('dotted-present', 'Polka-dot present', at(present(112, 96, C.lemon, C.hot, 'dots'), 170, 1318));
scene(at(present(130, 110, C.hot, C.white), 350, 1490), at(present(74, 60, C.purple, C.lemon), 356, 1378), at(partyHat(84, C.teal, C.white, 'dots'), 470, 1486));
// loose balloons
scene(at(balloon(46, C.orange, 60, 40), 480, 1280, 1, 20), at(balloon(40, C.purple, 50, -30), 1150, 1210, 1, -16));
target('party-cat', 'Cat in a party hat', at(partyCat(150, '#e8a45a', C.teal), 650, 1440));
target('party-popper', 'Party popper', at(partyPopper(150), 818, 1456, 1, 16));
// presents on the right
scene(at(present(160, 130, C.sky, C.red, 'stripes'), 1060, 1480), at(present(96, 80, C.pink, C.teal), 1052, 1348), at(giftBag(104, C.purple, C.lemon), 936, 1484));
scene(at(wrapped(38, C.lemon), 560, 1484, 1, 15), at(wrapped(38, C.hot), 900, 1330, 1, -20), at(lollipop(18, [C.hot, C.white], 44), 770, 1300, 1, 100));
// toy blocks and a curl of streamer on the floor
[[C.red, 0, 0], [C.blue, 46, 4], [C.lemon, 22, -40]].forEach(([c, dx, dy], i) => scene(ol(rect(870 + (dx as number), 1186 + (dy as number), 42, 42, 5), c as string, 1.2, -0.3), sh(star(891 + (dx as number), 1207 + (dy as number), 11, 5), C.white, { opacity: 0.85 }), sh(rect(900 + (dx as number), 1186 + (dy as number), 12, 42, 4), '#000000', { opacity: 0.08 + i * 0 })));
scene(streamer([[230, 1150], [270, 1170], [250, 1200], [300, 1214], [290, 1246]], C.sky, 9), streamer([[740, 1240], [780, 1226], [800, 1252], [840, 1240]], C.hot, 9));
scene(at(wrapped(36, C.purple), 440, 1200, 1, 30), at(wrapped(36, C.orange), 700, 1170, 1, -15), at(paperCup(40, C.sky), 330, 1296, 1, 96));
void H; void CANDY;

const activity: FindActivity = {
  id: 'sweets-find-3', version: 1, mode: 'find', title: 'The Birthday Party', blurb: "Candles are lit, balloons are up and the piñata is waiting: find fourteen party things before the cake is cut.",
  collectionId: 'sweets', categories: ["Food", "Treats"], difficulty: 'Moderate',
  added: '2026-11-26',
  width: W, height: H, defs, items,
};
export default activity;

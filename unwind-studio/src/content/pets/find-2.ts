import { rect, sh, place } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import * as P from './props-find';

const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const at = (s: Shape[], x: number, y: number, k = 1, rot = 0) => place(s, { x, y, s: k, rot });
scene(sh(rect(0, 0, 1200, 1500), '#cfe0c8'));
scene(at(P.frisbee(60, '#c8473a'), 100, 100), at(P.tennisBall(30), 250, 100), at(P.agilityHoop(260), 180, 460), at(P.hurdle(200), 480, 460), at(P.weavePoles(6, 44, 130), 660, 460), at(P.tunnel(260), 1040, 460));
scene(at(P.fountain(360), 240, 960), at(P.coffeeCart(300), 700, 960), at(P.paperCup(70), 960, 960), at(P.lampPost(360), 1060, 960), at(P.parkSign(160), 1100, 760));
scene(at(P.bagStation(200), 100, 1300), at(P.waterStation(200), 240, 1300), P.railing(340, 800, 1300, 110), at(P.backpack(120), 900, 1300), at(P.waterBottle(100), 1000, 1300), at(P.towerBlock(120, 240, '#b8c4d0', 3, 1), 1060, 1300));
const a: FindActivity = {
  id: 'pets-find-2', version: 1, mode: 'find', title: 'Dog Park Saturday', blurb: 'x',
  collectionId: 'pets', categories: ["Animals", "Pets"], difficulty: 'Relaxed',
  added: '2026-11-26',
  width: 1200, height: 1500,
  items: [...items, { id: 'ball', name: 'Ball', target: true, shapes: at(P.tennisBall(30), 600, 1400) }],
};
export default a;

import { rect, sh, place } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import * as P from './props-find';

const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const at = (s: Shape[], x: number, y: number, k = 1, rot = 0) => place(s, { x, y, s: k, rot });
scene(sh(rect(0, 0, 1200, 1500), '#cfe0c8'));
const C = P.PET;
scene(at(P.dog(150, C.golden, { tail: 'plume', collar: C.red, tongue: true }), 120, 200));
scene(at(P.dog(120, C.ginger, { leg: 15, ear: 'point', tail: 'stub', patch: C.white, socks: C.white, muzzle: C.white, collar: C.teal }), 330, 200));
scene(at(P.dog(150, C.white, { spots: 4, tail: 'down', collar: C.red, run: true }), 560, 200));
scene(at(P.dog(140, C.brown, { leg: 12, len: 1.25, ear: 'long', tail: 'up', snout: 1.3 }), 800, 200));
scene(at(P.dog(130, C.white, { pom: true, fluffy: true, ear: 'flop', earCol: C.white }), 1020, 200));
scene(at(P.dog(140, C.white, { saddle: C.brown, ear: 'long', earCol: C.brown, mask: C.brown, tail: 'up', run: true, item: P.frisbee(22, C.red) }), 130, 400));
scene(at(P.dog(140, C.slate, { ear: 'point', tail: 'curl', muzzle: C.white, patch: C.white, socks: C.white }), 360, 400));
scene(at(P.dog(110, C.black, { leg: 16, ear: 'point', beard: true, fluffy: true, tail: 'up', collar: C.red }), 560, 400));
scene(at(P.dog(100, C.tan, { leg: 18, snout: 0.45, tail: 'curl', mask: '#5a4238', muzzle: '#5a4238', ear: 'fold', earCol: '#5a4238', head: 1.15 }), 760, 400));
scene(at(P.dog(160, C.grey, { leg: 42, bodyH: 20, snout: 1.4, ear: 'fold', tail: 'down' }), 1000, 400));
scene(at(P.pup(120, C.golden, { collar: C.red, tongue: true }), 100, 600), at(P.pup(120, C.white, { eyePatch: C.brown, earCol: C.brown, bow: C.red }), 230, 600), at(P.pup(120, C.ginger, { ear: 'point', patch: C.white, blaze: true, collar: C.teal }), 360, 600));
scene(at(P.catSit(120, C.ginger, { pat: 'tabby' }), 500, 600), at(P.catSit(120, C.black, { pat: 'tux', collar: C.red }), 630, 600), at(P.catSit(120, C.white, { pat: 'calico' }), 760, 600), at(P.catSit(120, C.cream, { pat: 'siam' }), 890, 600), at(P.catSit(100, C.grey, { head: 1.25, pat: 'tabby' }), 1020, 600));
scene(at(P.catLoaf(150, C.grey, { pat: 'tabby' }), 110, 760), at(P.catLie(150, C.ginger, { pat: 'tabby' }), 300, 730), at(P.catCurl(140, C.white, { pat: 'calico' }), 490, 760), at(P.catWalk(140, C.black, { pat: 'tux' }), 670, 760), at(P.catPeek(80, C.grey, { pat: 'tabby' }), 830, 760));
scene(at(P.fishBowl(120), 960, 760), at(P.parakeet(90), 1080, 760), at(P.fish(70, '#f08a2a'), 1150, 650));
scene(at(P.fishTank(260, 150, 3), 160, 960), at(P.hamsterCage(200, 150), 440, 960), at(P.hamster(80), 600, 960), at(P.turtle(90), 700, 960));
scene(at(P.birdCageBack(110, 180), 840, 960), at(P.parakeet(70, '#5aa8e0', '#fbf6ec'), 836, 960 - 61), at(P.birdCageFront(110, 180), 840, 960));
scene(at(P.petBed(150, C.red), 1020, 960), at(P.catCurl(96, C.ginger), 1020, 945), at(P.petBedFront(150, C.red), 1020, 960));
scene(at(P.leash(170, C.red), 60, 990), at(P.collar(70, C.blue), 150, 1040), at(P.bone(70), 250, 1040), at(P.foodBag(90, 130, C.teal, 'paw'), 360, 1150), at(P.foodBag(80, 120, C.red, 'fish'), 460, 1150), at(P.foodCan(40, C.mustard), 540, 1150), at(P.petBowl(90, C.red, '#9a6238'), 630, 1150), at(P.treatJar(110), 740, 1150));
scene(at(P.ropeToy(110), 880, 1100), at(P.rubberDuck(70), 1000, 1150), at(P.toyMouse(70), 1100, 1150), at(P.featherWand(130), 60, 1300), at(P.catTree(300), 300, 1480));
scene(at(P.scratchPost(180), 500, 1480), at(P.boxBack(110, 80), 640, 1480), at(P.catPeek(60, C.ginger), 640, 1400), at(P.boxFront(110, 80), 640, 1480), at(P.petCarrier(130), 800, 1480), at(P.till(110), 960, 1480), at(P.shampoo(90), 1070, 1480), at(P.brush(80), 1130, 1400), at(P.dogJumper(80), 1140, 1200), at(P.shopSign(120), 150, 1180), at(P.catPortrait(80, 100, '#e8c8a0'), 60, 1340), at(P.fishBiscuit(50), 1130, 1300));
const a: FindActivity = {
  id: 'pets-find-1', version: 1, mode: 'find', title: 'The Pet Shop', blurb: 'x',
  collectionId: 'pets', categories: ["Animals", "Pets"], difficulty: 'Detailed',
  added: '2026-11-26',
  width: 1200, height: 1500,
  items: [...items, { id: 'ball', name: 'Ball', target: true, shapes: P.tennisBall(30).map((p) => ({ ...p })) }],
};
export default a;

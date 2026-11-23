// Level layouts. Every block is { type, x, y, z, ry } where y is the block's CENTER.
// Rafts are { x, z, w, d }. Raft deck height is RAFT_TOP.

export const RAFT_TOP = 0.6;
export const RAFT_Z = -12;

export const BLOCKS = {
  crate:     { shape: 'box', w: 1.2, h: 1.2, d: 1.2, mass: 1.6 },
  tallCrate: { shape: 'box', w: 1.2, h: 2.4, d: 1.2, mass: 3.0 },
  drum:      { shape: 'cyl', r: 0.55, h: 1.15, mass: 1.4 },
  tallDrum:  { shape: 'cyl', r: 0.55, h: 2.3, mass: 2.6 },
  plank:     { shape: 'box', w: 2.5, h: 0.5, d: 1.2, mass: 1.6 },
  beam:      { shape: 'box', w: 3.7, h: 0.55, d: 1.2, mass: 2.4 },
  wideBeam:  { shape: 'box', w: 6.1, h: 0.55, d: 1.2, mass: 3.6 },
  buoy:      { shape: 'cone', rTop: 0.14, r: 0.55, h: 0.9, mass: 0.6 },
};

// Helper that stacks blocks on top of each other from a base height.
class Builder {
  constructor() {
    this.blocks = [];
    this.rafts = [];
  }
  raft(x, z, w, d = 3.2) {
    this.rafts.push({ x, z: RAFT_Z + z, w, d });
    return this;
  }
  // stack a column; returns height of the top surface
  col(x, z, types, base = RAFT_TOP) {
    let y = base;
    for (const type of types) {
      const h = BLOCKS[type].h;
      this.blocks.push({ type, x, y: y + h / 2, z: RAFT_Z + z, ry: 0 });
      y += h;
    }
    return y;
  }
  put(type, x, y, z = 0, ry = 0) {
    this.blocks.push({ type, x, y: y + BLOCKS[type].h / 2, z: RAFT_Z + z, ry });
    return y + BLOCKS[type].h;
  }
  // pyramid of a single block type, bottom row width n, centered at x
  pyramid(cx, z, n, type = 'crate', gap = 0.02, base = RAFT_TOP) {
    const b = BLOCKS[type];
    const step = (b.w ?? b.r * 2) + gap;
    let y = base;
    for (let row = n; row > 0; row--) {
      const start = cx - ((row - 1) * step) / 2;
      for (let i = 0; i < row; i++) this.put(type, start + i * step, y, z);
      y += b.h;
    }
    return y;
  }
  build(shots) {
    return { rafts: this.rafts, blocks: this.blocks, shots };
  }
}

// ---- structure helpers -------------------------------------------------
const W = (type) => (BLOCKS[type].w ?? BLOCKS[type].r * 2);

// One horizontal row of n blocks centered on cx. Returns the top height.
function row(b, cx, z, n, type, base, gap = 0.03) {
  const step = W(type) + gap;
  const start = cx - ((n - 1) * step) / 2;
  for (let i = 0; i < n; i++) b.put(type, start + i * step, base, z);
  return base + BLOCKS[type].h;
}

// Stepped tower: each tier is [type, count]. Counts should shrink going up.
function tiers(b, cx, z, list, base = RAFT_TOP) {
  let y = base;
  for (const [type, n] of list) y = row(b, cx, z, n, type, y);
  return y;
}

// Two pillars joined by a beam, with a small turret on top.
function gate(b, cx, z, pillarH, base = RAFT_TOP) {
  const span = 1.25;
  let top = 0;
  for (const sx of [-span, span]) {
    const types = [];
    for (let i = 0; i < pillarH; i++) types.push(i % 2 ? 'drum' : 'crate');
    top = Math.max(top, b.col(cx + sx, z, types, base));
  }
  const y = b.put('beam', cx, top, z);
  return tiers(b, cx, z, [['crate', 2], ['buoy', 1]], y);
}

// Tall lighthouse spire.
function spire(b, cx, z, base = RAFT_TOP) {
  return b.col(cx, z, ['tallCrate', 'tallDrum', 'drum', 'buoy'], base);
}

const HAND_MADE = [
  // 1 — mixed pyramid
  () => {
    const b = new Builder().raft(0, 0, 7.8);
    const y = tiers(b, 0, 0, [['crate', 5], ['drum', 4], ['crate', 3], ['drum', 2]]);
    b.put('buoy', 0, y);
    return b.build(14);
  },
  // 2 — harbor gate
  () => {
    const b = new Builder().raft(0, 0, 8.2);
    row(b, 0, 0, 6, 'crate', RAFT_TOP);
    gate(b, 0, 0, 2, RAFT_TOP + 1.2);
    for (const x of [-3, 3]) b.col(x, 0, ['tallDrum', 'buoy'], RAFT_TOP + 1.2);
    return b.build(16);
  },
  // 3 — twin pyramids
  () => {
    const b = new Builder().raft(-3.5, 0, 6.2).raft(3.5, 0, 6.2);
    for (const cx of [-3.5, 3.5]) {
      const y = tiers(b, cx, 0, [['crate', 4], ['drum', 3], ['crate', 2]]);
      b.put('buoy', cx, y);
    }
    return b.build(18);
  },
  // 4 — twin fortresses
  () => {
    const b = new Builder().raft(-3.5, 0, 6.2).raft(3.5, 0, 6.2);
    for (const cx of [-3.5, 3.5]) {
      const y = row(b, cx, 0, 4, 'crate', RAFT_TOP);
      const y2 = row(b, cx, 0, 4, 'drum', y);
      gate(b, cx, 0, 1, y2);
    }
    return b.build(20);
  },
  // 5 — deep double-row wall
  () => {
    const b = new Builder().raft(0, 0, 8.4, 4.2);
    for (const z of [-0.65, 0.65]) tiers(b, 0, z, [['crate', 6], ['drum', 5], ['crate', 4], ['drum', 3]]);
    spire(b, 0, 0, RAFT_TOP + 4.7);
    return b.build(24);
  },
  // 6 — lighthouse twins
  () => {
    const b = new Builder().raft(-3.5, 0, 6.2).raft(3.5, 0, 6.2);
    for (const cx of [-3.5, 3.5]) {
      const y = tiers(b, cx, 0, [['crate', 4], ['crate', 3]]);
      spire(b, cx, 0, y);
      for (const sx of [-2.45, 2.45]) b.col(cx + sx, 0, ['drum', 'buoy'], RAFT_TOP + 1.2);
    }
    return b.build(22);
  },
  // 7 — the great wall (two rafts, two rows deep)
  () => {
    const b = new Builder().raft(-3.5, 0, 6.2, 4.2).raft(3.5, 0, 6.2, 4.2);
    for (const cx of [-3.5, 3.5]) {
      for (const z of [-0.65, 0.65]) tiers(b, cx, z, [['crate', 4], ['drum', 4], ['crate', 3]]);
      b.put('buoy', cx, RAFT_TOP + 3.55, 0);
    }
    return b.build(28);
  },
  // 8 — citadel
  () => {
    const b = new Builder().raft(0, 0, 9, 4.2);
    for (const z of [-0.65, 0.65]) {
      row(b, 0, z, 7, 'crate', RAFT_TOP);
      for (const x of [-3, 3]) b.col(x, z, ['tallCrate'], RAFT_TOP + 1.2);
    }
    gate(b, 0, 0, 3, RAFT_TOP + 1.2);
    for (const x of [-3, 3]) b.put('buoy', x, RAFT_TOP + 3.6, 0);
    return b.build(26);
  },
];

// Seeded random so procedural levels are the same every time.
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// Structures that fit on a 6.2-wide raft (one per raft).
const RAFT_STRUCTURES = [
  (b, cx, r) => { const y = tiers(b, cx, 0, [['crate', 4], [r() < 0.5 ? 'drum' : 'crate', 3], ['drum', 2]]); b.put('buoy', cx, y); },
  (b, cx) => { const y = row(b, cx, 0, 4, 'crate', RAFT_TOP); gate(b, cx, 0, 2, y); },
  (b, cx) => { const y = tiers(b, cx, 0, [['crate', 4], ['crate', 3]]); spire(b, cx, 0, y); },
  (b, cx) => { for (const z of [-0.65, 0.65]) tiers(b, cx, z, [['drum', 5], ['crate', 4], ['drum', 3]]); },
  (b, cx) => {
    const y = row(b, cx, 0, 4, 'drum', RAFT_TOP);
    for (const sx of [-1.28, 1.28]) b.col(cx + sx, 0, ['tallCrate', 'buoy'], y);
    b.col(cx, 0, ['crate', 'crate', 'crate', 'buoy'], y);
  },
];

function procedural(level) {
  const r = rng(level * 7919);
  const b = new Builder();
  const deep = r() < 0.35;
  for (const cx of [-3.5, 3.5]) {
    b.raft(cx, 0, 6.2, deep ? 4.2 : 3.2);
    RAFT_STRUCTURES[Math.floor(r() * RAFT_STRUCTURES.length)](b, cx, r);
  }
  const shots = Math.max(18, Math.min(32, Math.round(b.blocks.length * 0.5) + 4));
  return b.build(shots);
}

export function getLevel(n) {
  if (n <= HAND_MADE.length) return HAND_MADE[n - 1]();
  return procedural(n);
}

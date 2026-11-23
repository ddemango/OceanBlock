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
  // special cargo
  iron:      { shape: 'box', w: 1.2, h: 1.2, d: 1.2, mass: 3.2, hp: 2 }, // needs two hits
  tnt:       { shape: 'cyl', r: 0.55, h: 1.15, mass: 1.4, explosive: true },
  ice:       { shape: 'box', w: 1.2, h: 1.2, d: 1.2, mass: 1.2, fragile: true }, // shatters on any cannonball hit
  balloon:   { shape: 'sphere', r: 0.62, h: 1.24, mass: 0.3, floats: true }, // hovers; pop it with a shot
};

// Helper that stacks blocks on top of each other from a base height.
class Builder {
  constructor() {
    this.blocks = [];
    this.rafts = [];
  }
  raft(x, z, w, d = 3.2, drift = 0, mode = 'side') {
    // drift = amplitude in world units (0 = still); mode = 'side' | 'orbit' (moving platform loop)
    this.rafts.push({ x, z: RAFT_Z + z, w, d, drift, mode, phase: this.rafts.length * 1.7 });
    return this;
  }
  // a balloon tethered at height y above (x, z)
  balloon(x, y, z = 0) {
    this.blocks.push({ type: 'balloon', x, y, z: RAFT_Z + z, ry: 0 });
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
  build(shots, extra = {}) {
    return { rafts: this.rafts, blocks: this.blocks, shots, ...extra };
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
  // 9 — iron foundations
  () => {
    const b = new Builder().raft(0, 0, 8.2);
    const step = W('crate') + 0.03;
    for (let i = 0; i < 6; i++) b.put(i % 2 ? 'crate' : 'iron', (i - 2.5) * step, RAFT_TOP);
    tiers(b, 0, 0, [['drum', 5], ['crate', 4], ['drum', 3], ['crate', 2]], RAFT_TOP + 1.2);
    return b.build(22);
  },
  // 10 — powder kegs
  () => {
    const b = new Builder().raft(-3.5, 0, 6.2).raft(3.5, 0, 6.2);
    for (const cx of [-3.5, 3.5]) {
      const y = row(b, cx, 0, 4, 'crate', RAFT_TOP);
      const step = W('drum') + 0.03;
      for (let i = 0; i < 4; i++) b.put(i === 1 || i === 2 ? 'tnt' : 'drum', cx + (i - 1.5) * step, y);
      tiers(b, cx, 0, [['crate', 3], ['crate', 2], ['buoy', 1]], y + 1.15);
    }
    return b.build(18);
  },
  // 11 — drifting rafts
  () => {
    const b = new Builder().raft(-3.5, 0, 6.2, 3.2, 1.1).raft(3.5, 0, 6.2, 3.2, 1.1);
    for (const cx of [-3.5, 3.5]) {
      const y = tiers(b, cx, 0, [['crate', 4], ['drum', 3], ['crate', 2]]);
      b.put('buoy', cx, y);
    }
    return b.build(22);
  },
  // 12 — the armory: drifting, armored and explosive
  () => {
    const b = new Builder().raft(-3.5, 0, 6.2, 3.2, 0.9).raft(3.5, 0, 6.2, 3.2, 0.9);
    for (const cx of [-3.5, 3.5]) {
      const step = W('crate') + 0.03;
      for (let i = 0; i < 4; i++) b.put(i === 0 || i === 3 ? 'iron' : 'crate', cx + (i - 1.5) * step, RAFT_TOP);
      const y = RAFT_TOP + 1.2;
      const ds = W('drum') + 0.03;
      for (let i = 0; i < 3; i++) b.put(i === 1 ? 'tnt' : 'drum', cx + (i - 1) * ds, y);
      tiers(b, cx, 0, [['crate', 2], ['buoy', 1]], y + 1.15);
    }
    return b.build(24);
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
  // ---------------- Chapter 3+: new cargo ----------------
  // 13 — first ice: frozen pyramid shatters on contact
  () => {
    const b = new Builder().raft(0, 0, 7.8);
    tiers(b, 0, 0, [['ice', 5], ['crate', 4], ['ice', 3], ['crate', 2], ['ice', 1]]);
    return b.build(14);
  },
  // 14 — balloon festival
  () => {
    const b = new Builder().raft(-3.5, 0, 6.2).raft(3.5, 0, 6.2);
    for (const cx of [-3.5, 3.5]) {
      const y = tiers(b, cx, 0, [['crate', 4], ['drum', 3]]);
      b.balloon(cx - 1.2, y + 1.6).balloon(cx + 1.2, y + 1.9).balloon(cx, y + 2.9);
    }
    return b.build(20);
  },
  // 15 — ice wall with powder kegs (storm rolls in)
  () => {
    const b = new Builder().raft(0, 0, 8.4, 4.2);
    for (const z of [-0.65, 0.65]) tiers(b, 0, z, [['ice', 6], ['crate', 5], ['ice', 4]]);
    const ds = W('drum') + 0.03;
    for (let i = 0; i < 3; i++) b.put(i === 1 ? 'tnt' : 'drum', (i - 1) * ds, RAFT_TOP + 3.6, 0);
    return b.build(22, { event: 'storm' });
  },
  // 16 — merry-go-round: rafts loop in a circle
  () => {
    const b = new Builder().raft(-3.5, 0, 6.2, 3.2, 1.0, 'orbit').raft(3.5, 0, 6.2, 3.2, 1.0, 'orbit');
    for (const cx of [-3.5, 3.5]) {
      const y = tiers(b, cx, 0, [['crate', 4], ['ice', 3], ['crate', 2]]);
      b.put('buoy', cx, y);
    }
    return b.build(22);
  },
  // 17 — shark waters
  () => {
    const b = new Builder().raft(-3.5, 0, 6.2).raft(3.5, 0, 6.2);
    for (const cx of [-3.5, 3.5]) {
      const y = row(b, cx, 0, 4, 'crate', RAFT_TOP);
      gate(b, cx, 0, 2, y);
    }
    return b.build(20, { event: 'shark' });
  },
  // 18 — sky lanterns: a sky full of balloons over a low fort
  () => {
    const b = new Builder().raft(0, 0, 8.4);
    tiers(b, 0, 0, [['crate', 6], ['drum', 5], ['crate', 4]]);
    for (let i = 0; i < 6; i++) b.balloon(-3.6 + i * 1.44, RAFT_TOP + 4.6 + (i % 2) * 1.1);
    return b.build(22);
  },
  // 19 — the glacier: tall ice towers
  () => {
    const b = new Builder().raft(-3.5, 0, 6.2).raft(3.5, 0, 6.2);
    for (const cx of [-3.5, 3.5]) {
      for (const sx of [-1.25, 1.25]) b.col(cx + sx, 0, ['ice', 'ice', 'crate', 'ice'], RAFT_TOP);
      b.col(cx, 0, ['drum', 'drum', 'drum', 'drum', 'buoy'], RAFT_TOP);
    }
    return b.build(24);
  },
  // 21 — whirlpool cove
  () => {
    const b = new Builder().raft(-3.5, 0, 6.2).raft(3.5, 0, 6.2);
    for (const cx of [-3.5, 3.5]) {
      const y = tiers(b, cx, 0, [['crate', 4], ['drum', 3], ['crate', 2]]);
      spire(b, cx, 0, y);
    }
    return b.build(28, { event: 'whirlpool' });
  },
  // 22 — iron and ice
  () => {
    const b = new Builder().raft(0, 0, 8.4, 4.2);
    const step = W('crate') + 0.03;
    for (const z of [-0.65, 0.65]) {
      for (let i = 0; i < 6; i++) b.put(i % 2 ? 'ice' : 'iron', (i - 2.5) * step, RAFT_TOP, z);
      tiers(b, 0, z, [['ice', 5], ['crate', 4], ['ice', 3]], RAFT_TOP + 1.2);
    }
    return b.build(28);
  },
  // 23 — floating market: balloons over drifting rafts
  () => {
    const b = new Builder().raft(-3.5, 0, 6.2, 3.2, 1.0).raft(3.5, 0, 6.2, 3.2, 1.0);
    for (const cx of [-3.5, 3.5]) {
      const y = tiers(b, cx, 0, [['drum', 5], ['crate', 4], ['drum', 3]]);
      b.balloon(cx - 1, y + 1.5).balloon(cx + 1, y + 2.2);
    }
    return b.build(24);
  },
  // 24 — chain reaction alley
  () => {
    const b = new Builder().raft(0, 0, 9, 4.2);
    for (const z of [-0.65, 0.65]) {
      const ds = W('drum') + 0.03;
      for (let i = 0; i < 7; i++) b.put(i % 3 === 1 ? 'tnt' : 'drum', (i - 3) * ds, RAFT_TOP, z);
      tiers(b, 0, z, [['crate', 6], ['ice', 5], ['crate', 4]], RAFT_TOP + 1.15);
    }
    return b.build(24, { event: 'storm' });
  },
  // 25 — three islands
  () => {
    const b = new Builder().raft(-4.7, 0, 4.2).raft(0, -1, 4.2).raft(4.7, 0, 4.2);
    for (const [cx, z] of [[-4.7, 0], [0, -1], [4.7, 0]]) {
      const y = tiers(b, cx, z, [['crate', 3], ['ice', 2], ['crate', 1]]);
      b.put('buoy', cx, y, z);
    }
    b.balloon(-2.35, RAFT_TOP + 4.2, -0.5).balloon(2.35, RAFT_TOP + 4.2, -0.5);
    return b.build(22, { event: 'shark' });
  },
  // 26 — orbiting lighthouses
  () => {
    const b = new Builder().raft(-3.5, 0, 6.2, 3.2, 0.9, 'orbit').raft(3.5, 0, 6.2, 3.2, 0.9, 'orbit');
    for (const cx of [-3.5, 3.5]) {
      const y = tiers(b, cx, 0, [['ice', 4], ['crate', 3]]);
      spire(b, cx, 0, y);
    }
    return b.build(22);
  },
  // 27 — frozen citadel
  () => {
    const b = new Builder().raft(0, 0, 9, 4.2);
    for (const z of [-0.65, 0.65]) {
      row(b, 0, z, 7, 'ice', RAFT_TOP);
      for (const x of [-3, 3]) b.col(x, z, ['tallCrate'], RAFT_TOP + 1.2);
    }
    gate(b, 0, 0, 3, RAFT_TOP + 1.2);
    b.balloon(-3, RAFT_TOP + 5.2).balloon(3, RAFT_TOP + 5.2);
    return b.build(28, { event: 'whirlpool' });
  },
  // 28 — powder fleet: explosive rafts that drift
  () => {
    const b = new Builder().raft(-3.5, 0, 6.2, 3.2, 1.1).raft(3.5, 0, 6.2, 3.2, 1.1);
    for (const cx of [-3.5, 3.5]) {
      const ds = W('drum') + 0.03;
      for (let i = 0; i < 4; i++) b.put(i === 0 || i === 3 ? 'tnt' : 'drum', cx + (i - 1.5) * ds, RAFT_TOP);
      tiers(b, cx, 0, [['crate', 4], ['ice', 3], ['crate', 2], ['buoy', 1]], RAFT_TOP + 1.15);
    }
    return b.build(22);
  },
  // 29 — storm front
  () => {
    const b = new Builder().raft(0, 0, 8.4, 4.2);
    for (const z of [-0.65, 0.65]) tiers(b, 0, z, [['crate', 6], ['drum', 5], ['crate', 4], ['drum', 3], ['crate', 2]]);
    for (let i = 0; i < 4; i++) b.balloon(-3 + i * 2, RAFT_TOP + 7);
    return b.build(30, { event: 'storm' });
  },
  // 31 — ice cream stack (tall thin columns)
  () => {
    const b = new Builder().raft(-3.5, 0, 6.2).raft(3.5, 0, 6.2);
    for (const cx of [-3.5, 3.5]) {
      for (const sx of [-1.9, 0, 1.9]) b.col(cx + sx, 0, ['ice', 'crate', 'ice', 'crate', 'ice'], RAFT_TOP);
    }
    return b.build(26, { event: 'shark' });
  },
  // 32 — the carousel: three looping rafts
  () => {
    const b = new Builder().raft(-4.7, 0, 4.2, 3.2, 0.7, 'orbit').raft(0, -1, 4.2, 3.2, 0.7, 'side').raft(4.7, 0, 4.2, 3.2, 0.7, 'orbit');
    for (const [cx, z] of [[-4.7, 0], [0, -1], [4.7, 0]]) {
      const y = tiers(b, cx, z, [['crate', 3], ['drum', 2]]);
      b.col(cx, z, ['tallCrate', 'buoy'], y);
    }
    return b.build(24);
  },
  // 33 — iron vault
  () => {
    const b = new Builder().raft(0, 0, 8.4, 4.2);
    for (const z of [-0.65, 0.65]) {
      row(b, 0, z, 6, 'iron', RAFT_TOP);
      tiers(b, 0, z, [['crate', 5], ['iron', 4], ['crate', 3]], RAFT_TOP + 1.2);
    }
    const ds = W('drum') + 0.03;
    for (let i = 0; i < 2; i++) b.put('tnt', (i - 0.5) * ds, RAFT_TOP + 4.8, 0);
    return b.build(32);
  },
  // 34 — balloon armada
  () => {
    const b = new Builder().raft(-3.5, 0, 6.2, 3.2, 0.8).raft(3.5, 0, 6.2, 3.2, 0.8);
    for (const cx of [-3.5, 3.5]) {
      const y = tiers(b, cx, 0, [['ice', 4], ['crate', 3], ['ice', 2]]);
      for (let i = 0; i < 3; i++) b.balloon(cx - 1.4 + i * 1.4, y + 1.4 + (i % 2) * 1.2);
    }
    return b.build(26, { event: 'storm' });
  },
  // 35 — whirlpool fortress
  () => {
    const b = new Builder().raft(-3.5, 0, 6.2, 4.2).raft(3.5, 0, 6.2, 4.2);
    for (const cx of [-3.5, 3.5]) {
      for (const z of [-0.65, 0.65]) tiers(b, cx, z, [['crate', 4], ['ice', 4], ['drum', 3]]);
      b.put('buoy', cx, RAFT_TOP + 3.55, 0);
    }
    return b.build(30, { event: 'whirlpool' });
  },
  // 36 — the grand finale
  () => {
    const b = new Builder().raft(-4.7, 0, 4.2, 3.6, 0.6, 'orbit').raft(0, -1, 4.6, 4.2).raft(4.7, 0, 4.2, 3.6, 0.6, 'orbit');
    for (const cx of [-4.7, 4.7]) {
      const y = tiers(b, cx, 0, [['ice', 3], ['tnt', 2], ['crate', 1]]);
      b.col(cx, 0, ['tallDrum', 'buoy'], y);
    }
    for (const z of [-0.65, 0.65]) {
      const step = W('crate') + 0.03;
      for (let i = 0; i < 3; i++) b.put(i === 1 ? 'iron' : 'ice', (i - 1) * step, RAFT_TOP, -1 + z);
      tiers(b, 0, -1 + z, [['drum', 3], ['crate', 2]], RAFT_TOP + 1.2);
    }
    spire(b, 0, -1, RAFT_TOP + 3.55);
    b.balloon(-2.35, RAFT_TOP + 5, -0.5).balloon(2.35, RAFT_TOP + 5, -0.5).balloon(0, RAFT_TOP + 9.2, -1);
    return b.build(34, { event: 'shark' });
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
  const drift = r() < 0.45 ? 0.7 + r() * 0.6 : 0;
  const mode = r() < 0.4 ? 'orbit' : 'side';
  for (const cx of [-3.5, 3.5]) {
    b.raft(cx, 0, 6.2, deep ? 4.2 : 3.2, drift, mode);
    RAFT_STRUCTURES[Math.floor(r() * RAFT_STRUCTURES.length)](b, cx, r);
  }
  // sprinkle special cargo: iron in the bottom row, ice crates, explosive barrels among drums
  let top = 0;
  for (const blk of b.blocks) {
    const bottom = Math.abs(blk.y - (RAFT_TOP + BLOCKS[blk.type].h / 2)) < 0.01;
    top = Math.max(top, blk.y + BLOCKS[blk.type].h / 2);
    if (blk.type === 'crate' && bottom && r() < 0.3) blk.type = 'iron';
    else if (blk.type === 'crate' && r() < 0.25) blk.type = 'ice';
    else if (blk.type === 'drum' && r() < 0.2) blk.type = 'tnt';
  }
  if (r() < 0.5) for (const cx of [-3.5, 3.5]) b.balloon(cx + (r() - 0.5) * 2, Math.min(9.5, top + 1.4 + r()));
  const shots = Math.max(18, Math.min(34, Math.round(b.blocks.length * 0.5) + 4));
  const events = [null, 'storm', 'shark', 'whirlpool'];
  return b.build(shots, { event: events[Math.floor(r() * events.length)] });
}

// Every 10th level: a three-raft boss fortress.
function boss(level) {
  const r = rng(level * 104729);
  const b = new Builder().raft(-4.7, 0, 4.2, 3.6, level >= 30 ? 0.5 : 0).raft(0, -1, 4.6, 4.2).raft(4.7, 0, 4.2, 3.6, level >= 30 ? 0.5 : 0);
  // side towers
  for (const cx of [-4.7, 4.7]) {
    const y = tiers(b, cx, 0, [['crate', 3], [level >= 20 ? 'tnt' : 'drum', 2], ['crate', 1]]);
    b.col(cx, 0, ['tallDrum', 'buoy'], y);
  }
  // central keep, two rows deep, with an iron base and a lighthouse
  for (const z of [-0.65, 0.65]) {
    const step = W('crate') + 0.03;
    for (let i = 0; i < 3; i++) b.put(i === 1 || r() < 0.3 ? 'iron' : 'crate', (i - 1) * step, RAFT_TOP, -1 + z);
    tiers(b, 0, -1 + z, [['drum', 3], ['crate', 2]], RAFT_TOP + 1.2);
  }
  spire(b, 0, -1, RAFT_TOP + 3.55);
  const lv = b.build(Math.min(40, 30 + Math.floor(level / 10)));
  lv.boss = true;
  return lv;
}

// Hand-made levels fill every non-boss slot in order (boss every 10th level).
export function getLevel(n) {
  if (n % 10 === 0) return boss(n);
  const idx = n - 1 - Math.floor(n / 10); // skip the boss slots
  if (idx < HAND_MADE.length) {
    const lv = HAND_MADE[idx]();
    if (idx >= 12) lv.shots = Math.round(lv.shots * 1.25); // newer cargo (ice, balloons, events) needs more ammo
    return lv;
  }
  return procedural(n);
}
export const HAND_MADE_COUNT = HAND_MADE.length;

// Daily challenge: one special level per calendar day, the same for everyone.
export function getChallenge(dayNumber) {
  const r = rng(dayNumber * 15485863 + 7);
  const b = new Builder();
  const three = r() < 0.5;
  const xs = three ? [-4.7, 0, 4.7] : [-3.5, 3.5];
  const mode = r() < 0.5 ? 'orbit' : 'side';
  const drift = r() < 0.6 ? 0.6 + r() * 0.4 : 0;
  for (const cx of xs) {
    b.raft(cx, 0, three ? 4.2 : 6.2, 3.2, drift, mode);
    if (three) {
      const y = tiers(b, cx, 0, [['crate', 3], [r() < 0.5 ? 'drum' : 'ice', 2], ['crate', 1]]);
      b.put('buoy', cx, y);
    } else RAFT_STRUCTURES[Math.floor(r() * RAFT_STRUCTURES.length)](b, cx, r);
  }
  let top = 0;
  for (const blk of b.blocks) {
    top = Math.max(top, blk.y + BLOCKS[blk.type].h / 2);
    const bottom = Math.abs(blk.y - (RAFT_TOP + BLOCKS[blk.type].h / 2)) < 0.01;
    if (blk.type === 'crate' && bottom && r() < 0.25) blk.type = 'iron';
    else if (blk.type === 'crate' && r() < 0.3) blk.type = 'ice';
    else if (blk.type === 'drum' && r() < 0.3) blk.type = 'tnt';
  }
  for (const cx of xs) b.balloon(cx + (r() - 0.5) * 1.5, Math.min(9.5, top + 1.3 + r()));
  const events = ['storm', 'shark', 'whirlpool'];
  return b.build(Math.max(20, Math.round(b.blocks.length * 0.55) + 4), { event: events[Math.floor(r() * 3)], challenge: true, theme: ['day', 'sunset', 'night'][Math.floor(r() * 3)] });
}

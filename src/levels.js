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

const HAND_MADE = [
  // 1 — a friendly crate pyramid
  () => {
    const b = new Builder().raft(0, 0, 6.4);
    b.pyramid(0, 0, 4);
    return b.build(15);
  },
  // 2 — drum towers with a beam bridge
  () => {
    const b = new Builder().raft(0, 0, 6.4);
    const top = Math.max(b.col(-1.4, 0, ['drum', 'drum']), b.col(1.4, 0, ['drum', 'drum']));
    const y = b.put('beam', 0, top);
    b.col(-0.62, 0, ['crate'], y);
    b.col(0.62, 0, ['crate'], y);
    b.put('buoy', 0, y + 1.2);
    return b.build(18);
  },
  // 3 — lighthouse fort: tall drum spires + crate keep
  () => {
    const b = new Builder().raft(0, 0, 7.4);
    for (const x of [-2.7, 2.7]) b.col(x, 0, ['tallCrate', 'buoy']);
    for (const x of [-1.5, 1.5]) b.col(x, 0, ['tallDrum', 'tallDrum', 'buoy']);
    b.col(0, 0, ['crate', 'crate', 'drum', 'tallDrum', 'buoy']);
    return b.build(26);
  },
  // 4 — twin rafts
  () => {
    const b = new Builder().raft(-4, 0, 5.2).raft(4, 0, 5.2);
    for (const cx of [-4, 4]) {
      const top = b.pyramid(cx, 0, 3, 'drum', 0.06);
      b.put('buoy', cx, top);
    }
    return b.build(22);
  },
  // 5 — deep stack, two rows
  () => {
    const b = new Builder().raft(0, 0, 6.4, 4.2);
    for (const z of [-0.65, 0.65]) b.pyramid(0, z, 4, 'crate');
    return b.build(24);
  },
  // 6 — the gate
  () => {
    const b = new Builder().raft(0, 0, 7.6);
    const h = Math.max(b.col(-2.6, 0, ['tallCrate', 'crate']), b.col(2.6, 0, ['tallCrate', 'crate']));
    b.col(-1.3, 0, ['drum', 'drum', 'drum']);
    b.col(1.3, 0, ['drum', 'drum', 'drum']);
    b.col(0, 0, ['crate', 'crate', 'crate']);
    const y = b.put('wideBeam', 0, h);
    for (const x of [-2.4, -1.2, 0, 1.2, 2.4]) b.put(x % 2.4 === 0 ? 'buoy' : 'drum', x, y);
    return b.build(28);
  },
  // 7 — twin towers on twin rafts
  () => {
    const b = new Builder().raft(-4.2, 0, 5.4).raft(4.2, 0, 5.4);
    for (const cx of [-4.2, 4.2]) {
      b.col(cx - 1.95, 0, ['tallDrum', 'buoy']);
      b.col(cx + 1.95, 0, ['tallDrum', 'buoy']);
      const t = Math.max(b.col(cx - 0.62, 0, ['drum', 'drum']), b.col(cx + 0.62, 0, ['drum', 'drum']));
      const y = b.put('plank', cx, t);
      b.col(cx, 0, ['crate', 'crate', 'buoy'], y);
    }
    return b.build(30);
  },
  // 8 — big harbor citadel
  () => {
    const b = new Builder().raft(0, 0, 8.2, 4.2);
    for (const z of [-0.65, 0.65]) {
      b.col(-3.3, z, ['tallCrate']);
      b.col(3.3, z, ['tallCrate']);
      b.pyramid(0, z, 4, 'crate');
    }
    b.col(-3.3, 0, ['buoy'], RAFT_TOP + 2.4);
    b.col(3.3, 0, ['buoy'], RAFT_TOP + 2.4);
    b.col(0, 0, ['tallDrum', 'buoy'], RAFT_TOP + 4.8);
    return b.build(32);
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

const MODULES = [
  (b, cx, r) => b.pyramid(cx, 0, 2, r() < 0.5 ? 'crate' : 'drum', 0.06),
  (b, cx) => {
    const t = Math.max(b.col(cx - 0.62, 0, ['drum', 'drum']), b.col(cx + 0.62, 0, ['drum', 'drum']));
    const y = b.put('plank', cx, t);
    b.col(cx, 0, ['crate', 'buoy'], y);
    return y + 2;
  },
  (b, cx, r) => b.col(cx, 0, r() < 0.5 ? ['tallCrate', 'drum', 'buoy'] : ['tallDrum', 'crate', 'buoy']),
  (b, cx) => {
    b.col(cx - 0.62, 0, ['crate', 'crate', 'crate']);
    return b.col(cx + 0.62, 0, ['drum', 'drum', 'drum', 'buoy']);
  },
];

function procedural(level) {
  const r = rng(level * 7919);
  const b = new Builder();
  const twin = r() < 0.45;
  const rafts = twin ? [-4.2, 4.2] : [0];
  for (const rx of rafts) {
    const w = twin ? 5.4 : 8;
    b.raft(rx, 0, w);
    const slots = twin ? [rx - 1.3, rx + 1.3] : [rx - 2.6, rx, rx + 2.6];
    for (const sx of slots) MODULES[Math.floor(r() * MODULES.length)](b, sx, r);
  }
  const shots = Math.min(34, 14 + Math.round(b.blocks.length * 0.9));
  return b.build(shots);
}

export function getLevel(n) {
  if (n <= HAND_MADE.length) return HAND_MADE[n - 1]();
  return procedural(n);
}

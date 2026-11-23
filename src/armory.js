// Unlockable cannonballs and cannon paint jobs (all original designs).

export const BALLS = [
  { id: 'standard', name: 'Iron Ball', desc: 'Trusty and reliable', cost: 0, color: 0x2a3140, emissive: 0x000000, mass: 14, radius: 2.6, power: 1 },
  { id: 'fire', name: 'Fire Ball', desc: 'Bigger blasts', cost: 600, color: 0xff7a2a, emissive: 0xff4a10, mass: 14, radius: 3.6, power: 1.25, trail: true },
  { id: 'anchor', name: 'Anchor Ball', desc: 'Super heavy hits', cost: 900, color: 0x5d6b7d, emissive: 0x000000, mass: 32, radius: 2.8, power: 1.6 },
  { id: 'splitter', name: 'Splitter', desc: 'Splits in three on impact', cost: 1400, color: 0x2fb3a5, emissive: 0x0b5a52, mass: 14, radius: 2.4, power: 1, split: true },
];

export const SKINS = [
  { id: 'bronze', name: 'Harbor Bronze', cost: 0, barrel: 0xc7863a, bands: 0x7a4a1c, carriage: 0x1f8a8a },
  { id: 'steel', name: 'Navy Steel', cost: 400, barrel: 0xb8c4d2, bands: 0x4d5c70, carriage: 0x2a3f78 },
  { id: 'coral', name: 'Coral Reef', cost: 700, barrel: 0xff8a8a, bands: 0xc94a5a, carriage: 0x2fb3a5 },
  { id: 'emerald', name: 'Emerald Isle', cost: 1000, barrel: 0x3fbf6a, bands: 0x1f6b3c, carriage: 0xe9d6a6 },
  { id: 'violet', name: 'Royal Violet', cost: 1500, barrel: 0x9b6ad8, bands: 0x4c2f80, carriage: 0xd9dde5 },
];

export const ballById = (id) => BALLS.find((b) => b.id === id) || BALLS[0];
export const skinById = (id) => SKINS.find((s) => s.id === id) || SKINS[0];

// Achievements: [id, title, stat key, goal, coin reward]
export const ACHIEVEMENTS = [
  ['sink100', 'Deckhand', 'sunk', 100, 100],
  ['sink1000', 'Cargo Crusher', 'sunk', 1000, 500],
  ['sink5000', 'Sea Monster', 'sunk', 5000, 2000],
  ['win10', 'First Voyage', 'wins', 10, 150],
  ['win50', 'Seasoned Captain', 'wins', 50, 600],
  ['boss1', 'Fortress Breaker', 'bosses', 1, 250],
  ['boss5', 'Boss Hunter', 'bosses', 5, 1000],
  ['amazing10', 'Showstopper', 'amazing', 10, 300],
  ['bomb25', 'Demolition Expert', 'bombs', 25, 300],
  ['tnt20', 'Powder Monkey', 'tnt', 20, 250],
  ['stars30', 'Star Collector', 'stars', 30, 400],
  ['streak7', 'Loyal Sailor', 'streak', 7, 700],
  ['ice50', 'Ice Breaker', 'ice', 50, 300],
  ['balloon30', 'Party Popper', 'balloons', 30, 300],
  ['challenge5', 'Daily Challenger', 'challenges', 5, 500],
  ['power20', 'Power Player', 'powerups', 20, 400],
];

// One-use-per-level power-ups (earned from the spin wheel, 3-star wins and the daily challenge).
export const POWERUPS = [
  { id: 'blast', name: 'Mega Blast', desc: 'Next 3 shots blow up huge', icon: '💥' },
  { id: 'slowmo', name: 'Slow-Mo', desc: 'Slows time for 6 seconds', icon: '⏳' },
  { id: 'laser', name: 'Laser Aim', desc: 'Shows exactly where shots land', icon: '🎯' },
];
export const powerupById = (id) => POWERUPS.find((p) => p.id === id);

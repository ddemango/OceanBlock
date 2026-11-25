import './style.css';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { getLevel, getChallenge, isHard, difficulty, BLOCKS, RAFT_TOP, RAFT_Z } from './levels.js';
import { buildEnvironment, buildCannon, buildRaft, THEMES, themeForLevel } from './scenery.js';
import { crateTexture, drumTexture, drumLidTexture, buoyTexture, beamTexture, ironTexture, tntTexture, iceTexture, balloonTexture } from './textures.js';
import * as sfx from './audio.js';
import { BALLS, SKINS, ACHIEVEMENTS, ballById, skinById } from './armory.js';
import { celebrate, stop as stopCelebrate, countUp } from './celebrate.js';
import { isNative, isEmbedded, initNative, nativeVibrate, gameCenter } from './native.js';
import { POWERUPS, powerupById } from './armory.js';

// ======================================================================
// Save data
// ======================================================================
const SAVE_KEY = 'tidebreaker.save.v1';
const MAX_LIVES = 5;
const HEART_REGEN_MS = 15 * 60 * 1000;

const save = loadSave();
function loadSave() {
  const fallback = { level: 1, coins: 100, lives: MAX_LIVES, lifeTimer: 0, sound: true, vibe: true, music: true, stars: {}, daily: { last: '', streak: 0 },
    armory: { balls: ['standard'], ball: 'standard', skins: ['bronze'], skin: 'bronze' }, stats: {}, claimed: {},
    powerups: { blast: 1, slowmo: 1, laser: 1 }, boosters: { shots: 0, bomb: 0, triple: 0 }, spin: '', challenge: { day: '', best: 0, done: false } };
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}
function persist() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch {
    /* private mode etc. — play on without saving */
  }
}
function regenLives() {
  if (save.lives >= MAX_LIVES) {
    save.lifeTimer = 0;
    return;
  }
  if (!save.lifeTimer) save.lifeTimer = Date.now();
  while (save.lives < MAX_LIVES && Date.now() - save.lifeTimer >= HEART_REGEN_MS) {
    save.lives++;
    save.lifeTimer += HEART_REGEN_MS;
  }
  if (save.lives >= MAX_LIVES) save.lifeTimer = 0;
  persist();
}
function loseLife() {
  if (save.lives >= MAX_LIVES) save.lifeTimer = Date.now();
  save.lives = Math.max(0, save.lives - 1);
  persist();
}

sfx.audio.enabled = save.sound;
save.armory = save.armory || { balls: ['standard'], ball: 'standard', skins: ['bronze'], skin: 'bronze' };
save.stats = save.stats || {};
save.claimed = save.claimed || {};
save.powerups = save.powerups || { blast: 1, slowmo: 1, laser: 1 };
save.boosters = save.boosters || { shots: 0, bomb: 0, triple: 0 };
save.challenge = save.challenge || { day: '', best: 0, done: false };
function stat(key, n = 1) {
  save.stats[key] = (save.stats[key] || 0) + n;
}

// ======================================================================
// Renderer / scene / camera
// ======================================================================
const canvas = document.getElementById('game');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 400);
const CAM_POS = new THREE.Vector3(0, 5.4, 8.2);
const CAM_LOOK = new THREE.Vector3(0, 2.6, RAFT_Z);
camera.position.copy(CAM_POS);
camera.lookAt(CAM_LOOK);

const env = buildEnvironment(scene);
const cannon = buildCannon();
cannon.root.position.set(0, 1.4, 4.6);
cannon.root.scale.setScalar(0.85);
scene.add(cannon.root);
cannon.setSkin(skinById(save.armory.skin));

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  // Keep roughly the same horizontal field of view in portrait and landscape.
  const wantH = THREE.MathUtils.degToRad(40);
  const v = 2 * Math.atan(Math.tan(wantH / 2) / camera.aspect);
  camera.fov = THREE.MathUtils.clamp(THREE.MathUtils.radToDeg(v), 48, 92);
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

// ======================================================================
// Physics
// ======================================================================
const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -20, 0) });
world.broadphase = new CANNON.NaiveBroadphase(); // SAP missed hits on edge objects; ~60 bodies is cheap to check pairwise
world.allowSleep = true;
world.solver.iterations = 18;
world.solver.tolerance = 0.0005;
const blockMat = new CANNON.Material('block');
const ballMat = new CANNON.Material('ball');
const raftMat = new CANNON.Material('raft');
world.defaultContactMaterial.friction = 0.5;
world.defaultContactMaterial.restitution = 0.05;
world.addContactMaterial(new CANNON.ContactMaterial(blockMat, blockMat, { friction: 0.55, restitution: 0.02 }));
world.addContactMaterial(new CANNON.ContactMaterial(blockMat, raftMat, { friction: 0.7, restitution: 0.02 }));
world.addContactMaterial(new CANNON.ContactMaterial(ballMat, blockMat, { friction: 0.3, restitution: 0.15 }));
world.addContactMaterial(new CANNON.ContactMaterial(ballMat, raftMat, { friction: 0.6, restitution: 0.05 }));

// ======================================================================
// Materials / geometry cache for blocks
// ======================================================================
const geoCache = {};
const matCache = {};
const DRUM_COLORS = [
  ['#2fb3a5', '#f6f1e3', '#ff7a59'],
  ['#5b7fe0', '#fff4d6', '#ffc93c'],
  ['#e85d75', '#fff1e6', '#2a4a7a'],
];
// Cartoon look: 3-band toon shading and a dark outline shell around each piece.
const toonRamp = (() => {
  const data = new Uint8Array([90, 170, 255]);
  const t = new THREE.DataTexture(data, 3, 1, THREE.RedFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter;
  t.needsUpdate = true;
  return t;
})();
function toToon(m) {
  if (Array.isArray(m)) return m.map(toToon);
  return new THREE.MeshToonMaterial({ map: m.map || null, color: m.color, gradientMap: toonRamp, emissive: m.emissive || new THREE.Color(0) });
}
const outlineMat = new THREE.MeshBasicMaterial({ color: 0x1d2638, side: THREE.BackSide });
function addOutline(mesh, thickness = 0.06) {
  const shell = new THREE.Mesh(mesh.geometry, outlineMat);
  mesh.geometry.computeBoundingBox();
  const size = new THREE.Vector3();
  mesh.geometry.boundingBox.getSize(size);
  shell.scale.set(1 + thickness * 2 / size.x, 1 + thickness * 2 / size.y, 1 + thickness * 2 / size.z);
  shell.castShadow = false;
  mesh.add(shell);
  return mesh;
}

function blockVisual(type, variant) {
  const spec = BLOCKS[type];
  const key = type + ':' + variant;
  if (!geoCache[type]) {
    if (spec.shape === 'box') geoCache[type] = new THREE.BoxGeometry(spec.w, spec.h, spec.d);
    else if (spec.shape === 'cyl') geoCache[type] = new THREE.CylinderGeometry(spec.r, spec.r, spec.h, 20);
    else if (spec.shape === 'sphere') geoCache[type] = new THREE.SphereGeometry(spec.r, 20, 16).scale(1, 1.12, 1);
    else geoCache[type] = new THREE.CylinderGeometry(spec.rTop, spec.r, spec.h, 18);
  }
  if (!matCache[key]) {
    if (type === 'crate' || type === 'tallCrate') {
      const t = variant % 2 === 0 ? crateTexture() : crateTexture('#e9b86a', '#a8742e');
      if (type === 'tallCrate') {
        t.wrapT = THREE.RepeatWrapping;
        t.repeat.y = 2;
      }
      const m = new THREE.MeshStandardMaterial({ map: t, roughness: 0.8 });
      matCache[key] = m;
    } else if (type === 'drum' || type === 'tallDrum') {
      const [base, band, emb] = DRUM_COLORS[variant % DRUM_COLORS.length];
      const side = new THREE.MeshStandardMaterial({
        map: drumTexture(base, band, emb, type === 'tallDrum'),
        roughness: 0.35,
        metalness: 0.35,
      });
      const lid = new THREE.MeshStandardMaterial({ map: drumLidTexture(base), roughness: 0.4, metalness: 0.3 });
      matCache[key] = [side, lid, lid];
    } else if (type === 'iron') {
      matCache[key] = new THREE.MeshStandardMaterial({ map: ironTexture(false), roughness: 0.45, metalness: 0.55 });
    } else if (type === 'tnt') {
      const side = new THREE.MeshStandardMaterial({ map: tntTexture(), roughness: 0.4, emissive: 0x3a0800 });
      const lid = new THREE.MeshStandardMaterial({ color: 0xb02520, roughness: 0.5 });
      matCache[key] = [side, lid, lid];
    } else if (type === 'ice') {
      matCache[key] = new THREE.MeshStandardMaterial({ map: iceTexture(), roughness: 0.1, metalness: 0.1, emissive: 0x2a6a80 });
    } else if (type === 'balloon') {
      matCache[key] = new THREE.MeshStandardMaterial({ map: balloonTexture(BALLOON_COLORS[variant % BALLOON_COLORS.length]), roughness: 0.3 });
    } else if (type === 'buoy') {
      matCache[key] = new THREE.MeshStandardMaterial({ map: buoyTexture(), roughness: 0.45 });
    } else {
      const t = beamTexture();
      matCache[key] = new THREE.MeshStandardMaterial({ map: t, roughness: 0.8 });
    }
  }
  if (!matCache[key].toon) {
    const toon = toToon(matCache[key]);
    if (type === 'ice') {
      toon.transparent = true;
      toon.opacity = 0.82;
    }
    matCache[key] = toon;
    (Array.isArray(toon) ? toon : [toon]).forEach((m) => (m.toon = true));
  }
  const mesh = addOutline(new THREE.Mesh(geoCache[type], matCache[key]));
  if (type === 'balloon') {
    // knot + dangling string
    const str = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.3, 4), stringMat);
    str.position.y = -spec.h / 2 - 0.65;
    mesh.add(str);
  }
  return mesh;
}
const BALLOON_COLORS = ['#ff5a8a', '#ffc93c', '#5bc8ff', '#7ee081', '#b98cff'];
const stringMat = new THREE.MeshBasicMaterial({ color: 0xf6f1e3 });

function blockShape(spec) {
  if (spec.shape === 'box') return new CANNON.Box(new CANNON.Vec3(spec.w / 2, spec.h / 2, spec.d / 2));
  if (spec.shape === 'cyl') return new CANNON.Cylinder(spec.r, spec.r, spec.h, 12);
  if (spec.shape === 'sphere') return new CANNON.Sphere(spec.r);
  return new CANNON.Cylinder(spec.rTop, spec.r, spec.h, 10);
}

// ======================================================================
// Level state
// ======================================================================
const state = {
  mode: 'home', // home | play | won | failed | paused
  level: save.level,
  shots: 0,
  blocks: [], // { body, mesh, cleared, sunk }
  balls: [], // { body, mesh, age }
  rafts: [], // { body, mesh }
  extraUsed: false,
  endTimer: 0,
  firstHit: false,
  shotsFired: 0,
  startShots: 0,
};

const ballGeo = new THREE.SphereGeometry(0.38, 20, 14);
const ballMatVis = new THREE.MeshStandardMaterial({ color: 0x2a3140, metalness: 0.6, roughness: 0.35 });
const ballMats = {};
function ballMaterial(kind) {
  if (!ballMats[kind.id]) {
    ballMats[kind.id] = new THREE.MeshStandardMaterial({ color: kind.color, emissive: kind.emissive, emissiveIntensity: 0.8, metalness: 0.5, roughness: 0.35 });
  }
  return ballMats[kind.id];
}

function clearLevel() {
  for (const b of state.blocks) {
    world.removeBody(b.body);
    scene.remove(b.mesh);
  }
  for (const b of state.balls) {
    world.removeBody(b.body);
    scene.remove(b.mesh);
  }
  for (const r of state.rafts) {
    world.removeBody(r.body);
    scene.remove(r.mesh);
  }
  state.blocks = [];
  state.balls = [];
  state.rafts = [];
  pendingExplosions.length = 0;
  pendingUnlock.length = 0;
  particles.clear();
}

function loadLevel(n, def = getLevel(n)) {
  clearLevel();
  state.level = n;
  state.def = def;
  state.event = def.event || null;
  state.theme = state.event === 'storm' ? 'storm' : def.theme || themeForLevel(n);
  env.setTheme(state.theme);
  stopEvent();
  state.shots = def.shots;
  state.startShots = state.shots;
  state.shotsFired = 0;
  state.charge = 0;
  state.bombReady = false;
  state.combo = { count: 0, timer: 0, shown: 0 };
  state.bonus = 0;
  state.totalBlocks = def.blocks.length;
  state.extraUsed = false;
  state.endTimer = 0;
  state.firstHit = false;
  state.puUsed = {};
  state.megaShots = 0;
  state.laser = false;
  state.challenge = !!def.challenge;
  timeScale = 1;
  slowT = 0;
  document.body.classList.remove('slowmo');
  setupSeaLife(n);
  // hungry sharks eat shots, so those levels come with a little extra ammo
  const bold = sea.list.filter((c) => c.bold).length;
  state.shots += bold * 2;
  state.startShots = state.shots;

  for (const r of def.rafts) {
    const body = new CANNON.Body({ mass: 0, material: raftMat, type: CANNON.Body.KINEMATIC }); // kinematic so events can set it moving
    body.allowSleep = false;
    body.addShape(new CANNON.Box(new CANNON.Vec3(r.w / 2, 0.5, r.d / 2)));
    body.position.set(r.x, RAFT_TOP - 0.5, r.z);
    world.addBody(body);
    const mesh = buildRaft(r);
    mesh.children.slice().forEach((c) => c.isMesh && addOutline(c, 0.04));
    scene.add(mesh);
    state.rafts.push({ body, mesh, def: r, amp: 0, ampTarget: r.drift || 0, mode: r.mode || 'side', t: 0 });
  }

  let variant = 0;
  for (const b of def.blocks) {
    const spec = BLOCKS[b.type];
    const body = new CANNON.Body({
      mass: spec.mass,
      material: blockMat,
      linearDamping: spec.floats ? 0.6 : 0.05,
      angularDamping: spec.floats ? 0.6 : 0.12,
      sleepSpeedLimit: 0.2,
      sleepTimeLimit: 0.4,
    });
    body.addShape(blockShape(spec));
    if (spec.hp) {
      // armored: far too heavy to budge until it has taken enough hits
      body.mass = 200;
      body.updateMassProperties();
    }
    body.position.set(b.x, b.y + 0.001, b.z);
    if (b.ry) body.quaternion.setFromEuler(0, b.ry, 0);
    world.addBody(body);
    if (!spec.floats) body.sleep(); // towers stay perfectly still until something hits them

    const mesh = blockVisual(b.type, variant++ % 3);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    const raftIdx = state.rafts.reduce((best, r, i) => (Math.abs(r.def.x - b.x) < Math.abs(state.rafts[best].def.x - b.x) ? i : best), 0);
    const block = { body, mesh, cleared: false, sunk: false, spec, type: b.type, hp: spec.hp || 0, raft: raftIdx, lastBall: -1 };
    if (spec.floats) {
      // balloons remember where they hover, relative to their raft
      const r = state.rafts[raftIdx].body.position;
      block.offset = new CANNON.Vec3(b.x - r.x, b.y, b.z - r.z);
      body.wakeUp();
    }
    body.addEventListener('collide', (e) => onBlockCollide(block, e));
    state.blocks.push(block);
  }
  syncMeshes();
  updateHud();
}

function onBlockCollide(block, e) {
  const impact = Math.abs(e.contact.getImpactVelocityAlongNormal());
  if (impact > 2.5 && state.mode === 'play') sfx.sfxHit(impact / 12, block.type);
  const ud = e.body.userData;
  if (ud?.ball && (block.spec.fragile || block.spec.floats) && !block.breaking) {
    block.breaking = true;
    pendingBreaks.push(block);
  }
  if (ud?.ball && block.hp > 0 && block.lastBall !== e.body.id) {
    block.lastBall = e.body.id;
    damageIron(block, ud.bomb ? 2 : 1);
  }
  if (block.spec.explosive && !block.exploding && (ud?.ball || impact > 7)) {
    block.exploding = true;
    pendingExplosions.push(block);
  }
  if (ud?.ball && !ud.burst) {
    ud.burst = true;
    queueBurst(e.body.position.clone(), e.body.velocity.clone(), ud.bomb, ud);
  }
  if (!state.firstHit && e.body.userData?.ball) {
    // First cannonball impact wakes the whole level so supports collapse naturally.
    state.firstHit = true;
    for (const b of state.blocks) b.body.wakeUp();
  }
}

// ---- special cargo -------------------------------------------------------
const pendingExplosions = [];
const pendingBreaks = []; // ice shattering / balloons popping (removed after the physics step)
function applyBreaks() {
  while (pendingBreaks.length) {
    const block = pendingBreaks.pop();
    if (block.removed) continue;
    const pos = new THREE.Vector3().copy(block.body.position);
    if (!block.cleared) {
      block.cleared = true;
      onCargoCleared();
    }
    world.removeBody(block.body);
    scene.remove(block.mesh);
    block.removed = true;
    if (block.spec.floats) {
      particles.confetti(pos);
      sfx.sfxPop();
      stat('balloons');
    } else {
      particles.shards(pos);
      sfx.sfxShatter();
      stat('ice');
    }
    updateHud();
  }
}
// Balloons hover at their spot (riding their raft) until popped or knocked loose.
function floatBalloons(dt) {
  // Velocity-driven (not forces) so it stays stable whatever the frame rate; +g*dt cancels gravity.
  const lift = -world.gravity.y * dt;
  for (const b of state.blocks) {
    if (!b.spec.floats || b.removed) continue;
    const body = b.body;
    if (b.loose) {
      // tether snapped: drift up and away on the breeze
      body.velocity.set(body.velocity.x * 0.95 + wind.x * 0.05, Math.min(4, body.velocity.y + lift + 0.15), body.velocity.z * 0.95);
      continue;
    }
    const r = state.rafts[b.raft].body.position;
    const tx = r.x + b.offset.x, ty = b.offset.y + Math.sin(elapsed * 1.6 + b.offset.x) * 0.12, tz = r.z + b.offset.z;
    const p = body.position;
    body.velocity.set((tx - p.x) * 4 + wind.x * 0.3, (ty - p.y) * 4 + lift, (tz - p.z) * 4);
    body.angularVelocity.scale(0.9, body.angularVelocity);
  }
}

let crackedIron = null;
function damageIron(block, amount) {
  block.hp = Math.max(0, block.hp - amount);
  particles.sparks(new THREE.Vector3().copy(block.body.position));
  sfx.sfxClang();
  crackedIron = crackedIron || new THREE.MeshToonMaterial({ map: ironTexture(true), gradientMap: toonRamp });
  block.mesh.material = crackedIron;
  if (block.hp === 0) pendingUnlock.push(block); // free it so it can be knocked off
}
// type changes must happen outside the physics step
const pendingUnlock = [];
function applyUnlocks() {
  while (pendingUnlock.length) {
    const block = pendingUnlock.pop();
    const b = block.body;
    b.mass = block.spec.mass;
    b.updateMassProperties();
    b.velocity.set(0, 0, 0);
    b.wakeUp();
  }
}

function applyExplosions() {
  const batch = pendingExplosions.splice(0);
  for (const block of batch) {
    if (block.removed) continue;
    const pos = block.body.position.clone();
    // remove the barrel itself
    if (!block.cleared) {
      block.cleared = true;
      onCargoCleared();
    }
    world.removeBody(block.body);
    scene.remove(block.mesh);
    block.removed = true;
    // big blast; nearby barrels go off a moment later (chain reaction)
    queueBurst(pos, new CANNON.Vec3(0, 0, -1), true);
    for (const other of state.blocks) {
      if (other.removed || other.exploding || !other.spec.explosive) continue;
      if (other.body.position.distanceTo(pos) < 4) {
        other.exploding = true;
        setTimeout(() => pendingExplosions.push(other), 180);
      }
      }
    for (const other of state.blocks) {
      if (other.hp > 0 && other.body.position.distanceTo(pos) < 3) damageIron(other, 2);
    }
    particles.fireball(new THREE.Vector3(pos.x, pos.y, pos.z));
    stat('tnt');
    popup('KABOOM!', '#ff5a3c');
    updateHud();
  }
}

// Moving platforms: rafts sway side to side, or loop around (orbit). Untouched stacks ride along.
function driftRafts(dt) {
  for (let i = 0; i < state.rafts.length; i++) {
    const r = state.rafts[i];
    r.amp += (r.ampTarget - r.amp) * Math.min(1, dt * 0.8);
    if (r.amp < 0.001) {
      r.body.velocity.set(0, 0, 0);
      continue;
    }
    r.t += dt;
    const w = r.mode === 'orbit' ? 0.7 : 0.85;
    const a = r.t * w; // all rafts move in step so neighbours never bump into each other
    const tx = r.def.x + Math.sin(a) * r.amp;
    const tz = r.mode === 'orbit' ? r.def.z + (Math.cos(a) - 1) * r.amp * 0.7 : r.def.z;
    const k = 1 / Math.max(dt, 1 / 120);
    const vx = (tx - r.body.position.x) * k;
    const vz = (tz - r.body.position.z) * k;
    r.body.velocity.set(vx, 0, vz);
    for (const b of state.blocks) {
      if (b.raft !== i || b.removed || b.cleared || b.spec.floats) continue;
      if (b.hp > 0) b.body.velocity.set(vx, 0, vz); // armored cargo rides along
      else if (b.body.sleepState === CANNON.Body.SLEEPING || !state.firstHit) {
        // until the first cannonball lands, the whole stack rides its raft as one piece
        b.body.position.x += vx * dt;
        b.body.position.z += vz * dt;
        if (!state.firstHit) b.body.sleep();
      }
    }
  }
}

// A cannonball hit bursts the nearby cargo apart (applied after the physics step).
const pendingBursts = [];
let shake = 0;
function queueBurst(pos, vel, bomb = false, ud = null) {
  pendingBursts.push({ pos, vel, bomb, ud });
}
function applyBursts() {
  while (pendingBursts.length) {
    const { pos, vel, bomb, ud } = pendingBursts.pop();
    const kind = ballById(ud?.kind);
    const mega = ud?.mega;
    let R = bomb ? 5 : kind.radius;
    let P = bomb ? 1.8 : kind.power;
    if (mega) {
      R *= 1.8;
      P *= 1.6;
    }
    if (ud && kind.split && !ud.child && !bomb) splitBall(pos, vel);
    const dir = new CANNON.Vec3(vel.x, 0, vel.z);
    dir.normalize();
    for (const b of state.blocks) {
      if (b.cleared) continue;
      const d = b.body.position.vsub(pos);
      const dist = d.length();
      if (dist > R) continue;
      if (b.hp > 0) {
        if ((bomb || mega) && dist < R * 0.6) damageIron(b, 2);
        continue;
      }
      if (b.spec.fragile && dist < R * 0.55 && !b.breaking) {
        b.breaking = true;
        pendingBreaks.push(b);
        continue;
      }
      if (b.spec.floats) {
        b.loose = true;
        if (dist < 1.5 && !b.breaking) {
          b.breaking = true;
          pendingBreaks.push(b);
        }
        continue;
      }
      const k = (1 - dist / R) * P;
      d.normalize();
      // push outward + along the shot + a little upward
      const imp = new CANNON.Vec3(
        (d.x * 7 + dir.x * 9) * k * b.body.mass,
        (3 + Math.max(0, d.y) * 4) * k * b.body.mass,
        (d.z * 7 + dir.z * 9) * k * b.body.mass
      );
      b.body.wakeUp();
      b.body.applyImpulse(imp, b.body.position);
      b.body.angularVelocity.set((Math.random() - 0.5) * 8 * k, (Math.random() - 0.5) * 8 * k, (Math.random() - 0.5) * 8 * k);
    }
    particles.sparks(new THREE.Vector3(pos.x, pos.y, pos.z));
    if (bomb || mega) {
      particles.sparks(new THREE.Vector3(pos.x, pos.y + 1, pos.z));
      particles.splash(pos, 1.5);
      if (mega) particles.fireball(new THREE.Vector3(pos.x, pos.y, pos.z));
      sfx.sfxFire();
      sfx.sfxBoom();
      popup(mega ? 'MEGA BLAST!' : 'BOOM!', '#ff7a3c');
    }
    shake = Math.min(1.6, shake + (bomb || mega ? 1.4 : 0.7));
    vibrate(bomb || mega ? 50 : 14);
  }
}

const BOMB_CHARGE = 10; // cargo pieces needed to charge a bomb
function onCargoCleared() {
  if (state.mode !== 'play') return;
  if (!state.bombReady) {
    state.charge = Math.min(1, state.charge + 1 / BOMB_CHARGE);
    if (state.charge >= 1) {
      state.bombReady = true;
      sfx.sfxCoin();
      vibrate(30);
    }
  }
  stat('sunk');
  const left = blocksRemaining();
  if (left === 0) {
    // final piece: dramatic slow motion
    slowMo(0.25, 1.3);
    shake = 1.6;
  } else if (left === 1 && state.totalBlocks > 3) popup('LAST ONE!', '#fff1a8');
  const c = state.combo;
  c.count++;
  c.timer = 1.2;
  const tiers = [[12, 'AMAZING!', '#ff5a8a', 30], [8, 'AWESOME!', '#b98cff', 20], [5, 'GREAT!', '#5bc8ff', 10], [3, 'NICE!', '#ffc93c', 5]];
  for (const [n, word, color, coins] of tiers) {
    if (c.count >= n && c.shown < n) {
      c.shown = n;
      state.bonus += coins;
      popup(word, color, `+${coins} coins`);
      if (n === 12) stat('amazing');
      break;
    }
  }
}

function popup(text, color, sub = '') {
  const el = document.createElement('div');
  el.className = 'popup';
  el.style.color = color;
  el.innerHTML = text + (sub ? `<small>${sub}</small>` : '');
  $('popups').appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

// Splitter cannonball: two extra balls fan out from the impact point.
function splitBall(pos, vel) {
  const kind = ballById('splitter');
  for (const ang of [-0.5, 0.5]) {
    const v = new CANNON.Vec3(vel.x * Math.cos(ang) - vel.z * Math.sin(ang), Math.abs(vel.y) * 0.3 + 3, vel.x * Math.sin(ang) + vel.z * Math.cos(ang));
    v.scale(0.55, v);
    const body = new CANNON.Body({ mass: 10, material: ballMat, shape: new CANNON.Sphere(0.3), linearDamping: 0.01 });
    body.userData = { ball: true, burst: false, bomb: false, kind: 'splitter', child: true };
    body.position.set(pos.x, pos.y + 0.4, pos.z);
    body.velocity.copy(v);
    world.addBody(body);
    const mesh = new THREE.Mesh(ballGeo, ballMaterial(kind));
    mesh.scale.setScalar(0.8);
    scene.add(mesh);
    state.balls.push({ body, mesh, age: 0, splashed: false });
  }
  popup('SPLIT!', '#2fb3a5');
}

function blocksRemaining() {
  return state.blocks.filter((b) => !b.cleared).length;
}

// ======================================================================
// Firing
// ======================================================================
const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
const aimPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -RAFT_Z);
const tmpV = new THREE.Vector3();
const tipPos = new THREE.Vector3();
let lastFire = 0;
let recoil = 0;

function aimAt(target) {
  const pivot = cannon.root.localToWorld(cannon.yaw.position.clone());
  const dx = target.x - pivot.x;
  const dz = target.z - pivot.z;
  cannon.yaw.rotation.y = Math.atan2(-dx, -dz);
  // two passes: aim, then re-solve from the real muzzle position
  let vel = null;
  for (let i = 0; i < 2; i++) {
    cannon.root.updateMatrixWorld(true);
    cannon.tip.getWorldPosition(tipPos);
    vel = ballisticVelocity(tipPos, target);
    const horiz = Math.hypot(vel.x, vel.z);
    cannon.pitch.rotation.x = Math.atan2(vel.y, horiz);
  }
  cannon.root.updateMatrixWorld(true);
  cannon.tip.getWorldPosition(tipPos);
  return ballisticVelocity(tipPos, target);
}

function ballisticVelocity(from, to) {
  const d = tmpV.copy(to).sub(from);
  const dist = d.length();
  const t = 0.2 + dist / 85; // fast, flat shots
  const g = world.gravity.y;
  return new THREE.Vector3(d.x / t, (d.y - 0.5 * g * t * t) / t, d.z / t);
}

// Hold a finger down to keep firing (auto-fire), drag to sweep the aim.
const FIRE_INTERVAL = 190; // rapid fire while holding
const pointer = { down: false, x: 0, y: 0 };

function onPointerDown(e) {
  sfx.unlockAudio();
  pointer.down = true;
  pointer.inside = true;
  pointer.x = e.clientX;
  pointer.y = e.clientY;
  tryFire();
}
function onPointerMove(e) {
  pointer.x = e.clientX;
  pointer.y = e.clientY;
}
function onPointerUp() {
  pointer.down = false;
  pointer.inside = false;
}

function tryFire() {
  if (state.mode !== 'play') return;
  if (state.shots <= 0) return;
  if (!pointer.inside) return;
  const now = performance.now();
  if (now - lastFire < FIRE_INTERVAL) return;
  lastFire = now;

  const target = pickTarget();
  if (target) fire(target);
}

function pickTarget() {
  const rect = canvas.getBoundingClientRect();
  ndc.set(((pointer.x - rect.left) / rect.width) * 2 - 1, -((pointer.y - rect.top) / rect.height) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  const targets = [...state.blocks.filter((b) => !b.cleared && !b.removed).map((b) => b.mesh), ...state.rafts.map((r) => r.mesh)];
  const hits = raycaster.intersectObjects(targets, true);
  let target;
  if (hits.length) target = hits[0].point.clone();
  else {
    target = new THREE.Vector3();
    if (!raycaster.ray.intersectPlane(aimPlane, target)) return null;
  }
  if (target.z > cannon.root.position.z - 2.5) return null; // don't shoot backwards at the pier
  target.y += 0.3; // aim a touch high so shots at the bottom row clear the raft's front lip
  return target;
}

const bombMatVis = new THREE.MeshStandardMaterial({ color: 0xe0352b, emissive: 0xff5a1a, emissiveIntensity: 0.9, roughness: 0.4 });
const bombGeo = new THREE.SphereGeometry(0.6, 20, 14);

function fire(target, extra = false) {
  if (!extra && state.shots <= 0) return;
  if (!extra && state.triple > 0) {
    // triple shot: two extra balls fanned out either side
    state.triple--;
    fire(target.clone().add(new THREE.Vector3(-1.4, 0.2, 0)), true);
    fire(target.clone().add(new THREE.Vector3(1.4, 0.2, 0)), true);
  }
  if (!extra) hideHint();
  const vel = aimAt(target);
  const bomb = !extra && state.bombReady;
  const kind = ballById(save.armory.ball);
  if (bomb) {
    state.bombReady = false;
    state.charge = 0;
  }
  const body = new CANNON.Body({
    mass: bomb ? 14 : kind.mass,
    material: ballMat,
    shape: new CANNON.Sphere(bomb ? 0.6 : 0.38),
    linearDamping: 0.01,
  });
  const mega = !extra && !bomb && state.megaShots > 0;
  if (mega) state.megaShots--;
  body.userData = { ball: true, burst: false, bomb, kind: kind.id, child: false, mega };
  body.position.set(tipPos.x, tipPos.y, tipPos.z);
  body.velocity.set(vel.x, vel.y, vel.z);
  body.ccdSpeedThreshold = 1;
  world.addBody(body);
  const mesh = new THREE.Mesh(bomb ? bombGeo : ballGeo, bomb || mega ? bombMatVis : ballMaterial(kind));
  if (mega) mesh.scale.setScalar(1.25);
  mesh.castShadow = true;
  addOutline(mesh, 0.05);
  scene.add(mesh);
  state.balls.push({ body, mesh, age: 0, splashed: false });

  if (extra) return;
  stat('shots');
  if (bomb) stat('bombs');
  state.shots--;
  state.shotsFired++;
  recoil = 1;
  shake = Math.min(1, shake + 0.35);
  particles.muzzle(tipPos, vel);
  sfx.sfxFire();
  vibrate(18);
  updateHud();
}

// ======================================================================
// Particles (splashes, smoke)
// ======================================================================
const particles = (() => {
  const pool = [];
  const geo = new THREE.IcosahedronGeometry(0.18, 0);
  const splashMat = new THREE.MeshBasicMaterial({ color: 0xeafcff, transparent: true });
  const smokeMat = new THREE.MeshBasicMaterial({ color: 0xf2ece0, transparent: true, depthWrite: false });
  const fireMat = new THREE.MeshBasicMaterial({ color: 0xffa834, transparent: true, depthWrite: false });
  const sparkMat = new THREE.MeshBasicMaterial({ color: 0xfff1a8, transparent: true, depthWrite: false });
  const iceMat = new THREE.MeshBasicMaterial({ color: 0xc9f3ff, transparent: true, depthWrite: false });
  const rainbow = [0xff5a8a, 0xffc93c, 0x5bc8ff, 0x7ee081, 0xb98cff].map((c) => new THREE.MeshBasicMaterial({ color: c, transparent: true, depthWrite: false }));
  const live = [];
  let flash = null;

  function spawn(mat, pos, vel, life, scale, grav) {
    let p = pool.pop();
    if (!p) {
      p = { mesh: new THREE.Mesh(geo, mat.clone()) };
    }
    p.mesh.material.color.copy(mat.color);
    p.mesh.material.opacity = 1;
    p.mesh.position.copy(pos);
    p.mesh.scale.setScalar(scale);
    p.vel = vel.clone();
    p.life = life;
    p.max = life;
    p.grav = grav;
    p.grow = mat === smokeMat ? 0.9 : 0;
    scene.add(p.mesh);
    live.push(p);
  }

  return {
    splash(pos, strength = 1) {
      const n = Math.round(10 + 10 * strength);
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = 1.5 + Math.random() * 3 * strength;
        spawn(
          splashMat,
          new THREE.Vector3(pos.x, 0.1, pos.z),
          new THREE.Vector3(Math.cos(a) * s * 0.6, 4 + Math.random() * 5 * strength, Math.sin(a) * s * 0.6),
          0.6 + Math.random() * 0.5,
          0.8 + Math.random() * 1.2,
          -18
        );
      }
    },
    trail(pos) {
      if (Math.random() < 0.5) spawn(fireMat, pos, new THREE.Vector3((Math.random() - 0.5) * 0.6, 0.6, (Math.random() - 0.5) * 0.6), 0.25, 1.2 + Math.random(), 0);
    },
    fireball(pos) {
      for (let i = 0; i < 26; i++) {
        const v = new THREE.Vector3((Math.random() - 0.5), Math.random() * 0.9 + 0.1, (Math.random() - 0.5)).normalize().multiplyScalar(3 + Math.random() * 6);
        spawn(i % 2 ? fireMat : smokeMat, pos, v, 0.5 + Math.random() * 0.5, 2 + Math.random() * 2.5, i % 2 ? -2 : 1.5);
      }
      this.sparks(pos);
      if (flash) {
        flash.position.copy(pos);
        flash.intensity = 140;
      }
    },
    shards(pos) {
      for (let i = 0; i < 22; i++) {
        const v = new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.8 + 0.2, Math.random() - 0.5).normalize().multiplyScalar(4 + Math.random() * 6);
        spawn(iceMat, pos, v, 0.6 + Math.random() * 0.5, 0.7 + Math.random() * 1.3, -18);
      }
    },
    confetti(pos) {
      for (let i = 0; i < 26; i++) {
        const v = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.3, Math.random() - 0.5).normalize().multiplyScalar(3 + Math.random() * 5);
        spawn(rainbow[i % rainbow.length], pos, v, 0.7 + Math.random() * 0.6, 0.6 + Math.random() * 0.8, -6);
      }
    },
    sparks(pos) {
      for (let i = 0; i < 16; i++) {
        const a = Math.random() * Math.PI * 2;
        const up = Math.random();
        const sp = 4 + Math.random() * 7;
        spawn(
          i % 3 === 0 ? fireMat : sparkMat,
          pos,
          new THREE.Vector3(Math.cos(a) * sp * (1 - up * 0.5), 2 + up * 7, Math.sin(a) * sp * (1 - up * 0.5)),
          0.35 + Math.random() * 0.35,
          0.5 + Math.random() * 0.9,
          -16
        );
      }
    },
    muzzle(pos, vel) {
      const fdir = vel.clone().normalize();
      for (let i = 0; i < 8; i++) {
        const v = fdir.clone().multiplyScalar(6 + Math.random() * 6);
        v.x += (Math.random() - 0.5) * 3;
        v.y += (Math.random() - 0.5) * 3;
        spawn(fireMat, pos, v, 0.18 + Math.random() * 0.15, 1.6 + Math.random() * 1.2, 0);
      }
      const dir = vel.clone().normalize();
      for (let i = 0; i < 10; i++) {
        const v = dir.clone().multiplyScalar(2 + Math.random() * 4);
        v.x += (Math.random() - 0.5) * 2;
        v.y += Math.random() * 1.5;
        v.z += (Math.random() - 0.5) * 2;
        spawn(smokeMat, pos, v, 0.5 + Math.random() * 0.3, 0.9 + Math.random() * 0.6, 1.5);
      }
      if (!flash) {
        flash = new THREE.PointLight(0xffb64a, 0, 12);
        scene.add(flash);
      }
      flash.position.copy(pos);
      flash.intensity = 60;
    },
    update(dt) {
      for (let i = live.length - 1; i >= 0; i--) {
        const p = live[i];
        p.life -= dt;
        if (p.life <= 0) {
          scene.remove(p.mesh);
          live.splice(i, 1);
          pool.push(p);
          continue;
        }
        p.vel.y += p.grav * dt;
        p.vel.multiplyScalar(p.grow ? 1 - 2.5 * dt : 1);
        p.mesh.position.addScaledVector(p.vel, dt);
        if (p.grow) p.mesh.scale.multiplyScalar(1 + p.grow * dt);
        p.mesh.material.opacity = p.life / p.max;
      }
      if (flash) flash.intensity = Math.max(0, flash.intensity - dt * 400);
    },
    clear() {
      for (const p of live) {
        scene.remove(p.mesh);
        pool.push(p);
      }
      live.length = 0;
    },
  };
})();


// ======================================================================
// Time scale (slow motion), ocean events and power-ups
// ======================================================================
let timeScale = 1;
let slowT = 0;
let slowZoom = 0;
function slowMo(scale, seconds, zoom = true) {
  timeScale = Math.min(timeScale, scale);
  slowT = Math.max(slowT, seconds);
  if (zoom) slowZoom = 1;
  document.body.classList.add('slowmo');
  sfx.sfxWhoosh();
}
function updateTime(dt) {
  if (slowT > 0) {
    slowT -= dt;
    if (slowT <= 0) {
      timeScale = 1;
      document.body.classList.remove('slowmo');
    }
  }
  slowZoom = Math.max(0, slowZoom - dt * (slowT > 0 ? 0 : 1.5));
  const z = 1 + (slowT > 0 ? Math.min(1, slowZoom) : slowZoom) * 0.12;
  if (Math.abs(camera.zoom - z) > 0.001) {
    camera.zoom = z;
    camera.updateProjectionMatrix();
  }
}

// ---- ocean events: storms, sharks and whirlpools that change the level mid-play ----
const wind = { x: 0 };
const ev = { kind: null, t: 0, objs: [], rain: null, shark: null, pool: null, jump: null, nextJump: 3, nextFlash: 4 };
function stopEvent() {
  for (const o of ev.objs) scene.remove(o);
  ev.objs = [];
  ev.kind = null;
  ev.rain = ev.shark = ev.pool = ev.jump = null;
  wind.x = 0;
  $('wind').classList.add('hidden');
}
const sharkMat = new THREE.MeshToonMaterial({ color: 0x5d7488, gradientMap: toonRamp });
const bellyMat = new THREE.MeshToonMaterial({ color: 0xe6edf2, gradientMap: toonRamp });
function buildShark() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 12).scale(1, 0.75, 2.6), sharkMat);
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.62, 14, 10).scale(1, 0.6, 2.3), bellyMat);
  belly.position.y = -0.18;
  const fin = new THREE.Mesh(new THREE.ConeGeometry(0.42, 1.1, 4).scale(0.35, 1, 1.4), sharkMat);
  fin.position.set(0, 0.85, -0.25);
  fin.rotation.x = -0.35;
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.0, 4).scale(0.25, 1, 1), sharkMat);
  tail.position.set(0, 0.25, -1.95);
  tail.rotation.x = -0.9;
  for (const m of [body, fin, tail]) addOutline(m, 0.04);
  g.add(body, belly, fin, tail);
  return g;
}
function whirlTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  g.translate(128, 128);
  for (let arm = 0; arm < 4; arm++) {
    g.beginPath();
    for (let i = 0; i < 120; i++) {
      const t = i / 120;
      const a = arm * (Math.PI / 2) + t * 9;
      const r = 8 + t * 116;
      g.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    g.strokeStyle = 'rgba(235,252,255,0.85)';
    g.lineWidth = 9;
    g.stroke();
  }
  const grd = g.createRadialGradient(0, 0, 0, 0, 0, 128);
  grd.addColorStop(0, 'rgba(4,30,60,0.85)');
  grd.addColorStop(0.6, 'rgba(10,70,110,0.35)');
  grd.addColorStop(1, 'rgba(10,70,110,0)');
  g.fillStyle = grd;
  g.fillRect(-128, -128, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function startEvent(kind) {
  if (!kind || state.mode !== 'play' || ev.kind) return;
  ev.kind = kind;
  ev.t = 0;
  if (kind === 'storm') {
    const n = 500;
    const pos = new Float32Array(n * 6);
    for (let i = 0; i < n; i++) {
      const x = (Math.random() - 0.5) * 30, y = Math.random() * 16, z = -22 + Math.random() * 28;
      pos.set([x, y, z, x + 0.15, y - 0.7, z], i * 6);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    ev.rain = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: 0xdbe8f5, transparent: true, opacity: 0.55 }));
    scene.add(ev.rain);
    ev.objs.push(ev.rain);
    $('wind').classList.remove('hidden');
    popup('STORM!', '#cfe3ff', 'wind bends your shots');
    sfx.sfxThunder();
  } else if (kind === 'shark') {
    ev.shark = buildShark();
    scene.add(ev.shark);
    ev.objs.push(ev.shark);
    ev.nextJump = 2.5;
    popup('SHARK WATERS!', '#9fd6ff', 'it may help you out');
  } else if (kind === 'whirlpool') {
    ev.pool = new THREE.Mesh(new THREE.CircleGeometry(4.5, 40), new THREE.MeshBasicMaterial({ map: whirlTexture(), transparent: true, depthWrite: false }));
    ev.pool.rotation.x = -Math.PI / 2;
    ev.pool.position.set(0, 0.32, RAFT_Z + 1.5);
    ev.pool.renderOrder = 2;
    ev.pool.scale.setScalar(0.01);
    scene.add(ev.pool);
    ev.objs.push(ev.pool);
    for (const r of state.rafts) {
      r.mode = 'orbit';
      r.ampTarget = Math.max(r.ampTarget, 1.0);
    }
    popup('WHIRLPOOL!', '#7fe3f5', 'the rafts start to spin');
    sfx.sfxWhoosh();
  }
}
function updateEvent(dt) {
  if (!ev.kind) return;
  ev.t += dt;
  if (ev.kind === 'storm') {
    wind.x = Math.sin(ev.t * 0.45) * 2.4 + Math.sin(ev.t * 1.3) * 0.5;
    const a = ev.rain.geometry.attributes.position.array;
    for (let i = 0; i < a.length; i += 6) {
      a[i + 1] -= dt * 22;
      a[i + 4] -= dt * 22;
      a[i] += wind.x * dt * 2;
      a[i + 3] = a[i] + 0.15 + wind.x * 0.08;
      if (a[i + 1] < 0) {
        a[i + 1] = 16;
        a[i + 4] = 15.3;
      }
    }
    ev.rain.geometry.attributes.position.needsUpdate = true;
    const w = $('wind');
    w.textContent = (wind.x < 0 ? '◀ ' : '') + 'WIND ' + Math.abs(wind.x).toFixed(1) + (wind.x >= 0 ? ' ▶' : '');
    ev.nextFlash -= dt;
    if (ev.nextFlash <= 0) {
      ev.nextFlash = 5 + Math.random() * 5;
      document.body.classList.add('flash');
      setTimeout(() => document.body.classList.remove('flash'), 140);
      setTimeout(() => sfx.sfxThunder(), 250);
      shake = Math.min(1.6, shake + 0.4);
    }
  } else if (ev.kind === 'shark') {
    const sh = ev.shark;
    if (ev.jump) {
      const j = ev.jump;
      j.t += dt;
      const k = Math.min(1, j.t / 0.9);
      sh.position.lerpVectors(j.from, j.to, k);
      sh.position.y = Math.sin(k * Math.PI) * j.h - 0.4;
      sh.rotation.set(-Math.cos(k * Math.PI) * 0.8, j.yaw, 0);
      if (!j.hit && k > 0.5) {
        j.hit = true;
        const b = j.target;
        if (!b.removed && !b.cleared) queueBurst(new CANNON.Vec3(b.body.position.x, b.body.position.y, b.body.position.z + 0.5), new CANNON.Vec3(j.to.x - j.from.x, 0, j.to.z - j.from.z), false, { kind: 'anchor' });
        particles.splash(j.from, 1.2);
        popup('CHOMP!', '#9fd6ff');
        stat('sharks');
      }
      if (k >= 1) {
        particles.splash(sh.position, 1.4);
        sfx.sfxSplash(1);
        ev.jump = null;
      }
    } else {
      // circle in front of the rafts with just the fin showing
      const a = ev.t * 0.5;
      sh.position.set(Math.sin(a) * 8.5, -0.55, RAFT_Z + 2.6 + Math.cos(a) * 2.2);
      sh.rotation.set(0, Math.atan2(Math.cos(a) * 8.5, -Math.sin(a) * 2.2), 0); // face along the path
      ev.nextJump -= dt;
      const targets = state.blocks.filter((b) => !b.cleared && !b.removed && b.hp === 0 && !b.spec.floats);
      if (ev.nextJump <= 0 && targets.length) {
        ev.nextJump = 6 + Math.random() * 3;
        const target = targets[Math.floor(Math.random() * targets.length)];
        const to = new THREE.Vector3(target.body.position.x, 0, target.body.position.z - 2.5);
        const from = new THREE.Vector3(to.x + (Math.random() < 0.5 ? -3 : 3), 0, target.body.position.z + 3.5);
        ev.jump = { from, to, t: 0, h: target.body.position.y + 0.6, target, yaw: Math.atan2(to.x - from.x, to.z - from.z), hit: false };
        sfx.sfxSplash(1);
      }
    }
  } else if (ev.kind === 'whirlpool') {
    ev.pool.rotation.z -= dt * 1.8;
    ev.pool.scale.setScalar(Math.min(1, ev.pool.scale.x + dt * 0.6));
  }
}


// ---- sea life: leaping fish and circling sharks; more of them (and bolder) on higher levels ----
const FISH_COLORS = [0xff8a3c, 0xffd23c, 0xff5a8a, 0x4fc3ff, 0x7ee081, 0xb98cff];
const fishGeo = new THREE.SphereGeometry(0.28, 12, 8).scale(0.75, 0.9, 1.7);
const finGeo = new THREE.ConeGeometry(0.22, 0.4, 4).scale(0.3, 1, 1);
function buildFish(color) {
  const g = new THREE.Group();
  const mat = new THREE.MeshToonMaterial({ color, gradientMap: toonRamp });
  const body = new THREE.Mesh(fishGeo, mat);
  const tail = new THREE.Mesh(finGeo, mat);
  tail.position.z = 0.55;
  tail.rotation.x = Math.PI / 2;
  const top = new THREE.Mesh(finGeo, mat);
  top.position.set(0, 0.24, 0.05);
  top.scale.setScalar(0.7);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1d2638 });
  for (const sx of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), eyeMat);
    eye.position.set(sx * 0.17, 0.06, -0.3);
    g.add(eye);
  }
  addOutline(body, 0.03);
  g.add(body, tail, top);
  g.userData.tail = tail;
  return g;
}
const sea = { list: [] };
const rand = (a, b) => a + Math.random() * (b - a);
function clearSeaLife() {
  for (const c of sea.list) scene.remove(c.mesh);
  sea.list = [];
}
function setupSeaLife(level) {
  clearSeaLife();
  const d = state.challenge ? 0.5 : difficulty(level);
  const fishN = 3 + Math.round(d * 9); // 3 → 12 fish
  const sharkN = state.challenge ? 2 : level < 8 ? 0 : 1 + Math.floor(d * 3.2); // 0 → 4 sharks
  for (let i = 0; i < fishN; i++) {
    const mesh = buildFish(FISH_COLORS[i % FISH_COLORS.length]);
    mesh.scale.setScalar(1.7);
    mesh.visible = false;
    scene.add(mesh);
    sea.list.push({ kind: 'fish', mesh, t: rand(0.5, 4), leap: null, gap: [Math.max(1.2, 4 - d * 2.5), Math.max(3, 8 - d * 4)] });
  }
  for (let i = 0; i < sharkN; i++) {
    const mesh = buildShark();
    mesh.scale.setScalar(0.85);
    scene.add(mesh);
    sea.list.push({ kind: 'shark', mesh, t: rand(3, 7), leap: null, phase: (i / sharkN) * Math.PI * 2, speed: rand(0.35, 0.55) * (i % 2 ? -1 : 1),
      rx: rand(6.5, 9.5), rz: rand(1.6, 3), cz: RAFT_Z + rand(3.5, 6.5), gap: [Math.max(2.5, 8 - d * 5), Math.max(5, 12 - d * 6)], bold: d > 0.22 });
  }
}
// pick a leap across the water between the cannon and the rafts
function startLeap(c) {
  const shark = c.kind === 'shark';
  const x = shark ? c.mesh.position.x : rand(-9, 9);
  const z = shark ? c.mesh.position.z : rand(RAFT_Z + 2.5, RAFT_Z + 9);
  const dir = rand(0, Math.PI * 2);
  const len = shark ? rand(4, 6.5) : rand(1.8, 3.6);
  c.leap = {
    from: new THREE.Vector3(x, -0.4, z),
    to: new THREE.Vector3(x + Math.cos(dir) * len, -0.4, z + Math.sin(dir) * len * 0.5),
    h: shark ? rand(2.4, 4.2) : rand(1.4, 3),
    dur: shark ? rand(1.0, 1.3) : rand(0.7, 1.0),
    t: 0,
  };
  c.mesh.visible = true;
  particles.splash(c.leap.from, shark ? 0.9 : 0.35);
  if (shark) sfx.sfxSplash(0.7);
}
function updateSeaLife(dt) {
  for (const c of sea.list) {
    const m = c.mesh;
    if (c.leap) {
      const L = c.leap;
      L.t += dt;
      const k = Math.min(1, L.t / L.dur);
      m.position.lerpVectors(L.from, L.to, k);
      m.position.y = -0.4 + Math.sin(k * Math.PI) * L.h;
      // face along the arc: nose up on the way out, down on the way back in
      m.rotation.set(Math.cos(k * Math.PI) * 0.9, Math.atan2(L.from.x - L.to.x, L.from.z - L.to.z), 0);
      if (c.kind === 'fish' && m.userData.tail) m.userData.tail.rotation.z = Math.sin(L.t * 30) * 0.5;
      catchBalls(c);
      if (k >= 1) {
        particles.splash(L.to, c.kind === 'shark' ? 1 : 0.35);
        c.leap = null;
        c.t = rand(c.gap[0], c.gap[1]);
        if (c.kind === 'fish') m.visible = false;
      }
      continue;
    }
    if (c.kind === 'shark') {
      // circle with just the fin out of the water
      c.phase += c.speed * dt * 0.5;
      const x = Math.sin(c.phase) * c.rx;
      const z = c.cz + Math.cos(c.phase) * c.rz;
      const ang = Math.atan2(Math.cos(c.phase) * c.rx * Math.sign(c.speed), -Math.sin(c.phase) * c.rz * Math.sign(c.speed));
      m.position.set(x, -0.55 + Math.sin(elapsed * 2 + c.phase) * 0.05, z);
      m.rotation.set(0, ang, 0);
    }
    c.t -= dt;
    if (c.t <= 0 && state.mode !== 'won') startLeap(c);
  }
}
// leaping fish give a bonus shot when hit; bold sharks (higher levels) snatch cannonballs out of the air
function catchBalls(c) {
  if (state.mode !== 'play') return;
  const p = c.mesh.position;
  if (p.y < 0.3) return;
  const reach = c.kind === 'shark' ? 1.5 : 1.1;
  for (let i = state.balls.length - 1; i >= 0; i--) {
    const ball = state.balls[i];
    if (ball.body.userData.child || ball.body.position.distanceTo(p) > reach) continue;
    if (c.kind === 'fish') {
      if (c.hit) continue;
      c.hit = true;
      state.shots++;
      popup('+1 SHOT!', '#7ee081', 'nice fish!');
      particles.confetti(p.clone());
      sfx.sfxCoin();
      stat('fish');
      c.leap.h *= 1.6; // sends it flying
      setTimeout(() => (c.hit = false), 1500);
      updateHud();
    } else if (c.bold && !c.leap.ate) {
      c.leap.ate = true; // one ball per leap
      world.removeBody(ball.body);
      scene.remove(ball.mesh);
      state.balls.splice(i, 1);
      popup('CHOMP!', '#9fd6ff', 'a shark ate your shot');
      particles.splash(p.clone(), 0.8);
      sfx.sfxSplash(1);
      vibrate(40);
      stat('sharkEats');
    }
  }
}

// ---- power-ups: one use each per level ----
function renderPowerbar() {
  $('powerbar').innerHTML = POWERUPS.map((pu) => {
    const n = save.powerups[pu.id] || 0;
    const used = state.puUsed && state.puUsed[pu.id];
    return `<button class="pu ${used ? 'used' : ''} ${n ? '' : 'empty'}" data-id="${pu.id}" aria-label="${pu.name}"><span>${pu.icon}</span><b>${n}</b></button>`;
  }).join('');
  $('powerbar').querySelectorAll('.pu').forEach((el) => el.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    usePowerup(el.dataset.id);
  }));
}
function usePowerup(id) {
  if (state.mode !== 'play') return;
  const pu = powerupById(id);
  if (state.puUsed[id]) return toast(`${pu.name} already used this level`);
  if (!(save.powerups[id] > 0)) return toast(`No ${pu.name} left — win them on the Lucky Spin!`);
  save.powerups[id]--;
  state.puUsed[id] = true;
  stat('powerups');
  persist();
  sfx.sfxCoin();
  vibrate(30);
  if (id === 'blast') {
    state.megaShots = 3;
    popup('MEGA BLAST!', '#ff7a3c', 'next 3 shots');
  } else if (id === 'slowmo') {
    slowMo(0.35, 6, false);
    popup('SLOW-MO!', '#7fe3f5', '6 seconds');
  } else if (id === 'laser') {
    state.laser = true;
    popup('LASER AIM!', '#ff5a5a', 'drag to aim');
  }
  renderPowerbar();
}
function grantPowerup(id, n = 1) {
  save.powerups[id] = (save.powerups[id] || 0) + n;
}
const randomPowerup = () => POWERUPS[Math.floor(Math.random() * POWERUPS.length)].id;

// laser aim: dashed trajectory + target ring
const laser = (() => {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(40 * 3), 3));
  const line = new THREE.Line(geo, new THREE.LineDashedMaterial({ color: 0xff3b3b, dashSize: 0.35, gapSize: 0.25, transparent: true, opacity: 0.9, depthTest: false }));
  line.renderOrder = 10;
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.35, 0.5, 24), new THREE.MeshBasicMaterial({ color: 0xff3b3b, transparent: true, opacity: 0.9, depthTest: false, side: THREE.DoubleSide }));
  ring.renderOrder = 10;
  line.visible = ring.visible = false;
  scene.add(line, ring);
  return { line, ring };
})();
function updateLaser() {
  const on = state.mode === 'play' && state.laser;
  laser.line.visible = laser.ring.visible = false;
  if (!on) return;
  const target = pickTarget();
  if (!target) return;
  const vel = aimAt(target);
  const a = laser.line.geometry.attributes.position.array;
  const g = world.gravity.y;
  const dist = tipPos.distanceTo(target);
  const T = 0.2 + dist / 85;
  for (let i = 0; i < 40; i++) {
    const t = (i / 39) * T;
    a[i * 3] = tipPos.x + vel.x * t;
    a[i * 3 + 1] = tipPos.y + vel.y * t + 0.5 * g * t * t;
    a[i * 3 + 2] = tipPos.z + vel.z * t;
  }
  laser.line.geometry.attributes.position.needsUpdate = true;
  laser.line.computeLineDistances();
  laser.ring.position.copy(target);
  laser.ring.lookAt(camera.position);
  laser.line.visible = laser.ring.visible = true;
}

// ======================================================================
// Simulation step
// ======================================================================
const WATER_Y = 0;

function stepPhysics(dt) {
  // buoyant drag for anything in the water: it sinks slowly instead of falling forever
  for (const b of state.blocks) {
    const body = b.body;
    if (body.position.y < WATER_Y) {
      if (!b.sunk) {
        b.sunk = true;
        particles.splash(body.position, Math.min(1.5, body.velocity.length() / 8));
        sfx.sfxSplash(0.8);
      }
      body.linearDamping = 0.92;
      body.angularDamping = 0.9;
      body.applyForce(new CANNON.Vec3(0, body.mass * 17, 0), body.position);
    }
  }
  for (const ball of state.balls) {
    if (ball.body.position.y < WATER_Y) {
      if (!ball.splashed) {
        ball.splashed = true;
        particles.splash(ball.body.position, 1);
        sfx.sfxSplash(0.6);
      }
      ball.body.linearDamping = 0.9;
    }
  }
  for (const ball of state.balls) {
    if (wind.x && ball.body.position.y > 0) ball.body.applyForce(new CANNON.Vec3(wind.x * ball.body.mass * 1.6, 0, 0), ball.body.position);
  }
  driftRafts(dt);
  floatBalloons(dt);
  world.step(1 / 60, dt, 6);
  applyUnlocks();
  applyBreaks();
  applyExplosions();
  applyBursts();
}

function syncMeshes() {
  for (const b of state.blocks) {
    b.mesh.position.copy(b.body.position);
    b.mesh.quaternion.copy(b.body.quaternion);
  }
  for (const b of state.balls) {
    b.mesh.position.copy(b.body.position);
    b.mesh.quaternion.copy(b.body.quaternion);
  }
}

function updateGame(dt) {
  // clear / sink blocks
  for (let i = state.blocks.length - 1; i >= 0; i--) {
    const b = state.blocks[i];
    const y = b.body.position.y;
    if (!b.cleared && b.spec.floats && b.loose && y > 11) {
      b.cleared = true;
      popup('FLOATED AWAY!', '#5bc8ff');
      onCargoCleared();
      updateHud();
    }
    if (b.spec.floats && y > 16) {
      world.removeBody(b.body);
      scene.remove(b.mesh);
      b.removed = true;
    }
    if (!b.cleared && !b.spec.floats && y < RAFT_TOP - 0.9) {
      b.cleared = true;
      onCargoCleared();
      updateHud();
    }
    if (y < -5) {
      world.removeBody(b.body);
      scene.remove(b.mesh);
      b.removed = true;
    }
  }
  state.blocks = state.blocks.filter((b) => !b.removed);

  for (let i = state.balls.length - 1; i >= 0; i--) {
    const ball = state.balls[i];
    ball.age += dt;
    if (ball.age > 7 || ball.body.position.y < -5) {
      world.removeBody(ball.body);
      scene.remove(ball.mesh);
      state.balls.splice(i, 1);
    }
  }

  if (state.combo && state.combo.timer > 0) {
    state.combo.timer -= dt;
    if (state.combo.timer <= 0) state.combo = { count: 0, timer: 0, shown: 0 };
  }

  if (state.mode !== 'play') return;

  if (blocksRemaining() === 0) {
    state.endTimer += dt;
    if (state.endTimer > 0.9) onWin();
    return;
  }
  if (state.shots <= 0) {
    // wait until balls are gone and things have settled before declaring failure
    const moving = state.blocks.some((b) => {
      if (b.cleared || b.spec.floats) return false;
      const rv = state.rafts[b.raft].body.velocity; // motion relative to the raft it rides
      return Math.hypot(b.body.velocity.x - rv.x, b.body.velocity.y, b.body.velocity.z - rv.z) > 0.35;
    });
    const ballsFlying = state.balls.some((b) => b.body.position.y > 0 && b.age < 4);
    if (!moving && !ballsFlying) {
      state.endTimer += dt;
      if (state.endTimer > 1.6) onFail();
    } else state.endTimer = 0;
  } else state.endTimer = 0;
}

// ======================================================================
// UI
// ======================================================================
const $ = (id) => document.getElementById(id);
const screens = ['home', 'win', 'fail', 'settings', 'nolives', 'daily', 'boosters', 'armory', 'goals', 'spin', 'challenge'];
function show(id) {
  for (const s of screens) $(s).classList.toggle('hidden', s !== id);
  if (id) $('hint').classList.add('hidden'); // tutorial hint only shows during play
  const hudOn = state.mode === 'play' || state.mode === 'paused' || id === 'fail';
  $('hud').classList.toggle('hidden', !hudOn);
  $('hud-progress').classList.toggle('hidden', !hudOn);
  $('powerbar').classList.toggle('hidden', !hudOn);
}

function updateHud() {
  $('hud-level').textContent = state.challenge ? 'Daily' : state.level;
  $('hud-shots').textContent = state.shots;
  const left = blocksRemaining();
  $('hud-left').textContent = left;
  const total = state.totalBlocks || 1;
  $('progress-fill').style.width = `${Math.round(((total - left) / total) * 100)}%`;
  $('bomb-fill').style.width = `${Math.round((state.charge || 0) * 100)}%`;
  $('bomb-pill').classList.toggle('ready', !!state.bombReady);
  document.querySelector('.ammo-pill').classList.toggle('low', state.shots <= 3 && state.mode === 'play');
}

function updateHome() {
  regenLives();
  for (const el of document.querySelectorAll('.coins')) el.textContent = save.coins;
  for (const el of document.querySelectorAll('.lives')) el.textContent = save.lives;
  const label = document.querySelector('.lives-label');
  if (save.lives >= MAX_LIVES) label.textContent = 'FULL';
  else label.textContent = fmtTime(HEART_REGEN_MS - (Date.now() - save.lifeTimer));
  $('home-level').textContent = save.level;
  $('goals-badge').classList.toggle('hidden', claimableGoals() === 0);
  $('spin-badge').classList.toggle('hidden', save.spin === dayKey());
  $('challenge-badge').classList.toggle('hidden', save.challenge.day === dayKey() && save.challenge.done);
}

function fmtTime(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

let toastTimer = 0;
function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), 1800);
}

function vibrate(ms) {
  if (!save.vibe) return;
  if (isNative || isEmbedded) nativeVibrate(ms);
  else if (navigator.vibrate) navigator.vibrate(ms);
}

function goHome() {
  state.mode = 'home';
  runId++;
  stopEvent();
  loadLevel(save.level); // show the next level's cargo behind the menu
  updateHome();
  renderMap();
  show('home');
  if (dailyDue()) setTimeout(showDaily, 400);
}

// ---- level map (a winding path of the levels around your current one) ----
function renderMap() {
  const map = $('levelmap');
  const cur = save.level;
  const first = Math.max(1, cur - 2);
  const nodes = [];
  for (let i = 0; i < 5; i++) nodes.push(first + i);
  const pts = nodes.map((_, i) => ({ x: 10 + i * 20, y: i % 2 ? 30 : 65 }));
  const path = pts.map((p, i) => (i ? 'L' : 'M') + p.x + ' ' + p.y).join(' ');
  map.innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${path}" stroke="#fff8e6" stroke-width="3" stroke-dasharray="4 3" fill="none" vector-effect="non-scaling-stroke" style="stroke-width:6px"/></svg>`;
  nodes.forEach((lv, i) => {
    const el = document.createElement('div');
    const done = lv < cur;
    el.className = 'lv-node' + (lv === cur ? ' current' : done ? '' : ' locked') + (isHard(lv) ? ' hard' : lv % 10 === 0 ? ' boss' : '');
    el.style.left = pts[i].x + '%';
    el.style.top = pts[i].y + '%';
    el.textContent = lv;
    if (done) {
      const st = (save.stars || {})[lv] || 1;
      el.insertAdjacentHTML('beforeend', `<span class="lv-stars">${[1, 2, 3].map((n) => `<i class="${n <= st ? 'on' : ''}"></i>`).join('')}</span>`);
    }
    if (lv === cur) el.addEventListener('click', () => { sfx.unlockAudio(); sfx.sfxClick(); startLevel(); });
    map.appendChild(el);
  });
}

// ---- Armory: unlock + equip cannonballs and cannon paint ----
const hex = (n) => '#' + n.toString(16).padStart(6, '0');
function renderArmory() {
  document.querySelectorAll('#armory .coins').forEach((el) => (el.textContent = save.coins));
  const a = save.armory;
  const tile = (item, owned, equipped, swatch, extra = '') =>
    `<button class="shop-item ${owned ? 'owned' : save.coins < item.cost ? 'locked' : ''} ${equipped ? 'equipped' : ''}" data-id="${item.id}">
      ${swatch}<b>${item.name}</b>${extra}
      <span class="tag">${equipped ? 'Equipped' : owned ? 'Equip' : `<span class="coin-icon small"></span>${item.cost}`}</span></button>`;
  $('shop-balls').innerHTML = BALLS.map((b) =>
    tile(b, a.balls.includes(b.id), a.ball === b.id, `<span class="swatch" style="background:radial-gradient(circle at 35% 30%, #fff8, ${hex(b.color)} 55%)"></span>`, `<span class="desc">${b.desc}</span>`)
  ).join('');
  $('shop-skins').innerHTML = SKINS.map((k) =>
    tile(k, a.skins.includes(k.id), a.skin === k.id, `<span class="swatch skin" style="background:linear-gradient(135deg, ${hex(k.barrel)} 55%, ${hex(k.carriage)} 55%)"></span>`)
  ).join('');
  $('shop-balls').querySelectorAll('.shop-item').forEach((el) => el.addEventListener('click', () => buyOrEquip('ball', el.dataset.id)));
  $('shop-skins').querySelectorAll('.shop-item').forEach((el) => el.addEventListener('click', () => buyOrEquip('skin', el.dataset.id)));
}
function buyOrEquip(type, id) {
  const a = save.armory;
  const list = type === 'ball' ? a.balls : a.skins;
  const item = type === 'ball' ? ballById(id) : skinById(id);
  if (!list.includes(id)) {
    if (save.coins < item.cost) return toast('Not enough coins');
    save.coins -= item.cost;
    list.push(id);
    sfx.sfxCoin();
    celebrate(1200);
  } else sfx.sfxClick();
  if (type === 'ball') a.ball = id;
  else {
    a.skin = id;
    cannon.setSkin(skinById(id));
  }
  persist();
  renderArmory();
  updateHome();
}
$('btn-armory').addEventListener('click', () => {
  sfx.unlockAudio();
  sfx.sfxClick();
  renderArmory();
  $('armory').classList.remove('hidden');
});
$('btn-armory-close').addEventListener('click', () => {
  sfx.sfxClick();
  stopCelebrate();
  $('armory').classList.add('hidden');
});

// ---- Goals (achievements) ----
function statValue(key) {
  if (key === 'stars') return Object.values(save.stars || {}).reduce((t, n) => t + n, 0);
  if (key === 'streak') return (save.daily && save.daily.streak) || 0;
  return save.stats[key] || 0;
}
function claimableGoals() {
  return ACHIEVEMENTS.filter(([id, , key, goal]) => !save.claimed[id] && statValue(key) >= goal).length;
}
function renderGoals() {
  $('goal-list').innerHTML = ACHIEVEMENTS.map(([id, title, key, goal, reward]) => {
    const v = Math.min(goal, statValue(key));
    const done = v >= goal;
    const claimed = save.claimed[id];
    return `<div class="goal ${claimed ? 'claimed' : ''}"><span>${title}<br><small>${v} / ${goal}</small></span>
      <button data-id="${id}" ${!done || claimed ? 'disabled' : ''}>${claimed ? 'Done' : `<span class="coin-icon small"></span>${reward}`}</button>
      <div class="gbar"><i style="width:${(v / goal) * 100}%"></i></div></div>`;
  }).join('');
  $('goal-list').querySelectorAll('button:not(:disabled)').forEach((btn) =>
    btn.addEventListener('click', () => {
      const ach = ACHIEVEMENTS.find((x) => x[0] === btn.dataset.id);
      save.claimed[ach[0]] = true;
      save.coins += ach[4];
      persist();
      sfx.sfxCoin();
      celebrate(1500);
      renderGoals();
      updateHome();
    })
  );
}
$('btn-goals').addEventListener('click', () => {
  sfx.unlockAudio();
  sfx.sfxClick();
  renderGoals();
  $('goals').classList.remove('hidden');
});
$('btn-goals-close').addEventListener('click', () => {
  sfx.sfxClick();
  stopCelebrate();
  $('goals').classList.add('hidden');
});


// ---- win celebration: coins burst out of the medal and fly to the coin counter ----
function coinShower(stars) {
  const layer = $('coin-shower');
  layer.innerHTML = '';
  const n = 8 + stars * 4;
  const target = document.querySelector('#win .coin-pill').getBoundingClientRect();
  for (let i = 0; i < n; i++) {
    const c = document.createElement('i');
    const x0 = window.innerWidth / 2 + (Math.random() - 0.5) * 140;
    const y0 = window.innerHeight * 0.48 + (Math.random() - 0.5) * 80;
    c.style.left = x0 + 'px';
    c.style.top = y0 + 'px';
    c.style.setProperty('--dx', target.left + 14 - x0 + 'px');
    c.style.setProperty('--dy', target.top + 14 - y0 + 'px');
    c.style.animationDelay = 0.5 + i * 0.06 + 's';
    layer.appendChild(c);
    setTimeout(() => sfx.sfxTick(), 1150 + i * 60);
  }
  setTimeout(() => (layer.innerHTML = ''), 2600 + n * 60);
}

// ---- Lucky Spin: a free spin every day ----
const WHEEL = [
  { label: '50', icon: '🪙', give: () => coins(50) },
  { label: 'Slow-Mo', icon: '⏳', give: () => (grantPowerup('slowmo'), 'Slow-Mo power-up') },
  { label: '+5 Shots', icon: '🎯', give: () => booster('shots', '+5 Shots booster') },
  { label: '150', icon: '🪙', give: () => coins(150) },
  { label: 'Mega Blast', icon: '💥', give: () => (grantPowerup('blast'), 'Mega Blast power-up') },
  { label: 'Bomb', icon: '💣', give: () => booster('bomb', 'Start-with-Bomb booster') },
  { label: 'Paint', icon: '🎨', give: () => paint() },
  { label: 'Laser', icon: '🔴', give: () => (grantPowerup('laser'), 'Laser Aim power-up') },
  { label: '300', icon: '🪙', give: () => coins(300) },
  { label: 'Triple', icon: '✨', give: () => booster('triple', 'Triple Shot booster') },
];
const WHEEL_WEIGHTS = [16, 11, 11, 12, 9, 9, 3, 9, 6, 9];
const SPIN_COST = 150;
function coins(n) {
  save.coins += n;
  return `${n} coins`;
}
function booster(id, name) {
  save.boosters[id] = (save.boosters[id] || 0) + 1;
  return name;
}
function paint() {
  const locked = SKINS.filter((k) => !save.armory.skins.includes(k.id));
  if (!locked.length) return coins(500);
  const k = locked[Math.floor(Math.random() * locked.length)];
  save.armory.skins.push(k.id);
  return `${k.name} cannon paint!`;
}
let wheelAngle = 0;
let spinning = false;
function renderSpin() {
  const n = WHEEL.length;
  const colors = ['#ff7a59', '#ffc93c', '#2fb3a5', '#5b7fe0', '#e85d75'];
  $('wheel').style.background = `conic-gradient(${WHEEL.map((_, i) => `${colors[i % colors.length]} ${(i / n) * 360}deg ${((i + 1) / n) * 360}deg`).join(',')})`;
  $('wheel').innerHTML = WHEEL.map((w, i) => `<span style="transform: rotate(${(i + 0.5) * (360 / n)}deg)"><em>${w.icon}</em>${w.label}</span>`).join('');
  refreshSpinButton();
}
function refreshSpinButton() {
  const free = save.spin !== dayKey();
  $('btn-spin').innerHTML = free ? 'Spin!<small>free today</small>' : `Spin again<small><span class="coin-icon small"></span> ${SPIN_COST}</small>`;
  $('btn-spin').disabled = spinning || (!free && save.coins < SPIN_COST);
  document.querySelectorAll('#spin .coins').forEach((el) => (el.textContent = save.coins));
}
function doSpin() {
  if (spinning) return;
  const free = save.spin !== dayKey();
  if (!free) {
    if (save.coins < SPIN_COST) return toast('Not enough coins');
    save.coins -= SPIN_COST;
  }
  save.spin = dayKey();
  persist();
  spinning = true;
  $('spin-result').textContent = '';
  // weighted pick
  let r = Math.random() * WHEEL_WEIGHTS.reduce((a, b) => a + b, 0);
  let idx = 0;
  while ((r -= WHEEL_WEIGHTS[idx]) > 0) idx++;
  const seg = 360 / WHEEL.length;
  const stopAt = 360 - (idx + 0.5) * seg + (Math.random() - 0.5) * seg * 0.6;
  wheelAngle += 360 * 5 + ((stopAt - (wheelAngle % 360)) + 360) % 360;
  $('wheel').style.transform = `rotate(${wheelAngle}deg)`;
  refreshSpinButton();
  let ticks = 0;
  const tick = setInterval(() => (++ticks < 22 ? sfx.sfxTick() : clearInterval(tick)), 160);
  setTimeout(() => {
    spinning = false;
    const what = WHEEL[idx].give();
    persist();
    stat('spins');
    sfx.sfxWin();
    celebrate(1600);
    vibrate([30, 40, 30]);
    $('spin-result').innerHTML = `You won <b>${what}</b>`;
    refreshSpinButton();
    updateHome();
  }, 4200);
}
$('btn-spin').addEventListener('click', () => {
  sfx.unlockAudio();
  doSpin();
});
$('btn-spinwheel').addEventListener('click', () => {
  sfx.unlockAudio();
  sfx.sfxClick();
  renderSpin();
  $('spin-result').textContent = '';
  $('spin').classList.remove('hidden');
});
$('btn-spin-close').addEventListener('click', () => {
  if (spinning) return;
  sfx.sfxClick();
  stopCelebrate();
  $('spin').classList.add('hidden');
});

// ---- Daily Challenge: one special level per day + Game Center leaderboard ----
const dayNumber = () => Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
function challengeState() {
  if (save.challenge.day !== dayKey()) save.challenge = { day: dayKey(), best: 0, done: false };
  return save.challenge;
}
function renderChallenge() {
  const c = challengeState();
  const def = getChallenge(dayNumber());
  const names = { storm: 'Storm', shark: 'Shark Waters', whirlpool: 'Whirlpool' };
  $('ch-info').innerHTML = `${def.blocks.length} cargo · ${def.shots} shots · ${names[def.event] || 'Calm seas'}`;
  $('ch-best').textContent = c.best ? c.best.toLocaleString() : '—';
  $('ch-reward').classList.toggle('hidden', c.done);
  $('btn-leaderboard').classList.toggle('hidden', !gameCenter.available);
  const ms = 86400000 - ((Date.now() - new Date().getTimezoneOffset() * 60000) % 86400000);
  $('ch-timer').textContent = `New challenge in ${Math.floor(ms / 3600000)}h ${Math.floor((ms % 3600000) / 60000)}m`;
}
function startChallenge() {
  stopCelebrate();
  beginLevel({}, getChallenge(dayNumber()));
}
function challengeScore(stars) {
  const sunk = state.totalBlocks;
  return sunk * 100 + state.shots * 150 + (state.bonus || 0) * 10 + stars * 250;
}
function onChallengeWin(stars) {
  const c = challengeState();
  const score = challengeScore(stars);
  const isBest = score > c.best;
  c.best = Math.max(c.best, score);
  let reward = 0;
  const gifts = [];
  if (!c.done) {
    c.done = true;
    reward = 150;
    gifts.push(randomPowerup());
    gifts.forEach((id) => grantPowerup(id));
    stat('challenges');
  }
  save.coins += reward;
  persist();
  gameCenter.submit(c.best);
  countUp($('win-coins'), reward);
  $('win-title-word').textContent = isBest ? 'NEW BEST!' : 'COMPLETE!';
  $('win-level-label').textContent = 'Daily Challenge';
  $('win-detail').innerHTML = `Score <b>${score.toLocaleString()}</b> · best today ${c.best.toLocaleString()}` +
    (gifts.length ? `<br><b class="gift">+ ${gifts.map((id) => powerupById(id).icon + ' ' + powerupById(id).name).join(', ')}</b>` : '');
  document.querySelectorAll('.stars span').forEach((s, i) => s.classList.toggle('on', i < stars));
  updateHome();
  celebrate();
  coinShower(stars);
  sfx.sfxWin();
  vibrate([30, 40, 30]);
  show('win');
}
$('btn-challenge').addEventListener('click', () => {
  sfx.unlockAudio();
  sfx.sfxClick();
  renderChallenge();
  gameCenter.login();
  $('challenge').classList.remove('hidden');
});
$('btn-ch-play').addEventListener('click', () => {
  sfx.sfxClick();
  startChallenge();
});
$('btn-leaderboard').addEventListener('click', () => {
  sfx.sfxClick();
  gameCenter.show();
});
$('btn-ch-close').addEventListener('click', () => {
  sfx.sfxClick();
  $('challenge').classList.add('hidden');
});

// ---- daily reward (7-day streak) ----
const DAILY = [50, 75, 100, 150, 200, 250, 500];
const dayKey = (d = new Date()) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
function dailyDue() {
  save.daily = save.daily || { last: '', streak: 0 };
  return save.daily.last !== dayKey();
}
function showDaily() {
  if (state.mode !== 'home' || !dailyDue()) return;
  const y = new Date();
  y.setDate(y.getDate() - 1);
  const continuing = save.daily.last === dayKey(y);
  const day = continuing ? (save.daily.streak % 7) + 1 : 1; // 1..7
  $('daily-grid').innerHTML = DAILY.map((c, i) => `<div class="daily-day ${i + 1 < day ? 'done' : ''} ${i + 1 === day ? 'today' : ''} ${i === 6 ? 'big' : ''}">Day ${i + 1}<b><span class="coin-icon small"></span>${c}</b></div>`).join('');
  $('daily-amount').textContent = DAILY[day - 1];
  $('daily').dataset.day = day;
  $('daily').classList.remove('hidden');
}
$('btn-claim').addEventListener('click', () => {
  const day = +$('daily').dataset.day || 1;
  save.coins += DAILY[day - 1];
  save.daily = { last: dayKey(), streak: day };
  persist();
  sfx.unlockAudio();
  sfx.sfxCoin();
  celebrate(1800);
  $('daily').classList.add('hidden');
  updateHome();
});

function startLevel() {
  regenLives();
  if (save.lives <= 0) {
    state.mode = 'home';
    showNoLives();
    return;
  }
  if (save.level >= 3) showBoosters();
  else beginLevel({});
}

// ---- booster picker ----
const picked = new Set();
function showBoosters() {
  picked.clear();
  state.mode = 'boosters';
  $('boost-title').innerHTML = `Level ${save.level}`;
  if (save.level % 10 === 0) $('boost-title').innerHTML = `<span class="boss-tag">BOSS</span> Level ${save.level}`;
  else if (isHard(save.level)) $('boost-title').innerHTML = `<span class="boss-tag hard">HARD</span> Level ${save.level}`;
  refreshBoosters();
  show('boosters');
}
const boostCost = (id) => (save.boosters[id] > 0 ? 0 : +document.querySelector(`.boost[data-id="${id}"]`).dataset.cost);
function refreshBoosters() {
  const spent = [...picked].reduce((t, id) => t + boostCost(id), 0);
  const left = save.coins - spent;
  document.querySelectorAll('.boost').forEach((el) => {
    const id = el.dataset.id;
    const on = picked.has(id);
    el.classList.toggle('on', on);
    el.disabled = !on && boostCost(id) > left;
    const free = save.boosters[id] || 0;
    el.querySelector('small').innerHTML = free ? `Free ×${free}` : `<span class="coin-icon small"></span>${el.dataset.cost}`;
  });
  document.querySelectorAll('#boosters .coins').forEach((el) => (el.textContent = left));
}
document.querySelectorAll('.boost').forEach((el) =>
  el.addEventListener('click', () => {
    sfx.sfxClick();
    const id = el.dataset.id;
    picked.has(id) ? picked.delete(id) : picked.add(id);
    refreshBoosters();
  })
);
$('btn-start').addEventListener('click', () => {
  sfx.sfxClick();
  let cost = 0;
  picked.forEach((id) => (cost += boostCost(id)));
  if (cost > save.coins) return;
  save.coins -= cost;
  picked.forEach((id) => {
    if (save.boosters[id] > 0) save.boosters[id]--;
  });
  persist();
  beginLevel(Object.fromEntries([...picked].map((id) => [id, true])));
});
$('btn-boost-back').addEventListener('click', () => {
  sfx.sfxClick();
  goHome();
});

let runId = 0;
function beginLevel(boosts, def) {
  if (def) loadLevel(0, def);
  else loadLevel(save.level);
  if (boosts.shots) state.shots = state.startShots = state.shots + 5;
  if (boosts.bomb) {
    state.bombReady = true;
    state.charge = 1;
  }
  state.triple = boosts.triple ? 10 : 0;
  state.mode = 'play';
  show(null);
  updateHud();
  const lv = state.level;
  if (state.challenge) {
    /* the challenge has its own intro popup */
  } else if (state.def.hard) setTimeout(() => popup('HARD LEVEL!', '#ff5a3c', 'fewer shots · 1.5× coins'), 300);
  else if (lv % 10 === 0) setTimeout(() => popup('BOSS LEVEL!', '#ff5a3c', 'double coins'), 300);
  else if (lv % 5 === 1 && lv > 1) setTimeout(() => popup(THEMES[state.theme].label, '#ffe7b8', `Chapter ${Math.floor((lv - 1) / 5) + 1}`), 300);
  if (boosts.triple) setTimeout(() => popup('TRIPLE SHOT!', '#5bc8ff', '10 shots'), lv % 5 === 1 || lv % 10 === 0 ? 1400 : 300);
  if (lv === 1 && !save.tutorialDone) $('hint').classList.remove('hidden');
  if (state.challenge) setTimeout(() => popup('DAILY CHALLENGE', '#ffc93c', 'beat your best score'), 300);
  renderPowerbar();
  const id = ++runId;
  if (state.event) setTimeout(() => runId === id && startEvent(state.event), 2600);
}

function hideHint() {
  if ($('hint').classList.contains('hidden')) return;
  $('hint').classList.add('hidden');
  save.tutorialDone = true;
  persist();
}

function onWin() {
  state.mode = 'won';
  stopEvent();
  const used = state.shotsFired;
  const ratio = used / state.startShots;
  const stars = ratio <= 0.4 ? 3 : ratio <= 0.7 ? 2 : 1;
  if (state.challenge) return onChallengeWin(stars);
  let reward = 20 + state.shots * 2 + (stars - 1) * 10 + (state.bonus || 0);
  if (state.def.hard) reward = Math.round(reward * 1.5);
  if (state.level % 10 === 0) {
    reward *= 2; // boss bonus
    stat('bosses');
  }
  stat('wins');
  save.coins += reward;
  // power-up rewards: 3-star wins have a 50% chance, bosses give one of each
  const gifts = [];
  if (state.level % 10 === 0) POWERUPS.forEach((pu) => gifts.push(pu.id));
  else if (stars === 3 && Math.random() < 0.5) gifts.push(randomPowerup());
  gifts.forEach((id) => grantPowerup(id));
  save.stars = save.stars || {};
  save.stars[state.level] = Math.max(save.stars[state.level] || 0, stars);
  save.level = state.level + 1;
  persist();
  countUp($('win-coins'), reward);
  updateHome(); // refresh the coin + heart counters in the top bar
  celebrate();
  $('win-detail').innerHTML = `Cleared with ${used} shot${used === 1 ? '' : 's'} · ${state.shots} spare` +
    (gifts.length ? `<br><b class="gift">+ ${gifts.map((id) => powerupById(id).icon + ' ' + powerupById(id).name).join(', ')}</b>` : '');
  $('win-title-word').textContent = stars === 3 ? 'PERFECT!' : 'CLEARED!';
  $('win-level-label').textContent = 'Level ' + state.level;
  coinShower(stars);
  document.querySelectorAll('.stars span').forEach((s, i) => s.classList.toggle('on', i < stars));
  sfx.sfxWin();
  setTimeout(sfx.sfxCoin, 450);
  vibrate([30, 40, 30]);
  show('win');
}

function onFail() {
  state.mode = 'failed';
  stopEvent();
  $('fail-left').textContent = blocksRemaining();
  $('btn-extra').classList.toggle('hidden', state.extraUsed);
  sfx.sfxFail();
  show('fail');
}

function showNoLives() {
  updateHome();
  show('nolives');
}

$('btn-play').addEventListener('click', () => {
  sfx.unlockAudio();
  sfx.sfxClick();
  startLevel();
});
$('btn-next').addEventListener('click', () => {
  sfx.sfxClick();
  stopCelebrate();
  goHome();
});
$('btn-extra').addEventListener('click', () => {
  if (save.coins < 60) {
    toast('Not enough coins');
    return;
  }
  save.coins -= 60;
  persist();
  state.extraUsed = true;
  state.shots += 5;
  state.startShots += 5;
  state.endTimer = 0;
  state.mode = 'play';
  sfx.sfxCoin();
  show(null);
  updateHud();
});
$('btn-retry').addEventListener('click', () => {
  sfx.sfxClick();
  if (!state.challenge) loseLife(); // the daily challenge is free to retry
  goHome();
});
$('btn-settings').addEventListener('click', () => {
  if (state.mode !== 'play') return;
  sfx.sfxClick();
  state.mode = 'paused';
  show('settings');
});
$('btn-resume').addEventListener('click', () => {
  sfx.sfxClick();
  state.mode = 'play';
  show(null);
});
$('btn-restart').addEventListener('click', () => {
  sfx.sfxClick();
  if (state.challenge) return startChallenge();
  if (state.shotsFired > 0) loseLife();
  startLevel();
});
$('btn-home').addEventListener('click', () => {
  sfx.sfxClick();
  if (state.shotsFired > 0 && !state.challenge) loseLife();
  goHome();
});
$('btn-refill').addEventListener('click', () => {
  if (save.coins < 120) {
    toast('Not enough coins');
    return;
  }
  save.coins -= 120;
  save.lives = MAX_LIVES;
  save.lifeTimer = 0;
  persist();
  sfx.sfxCoin();
  goHome();
});
$('btn-nolives-home').addEventListener('click', goHome);

const optSound = $('opt-sound');
const optVibe = $('opt-vibe');
optSound.checked = save.sound;
optVibe.checked = save.vibe;
optSound.addEventListener('change', () => {
  save.sound = sfx.audio.enabled = optSound.checked;
  sfx.setMusic(save.sound && save.music !== false);
  persist();
});
const optMusic = $('opt-music');
optMusic.checked = save.music !== false;
optMusic.addEventListener('change', () => {
  save.music = optMusic.checked;
  sfx.setMusic(save.sound && save.music);
  persist();
});
// Phones only allow audio after a tap: start the music on the first one.
window.addEventListener('pointerdown', () => sfx.setMusic(save.sound && save.music !== false), { once: true });
optVibe.addEventListener('change', () => {
  save.vibe = optVibe.checked;
  persist();
});

canvas.addEventListener('pointerdown', onPointerDown);
window.addEventListener('pointermove', onPointerMove);
window.addEventListener('pointerup', onPointerUp);
window.addEventListener('pointercancel', onPointerUp);

// ======================================================================
// Main loop
// ======================================================================
const clock = new THREE.Clock();
let elapsed = 0;
let uiTick = 0;

function frame() {
  const realDt = Math.min(clock.getDelta(), 1 / 20);
  updateTime(realDt);
  const dt = realDt * timeScale;
  elapsed += dt;

  if (state.mode !== 'paused') {
    stepPhysics(dt);
    syncMeshes();
    updateGame(dt);
    updateEvent(dt);
    updateSeaLife(dt);
  }
  updateLaser();
  for (const ball of state.balls) {
    if ((ball.body.userData.kind === 'fire' || ball.body.userData.mega) && ball.age < 1.5 && ball.body.position.y > 0) particles.trail(ball.body.position);
  }
  particles.update(dt);
  env.water.update(elapsed);
  env.clouds.update(dt);

  // raft bob is purely cosmetic (physics deck stays put)
  for (const r of state.rafts) {
    r.mesh.position.x = r.body.position.x;
    r.mesh.position.y = Math.sin(elapsed * 1.4 + r.def.x) * 0.04;
    r.mesh.rotation.z = Math.sin(elapsed * 1.1 + r.def.x) * 0.004;
  }

  // cannon recoil
  recoil = Math.max(0, recoil - dt * 4);
  cannon.pitch.position.z = recoil * 0.45;

  if (pointer.down) tryFire();

  // idle camera sway + impact shake
  shake = Math.max(0, shake - realDt * 2.6);
  const sk = shake * shake;
  const sx = (Math.random() - 0.5) * sk * 0.5;
  const sy = (Math.random() - 0.5) * sk * 0.5;
  camera.position.set(CAM_POS.x + Math.sin(elapsed * 0.3) * 0.12 + sx, CAM_POS.y + Math.sin(elapsed * 0.5) * 0.06 + sy, CAM_POS.z);
  camera.lookAt(CAM_LOOK);
  camera.rotation.z += (Math.random() - 0.5) * sk * 0.025;

  uiTick += dt;
  if (uiTick > 0.5) {
    uiTick = 0;
    if (state.mode === 'home') updateHome();
    if (!$('nolives').classList.contains('hidden')) {
      regenLives();
      $('heart-timer').textContent = fmtTime(HEART_REGEN_MS - (Date.now() - save.lifeTimer));
      if (save.lives > 0) goHome();
    }
  }

  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

// Outline the cannon (collect first so the new outline shells aren't outlined again)
{
  const parts = [];
  cannon.root.traverse((o) => o.isMesh && o.geometry.type !== 'TorusGeometry' && parts.push(o));
  parts.forEach((o) => addOutline(o, 0.035));
}

// Debug / test hook
window.__tidebreaker = { state, camera, fire: (x, y, z) => fire(new THREE.Vector3(x, y, z)), startLevel, save, startChallenge, usePowerup, startEvent, getLevel, sea };

goHome();
frame();

// Loading screen: fill the bar while the first frames render, then fade it away.
{
  const bar = document.querySelector('#loading .ld-bar i');
  let pct = 10;
  const tick = setInterval(() => {
    pct = Math.min(100, pct + 12 + Math.random() * 14);
    if (bar) bar.style.width = pct + '%';
    if (pct >= 100) {
      clearInterval(tick);
      setTimeout(() => $('loading').classList.add('done'), 250);
      setTimeout(() => $('loading').remove(), 900);
    }
  }, 160);
}

initNative();

if ('serviceWorker' in navigator && import.meta.env.PROD && !isNative && !isEmbedded) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

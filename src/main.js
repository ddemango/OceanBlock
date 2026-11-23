import './style.css';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { getLevel, BLOCKS, RAFT_TOP, RAFT_Z } from './levels.js';
import { buildEnvironment, buildCannon, buildRaft } from './scenery.js';
import { crateTexture, drumTexture, drumLidTexture, buoyTexture, beamTexture, ironTexture, tntTexture } from './textures.js';
import * as sfx from './audio.js';
import { celebrate, stop as stopCelebrate, countUp } from './celebrate.js';
import { isNative, isEmbedded, initNative, nativeVibrate } from './native.js';

// ======================================================================
// Save data
// ======================================================================
const SAVE_KEY = 'tidebreaker.save.v1';
const MAX_LIVES = 5;
const HEART_REGEN_MS = 15 * 60 * 1000;

const save = loadSave();
function loadSave() {
  const fallback = { level: 1, coins: 100, lives: MAX_LIVES, lifeTimer: 0, sound: true, vibe: true, music: true, stars: {}, daily: { last: '', streak: 0 } };
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
    } else if (type === 'buoy') {
      matCache[key] = new THREE.MeshStandardMaterial({ map: buoyTexture(), roughness: 0.45 });
    } else {
      const t = beamTexture();
      matCache[key] = new THREE.MeshStandardMaterial({ map: t, roughness: 0.8 });
    }
  }
  if (!matCache[key].toon) {
    const toon = toToon(matCache[key]);
    matCache[key] = toon;
    (Array.isArray(toon) ? toon : [toon]).forEach((m) => (m.toon = true));
  }
  return addOutline(new THREE.Mesh(geoCache[type], matCache[key]));
}

function blockShape(spec) {
  if (spec.shape === 'box') return new CANNON.Box(new CANNON.Vec3(spec.w / 2, spec.h / 2, spec.d / 2));
  if (spec.shape === 'cyl') return new CANNON.Cylinder(spec.r, spec.r, spec.h, 12);
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

function loadLevel(n) {
  clearLevel();
  const def = getLevel(n);
  state.level = n;
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

  for (const r of def.rafts) {
    const body = new CANNON.Body({ mass: 0, material: raftMat, type: r.drift ? CANNON.Body.KINEMATIC : CANNON.Body.STATIC });
    body.addShape(new CANNON.Box(new CANNON.Vec3(r.w / 2, 0.5, r.d / 2)));
    body.position.set(r.x, RAFT_TOP - 0.5, r.z);
    world.addBody(body);
    const mesh = buildRaft(r);
    mesh.children.slice().forEach((c) => c.isMesh && addOutline(c, 0.04));
    scene.add(mesh);
    state.rafts.push({ body, mesh, def: r });
  }

  let variant = 0;
  for (const b of def.blocks) {
    const spec = BLOCKS[b.type];
    const body = new CANNON.Body({
      mass: spec.mass,
      material: blockMat,
      linearDamping: 0.05,
      angularDamping: 0.12,
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
    body.sleep(); // towers stay perfectly still until something hits them

    const mesh = blockVisual(b.type, variant++ % 3);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    const raftIdx = state.rafts.reduce((best, r, i) => (Math.abs(r.def.x - b.x) < Math.abs(state.rafts[best].def.x - b.x) ? i : best), 0);
    const block = { body, mesh, cleared: false, sunk: false, spec, type: b.type, hp: spec.hp || 0, raft: raftIdx, lastBall: -1 };
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
    queueBurst(e.body.position.clone(), e.body.velocity.clone(), ud.bomb);
  }
  if (!state.firstHit && e.body.userData?.ball) {
    // First cannonball impact wakes the whole level so supports collapse naturally.
    state.firstHit = true;
    for (const b of state.blocks) b.body.wakeUp();
  }
}

// ---- special cargo -------------------------------------------------------
const pendingExplosions = [];
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
    popup('KABOOM!', '#ff5a3c');
    updateHud();
  }
}

// Move drifting rafts (and anything sleeping or armored on them) side to side.
function driftRafts(dt) {
  for (let i = 0; i < state.rafts.length; i++) {
    const r = state.rafts[i];
    if (!r.def.drift) continue;
    const w = 0.85;
    const targetX = r.def.x + Math.sin(elapsed * w + r.def.phase) * r.def.drift;
    const vx = (targetX - r.body.position.x) / Math.max(dt, 1 / 120);
    r.body.velocity.set(vx, 0, 0);
    for (const b of state.blocks) {
      if (b.raft !== i || b.removed || b.cleared) continue;
      if (b.hp > 0) b.body.velocity.set(vx, 0, 0); // armored cargo rides along
      else if (b.body.sleepState === CANNON.Body.SLEEPING) b.body.position.x += vx * dt; // untouched stacks ride along
    }
  }
}

// A cannonball hit bursts the nearby cargo apart (applied after the physics step).
const pendingBursts = [];
let shake = 0;
function queueBurst(pos, vel, bomb = false) {
  pendingBursts.push({ pos, vel, bomb });
}
function applyBursts() {
  while (pendingBursts.length) {
    const { pos, vel, bomb } = pendingBursts.pop();
    const R = bomb ? 5 : 2.6;
    const P = bomb ? 1.8 : 1;
    const dir = new CANNON.Vec3(vel.x, 0, vel.z);
    dir.normalize();
    for (const b of state.blocks) {
      if (b.cleared) continue;
      const d = b.body.position.vsub(pos);
      const dist = d.length();
      if (dist > R) continue;
      if (b.hp > 0) {
        if (bomb && dist < R * 0.6) damageIron(b, 2);
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
    if (bomb) {
      particles.sparks(new THREE.Vector3(pos.x, pos.y + 1, pos.z));
      particles.splash(pos, 1.5);
      sfx.sfxFire();
      popup('BOOM!', '#ff7a3c');
    }
    shake = Math.min(1, shake + (bomb ? 1 : 0.5));
    vibrate(12);
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
  const c = state.combo;
  c.count++;
  c.timer = 1.2;
  const tiers = [[12, 'AMAZING!', '#ff5a8a', 30], [8, 'AWESOME!', '#b98cff', 20], [5, 'GREAT!', '#5bc8ff', 10], [3, 'NICE!', '#ffc93c', 5]];
  for (const [n, word, color, coins] of tiers) {
    if (c.count >= n && c.shown < n) {
      c.shown = n;
      state.bonus += coins;
      popup(word, color, `+${coins} coins`);
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
const FIRE_INTERVAL = 280;
const pointer = { down: false, x: 0, y: 0 };

function onPointerDown(e) {
  sfx.unlockAudio();
  pointer.down = true;
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
}

function tryFire() {
  if (state.mode !== 'play') return;
  if (state.shots <= 0) return;
  const now = performance.now();
  if (now - lastFire < FIRE_INTERVAL) return;
  lastFire = now;

  const rect = canvas.getBoundingClientRect();
  ndc.set(((pointer.x - rect.left) / rect.width) * 2 - 1, -((pointer.y - rect.top) / rect.height) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  const targets = [...state.blocks.filter((b) => !b.cleared).map((b) => b.mesh), ...state.rafts.map((r) => r.mesh)];
  const hits = raycaster.intersectObjects(targets, true);
  let target;
  if (hits.length) target = hits[0].point.clone();
  else {
    target = new THREE.Vector3();
    if (!raycaster.ray.intersectPlane(aimPlane, target)) return;
  }
  if (target.z > cannon.root.position.z - 2.5) return; // don't shoot backwards at the pier

  fire(target);
}

const bombMatVis = new THREE.MeshStandardMaterial({ color: 0xe0352b, emissive: 0xff5a1a, emissiveIntensity: 0.9, roughness: 0.4 });
const bombGeo = new THREE.SphereGeometry(0.6, 20, 14);

function fire(target) {
  if (state.shots <= 0) return;
  const vel = aimAt(target);
  const bomb = state.bombReady;
  if (bomb) {
    state.bombReady = false;
    state.charge = 0;
  }
  const body = new CANNON.Body({
    mass: 14,
    material: ballMat,
    shape: new CANNON.Sphere(bomb ? 0.6 : 0.38),
    linearDamping: 0.01,
  });
  body.userData = { ball: true, burst: false, bomb };
  body.position.set(tipPos.x, tipPos.y, tipPos.z);
  body.velocity.set(vel.x, vel.y, vel.z);
  body.ccdSpeedThreshold = 1;
  world.addBody(body);
  const mesh = new THREE.Mesh(bomb ? bombGeo : ballGeo, bomb ? bombMatVis : ballMatVis);
  mesh.castShadow = true;
  addOutline(mesh, 0.05);
  scene.add(mesh);
  state.balls.push({ body, mesh, age: 0, splashed: false });

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
  driftRafts(dt);
  world.step(1 / 60, dt, 4);
  applyUnlocks();
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
    if (!b.cleared && y < RAFT_TOP - 0.9) {
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
    const moving = state.blocks.some((b) => !b.cleared && b.body.velocity.length() > 0.35);
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
const screens = ['home', 'win', 'fail', 'settings', 'nolives', 'daily'];
function show(id) {
  for (const s of screens) $(s).classList.toggle('hidden', s !== id);
  const hudOn = state.mode === 'play' || state.mode === 'paused' || id === 'fail';
  $('hud').classList.toggle('hidden', !hudOn);
  $('hud-progress').classList.toggle('hidden', !hudOn);
}

function updateHud() {
  $('hud-level').textContent = state.level;
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
    el.className = 'lv-node' + (lv === cur ? ' current' : done ? '' : ' locked');
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
  loadLevel(save.level);
  state.mode = 'play';
  show(null);
  updateHud();
}

function onWin() {
  state.mode = 'won';
  const used = state.shotsFired;
  const ratio = used / state.startShots;
  const stars = ratio <= 0.4 ? 3 : ratio <= 0.7 ? 2 : 1;
  const reward = 20 + state.shots * 2 + (stars - 1) * 10 + (state.bonus || 0);
  save.coins += reward;
  save.stars = save.stars || {};
  save.stars[state.level] = Math.max(save.stars[state.level] || 0, stars);
  save.level = state.level + 1;
  persist();
  countUp($('win-coins'), reward);
  $('win-level').textContent = state.level;
  updateHome(); // refresh the coin + heart counters in the top bar
  celebrate();
  $('win-detail').textContent = `Cleared with ${used} shot${used === 1 ? '' : 's'} · ${state.shots} spare`;
  document.querySelectorAll('.stars span').forEach((s, i) => s.classList.toggle('on', i < stars));
  sfx.sfxWin();
  setTimeout(sfx.sfxCoin, 450);
  vibrate([30, 40, 30]);
  show('win');
}

function onFail() {
  state.mode = 'failed';
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
  loseLife();
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
  if (state.shotsFired > 0) loseLife();
  startLevel();
});
$('btn-home').addEventListener('click', () => {
  sfx.sfxClick();
  if (state.shotsFired > 0) loseLife();
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
  const dt = Math.min(clock.getDelta(), 1 / 20);
  elapsed += dt;

  if (state.mode !== 'paused') {
    stepPhysics(dt);
    syncMeshes();
    updateGame(dt);
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
  shake = Math.max(0, shake - dt * 3);
  const sx = (Math.random() - 0.5) * shake * 0.25;
  const sy = (Math.random() - 0.5) * shake * 0.25;
  camera.position.set(CAM_POS.x + Math.sin(elapsed * 0.3) * 0.12 + sx, CAM_POS.y + Math.sin(elapsed * 0.5) * 0.06 + sy, CAM_POS.z);
  camera.lookAt(CAM_LOOK);

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
window.__tidebreaker = { state, camera, fire: (x, y, z) => fire(new THREE.Vector3(x, y, z)), startLevel, save };

goHome();
frame();

initNative();

if ('serviceWorker' in navigator && import.meta.env.PROD && !isNative && !isEmbedded) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

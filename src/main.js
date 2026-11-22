import './style.css';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { getLevel, BLOCKS, RAFT_TOP, RAFT_Z } from './levels.js';
import { buildEnvironment, buildCannon, buildRaft } from './scenery.js';
import { crateTexture, drumTexture, drumLidTexture, buoyTexture, beamTexture } from './textures.js';
import * as sfx from './audio.js';

// ======================================================================
// Save data
// ======================================================================
const SAVE_KEY = 'tidebreaker.save.v1';
const MAX_LIVES = 5;
const HEART_REGEN_MS = 15 * 60 * 1000;

const save = loadSave();
function loadSave() {
  const fallback = { level: 1, coins: 100, lives: MAX_LIVES, lifeTimer: 0, sound: true, vibe: true };
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
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 400);
const CAM_POS = new THREE.Vector3(0, 6.0, 9.5);
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
  const wantH = THREE.MathUtils.degToRad(39);
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
world.broadphase = new CANNON.SAPBroadphase(world);
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
world.addContactMaterial(new CANNON.ContactMaterial(ballMat, raftMat, { friction: 0.4, restitution: 0.3 }));

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
    } else if (type === 'buoy') {
      matCache[key] = new THREE.MeshStandardMaterial({ map: buoyTexture(), roughness: 0.45 });
    } else {
      const t = beamTexture();
      matCache[key] = new THREE.MeshStandardMaterial({ map: t, roughness: 0.8 });
    }
  }
  return new THREE.Mesh(geoCache[type], matCache[key]);
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
  particles.clear();
}

function loadLevel(n) {
  clearLevel();
  const def = getLevel(n);
  state.level = n;
  state.shots = def.shots;
  state.startShots = def.shots;
  state.shotsFired = 0;
  state.extraUsed = false;
  state.endTimer = 0;
  state.firstHit = false;

  for (const r of def.rafts) {
    const body = new CANNON.Body({ mass: 0, material: raftMat });
    body.addShape(new CANNON.Box(new CANNON.Vec3(r.w / 2, 0.5, r.d / 2)));
    body.position.set(r.x, RAFT_TOP - 0.5, r.z);
    world.addBody(body);
    const mesh = buildRaft(r);
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
    body.position.set(b.x, b.y + 0.001, b.z);
    if (b.ry) body.quaternion.setFromEuler(0, b.ry, 0);
    world.addBody(body);
    body.sleep(); // towers stay perfectly still until something hits them

    const mesh = blockVisual(b.type, variant++ % 3);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    const block = { body, mesh, cleared: false, sunk: false, spec };
    body.addEventListener('collide', (e) => onBlockCollide(block, e));
    state.blocks.push(block);
  }
  syncMeshes();
  updateHud();
}

function onBlockCollide(block, e) {
  const impact = Math.abs(e.contact.getImpactVelocityAlongNormal());
  if (impact > 2.5 && state.mode === 'play') sfx.sfxHit(impact / 12);
  if (!state.firstHit && e.body.userData?.ball) {
    // First cannonball impact wakes the whole level so supports collapse naturally.
    state.firstHit = true;
    for (const b of state.blocks) b.body.wakeUp();
  }
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
  const t = 0.42 + dist / 42;
  const g = world.gravity.y;
  return new THREE.Vector3(d.x / t, (d.y - 0.5 * g * t * t) / t, d.z / t);
}

function onPointerDown(e) {
  sfx.unlockAudio();
  if (state.mode !== 'play') return;
  if (state.shots <= 0) return;
  const now = performance.now();
  if (now - lastFire < 220) return;
  lastFire = now;

  const rect = canvas.getBoundingClientRect();
  ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
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

function fire(target) {
  const vel = aimAt(target);
  const body = new CANNON.Body({
    mass: 9,
    material: ballMat,
    shape: new CANNON.Sphere(0.38),
    linearDamping: 0.01,
  });
  body.userData = { ball: true };
  body.position.set(tipPos.x, tipPos.y, tipPos.z);
  body.velocity.set(vel.x, vel.y, vel.z);
  body.ccdSpeedThreshold = 1;
  world.addBody(body);
  const mesh = new THREE.Mesh(ballGeo, ballMatVis);
  mesh.castShadow = true;
  scene.add(mesh);
  state.balls.push({ body, mesh, age: 0, splashed: false });

  state.shots--;
  state.shotsFired++;
  recoil = 1;
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
    muzzle(pos, vel) {
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
      body.applyForce(new CANNON.Vec3(0, body.mass * 14, 0), body.position);
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
  world.step(1 / 60, dt, 4);
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
const screens = ['home', 'win', 'fail', 'settings', 'nolives'];
function show(id) {
  for (const s of screens) $(s).classList.toggle('hidden', s !== id);
  $('hud').classList.toggle('hidden', !(state.mode === 'play' || state.mode === 'paused' || id === 'fail' || id === 'win'));
}

function updateHud() {
  $('hud-level').textContent = state.level;
  $('hud-shots').textContent = state.shots;
  $('hud-left').textContent = blocksRemaining();
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
  if (save.vibe && navigator.vibrate) navigator.vibrate(ms);
}

function goHome() {
  state.mode = 'home';
  loadLevel(save.level); // show the next level's cargo behind the menu
  updateHome();
  show('home');
}

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
  const reward = 20 + state.shots * 2 + (stars - 1) * 10;
  save.coins += reward;
  save.level = state.level + 1;
  persist();
  $('win-coins').textContent = reward;
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
  persist();
});
optVibe.addEventListener('change', () => {
  save.vibe = optVibe.checked;
  persist();
});

canvas.addEventListener('pointerdown', onPointerDown);

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
    r.mesh.position.y = Math.sin(elapsed * 1.4 + r.def.x) * 0.04;
    r.mesh.rotation.z = Math.sin(elapsed * 1.1 + r.def.x) * 0.004;
  }

  // cannon recoil
  recoil = Math.max(0, recoil - dt * 4);
  cannon.pitch.position.z = recoil * 0.45;

  // idle camera sway
  camera.position.set(CAM_POS.x + Math.sin(elapsed * 0.3) * 0.12, CAM_POS.y + Math.sin(elapsed * 0.5) * 0.06, CAM_POS.z);
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

// Debug / test hook
window.__tidebreaker = { state, fire: (x, y, z) => fire(new THREE.Vector3(x, y, z)), startLevel, save };

goHome();
frame();

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

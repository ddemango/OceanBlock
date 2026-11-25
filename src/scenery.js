import * as THREE from 'three';
import { logTexture, skyTexture, ropeTexture, plankTexture } from './textures.js';
import { RAFT_TOP } from './levels.js';

export function buildEnvironment(scene) {
  scene.background = skyTexture();
  scene.fog = new THREE.Fog(0xbfe9f7, 90, 300);

  const hemi = new THREE.HemisphereLight(0xdff6ff, 0x2a7da0, 1.25);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xfff3dc, 2.2);
  sun.position.set(-12, 26, 8);
  sun.target.position.set(0, 0, -11);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  const sc = sun.shadow.camera;
  sc.left = -14; sc.right = 14; sc.top = 14; sc.bottom = -10;
  sc.near = 5; sc.far = 70;
  sun.shadow.bias = -0.0008;
  sun.shadow.normalBias = 0.03;
  scene.add(sun, sun.target);

  const water = buildWater();
  scene.add(water.mesh);

  buildIslands(scene);
  const rays = buildSunRays(scene);
  const clouds = buildClouds(scene);
  buildShipDeck(scene);

  // Swap the whole mood of the scene (sky, fog, light, water, clouds).
  function setTheme(name) {
    const t = THEMES[name] || THEMES.day;
    if (scene.background) scene.background.dispose();
    scene.background = skyTexture(t.sky);
    scene.fog.color.set(t.fog);
    hemi.color.set(t.hemiSky);
    hemi.groundColor.set(t.hemiGround);
    hemi.intensity = t.hemiI;
    sun.color.set(t.sun);
    sun.intensity = t.sunI;
    water.setColors(t.water);
    clouds.setTint(t.cloud);
    rays.forEach((r) => (r.visible = t.rays));
  }

  return { water, clouds, setTheme };
}

export const THEMES = {
  day:    { label: 'Sunny Bay',      sky: ['#1f8be8', '#6cc9f7', '#d9f6ff'], fog: 0xbcecfa, hemiSky: 0xe6f8ff, hemiGround: 0x2a8db0, hemiI: 1.35, sun: 0xfff6e2, sunI: 2.3, water: [0x0b5fb8, 0x0f9ad6, 0x5ee2f6], cloud: 0xdff2fb, rays: true },
  sunset: { label: 'Golden Sunset',  sky: ['#4a3a8c', '#ff8a5c', '#ffd59a'], fog: 0xffb98a, hemiSky: 0xffd2b0, hemiGround: 0x5a3a6a, hemiI: 1.1,  sun: 0xffb070, sunI: 2.4, water: [0x2a3f8a, 0x3f7fc0, 0xffb98a], cloud: 0xffb08a, rays: true },
  night:  { label: 'Moonlit Lagoon', sky: ['#0a1236', '#1f3a7a', '#3c6aa8'], fog: 0x23406e, hemiSky: 0x8fb0ff, hemiGround: 0x101a3a, hemiI: 0.9,  sun: 0xb8ccff, sunI: 1.6, water: [0x06204a, 0x0d3f78, 0x5f9ad8], cloud: 0x3a5288, rays: false },
  storm:  { label: 'Storm Waters',   sky: ['#3d4a5c', '#6f7f93', '#a9b6c4'], fog: 0x8a97a6, hemiSky: 0xc4cfdb, hemiGround: 0x2a3440, hemiI: 1.05, sun: 0xdfe6ee, sunI: 1.5, water: [0x1d3a52, 0x2f5d78, 0x9fc0d0], cloud: 0x7d8a99, rays: false },
};
// Mostly bright daytime seas; a new mood every 10 levels.
export const themeForLevel = (n) => ['day', 'sunset', 'day', 'night', 'day', 'storm'][Math.floor((n - 1) / 10) % 6];

// ---------- water: animated vertex waves ----------
function buildWater() {
  const size = 220;
  const seg = 90;
  const geo = new THREE.PlaneGeometry(size, size, seg, seg);
  geo.rotateX(-Math.PI / 2);
  const base = geo.attributes.position.array.slice();
  const colors = new Float32Array(geo.attributes.position.count * 3);
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    vertexColors: true,
    roughness: 0.35,
    metalness: 0.05,
    flatShading: true,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.z = -40;
  mesh.receiveShadow = true;

  const deep = new THREE.Color(0x0b74b5);
  const mid = new THREE.Color(0x14a6d6);
  const crest = new THREE.Color(0x7fe3f5);
  function setColors([d, m, c]) {
    deep.set(d);
    mid.set(m);
    crest.set(c);
  }
  const tmp = new THREE.Color();

  function update(t) {
    const pos = geo.attributes.position.array;
    for (let i = 0; i < pos.length; i += 3) {
      const x = base[i];
      const z = base[i + 2];
      const h =
        Math.sin(x * 0.18 + t * 1.1) * 0.18 +
        Math.cos(z * 0.23 + t * 0.9) * 0.16 +
        Math.sin((x + z) * 0.45 + t * 1.7) * 0.06;
      pos[i + 1] = h;
      const k = THREE.MathUtils.clamp((h + 0.3) / 0.7, 0, 1);
      const dist = Math.min(1, Math.abs(z) / 110);
      tmp.copy(mid).lerp(deep, dist * 0.8);
      tmp.lerp(crest, k * k * 0.42);
      colors[i] = tmp.r; colors[i + 1] = tmp.g; colors[i + 2] = tmp.b;
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
    geo.computeVertexNormals();
  }
  update(0);
  return { mesh, update, setColors };
}

// Rounded cliff headlands with grassy tops on the horizon, plus a few rocks near the shore.
function buildIslands(scene) {
  const rock = new THREE.MeshStandardMaterial({ color: 0x5b78a8, roughness: 0.85 });
  const rockWarm = new THREE.MeshStandardMaterial({ color: 0xd98a6a, roughness: 0.9 });
  const grass = new THREE.MeshStandardMaterial({ color: 0x58b85a, roughness: 0.8 });
  const blob = (r, mat, sx = 1, sy = 1, sz = 1) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 12), mat);
    m.scale.set(sx, sy, sz);
    return m;
  };
  // big headland behind the rafts (left-centre), a smaller one on the right
  const lands = [
    { x: 18, z: -120, s: 1.35 },
    { x: -70, z: -105, s: 0.9 },
  ];
  for (const L of lands) {
    const g = new THREE.Group();
    const body = blob(30, rock, 1.6, 0.55, 0.7);
    body.position.y = 2;
    const cliff = blob(22, rock, 1.3, 0.75, 0.55);
    cliff.position.set(-14, 6, 6);
    const top = blob(29, grass, 1.55, 0.28, 0.68);
    top.position.set(0, 14, -2);
    const top2 = blob(20, grass, 1.3, 0.3, 0.55);
    top2.position.set(-14, 19, 4);
    g.add(body, cliff, top, top2);
    g.scale.setScalar(L.s);
    g.position.set(L.x, -6, L.z);
    scene.add(g);
  }
  // warm rocks poking out of the water at the sides
  for (const [x, z, r] of [[-26, -40, 3], [-22, -44, 2], [28, -38, 2.6], [32, -42, 1.8], [-40, -70, 4], [44, -66, 3.5]]) {
    const m = blob(r, rockWarm, 1.3, 0.8, 1);
    m.position.set(x, -0.2, z);
    m.rotation.y = x;
    scene.add(m);
  }
}

function buildClouds(scene) {
  const mat = new THREE.MeshLambertMaterial({ color: 0xffffff, emissive: 0xc8e6f5, fog: false });
  const clouds = [];
  for (let i = 0; i < 6; i++) {
    const g = new THREE.Group();
    const big = i === 2; // one towering cumulus behind the headland
    const puffs = big ? 9 : 4 + Math.floor(Math.random() * 3);
    for (let p = 0; p < puffs; p++) {
      const r = (big ? 9 : 4) + Math.random() * (big ? 6 : 3);
      const m = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), mat);
      if (big) m.position.set((p % 4) * 10 - 15 + Math.random() * 4, Math.floor(p / 4) * 9 + Math.random() * 3, Math.random() * 4);
      else m.position.set(p * 5 - puffs * 2.5, Math.random() * 2, Math.random() * 2);
      m.scale.y = big ? 0.9 : 0.6;
      g.add(m);
    }
    g.position.set(big ? 0 : -110 + i * 42 + Math.random() * 10, big ? 30 : 46 + Math.random() * 14, big ? -175 : -150 - Math.random() * 20);
    scene.add(g);
    clouds.push(g);
  }
  return {
    setTint(hex) {
      mat.emissive.set(hex);
    },
    update(dt) {
      for (const c of clouds) {
        c.position.x += dt * 1.2;
        if (c.position.x > 120) c.position.x = -120;
      }
    },
  };
}

// The deck of our ship (bottom of the screen): planks, a wooden railing with posts and thick rope swags.
function buildShipDeck(scene) {
  const deckTex = plankTexture();
  deckTex.repeat.set(6, 2);
  deckTex.rotation = Math.PI / 2;
  const deck = new THREE.Mesh(new THREE.BoxGeometry(34, 0.4, 12), new THREE.MeshStandardMaterial({ map: deckTex, roughness: 0.85 }));
  deck.position.set(0, 1.15, 8.6);
  deck.receiveShadow = true;
  const hullTex = plankTexture('#8a4a22');
  hullTex.repeat.set(8, 1);
  const hullMat = new THREE.MeshStandardMaterial({ map: hullTex, roughness: 0.8 });
  const railMat = new THREE.MeshStandardMaterial({ color: 0x7a3f1c, roughness: 0.6 });
  const trimMat = new THREE.MeshStandardMaterial({ color: 0xe8b04a, roughness: 0.4, metalness: 0.5 });
  // bulwark (side wall of the ship) and its top rail, just in front of the cannon
  const RZ = 3.0;
  const wall = new THREE.Mesh(new THREE.BoxGeometry(34, 0.7, 0.3), hullMat);
  wall.position.set(0, 1.5, RZ);
  const rail = new THREE.Mesh(new THREE.BoxGeometry(34, 0.18, 0.45), railMat);
  rail.position.set(0, 1.92, RZ);
  const trim = new THREE.Mesh(new THREE.BoxGeometry(34, 0.06, 0.47), trimMat);
  trim.position.set(0, 1.8, RZ);
  for (const m of [deck, wall, rail, trim]) m.receiveShadow = true;
  scene.add(deck, wall, rail, trim);
  // posts with gold caps, and rope swags hanging between them
  const ropeTex = ropeTexture();
  ropeTex.repeat.set(10, 1);
  const ropeMat = new THREE.MeshStandardMaterial({ map: ropeTex, roughness: 1 });
  const postMat = new THREE.MeshStandardMaterial({ color: 0x6b3416, roughness: 0.7 });
  const xs = [];
  for (let x = -16.5; x <= 16.5; x += 3) xs.push(x);
  for (const x of xs) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.42, 10), postMat);
    post.position.set(x, 2.22, RZ);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), trimMat);
    cap.position.set(x, 2.46, RZ);
    post.castShadow = true;
    scene.add(post, cap);
  }
  for (let i = 0; i < xs.length - 1; i++) {
    const a = xs[i], b = xs[i + 1];
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(a, 2.38, RZ),
      new THREE.Vector3(a + 0.7, 2.12, RZ + 0.05),
      new THREE.Vector3((a + b) / 2, 2.0, RZ + 0.08),
      new THREE.Vector3(b - 0.7, 2.12, RZ + 0.05),
      new THREE.Vector3(b, 2.38, RZ),
    ]);
    const rope = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.085, 8), ropeMat);
    rope.castShadow = true;
    scene.add(rope);
  }
}

// ---------- cannon (bronze barrel on a teal carriage) ----------
export function buildCannon() {
  const root = new THREE.Group();
  const bronze = new THREE.MeshStandardMaterial({ color: 0xc7863a, metalness: 0.35, roughness: 0.3 });
  const darkBronze = new THREE.MeshStandardMaterial({ color: 0x7a4a1c, metalness: 0.55, roughness: 0.3, emissive: 0x2a1800 });
  const carriageMat = new THREE.MeshStandardMaterial({ color: 0x1f8a8a, roughness: 0.6 });
  const trim = new THREE.MeshStandardMaterial({ color: 0xf2b630, roughness: 0.35, metalness: 0.5 });
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x5a3b22, roughness: 0.8 });

  // carriage (static base)
  const base = new THREE.Group();
  for (const sx of [-1, 1]) {
    const cheek = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.9, 2.2), carriageMat);
    cheek.position.set(sx * 0.62, 0.55, 0.1);
    const cheekTrim = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 2.22), trim);
    cheekTrim.position.set(sx * 0.62, 1.0, 0.1);
    base.add(cheek, cheekTrim);
    for (const z of [-0.6, 0.8]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.22, 14), wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(sx * 0.85, 0.38, z);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.26, 8), trim);
      hub.rotation.z = Math.PI / 2;
      hub.position.copy(wheel.position);
      base.add(wheel, hub);
    }
  }
  const axleBed = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.25, 2.0), carriageMat);
  axleBed.position.set(0, 0.25, 0.1);
  base.add(axleBed);

  // yaw + pitch pivots
  const yaw = new THREE.Group();
  yaw.position.set(0, 1.05, 0);
  const pitch = new THREE.Group();
  yaw.add(pitch);

  const barrelLen = 3.0;
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.5, barrelLen, 20), bronze);
  barrel.rotation.x = -Math.PI / 2; // point along -Z
  barrel.position.z = -barrelLen / 2 + 0.6;
  pitch.add(barrel);
  for (const [z, r] of [[0.5, 0.56], [-0.5, 0.48], [-1.5, 0.43], [-2.25, 0.42]]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.06, 8, 24), darkBronze);
    ring.position.z = z;
    pitch.add(ring);
  }
  const muzzle = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.12, 10, 24), darkBronze);
  muzzle.position.z = -barrelLen + 0.6;
  pitch.add(muzzle);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.26, 14, 10), darkBronze);
  knob.position.z = 0.92;
  pitch.add(knob);
  const trunnion = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.3, 10), darkBronze);
  trunnion.rotation.z = Math.PI / 2;
  pitch.add(trunnion);

  const tip = new THREE.Object3D();
  tip.position.z = -barrelLen + 0.5;
  pitch.add(tip);

  root.add(base, yaw);
  root.traverse((o) => {
    if (o.isMesh) o.castShadow = true;
  });
  // Recolor the cannon (paint jobs from the Armory).
  function setSkin({ barrel: b, bands, carriage }) {
    bronze.color.set(b);
    darkBronze.color.set(bands);
    carriageMat.color.set(carriage);
  }
  return { root, yaw, pitch, tip, barrel, setSkin };
}

// ---------- raft: a painted wooden barge sitting low in the water ----------
export function buildRaft({ x, z, w, d }) {
  const g = new THREE.Group();
  const deckTex = plankTexture('#e98a3a');
  deckTex.repeat.set(Math.max(1, w / 3), 1);
  const deckMat = new THREE.MeshStandardMaterial({ map: deckTex, roughness: 0.75 });
  const hullMat = new THREE.MeshStandardMaterial({ color: 0xc8551f, roughness: 0.6 });
  const edgeMat = new THREE.MeshStandardMaterial({ color: 0x5a2a14, roughness: 0.6 });
  const stripeMat = new THREE.MeshStandardMaterial({ color: 0xffc35a, roughness: 0.5 });
  const hull = new THREE.Mesh(new THREE.BoxGeometry(w + 0.2, 0.75, d + 0.2), hullMat);
  hull.position.y = RAFT_TOP - 0.42;
  const deck = new THREE.Mesh(new THREE.BoxGeometry(w, 0.1, d), deckMat);
  deck.position.y = RAFT_TOP - 0.05;
  const lip = new THREE.Mesh(new THREE.BoxGeometry(w + 0.36, 0.16, d + 0.36), edgeMat);
  lip.position.y = RAFT_TOP - 0.14;
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(w + 0.22, 0.09, d + 0.22), stripeMat);
  stripe.position.y = RAFT_TOP - 0.45;
  for (const m of [hull, deck, lip, stripe]) {
    m.castShadow = true;
    m.receiveShadow = true;
    g.add(m);
  }
  // rounded bumpers on the corners
  for (const sx of [-1, 1]) {
    const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, d - 0.3, 4, 8), edgeMat);
    b.rotation.x = Math.PI / 2;
    b.position.set(sx * (w / 2 + 0.12), RAFT_TOP - 0.35, 0);
    g.add(b);
  }
  g.position.set(x, 0, z);
  return g;
}

// Soft light shafts slanting down from the top of the sky.
function buildSunRays(scene) {
  const c = document.createElement('canvas');
  c.width = 64; c.height = 256;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, 'rgba(255,255,240,0.55)');
  grad.addColorStop(1, 'rgba(255,255,240,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 256);
  const side = g.createLinearGradient(0, 0, 64, 0);
  side.addColorStop(0, 'rgba(0,0,0,1)'); side.addColorStop(0.5, 'rgba(0,0,0,0)'); side.addColorStop(1, 'rgba(0,0,0,1)');
  g.globalCompositeOperation = 'destination-out';
  g.fillStyle = side;
  g.fillRect(0, 0, 64, 256);
  const tex = new THREE.CanvasTexture(c);
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, opacity: 0.55 });
  const rays = [];
  for (let i = 0; i < 6; i++) {
    const ray = new THREE.Mesh(new THREE.PlaneGeometry(3 + Math.random() * 4, 40), mat);
    ray.position.set(-14 + i * 5.5, 18, -30 - i * 3);
    ray.rotation.z = -0.35;
    scene.add(ray);
    rays.push(ray);
  }
  return rays;
}

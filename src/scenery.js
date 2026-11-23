import * as THREE from 'three';
import { logTexture, stoneTexture, skyTexture } from './textures.js';
import { RAFT_TOP } from './levels.js';

export function buildEnvironment(scene) {
  scene.background = skyTexture();
  scene.fog = new THREE.Fog(0xbfe9f7, 60, 170);

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
  buildPier(scene);

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
  day:    { label: 'Sunny Bay',      sky: ['#2b8fe6', '#7fd0f7', '#e6f8ff'], fog: 0xbfe9f7, hemiSky: 0xdff6ff, hemiGround: 0x2a7da0, hemiI: 1.25, sun: 0xfff3dc, sunI: 2.2, water: [0x0b74b5, 0x14a6d6, 0x7fe3f5], cloud: 0xc8e6f5, rays: true },
  sunset: { label: 'Golden Sunset',  sky: ['#4a3a8c', '#ff8a5c', '#ffd59a'], fog: 0xffb98a, hemiSky: 0xffd2b0, hemiGround: 0x5a3a6a, hemiI: 1.1,  sun: 0xffb070, sunI: 2.4, water: [0x2a3f8a, 0x3f7fc0, 0xffb98a], cloud: 0xffb08a, rays: true },
  night:  { label: 'Moonlit Lagoon', sky: ['#0a1236', '#1f3a7a', '#3c6aa8'], fog: 0x23406e, hemiSky: 0x8fb0ff, hemiGround: 0x101a3a, hemiI: 0.9,  sun: 0xb8ccff, sunI: 1.6, water: [0x06204a, 0x0d3f78, 0x5f9ad8], cloud: 0x3a5288, rays: false },
  storm:  { label: 'Storm Waters',   sky: ['#3d4a5c', '#6f7f93', '#a9b6c4'], fog: 0x8a97a6, hemiSky: 0xc4cfdb, hemiGround: 0x2a3440, hemiI: 1.05, sun: 0xdfe6ee, sunI: 1.5, water: [0x1d3a52, 0x2f5d78, 0x9fc0d0], cloud: 0x7d8a99, rays: false },
};
export const themeForLevel = (n) => ['day', 'sunset', 'night', 'storm'][Math.floor((n - 1) / 5) % 4];

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
      tmp.lerp(crest, k * k * 0.55);
      colors[i] = tmp.r; colors[i + 1] = tmp.g; colors[i + 2] = tmp.b;
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
    geo.computeVertexNormals();
  }
  update(0);
  return { mesh, update, setColors };
}

function buildIslands(scene) {
  const rock = new THREE.MeshStandardMaterial({ color: 0x6f86a8, roughness: 0.9, flatShading: true });
  const grass = new THREE.MeshStandardMaterial({ color: 0x5cc265, roughness: 0.8, flatShading: true });
  const sand = new THREE.MeshStandardMaterial({ color: 0xf2d79b, roughness: 1, flatShading: true });
  const specs = [
    { x: -55, z: -95, r: 26, h: 18 },
    { x: 48, z: -110, r: 34, h: 26 },
    { x: 8, z: -130, r: 22, h: 12 },
    { x: -30, z: -60, r: 6, h: 4 },
    { x: 34, z: -55, r: 5, h: 3.5 },
  ];
  for (const s of specs) {
    const g = new THREE.Group();
    const beach = new THREE.Mesh(new THREE.CylinderGeometry(s.r * 1.08, s.r * 1.15, 1.2, 9), sand);
    beach.position.y = 0;
    const body = new THREE.Mesh(new THREE.ConeGeometry(s.r, s.h, 8, 2), rock);
    body.position.y = s.h / 2;
    const cap = new THREE.Mesh(new THREE.ConeGeometry(s.r * 0.62, s.h * 0.45, 8, 1), grass);
    cap.position.y = s.h * 0.78;
    g.add(beach, body, cap);
    // a couple of palm trees on the bigger islands
    if (s.r > 20) {
      for (let i = 0; i < 3; i++) {
        const palm = buildPalm();
        const a = (i / 3) * Math.PI * 2 + 0.6;
        palm.position.set(Math.cos(a) * s.r * 0.95, 0.4, Math.sin(a) * s.r * 0.95 + s.r * 0.1);
        palm.scale.setScalar(2.4);
        g.add(palm);
      }
    }
    g.position.set(s.x, -0.3, s.z);
    g.rotation.y = s.x * 0.1;
    scene.add(g);
  }
}

function buildPalm() {
  const g = new THREE.Group();
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x9c6b3f, flatShading: true });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x2fa85a, flatShading: true, side: THREE.DoubleSide });
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 3, 5), trunkMat);
  trunk.position.y = 1.5;
  trunk.rotation.z = 0.15;
  g.add(trunk);
  for (let i = 0; i < 5; i++) {
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.8, 3), leafMat);
    leaf.position.set(0.22, 3, 0);
    leaf.rotation.set(0, (i / 5) * Math.PI * 2, Math.PI / 2.3);
    leaf.translateY(0.8);
    g.add(leaf);
  }
  return g;
}

function buildClouds(scene) {
  const mat = new THREE.MeshLambertMaterial({ color: 0xffffff, emissive: 0xc8e6f5, flatShading: true, fog: false });
  const clouds = [];
  for (let i = 0; i < 7; i++) {
    const g = new THREE.Group();
    const puffs = 4 + Math.floor(Math.random() * 3);
    for (let p = 0; p < puffs; p++) {
      const m = new THREE.Mesh(new THREE.IcosahedronGeometry(3 + Math.random() * 3, 0), mat);
      m.position.set(p * 4 - puffs * 2, Math.random() * 2, Math.random() * 2);
      m.scale.y = 0.65;
      g.add(m);
    }
    g.position.set(-90 + i * 30 + Math.random() * 10, 34 + Math.random() * 16, -130 - Math.random() * 30);
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

// Stone pier the cannon stands on (bottom of the screen).
function buildPier(scene) {
  const tex = stoneTexture();
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 1);
  const stone = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 });
  const top = new THREE.MeshStandardMaterial({ color: 0xc6b08a, roughness: 0.9 });
  const pier = new THREE.Mesh(new THREE.BoxGeometry(30, 2.2, 8), stone);
  pier.position.set(0, 0, 7);
  pier.receiveShadow = true;
  const cap = new THREE.Mesh(new THREE.BoxGeometry(30.4, 0.3, 8.4), top);
  cap.position.set(0, 1.25, 7);
  cap.receiveShadow = true;
  scene.add(pier, cap);

  const bollardMat = new THREE.MeshStandardMaterial({ color: 0x2f3b52, roughness: 0.5, metalness: 0.4 });
  for (const x of [-4.2, 4.2]) {
    const b = new THREE.Group();
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.4, 0.9, 12), bollardMat);
    post.position.y = 0.45;
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.36, 0.25, 12), bollardMat);
    head.position.y = 0.95;
    b.add(post, head);
    b.position.set(x, 1.4, 3.6);
    b.traverse((o) => (o.castShadow = true));
    scene.add(b);
  }

  // rope between bollards
  const ropeMat = new THREE.MeshStandardMaterial({ color: 0xe9d6a6, roughness: 1 });
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-4.2, 2.3, 3.6),
    new THREE.Vector3(-2, 1.7, 3.4),
    new THREE.Vector3(2, 1.7, 3.4),
    new THREE.Vector3(4.2, 2.3, 3.6),
  ]);
  const rope = new THREE.Mesh(new THREE.TubeGeometry(curve, 30, 0.07, 6), ropeMat);
  scene.add(rope);
}

// ---------- cannon (bronze barrel on a teal carriage) ----------
export function buildCannon() {
  const root = new THREE.Group();
  const bronze = new THREE.MeshStandardMaterial({ color: 0xc7863a, metalness: 0.75, roughness: 0.32 });
  const darkBronze = new THREE.MeshStandardMaterial({ color: 0x7a4a1c, metalness: 0.6, roughness: 0.4 });
  const carriageMat = new THREE.MeshStandardMaterial({ color: 0x1f8a8a, roughness: 0.6 });
  const trim = new THREE.MeshStandardMaterial({ color: 0xf4e3b5, roughness: 0.5 });
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
  const muzzle = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.1, 10, 24), bronze);
  muzzle.position.z = -barrelLen + 0.6;
  pitch.add(muzzle);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.26, 14, 10), bronze);
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

// ---------- raft: logs lashed together, sitting on the water ----------
export function buildRaft({ x, z, w, d }) {
  const g = new THREE.Group();
  const tex = logTexture();
  const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 });
  const endMat = new THREE.MeshStandardMaterial({ color: 0xe0b580, roughness: 0.9 });
  const logR = 0.32;
  const n = Math.max(3, Math.round(d / (logR * 2)));
  const step = d / n;
  for (let i = 0; i < n; i++) {
    const log = new THREE.Mesh(new THREE.CylinderGeometry(logR, logR, w + 0.3, 10), [mat, endMat, endMat]);
    log.rotation.z = Math.PI / 2;
    log.position.set(0, RAFT_TOP - logR, -d / 2 + step / 2 + i * step);
    log.castShadow = true;
    log.receiveShadow = true;
    g.add(log);
  }
  // deck boards so blocks visually rest on a flat surface
  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(w, 0.08, d),
    new THREE.MeshStandardMaterial({ color: 0xd9a86c, roughness: 0.9 })
  );
  deck.position.y = RAFT_TOP - 0.04;
  deck.receiveShadow = true;
  g.add(deck);
  // rope lashings
  const ropeMat = new THREE.MeshStandardMaterial({ color: 0xf1e2b8, roughness: 1 });
  for (const sx of [-0.42, 0.42]) {
    const band = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.7, d + 0.08), ropeMat);
    band.position.set(sx * w, RAFT_TOP - 0.32, 0);
    g.add(band);
  }
  // orange floats beneath
  const floatMat = new THREE.MeshStandardMaterial({ color: 0xff7a59, roughness: 0.6 });
  for (const sx of [-0.5, 0.5]) {
    const f = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, d - 0.6, 4, 10), floatMat);
    f.rotation.x = Math.PI / 2;
    f.position.set(sx * w, -0.05, 0);
    g.add(f);
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

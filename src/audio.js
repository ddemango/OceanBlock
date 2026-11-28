// Tiny synthesized sound kit (WebAudio) — no audio files needed.

let ctx = null;
let master = null;
let noiseBuf = null;
export const audio = { enabled: true };

function ensure() {
  if (!audio.enabled) return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.6;
    master.connect(ctx.destination);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function unlockAudio() {
  ensure();
}

function noise(dur, type, freq, q, gain, when = 0) {
  const c = ensure();
  if (!c) return;
  const t = c.currentTime + when;
  const src = c.createBufferSource();
  src.buffer = noiseBuf;
  const f = c.createBiquadFilter();
  f.type = type;
  f.frequency.setValueAtTime(freq, t);
  f.Q.value = q;
  const g = c.createGain();
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  src.connect(f).connect(g).connect(master);
  src.start(t, Math.random() * 0.5, dur + 0.05);
  return f;
}

function tone(freqA, freqB, dur, type, gain, when = 0) {
  const c = ensure();
  if (!c) return;
  const t = c.currentTime + when;
  const o = c.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(freqA, t);
  o.frequency.exponentialRampToValueAtTime(freqB, t + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.05);
}

export function sfxFire() {
  const f = noise(0.45, 'lowpass', 1800, 0.7, 0.9);
  if (f) f.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.4);
  tone(140, 40, 0.35, 'sine', 0.8);
}

export function sfxSplash(strength = 1) {
  noise(0.5, 'bandpass', 900 + Math.random() * 500, 0.8, 0.25 * strength);
  noise(0.25, 'highpass', 3000, 0.5, 0.08 * strength, 0.04);
}

let lastHit = 0;
export function sfxHit(strength = 1, type = 'crate') {
  const c = ensure();
  if (!c) return;
  if (c.currentTime - lastHit < 0.045) return;
  lastHit = c.currentTime;
  const s = Math.min(1, strength);
  if (type.includes('drum') || type === 'tnt') {
    // hollow metal drum: ringing ping
    tone(520 + Math.random() * 160, 480, 0.22, 'triangle', 0.18 * s);
    tone(1240 + Math.random() * 200, 1180, 0.12, 'sine', 0.08 * s);
  } else if (type === 'iron') {
    tone(300, 280, 0.25, 'square', 0.07 * s);
  } else if (type === 'buoy') {
    tone(700, 300, 0.1, 'sine', 0.2 * s);
  } else {
    // wooden crate: dull knock
    tone(180 + Math.random() * 60, 70, 0.1, 'triangle', 0.3 * s);
    noise(0.07, 'bandpass', 900, 2.5, 0.22 * s);
  }
}

export function sfxWin() {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, f * 1.01, 0.25, 'triangle', 0.3, i * 0.11));
}

export function sfxFail() {
  [392, 330, 262].forEach((f, i) => tone(f, f * 0.98, 0.3, 'sine', 0.3, i * 0.15));
}

export function sfxCoin() {
  tone(988, 1319, 0.12, 'square', 0.12);
  tone(1319, 1319, 0.18, 'square', 0.1, 0.08);
}

export function sfxClick() {
  tone(700, 500, 0.06, 'triangle', 0.2);
}

export function sfxClang() {
  tone(880, 820, 0.35, 'square', 0.08);
  tone(1320, 1250, 0.3, 'triangle', 0.12);
  noise(0.06, 'highpass', 4000, 0.7, 0.15);
}

// ---------- background music: a gentle, original sea-shanty style loop ----------
// Composed procedurally here (I-vi-IV-V style progression in D) — no audio files.
const music = { on: false, timer: null, next: 0, step: 0, gain: null };
const NOTE = (n) => 440 * Math.pow(2, (n - 69) / 12);
// chord roots (MIDI) and arpeggio shapes
const PROG = [[62, [0, 4, 7, 12]], [59, [0, 3, 7, 12]], [55, [0, 4, 7, 12]], [57, [0, 4, 7, 10]]];
const MELODY = [74, 76, 78, 76, 74, 71, 69, 71, 74, 73, 71, 69, 67, 69, 71, 73];

function musicNote(freq, when, dur, type, vol) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, when);
  g.gain.setValueAtTime(0.0001, when);
  g.gain.exponentialRampToValueAtTime(vol, when + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
  o.connect(g).connect(music.gain);
  o.start(when);
  o.stop(when + dur + 0.05);
}

function scheduleMusic() {
  if (!music.on || !ctx) return;
  const beat = 60 / 108 / 2; // eighth notes at 108 bpm
  while (music.next < ctx.currentTime + 0.4) {
    const i = music.step;
    const bar = Math.floor(i / 8) % PROG.length;
    const [root, shape] = PROG[bar];
    const t = music.next;
    // plucked arpeggio
    musicNote(NOTE(root + shape[i % 4] + (i % 8 >= 4 ? 12 : 0)), t, beat * 1.6, 'triangle', 0.05);
    // bass on beats 1 and 3
    if (i % 4 === 0) musicNote(NOTE(root - 12), t, beat * 3, 'sine', 0.09);
    // melody every other eighth, resting on some bars
    if (i % 2 === 0 && Math.floor(i / 16) % 2 === 1) musicNote(NOTE(MELODY[(i / 2) % MELODY.length]), t, beat * 1.8, 'square', 0.018);
    // soft shaker
    if (i % 2 === 1) {
      const src = ctx.createBufferSource();
      src.buffer = noiseBuf;
      const f = ctx.createBiquadFilter();
      f.type = 'highpass';
      f.frequency.value = 6000;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.025, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
      src.connect(f).connect(g).connect(music.gain);
      src.start(t, Math.random(), 0.06);
    }
    music.step = (i + 1) % 64;
    music.next += beat;
  }
}

export function setMusic(on) {
  music.on = on;
  if (!on) {
    if (music.gain && ctx) music.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.2);
    clearInterval(music.timer);
    music.timer = null;
    return;
  }
  const c = ensure();
  if (!c) return;
  if (!music.gain) {
    music.gain = c.createGain();
    music.gain.connect(master);
  }
  music.gain.gain.setTargetAtTime(0.8, c.currentTime, 0.3);
  if (!music.timer) {
    music.next = c.currentTime + 0.1;
    music.timer = setInterval(scheduleMusic, 100);
  }
}

// ---------- extra effects ----------
export function sfxPop() {
  noise(0.08, 'highpass', 1800, 0.8, 0.5);
  tone(900, 300, 0.08, 'triangle', 0.25);
}

export function sfxShatter() {
  const c = ensure();
  if (!c) return;
  noise(0.35, 'highpass', 5000, 0.6, 0.35);
  for (let i = 0; i < 5; i++) tone(2400 + Math.random() * 1800, 2000, 0.12, 'sine', 0.06, i * 0.03);
}

export function sfxBoom() {
  noise(0.9, 'lowpass', 600, 0.7, 0.9);
  tone(80, 30, 0.7, 'sine', 0.9);
}

export function sfxWhoosh() {
  const f = noise(0.6, 'bandpass', 400, 1.2, 0.3);
  if (f) f.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.5);
}

export function sfxTick() {
  tone(1500, 1400, 0.03, 'square', 0.06);
}

export function sfxThunder() {
  noise(1.6, 'lowpass', 300, 0.5, 0.7);
  noise(0.3, 'lowpass', 900, 0.5, 0.4, 0.05);
}

// Pause/resume all sound (app going to the background and back).
export function suspendAll() {
  if (ctx && ctx.state === 'running') ctx.suspend();
}
export function resumeAll() {
  if (ctx && ctx.state === 'suspended' && audio.enabled) ctx.resume();
}

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
export function sfxHit(strength = 1) {
  const c = ensure();
  if (!c) return;
  if (c.currentTime - lastHit < 0.045) return;
  lastHit = c.currentTime;
  const s = Math.min(1, strength);
  tone(320 + Math.random() * 200, 90, 0.12, 'triangle', 0.25 * s);
  noise(0.08, 'bandpass', 1400, 2, 0.2 * s);
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

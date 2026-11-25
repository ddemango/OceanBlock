// Optional sound (synthesised, no audio files) and haptics.
import { getApp } from '../store/app';

let ctx: AudioContext | null = null;

function tone(freq: number, dur: number, type: OscillatorType, gain: number, delay = 0, slideTo?: number) {
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx ??= new AC();
    if (ctx.state === 'suspended') void ctx.resume();
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
  } catch { /* audio is optional */ }
}

export type Cue = 'snap' | 'join' | 'pick' | 'fill' | 'wrong' | 'found' | 'hint' | 'complete' | 'colorDone';

const SOUNDS: Record<Cue, () => void> = {
  snap: () => { tone(520, 0.07, 'triangle', 0.16); tone(180, 0.09, 'sine', 0.2); },
  join: () => tone(420, 0.06, 'triangle', 0.12),
  pick: () => tone(300, 0.04, 'sine', 0.06),
  fill: () => tone(620, 0.12, 'sine', 0.09, 0, 840),
  wrong: () => tone(190, 0.14, 'sine', 0.09, 0, 150),
  found: () => { tone(660, 0.12, 'sine', 0.12); tone(990, 0.18, 'sine', 0.1, 0.09); },
  hint: () => tone(740, 0.2, 'sine', 0.07),
  colorDone: () => { tone(523, 0.12, 'sine', 0.1); tone(784, 0.2, 'sine', 0.1, 0.1); },
  complete: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.5, 'sine', 0.1, i * 0.13)),
};

const VIBES: Partial<Record<Cue, number | number[]>> = { snap: 12, join: 8, fill: 6, wrong: [8, 40, 8], found: 16, complete: [20, 60, 30], colorDone: 14 };

export function cue(c: Cue) {
  const { prefs } = getApp();
  if (prefs.sound) SOUNDS[c]();
  const v = VIBES[c];
  if (prefs.haptics && v && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try { navigator.vibrate(v); } catch { /* unsupported */ }
  }
}

export const hapticsSupported = () => typeof navigator !== 'undefined' && 'vibrate' in navigator;

export function reducedMotion(): boolean {
  const m = getApp().prefs.motion;
  if (m === 'reduced') return true;
  if (m === 'full') return false;
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

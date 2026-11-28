// Pan / zoom / tap / drag controller shared by all three players.
// It owns the View and tells taps apart from drags and pinches, so moving
// around the artwork never places a piece, colours a region or makes a guess.
import { clampView, fitView, restoreView, saveView, toWorld, zoomAt, type Rect, type SavedView, type View } from '../engine/view';
import { reducedMotion } from './feedback';

export interface Point { x: number; y: number }
export interface DragHandler {
  move(world: Point, screen: Point): void;
  end(world: Point, screen: Point, cancelled: boolean, client: Point): void;
}

export interface StageOptions {
  world: Rect;
  /** Screen padding used when fitting. */
  pad?: number;
  /** Maximum zoom relative to the fitted view. */
  maxZoom?: number;
  minZoom?: number;
  initial?: SavedView;
  onChange(view: View, stage: Stage): void;
  onTap?(world: Point, screen: Point): void;
  /** Return a handler to take over a one-finger drag (e.g. moving a puzzle piece); null pans. */
  onDragStart?(world: Point, screen: Point): DragHandler | null;
  /** Extra keys; return true when handled. */
  onKey?(e: KeyboardEvent): boolean;
}

export class Stage {
  view: View = { s: 1, x: 0, y: 0 };
  vw = 0;
  vh = 0;
  private pointers = new Map<number, Point>();
  private mode: 'none' | 'pending' | 'pan' | 'drag' | 'pinch' = 'none';
  private start: Point & { id: number } = { x: 0, y: 0, id: -1 };
  private last: Point = { x: 0, y: 0 };
  private pinch = { d: 1, cx: 0, cy: 0 };
  private drag: DragHandler | null = null;
  private ro: ResizeObserver;
  private anim = 0;
  private sized = false;
  private off: (() => void)[] = [];

  constructor(public el: HTMLElement, private o: StageOptions) {
    el.style.touchAction = 'none';
    const on = <K extends keyof HTMLElementEventMap>(t: K, f: (e: HTMLElementEventMap[K]) => void, opts?: AddEventListenerOptions) => {
      el.addEventListener(t, f, opts);
      this.off.push(() => el.removeEventListener(t, f, opts));
    };
    on('pointerdown', this.down);
    on('pointermove', this.move);
    on('pointerup', (e) => this.up(e, false));
    on('pointercancel', (e) => this.up(e, true));
    on('wheel', this.wheel, { passive: false });
    on('keydown', this.key);
    on('contextmenu', (e) => e.preventDefault());
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(el);
    this.resize();
  }

  destroy() {
    cancelAnimationFrame(this.anim);
    this.ro.disconnect();
    this.off.forEach((f) => f());
  }

  get pad() { return this.o.pad ?? 12; }
  private get fit() { return fitView(this.o.world, this.vw, this.vh, this.pad); }
  private get minS() { return this.fit.s * (this.o.minZoom ?? 0.7); }
  private get maxS() { return this.fit.s * (this.o.maxZoom ?? 8); }
  /** Zoom relative to the fitted view. */
  get zoom() { return this.view.s / this.fit.s; }

  private resize() {
    const r = this.el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    if (!this.sized) {
      this.vw = r.width; this.vh = r.height; this.sized = true;
      this.set(this.o.initial ? restoreView(this.o.initial, this.o.world, this.vw, this.vh, this.pad) : this.fit);
      return;
    }
    if (Math.abs(r.width - this.vw) < 0.5 && Math.abs(r.height - this.vh) < 0.5) return;
    // keep the same world point centred and the same relative zoom
    const saved = saveView(this.view, this.o.world, this.vw, this.vh, this.pad);
    this.vw = r.width; this.vh = r.height;
    this.set(restoreView(saved, this.o.world, this.vw, this.vh, this.pad));
  }

  set(v: View) {
    const s = Math.max(this.minS, Math.min(this.maxS, v.s));
    this.view = clampView({ ...v, s }, this.o.world, this.vw, this.vh, 90);
    this.o.onChange(this.view, this);
  }

  saved(): SavedView { return saveView(this.view, this.o.world, this.vw, this.vh, this.pad); }

  animateTo(target: View, ms = 320) {
    cancelAnimationFrame(this.anim);
    if (reducedMotion() || ms <= 0) { this.set(target); return; }
    const from = this.view, t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3);
      // interpolate scale geometrically so zooming feels even
      const s = from.s * Math.pow(target.s / from.s, e);
      this.set({ s, x: from.x + (target.x - from.x) * e, y: from.y + (target.y - from.y) * e });
      if (k < 1) this.anim = requestAnimationFrame(step);
    };
    this.anim = requestAnimationFrame(step);
  }

  reset() { this.animateTo(this.fit); }

  zoomBy(factor: number) {
    this.animateTo(zoomAt(this.view, this.vw / 2, this.vh / 2, factor, this.minS, this.maxS), 180);
  }

  /** Bring a world point to the centre, zooming in to at least `minZoom` × fit. */
  focus(wx: number, wy: number, minZoom = 1) {
    const s = Math.min(this.maxS, Math.max(this.view.s, this.fit.s * minZoom));
    this.animateTo({ s, x: this.vw / 2 - wx * s, y: this.vh / 2 - wy * s }, 420);
  }

  screenOf(e: { clientX: number; clientY: number }): Point {
    const r = this.el.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  worldOf(p: Point): Point { return toWorld(this.view, p.x, p.y); }

  private down = (e: PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    cancelAnimationFrame(this.anim);
    const p = this.screenOf(e);
    this.pointers.set(e.pointerId, p);
    try { this.el.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    if (this.pointers.size === 1) {
      this.mode = 'pending';
      this.start = { ...p, id: e.pointerId };
      this.last = p;
    } else if (this.pointers.size === 2 && this.mode !== 'drag') {
      this.mode = 'pinch';
      this.pinch = this.measure();
    }
  };

  private measure() {
    const [a, b] = [...this.pointers.values()];
    return { d: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)), cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 };
  }

  private move = (e: PointerEvent) => {
    if (!this.pointers.has(e.pointerId)) return;
    const p = this.screenOf(e);
    this.pointers.set(e.pointerId, p);
    if (this.mode === 'pending') {
      const slop = e.pointerType === 'mouse' ? 4 : 9;
      if (Math.hypot(p.x - this.start.x, p.y - this.start.y) < slop) return;
      this.drag = this.o.onDragStart?.(this.worldOf(this.start), this.start) ?? null;
      this.mode = this.drag ? 'drag' : 'pan';
      this.last = this.drag ? p : this.start;
    }
    if (this.mode === 'pan') {
      this.set({ s: this.view.s, x: this.view.x + p.x - this.last.x, y: this.view.y + p.y - this.last.y });
      this.last = p;
    } else if (this.mode === 'drag' && e.pointerId === this.start.id) {
      this.drag!.move(this.worldOf(p), p);
    } else if (this.mode === 'pinch' && this.pointers.size >= 2) {
      const m = this.measure();
      const z = zoomAt(this.view, m.cx, m.cy, m.d / this.pinch.d, this.minS, this.maxS);
      this.set({ s: z.s, x: z.x + m.cx - this.pinch.cx, y: z.y + m.cy - this.pinch.cy });
      this.pinch = m;
    }
  };

  private up(e: PointerEvent, cancelled: boolean) {
    if (!this.pointers.has(e.pointerId)) return;
    const p = this.screenOf(e);
    this.pointers.delete(e.pointerId);
    if (this.mode === 'pending' && !cancelled) {
      this.mode = 'none';
      this.o.onTap?.(this.worldOf(p), p);
    } else if (this.mode === 'drag') {
      if (e.pointerId !== this.start.id) return;
      const d = this.drag; this.drag = null; this.mode = 'none';
      d?.end(this.worldOf(p), p, cancelled, { x: e.clientX, y: e.clientY });
    } else if (this.mode === 'pinch') {
      // one finger left: continue as a pan, never as a tap
      if (this.pointers.size === 1) { this.mode = 'pan'; this.last = [...this.pointers.values()][0]; }
      else if (this.pointers.size >= 2) this.pinch = this.measure();
    }
    if (this.pointers.size === 0) this.mode = 'none';
  }

  private wheel = (e: WheelEvent) => {
    e.preventDefault();
    const p = this.screenOf(e);
    const f = Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0018));
    this.set(zoomAt(this.view, p.x, p.y, f, this.minS, this.maxS));
  };

  private key = (e: KeyboardEvent) => {
    if (e.target !== this.el) return;
    if (this.o.onKey?.(e)) { e.preventDefault(); return; }
    const step = 48;
    const pan = (dx: number, dy: number) => this.set({ s: this.view.s, x: this.view.x + dx, y: this.view.y + dy });
    let handled = true;
    if (e.key === 'ArrowLeft') pan(step, 0);
    else if (e.key === 'ArrowRight') pan(-step, 0);
    else if (e.key === 'ArrowUp') pan(0, step);
    else if (e.key === 'ArrowDown') pan(0, -step);
    else if (e.key === '+' || e.key === '=') this.zoomBy(1.4);
    else if (e.key === '-' || e.key === '_') this.zoomBy(1 / 1.4);
    else if (e.key === '0') this.reset();
    else if (e.key === 'Enter' || e.key === ' ') {
      const c = { x: this.vw / 2, y: this.vh / 2 };
      this.el.classList.add('show-crosshair');
      this.o.onTap?.(this.worldOf(c), c);
    } else handled = false;
    if (handled) { e.preventDefault(); if (e.key.startsWith('Arrow')) this.el.classList.add('show-crosshair'); }
  };
}

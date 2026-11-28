import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { pointInPoly } from '../art/geometry';
import { illustrationSvg } from '../art/render';
import type { PuzzleActivity } from '../content/types';
import { buildJigsaw, type JigsawGeom } from '../engine/jigsaw/geometry';
import {
  bringToFront, dropGroup, findGroup, groupAt, isComplete, isValidState, lockedCount, moveGroup, newGame, progressOf,
  returnToTray, takeFromTray, type JigsawState,
} from '../engine/jigsaw/state';
import { cue, reducedMotion } from '../lib/feedback';
import { rasterIllustration } from '../lib/raster';
import { Stage, type Point } from '../lib/stage';
import { bumpStats } from '../store/app';
import { Dialog } from '../ui/common';
import { Icon } from '../ui/Icon';
import { Completion, loadSaved, persist, PlayerShell, recordCompletion, ReplayConfirm, TIPS } from './shared';

interface Assets { src: HTMLCanvasElement; sprites: HTMLCanvasElement[]; paths: Path2D[]; res: number }

function buildSprites(src: HTMLCanvasElement, geom: JigsawGeom): Assets {
  const res = src.width / geom.width;
  const m = geom.margin;
  const cw = Math.ceil((geom.pw + 2 * m) * res), ch = Math.ceil((geom.ph + 2 * m) * res);
  const paths = geom.pieces.map((p) => new Path2D(p.path));
  const sprites = geom.pieces.map((p, i) => {
    const c = document.createElement('canvas');
    c.width = cw; c.height = ch;
    const g = c.getContext('2d')!;
    // image coordinates → sprite pixels: the piece's cell sits `m` in from the sprite corner
    g.setTransform(res, 0, 0, res, (m - p.x) * res, (m - p.y) * res);
    g.save();
    g.clip(paths[i]);
    g.drawImage(src, 0, 0, geom.width, geom.height);
    // soft bevel so pieces read as physical objects
    g.lineWidth = Math.max(1.6, geom.pw * 0.03);
    g.strokeStyle = 'rgba(255,255,255,0.28)';
    g.translate(geom.pw * 0.012, geom.pw * 0.012);
    g.stroke(paths[i]);
    g.translate(-geom.pw * 0.024, -geom.pw * 0.024);
    g.strokeStyle = 'rgba(0,0,0,0.22)';
    g.stroke(paths[i]);
    g.restore();
    g.lineWidth = Math.max(0.8, 1 / res);
    g.strokeStyle = 'rgba(30,24,18,0.55)';
    g.stroke(paths[i]);
    return c;
  });
  return { src, sprites, paths, res };
}

function TrayPiece({ id, sprite, geom, hinted, hidden, onKeyPick }: { id: number; sprite: HTMLCanvasElement; geom: JigsawGeom; hinted: boolean; hidden: boolean; onKeyPick(id: number): void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const cell = 46;
  const k = cell / Math.max(geom.pw, geom.ph);
  const w = (geom.pw + 2 * geom.margin) * k, h = (geom.ph + 2 * geom.margin) * k;
  useEffect(() => {
    const c = ref.current!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
    c.getContext('2d')!.drawImage(sprite, 0, 0, c.width, c.height);
  }, [sprite, w, h]);
  const p = geom.pieces[id];
  return (
    <button className={`jpiece ${hinted ? 'hinted' : ''}`} data-piece={id} style={{ visibility: hidden ? 'hidden' : undefined }}
      aria-label={`Piece ${id + 1}, row ${p.row + 1} column ${p.col + 1}${p.isEdge ? ', edge piece' : ''}. Press Enter to pick up.`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onKeyPick(id); } }}>
      <canvas ref={ref} style={{ width: w, height: h }} />
    </button>
  );
}

export function JigsawPlayer({ activity, count, onRestart }: { activity: PuzzleActivity; count: number; onRestart(): void }) {
  const { art } = activity;
  const variant = String(count);
  const geom = useMemo(() => buildJigsaw(art.width, art.height, count, activity.geometrySeed), [art, count, activity.geometrySeed]);
  const loaded = useMemo(() => loadSaved(activity, variant, (s): s is JigsawState => isValidState(s, geom, activity.geometrySeed, activity.geometryVersion)), []); // eslint-disable-line react-hooks/exhaustive-deps
  const st = useRef<JigsawState>(loaded.state ?? newGame(geom, activity.geometrySeed, activity.geometryVersion, true)).current;
  const startedAt = useRef(loaded.rec?.startedAt ?? Date.now()).current;

  const [, setTick] = useState(0);
  const rerender = useCallback(() => setTick((t) => t + 1), []);
  const [assets, setAssets] = useState<Assets | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [completed, setCompleted] = useState(loaded.rec?.completed ?? false);
  const [showDone, setShowDone] = useState(false);
  const [showRef, setShowRef] = useState(false);
  const [confirmReplay, setConfirmReplay] = useState(false);
  const [hintPiece, setHintPiece] = useState<number | null>(null);
  const [live, setLive] = useState('');
  const [stage, setStage] = useState<Stage | null>(null);
  const [trayDrag, setTrayDrag] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const R = useRef({ discard: false,
    assets: null as Assets | null, stage: null as Stage | null, raf: 0, completed, doneAt: completed ? -1e9 : 0,
    hint: null as { piece: number; t0: number } | null, flash: null as { pieces: number[]; t0: number } | null,
    dragging: -1, held: -1,
  }).current;
  R.completed = completed;

  // ---- drawing ----
  const draw = useCallback(() => {
    R.raf = 0;
    const c = canvasRef.current, stg = R.stage;
    if (!c || !stg) return;
    const dpr = Math.min(2.5, window.devicePixelRatio || 1);
    const W = Math.round(stg.vw * dpr), H = Math.round(stg.vh * dpr);
    if (c.width !== W || c.height !== H) { c.width = W; c.height = H; }
    const g = c.getContext('2d')!;
    const v = stg.view;
    const now = performance.now();
    let animating = false;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, W, H);
    g.setTransform(dpr * v.s, 0, 0, dpr * v.s, dpr * v.x, dpr * v.y);
    // board
    const css = getComputedStyle(c);
    g.fillStyle = css.getPropertyValue('--board').trim() || 'rgba(255,255,255,0.7)';
    g.fillRect(0, 0, geom.width, geom.height);
    const a = R.assets;
    if (a) {
      if (st.guide && !R.completed) { g.globalAlpha = 0.2; g.drawImage(a.src, 0, 0, geom.width, geom.height); g.globalAlpha = 1; }
      const m = geom.margin, sw = geom.pw + 2 * m, sh = geom.ph + 2 * m;
      const drawGroup = (gr: JigsawState['groups'][number]) => {
        for (const id of gr.pieces) { const p = geom.pieces[id]; g.drawImage(a.sprites[id], p.x - m + gr.x, p.y - m + gr.y, sw, sh); }
      };
      for (const gr of st.groups) if (gr.locked) drawGroup(gr);
      for (const gr of st.groups) if (!gr.locked && gr.id !== R.dragging && gr.id !== R.held) drawGroup(gr);
      const top = st.groups.find((x) => x.id === R.dragging) ?? st.groups.find((x) => x.id === R.held);
      if (top) {
        g.save();
        g.shadowColor = 'rgba(50,48,110,0.35)'; g.shadowBlur = 14 * dpr; g.shadowOffsetY = 5 * dpr;
        drawGroup(top);
        g.restore();
        if (top.id === R.held) {
          g.save(); g.translate(top.x, top.y); g.lineWidth = 3 / v.s; g.strokeStyle = '#ffffff'; g.setLineDash([8 / v.s, 6 / v.s]);
          for (const id of top.pieces) g.stroke(a.paths[id]);
          g.restore();
        }
      }
      if (R.flash) {
        const k = (now - R.flash.t0) / 420;
        if (k >= 1) R.flash = null;
        else {
          animating = true;
          g.save(); g.lineWidth = 5 / v.s; g.strokeStyle = `rgba(255,255,255,${0.85 * (1 - k)})`;
          for (const id of R.flash.pieces) g.stroke(a.paths[id]);
          g.restore();
        }
      }
      if (R.hint) {
        const age = now - R.hint.t0;
        if (age > 7000) { R.hint = null; setHintPiece(null); }
        else {
          const pulse = reducedMotion() ? 0.8 : 0.55 + 0.45 * Math.sin(age / 220);
          animating = !reducedMotion();
          g.save();
          g.fillStyle = `rgba(127,168,232,${0.35 * pulse})`; g.fill(a.paths[R.hint.piece]);
          g.lineWidth = 4 / v.s; g.strokeStyle = `rgba(255,255,255,${pulse})`; g.stroke(a.paths[R.hint.piece]);
          g.lineWidth = 2 / v.s; g.strokeStyle = `rgba(75,110,190,${pulse})`; g.stroke(a.paths[R.hint.piece]);
          g.restore();
        }
      }
      if (R.completed) {
        // reveal the clean artwork over the seams
        const k = reducedMotion() ? 1 : Math.min(1, (now - R.doneAt) / 900);
        if (k < 1) animating = true;
        g.globalAlpha = k; g.drawImage(a.src, 0, 0, geom.width, geom.height); g.globalAlpha = 1;
      }
    }
    g.lineWidth = 2 / v.s; g.strokeStyle = css.getPropertyValue('--board-line').trim() || 'rgba(92,96,160,0.3)';
    g.strokeRect(0, 0, geom.width, geom.height);
    if (animating) R.raf = requestAnimationFrame(draw);
  }, [geom, st, R]);
  const requestDraw = useCallback(() => { if (!R.raf) R.raf = requestAnimationFrame(draw); }, [draw, R]);

  // ---- saving ----
  const save = useCallback((done = R.completed) => {
    persist(activity, variant, st, progressOf(st), done, R.stage?.saved(), startedAt);
  }, [activity, variant, st, R, startedAt]);

  // ---- rules glue ----
  const clampGroup = (x: number, y: number): [number, number] => {
    const lim = (v: number, size: number) => Math.max(-size * 1.1, Math.min(size * 1.1, v));
    return [lim(x, geom.width), lim(y, geom.height)];
  };

  const drop = useCallback((groupId: number, client: Point | null) => {
    const gr = findGroup(st, groupId);
    if (!gr) return;
    const tr = trayRef.current?.getBoundingClientRect();
    if (client && tr && gr.pieces.length === 1 && client.y >= tr.top && client.y <= tr.bottom && client.x >= tr.left && client.x <= tr.right) {
      returnToTray(st, gr.id, 0);
      cue('pick');
      if (scrollRef.current) scrollRef.current.scrollLeft = 0;
    } else {
      const before = lockedCount(st);
      const scale = R.stage?.view.s ?? 1;
      // comfortable at any zoom: about a fingertip on screen, bounded by piece size
      const tol = Math.max(geom.pw * 0.14, Math.min(geom.pw * 0.42, 26 / scale));
      const moved = [...gr.pieces];
      const res = dropGroup(st, geom, gr.id, tol);
      if (res === 'locked') {
        cue('snap');
        bumpStats({ pieces: lockedCount(st) - before });
        R.flash = { pieces: moved, t0: performance.now() };
        setLive(`${lockedCount(st)} of ${st.count} pieces in place`);
        if (R.hint && moved.includes(R.hint.piece)) { R.hint = null; setHintPiece(null); }
      } else if (res === 'joined') {
        cue('join');
        R.flash = { pieces: moved, t0: performance.now() };
        setLive('Pieces connected');
      }
    }
    if (isComplete(st) && !R.completed) {
      R.completed = true; R.doneAt = performance.now();
      setCompleted(true);
      save(true);
      recordCompletion(activity, variant, `${count} pieces`);
      setTimeout(() => setShowDone(true), reducedMotion() ? 200 : 1100);
    } else save();
    rerender();
    requestDraw();
  }, [st, geom, R, save, rerender, requestDraw, activity, variant, count]);

  // ---- assets ----
  useEffect(() => {
    let alive = true;
    setError(null);
    const px = Math.min(count >= 196 ? 1500 : 1700, Math.max(1000, Math.round(Math.min(window.innerWidth, 900) * (window.devicePixelRatio || 1) * 1.6)));
    rasterIllustration(art, px)
      .then((src) => { if (!alive) return; const a = buildSprites(src, geom); R.assets = a; setAssets(a); requestDraw(); })
      .catch((e: Error) => alive && setError(e.message || 'The artwork could not be loaded'));
    return () => { alive = false; };
  }, [art, geom, attempt]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- stage & board input ----
  useEffect(() => {
    const el = canvasRef.current!;
    const s = new Stage(el, {
      world: { x: 0, y: 0, w: geom.width, h: geom.height },
      pad: 14, maxZoom: 6, minZoom: 0.45,
      initial: loaded.rec?.view,
      onChange: () => requestDraw(),
      onDragStart: (w) => {
        if (R.completed) return null;
        const gr = groupAt(st, geom, w.x, w.y, pointInPoly);
        if (!gr) return null;
        bringToFront(st, gr.id);
        R.dragging = gr.id; R.held = -1;
        const off = { x: w.x - gr.x, y: w.y - gr.y };
        cue('pick');
        return {
          move: (p) => { const [x, y] = clampGroup(p.x - off.x, p.y - off.y); moveGroup(st, gr.id, x, y); requestDraw(); },
          end: (_p, _s, cancelled, client) => { R.dragging = -1; drop(gr.id, cancelled ? null : client); },
        };
      },
      onKey: (e) => {
        if (R.completed) return false;
        const held = findGroup(st, R.held);
        if (held) {
          const step = e.shiftKey ? geom.pw / 16 : geom.pw / 4;
          const mv = (dx: number, dy: number) => { const [x, y] = clampGroup(held.x + dx, held.y + dy); moveGroup(st, held.id, x, y); requestDraw(); };
          if (e.key === 'ArrowLeft') mv(-step, 0);
          else if (e.key === 'ArrowRight') mv(step, 0);
          else if (e.key === 'ArrowUp') mv(0, -step);
          else if (e.key === 'ArrowDown') mv(0, step);
          else if (e.key === 'Enter' || e.key === ' ') { R.held = -1; drop(held.id, null); }
          else if (e.key === 'Escape') { R.held = -1; if (!returnToTray(st, held.id, 0)) drop(held.id, null); else { save(); rerender(); requestDraw(); } }
          else return false;
          return true;
        }
        if (e.key === 'n' || e.key === 'N') {
          const loose = st.groups.filter((x) => !x.locked);
          if (!loose.length) return false;
          bringToFront(st, loose[0].id); R.held = loose[0].id; setLive('Group picked up. Use arrow keys to move, Enter to drop.');
          requestDraw();
          return true;
        }
        return false;
      },
    });
    R.stage = s; setStage(s);
    (window as unknown as Record<string, unknown>).__jigsaw = { st, geom, stage: s, get assets() { return R.assets; } };
    return () => { delete (window as unknown as Record<string, unknown>).__jigsaw; if (!R.discard) save(); s.destroy(); R.stage = null; cancelAnimationFrame(R.raf); R.raf = 0; };
  }, [geom]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- dragging out of the tray ----
  // ---- the tray: every touch gesture is handled here, so it behaves the same in
  // Safari, the iOS app's web view and desktop browsers:
  //   swipe sideways  → scroll the tray (with a little glide)
  //   drag upwards    → lift the piece onto the table
  //   tap a piece     → put it on the table, ready to drag
  const glide = useRef(0);
  const onTrayPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (completed || !R.stage || (e.pointerType === 'mouse' && e.button !== 0)) return;
    const scroller = e.currentTarget;
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-piece]');
    const id = btn ? Number(btn.dataset.piece) : -1;
    const pid = e.pointerId, x0 = e.clientX, y0 = e.clientY, touch = e.pointerType !== 'mouse';
    const scroll0 = scroller.scrollLeft;
    cancelAnimationFrame(glide.current);
    try { scroller.setPointerCapture(pid); } catch { /* ignore */ }
    let mode: 'pending' | 'drag' | 'scroll' | 'none' = 'pending';
    let groupId = -1;
    let lastX = x0, lastT = performance.now(), vel = 0;
    const worldAt = (ev: PointerEvent) => {
      const s = R.stage!.screenOf(ev);
      return R.stage!.worldOf({ x: s.x, y: s.y - (touch ? 44 : 0) }); // lift above the fingertip
    };
    const place = (ev: PointerEvent) => {
      const w = worldAt(ev), p = geom.pieces[id];
      const [x, y] = clampGroup(w.x - geom.pw / 2 - p.x, w.y - geom.ph / 2 - p.y);
      moveGroup(st, groupId, x, y);
      requestDraw();
    };
    const lift = (ev: PointerEvent) => {
      const w = worldAt(ev);
      const gr = takeFromTray(st, geom, id, w.x - geom.pw / 2, w.y - geom.ph / 2);
      if (!gr) { mode = 'none'; return; }
      groupId = gr.id; R.dragging = gr.id; R.held = -1;
      mode = 'drag';
      setTrayDrag(id);
      cue('pick');
    };
    const move = (ev: PointerEvent) => {
      if (ev.pointerId !== pid) return;
      ev.preventDefault();
      const dx = ev.clientX - x0, dy = ev.clientY - y0;
      if (mode === 'pending') {
        const slop = touch ? 8 : 5;
        if (Math.hypot(dx, dy) < slop) return;
        if (id >= 0 && (!touch || (dy < 0 && Math.abs(dy) >= Math.abs(dx) * 0.7))) lift(ev);
        else mode = touch && Math.abs(dx) >= Math.abs(dy) ? 'scroll' : 'none';
      }
      if (mode === 'drag') place(ev);
      else if (mode === 'scroll') {
        scroller.scrollLeft = scroll0 - dx;
        const now = performance.now();
        vel = 0.8 * vel + 0.2 * ((ev.clientX - lastX) / Math.max(1, now - lastT));
        lastX = ev.clientX; lastT = now;
      }
    };
    const stop = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', cancel);
      try { scroller.releasePointerCapture(pid); } catch { /* ignore */ }
    };
    const up = (ev: PointerEvent) => {
      if (ev.pointerId !== pid) return;
      stop();
      if (mode === 'drag') { R.dragging = -1; setTrayDrag(null); drop(groupId, { x: ev.clientX, y: ev.clientY }); return; }
      if (mode === 'pending' && id >= 0) { tapPlace(id); return; }
      if (mode === 'scroll' && !reducedMotion()) {
        // a gentle glide after a flick
        let v = vel * 16;
        const step = () => {
          if (Math.abs(v) < 0.5) return;
          scroller.scrollLeft -= v; v *= 0.92;
          glide.current = requestAnimationFrame(step);
        };
        glide.current = requestAnimationFrame(step);
      }
    };
    const cancel = (ev: PointerEvent) => {
      if (ev.pointerId !== pid) return;
      stop();
      if (mode !== 'drag') return;
      R.dragging = -1; setTrayDrag(null);
      drop(groupId, null); // keep it on the table where it was
    };
    window.addEventListener('pointermove', move, { passive: false });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', cancel);
  };

  /** Tap on a tray piece: set it down on the visible table, ready to drag into place. */
  const tapPlace = (id: number) => {
    const stg = R.stage;
    if (!stg || completed) return;
    const c = stg.worldOf({ x: stg.vw / 2, y: stg.vh / 2 });
    const jitter = () => (Math.random() - 0.5) * Math.min(geom.pw * 1.4, 120 / stg.view.s);
    const [x, y] = clampGroup(c.x - geom.pw / 2 + jitter(), c.y - geom.ph / 2 + jitter());
    const gr = takeFromTray(st, geom, id, x, y);
    if (!gr) return;
    cue('pick');
    R.flash = { pieces: [id], t0: performance.now() };
    setLive('Piece placed on the table. Drag it into position.');
    save(); rerender(); requestDraw();
  };

  const keyPick = (id: number) => {
    const stg = R.stage;
    if (!stg || completed) return;
    const c = stg.worldOf({ x: stg.vw / 2, y: stg.vh / 2 });
    const gr = takeFromTray(st, geom, id, c.x - geom.pw / 2, c.y - geom.ph / 2);
    if (!gr) return;
    R.held = gr.id;
    setLive('Piece picked up. Use arrow keys to move it and Enter to drop it. Escape returns it to the tray.');
    rerender(); requestDraw();
    canvasRef.current?.focus();
  };

  // ---- hint ----
  const hint = () => {
    if (completed || !assets) return;
    const lockedSet = new Set(st.groups.filter((g) => g.locked).flatMap((g) => g.pieces));
    const nearLocked = (id: number) => {
      const p = geom.pieces[id];
      return (p.col > 0 && lockedSet.has(id - 1)) || (p.col < geom.cols - 1 && lockedSet.has(id + 1)) || (p.row > 0 && lockedSet.has(id - geom.cols)) || (p.row < geom.rows - 1 && lockedSet.has(id + geom.cols));
    };
    const corner = (id: number) => { const p = geom.pieces[id]; return (p.col === 0 || p.col === geom.cols - 1) && (p.row === 0 || p.row === geom.rows - 1); };
    const pool = st.tray.filter((id) => !st.edgesOnly || geom.pieces[id].isEdge);
    const src = pool.length ? pool : st.tray.length ? st.tray : st.groups.filter((g) => !g.locked).flatMap((g) => g.pieces);
    if (!src.length) return;
    const pick = src.find(nearLocked) ?? src.find(corner) ?? src.find((id) => geom.pieces[id].isEdge) ?? src[0];
    R.hint = { piece: pick, t0: performance.now() };
    setHintPiece(pick);
    cue('hint');
    const p = geom.pieces[pick];
    const stg = R.stage!;
    const sc = { x: (p.x + geom.pw / 2) * stg.view.s + stg.view.x, y: (p.y + geom.ph / 2) * stg.view.s + stg.view.y };
    if (sc.x < 30 || sc.y < 30 || sc.x > stg.vw - 30 || sc.y > stg.vh - 30) stg.focus(p.x + geom.pw / 2, p.y + geom.ph / 2, 1);
    setLive(`Hint: the highlighted piece belongs in row ${p.row + 1}, column ${p.col + 1}.`);
    requestAnimationFrame(() => scrollRef.current?.querySelector(`[data-piece="${pick}"]`)?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reducedMotion() ? 'auto' : 'smooth' }));
    requestDraw();
  };

  const visible = st.tray.filter((id) => !st.edgesOnly || geom.pieces[id].isEdge);
  const placed = lockedCount(st);
  const toggle = (k: 'guide' | 'edgesOnly') => { st[k] = !st[k]; save(); rerender(); requestDraw(); };

  return (
    <PlayerShell
      activity={activity} subtitle={`${count} pieces`} progress={completed ? 1 : placed / st.count}
      progressLabel={completed ? `Complete · ${count} pieces` : `${placed} of ${st.count} placed`}
      tips={TIPS.puzzle} onHint={completed ? undefined : hint} hintLabel="Hint: show where a piece goes" stage={stage} live={live}
      tray={
        <div className="tray jtray" ref={trayRef}>
          <div className="tray-tools">
            {completed ? (
              <>
                <span className="tray-note">Puzzle complete</span>
                <button className="chip" onClick={() => setShowDone(true)}><Icon name="sparkle" size={16} />Details</button>
                <button className="chip" onClick={() => setConfirmReplay(true)}><Icon name="replay" size={16} />Play again</button>
              </>
            ) : (
              <>
                <button className={`chip ${st.edgesOnly ? 'on' : ''}`} aria-pressed={st.edgesOnly} onClick={() => toggle('edgesOnly')} data-testid="edges"><Icon name="edges" size={16} />Edges</button>
                <button className={`chip ${st.guide ? 'on' : ''}`} aria-pressed={st.guide} onClick={() => toggle('guide')} data-testid="guide"><Icon name="guide" size={16} />Guide</button>
                <button className="chip" onClick={() => setShowRef(true)} data-testid="reference"><Icon name="eye" size={16} />Picture</button>
                <span className="tray-note" data-testid="tray-count">{st.tray.length} left</span>
              </>
            )}
          </div>
          {!completed && (
            <div className="jtray-scroll" ref={scrollRef} onPointerDown={onTrayPointerDown}
              onWheel={(e) => { if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) e.currentTarget.scrollLeft += e.deltaY; }}>
              {assets && visible.map((id) => <TrayPiece key={id} id={id} sprite={assets.sprites[id]} geom={geom} hinted={hintPiece === id} hidden={trayDrag === id} onKeyPick={keyPick} />)}
              {assets && !visible.length && <p className="tray-empty">{st.tray.length ? 'No edge pieces left in the tray — turn off Edges to see the rest.' : 'Every piece is on the table. Fit the last ones together.'}</p>}
            </div>
          )}
        </div>
      }
      overlay={<>
        {showDone && <Completion activity={activity} detail={`${count} pieces`} onClose={() => setShowDone(false)} onReplay={() => { setShowDone(false); setConfirmReplay(true); }} />}
        {showRef && <Dialog title="Reference picture" onClose={() => setShowRef(false)} wide><div className="refimg" dangerouslySetInnerHTML={{ __html: illustrationSvg(art) }} /></Dialog>}
        {confirmReplay && <ReplayConfirm activity={activity} onCancel={() => setConfirmReplay(false)} onConfirm={() => { R.discard = true; onRestart(); }} />}
      </>}
    >
      <canvas ref={canvasRef} className="stage-canvas" tabIndex={0} aria-label={`Jigsaw table: ${activity.title}. ${placed} of ${st.count} pieces placed.`} data-testid="stage" />
      {!assets && !error && <div className="stage-msg"><div className="spinner" />Preparing pieces…</div>}
      {error && <div className="stage-msg" role="alert"><p>{error}.</p><button className="btn btn-primary" onClick={() => setAttempt((n) => n + 1)}>Try again</button></div>}
    </PlayerShell>
  );
}

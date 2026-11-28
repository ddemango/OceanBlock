import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { OUTLINE, PAPER, shapesSvg } from '../art/render';
import { shade } from '../art/kit';
import type { PaintActivity } from '../content/types';
import { buildPaintGeometry, type PaintGeometry } from '../engine/paint/geometry';
import {
  doneCount, fillHexes, fillRegion, isComplete, isValidState, newPaint, redo, remainingByColor, undo, type PaintState, type PaintVariant,
} from '../engine/paint/state';
import { cue, reducedMotion } from '../lib/feedback';
import { exportPng } from '../lib/raster';
import { Stage } from '../lib/stage';
import { bumpStats, progressKey, updateGalleryFills } from '../store/app';
import { toast } from '../ui/common';
import { Icon } from '../ui/Icon';
import { Completion, loadSaved, persist, PlayerShell, recordCompletion, ReplayConfirm, TIPS } from './shared';

const EXTRA_COLOURS = ['#26221d', '#ffffff', '#b9b2a6', '#7a4b3a', '#c0392b', '#e67e22', '#f1c40f', '#7fb069', '#2e8b57', '#3d9ac2', '#34568b', '#8e6bbf', '#e39ab8', '#f5d6c6'];

/** Black or white, whichever reads better on the colour. */
const inkOn = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const l = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return l > 0.6 ? '#26221d' : '#ffffff';
};

const Regions = memo(function Regions({ a, hexes, highlight, wrong, focus }: { a: PaintActivity; hexes: Record<string, string>; highlight: string | null; wrong: string | null; focus: string | null }) {
  return (
    <>
      {a.regions.map((r) => {
        const c = hexes[r.id];
        const hl = !c && highlight === r.color;
        return (
          <g key={r.id}>
            <path d={r.d} data-region={r.id} className={`preg ${c ? 'filled' : ''} ${wrong === r.id ? 'wrong' : ''}`} fill={c ?? PAPER} stroke={c ? shade(c, -0.22) : OUTLINE} />
            {hl && <path d={r.d} className="phatch" fill="url(#us-hatch)" />}
            {focus === r.id && <path d={r.d} className="pfocus" fill="none" />}
          </g>
        );
      })}
    </>
  );
});

/** Paintings made from a photo: every correctly painted area shows that part of the real photo. */
const PhotoReveal = memo(function PhotoReveal({ a, fills }: { a: PaintActivity; fills: Record<string, string> }) {
  if (!a.image) return null;
  return (
    <g pointerEvents="none">
      <mask id="us-photo-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={a.width} height={a.height}>
        {a.regions.map((r) => { const on = fills[r.id] === r.color; return <path key={r.id} d={r.d} fill={on ? '#fff' : '#000'} stroke={on ? '#fff' : '#000'} strokeWidth={1.2} />; })}
      </mask>
      <image href={a.image} x="0" y="0" width={a.width} height={a.height} preserveAspectRatio="none" mask="url(#us-photo-mask)" />
    </g>
  );
});

const Labels = memo(function Labels({ a, geom, state, scale, highlight }: { a: PaintActivity; geom: PaintGeometry; state: PaintState; scale: number; highlight: string | null }) {
  const num = useMemo(() => new Map(a.palette.map((p) => [p.id, p.number])), [a]);
  return (
    <g className="plabels" aria-hidden="true">
      {a.regions.map((r, i) => {
        if (state.fills[r.id]) return null;
        const l = geom.labels[i];
        const fs = Math.max(3.2, Math.min(24, l.r * 1.2));
        if (fs * scale < 6.5) return null;
        return <text key={r.id} x={l.x} y={l.y} fontSize={fs} className={highlight === r.color ? 'hl' : ''}>{num.get(r.color)}</text>;
      })}
    </g>
  );
});

export function PaintPlayer({ activity: a, variant, onRestart }: { activity: PaintActivity; variant: PaintVariant; onRestart(): void }) {
  const geom = useMemo(() => buildPaintGeometry(a.regions), [a]);
  const loaded = useMemo(() => loadSaved(a, variant, (s): s is PaintState => isValidState(s, a, variant)), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [state, setState] = useState<PaintState>(() => {
    const s = loaded.state ?? newPaint(variant);
    if (s.selected) return s;
    if (variant === 'creative') return { ...s, selected: a.palette[0].hex };
    const rem = remainingByColor(s, a);
    return { ...s, selected: a.palette.find((p) => rem[p.id] > 0)?.id ?? a.palette[0].id };
  });
  const startedAt = useRef(loaded.rec?.startedAt ?? Date.now()).current;
  const [completed, setCompleted] = useState(loaded.rec?.completed ?? false);
  const [showDone, setShowDone] = useState(false);
  const [confirmReplay, setConfirmReplay] = useState(false);
  const [scale, setScale] = useState(0.3);
  const [stage, setStage] = useState<Stage | null>(null);
  const [wrong, setWrong] = useState<string | null>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const [eraser, setEraser] = useState(false);
  const [custom, setCustom] = useState<string[]>([]);
  const [live, setLive] = useState('');

  const hostRef = useRef<HTMLDivElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);
  const R = useRef({ discard: false, state, completed, stage: null as Stage | null, eraser, focus: null as string | null }).current;
  R.state = state; R.completed = completed; R.eraser = eraser; R.focus = focus;

  const hexes = useMemo(() => fillHexes(state, a), [state.fills, a]); // eslint-disable-line react-hooks/exhaustive-deps
  const remaining = useMemo(() => remainingByColor(state, a), [state.fills, a]); // eslint-disable-line react-hooks/exhaustive-deps
  const done = doneCount(state, a);

  const commit = useCallback((next: PaintState, opts: { finish?: boolean } = {}) => {
    R.state = next;
    setState(next);
    const complete = isComplete(next, a);
    const wasDone = R.completed;
    const nowDone = wasDone || complete;
    persist(a, variant, next, doneCount(next, a) / a.regions.length, nowDone, R.stage?.saved(), startedAt);
    if (complete && !wasDone && opts.finish !== false) {
      R.completed = true; setCompleted(true);
      recordCompletion(a, variant, variant === 'pbn' ? 'Paint by number' : 'Free colouring', fillHexes(next, a));
      setTimeout(() => setShowDone(true), reducedMotion() ? 150 : 700);
    } else if (wasDone && variant === 'creative') {
      updateGalleryFills(progressKey(a.id, variant), fillHexes(next, a));
    }
  }, [a, variant, R, startedAt]);

  const paint = useCallback((regionId: string) => {
    const s = R.state;
    const region = a.regions.find((r) => r.id === regionId)!;
    const colour = variant === 'creative' && R.eraser ? null : s.selected;
    if (variant === 'pbn' && !colour) { toast('Choose a colour first'); return; }
    const { state: next, result } = fillRegion(s, a, regionId, colour);
    if (result === 'filled') {
      const rem = remainingByColor(next, a);
      let out = next;
      if (variant === 'pbn') {
        bumpStats({ regions: 1 });
        if (rem[region.color] === 0) {
          const p = a.palette.find((x) => x.id === region.color)!;
          const nxt = a.palette.find((x) => rem[x.id] > 0);
          cue('colorDone');
          setLive(`Colour ${p.number}, ${p.name}, is complete.`);
          if (nxt) { out = { ...next, selected: nxt.id }; requestAnimationFrame(() => paletteRef.current?.querySelector(`[data-colour="${nxt.id}"]`)?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reducedMotion() ? 'auto' : 'smooth' })); }
        } else cue('fill');
      } else cue('fill');
      if (R.focus === regionId) setFocus(null);
      commit(out);
    } else if (result === 'wrong') {
      cue('wrong');
      const want = a.palette.find((p) => p.id === region.color)!;
      setLive(`That area needs colour ${want.number}.`);
      setWrong(regionId);
      setTimeout(() => setWrong((w) => (w === regionId ? null : w)), 480);
    }
  }, [a, variant, R, commit]);

  const doUndo = useCallback(() => { const n = undo(R.state); if (n !== R.state) { if (variant === 'pbn') bumpStats({ regions: -1 }); commit(n, { finish: false }); } }, [R, commit, variant]);
  const doRedo = useCallback(() => { const n = redo(R.state); if (n !== R.state) { if (variant === 'pbn') bumpStats({ regions: 1 }); commit(n); } }, [R, commit, variant]);

  /** Next region that still needs colour, preferring the selected colour. */
  const nextOpen = useCallback((from: string | null, dir = 1): number => {
    const s = R.state;
    const open = (i: number) => (variant === 'pbn' ? s.fills[a.regions[i].id] !== a.regions[i].color : !s.fills[a.regions[i].id]);
    const n = a.regions.length;
    const start = from ? a.regions.findIndex((r) => r.id === from) : -1;
    const scan = (pred: (i: number) => boolean) => {
      for (let k = 1; k <= n; k++) { const i = (((start + dir * k) % n) + n) % n; if (pred(i)) return i; }
      return -1;
    };
    const same = variant === 'pbn' ? scan((i) => open(i) && a.regions[i].color === s.selected) : -1;
    return same >= 0 ? same : scan(open);
  }, [a, variant, R]);

  const goTo = useCallback((i: number) => {
    const r = a.regions[i], l = geom.labels[i], stg = R.stage;
    if (!stg) return;
    if (variant === 'pbn' && R.state.selected !== r.color) { const n = { ...R.state, selected: r.color }; R.state = n; setState(n); }
    setFocus(r.id);
    // zoom so the area's number is comfortably readable (about 16px tall)
    const fit = stg.view.s / stg.zoom;
    const fs = Math.max(3.2, Math.min(24, l.r * 1.2));
    stg.focus(l.x, l.y, Math.max(1, Math.min(7, 16 / (fs * fit))));
  }, [a, geom, variant, R]);

  const hint = () => {
    const i = nextOpen(R.focus);
    if (i < 0) return;
    cue('hint');
    goTo(i);
    const p = a.palette.find((x) => x.id === a.regions[i].color)!;
    setLive(variant === 'pbn' ? `Hint: this area takes colour ${p.number}, ${p.name}.` : 'Hint: this area has no colour yet.');
  };

  useEffect(() => {
    const s = new Stage(hostRef.current!, {
      world: { x: 0, y: 0, w: a.width, h: a.height }, pad: 10, maxZoom: 10,
      initial: loaded.rec?.view,
      onChange: (v) => {
        gRef.current?.setAttribute('transform', `matrix(${v.s} 0 0 ${v.s} ${v.x} ${v.y})`);
        setScale((old) => (Math.abs(Math.log(v.s / old)) > 0.06 ? v.s : old));
      },
      onTap: (w) => {
        const i = geom.regionAt(w.x, w.y);
        if (i >= 0) paint(a.regions[i].id);
      },
      onKey: (e) => {
        const k = e.key.toLowerCase();
        if ((e.metaKey || e.ctrlKey) && k === 'z') { if (e.shiftKey) doRedo(); else doUndo(); return true; }
        if ((e.metaKey || e.ctrlKey) && k === 'y') { doRedo(); return true; }
        if (k === 'u') { doUndo(); return true; }
        if (k === 'r') { doRedo(); return true; }
        if (k === 'n' || k === 'p') { const i = nextOpen(R.focus, k === 'n' ? 1 : -1); if (i >= 0) goTo(i); return true; }
        if ((e.key === 'Enter' || e.key === ' ') && R.focus) { paint(R.focus); return true; }
        if (variant === 'pbn' && /^[0-9]$/.test(e.key)) {
          const p = a.palette.find((x) => x.number === (e.key === '0' ? 10 : Number(e.key)));
          if (p) { const n = { ...R.state, selected: p.id }; R.state = n; setState(n); return true; }
        }
        return false;
      },
    });
    R.stage = s; setStage(s);
    (window as unknown as Record<string, unknown>).__paint = { geom, stage: s, regionColours: a.regions.map((r) => r.color), get state() { return R.state; } };
    return () => { delete (window as unknown as Record<string, unknown>).__paint; if (!R.discard) persist(a, variant, R.state, doneCount(R.state, a) / a.regions.length, R.completed, s.saved(), startedAt); s.destroy(); R.stage = null; };
  }, [a, geom]); // eslint-disable-line react-hooks/exhaustive-deps

  const select = (v: string) => { setEraser(false); const n = { ...R.state, selected: v }; R.state = n; setState(n); persist(a, variant, n, doneCount(n, a) / a.regions.length, R.completed, R.stage?.saved(), startedAt); };
  const detail = useMemo(() => (a.detail ? shapesSvg(a.detail) : ''), [a]);
  const highlight = variant === 'pbn' && !completed ? state.selected : null;
  const sel = a.palette.find((p) => p.id === state.selected);
  const saveImage = async () => {
    try { const r = await exportPng(a, hexes, a.title + (variant === 'creative' ? ' my colours' : '')); toast(r === 'downloaded' ? 'Image saved to your downloads' : 'Image shared'); }
    catch { toast('The image could not be exported'); }
  };
  const creativeColours = useMemo(() => [...new Set([...custom, ...a.palette.map((p) => p.hex), ...EXTRA_COLOURS])], [a, custom]);

  return (
    <PlayerShell
      activity={a} subtitle={variant === 'pbn' ? 'Paint by number' : 'Free colouring'} progress={done / a.regions.length}
      progressLabel={completed && variant === 'pbn' ? 'Complete' : `${done} of ${a.regions.length} areas`}
      tips={TIPS.paint} onHint={done < a.regions.length ? hint : undefined} hintLabel="Hint: go to an area that needs colour" stage={stage} live={live}
      tray={
        <div className="tray ptray">
          <div className="tray-tools">
            <button className="chip" onClick={doUndo} disabled={!state.undo.length} aria-label="Undo" data-testid="undo"><Icon name="undo" size={16} />Undo</button>
            <button className="chip" onClick={doRedo} disabled={!state.redo.length} aria-label="Redo" data-testid="redo"><Icon name="redo" size={16} />Redo</button>
            {variant === 'creative' && <button className={`chip ${eraser ? 'on' : ''}`} aria-pressed={eraser} onClick={() => setEraser((e) => !e)}><Icon name="eraser" size={16} />Erase</button>}
            {(variant === 'creative' || completed) && <button className="chip" onClick={saveImage} data-testid="save-image"><Icon name="download" size={16} />Save image</button>}
            {completed && <button className="chip" onClick={() => setConfirmReplay(true)}><Icon name="replay" size={16} />Start again</button>}
            {variant === 'pbn' && !completed && sel && <span className="tray-note" data-testid="colour-note">{sel.number} · {sel.name}: {remaining[sel.id]} left</span>}
          </div>
          {variant === 'pbn' ? (
            <div className="palette" ref={paletteRef} role="radiogroup" aria-label="Colours">
              {a.palette.map((p) => {
                const left = remaining[p.id];
                return (
                  <button key={p.id} role="radio" aria-checked={state.selected === p.id} data-colour={p.id} data-left={left}
                    className={`swatch ${state.selected === p.id ? 'on' : ''} ${left === 0 ? 'complete' : ''}`}
                    aria-label={`Colour ${p.number}, ${p.name}, ${left === 0 ? 'complete' : left + ' areas left'}`} onClick={() => select(p.id)}>
                    <span className="dot" style={{ background: p.hex, color: inkOn(p.hex) }}>{left === 0 ? <Icon name="check" size={18} /> : p.number}</span>
                    <small>{left === 0 ? 'done' : left}</small>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="palette" ref={paletteRef} role="radiogroup" aria-label="Colours">
              <label className="swatch custom" title="Choose any colour">
                <span className="dot rainbow"><Icon name="plus" size={18} /></span><small>custom</small>
                <input type="color" aria-label="Custom colour" value={/^#[0-9a-f]{6}$/i.test(state.selected ?? '') ? state.selected! : '#c47a5a'}
                  onChange={(e) => { const v = e.target.value.toLowerCase(); setCustom((c) => [v, ...c.filter((x) => x !== v)].slice(0, 6)); select(v); }} data-testid="custom-colour" />
              </label>
              {creativeColours.map((hex) => (
                <button key={hex} role="radio" aria-checked={!eraser && state.selected === hex} data-colour={hex} className={`swatch ${!eraser && state.selected === hex ? 'on' : ''}`} aria-label={`Colour ${hex}`} onClick={() => select(hex)}>
                  <span className="dot" style={{ background: hex }} />
                </button>
              ))}
            </div>
          )}
        </div>
      }
      overlay={<>
        {showDone && <Completion activity={a} detail={variant === 'pbn' ? `Paint by number · ${a.regions.length} areas` : 'Free colouring'} fills={hexes} onClose={() => setShowDone(false)} onReplay={() => { setShowDone(false); setConfirmReplay(true); }} closeLabel={variant === 'creative' ? 'Keep colouring' : 'Admire the artwork'} />}
        {confirmReplay && <ReplayConfirm activity={a} onCancel={() => setConfirmReplay(false)} onConfirm={() => { R.discard = true; onRestart(); }} />}
      </>}
    >
      <div ref={hostRef} className="stage-host" tabIndex={0} data-testid="stage" aria-label={`${a.title}: ${done} of ${a.regions.length} areas coloured. Press N for the next open area and Enter to colour it.`}>
        <svg className="stage-svg" aria-hidden="true">
          <defs>
            <pattern id="us-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="7" height="7" fill="rgba(242,156,134,0.16)" />
              <rect width="2.4" height="7" fill="rgba(214,104,78,0.6)" />
            </pattern>
          </defs>
          <g ref={gRef}>
            <rect width={a.width} height={a.height} fill={PAPER} className="ppaper" />
            <Regions a={a} hexes={hexes} highlight={highlight} wrong={wrong} focus={focus} />
            {variant === 'pbn' && <PhotoReveal a={a} fills={state.fills} />}
            <g pointerEvents="none" dangerouslySetInnerHTML={{ __html: detail }} />
            {variant === 'pbn' && <Labels a={a} geom={geom} state={state} scale={scale} highlight={highlight} />}
          </g>
        </svg>
        <div className="crosshair" aria-hidden="true" />
      </div>
    </PlayerShell>
  );
}

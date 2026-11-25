import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { findItemSvg, shapesSvg } from '../art/render';
import type { FindActivity } from '../content/types';
import { buildFindGeometry, hitTarget, visibleFraction } from '../engine/find/geometry';
import { guess, isComplete, isValidState, newFind, nextHint, targetsOf, type FindState } from '../engine/find/state';
import { cue, reducedMotion } from '../lib/feedback';
import { Stage } from '../lib/stage';
import { bumpStats } from '../store/app';
import { Icon } from '../ui/Icon';
import { Completion, loadSaved, persist, PlayerShell, recordCompletion, ReplayConfirm, TIPS } from './shared';

export function FindPlayer({ activity: a, onRestart }: { activity: FindActivity; onRestart(): void }) {
  const variant = 'default';
  const geom = useMemo(() => buildFindGeometry(a.items), [a]);
  const targets = useMemo(() => targetsOf(a), [a]);
  const boxes = useMemo(() => new Map(a.items.map((it, i) => [it.id, geom.items[i].box] as const).filter(([id]) => id)), [a, geom]);
  const thumbs = useMemo(() => new Map(targets.map((t) => [t.id!, 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(findItemSvg(a, t))])), [a, targets]);
  const scene = useMemo(() => (a.defs ? `<defs>${a.defs}</defs>` : '') + a.items.map((it) => shapesSvg(it.shapes)).join(''), [a]);

  const loaded = useMemo(() => loadSaved(a, variant, (s): s is FindState => isValidState(s, a)), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [state, setState] = useState<FindState>(loaded.state ?? newFind());
  const startedAt = useRef(loaded.rec?.startedAt ?? Date.now()).current;
  const [completed, setCompleted] = useState(loaded.rec?.completed ?? false);
  const [showDone, setShowDone] = useState(false);
  const [confirmReplay, setConfirmReplay] = useState(false);
  const [stage, setStage] = useState<Stage | null>(null);
  const [burst, setBurst] = useState<string | null>(null);
  const [hintId, setHintId] = useState<string | null>(null);
  const [miss, setMiss] = useState<{ x: number; y: number; n: number } | null>(null);
  const [live, setLive] = useState('');

  const hostRef = useRef<HTMLDivElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);
  const R = useRef({ discard: false, state, completed, stage: null as Stage | null, misses: 0 }).current;
  R.state = state; R.completed = completed;

  const save = useCallback((s: FindState, done: boolean) => persist(a, variant, s, s.found.length / targets.length, done, R.stage?.saved(), startedAt), [a, targets, R, startedAt]);

  const tap = useCallback((x: number, y: number) => {
    const stg = R.stage;
    if (!stg || R.completed) return;
    // tolerance of roughly a fingertip on screen, converted through the current view
    const tol = Math.max(2, Math.min(28, 13 / stg.view.s));
    const { state: next, hit } = guess(R.state, a, geom, x, y, tol);
    if (!hit) {
      R.misses++;
      setMiss({ x, y, n: R.misses });
      return;
    }
    R.state = next;
    setState(next);
    cue('found');
    bumpStats({ objects: 1 });
    setBurst(hit);
    setHintId((h) => (h === hit ? null : h));
    setTimeout(() => setBurst((b) => (b === hit ? null : b)), 1100);
    const name = targets.find((t) => t.id === hit)?.name;
    setLive(`Found: ${name}. ${next.found.length} of ${targets.length} found.`);
    requestAnimationFrame(() => trayRef.current?.querySelector(`[data-target="${hit}"]`)?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reducedMotion() ? 'auto' : 'smooth' }));
    const done = isComplete(next, a);
    save(next, done);
    if (done) {
      R.completed = true; setCompleted(true);
      recordCompletion(a, variant, `${targets.length} objects`);
      setTimeout(() => setShowDone(true), reducedMotion() ? 200 : 1200);
    }
  }, [a, geom, targets, R, save]);

  useEffect(() => {
    const s = new Stage(hostRef.current!, {
      world: { x: 0, y: 0, w: a.width, h: a.height }, pad: 8, maxZoom: 9,
      initial: loaded.rec?.view,
      onChange: (v) => gRef.current?.setAttribute('transform', `matrix(${v.s} 0 0 ${v.s} ${v.x} ${v.y})`),
      onTap: (w) => tap(w.x, w.y),
    });
    R.stage = s; setStage(s);
    // read-only helpers for the automated play-through
    const none = new Set<string>();
    const probe = (id: string | null, tol: number, near?: { x: number; y: number }) => {
      let best: { x: number; y: number; d: number } | null = null;
      for (let y = 4; y < a.height; y += 3) for (let x = 4; x < a.width; x += 3) {
        if (hitTarget(geom, a.items, x, y, tol, none) !== id) continue;
        const d = near ? Math.hypot(x - near.x, y - near.y) : 0;
        if (!best || d < best.d) best = { x, y, d };
        if (!near) return best;
      }
      return best;
    };
    const centre = (id: string) => { const b = boxes.get(id)!; return { x: (b.x0 + b.x1) / 2, y: (b.y0 + b.y1) / 2 }; };
    (window as unknown as Record<string, unknown>).__find = {
      geom, stage: s, get state() { return R.state; },
      targets: a.items.map((it, index) => ({ id: it.id, name: it.name, index, target: it.target })).filter((t) => t.target),
      visibility: () => a.items.map((it, i) => (it.target ? visibleFraction(geom, i) : -1)).filter((v) => v >= 0),
      pointInside: (id: string) => probe(id, 0, centre(id)),
      emptyPoint: () => probe(null, 30),
      pointOutside: (id: string) => { const b = boxes.get(id)!; return probe(null, 3, { x: b.x1 + 12, y: (b.y0 + b.y1) / 2 }); },
    };
    return () => { delete (window as unknown as Record<string, unknown>).__find; if (!R.discard) save(R.state, R.completed); s.destroy(); R.stage = null; };
  }, [a, geom]); // eslint-disable-line react-hooks/exhaustive-deps

  const hint = () => {
    const id = nextHint(R.state, a);
    const b = id && boxes.get(id);
    if (!id || !b || !R.stage) return;
    cue('hint');
    setHintId(id);
    const size = Math.max(b.x1 - b.x0, b.y1 - b.y0);
    const fit = R.stage.view.s / R.stage.zoom;
    // close enough to narrow the search, not so close that it gives the object away
    R.stage.focus((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, Math.max(1.6, Math.min(4, 46 / (size * fit))));
    setLive(`Hint: ${targets.find((t) => t.id === id)?.name} is inside the highlighted circle.`);
    requestAnimationFrame(() => trayRef.current?.querySelector(`[data-target="${id}"]`)?.scrollIntoView({ inline: 'center', block: 'nearest' }));
    setTimeout(() => setHintId((h) => (h === id ? null : h)), 9000);
  };

  const found = new Set(state.found);
  const ring = (id: string, cls: string, grow = 1) => {
    const b = boxes.get(id);
    if (!b) return null;
    const rx = ((b.x1 - b.x0) / 2 + 8) * grow, ry = ((b.y1 - b.y0) / 2 + 8) * grow;
    return <ellipse key={cls + id} className={cls} cx={(b.x0 + b.x1) / 2} cy={(b.y0 + b.y1) / 2} rx={Math.max(rx, 14)} ry={Math.max(ry, 14)} />;
  };
  const hintBox = hintId ? boxes.get(hintId) : null;

  return (
    <PlayerShell
      activity={a} subtitle={`${targets.length} objects`} progress={state.found.length / targets.length}
      progressLabel={`${state.found.length} of ${targets.length} found`}
      tips={TIPS.find} onHint={completed ? undefined : hint} hintLabel="Hint: show where one object is hiding" stage={stage} live={live}
      tray={
        <div className="tray ftray">
          <div className="tray-tools">
            <span className="tray-note strong" data-testid="found-count">{state.found.length} of {targets.length} found</span>
            {completed && <button className="chip" onClick={() => setShowDone(true)}><Icon name="sparkle" size={16} />Details</button>}
            {completed && <button className="chip" onClick={() => setConfirmReplay(true)}><Icon name="replay" size={16} />Play again</button>}
          </div>
          <div className="targets" ref={trayRef} role="list" aria-label="Objects to find">
            {targets.map((t) => (
              <div key={t.id} role="listitem" data-target={t.id} className={`target ${found.has(t.id!) ? 'found' : ''} ${hintId === t.id ? 'hinted' : ''}`} aria-label={`${t.name}${found.has(t.id!) ? ', found' : ''}`}>
                <span className="target-pic"><img src={thumbs.get(t.id!)} alt="" draggable={false} />{found.has(t.id!) && <i><Icon name="check" size={18} /></i>}</span>
                <small>{t.name}</small>
              </div>
            ))}
          </div>
        </div>
      }
      overlay={<>
        {showDone && <Completion activity={a} detail={`${targets.length} objects found`} onClose={() => setShowDone(false)} onReplay={() => { setShowDone(false); setConfirmReplay(true); }} closeLabel="Review the scene" />}
        {confirmReplay && <ReplayConfirm activity={a} onCancel={() => setConfirmReplay(false)} onConfirm={() => { R.discard = true; onRestart(); }} />}
      </>}
    >
      <div ref={hostRef} className="stage-host" tabIndex={0} data-testid="stage" aria-label={`${a.title}: ${state.found.length} of ${targets.length} objects found. Arrow keys pan, plus and minus zoom, Enter guesses at the centre.`}>
        <svg className="stage-svg" aria-hidden="true">
          <g ref={gRef}>
            <clipPath id="us-scene-clip"><rect width={a.width} height={a.height} /></clipPath>
            <rect className="scene-frame" width={a.width} height={a.height} fill="#fff" />
            <g clipPath="url(#us-scene-clip)" dangerouslySetInnerHTML={{ __html: scene }} />
            <g className="fmarks" pointerEvents="none">
              {state.found.map((id) => {
                const b = boxes.get(id);
                if (!b) return null;
                const cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2;
                const rx = Math.max((b.x1 - b.x0) / 2 + 10, 16), ry = Math.max((b.y1 - b.y0) / 2 + 10, 16);
                // check badge on the ring's upper right, sized to the object
                const br = Math.max(9, Math.min(18, Math.max(rx, ry) * 0.28));
                const bx = cx + rx * 0.72, by = cy - ry * 0.72;
                return (
                  <g key={'f' + id} className="fmark">
                    <ellipse className="fmark-glow" cx={cx} cy={cy} rx={rx} ry={ry} />
                    <ellipse className="fmark-ring" cx={cx} cy={cy} rx={rx} ry={ry} />
                    <circle className="fmark-badge" cx={bx} cy={by} r={br} />
                    <path className="fmark-check" d={`M${bx - br * 0.45} ${by + br * 0.02}L${bx - br * 0.1} ${by + br * 0.38}L${bx + br * 0.5} ${by - br * 0.36}`} strokeWidth={br * 0.3} />
                  </g>
                );
              })}
              {burst && ring(burst, 'fburst')}
              {hintBox && hintId && (
                <circle className="fhint" cx={(hintBox.x0 + hintBox.x1) / 2} cy={(hintBox.y0 + hintBox.y1) / 2} r={Math.max(hintBox.x1 - hintBox.x0, hintBox.y1 - hintBox.y0) * 0.9 + 26} />
              )}
              {miss && <circle key={miss.n} className="fmiss" cx={miss.x} cy={miss.y} r={10 / (stage?.view.s ?? 1)} />}
            </g>
          </g>
        </svg>
        <div className="crosshair" aria-hidden="true" />
      </div>
    </PlayerShell>
  );
}

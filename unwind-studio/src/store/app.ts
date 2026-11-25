// Application data: preferences, favourites, progress, gallery and stats.
// Everything is held in memory for instant reads and written through to
// IndexedDB with debouncing. Pending writes are also journalled synchronously
// to localStorage when the page is hidden, so an interrupted save is recovered
// on the next launch.
import { useSyncExternalStore } from 'react';
import { setOwnContent } from '../content/catalog';
import type { Mode } from '../content/types';
import { creationActivities, creationCollection, isCreation, type Creation } from '../photo/creation';
import type { SavedView } from '../engine/view';
import { dbClear, dbDelete, dbEntries, dbSetMany, openDb } from './db';

export const SCHEMA = 'v1';
const P = SCHEMA + '/';
const JOURNAL = 'unwind-studio:journal:' + SCHEMA;

export interface Prefs {
  sound: boolean;
  haptics: boolean;
  theme: 'system' | 'light' | 'dark';
  motion: 'system' | 'reduced' | 'full';
}

export interface ProgressRecord {
  key: string;
  activityId: string;
  mode: Mode;
  variant: string;
  contentVersion: number;
  state: unknown;
  view?: SavedView;
  progress: number;
  completed: boolean;
  startedAt: number;
  updatedAt: number;
}

export interface GalleryEntry {
  id: string;
  activityId: string;
  mode: Mode;
  variant: string;
  label: string;
  completedAt: number;
  times: number;
  /** Region colours for paint artworks, so the finished piece can be shown and exported. */
  fills?: Record<string, string>;
}

export interface Stats { pieces: number; regions: number; objects: number; completed: number; days: string[] }

export interface AppData {
  ready: boolean;
  storageOk: boolean;
  saveStatus: 'saved' | 'saving' | 'error';
  prefs: Prefs;
  favorites: string[];
  progress: Record<string, ProgressRecord>;
  gallery: GalleryEntry[];
  stats: Stats;
  tutorials: Partial<Record<Mode, boolean>>;
  /** Photos the user turned into activities, newest first. */
  creations: Creation[];
  notice: string | null;
}

const defaults = (): AppData => ({
  ready: false,
  storageOk: true,
  saveStatus: 'saved',
  prefs: { sound: true, haptics: true, theme: 'system', motion: 'system' },
  favorites: [],
  progress: {},
  gallery: [],
  stats: { pieces: 0, regions: 0, objects: 0, completed: 0, days: [] },
  tutorials: {},
  creations: [],
  notice: null,
});

function registerCreations(list: Creation[]) {
  setOwnContent(list.map(creationCollection), list.flatMap(creationActivities));
}

let data = defaults();
const listeners = new Set<() => void>();
const set = (patch: Partial<AppData>) => { data = { ...data, ...patch }; listeners.forEach((l) => l()); };

export const getApp = () => data;
export function useApp<T>(select: (d: AppData) => T): T {
  return useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => select(data));
}

// ---------- persistence ----------
const pending = new Map<string, unknown>();
let timer: ReturnType<typeof setTimeout> | null = null;
let writing: Promise<void> = Promise.resolve();

function queue(key: string, value: unknown, delay = 500) {
  pending.set(P + key, value);
  if (data.saveStatus !== 'saving') set({ saveStatus: 'saving' });
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => { void flushSaves(); }, delay);
}

/** Write everything pending now. Safe to call often. */
export function flushSaves(): Promise<void> {
  if (timer) { clearTimeout(timer); timer = null; }
  if (!pending.size) return writing;
  const batch = [...pending.entries()];
  pending.clear();
  writing = writing.then(async () => {
    try {
      await dbSetMany(batch);
      try { localStorage.removeItem(JOURNAL); } catch { /* ignore */ }
      if (!pending.size) set({ saveStatus: 'saved' });
    } catch {
      for (const [k, v] of batch) if (!pending.has(k)) pending.set(k, v);
      set({ saveStatus: 'error' });
    }
  });
  return writing;
}

/** Called when the page is being hidden: journal synchronously, then flush. */
function onHide() {
  if (pending.size) {
    try { localStorage.setItem(JOURNAL, JSON.stringify({ at: Date.now(), entries: [...pending.entries()] })); } catch { /* ignore */ }
  }
  void flushSaves();
}

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

function validProgress(v: unknown): v is ProgressRecord {
  return isObj(v) && typeof v.key === 'string' && typeof v.activityId === 'string' && typeof v.variant === 'string' &&
    typeof v.contentVersion === 'number' && typeof v.updatedAt === 'number' && 'state' in v;
}

export async function initApp(): Promise<void> {
  if (data.ready) return;
  const storageOk = await openDb();
  const next = defaults();
  next.storageOk = storageOk;
  try {
    const entries = new Map(await dbEntries());
    // recover an interrupted save
    try {
      const raw = localStorage.getItem(JOURNAL);
      if (raw) {
        const j = JSON.parse(raw) as { entries: [string, unknown][] };
        const recovered: [string, unknown][] = [];
        for (const [k, v] of j.entries ?? []) {
          const cur = entries.get(k);
          const newer = !validProgress(v) || !validProgress(cur) || v.updatedAt >= cur.updatedAt;
          if (newer) { entries.set(k, v); recovered.push([k, v]); }
        }
        if (recovered.length) await dbSetMany(recovered);
        localStorage.removeItem(JOURNAL);
      }
    } catch { /* a bad journal is ignored */ }

    for (const [k, v] of entries) {
      if (!k.startsWith(P)) continue; // other schema versions are left untouched
      const key = k.slice(P.length);
      if (key === 'prefs' && isObj(v)) next.prefs = { ...next.prefs, ...(v as Partial<Prefs>) };
      else if (key === 'favorites' && Array.isArray(v)) next.favorites = v.filter((x) => typeof x === 'string');
      else if (key === 'gallery' && Array.isArray(v)) next.gallery = v.filter((g) => isObj(g) && typeof g.id === 'string' && typeof g.activityId === 'string') as GalleryEntry[];
      else if (key === 'stats' && isObj(v)) next.stats = { ...next.stats, ...(v as Partial<Stats>), days: Array.isArray(v.days) ? (v.days as string[]) : [] };
      else if (key === 'tutorials' && isObj(v)) next.tutorials = v as AppData['tutorials'];
      else if (key.startsWith('progress/') && validProgress(v)) next.progress[v.key] = v;
      else if (key.startsWith('creation/') && isCreation(v)) next.creations.push(v);
    }
  } catch {
    next.storageOk = false;
  }
  next.creations.sort((a, b) => b.createdAt - a.createdAt);
  registerCreations(next.creations);
  if (!next.storageOk) next.notice = 'Storage is unavailable in this browser session, so progress will not be kept after you close the app.';
  next.ready = true;
  data = next;
  listeners.forEach((l) => l());

  const today = localDate();
  if (!data.stats.days.includes(today)) bumpStats({ day: today });

  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') onHide(); });
  window.addEventListener('pagehide', onHide);
}

export function localDate(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ---------- actions ----------
export function setPrefs(patch: Partial<Prefs>) {
  const prefs = { ...data.prefs, ...patch };
  set({ prefs });
  queue('prefs', prefs, 50);
}

export function toggleFavorite(activityId: string) {
  const favorites = data.favorites.includes(activityId) ? data.favorites.filter((f) => f !== activityId) : [...data.favorites, activityId];
  set({ favorites });
  queue('favorites', favorites, 50);
}

export const progressKey = (activityId: string, variant: string) => `${activityId}|${variant}`;

export function putProgress(rec: ProgressRecord) {
  set({ progress: { ...data.progress, [rec.key]: rec } });
  queue('progress/' + rec.key, rec);
}

export function resetProgress(key: string) {
  const progress = { ...data.progress };
  delete progress[key];
  set({ progress });
  pending.delete(P + 'progress/' + key);
  void dbDelete([P + 'progress/' + key]).catch(() => set({ saveStatus: 'error' }));
}

export function addGalleryEntry(e: Omit<GalleryEntry, 'times'>) {
  const prev = data.gallery.find((g) => g.id === e.id);
  const entry: GalleryEntry = { ...e, times: (prev?.times ?? 0) + (prev && prev.completedAt === e.completedAt ? 0 : 1) };
  const gallery = [entry, ...data.gallery.filter((g) => g.id !== e.id)];
  set({ gallery });
  queue('gallery', gallery, 50);
}

/** Update the stored colours of an existing gallery entry (creative colouring edited after finishing). */
export function updateGalleryFills(id: string, fills: Record<string, string>) {
  if (!data.gallery.some((g) => g.id === id)) return;
  const gallery = data.gallery.map((g) => (g.id === id ? { ...g, fills } : g));
  set({ gallery });
  queue('gallery', gallery);
}

export function removeGalleryEntry(id: string) {
  const gallery = data.gallery.filter((g) => g.id !== id);
  set({ gallery });
  queue('gallery', gallery, 50);
}

export function bumpStats(d: { pieces?: number; regions?: number; objects?: number; completed?: number; day?: string }) {
  const s = data.stats;
  const stats: Stats = {
    pieces: s.pieces + (d.pieces ?? 0),
    regions: Math.max(0, s.regions + (d.regions ?? 0)),
    objects: s.objects + (d.objects ?? 0),
    completed: s.completed + (d.completed ?? 0),
    days: d.day && !s.days.includes(d.day) ? [...s.days, d.day].slice(-400) : s.days,
  };
  set({ stats });
  queue('stats', stats, 1500);
}

export function markTutorialSeen(mode: Mode) {
  if (data.tutorials[mode]) return;
  const tutorials = { ...data.tutorials, [mode]: true };
  set({ tutorials });
  queue('tutorials', tutorials, 50);
}

export function resetTutorials() {
  set({ tutorials: {} });
  queue('tutorials', {}, 50);
}

/** Keep a new photo creation and save it straight away. */
export async function addCreation(c: Creation): Promise<void> {
  const creations = [c, ...data.creations.filter((x) => x.id !== c.id)];
  registerCreations(creations);
  set({ creations });
  queue('creation/' + c.id, c, 0);
  await flushSaves();
}

/** Delete a photo creation along with its progress, favourites and gallery entries. */
export function deleteCreation(id: string) {
  const c = data.creations.find((x) => x.id === id);
  if (!c) return;
  const ids = new Set(creationActivities(c).map((a) => a.id));
  const creations = data.creations.filter((x) => x.id !== id);
  registerCreations(creations);
  const progress = { ...data.progress };
  const gone: string[] = [P + 'creation/' + id];
  for (const [k, p] of Object.entries(progress)) if (ids.has(p.activityId)) { delete progress[k]; gone.push(P + 'progress/' + k); }
  for (const k of gone) pending.delete(k);
  const gallery = data.gallery.filter((g) => !ids.has(g.activityId));
  const favorites = data.favorites.filter((f) => !ids.has(f));
  set({ creations, progress, gallery, favorites });
  queue('gallery', gallery, 50);
  queue('favorites', favorites, 50);
  void dbDelete(gone).catch(() => set({ saveStatus: 'error' }));
}

let noticeTimer: ReturnType<typeof setTimeout> | null = null;
export const setNotice = (notice: string | null) => {
  set({ notice });
  if (noticeTimer) clearTimeout(noticeTimer);
  // informational notices clear themselves; the storage warning set at start-up stays until dismissed
  noticeTimer = notice ? setTimeout(() => set({ notice: null }), 9000) : null;
};

export async function clearAllData() {
  pending.clear();
  if (timer) { clearTimeout(timer); timer = null; }
  try { localStorage.removeItem(JOURNAL); } catch { /* ignore */ }
  try { await dbClear(); } catch { /* ignore */ }
  const fresh = defaults();
  registerCreations([]);
  set({ ...fresh, ready: true, storageOk: data.storageOk, prefs: data.prefs });
  queue('prefs', data.prefs, 50);
}

/** Approximate size of saved data, for Settings. */
export function savedDataSize(): number {
  try { return JSON.stringify([data.progress, data.gallery, data.favorites, data.stats, data.creations]).length; } catch { return 0; }
}

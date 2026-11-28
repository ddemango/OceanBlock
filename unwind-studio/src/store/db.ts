// Tiny key-value layer over IndexedDB with an in-memory fallback, so the app
// keeps working (without persistence) in private windows or when storage fails.
const DB_NAME = 'unwind-studio';
const STORE = 'kv';

let db: IDBDatabase | null = null;
const memory = new Map<string, unknown>();

export async function openDb(): Promise<boolean> {
  if (db) return true;
  try {
    if (typeof indexedDB === 'undefined') return false;
    db = await new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
      req.onblocked = () => reject(new Error('blocked'));
    });
    db.onclose = () => { db = null; };
    return true;
  } catch {
    db = null;
    return false;
  }
}

function tx<T>(mode: IDBTransactionMode, run: (s: IDBObjectStore) => IDBRequest<T> | void): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    if (!db) return reject(new Error('no database'));
    const t = db.transaction(STORE, mode);
    let result: T | undefined;
    const req = run(t.objectStore(STORE));
    if (req) req.onsuccess = () => { result = req.result; };
    t.oncomplete = () => resolve(result);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error ?? new Error('aborted'));
  });
}

export async function dbEntries(): Promise<[string, unknown][]> {
  if (!db) return [...memory.entries()];
  const keys = (await tx<IDBValidKey[]>('readonly', (s) => s.getAllKeys())) ?? [];
  const vals = (await tx<unknown[]>('readonly', (s) => s.getAll())) ?? [];
  return keys.map((k, i) => [String(k), vals[i]]);
}

export async function dbSetMany(entries: [string, unknown][]): Promise<void> {
  for (const [k, v] of entries) memory.set(k, v);
  if (!db) return;
  await tx('readwrite', (s) => { for (const [k, v] of entries) s.put(v, k); });
}

export async function dbDelete(keys: string[]): Promise<void> {
  for (const k of keys) memory.delete(k);
  if (!db) return;
  await tx('readwrite', (s) => { for (const k of keys) s.delete(k); });
}

export async function dbClear(): Promise<void> {
  memory.clear();
  if (!db) return;
  await tx('readwrite', (s) => { s.clear(); });
}

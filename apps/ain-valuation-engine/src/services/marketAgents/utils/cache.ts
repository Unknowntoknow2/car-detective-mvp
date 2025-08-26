// @ts-nocheck
export {};
export {};
// Simple in-memory fetch cache (per-URL) with TTL.
// For distributed runs, consider Redis; for now, valuation-first speed-up.

type Entry = { body: string; ts: number; ttl: number };
const store = new Map<string, Entry>();

export function getCached(url: string): string | null {
  const e = store.get(url);
  if (!e) return null;
  if (Date.now() - e.ts > e.ttl) { store.delete(url); return null; }
  return e.body;

export function setCached(url: string, body: string, ttlMs: number) {
  store.set(url, { body, ts: Date.now(), ttl: ttlMs });
}
}

const store = new Map();
export function getCached(url) {
    const e = store.get(url);
    if (!e)
        return null;
    if (Date.now() - e.ts > e.ttl) {
        store.delete(url);
        return null;
    }
    return e.body;
    export function setCached(url, body, ttlMs) {
        store.set(url, { body, ts: Date.now(), ttl: ttlMs });
    }
}

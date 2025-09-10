export function dedupeListings(listings) {
    const seen = new Map();
    for (const l of listings) {
        const key = l.url || l.id;
        const prev = seen.get(key);
        if (!prev) {
            seen.set(key, l);
            continue;
        }
        // Keep higher trust or newer fetchedAt
        const prevTs = prev.fetchedAt ? Date.parse(prev.fetchedAt) : 0;
        const currTs = l.fetchedAt ? Date.parse(l.fetchedAt) : 0;
        if ((l.trust_score ?? 0) > (prev.trust_score ?? 0) || currTs > prevTs) {
            seen.set(key, l);
        }
    }
    return Array.from(seen.values());
}

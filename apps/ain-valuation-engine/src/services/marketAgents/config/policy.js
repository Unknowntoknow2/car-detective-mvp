import presets from "./tierPresets.json" with { type: "json" };
import registry from "./sources.master.json" with { type: "json" };
export function getPolicyForHost(hostOrUrl) {
    const host = hostOrUrl.replace(/^https?:\/\/(www\.)?/, " ");
    const entry = registry[host] || registry[host.split("/")[0]];
    if (!entry)
        return null;
    const tier = entry.tier;
    const base = presets[tier] || presets["us_t1"];
    const merged = { ...base, ...entry, tier, allowed: entry.allowed !== false };
    return merged;
}
export function listHostsByTier(tier) {
    return Object.entries(registry).filter(([, v]) => v.tier === tier).map(([k]) => k);
}
export function isAllowed(hostOrUrl) { const p = getPolicyForHost(hostOrUrl); return !!p?.allowed; }

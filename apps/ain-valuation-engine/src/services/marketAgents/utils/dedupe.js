import * as crypto from "crypto";
export function stableKey(l) {
    const approxPrice = l.price == null ? "" : Math.round(l.price / 100) * 100;
    const approxMiles = l.mileage == null ? "" : Math.round(l.mileage / 100) * 100;
    const base = JSON.stringify([l.vin || "", l.make, l.model, l.year || "", approxPrice, approxMiles, l.zip || "", l.source]);
    return crypto.createHash("md5").update(base).digest("hex");
}
export function dedupeByStableKey(rows) {
    const seen = new Set();
    const out = [];
    for (const r of rows) {
        const k = r.vin ? `vin:${r.vin}` : stableKey(r);
        if (seen.has(k))
            continue;
        seen.add(k);
        out.push(r);
    }
    return out;
}

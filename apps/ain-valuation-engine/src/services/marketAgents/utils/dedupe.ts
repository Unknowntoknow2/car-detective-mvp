import * as crypto from "crypto";
import type { Listing } from "../schemas/ListingSchema";

export function stableKey(l: Listing) {
  const approxPrice = l.price == null ? "" : Math.round(l.price / 100) * 100;
  const approxMiles = l.mileage == null ? "" : Math.round(l.mileage / 100) * 100;
  const base = JSON.stringify([l.vin || "", l.make, l.model, l.year || "", approxPrice, approxMiles, l.zip || "", l.source]);
  return crypto.createHash("md5").update(base).digest("hex");
}

export function dedupeByStableKey(rows: Listing[]): Listing[] {
  const seen = new Set<string>();
  const out: Listing[] = [];
  for (const r of rows) {
    const k = r.vin ? `vin:${r.vin}` : stableKey(r);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(r);
  }
  return out;
}

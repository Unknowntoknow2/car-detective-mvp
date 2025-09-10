import crypto from "crypto";
import { canonUrl, canonPhone, canonDealerName, canonVIN } from "./canonical";
export function dedupeListings(rows) {
    const seen = new Set();
    const out = [];
    for (const r of rows) {
        const url = canonUrl(r.listing_url) || r.listing_url;
        const vin = canonVIN(r.vin || "") || "";
        const phone = canonPhone(r.dealer_phone || "") || "";
        const dname = canonDealerName(r.dealer_name || "") || "";
        const k = vin
            ? `vin:${vin}`
            : crypto.createHash("md5")
                .update(JSON.stringify([r.make, r.model, r.year || "", Math.round((r.price || 0) / 100) * 100, Math.round((r.mileage || 0) / 100) * 100, r.zip || "", r.source || "", url || "", phone, dname]))
                .digest("hex");
        if (seen.has(k))
            continue;
        seen.add(k);
        out.push({ ...r, listing_url: url });
    }
    return out;
}

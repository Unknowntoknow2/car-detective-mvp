import { iqrBounds, median } from "./stats.js";
const PRICE_MIN = 500;
const PRICE_MAX = 300_000;
const MILES_MIN = 0;
const MILES_MAX = 400_000;
const YEAR_MIN = 1980;
const YEAR_MAX = new Date().getFullYear() + 1; // tolerate next-model-year
export function normalizeZip(z) {
    if (!z)
        return null;
    // keep 5 digits if US-style present
    const m = String(z).match(/\b(\d{5})(?:-\d{4})?\b/);
    return m ? m[1] : String(z).trim();
}
export function filterForValuation(rows) {
    const dropped = {};
    const keep = [];
    // 1) Basic plausibility
    for (const r of rows) {
        r.zip = normalizeZip(r.zip ?? null);
        if (!r.make || !r.model || !r.url || !r.source) {
            bump(dropped, "missing_required_identity");
            continue;
        }
        if (r.year != null && (r.year < YEAR_MIN || r.year > YEAR_MAX)) {
            bump(dropped, "year_out_of_bounds");
            continue;
        }
        if (r.price != null && (r.price < PRICE_MIN || r.price > PRICE_MAX)) {
            bump(dropped, "price_out_of_bounds");
            continue;
        }
        if (r.mileage != null && (r.mileage < MILES_MIN || r.mileage > MILES_MAX)) {
            bump(dropped, "mileage_out_of_bounds");
            continue;
        }
        keep.push(r);
    }
    // 2) Grouped IQR outlier filter on price within make–model–approxYear
    const byKey = new Map();
    for (const r of keep) {
        const y = r.year ? String(r.year) : "any";
        const key = `${r.make.toLowerCase()}|${r.model.toLowerCase()}|${y}`;
        const arr = byKey.get(key) || [];
        arr.push(r);
        byKey.set(key, arr);
    }
    const keptFinal = [];
    const bucketSnapshots = [];
    byKey.forEach((arr, key) => {
        const prices = arr.map(a => a.price ?? NaN).filter(Number.isFinite);
        const miles = arr.map(a => a.mileage ?? NaN).filter(Number.isFinite);
        const bounds = prices.length ? iqrBounds(prices) : null;
        const pMed = prices.length ? median(prices) : null;
        const mMed = miles.length ? median(miles) : null;
        bucketSnapshots.push({ key, n: arr.length, priceMedian: pMed, mileageMedian: mMed });
        if (!bounds) {
            keptFinal.push(...arr);
            return;
        }
        for (const r of arr) {
            if (r.price == null) {
                keptFinal.push(r);
                continue;
            }
            if (r.price < bounds.lower || r.price > bounds.upper) {
                bump(dropped, "price_iqr_outlier");
            }
            else {
                keptFinal.push(r);
            }
        }
    });
    function bump(rec, k) {
        rec[k] = (rec[k] ?? 0) + 1;
    }
    // Add missing return and closing brace for filterForValuation
    return {
        kept: keptFinal,
        dropped: Object.entries(dropped).map(([reason, count]) => ({ reason, count })),
        snapshot: { buckets: bucketSnapshots },
    };
}

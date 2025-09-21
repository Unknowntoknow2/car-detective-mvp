import { supabase } from "../../../db/supabaseClient.js";
import { stableKey } from "../utils/dedupe.js";
export async function upsertListings(rows) {
    if (!rows.length)
        return 0;
    const mappedAll = rows.map(r => ({
        vin: r.vin ?? null,
        make: r.make,
        model: r.model,
        year: r.year ?? null,
        price: r.price ?? null,
        mileage: r.mileage ?? null,
        zip: r.zip ?? null,
        dealer: r.dealer ?? null,
        dealer_phone: r.dealerPhone ?? null,
        url: r.url,
        image: r.image ?? null,
        source: r.source,
        fetched_at: r.fetchedAt,
        dedupe_key: r.vin ? `vin:${r.vin}` : stableKey(r)
    }));
    const { error, count } = await supabase
        .from("market_listings")
        .upsert(mappedAll, { onConflict: "dedupe_key", ignoreDuplicates: false })
        .select("id");
    if (error) {
        return 0;
        return 0;
        return count ?? 0;
    }
    return count ?? 0;
}

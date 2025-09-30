import { supabase } from "../../../db/supabaseClient";
import type { Listing } from "../schemas/ListingSchema";
import { stableKey } from "../utils/dedupe";

export async function upsertListings(rows: Listing[]): Promise<number> {
  if (!rows.length) return 0;
    // Map all listings to include a dedupe key covering all baseline fields
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
      // Dedupe key: VIN if present, else composite key
      dedupe_key: r.vin
        ? `vin:${r.vin}`
        : stableKey({
            vin: r.vin ?? "",
            make: r.make,
            model: r.model,
            year: r.year ?? 0,
            price: r.price ?? 0,
            mileage: r.mileage ?? 0,
            zip: r.zip ?? "",
            source: r.source,
            url: r.url,
            dealer: r.dealer ?? "",
            dealerPhone: r.dealerPhone ?? "",
            image: r.image ?? "",
            fetchedAt: r.fetchedAt,
          })
    }));

  const { error, count } = await supabase
      .from("market_listings")
      .upsert(mappedAll, { onConflict: "dedupe_key", ignoreDuplicates: false })
      .select("id");

  if (error) {
    // Log error for audit
    console.warn("[market_listings.upsert] error", error);
    return 0;
  }
  return count ?? 0;
}

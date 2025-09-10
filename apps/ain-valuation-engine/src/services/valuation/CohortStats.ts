import { supabase } from "../../db/supabaseClient.js";
import { median } from "../marketAgents/utils/stats.js";
import { getZipPoint, haversineMiles } from "../geo/ZipGeo.js";

export async function getCohortStats(params: {
  make: string;
  model: string;
  year?: number;
  zip?: string;
  radius?: number; // miles
}) {
  const { make, model, year, zip, radius } = params;
  // Basic filters; if we later add geo columns, we can do true radius queries.
  let query = supabase
    .from("market_listings")
    .select("price,mileage,year,zip", { head: false })
    .eq("make", make)
    .eq("model", model)
    .limit(5000); // safety cap

  if (year) {
    // allow +/-1 year to widen cohort when sparse
    query = query.gte("year", year - 1).lte("year", year + 1);
  }
  if (zip && !radius) {
    query = query.eq("zip", zip);
  }
  const { data, error } = await query;
  if (error) throw error;
  let rows = data ?? [];

  // If radius is provided, filter client-side using zip centroids
  if (zip && radius) {
    const center = await getZipPoint(zip);
    if (center) {
      const keep = [];
      for (const r of rows) {
        if (!r.zip) continue;
        const p = await getZipPoint(String(r.zip));
        if (!p) continue;
        const d = haversineMiles(center, p);
        if (d <= radius) keep.push(r);
      }
      rows = keep;
    } // if no centroid, fall back to unfiltered rows
  }

  const prices = rows.map(r => Number(r.price)).filter(Number.isFinite) as number[];
  const miles = rows.map(r => Number(r.mileage)).filter(Number.isFinite) as number[];
  return {
    n: rows.length,
    medianPrice: median(prices),
    medianMileage: median(miles)
  };
}

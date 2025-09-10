import { searchInBatches } from "../aggregateSearch.js";
import { dedupeListings } from "../utils/dedupeIngest.js";
import { filterFresh } from "../filters.js";
import { carsDotCom, carGurus, autoTrader, trueCar, edmunds } from "../utils/urls.js";
import type { Listing } from "../schemas/ListingSchema.js";
import { upsertListings } from "../persistence/upsertListings.js";
import { createRunLog, finishRunLog } from "../persistence/runLogs.js";
import { filterForValuation } from "../utils/sanity.js";

export class OpenAIListingsAgent {
  async run({ zip="94103", radius=100, make, model, year }: {
    zip?: string; radius?: number; make?: string; model?: string; year?: number;
  }): Promise<Listing[]> {
    // Assemble SRPs from major sources that typically expose base fields server-side.
    const urls: string[] = [
      carsDotCom({ make, model, zip, radius }),
      carGurus({ make, model, zip }),
      autoTrader({ make, model, zip, radius }),
      trueCar({ make, model, zip, radius }),
      edmunds({ make, model, zip, radius })
    ];
    const modelName = "gpt-4o-mini";
    const run_id = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    await createRunLog({ run_id, source: urls.map(u => new URL(u).hostname), model: modelName, urls: urls.length });

    try {
      // Build queries for each URL (or other batching logic as needed)
      const queries = urls;
      const { listings, tokensIn, tokensOut } = await searchInBatches(queries.map(q => ({ domain: "web", query: q })), 10);
      const fresh = filterFresh(listings);
      const yearFiltered = year ? fresh.filter(l => !l.year || Math.abs((l.year as number) - year) <= 1) : fresh;
      const unique = dedupeListings(yearFiltered);
      const quality = filterForValuation(unique); // plausibility + IQR outliers + snapshots
      const upserted = await upsertListings(quality.kept);

      await finishRunLog({
        run_id,
        status: "success",
        listings_found: quality.kept.length,
        listings_upserted: upserted,
        token_input: tokensIn,
        token_output: tokensOut,
        notes: {
          zip, radius, make, model, year,
          dropped: quality.dropped,
          buckets: quality.snapshot.buckets.slice(0, 8)
        }
      });
      return quality.kept;
    } catch (e: any) {
      await finishRunLog({
        run_id,
        status: "error",
        listings_found: 0,
        listings_upserted: 0,
        notes: { error: e?.message || String(e) }
      });
      throw e;
    }
  }
}

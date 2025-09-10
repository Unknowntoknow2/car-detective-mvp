/**
 * Robust valuation CLI
 * - Tries multiple engine locations & export names
 * - If not found, falls back to OpenAI listings agent (median + band)
 * Run with:
 *   pnpm run run:valuation -- --vin=... --mileage=... --condition=very_good --zip=95821 --radius=50
 */

import 'dotenv/config';
// Debug: print raw process.argv
console.log('DEBUG: process.argv:', process.argv);
import { marketValuationFromVin } from "../src/services/marketValuationUnified";
import minimist from "minimist";

// Debug: print parsed CLI arguments
(async () => {
  const args = minimist(process.argv.slice(2));
  console.log('DEBUG: Parsed CLI args:', args);
  const { vin, zip, mileage, condition, radius } = args;
  if (!vin || !zip) {
    console.error("Usage: --vin=... --zip=... [--mileage=...] [--condition=...] [--radius=...]");
    process.exit(1);
  }
  const result = await marketValuationFromVin({ vin, zip, mileage, condition, radius });
  // Pretty print advanced summary
  if (result.estimated_value) {
    const decoded = result.decoded?.categories?.identity || {};
    console.log(`\nHere’s the **valuation run** for VIN **${vin}** (${decoded.year || decoded.modelYear || ''} ${decoded.make || ''} ${decoded.model || ''} ${decoded.trim || ''}${mileage ? ", " + mileage + " miles" : ''}, ZIP ${zip}):\n`);
    console.log(`### 📊 Valuation Summary\n`);
    console.log(`* **Estimated Value (median):** **$${result.estimated_value.toLocaleString()}**`);
    console.log(`* **Buyer Value (fair purchase):** ~\$${result.buyer_value?.toLocaleString()}`);
    console.log(`* **Seller Value (fair listing):** ~\$${result.seller_value?.toLocaleString()}`);
    console.log(`* **Market Range:** $${result.market_range.low?.toLocaleString()} – $${result.market_range.high?.toLocaleString()}`);
    console.log(`* **Confidence Score:** **${(result.confidence * 100).toFixed(0)}%**`);
    console.log(`\n### 🛒 Market Listings (sampled)\n`);
    for (const c of result.comps) {
      console.log(`* ${c.source} → $${c.price.toLocaleString()}${c.mileage ? ` (${c.mileage.toLocaleString()} mi)` : ''}${c.url ? ` [link](${c.url})` : ''}`);
    }
    if (result.commentary?.length) {
      console.log("\n" + result.commentary.join("\n"));
    }
  } else {
    console.log("\n❌ Valuation failed or no comps found.\n");
    if (result.error) console.log("Reason:", result.error);
    if (result.commentary?.length) console.log(result.commentary.join("\n"));
  }
})();

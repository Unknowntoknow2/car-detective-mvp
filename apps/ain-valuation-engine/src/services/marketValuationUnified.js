// Unified market-based valuation: VIN → decode → fetch comps → compute value
import { decodeVin, isVinDecodeSuccessful } from "./unifiedVinDecoder";
import { OpenAIListingsAgent } from "./marketAgents/retail/OpenAIListingsAgent";
export async function marketValuationFromVin({ vin, zip, mileage, condition, radius = 50 }) {
    try {
        // 1. Decode VIN
        const decoded = await decodeVin(vin);
        if (!isVinDecodeSuccessful(decoded)) {
            return { vin, decoded, estimated_value: null, buyer_value: null, seller_value: null, market_range: { low: null, high: null }, confidence: 0, confidence_comment: "VIN decode failed", comps: [], commentary: ["VIN decode failed"], error: decoded?.metadata?.errorText || "VIN decode failed" };
        }
        const { make, model, modelYear } = decoded.categories.identity;
        // 2. Fetch comps
        const agent = new OpenAIListingsAgent();
        const compsRaw = await agent.run({ zip, radius, make, model, year: Number(modelYear) });
        const comps = (compsRaw || []).map((l) => ({
            source: l.source || l.site || "Unknown",
            price: Number(l.price || 0),
            mileage: l.mileage ?? null,
            url: l.url ?? undefined
        })).filter(c => Number.isFinite(c.price) && c.price > 500 && c.price < 500000);
        const prices = comps.map(c => c.price);
        if (!prices.length) {
            return { vin, decoded, estimated_value: null, buyer_value: null, seller_value: null, market_range: { low: null, high: null }, confidence: 0.5, confidence_comment: "No market comps found", comps: [], commentary: ["No market comps found"], error: "No comps" };
        }
        prices.sort((a, b) => a - b);
        const median = prices[Math.floor(prices.length / 2)];
        const p25 = prices[Math.floor(prices.length * 0.25)];
        const p75 = prices[Math.floor(prices.length * 0.75)];
        // Buyer/seller band
        const buyer = Math.round(median * 0.97);
        const seller = Math.round(median * 1.03);
        // Confidence: based on comp count, spread, and source diversity
        const spread = (p75 - p25) / median;
        const sourceSet = new Set(comps.map(c => c.source));
        let confidence = 0.5 + 0.1 * Math.log(prices.length) - 0.2 * spread + 0.1 * Math.min(sourceSet.size, 4);
        confidence = Math.max(0.5, Math.min(0.99, confidence));
        // Commentary
        const commentary = [];
        if (spread < 0.05)
            commentary.push("✅ Spread is tight (<5%), so valuation is stable.");
        else if (spread < 0.10)
            commentary.push("⚠️ Spread is moderate (<10%), some market variation.");
        else
            commentary.push("⚠️ Spread is wide (>10%), market is volatile or comps are inconsistent.");
        if (confidence > 0.9)
            commentary.push("✅ Confidence is high because multiple Tier 1 marketplaces agree.");
        else if (confidence > 0.7)
            commentary.push("⚠️ Confidence is moderate; check comps for outliers.");
        else
            commentary.push("⚠️ Confidence is low; few comps or high spread.");
        // Confidence comment
        let confidence_comment = "";
        if (confidence > 0.9)
            confidence_comment = "High confidence (multiple sources, tight spread)";
        else if (confidence > 0.7)
            confidence_comment = "Moderate confidence (some source agreement)";
        else
            confidence_comment = "Low confidence (few comps or wide spread)";
        // Return advanced result
        return {
            vin,
            decoded,
            estimated_value: Math.round(median),
            buyer_value: buyer,
            seller_value: seller,
            market_range: { low: Math.round(p25), high: Math.round(p75) },
            confidence: Math.round(confidence * 100) / 100,
            confidence_comment,
            comps: comps.slice(0, 8),
            commentary
        };
    }
    catch (e) {
        return { vin, decoded: null, estimated_value: null, buyer_value: null, seller_value: null, market_range: { low: null, high: null }, confidence: 0, confidence_comment: "Error", comps: [], commentary: ["Error: " + (e?.message || String(e))], error: e?.message || String(e) };
    }
}

import { createRequire as _createRequire } from "module";
const __require = _createRequire(import.meta.url);
// @ts-nocheck
import { OpenAIListingsAgent } from "../services/marketAgents/retail/OpenAIListingsAgent.js";
const minimist = __require("minimist");
import { getCohortStats } from "../valuation/CohortStats.js";
const args = minimist(process.argv.slice(2));
const { zip = "94103", radius = 100, make, model, year, mode = "ingest" } = args;
(async () => {
    if (mode === "stats") {
        const stats = await getCohortStats({ zip, radius: radius ? Number(radius) : undefined, make, model, year: year ? Number(year) : undefined });
        console.log(JSON.stringify(stats, null, 2));
        return;
    }
    // Default: ingest mode
    const agent = new OpenAIListingsAgent();
    const rows = await agent.run({ zip, radius, make, model, year: year ? Number(year) : undefined });
    console.log(JSON.stringify({ upserted: rows.length, sample: rows.slice(0, 3) }, null, 2));
    // Short, valuation-focused summary
    const prices = rows.map(r => r.price).filter(Number.isFinite);
    const miles = rows.map(r => r.mileage).filter(Number.isFinite);
    const med = (arr) => arr.length ? arr.sort((a, b) => a - b)[Math.floor(arr.length / 2)] : null;
    console.log(JSON.stringify({
        upserted: rows.length,
        medians: { price: med(prices), mileage: med(miles) },
        sample: rows.slice(0, 3)
    }, null, 2));
})();

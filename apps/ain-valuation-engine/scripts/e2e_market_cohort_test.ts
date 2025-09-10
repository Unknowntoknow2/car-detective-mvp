import { OpenAIListingsAgent } from "../src/services/marketAgents/retail/OpenAIListingsAgent";
import { routeDomains } from "../src/services/marketAgents/router";
import { loadSourceRegistry } from "../src/services/marketAgents/config/sources.master";

async function main() {
  const cohort = { make: "Toyota", model: "Camry", year: 2019, zip: "94103", radius: 100 };
  const domains = routeDomains(cohort);
  const registry = loadSourceRegistry();
  console.log("\n--- E2E Market Cohort Test ---");
  console.log("Query:", cohort);
  console.log("Domains Queried:", domains);
  console.log("Policies:", domains.map(d => ({ domain: d, ...registry[d] })));

  const agent = new OpenAIListingsAgent();
  const listings = await agent.run(cohort);
  console.log(`\nListings returned: ${listings.length}`);
  for (const l of listings.slice(0, 10)) {
    console.log({
      year: l.year, make: l.make, model: l.model, price: l.price, mileage: l.mileage, zip: l.zip, source: l.source, url: l.url, dealer: l.dealer, fetchedAt: l.fetchedAt
    });
  }
  if (listings.length > 10) console.log(`...and ${listings.length - 10} more.`);
}

main().catch(e => { console.error(e); process.exit(1); });

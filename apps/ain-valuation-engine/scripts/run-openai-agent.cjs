const { OpenAIListingsAgent } = require("../src/services/marketAgents/retail/OpenAIListingsAgent");
const minimist = require("minimist");

const args = minimist(process.argv.slice(2));
const { zip = "94103", radius = 100, vin, make, model, year } = args;

(async () => {
  const agent = new OpenAIListingsAgent();
  const stored = await agent.run({ zip, radius, vin, make, model, year });
  console.log(`[OpenAIMarketSearch] upserted=${stored.length}`);
})();

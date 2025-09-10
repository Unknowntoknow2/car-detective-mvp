import { openaiFetchListings } from "./openaiSearch";
import { domainPromptKitMap } from "./promptKits/domainPromptKitMap";

// queries: array of { domain, query }
export async function searchInBatches(queries: { domain: string, query: string }[], batchSize = 10) {
  const out: any[] = []; const errors: any[] = []; let tIn=0, tOut=0;
  for (let i=0; i<queries.length; i+=batchSize) {
    const chunk = queries.slice(i, i+batchSize);
    // Group by domain for prompt kit selection
    const byDomain: Record<string, string[]> = {};
    for (const { domain, query } of chunk) {
      if (!byDomain[domain]) byDomain[domain] = [];
      byDomain[domain].push(query);
    }
    for (const domain of Object.keys(byDomain)) {
      const kit = domainPromptKitMap[domain];
      const prompt = byDomain[domain].map(q => `- ${q}`).join("\n");
      try {
        const { listings, tokensIn, tokensOut } = await openaiFetchListings(
          kit
            ? { system: kit.system, example: kit.example, schema: kit.schema, prompt }
            : `Find real for-sale car listings:\n${prompt}\nReturn JSON only.`
        );
        out.push(...listings); tIn+=tokensIn; tOut+=tokensOut;
      } catch (e:any) { errors.push({ domain, e: e?.message || String(e) }); }
    }
  }
  return { listings: out, errors, tokensIn: tIn, tokensOut: tOut };
}

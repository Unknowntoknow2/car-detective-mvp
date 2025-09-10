import OpenAI from "openai";
import * as cheerio from "cheerio";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const EXTRACT_PROMPT = `
You are a structured data extractor. Input is raw HTML (maybe with JSON-LD) for a listing page (VDP) or search results page (SRP).
Output STRICT JSON matching the provided schema.

Rules:
- Parse all listings on the page (if SRP) or a single listing (if VDP). Return [] if none.
- Base fields: make, model, (year if obvious), price (number only), mileage (number only), primary image URL, VIN if present, dealer name & phone if shown, ZIP/postal code if present.
- Always set 'url' to the provided page URL and 'source' to its hostname.
- 'fetchedAt' must be the provided ISO timestamp.
- Do NOT hallucinate; if a field is absent, set it null.
- Output MUST satisfy the JSON schema exactly; no extra keys, no commentary.
`;
function ldJsonBlocks(html) {
    const $ = cheerio.load(html);
    const blocks = $('script[type="application/ld+json"]').map((_, el) => $(el).text().trim()).get();
    return blocks.slice(0, 3);
}
export async function extractListingsFromHtml(params) {
    const { html, url, nowISO = new Date().toISOString(), model = "gpt-4o-mini" } = params;
    const origin = new URL(url);
    const ld = ldJsonBlocks(html);
    const messages = [
        { role: "system", content: "You are a careful, non-hallucinating information extractor." },
        {
            role: "user",
            content: EXTRACT_PROMPT +
                `\nURL: ${url}\nFETCHED_AT: ${nowISO}\nHOST: ${origin.hostname}` +
                `\nLD_JSON_BLOCKS:\n${ld.join("\n---\n")}` +
                `\nHTML:\n${html.slice(0, 300_000)}`
        }
    ];
    // Use response_format: { type: 'json_object' } for strict JSON output
    const resp = await client.chat.completions.create({
        model,
        messages,
        response_format: { type: "json_object" }
    });
    let data = {};
    try {
        data = JSON.parse(resp.choices[0]?.message?.content ?? "{}");
    }
    catch {
        data = { listings: [] };
    }
    const listings = Array.isArray(data.listings) ? data.listings : [];
    for (const it of listings) {
        it.url = it.url || url;
        it.source = it.source || origin.hostname;
        it.fetchedAt = it.fetchedAt || nowISO;
    }
    // attempt to capture usage if present in SDK response
    const tokensIn = resp?.usage?.input_tokens ?? resp?.usage?.prompt_tokens;
    const tokensOut = resp?.usage?.output_tokens ?? resp?.usage?.completion_tokens;
    return { listings, tokensIn, tokensOut };
}

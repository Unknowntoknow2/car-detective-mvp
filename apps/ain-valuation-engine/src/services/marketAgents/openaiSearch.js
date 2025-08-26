import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MarketListingSchema = {
    name: "MarketListingArray",
    schema: {
        type: "object",
        properties: {
            listings: {
                type: "array",
                items: {
                    type: "object",
                    required: ["source", "listing_url", "make", "model", "price", "zip", "fetchedAt"],
                    properties: {
                        source: { type: "string" },
                        listing_url: { type: "string", format: "uri" },
                        photo_url: { type: "string" },
                        make: { type: "string" },
                        model: { type: "string" },
                        year: { type: "integer" },
                        trim: { type: "string" },
                        price: { type: "number" },
                        mileage: { type: "number" },
                        vin: { type: "string" },
                        dealer_name: { type: "string" },
                        dealer_phone: { type: "string" },
                        zip: { type: "string" },
                        fetchedAt: { type: "string", format: "date-time" }
                    }
                }
            }
        },
        required: ["listings"],
        additionalProperties: false
    }
};
// Accepts either a string prompt or a prompt kit object
export async function openaiFetchListings(promptOrKit) {
    let systemMsg = "Return ONLY JSON matching the schema. Extract real car sale listings from the public web. Do not fabricate. Include fetchedAt as ISO string.";
    let userPrompt = "";
    let schema = MarketListingSchema;
    if (typeof promptOrKit === "string") {
        userPrompt = promptOrKit;
    }
    else {
        systemMsg = promptOrKit.system;
        userPrompt = `${promptOrKit.example}\n${promptOrKit.prompt}`;
        schema = { name: "MarketListingArray", schema: promptOrKit.schema };
    }
    const res = await client.responses.create({
        model: "gpt-4o-mini",
        input: [
            { role: "system", content: systemMsg },
            { role: "user", content: userPrompt }
        ],
        temperature: 0
    });
    const text = res.output_text || "{}";
    let parsed;
    try {
        parsed = JSON.parse(text);
    }
    catch {
        parsed = { listings: [] };
    }
    if (!parsed?.listings || !Array.isArray(parsed.listings))
        return { listings: [], tokensIn: res.usage?.input_tokens || 0, tokensOut: res.usage?.output_tokens || 0 };
    return { listings: parsed.listings, tokensIn: res.usage?.input_tokens || 0, tokensOut: res.usage?.output_tokens || 0 };
}

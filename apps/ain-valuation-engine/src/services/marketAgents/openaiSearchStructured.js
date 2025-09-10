import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export async function fetchListingsForTier(systemMsg, userMsg, model = "gpt-4o-mini") {
    const res = await client.responses.create({
        model,
        input: [{ role: "system", content: systemMsg }, { role: "user", content: userMsg }],
        temperature: 0
    });
    const text = res.output_text || "{}";
    let parsed = {};
    try {
        parsed = JSON.parse(text);
    }
    catch { }
    const listings = Array.isArray(parsed?.listings) ? parsed.listings : [];
    return { listings, tokensIn: res.usage?.input_tokens || 0, tokensOut: res.usage?.output_tokens || 0 };
}

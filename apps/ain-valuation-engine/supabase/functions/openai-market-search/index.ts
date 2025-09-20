// deno-lint-ignore-file no-explicit-any
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;
const DOMAIN_ALLOWLIST = [
  "cargurus.com","cars.com","autotrader.com","carmax.com","carvana.com","vroom.com",
  "ebay.com","ebaymotors.com","edmunds.com","truecar.com","ihemmings.com","hemmings.com",
  "bringatrailer.com","carsandbids.com","copart.com","adesa.com"
];

type RequestPayload = {
  zip?: string;
  radius_miles?: number;
  vin?: string;
  make?: string;
  model?: string;
  year?: number;
  max_results?: number; // default 30
};

const schema = {
  type: "object",
  properties: {
    query: { type: "object" },
    listings: {
      type: "array",
      items: {
        type: "object",
        properties: {
          source_domain: { type: "string" },
          source_url: { type: "string" },
          listing_type: { type: "string", enum: ["retail","auction","specialty"] },
          vin: { type: "string" },
          year: { type: "number" },
          make: { type: "string" },
          model: { type: "string" },
          trim: { type: "string" },
          price_listed: { type: "number" },
          price_currency: { type: "string", enum: ["USD"] },
          mileage: { type: "number" },
          dealer_name: { type: "string" },
          dealer_city: { type: "string" },
          dealer_state: { type: "string" },
          dealer_zip: { type: "string" },
          photos: { type: "array", items: { type: "string" } },
          features: { type: "array", items: { type: "string" } },
          fetched_at_iso: { type: "string" }
        },
        required: ["source_domain","source_url","listing_type","fetched_at_iso"]
      }
    },
    notes: { type: "string" }
  },
  required: ["query","listings"]
};

function buildPrompt(p: RequestPayload) {
  const want = [
    p.vin ? `VIN=${p.vin}` : null,
    p.year ? `Year=${p.year}` : null,
    p.make ? `Make=${p.make}` : null,
    p.model ? `Model=${p.model}` : null,
    p.zip ? `ZIP=${p.zip}` : null,
    p.radius_miles ? `Radius=${p.radius_miles}mi` : null
  ].filter(Boolean).join(", ");

  const allow = DOMAIN_ALLOWLIST.join(", ");
  return `
You are a vehicle listings research assistant. Find CURRENT used-vehicle listings on the PUBLIC WEB from the allowlist domains ONLY: ${allow}.
Return a structured JSON object following the provided JSON Schema. Do not include demo, placeholder, or expired listings.

Constraints:
- Prefer exact VIN matches when VIN is provided; otherwise, match by year/make/model within ${p.radius_miles ?? 100} miles of ZIP ${p.zip ?? "N/A"}.
- For each listing, include a resolvable source_url (direct detail page), and record the time you observed it (fetched_at_iso, ISO-8601).
- Only include listings clearly in USD and in the United States for this query.
- Limit to ${p.max_results ?? 30} results.
- Ensure cleanliness: numeric price/mileage, concise features, dealer city/state/zip when present.

User query: ${want || "General used-car listings near the given ZIP."}
`;
}

async function callOpenAI(prompt: string, jsonSchema: any) {
  const body = {
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_schema", json_schema: { name: "ListingResponse", schema, strict: true } }
  };

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`OpenAI error ${resp.status}: ${txt}`);
  }
  const data = await resp.json();
  const raw = data.choices?.[0]?.message?.content;
  if (!raw) throw new Error("Empty OpenAI response");
  return JSON.parse(raw);
}

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

    const payload = await req.json() as RequestPayload;
    const prompt = buildPrompt(payload);
    const json = await callOpenAI(prompt, schema);

    // Domain allowlist enforcement:
    const filtered = (json.listings || []).filter((l: any) =>
      DOMAIN_ALLOWLIST.some(d => l.source_domain?.toLowerCase().includes(d))
    );

    const result = { query: payload, listings: filtered, notes: json.notes ?? null };
    return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});

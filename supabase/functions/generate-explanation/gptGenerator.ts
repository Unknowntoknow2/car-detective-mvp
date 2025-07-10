import { ExplanationRequest } from "./types.ts";

/**
 * Generates an explanation using OpenAI's GPT-4o model
 * @param data The valuation data
 * @returns A professional explanation string from GPT-4o
 */
export async function generateGPT4Explanation(
  data: ExplanationRequest,
): Promise<string> {
  try {
    const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAIApiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }

    const {
      make,
      model,
      year,
      mileage,
      condition,
      zipCode = data.location,
      baseMarketValue,
      finalValuation,
      adjustments,
      mileageAdj = 0,
      conditionAdj = 0,
      zipAdj = 0,
      featureAdjTotal = 0,
    } = data;

    // Create system prompt for structured markdown output
    const systemPrompt = `
You are a world-class vehicle pricing analyst. Your job is to explain clearly why a car received the valuation it did using structured markdown formatting.

Return the explanation in this EXACT markdown format:

## 📊 Valuation Breakdown

- **Base MSRP:** $X,XXX (source: VIN decode/estimated)
- **Mileage Adjustment:** +/-$X,XXX (actual miles vs baseline)
- **Condition Adjustment:** +/-$X,XXX (condition impact)
- **Regional Adjustment:** +/-$X,XXX (ZIP code market)
- **Fuel Type Impact:** +/-$X,XXX (fuel type penalty/bonus)
- **Market Anchoring:** +/-$X,XXX (live market data)

### 🎯 Final Value: **$XX,XXX**

### 🤖 Confidence: XX%

**Reasoning:** [Brief explanation of confidence level based on data availability]

---

**Data Sources:**
- VIN Decode (NHTSA)
- Fuel Prices (EIA API)
- Market Listings (Live comps)
- Regional Adjustments

Be precise with numbers and professional in tone. This is for someone potentially selling a $20,000+ asset.
`;

    // Create user prompt with structured data
    const userPrompt = `
Vehicle: ${year} ${make} ${model}
Mileage: ${mileage.toLocaleString()} miles
Condition: ${condition}
ZIP Code: ${zipCode}
Base Market Price: $${baseMarketValue.toLocaleString()}

Adjustments:
* Mileage Adjustment: $${mileageAdj.toLocaleString()}
* Condition Adjustment: $${conditionAdj.toLocaleString()}
* ZIP Regional Adjustment: $${zipAdj.toLocaleString()}
* Feature Adjustments: $${featureAdjTotal.toLocaleString()}

Final Valuation: $${finalValuation.toLocaleString()}

Explain this to a car owner with transparency, so they understand how the price was formed.
`;

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAIApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(
        `OpenAI API error: ${errorData.error?.message || "Unknown error"}`,
      );
    }

    const result = await response.json();
    return result.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating GPT-4o explanation:", error);
    return "We're unable to generate the explanation right now. Please try again later.";
  }
}

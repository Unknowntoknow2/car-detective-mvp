export const usT1PromptKit = {
  system: `You are a structured data extractor for US Tier-1 car marketplaces. Extract only real, currently for-sale car listings. Output must be strict JSON matching the provided schema. Do not hallucinate.`,
  example: `Find all 2019-2021 Toyota Camry listings in San Francisco, CA.`,
  schema: {
    type: "object",
    properties: {
      listings: {
        type: "array",
        items: {
          type: "object",
          required: ["source","listing_url","make","model","price","zip","fetchedAt"],
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

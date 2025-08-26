// Strict schema for OpenAI response_format: json_schema
export const ListingJsonSchema = {
    name: "listing_schema",
    schema: {
        type: "object",
        properties: {
            listings: {
                type: "array",
                items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        vin: { type: "string", nullable: true },
                        make: { type: "string" },
                        model: { type: "string" },
                        year: { type: "number", nullable: true },
                        price: { type: "number", nullable: true },
                        mileage: { type: "number", nullable: true },
                        zip: { type: "string", nullable: true },
                        dealer: { type: "string", nullable: true },
                        dealerPhone: { type: "string", nullable: true },
                        url: { type: "string" },
                        image: { type: "string", nullable: true },
                        source: { type: "string" },
                        fetchedAt: { type: "string" }
                    },
                    required: ["make", "model", "url", "source", "fetchedAt"]
                }
            }
        },
        required: ["listings"],
        additionalProperties: false
    },
    strict: true
};

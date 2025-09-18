import fetch from "node-fetch";

const RAPIDAPI_HOST = "vehicle-pricing-api.p.rapidapi.com";

export async function fetchMarketPricing(make: string, model: string, year: number) {
  if (!process.env.RAPIDAPI_KEY) {
    console.warn("⚠️ Missing RAPIDAPI_KEY, skipping market pricing");
    return null;
  }

  const url = `https://${RAPIDAPI_HOST}/get%2Bvehicle%2Bvalue?maker=${make}&model=${model}&year=${year}`;

  const res = await fetch(url, {
    headers: {
      "x-rapidapi-host": RAPIDAPI_HOST,
      "x-rapidapi-key": process.env.RAPIDAPI_KEY
    }
  });

  if (!res.ok) {
    console.error("❌ MarketPricing API error:", res.status, await res.text());
    return null;
  }

  const data = (await res.json()) as Record<string, unknown>;
  const toNumber = (value: unknown): number | null => {
    const numeric =
      typeof value === "string"
        ? Number(value)
        : typeof value === "number"
          ? value
          : null;
    return typeof numeric === "number" && !Number.isNaN(numeric) ? numeric : null;
  };

  return {
    retail: toNumber(data.retail),
    wholesale: toNumber(data.wholesale),
    tradeIn: toNumber(data.tradeIn),
  };
}

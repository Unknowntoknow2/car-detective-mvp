import fetch from "node-fetch";

const RAPIDAPI_HOST = "vehicle-pricing-api.p.rapidapi.com";

type MarketPricingApiResponse = {
  retail?: number | null;
  wholesale?: number | null;
  tradeIn?: number | null;
  [key: string]: unknown;
};

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

  const data = (await res.json()) as MarketPricingApiResponse;
  return {
    retail: data?.retail || null,
    wholesale: data?.wholesale || null,
    tradeIn: data?.tradeIn || null
  };
}

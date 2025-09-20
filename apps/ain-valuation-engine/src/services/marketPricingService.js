import fetch from "node-fetch";
const RAPIDAPI_HOST = "vehicle-pricing-api.p.rapidapi.com";
export async function fetchMarketPricing(make, model, year) {
    if (!process.env.RAPIDAPI_KEY) {
        
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
        );
        return null;
    }
    const data = await res.json();
    return {
        retail: data?.retail || null,
        wholesale: data?.wholesale || null,
        tradeIn: data?.tradeIn || null
    };
}

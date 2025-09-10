import { z } from "zod";

import type { MarketListing } from '../../../types/marketListing';

export const MarketListingArraySchema = {
  name: "MarketListingArray",
  schema: {
    type: "object",
    required: ["listings"],
    properties: { listings: { type: "array", items: { type: "object", properties: {
      source:{type:"string"}, listing_url:{type:"string", format:"uri"}, photo_url:{type:"string"},
      make:{type:"string"}, model:{type:"string"}, year:{type:"integer"}, trim:{type:"string"},
      price:{type:"number"}, mileage:{type:"number"}, vin:{type:"string"},
      dealer_name:{type:"string"}, dealer_phone:{type:"string"}, zip:{type:"string"},
      fetchedAt:{type:"string", format:"date-time"}
    }}}}
  }
} as const;

export function systemForTier(tier: string, domains: string[]) {
  const allowList = domains.map(d => `- ${d}`).join("\n");
  return `You extract ONLY real for-sale vehicle listings FROM THESE DOMAINS:\n${allowList}\nReturn STRICT JSON per schema. No narratives. No hallucinations. Include fetchedAt (ISO).`;
}

export function userQuery({ make, model, year, zip, radius }:{make?:string; model?:string; year?:number; zip?:string; radius?:number}) {
  const parts = [
    make && `make=${make}`, model && `model=${model}`, year && `year=${year}`,
    zip && `zip=${zip}`, radius && `radius=${radius}mi`
  ].filter(Boolean).join(", ");
  return `Find current for-sale listings with: ${parts}.`;
}

// src/utils/scrapers/fetchBidCarsData.ts

import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

// Server-side environment values (Service Role Key only)
const serverSupabase = createClient(
  import.meta.env.SUPABASE_URL!,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Auction result schema
const AuctionDataSchema = z.object({
  vin: z.string(),
  soldDate: z.string(),
  price: z.string(),
  odometer: z.string(),
  auctionSource: z.enum(["Copart", "IAAI"]),
  location: z.string().optional(),
  conditionGrade: z.string().optional(),
  photoUrls: z.array(z.string()),
});

export type AuctionData = z.infer<typeof AuctionDataSchema>;

export async function fetchBidCarsData(vin: string): Promise<AuctionData | null> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    const searchUrl = `https://bid.cars/en/search-results/all-years/all-makes/all-models?query=${vin}`;
    await page.goto(searchUrl, { timeout: 30000, waitUntil: "domcontentloaded" });

    const firstLink = await page.locator(".card-title > a").first();
    const hasResult = await firstLink.count();

    if (!hasResult) throw new Error(`No results found on Bid.Cars for VIN: ${vin}`);

    await firstLink.click();
    await page.waitForLoadState("domcontentloaded");

    const soldDate = await page.locator("text=Sale Date").locator(".. >> span").textContent();
    const price = await page.locator("text=Final Bid").locator(".. >> span").textContent();
    const odometer = await page.locator("text=Odometer").locator(".. >> span").textContent();
    const location = await page.locator("text=Location").locator(".. >> span").textContent();
    const condition = await page.locator("text=Primary Damage").locator(".. >> span").textContent();
    const auctionSource = await page.locator("text=Auction").locator(".. >> span").textContent();

    const imageHandles = await page.locator("img.vehicle-image").all();
    const photoUrls: string[] = [];

    for (const img of imageHandles) {
      const src = await img.getAttribute("src");
      if (src) photoUrls.push(src);
    }

    const result: AuctionData = {
      vin,
      soldDate: soldDate?.trim() || "Unknown",
      price: price?.trim() || "N/A",
      odometer: odometer?.trim() || "N/A",
      location: location?.trim() || undefined,
      conditionGrade: condition?.trim() || undefined,
      auctionSource: auctionSource?.includes("IAAI") ? "IAAI" : "Copart",
      photoUrls,
    };

    const validated = AuctionDataSchema.parse(result);

    const { error } = await serverSupabase
      .from("auction_results_by_vin")
      .insert([validated]);

    if (error) {
      throw new Error(`Supabase insert failed: ${error.message}`);
    }

    return validated;
  } catch (err) {
    console.error(`❌ Error fetching Bid.Cars data for VIN ${vin}:`, err);
    return null;
  } finally {
    await browser.close();
  }
}

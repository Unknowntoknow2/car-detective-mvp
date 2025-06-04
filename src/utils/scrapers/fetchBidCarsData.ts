// src/utils/scrapers/fetchBidCarsData.ts

import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import process from "node:process";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Data schema validation
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

type AuctionData = z.infer<typeof AuctionDataSchema>;

export async function fetchBidCarsData(
  vin: string,
): Promise<AuctionData | null> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Construct the VIN search URL
    const searchUrl =
      `https://bid.cars/en/search-results/all-years/all-makes/all-models?query=${vin}`;
    await page.goto(searchUrl, {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    // Click the first result if present
    const firstLink = await page.locator(".card-title > a").first();
    const hasResult = await firstLink.count();

    if (!hasResult) throw new Error(`VIN not found on Bid.Cars: ${vin}`);

    await firstLink.click();
    await page.waitForLoadState("domcontentloaded");

    // Extract auction fields
    const soldDate = await page.locator("text=Sale Date").locator(".. >> span")
      .textContent();
    const price = await page.locator("text=Final Bid").locator(".. >> span")
      .textContent();
    const odometer = await page.locator("text=Odometer").locator(".. >> span")
      .textContent();
    const location = await page.locator("text=Location").locator(".. >> span")
      .textContent();
    const condition = await page.locator("text=Primary Damage").locator(
      ".. >> span",
    ).textContent();
    const auctionSource = await page.locator("text=Auction").locator(
      ".. >> span",
    ).textContent();

    // Extract photos
    const imageHandles = await page.locator("img.vehicle-image").all();
    const photoUrls: string[] = [];
    for (const img of imageHandles) {
      const src = await img.getAttribute("src");
      if (src) photoUrls.push(src);
    }

    const parsed: AuctionData = {
      vin,
      soldDate: soldDate?.trim() || "",
      price: price?.trim() || "",
      odometer: odometer?.trim() || "",
      location: location?.trim() || "",
      conditionGrade: condition?.trim() || "",
      auctionSource:
        (auctionSource?.includes("IAAI") ? "IAAI" : "Copart") as AuctionData[
          "auctionSource"
        ],
      photoUrls,
    };

    // Validate structure
    const validated = AuctionDataSchema.parse(parsed);

    // Insert into Supabase
    const { error } = await supabase.from("auction_results_by_vin").insert([
      validated,
    ]);
    if (error) throw new Error(`Supabase insert failed: ${error.message}`);

    return validated;
  } catch (err) {
    console.error(`Error fetching Bid.Cars data for VIN ${vin}:`, err);
    return null;
  } finally {
    await browser.close();
  }
}

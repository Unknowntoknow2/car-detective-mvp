import axios from "axios";
import * as cheerio from "cheerio";

export interface EbayListing {
  title: string;
  price: number | null;
  year: number | null;
  make: string | null;
  model: string | null;
  mileage: number | null;
  location: string | null;
  detailUrl: string;
  imageUrl?: string;
  bids?: number;
  timeLeft?: string;
}

/**
 * Scrape eBay Motors for car listings.
 * @param params Object with make, model, zip, maxResults, and optionally year.
 */
export async function scrapeEbayMotorsListings({
  make,
  model,
  zip = "95814",
  maxResults = 10,
  year,
}: {
  make: string;
  model: string;
  zip?: string;
  maxResults?: number;
  year?: number;
}): Promise<EbayListing[]> {
  // Build search URL
  const keywords = [year, make, model].filter(Boolean).join("+");
  const url = `https://www.ebay.com/sch/Cars-Trucks/6001/i.html?_nkw=${encodeURIComponent(
    keywords
  )}&_stpos=${zip}&_ipg=${maxResults}`;

  try {
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(html);
    const results: EbayListing[] = [];

    $(".s-item").slice(0, maxResults).each((_, el) => {
      const title = $(el).find(".s-item__title").text().trim();

      // Parse price (e.g., "$23,500")
      const priceText = $(el)
        .find(".s-item__price")
        .first()
        .text()
        .replace(/[$,]/g, "");
      const price = priceText ? parseInt(priceText, 10) : null;

      // Extract year/make/model if in title
      let year: number | null = null;
      let makeFound: string | null = null;
      let modelFound: string | null = null;
      const titleMatch = title.match(
        /(\d{4})\s+([A-Za-z]+)\s+([A-Za-z0-9\-]+)/ // e.g., "2018 Toyota Camry"
      );
      if (titleMatch) {
        year = parseInt(titleMatch[1], 10);
        makeFound = titleMatch[2];
        modelFound = titleMatch[3];
      }

      // Mileage
      let mileage: number | null = null;
      const mileageMatch = title.match(/(\d{1,3}(?:,\d{3})*)\s*(mi|miles)/i);
      if (mileageMatch) {
        mileage = parseInt(mileageMatch[1].replace(/,/g, ""), 10);
      }

      // Location
      const location =
        $(el).find(".s-item__location.s-item__itemLocation").text().trim() || null;

      // Detail URL
      let detailUrl = $(el).find(".s-item__link").attr("href") || "";
      if (detailUrl && !detailUrl.startsWith("http")) {
        detailUrl = "https://www.ebay.com" + detailUrl;
      }

      // Image URL
      const imageUrl = $(el).find(".s-item__image-img").attr("src") || undefined;

      // Bids
      const bidsText = $(el).find(".s-item__bids.s-item__bidCount").text();
      const bids = bidsText ? parseInt(bidsText.replace(/[^\d]/g, ""), 10) : undefined;

      // Time Left
      const timeLeft = $(el).find(".s-item__time-left").text().trim() || undefined;

      results.push({
        title,
        price,
        year,
        make: makeFound || make,
        model: modelFound || model,
        mileage,
        location,
        detailUrl,
        imageUrl,
        bids,
        timeLeft,
      });
    });

    return results;
  } catch (err) {
    console.error("[eBay Motors Scraper Error]", err);
    throw new Error("Failed to fetch eBay Motors listings");
  }
}

// Example usage (for dev/test):
// (async () => {
//   const cars = await scrapeEbayMotorsListings({
//     make: "Ford",
//     model: "F-150",
//     zip: "94105",
//     maxResults: 5,
//   });
//   console.log(cars);
// })();


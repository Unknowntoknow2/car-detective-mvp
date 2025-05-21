import axios from "axios";
import * as cheerio from "cheerio";

export interface AutoTraderListing {
  title: string;
  price: number | null;
  year: number | null;
  make: string;
  model: string;
  mileage: number | null;
  location: string;
  detailUrl: string;
  imageUrl?: string;
}

export interface SearchAutoTraderOptions {
  make?: string;
  model?: string;
  zip?: string;
  maxResults?: number;
}

/**
 * Scrape vehicle listings from AutoTrader search results.
 * @param options - Search criteria (make, model, zip, maxResults)
 */
export async function scrapeAutoTraderListings(options: SearchAutoTraderOptions): Promise<AutoTraderListing[]> {
  const { make, model, zip = "95814", maxResults = 10 } = options;

  // Build search URL (US)
  const params = [
    make ? `makeCodeList=${encodeURIComponent(make.toUpperCase())}` : "",
    model ? `modelCodeList=${encodeURIComponent(model.toUpperCase())}` : "",
    `zip=${zip}`,
  ].filter(Boolean).join("&");

  const url = `https://www.autotrader.com/cars-for-sale/all-cars?${params}`;

  const listings: AutoTraderListing[] = [];

  try {
    const { data: html } = await axios.get(url, {
      headers: {
        // Simulate a real browser
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(html);

    $(".inventory-listing").slice(0, maxResults).each((i, el) => {
      const title = $(el).find(".inventory-listing-title").text().trim();

      const priceStr = $(el).find(".first-price").text().replace(/[$,]/g, "").trim();
      const price = priceStr ? parseInt(priceStr, 10) : null;

      // Year, make, model parsing from title (if possible)
      const titleParts = title.match(/^(\d{4})\s+(\w+)\s+(.+)/);
      const year = titleParts ? parseInt(titleParts[1], 10) : null;
      const makeParsed = titleParts ? titleParts[2] : (make || "");
      const modelParsed = titleParts ? titleParts[3].split(" ")[0] : (model || "");

      // Mileage
      const mileageStr = $(el).find(".text-bold.text-size-400.text-size-sm-300.text-size-xs-300").first().text().replace(/[^\d]/g, "");
      const mileage = mileageStr ? parseInt(mileageStr, 10) : null;

      // Location
      const location = $(el).find(".dealer-location").text().trim();

      // Detail URL
      let detailUrl = $(el).find(".inventory-listing-header a").attr("href") || "";
      if (detailUrl && !detailUrl.startsWith("http")) {
        detailUrl = "https://www.autotrader.com" + detailUrl;
      }

      // Image URL
      const imageUrl = $(el).find("img").attr("src") || undefined;

      listings.push({
        title,
        price,
        year,
        make: makeParsed,
        model: modelParsed,
        mileage,
        location,
        detailUrl,
        imageUrl,
      });
    });

    return listings;
  } catch (error) {
    console.error("[AutoTrader Scraper Error]", error);
    throw new Error("Failed to fetch AutoTrader listings");
  }
}

// Example usage (for dev/test):
// (async () => {
//   const results = await scrapeAutoTraderListings({ make: "Toyota", model: "Camry", zip: "95814", maxResults: 3 });
//   console.log(results);
// })();


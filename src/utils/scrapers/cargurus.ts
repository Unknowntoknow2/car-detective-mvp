import axios from "axios";
import * as cheerio from "cheerio";

export interface CarGurusListing {
  title: string;
  price: number | null;
  year: number | null;
  make: string;
  model: string;
  mileage: number | null;
  location: string;
  detailUrl: string;
  imageUrl?: string;
  rating?: string;
}

/**
 * Scrapes car listings from CarGurus search results.
 * @param make - Car make (e.g., "Toyota")
 * @param model - Car model (e.g., "Camry")
 * @param zip - US Zip code (default: "95814")
 * @param maxResults - Max results to return (default: 10)
 */
export async function scrapeCarGurusListings({
  make,
  model,
  zip = "95814",
  maxResults = 10,
}: {
  make: string;
  model: string;
  zip?: string;
  maxResults?: number;
}): Promise<CarGurusListing[]> {
  const url = `https://www.cargurus.com/Cars/inventorylisting/viewDetailsFilterViewInventoryListing.action?zip=${zip}&showNegotiable=false&sortDir=ASC&sourceContext=carGurusHomePageModel&distance=50&sortType=DEAL_SCORE&entitySelectingHelper.selectedMake=${encodeURIComponent(
    make
  )}&entitySelectingHelper.selectedModel=${encodeURIComponent(model)}`;

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
    const results: CarGurusListing[] = [];

    $(".cg-dealFinder-result-wrap").slice(0, maxResults).each((i, el) => {
      const title = $(el).find(".cg-listingHeader").text().trim();

      // Parse price (e.g., "$21,900")
      const priceText = $(el)
        .find(".cg-dealFinder-priceAndMoPayment span")
        .first()
        .text()
        .replace(/[$,]/g, "");
      const price = priceText ? parseInt(priceText, 10) : null;

      // Year, make, model from title if available
      const titleMatch = title.match(/^(\d{4})\s+(\w+)\s+(.+)/);
      const year = titleMatch ? parseInt(titleMatch[1], 10) : null;
      const makeParsed = titleMatch ? titleMatch[2] : make;
      const modelParsed = titleMatch ? titleMatch[3].split(" ")[0] : model;

      // Mileage (e.g., "31,234 mi")
      const mileageText = $(el)
        .find(".cg-listingDetailSpecs li:contains('miles')")
        .text()
        .replace(/[^\d]/g, "");
      const mileage = mileageText ? parseInt(mileageText, 10) : null;

      // Location
      const location =
        $(el).find(".cg-dealFinder-location .cg-text").text().trim() || "Unknown";

      // Detail URL
      let detailUrl = $(el).find("a.cg-listingRow-link").attr("href") || "";
      if (detailUrl && !detailUrl.startsWith("http")) {
        detailUrl = "https://www.cargurus.com" + detailUrl;
      }

      // Image URL
      const imageUrl = $(el).find("img").attr("src") || undefined;

      // Deal rating (e.g., "Great Deal", "Good Deal")
      const rating = $(el).find(".cg-listingDealScore-badge").text().trim();

      results.push({
        title,
        price,
        year,
        make: makeParsed,
        model: modelParsed,
        mileage,
        location,
        detailUrl,
        imageUrl,
        rating,
      });
    });

    return results;
  } catch (error) {
    console.error("[CarGurus Scraper Error]", error);
    throw new Error("Failed to fetch CarGurus listings");
  }
}

// Example usage (for testing):
// (async () => {
//   const cars = await scrapeCarGurusListings({
//     make: "Honda",
//     model: "Accord",
//     zip: "94105",
//     maxResults: 5,
//   });
//   console.log(cars);
// })();


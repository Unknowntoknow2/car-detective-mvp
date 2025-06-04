import axios from "axios";
import * as cheerio from "cheerio";

export interface EdmundsListing {
  title: string;
  price: number | null;
  year: number | null;
  make: string | null;
  model: string | null;
  trim?: string | null;
  mileage: number | null;
  location: string | null;
  dealerName?: string | null;
  detailUrl: string;
  imageUrl?: string;
}

/**
 * Scrape Edmunds for used car listings.
 * @param params { make, model, zip, maxResults, year }
 * @returns Array of EdmundsListing
 */
export async function scrapeEdmundsListings({
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
}): Promise<EdmundsListing[]> {
  // Construct search URL
  let url =
    `https://www.edmunds.com/used-cars-for-sale/listings/${make.toLowerCase()}/${model.toLowerCase()}/?radius=500&zipcode=${zip}`;
  if (year) url += `&year=${year}`;

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
    const results: EdmundsListing[] = [];

    $(".listing").slice(0, maxResults).each((_, el) => {
      const $el = $(el);

      // Title & Trim
      const title = $el.find(".listing-title").text().trim() ||
        $el.find("h2").text().trim();

      // Price (e.g., "$27,995")
      const priceText = $el.find(".listing-price").text().replace(/[$,]/g, "");
      const price = priceText ? parseInt(priceText, 10) : null;

      // Year/Make/Model/Trim
      let year: number | null = null;
      let makeFound: string | null = null;
      let modelFound: string | null = null;
      let trim: string | null = null;
      const yearMatch = title.match(/^(\d{4})/);
      if (yearMatch) year = parseInt(yearMatch[1], 10);
      const split = title.split(" ");
      if (split.length >= 3) {
        makeFound = split[1];
        modelFound = split[2];
        trim = split.slice(3).join(" ") || null;
      }

      // Mileage
      let mileage: number | null = null;
      const mileageText = $el.find(".mileage").text().replace(/[^\d]/g, "");
      if (mileageText) mileage = parseInt(mileageText, 10);

      // Location
      const location = $el.find(".dealer-address").text().trim() || null;

      // Dealer name
      const dealerName = $el.find(".dealer-name").text().trim() || null;

      // Detail URL
      let detailUrl = $el.find("a").attr("href") || "";
      if (detailUrl && !detailUrl.startsWith("http")) {
        detailUrl = "https://www.edmunds.com" + detailUrl;
      }

      // Image URL
      const imageUrl = $el.find("img").attr("src") ||
        $el.find("img").attr("data-src") || undefined;

      results.push({
        title,
        price,
        year,
        make: makeFound || make,
        model: modelFound || model,
        trim,
        mileage,
        location,
        dealerName,
        detailUrl,
        imageUrl,
      });
    });

    return results;
  } catch (err) {
    console.error("[Edmunds Scraper Error]", err);
    throw new Error("Failed to fetch Edmunds listings");
  }
}

// Example usage (dev/test):
// (async () => {
//   const listings = await scrapeEdmundsListings({
//     make: "Toyota",
//     model: "Camry",
//     zip: "90210",
//     maxResults: 5,
//     year: 2019
//   });
//   console.log(listings);
// })();

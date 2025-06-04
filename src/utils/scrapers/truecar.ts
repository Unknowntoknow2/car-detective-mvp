import axios from "axios";
import * as cheerio from "cheerio";

export interface TrueCarListing {
  title: string;
  price: number | null;
  year?: number | null;
  make?: string | null;
  model?: string | null;
  trim?: string | null;
  mileage?: number | null;
  location?: string | null;
  imageUrl?: string;
  detailUrl: string;
  dealerName?: string | null;
}

/**
 * Scrape TrueCar search results for a make/model/year in a specific zip code.
 * @param params Search params (make, model, year, zip, maxResults)
 * @returns Promise<TrueCarListing[]>
 */
export async function scrapeTrueCarListings({
  make,
  model,
  year,
  zip = "94103",
  maxResults = 10,
}: {
  make: string;
  model: string;
  year?: number;
  zip?: string;
  maxResults?: number;
}): Promise<TrueCarListing[]> {
  // Construct the TrueCar search URL for used cars
  const searchUrl = `https://www.truecar.com/used-cars-for-sale/listings/${
    encodeURIComponent(
      make,
    )
  }/${encodeURIComponent(model)}/${
    year ? `${year}/` : ""
  }?searchRadius=500&zip=${zip}`;

  try {
    const { data: html } = await axios.get(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml",
      },
      timeout: 12000,
    });

    const $ = cheerio.load(html);
    const results: TrueCarListing[] = [];

    // Listings: Each car listing card has 'data-test' attribute
    $("[data-test='cardContent']").slice(0, maxResults).each((_, el) => {
      const $el = $(el);

      // Title: usually "2020 Toyota Camry SE"
      const title = $el.find("[data-test='vehicleCardYearMakeModel']").text()
        .trim();

      // Price
      const priceText = $el.find("[data-test='vehicleCardPricingBlockPrice']")
        .text().replace(/[$,]/g, "");
      const price = priceText ? parseInt(priceText, 10) : null;

      // Mileage
      const mileageText = $el.find("[data-test='vehicleMileage']").text()
        .replace(/[^\d]/g, "");
      const mileage = mileageText ? parseInt(mileageText, 10) : null;

      // Location (city, state)
      const location =
        $el.find("[data-test='vehicleCardLocation']").text().trim() || null;

      // Image URL
      const imageUrl = $el.find("img").attr("src") || undefined;

      // Detail page URL
      let detailUrl = $el.find("a").attr("href") || "";
      if (detailUrl && !detailUrl.startsWith("http")) {
        detailUrl = "https://www.truecar.com" + detailUrl;
      }

      // Parse year/make/model/trim from title
      let parsedYear: number | null = null,
        parsedMake: string | null = null,
        parsedModel: string | null = null,
        trim: string | null = null;

      const titleParts = title.split(" ");
      if (titleParts.length >= 3 && /^\d{4}$/.test(titleParts[0])) {
        parsedYear = parseInt(titleParts[0], 10);
        parsedMake = titleParts[1];
        parsedModel = titleParts[2];
        trim = titleParts.slice(3).join(" ") || null;
      }

      // Dealer name (optional)
      const dealerName = $el.find("[data-test='dealerName']").text().trim() ||
        null;

      results.push({
        title,
        price,
        year: parsedYear,
        make: parsedMake,
        model: parsedModel,
        trim,
        mileage,
        location,
        imageUrl,
        detailUrl,
        dealerName,
      });
    });

    return results;
  } catch (err) {
    console.error("[TrueCar Scraper Error]", err);
    throw new Error("Failed to fetch TrueCar listings");
  }
}

// Example usage/dev test
// (async () => {
//   const listings = await scrapeTrueCarListings({
//     make: "toyota",
//     model: "camry",
//     year: 2020,
//     zip: "90001",
//     maxResults: 5,
//   });
//   console.log(listings);
// })();

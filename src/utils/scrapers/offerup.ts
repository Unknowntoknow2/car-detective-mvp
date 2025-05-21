import axios from "axios";
import * as cheerio from "cheerio";

export interface OfferUpListing {
  title: string;
  price: number | null;
  year?: number | null;
  make?: string | null;
  model?: string | null;
  location: string | null;
  imageUrl?: string;
  detailUrl: string;
  postedAt?: string;
}

/**
 * Scrape OfferUp car search results by keywords or VIN.
 * Note: OfferUp heavily obfuscates and paginates data. This gets public/SEO-optimized listings only.
 */
export async function scrapeOfferUpListings({
  search,
  maxResults = 10,
}: {
  search: string; // e.g., "toyota camry" or VIN
  maxResults?: number;
}): Promise<OfferUpListing[]> {
  // Use SEO listing: https://offerup.com/search/?q=toyota+camry
  const url = `https://offerup.com/search/?q=${encodeURIComponent(search)}`;

  try {
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml",
      },
      timeout: 12000,
    });

    const $ = cheerio.load(html);
    const results: OfferUpListing[] = [];

    $(".TGVbTQ").slice(0, maxResults).each((_, el) => {
      // Container class `.TGVbTQ` (subject to change, inspect HTML if it breaks)
      const $el = $(el);

      // Title
      const title = $el.find("h2").text().trim();

      // Price
      const priceText = $el.find(".TyPE7A").text().replace(/[$,]/g, "");
      const price = priceText ? parseInt(priceText, 10) : null;

      // Location
      const location = $el.find(".WhlbhA").text().trim() || null;

      // Image URL
      const imageUrl =
        $el.find("img").attr("src") || $el.find("img").attr("data-src") || undefined;

      // Detail page URL
      let detailUrl = $el.find("a").attr("href") || "";
      if (detailUrl && !detailUrl.startsWith("http")) {
        detailUrl = "https://offerup.com" + detailUrl;
      }

      // Parse year, make, model (if in title, e.g., "2017 Toyota Camry")
      let year: number | null = null,
        make: string | null = null,
        model: string | null = null;
      const parts = title.split(" ");
      if (parts.length >= 3 && /^\d{4}$/.test(parts[0])) {
        year = parseInt(parts[0], 10);
        make = parts[1];
        model = parts.slice(2, 4).join(" ");
      }

      results.push({
        title,
        price,
        year,
        make,
        model,
        location,
        imageUrl,
        detailUrl,
      });
    });

    return results;
  } catch (err) {
    console.error("[OfferUp Scraper Error]", err);
    throw new Error("Failed to fetch OfferUp listings");
  }
}

// Example usage/dev test:
// (async () => {
//   const listings = await scrapeOfferUpListings({ search: "honda accord", maxResults: 5 });
//   console.log(listings);
// })();

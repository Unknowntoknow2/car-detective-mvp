// src/utils/scrapers/scrapeCraigslist.ts

import axios from "axios";
import * as cheerio from "cheerio";
import { scrapeListingsFromHtml } from "./craigslistHelpers"; // ✅ make sure filename matches exactly

export async function scrapeCraigslist(query: string, zip: string) {
  const url = `https://sacramento.craigslist.org/search/cta?query=${
    encodeURIComponent(query)
  }&postal=${zip}&search_distance=100`;
  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);

  const listings = scrapeListingsFromHtml($);
  return listings;
}

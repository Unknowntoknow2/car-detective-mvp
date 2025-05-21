// src/utils/scrapers/craigslistHelpers.ts

import * as cheerio from 'cheerio';

export interface CraigslistListing {
  title: string;
  price: string;
  url: string | undefined;
}

export function scrapeListingsFromHtml($: cheerio.Root): CraigslistListing[] {
  const listings = $('.result-row').map((_: unknown, element: cheerio.Element) => {
    const title = $(element).find('.result-title').text().trim();
    const price = $(element).find('.result-price').first().text().trim();
    const url = $(element).find('a').attr('href');

    return {
      title,
      price,
      url,
    };
  }).get();

  return listings;
}

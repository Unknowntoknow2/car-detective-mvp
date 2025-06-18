
// Temporarily disabled for MVP - missing cheerio dependency
export interface CraigslistListing {
  title: string;
  price: string;
  url: string | undefined;
}

export function scrapeListingsFromHtml(): CraigslistListing[] {
  // Disabled for MVP - missing cheerio dependency
  console.log('Craigslist helpers disabled for MVP');
  return [];
}

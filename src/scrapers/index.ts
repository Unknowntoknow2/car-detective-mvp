
// Scrapers module exports
// Note: Individual scraper modules have been removed during cleanup

export interface ScraperResult {
  price: number;
  url: string;
  source: string;
  title: string;
  mileage?: number;
  year?: number;
  location?: string;
}

export const availableScrapers = [];

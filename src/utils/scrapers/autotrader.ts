
import axios from 'axios';
import * as cheerio from 'cheerio';
import { RawListing } from '../normalization/normalizeListing';

export async function fetchAutoTraderListings(
  make: string,
  model: string,
  zip = '95814',
  maxResults = 10
): Promise<RawListing[]> {
  const listings: RawListing[] = [];
  const searchUrl = `https://www.autotrader.com/cars-for-sale/${make}/${model}?zip=${zip}&searchRadius=100&isNewSearch=true&sortBy=relevance&numRecords=25`;

  try {
    const { data: html } = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
    });

    const $ = cheerio.load(html);
    $('.inventory-listing').each((_, el) => {
      if (listings.length >= maxResults) return;

      const title = $(el).find('.listing-title').text().trim();
      const priceText = $(el).find('.first-price').text().trim();
      const price = Number(priceText.replace(/[^\d]/g, ''));
      const mileageText = $(el).find('.item-card-specifications').text().trim();
      // Extract mileage from specifications text which contains multiple specs
      const mileageMatch = mileageText.match(/(\d+,?\d*)\s*miles/i);
      const mileage = mileageMatch ? Number(mileageMatch[1].replace(/,/g, '')) : 0;
      
      const image = $(el).find('img.primary-img').attr('src');
      const link = $(el).find('a.inventory-card-link').attr('href');
      
      // Extract year from title
      const yearMatch = title.match(/\b(19|20)\d{2}\b/);
      const year = yearMatch ? parseInt(yearMatch[0]) : 0;
      
      if (isNaN(price) || price === 0) return; // Skip listings without price

      listings.push({
        title,
        price,
        mileage,
        image,
        url: link ? `https://www.autotrader.com${link}` : '',
        source: 'autotrader',
        location: zip,
        postedDate: new Date().toISOString(),
        year,
        make,
        model,
      });
    });

    return listings;
  } catch (err: any) {
    console.error('❌ AutoTrader fetch failed:', err.message);
    return [];
  }
}

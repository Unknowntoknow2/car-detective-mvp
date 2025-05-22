
import axios from 'axios';
import * as cheerio from 'cheerio';
import { RawListing } from '../normalization/normalizeListing';

export async function fetchCarsDotComListings(
  make: string,
  model: string,
  zip = '95814',
  maxResults = 10
): Promise<RawListing[]> {
  const listings: RawListing[] = [];
  const searchUrl = `https://www.cars.com/shopping/results/?stock_type=used&makes[]=${make.toLowerCase()}&models[]=${model.toLowerCase()}&list_price_max=&maximum_distance=100&zip=${zip}`;

  try {
    const { data: html } = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    const $ = cheerio.load(html);
    $('div.vehicle-card').each((_, el) => {
      if (listings.length >= maxResults) return;

      const title = $(el).find('h2.title').text().trim();
      const priceText = $(el).find('.primary-price').text().trim();
      const price = Number(priceText.replace(/[^\d]/g, ''));
      const mileageText = $(el).find('.mileage').text().trim();
      const mileage = Number(mileageText.replace(/[^\d]/g, ''));
      const image = $(el).find('img').attr('src');
      const link = $(el).find('a.vehicle-card-link').attr('href');
      
      // Extract year, make, model from title
      const titleParts = title.split(' ');
      let year = 0;
      if (titleParts.length > 0 && !isNaN(Number(titleParts[0]))) {
        year = Number(titleParts[0]);
      }
      
      if (isNaN(price) || price === 0) return; // Skip listings without price

      listings.push({
        title,
        price,
        mileage,
        image,
        url: link ? `https://www.cars.com${link}` : '',
        source: 'cars.com',
        location: zip,
        postedDate: new Date().toISOString(),
        year,
        make,
        model,
      });
    });

    return listings;
  } catch (err: any) {
    console.error('❌ Cars.com fetch failed:', err.message);
    return [];
  }
}

import axios from 'axios';
import * as cheerio from 'cheerio';

export async function fetchCarsDotComListings(
  make: string,
  model: string,
  zip = '95814',
  maxResults = 10
) {
  const listings: any[] = [];
  const searchUrl = `https://www.cars.com/shopping/results/?stock_type=used&makes[]=${make.toLowerCase()}&models[]=${model.toLowerCase()}&list_price_max=&maximum_distance=100&zip=${zip}`;

  try {
    const { data: html } = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    const $ = cheerio.load(html);
    const cards = $('div.vehicle-card');

    cards.each((_: unknown, el: cheerio.Element) => {
      if (listings.length >= maxResults) return;

      const title = $(el).find('h2.title').text().trim();
      const price = $(el).find('.primary-price').text().replace(/[^\d]/g, '');
      const mileage = $(el).find('.mileage').text().replace(/[^\d]/g, '');
      const image = $(el).find('img').attr('src');
      const link = 'https://www.cars.com' + $(el).find('a.vehicle-card-link').attr('href');

      listings.push({
        title,
        price: Number(price),
        mileage: Number(mileage),
        image,
        url: link,
        source: 'cars.com',
        location: zip,
        postedDate: new Date().toISOString(),
      });
    });

    return listings;
  } catch (err: any) {
    console.error('❌ Cars.com fetch failed:', err.message);
    return [];
  }
}

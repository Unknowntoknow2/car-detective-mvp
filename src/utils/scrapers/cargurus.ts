
import axios from 'axios';
import * as cheerio from 'cheerio';
import { RawListing } from '../normalization/normalizeListing';

export async function fetchCarGurusListings(
  make: string,
  model: string,
  zip = '95814',
  maxResults = 10
): Promise<RawListing[]> {
  const listings: RawListing[] = [];
  // CarGurus requires a more specific URL format with model ID
  const searchUrl = `https://www.cargurus.com/Cars/searchResults.action?zip=${zip}&showNegotiable=true&sortDir=ASC&sourceContext=untrackedExternal&distance=100&sortType=DEAL_SCORE&entitySelectingHelper.selectedEntity=${make}+${model}`;

  try {
    const { data: html } = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    const $ = cheerio.load(html);
    $('.ft7e1475z').each((_, el) => {
      if (listings.length >= maxResults) return;

      // CarGurus uses complex class names that might change, so we use position and structure
      const titleElement = $(el).find('h2').first();
      const title = titleElement.text().trim();
      
      const priceElement = $(el).find('span.vqleRbXP').first();
      const priceText = priceElement.text().trim();
      const price = Number(priceText.replace(/[^\d]/g, ''));
      
      const mileageElement = $(el).find('p.t17kvc0m').first();
      const mileageText = mileageElement.text().trim();
      const mileage = Number(mileageText.replace(/[^\d]/g, ''));
      
      const imageElement = $(el).find('img').first();
      const image = imageElement.attr('src');
      
      const linkElement = $(el).find('a').first();
      const link = linkElement.attr('href');

      // Extract year from title (usually first 4 digits)
      const yearMatch = title.match(/\b(19|20)\d{2}\b/);
      const year = yearMatch ? parseInt(yearMatch[0]) : 0;
      
      if (isNaN(price) || price === 0) return; // Skip listings without price

      listings.push({
        title,
        price,
        mileage,
        image,
        url: link ? `https://www.cargurus.com${link}` : '',
        source: 'cargurus',
        location: zip,
        postedDate: new Date().toISOString(),
        year,
        make,
        model,
      });
    });

    return listings;
  } catch (err: any) {
    console.error('❌ CarGurus fetch failed:', err.message);
    return [];
  }
}

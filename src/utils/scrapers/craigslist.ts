// ✅ File: src/utils/scrapers/craigslist.ts

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { load } from 'cheerio';

puppeteer.use(StealthPlugin());

export async function fetchCraigslistListings(
  make: string,
  model: string,
  zip = '95814',
  maxResults = 10
) {
  const listings: any[] = [];
  const searchQuery = `${make}+${model}`;
  const url = `https://sacramento.craigslist.org/search/cta?auto_make_model=${searchQuery}&postal=${zip}&search_distance=100`;

  const browser = await puppeteer.launch({
  headless: false, // 👈 so we can visually debug
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
  console.log(`🌐 Navigating to: ${url}`);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

  await new Promise((res) => setTimeout(res, 3000));
  const html = await page.content();
  const $ = load(html);

  $('li.result-row').each((_, el) => {
    if (listings.length >= maxResults) return;

    const title = $(el).find('.result-title').text().trim();
    const priceText = $(el).find('.result-price').first().text().replace(/[^\d]/g, '');
    const url = $(el).find('.result-title').attr('href') || '';
    const image = $(el).find('img').attr('src') || '';
    const postedDate = $(el).find('time.result-date').attr('datetime') || new Date().toISOString();

    const price = Number(priceText);

    if (title && price && url) {
      listings.push({
        source: 'craigslist',
        title,
        price,
        image,
        url,
        location: zip,
        postedDate,
      });
    }
  });

  await browser.close();
  return listings;
}

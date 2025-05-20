// src/utils/scrapers/facebook.ts

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

export async function fetchFacebookMarketplaceListings(
  make: string,
  model: string,
  zip = '95814',
  maxResults = 5
) {
  const listings: any[] = [];

  const browser = await puppeteer.launch({
  headless: true, // ✅ Fixed type error
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

  const page = await browser.newPage();

  // Emulate iPhone browser
  await page.setUserAgent(
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15A372 Safari/604.1'
  );
  await page.setViewport({ width: 375, height: 812, isMobile: true });

  const query = encodeURIComponent(`${make} ${model}`);
  const url = `https://www.facebook.com/marketplace/${zip}/search?query=${query}`;
  console.log('🌐 Navigating to:', url);

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    await page.waitForSelector('[role="article"]', { timeout: 20000 });

    const results = await page.evaluate((max) => {
      const items: any[] = [];
      const cards = document.querySelectorAll('[role="article"]');
      for (let i = 0; i < cards.length && items.length < max; i++) {
        const el = cards[i];
        const title = el.querySelector('span')?.textContent || '';
        const price = el.querySelector('span[dir="auto"]')?.textContent?.replace(/[^\d]/g, '') || '';
        const image = el.querySelector('img')?.getAttribute('src') || '';
        const link = el.querySelector('a')?.getAttribute('href') || '';

        items.push({
          title,
          price: Number(price),
          image,
          url: link ? `https://www.facebook.com${link}` : '',
          source: 'facebook',
          location: 'Marketplace',
          postedDate: new Date().toISOString(),
        });
      }
      return items;
    }, maxResults);

    listings.push(...results);
  } catch (error: any) {
    console.error('❌ Facebook Marketplace scrape failed:', error.message);
  }

  await browser.close();
  return listings;
}


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

  try {
    // In browser environments or if Puppeteer fails, return mock data
    if (typeof window !== 'undefined') {
      throw new Error('Puppeteer not available in browser environment');
    }

    console.log('Attempting to launch browser with Puppeteer...');
    
    // Use a conditional import or mock when browser is not available
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      // Use installed Chromium in container if available
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      ignoreDefaultArgs: ['--disable-extensions'],
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
  } catch (error) {
    console.error('❌ Failed to initialize Puppeteer:', error);
    console.log('Using mock Facebook Marketplace data instead');
    
    // Return mock data with the make/model included
    listings.push(
      {
        title: `${make} ${model} (Mock Data)`,
        price: 15000 + Math.floor(Math.random() * 10000),
        image: 'https://via.placeholder.com/200',
        url: 'https://facebook.com/marketplace',
        source: 'facebook',
        location: 'Marketplace (Mock)',
        postedDate: new Date().toISOString(),
      },
      {
        title: `${make} ${model} Premium (Mock Data)`,
        price: 18000 + Math.floor(Math.random() * 12000),
        image: 'https://via.placeholder.com/200',
        url: 'https://facebook.com/marketplace',
        source: 'facebook',
        location: 'Marketplace (Mock)',
        postedDate: new Date().toISOString(),
      }
    );
  }

  return listings;
}

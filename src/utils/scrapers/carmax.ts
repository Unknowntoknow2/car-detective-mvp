// src/utils/scrapers/carmax.ts

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { normalizeListing } from '@/utils/normalization/normalizeListing';

puppeteer.use(StealthPlugin());

export interface CarMaxListing {
  title: string;
  price: number;
  mileage: number;
  vin: string;
  year: number;
  image?: string;
  url: string;
  location?: string;
  postedDate?: string;
}

export async function fetchCarMaxListings(
  make: string,
  model: string,
  zipCode: string = '95814',
  maxResults: number = 10
): Promise<CarMaxListing[]> {
  const query = [make, model].filter(Boolean).join('-').toLowerCase();
  const url = `https://www.carmax.com/cars/${query}?search=All&zip=${zipCode}`;

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  try {
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114.0 Safari/537.36'
    );

    console.log('🌐 Navigating to:', url);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    console.log('⏳ Waiting for JS-rendered content...');
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Replaces waitForTimeout

    await page.waitForSelector('[data-qa="search-result-row"]', {
      visible: true,
      timeout: 30000,
    });

    const listings = await page.$$eval('[data-qa="search-result-row"]', (cards) => {
      return cards.slice(0, 10).map((card) => {
        const title = (card.querySelector('[data-qa="vehicle-title"]') as HTMLElement)?.innerText || '';
        const priceText = (card.querySelector('[data-qa="vehicle-price"]') as HTMLElement)?.innerText || '';
        const mileageText = (card.querySelector('[data-qa="vehicle-mileage"]') as HTMLElement)?.innerText || '';
        const vin = (card.querySelector('[data-qa="vehicle-stock"]') as HTMLElement)?.innerText || '';
        const year = parseInt(title.split(' ')[0]) || new Date().getFullYear();
        const image = (card.querySelector('img') as HTMLImageElement)?.src || '';
        const linkEl = card.querySelector('a[href*="/cars/"]') as HTMLAnchorElement;
        const url = linkEl ? 'https://www.carmax.com' + linkEl.getAttribute('href') : '';

        return {
          source: 'carmax',
          title,
          price: parseInt(priceText.replace(/\D/g, '')) || 0,
          mileage: parseInt(mileageText.replace(/\D/g, '')) || 0,
          vin: vin.replace('Stock #: ', '').trim(),
          year,
          image,
          url,
          location: 'Online',
          postedDate: new Date().toISOString(),
        };
      });
    });

    await browser.close();
    return listings.map((l) => normalizeListing(l)).slice(0, maxResults);
  } catch (error) {
    console.error('❌ CarMax Puppeteer scrape error:', error);
    const html = await page.content();
    console.error('🔍 Page HTML (first 1000 chars):\n', html.slice(0, 1000));
    await browser.close();
    return [];
  }
}

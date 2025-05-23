
import axios from 'axios';
import * as cheerio from 'cheerio';
import { normalizeVehicleData } from '@/utils/scrapers/utils/normalizeVehicleData';
import { SupabaseClient } from '@supabase/supabase-js';
import { Listing } from '@/types/listing';

interface CraigslistScraperOptions {
  zipCode: string;
  radiusMiles?: number;
  maxListings?: number;
}

export async function scrapeCraigslist(
  supabase: SupabaseClient,
  options: CraigslistScraperOptions
): Promise<Listing[]> {
  const { zipCode, radiusMiles = 50, maxListings = 30 } = options;

  const baseUrl = `https://sacramento.craigslist.org/search/cta`;
  const searchParams = new URLSearchParams({
    postal: zipCode,
    search_distance: radiusMiles.toString(),
    hasPic: '1',
    availabilityMode: '0',
  });

  const url = `${baseUrl}?${searchParams.toString()}`;
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  const listings: Listing[] = [];

  $('li.result-row').each((_, el) => {
    const title = $(el).find('.result-title').text().trim();
    const link = $(el).find('.result-title').attr('href') || '';
    const priceText = $(el).find('.result-price').first().text().replace('$', '');
    const price = parseInt(priceText, 10) || 0;
    const imageData = $(el).find('a.result-image').attr('data-ids');
    const images = imageData
      ? imageData.split(',').map((id: string) => {
          const parts = id.split(':');
          return parts[1] ? `https://images.craigslist.org/${parts[1]}_300x300.jpg` : '';
        })
      : [];

    const listing: Listing = normalizeVehicleData({
      title,
      url: link,
      price,
      images,
      source: 'Craigslist',
      zipCode,
    });

    listings.push(listing);
    if (listings.length >= maxListings) return false;
  });

  // Optional: store into Supabase if needed
  if (listings.length) {
    await supabase.from('marketplace_listings').upsert(listings, { onConflict: 'id' });
  }

  return listings;
}


// ARCHIVED - DO NOT USE  
// Original file: src/utils/scrapers/cargurus.ts

// import axios from 'axios';
// import * as cheerio from 'cheerio';
import { NormalizedListing } from '../utils/normalization/normalizeListings';

export async function fetchCarGurusListings(
  make: string,
  model: string,
  zip = '95814',
  maxResults = 10
): Promise<NormalizedListing[]> {
  // Archived implementation - cheerio removed to avoid build errors
  console.warn('CarGurus scraper is archived and disabled');
  return [];
}

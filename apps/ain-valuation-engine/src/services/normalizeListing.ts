
import type { MarketListing } from '../types/marketListing';
import currency from 'currency.js';

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
export function makeIdFromUrl(url: string) {
  let h = 0;
  for (let i = 0; i < url.length; i++) h = ((h << 5) - h + url.charCodeAt(i)) | 0;
  return `ml_${Math.abs(h)}`;
}

export function normalizeCurrency(price: number, currencyCode: string): number {
  // TODO: integrate real FX API (e.g., ECB, Yahoo Finance, OpenExchangeRates)
  const fxRates: Record<string, number> = {
    "USD": 1,
    "CAD": 0.74,
    "EUR": 1.09,
    "AUD": 0.66,
    "INR": 0.012,
    "SGD": 0.74,
    "MAD": 0.10
  };
  return currency(price).multiply(fxRates[currencyCode] ?? 1).value;
}

export function normalizeListing(raw: any): MarketListing {
  // Accepts heterogeneous shapes from different sources and maps to canonical.
  const url: string = raw.url ?? raw.link ?? raw.permalink ?? '';
  const price: number = Number(raw.price ?? raw.listPrice ?? raw.amount ?? 0);
  const mileage: number | undefined = raw.mileage != null ? Number(raw.mileage) : undefined;
  const year: number = Number(raw.year ?? raw.vehicle?.year ?? 0);
  const make: string = String(raw.make ?? raw.vehicle?.make ?? '').trim();
  const model: string = String(raw.model ?? raw.vehicle?.model ?? '').trim();
  const trim: string | undefined = raw.trim ?? raw.vehicle?.trim ?? undefined;

  const source: MarketListing['source'] =
    raw.source && ['Cars.com','CarGurus','Carvana','Edmunds','Craigslist','eBay Motors','EchoPark'].includes(raw.source)
      ? raw.source
      : 'Other';

  const dealer: string | undefined = raw.dealer ?? raw.seller ?? raw.dealership ?? undefined;
  const location: string | undefined = raw.location ?? raw.city_state ?? undefined;
  const zip: string | undefined = raw.zip ?? raw.postal ?? undefined;

  const fetchedAt: string | undefined = raw.fetchedAt ?? raw.fetched_at ?? raw.scraped_at ?? new Date().toISOString();
  const listedAt: string | undefined = raw.listedAt ?? raw.listed_at ?? undefined;

  let trust = Number(raw.trust_score ?? raw.confidence ?? 0.5);
  if (Number.isNaN(trust)) trust = 0.5;
  trust = clamp(trust, 0, 1);

  return {
  id: makeIdFromUrl(url || `${source}-${year}-${make}-${model}-${price}-${mileage ?? ''}`),
    vin: raw.vin ?? raw.vehicle?.vin,
    year, make, model, trim,
    price, mileage,
    dealer, source, url,
    location, zip, fetchedAt, listedAt,
    trust_score: trust,
  };
}

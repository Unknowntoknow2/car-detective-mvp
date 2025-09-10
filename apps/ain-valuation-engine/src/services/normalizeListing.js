import currency from 'currency.js';
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export function makeIdFromUrl(url) {
    let h = 0;
    for (let i = 0; i < url.length; i++)
        h = ((h << 5) - h + url.charCodeAt(i)) | 0;
    return `ml_${Math.abs(h)}`;
}
export function normalizeCurrency(price, currencyCode) {
    // TODO: integrate real FX API (e.g., ECB, Yahoo Finance, OpenExchangeRates)
    const fxRates = {
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
export function normalizeListing(raw) {
    // Accepts heterogeneous shapes from different sources and maps to canonical.
    const url = raw.url ?? raw.link ?? raw.permalink ?? '';
    const price = Number(raw.price ?? raw.listPrice ?? raw.amount ?? 0);
    const mileage = raw.mileage != null ? Number(raw.mileage) : undefined;
    const year = Number(raw.year ?? raw.vehicle?.year ?? 0);
    const make = String(raw.make ?? raw.vehicle?.make ?? '').trim();
    const model = String(raw.model ?? raw.vehicle?.model ?? '').trim();
    const trim = raw.trim ?? raw.vehicle?.trim ?? undefined;
    const source = raw.source && ['Cars.com', 'CarGurus', 'Carvana', 'Edmunds', 'Craigslist', 'eBay Motors', 'EchoPark'].includes(raw.source)
        ? raw.source
        : 'Other';
    const dealer = raw.dealer ?? raw.seller ?? raw.dealership ?? undefined;
    const location = raw.location ?? raw.city_state ?? undefined;
    const zip = raw.zip ?? raw.postal ?? undefined;
    const fetchedAt = raw.fetchedAt ?? raw.fetched_at ?? raw.scraped_at ?? new Date().toISOString();
    const listedAt = raw.listedAt ?? raw.listed_at ?? undefined;
    let trust = Number(raw.trust_score ?? raw.confidence ?? 0.5);
    if (Number.isNaN(trust))
        trust = 0.5;
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

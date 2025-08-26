import { fetchMarketListings } from './marketSearchAgent';
export async function multiTierSearch(input) {
    const { listings } = await fetchMarketListings(input);
    return listings;
}
// Back-compat exports for any older callers:
export { fetchMarketListings };

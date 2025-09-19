// src/services/fuelEconomyService.ts
import { ExternalApiService } from './centralizedApi';
import { ConfigService } from './centralizedApi';
import logger from '../utils/logger';
import { apiCallsTotal } from '../utils/metrics';

export interface FuelEconomyData {
  fuelType: string;
  cityMpg: number | null;
  highwayMpg: number | null;
  combinedMpg: number | null;
  fuelCostPerYearUSD?: number;
}

export interface FuelEconomyApiResponse {
  menuItem?: Array<{ value: string; text: string }>;
}

export interface VehicleDetailsResponse {
  fuelType: string;
  city08: string;
  highway08: string;
  comb08: string;
}

/**
 * Retrieves fuel economy data for a specific vehicle by year, make, and model.
 * 
 * This function integrates with the FuelEconomy.gov API to fetch official
 * EPA fuel economy ratings and vehicle specifications. It handles the
 * multi-step API process of searching for vehicles and retrieving detailed data.
 * 
 * @param {number} year - The model year of the vehicle (e.g., 2020)
 * @param {string} make - The vehicle manufacturer (e.g., 'Toyota')
 * @param {string} model - The vehicle model name (e.g., 'Camry')
 * @returns {Promise<FuelEconomyData | null>} Fuel economy data or null if not found
 * 
 * @throws {Error} When API calls fail or data parsing encounters errors
 * 
 * @example
 * ```typescript
 * const fuelData = await fetchFuelEconomyByYearMakeModel(2020, 'Toyota', 'Camry');
 * if (fuelData) {
 *   console.log(`Combined MPG: ${fuelData.combinedMpg}`);
 *   console.log(`Fuel Type: ${fuelData.fuelType}`);
 * }
 * ```
 * 
 * @apiFlow
 * 1. Search for vehicles matching year/make/model
 * 2. Extract vehicle ID from search results
 * 3. Fetch detailed vehicle specifications by ID
 * 4. Parse and return fuel economy data
 * 
 * @metrics Tracks external API calls to FuelEconomy.gov service
 */
export async function fetchFuelEconomyByYearMakeModel(
  year: number,
  make: string,
  model: string
): Promise<FuelEconomyData | null> {
  try {
    const response = await ExternalApiService.getFuelEconomyData(year, make, model);
    
    if (!response.ok || !response.data) {
      return null;
    }

    const data = response.data as FuelEconomyApiResponse;
    const options = data.menuItem || [];
    const id = options[0]?.value;
    if (!id) return null;

    const vehicleResponse = await ExternalApiService.makeExternalCall<VehicleDetailsResponse>(
      `https://www.fueleconomy.gov/ws/rest/vehicle/${id}`,
      { headers: { Accept: 'application/json' } }
    );

  if (!vehicleResponse.ok) return null;

    const v = vehicleResponse.data;
    if (!v) return null;
    
    return {
      fuelType: v.fuelType || 'Unknown',
      cityMpg: v.city08 ? parseFloat(v.city08) : null,
      highwayMpg: v.highway08 ? parseFloat(v.highway08) : null,
      combinedMpg: v.comb08 ? parseFloat(v.comb08) : null,
    };
  } catch (error) {
    logger.error('Fuel economy API error:', error);
    return null;
  }
}

/**
 * Response structure from the EIA (Energy Information Administration) API
 * containing time series data for fuel prices.
 */
export interface EIAApiResponse {
  /** Array of data series containing fuel price information */
  series: Array<{
    /** Array of [date, value] pairs representing price data over time */
    data: Array<[string, string]>; // [date, value] pairs
  }>;
}

/**
 * Fetches the current average fuel cost in USD from the EIA API.
 * 
 * This function retrieves the latest gasoline price data from the U.S. Energy
 * Information Administration API, which provides official government data on
 * energy prices and consumption.
 * 
 * @returns {Promise<number | null>} Current average fuel price in USD per gallon, or null if unavailable
 * 
 * @throws {Error} When EIA API calls fail or response parsing encounters errors
 * 
 * @example
 * ```typescript
 * const currentPrice = await fetchAvgFuelCostUSD();
 * if (currentPrice) {
 *   console.log(`Current gas price: $${currentPrice.toFixed(2)} per gallon`);
 * } else {
 *   console.log('Unable to fetch current gas prices');
 * }
 * ```
 * 
 * @apiDependency Requires valid EIA API key in environment configuration
 * @metrics Tracks API call success/failure rates for monitoring
 * @dataSource U.S. Energy Information Administration (EIA)
 */
export async function fetchAvgFuelCostUSD(): Promise<number | null> {
  try {
    const apiKeys = ConfigService.getApiKeys();
    const response = await ExternalApiService.getGasPrices(apiKeys.eia);
    
    apiCallsTotal.inc({ service: 'eia', status: response.ok ? 'success' : 'error' });
    
    if (!response.ok || !response.data) {
      return null;
    }

    const data = response.data as EIAApiResponse;
    const last = data.series[0].data[0];
    return parseFloat(last[1]);
  } catch (err) {
    apiCallsTotal.inc({ service: 'eia', status: 'error' });
    logger.error('EIA API error:', err);
    return null;
  }
}

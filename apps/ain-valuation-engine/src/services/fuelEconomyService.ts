// src/services/fuelEconomyService.ts
import axios from 'axios'

const FUEL_ECONOMY_BASE = 'https://www.fueleconomy.gov/ws/rest';
const EIA_BASE = 'https://api.eia.gov/series/';

const EIA_API_KEY = process.env.EIA_API_KEY;

export interface FuelEconomyData {
  fuelType: string;
  cityMpg: number | null;
  highwayMpg: number | null;
  combinedMpg: number | null;
  fuelCostPerYearUSD?: number;
}

export async function fetchFuelEconomyByYearMakeModel(
  year: number,
  make: string,
  model: string
): Promise<FuelEconomyData | null> {
  try {
    const { data } = await axios.get(`${FUEL_ECONOMY_BASE}/vehicle/menu/options`, {
      params: { year, make, model },
      headers: { Accept: 'application/json' }
    });

    const options = data.menuItem || [];
    const id = options[0]?.value;
    if (!id) return null;

    const vehicleDetails = await axios.get(`${FUEL_ECONOMY_BASE}/vehicle/${id}`, {
      headers: { Accept: 'application/json' }
    });

    const v = vehicleDetails.data;
    return {
      fuelType: v.fuelType || 'Unknown',
      cityMpg: v.city08 ? parseFloat(v.city08) : null,
      highwayMpg: v.highway08 ? parseFloat(v.highway08) : null,
      combinedMpg: v.comb08 ? parseFloat(v.comb08) : null
    };
  } catch (error) {
    console.error('FuelEconomy.gov API error:', error);
    return null;
  }
}

export async function fetchAvgFuelCostUSD(): Promise<number | null> {
  try {
    const res = await axios.get(EIA_BASE, {
      params: {
        api_key: EIA_API_KEY,
        series_id: 'PET.EMM_EPM0_PTE_NUS_DPG.W' // U.S. Regular Gasoline Weekly Retail Price
      }
    });
    const last = res.data.series[0].data[0];
    return parseFloat(last[1]);
  } catch (err) {
    console.error('EIA API error:', err);
    return null;
  }
}

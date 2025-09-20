export type FuelEconomyData = { city: number; highway: number; combined: number };
export type FuelEconomyApiResponse = { data: FuelEconomyData };
export type VehicleDetailsResponse = { make: string; model: string; year: number };

export async function getFuelEconomy(): Promise<FuelEconomyApiResponse> {
  return { data: { city: 20, highway: 30, combined: 24 } };
}

export async function fetchFuelEconomyByYearMakeModel(year: number, make: string, model: string): Promise<FuelEconomyData | null> {
  try {
    // Mock implementation - replace with real API call
    return {
      city: 20 + Math.floor(Math.random() * 10),
      highway: 25 + Math.floor(Math.random() * 15),
      combined: 22 + Math.floor(Math.random() * 12)
    };
  } catch (error) {
    console.error('Failed to fetch fuel economy:', error);
    return null;
  }
}

export async function fetchAvgFuelCostUSD(combinedMpg: number): Promise<number> {
  // Mock implementation - replace with real API call
  const avgGasPrice = 3.50; // USD per gallon
  const avgMilesPerYear = 12000;
  return (avgMilesPerYear / combinedMpg) * avgGasPrice;
}

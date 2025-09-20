export const FuelEconomyData = {};
export const FuelEconomyApiResponse = {};
export const VehicleDetailsResponse = {};
export const EIAApiResponse = {};
export async function fetchFuelEconomyByYearMakeModel(year, make, model) {
  return {
    year,
    make,
    model,
    fuelType: 'Gasoline',
    cityMpg: 22,
    highwayMpg: 31,
    combinedMpg: 25,
    source: 'stub'
  };
}

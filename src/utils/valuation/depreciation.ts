export function calculateDepreciation(year: number, make: string, model: string): number {
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - year;
  
  if (vehicleAge <= 0) return 0;
  
  // Standard depreciation rates
  const yearOneDepreciation = 0.20; // 20% first year
  const subsequentYearDepreciation = 0.15; // 15% per year after
  
  let totalDepreciation = 0;
  
  if (vehicleAge >= 1) {
    totalDepreciation += yearOneDepreciation;
  }
  
  if (vehicleAge > 1) {
    totalDepreciation += (vehicleAge - 1) * subsequentYearDepreciation;
  }
  
  // Cap depreciation at 80%
  return Math.min(totalDepreciation, 0.80);
}
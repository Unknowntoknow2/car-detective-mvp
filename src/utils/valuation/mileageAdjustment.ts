export function calculateMileageAdjustment(mileage: number, year: number): number {
  const currentYear = new Date().getFullYear();
  const vehicleAge = Math.max(1, currentYear - year);
  const averageMilesPerYear = 12000;
  const expectedMileage = vehicleAge * averageMilesPerYear;
  
  const mileageDifference = mileage - expectedMileage;
  
  // $0.10 per mile difference
  const adjustmentPerMile = 0.10;
  
  return -(mileageDifference * adjustmentPerMile);
}
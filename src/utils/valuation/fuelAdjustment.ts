export function calculateFuelAdjustment(fuelType: string, zipCode: string): number {
  // Basic fuel type adjustments
  const fuelAdjustments = {
    'electric': 2000,
    'hybrid': 1000,
    'diesel': 500,
    'gasoline': 0
  };
  
  return fuelAdjustments[fuelType.toLowerCase() as keyof typeof fuelAdjustments] || 0;
}

export function calculateFuelTypeAdjustment(fuelType: string, zipCode: string): number {
  return calculateFuelAdjustment(fuelType, zipCode);
}

export interface CarPricePredictionData {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  fuelType?: string;
  transmission?: string;
  color?: string;
  bodyType?: string;
  vin?: string;
}

export interface CarPricePredictionResult {
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  color: string;
  estimatedValue: number;
  confidenceScore: number;
  priceRange: [number, number];
  valuationFactors: Array<{
    factor: string;
    impact: number;
  }>;
}

export async function getCarPricePrediction(data: CarPricePredictionData): Promise<CarPricePredictionResult> {
  // Mock implementation - replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const baseValue = 20000;
  const yearFactor = (data.year - 2010) * 500;
  const mileageFactor = -(data.mileage / 10000) * 1000;
  const conditionFactor = data.condition === 'excellent' ? 2000 : 
                         data.condition === 'good' ? 0 : -2000;
  
  const estimatedValue = Math.max(5000, baseValue + yearFactor + mileageFactor + conditionFactor);
  
  return {
    make: data.make,
    model: data.model,
    year: data.year,
    mileage: data.mileage,
    fuelType: data.fuelType || 'Gasoline',
    transmission: data.transmission || 'Automatic',
    bodyType: data.bodyType || 'Sedan',
    color: data.color || 'Unknown',
    estimatedValue,
    confidenceScore: 85,
    priceRange: [estimatedValue * 0.9, estimatedValue * 1.1],
    valuationFactors: [
      { factor: 'Year', impact: yearFactor },
      { factor: 'Mileage', impact: mileageFactor },
      { factor: 'Condition', impact: conditionFactor }
    ]
  };
}

interface ValuationResult {
  value: number;
  confidence: number;
  breakdown: {
    baseValue: number;
    mileageAdjustment: number;
    conditionAdjustment: number;
    marketFactors: number;
    finalValue: number;
  };
  factors: string[];
}

interface VehicleData {
  year?: number;
  make?: string;
  model?: string;
  mileage?: number;
  condition?: 'excellent' | 'good' | 'fair' | 'poor';
  marketComparables?: any[];
}

export async function valuateVehicle(vehicleData: VehicleData): Promise<ValuationResult> {
  try {
    // Base valuation logic
    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - (vehicleData.year || currentYear);
    
    // Start with a base value (simplified calculation)
    let baseValue = 30000; // Default base value
    
    // Adjust for age (depreciation)
    const depreciationRate = 0.15; // 15% per year
    baseValue = baseValue * Math.pow(1 - depreciationRate, vehicleAge);
    
    // Mileage adjustment
    const averageMilesPerYear = 12000;
    const expectedMileage = vehicleAge * averageMilesPerYear;
    const actualMileage = vehicleData.mileage || expectedMileage;
    const mileageVariance = actualMileage - expectedMileage;
    const mileageAdjustment = mileageVariance * -0.10; // $0.10 per mile variance
    
    // Condition adjustment
    const conditionMultipliers = {
      excellent: 1.1,
      good: 1.0,
      fair: 0.85,
      poor: 0.7
    };
    const conditionMultiplier = conditionMultipliers[vehicleData.condition || 'good'];
    const conditionAdjustment = baseValue * (conditionMultiplier - 1);
    
    // Market factors (simplified)
    const marketFactors = baseValue * 0.05; // 5% market adjustment
    
    // Calculate final value
    const finalValue = Math.max(0, baseValue + mileageAdjustment + conditionAdjustment + marketFactors);
    
    // Confidence calculation based on available data
    let confidence = 0.5; // Base confidence
    if (vehicleData.year) confidence += 0.2;
    if (vehicleData.make && vehicleData.model) confidence += 0.2;
    if (vehicleData.mileage) confidence += 0.1;
    if (vehicleData.condition) confidence += 0.1;
    if (vehicleData.marketComparables?.length) confidence += 0.1;
    confidence = Math.min(1.0, confidence);
    
    // Generate factor explanations
    const factors = [
      `Vehicle age: ${vehicleAge} years`,
      `Mileage: ${actualMileage.toLocaleString()} miles`,
      `Condition: ${vehicleData.condition || 'good'}`,
      `Market adjustment applied`
    ];
    
    return {
      value: Math.round(finalValue),
      confidence: Math.round(confidence * 100) / 100,
      breakdown: {
        baseValue: Math.round(baseValue),
        mileageAdjustment: Math.round(mileageAdjustment),
        conditionAdjustment: Math.round(conditionAdjustment),
        marketFactors: Math.round(marketFactors),
        finalValue: Math.round(finalValue)
      },
      factors
    };
  } catch (error) {
    console.error('Valuation error:', error);
    return {
      value: 0,
      confidence: 0,
      breakdown: {
        baseValue: 0,
        mileageAdjustment: 0,
        conditionAdjustment: 0,
        marketFactors: 0,
        finalValue: 0
      },
      factors: ['Valuation calculation failed']
    };
  }
}

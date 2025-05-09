
import { 
  IdentifierType, 
  Vehicle, 
  RequiredInputs,
  ValuationResult 
} from './types';

/**
 * Decode vehicle information from an identifier (VIN, license plate, etc.)
 */
export async function decodeVehicle(
  type: IdentifierType, 
  identifier: string, 
  state?: string
): Promise<{ vehicle: Vehicle | null; error: string | null }> {
  try {
    if (type === 'manual') {
      const parts = identifier.split('|');
      const vehicleData = typeof parts[2] === 'object' ? parts[2] : {
        make: parts[0] || '',
        model: parts[1] || '',
        year: parseInt(parts[2] || '0', 10) || new Date().getFullYear(),
      };
      
      return {
        vehicle: {
          make: vehicleData.make || '',
          model: vehicleData.model || '',
          year: vehicleData.year || 0,
          trim: vehicleData.trim || '',
          fuelType: vehicleData.fuelType || '',
          bodyType: vehicleData.bodyType || '',
        },
        error: null
      };
    }
    
    // Mock data for demonstration
    let mockResponse: Vehicle;
    
    if (type === 'vin') {
      mockResponse = {
        make: 'Toyota',
        model: 'Camry',
        year: 2019,
        trim: 'LE',
        fuelType: 'Gasoline',
        bodyType: 'Sedan',
      };
    } else if (type === 'plate') {
      mockResponse = {
        make: 'Honda',
        model: 'Civic',
        year: 2020,
        trim: 'EX',
        fuelType: 'Gasoline',
        bodyType: 'Sedan',
      };
    } else {
      return {
        vehicle: null,
        error: 'Unsupported lookup type'
      };
    }
    
    // Add a small delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      vehicle: mockResponse,
      error: null
    };
  } catch (error) {
    console.error('Error decoding vehicle:', error);
    return {
      vehicle: null,
      error: 'Failed to decode vehicle information. Please try again.'
    };
  }
}

/**
 * Generate a valuation for a vehicle with the provided details
 */
export async function generateValuation(
  vehicle: Vehicle, 
  details: Partial<RequiredInputs>
): Promise<{ result: ValuationResult | null; error: string | null }> {
  try {
    // Add a small delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Mock valuation result
    const basePrice = calculateBasePrice(vehicle);
    const mileageAdjustment = calculateMileageAdjustment(details.mileage || 0, vehicle.year);
    const conditionAdjustment = calculateConditionAdjustment(details.condition || 3);
    
    const estimatedValue = Math.round(basePrice + mileageAdjustment + conditionAdjustment);
    const confidenceScore = calculateConfidenceScore(details);
    
    const result: ValuationResult = {
      id: generateRandomId(),
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      trim: vehicle.trim,
      mileage: details.mileage || 0,
      condition: details.conditionLabel || 'Good',
      zipCode: details.zipCode || '90210',
      estimated_value: estimatedValue,
      base_price: basePrice,
      confidence_score: confidenceScore,
      adjustments: [
        {
          factor: 'Mileage',
          impact: mileageAdjustment,
          description: `Based on ${(details.mileage || 0).toLocaleString()} miles for a ${vehicle.year} model`
        },
        {
          factor: 'Condition',
          impact: conditionAdjustment,
          description: `${details.conditionLabel || 'Good'} condition adjustment`
        },
        {
          factor: 'Market Demand',
          impact: calculateMarketAdjustment(basePrice, details.zipCode),
          description: 'Based on market demand in your region'
        }
      ],
      price_range: [
        Math.round(estimatedValue * 0.95),
        Math.round(estimatedValue * 1.05)
      ],
      zip_demand_factor: 1.02
    };
    
    return {
      result,
      error: null
    };
  } catch (error) {
    console.error('Error generating valuation:', error);
    return {
      result: null,
      error: 'Failed to generate valuation. Please try again.'
    };
  }
}

// Helper functions for valuation calculations
function calculateBasePrice(vehicle: Vehicle): number {
  // Simple mock calculation based on make, model, and year
  const currentYear = new Date().getFullYear();
  const age = currentYear - vehicle.year;
  
  let basePrice = 0;
  
  // Very simplified base prices
  if (vehicle.make === 'Toyota') {
    basePrice = vehicle.model === 'Camry' ? 28000 : 25000;
  } else if (vehicle.make === 'Honda') {
    basePrice = vehicle.model === 'Civic' ? 25000 : 27000;
  } else if (vehicle.make === 'BMW') {
    basePrice = 45000;
  } else if (vehicle.make === 'Ford') {
    basePrice = vehicle.model === 'F-150' ? 40000 : 30000;
  } else {
    basePrice = 30000; // Default
  }
  
  // Depreciation based on age
  const yearlyDepreciation = 0.1; // 10% per year
  const depreciation = Math.min(0.8, age * yearlyDepreciation); // Cap at 80%
  
  return Math.round(basePrice * (1 - depreciation));
}

function calculateMileageAdjustment(mileage: number, year: number): number {
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  
  // Expected mileage based on age (12,000 miles per year)
  const expectedMileage = age * 12000;
  const mileageDifference = mileage - expectedMileage;
  
  // Adjustment rate (e.g., -$0.1 per mile above expected)
  const adjustmentRate = -0.1;
  
  return Math.round(mileageDifference * adjustmentRate);
}

function calculateConditionAdjustment(condition: number | string): number {
  // Convert string condition to number if needed
  let conditionScore: number;
  
  if (typeof condition === 'string') {
    switch (condition.toLowerCase()) {
      case 'excellent': conditionScore = 5; break;
      case 'very good': conditionScore = 4; break;
      case 'good': conditionScore = 3; break;
      case 'fair': conditionScore = 2; break;
      case 'poor': conditionScore = 1; break;
      default: conditionScore = 3; // Default to 'Good'
    }
  } else {
    conditionScore = condition;
  }
  
  // Adjustments based on condition
  switch (conditionScore) {
    case 5: return 1500;  // Excellent
    case 4: return 800;   // Very Good
    case 3: return 0;     // Good (baseline)
    case 2: return -800;  // Fair
    case 1: return -1500; // Poor
    default: return 0;
  }
}

function calculateMarketAdjustment(basePrice: number, zipCode?: string): number {
  // Simple mock adjustment based on ZIP code
  // In a real app, this would use actual market data
  if (!zipCode) return 0;
  
  // Use the first digit of the ZIP code for demo purposes
  const firstDigit = parseInt(zipCode.charAt(0), 10);
  const adjustmentFactor = 0.02 * (firstDigit / 9); // 0-2% adjustment
  
  return Math.round(basePrice * adjustmentFactor);
}

function calculateConfidenceScore(details: Partial<RequiredInputs>): number {
  // Base confidence score
  let score = 85;
  
  // Adjust based on available data
  if (details.mileage) score += 5;
  if (details.condition) score += 5;
  if (details.zipCode) score += 5;
  if (details.hasAccident === false) score += 5; // Known no-accident
  if (details.hasAccident === true) score -= 5;  // Known accident
  
  // Cap the score between 60 and 98
  return Math.min(98, Math.max(60, score));
}

function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

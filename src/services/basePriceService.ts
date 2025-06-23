
interface BasePriceParams {
  make: string;
  model: string;
  year: number;
  mileage?: number;
}

export class BasePriceService {
  /**
   * Get base market value for a vehicle
   */
  static getBasePrice(params: BasePriceParams): number {
    const { make, model, year, mileage = 50000 } = params;
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;

    // Base pricing by make/model category
    const makeMultipliers: Record<string, number> = {
      'BMW': 1.4,
      'MERCEDES-BENZ': 1.5,
      'AUDI': 1.3,
      'LEXUS': 1.3,
      'ACURA': 1.2,
      'INFINITI': 1.1,
      'TOYOTA': 1.1,
      'HONDA': 1.0,
      'NISSAN': 0.9,
      'FORD': 0.8,
      'CHEVROLET': 0.8,
      'GMC': 0.9,
      'RAM': 0.9,
      'JEEP': 0.9,
      'DODGE': 0.7,
      'KIA': 0.7,
      'HYUNDAI': 0.7,
      'MITSUBISHI': 0.6,
    };

    // Model-specific adjustments
    const modelAdjustments: Record<string, number> = {
      'PRIUS': 1.2,
      'CAMRY': 1.1,
      'ACCORD': 1.1,
      'CIVIC': 1.0,
      'COROLLA': 1.0,
      'ALTIMA': 0.9,
      'SENTRA': 0.8,
      'F-150': 1.2,
      'SILVERADO': 1.1,
      'TAHOE': 1.3,
      'SUBURBAN': 1.4,
      'WRANGLER': 1.2,
    };

    // Base value by age
    let baseValue: number;
    if (age <= 1) {
      baseValue = 35000;
    } else if (age <= 3) {
      baseValue = 28000;
    } else if (age <= 5) {
      baseValue = 22000;
    } else if (age <= 8) {
      baseValue = 18000;
    } else if (age <= 12) {
      baseValue = 12000;
    } else {
      baseValue = 8000;
    }

    // Apply make multiplier
    const makeKey = make.toUpperCase();
    const makeMultiplier = makeMultipliers[makeKey] || 1.0;
    baseValue *= makeMultiplier;

    // Apply model adjustment
    const modelKey = model.toUpperCase();
    const modelMultiplier = modelAdjustments[modelKey] || 1.0;
    baseValue *= modelMultiplier;

    // Mileage adjustment
    const expectedMileage = age * 12000;
    const mileageDifference = mileage - expectedMileage;
    
    if (mileageDifference > 0) {
      // Higher than expected mileage - reduce value
      const mileagePenalty = Math.min(baseValue * 0.15, mileageDifference * 0.08);
      baseValue -= mileagePenalty;
    } else {
      // Lower than expected mileage - increase value
      const mileageBonus = Math.min(baseValue * 0.10, Math.abs(mileageDifference) * 0.05);
      baseValue += mileageBonus;
    }

    // Ensure minimum value
    return Math.max(3000, Math.round(baseValue));
  }

  /**
   * Validate that a calculated value is reasonable
   */
  static validateValue(value: number, year: number): boolean {
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    
    // Minimum values by age
    const minimums: Record<number, number> = {
      0: 15000,  // Current year
      1: 12000,  // 1 year old
      2: 10000,  // 2 years old
      3: 8000,   // 3 years old
      5: 6000,   // 5 years old
      10: 4000,  // 10 years old
    };

    const ageCategory = age <= 1 ? 0 : age <= 2 ? 1 : age <= 3 ? 2 : age <= 5 ? 3 : age <= 10 ? 5 : 10;
    const minimumValue = minimums[ageCategory] || 3000;

    return value >= minimumValue && value <= 150000; // Also check maximum
  }
}

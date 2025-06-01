import { AdjustmentItem } from '@/utils/pdf/types';

// Base valuation calculation
export function calculateBaseValue(year: number, make: string, model: string, mileage: number): number {
  // This is a simplified placeholder calculation
  // In a real application, this would use market data, depreciation curves, etc.
  const baseValue = 20000; // Starting point
  const ageDepreciation = (new Date().getFullYear() - year) * 1500;
  const mileageDepreciation = mileage * 0.05;
  
  // Apply make/model adjustments (simplified)
  let makeModelMultiplier = 1.0;
  if (['BMW', 'Mercedes-Benz', 'Audi', 'Lexus'].includes(make)) {
    makeModelMultiplier = 1.3; // Luxury brands
  } else if (['Toyota', 'Honda', 'Subaru'].includes(make)) {
    makeModelMultiplier = 1.1; // Reliable brands
  }
  
  return Math.max(500, (baseValue - ageDepreciation - mileageDepreciation) * makeModelMultiplier);
}

// Calculate adjustments based on vehicle condition and features
export function calculateAdjustments(data: any): AdjustmentItem[] {
  const adjustments: AdjustmentItem[] = [];
  
  // Condition adjustments
  if (data.condition === 'excellent') {
    adjustments.push({ factor: 'Excellent Condition', impact: 1500, description: 'Vehicle is in excellent condition' });
  } else if (data.condition === 'good') {
    adjustments.push({ factor: 'Good Condition', impact: 0, description: 'Vehicle is in good condition' });
  } else if (data.condition === 'fair') {
    adjustments.push({ factor: 'Fair Condition', impact: -1500, description: 'Vehicle is in fair condition' });
  } else if (data.condition === 'poor') {
    adjustments.push({ factor: 'Poor Condition', impact: -3000, description: 'Vehicle is in poor condition' });
  }
  
  // Mileage adjustments
  const avgMileagePerYear = 12000;
  const expectedMileage = (new Date().getFullYear() - data.year) * avgMileagePerYear;
  if (data.mileage < expectedMileage * 0.7) {
    adjustments.push({ factor: 'Low Mileage', impact: 1000, description: 'Vehicle has lower than average mileage' });
  } else if (data.mileage > expectedMileage * 1.3) {
    adjustments.push({ factor: 'High Mileage', impact: -1000, description: 'Vehicle has higher than average mileage' });
  }
  
  return adjustments;
}

export function calculateVehicleValue(data: any) {
  // Calculate base value
  const baseValue = calculateBaseValue(data.year, data.make, data.model, data.mileage);
  
  // Initialize adjustments array
  const adjustments: AdjustmentItem[] = [];
  
  // Add condition adjustments
  if (data.condition === 'excellent') {
    adjustments.push({ factor: 'Excellent Condition', impact: 1500, description: 'Vehicle is in excellent condition' });
  } else if (data.condition === 'good') {
    adjustments.push({ factor: 'Good Condition', impact: 0, description: 'Vehicle is in good condition' });
  } else if (data.condition === 'fair') {
    adjustments.push({ factor: 'Fair Condition', impact: -1500, description: 'Vehicle is in fair condition' });
  } else if (data.condition === 'poor') {
    adjustments.push({ factor: 'Poor Condition', impact: -3000, description: 'Vehicle is in poor condition' });
  }
  
  // Accident history adjustments
  if (data.accident_history?.hadAccident) {
    const severity = data.accident_history.severity;
    if (severity === 'minor') {
      adjustments.push({ factor: 'Minor Accident', impact: -500, description: 'Minor accident history' });
    } else if (severity === 'moderate') {
      adjustments.push({ factor: 'Moderate Accident', impact: -1500, description: 'Moderate accident damage' });
    } else if (severity === 'major') {
      adjustments.push({ factor: 'Major Accident', impact: -3000, description: 'Major accident damage' });
    }
    
    if (data.accident_history.frameDamage) {
      adjustments.push({ factor: 'Frame Damage', impact: -5000, description: 'Frame damage detected' });
    }
  }
  
  // Title status adjustments
  if (data.title_status === 'salvage') {
    adjustments.push({ factor: 'Salvage Title', impact: -5000, description: 'Vehicle has a salvage title' });
  } else if (data.title_status === 'rebuilt') {
    adjustments.push({ factor: 'Rebuilt Title', impact: -3000, description: 'Vehicle has a rebuilt title' });
  }
  
  // Service history adjustments
  if (data.serviceHistory?.hasRecords) {
    adjustments.push({ factor: 'Service Records', impact: 800, description: 'Complete service records available' });
    if (data.serviceHistory.dealerMaintained) {
      adjustments.push({ factor: 'Dealer Maintained', impact: 500, description: 'Vehicle maintained by dealer' });
    }
  }
  
  // Feature adjustments
  if (data.features && Array.isArray(data.features)) {
    // Premium features
    const premiumFeatures = ['leather_seats', 'navigation_system', 'sunroof', 'premium_audio'];
    const hasPremiumFeatures = data.features.some((feature: string) => premiumFeatures.includes(feature));
    if (hasPremiumFeatures) {
      adjustments.push({ factor: 'Premium Features', impact: 1200, description: 'Vehicle has premium features' });
    }
    
    // Safety features
    const safetyFeatures = ['blind_spot_monitor', 'lane_keep_assist', 'adaptive_cruise_control'];
    const hasSafetyFeatures = data.features.some((feature: string) => safetyFeatures.includes(feature));
    if (hasSafetyFeatures) {
      adjustments.push({ factor: 'Safety Features', impact: 800, description: 'Vehicle has advanced safety features' });
    }
  }
  
  // Calculate total adjustments
  const totalAdjustment = adjustments.reduce((sum, item) => sum + item.impact, 0);
  
  // Calculate final value
  const finalValue = Math.max(500, baseValue + totalAdjustment);
  
  return {
    baseValue,
    adjustments,
    totalAdjustment,
    finalValue,
    confidenceScore: 85 // Placeholder confidence score
  };
}

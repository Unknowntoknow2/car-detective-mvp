
import { FollowUpAnswers } from '@/types/follow-up-answers';

export function calculateVehicleValue(
  baseValue: number,
  formData: FollowUpAnswers
): number {
  let adjustedValue = baseValue;
  
  // Mileage adjustment
  if (formData.mileage) {
    const avgMileagePerYear = 12000;
    const currentYear = new Date().getFullYear();
    // Assuming we have year from somewhere or default
    const vehicleAge = 5; // placeholder
    const expectedMileage = avgMileagePerYear * vehicleAge;
    
    if (formData.mileage < expectedMileage) {
      adjustedValue *= 1.1; // 10% bonus for low mileage
    } else if (formData.mileage > expectedMileage * 1.5) {
      adjustedValue *= 0.9; // 10% penalty for high mileage
    }
  }
  
  // Condition adjustment
  if (formData.condition) {
    switch (formData.condition) {
      case 'excellent':
        adjustedValue *= 1.15;
        break;
      case 'good':
        adjustedValue *= 1.0;
        break;
      case 'fair':
        adjustedValue *= 0.85;
        break;
      case 'poor':
        adjustedValue *= 0.7;
        break;
    }
  }
  
  // Service history adjustment
  if (formData.service_history) {
    if (typeof formData.service_history === 'object' && formData.service_history.hasRecords) {
      adjustedValue *= 1.05; // 5% bonus for good service history
    }
  }
  
  // Accident history adjustment
  if (formData.accident_history?.hadAccident) {
    const severityMultiplier = formData.accident_history.severity === 'severe' ? 0.8 : 
                              formData.accident_history.severity === 'moderate' ? 0.9 : 0.95;
    adjustedValue *= severityMultiplier;
  }
  
  return Math.round(adjustedValue);
}

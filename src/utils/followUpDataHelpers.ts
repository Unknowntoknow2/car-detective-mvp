
import { ModificationDetails } from '@/types/valuation';
import { FollowUpAnswers } from '@/types/follow-up-answers';

export function getCompletionPercentage(formData: FollowUpAnswers): number {
  const requiredFields = ['vin', 'zip_code'];
  const optionalFields = ['mileage', 'condition', 'additional_notes'];
  
  let completedRequired = 0;
  let completedOptional = 0;
  
  // Check required fields
  requiredFields.forEach(field => {
    if (formData[field as keyof FollowUpAnswers]) {
      completedRequired++;
    }
  });
  
  // Check optional fields
  optionalFields.forEach(field => {
    if (formData[field as keyof FollowUpAnswers]) {
      completedOptional++;
    }
  });
  
  // Service history check
  if (formData.serviceHistory && typeof formData.serviceHistory === 'object' && formData.serviceHistory.hasRecords !== undefined) {
    completedOptional++;
  }
  
  // Modifications check - fixed type guard
  if (formData.modifications) {
    if (typeof formData.modifications === 'object' && 'hasModifications' in formData.modifications) {
      completedOptional++;
    } else if (typeof formData.modifications === 'string') {
      completedOptional++;
    }
  }
  
  const requiredWeight = 70; // 70% for required fields
  const optionalWeight = 30; // 30% for optional fields
  
  const requiredScore = (completedRequired / requiredFields.length) * requiredWeight;
  const optionalScore = (completedOptional / (optionalFields.length + 2)) * optionalWeight; // +2 for serviceHistory and modifications
  
  return Math.round(requiredScore + optionalScore);
}

export function shouldShowNextStep(formData: FollowUpAnswers, currentStep: number): boolean {
  switch (currentStep) {
    case 1: // Basic info
      return !!(formData.vin && formData.zip_code);
    case 2: // Vehicle condition
      return !!formData.condition;
    case 3: // Service history
      return formData.serviceHistory !== undefined;
    case 4: // Modifications
      return formData.modifications !== undefined;
    default:
      return true;
  }
}

export function getStepValidation(formData: FollowUpAnswers): Record<number, boolean> {
  return {
    1: !!(formData.vin && formData.zip_code),
    2: !!formData.condition,
    3: formData.serviceHistory !== undefined,
    4: formData.modifications !== undefined,
    5: true // Final step is always valid if we reach it
  };
}

export function calculateAdjustments(formData: FollowUpAnswers): Array<{factor: string, impact: number, description: string}> {
  const adjustments: Array<{factor: string, impact: number, description: string}> = [];
  
  // Condition adjustment
  if (formData.condition) {
    switch (formData.condition) {
      case 'excellent':
        adjustments.push({
          factor: 'Condition',
          impact: 1000,
          description: 'Vehicle is in excellent condition'
        });
        break;
      case 'poor':
        adjustments.push({
          factor: 'Condition',
          impact: -1500,
          description: 'Vehicle condition affects value negatively'
        });
        break;
    }
  }
  
  // Mileage adjustment
  if (formData.mileage) {
    if (formData.mileage < 30000) {
      adjustments.push({
        factor: 'Low Mileage',
        impact: 500,
        description: 'Below average mileage adds value'
      });
    } else if (formData.mileage > 100000) {
      adjustments.push({
        factor: 'High Mileage',
        impact: -800,
        description: 'High mileage reduces value'
      });
    }
  }
  
  return adjustments;
}

export function calculateCompletionPercentage(formData: FollowUpAnswers): number {
  return getCompletionPercentage(formData);
}

export function validateFormData(formData: FollowUpAnswers): boolean {
  return !!(formData.vin && formData.zip_code);
}

export function transformForValuation(formData: FollowUpAnswers): any {
  return {
    vin: formData.vin,
    zipCode: formData.zip_code,
    mileage: formData.mileage,
    condition: formData.condition,
    serviceHistory: formData.serviceHistory,
    modifications: formData.modifications,
    additionalNotes: formData.additional_notes
  };
}

export function processModifications(modifications: string | ModificationDetails): ModificationDetails {
  // Handle the case where modifications is a string
  if (typeof modifications === 'string') {
    return {
      hasModifications: modifications.toLowerCase() === 'yes' || modifications.toLowerCase() === 'true',
      types: [],
      modified: modifications.toLowerCase() === 'yes' || modifications.toLowerCase() === 'true',
      reversible: null
    };
  }
  
  // Handle the case where modifications is already a ModificationDetails object
  if (modifications && typeof modifications === 'object' && 'hasModifications' in modifications) {
    return modifications;
  }
  
  // Default fallback
  return {
    hasModifications: false,
    types: [],
    modified: false,
    reversible: null
  };
}

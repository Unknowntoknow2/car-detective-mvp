
import { FollowUpAnswers } from '@/types/follow-up-answers';

/**
 * Calculate completion percentage based on filled fields
 */
export function calculateCompletionPercentage(formData: FollowUpAnswers): number {
  const totalFields = 15; // Adjust based on important fields
  let completedFields = 0;

  // Basic info
  if (formData.zip_code) completedFields++;
  if (formData.condition && formData.condition !== 'good') completedFields++;
  
  // Title & Ownership
  if (formData.title_status && formData.title_status !== 'clean') completedFields++;
  if (formData.previous_use && formData.previous_use !== 'personal') completedFields++;
  
  // Service History
  if (formData.service_history && formData.service_history !== 'good') completedFields++;
  if (formData.maintenance_status && formData.maintenance_status !== 'good') completedFields++;
  
  // Vehicle Condition
  if (formData.tire_condition && formData.tire_condition !== 'good') completedFields++;
  if (formData.exterior_condition && formData.exterior_condition !== 'good') completedFields++;
  if (formData.interior_condition && formData.interior_condition !== 'good') completedFields++;
  
  // Accidents
  if (formData.accidents?.hadAccident !== undefined) completedFields++;
  if (formData.accidents?.hadAccident && formData.accidents?.severity) completedFields++;
  
  // Modifications
  if (formData.modifications?.modified !== undefined) completedFields++;
  if (formData.modifications?.modified && formData.modifications?.types?.length > 0) completedFields++;
  
  // Features
  if (formData.features && formData.features.length > 0) completedFields++;
  
  // Dashboard lights
  if (formData.dashboard_lights !== undefined) completedFields++;

  return Math.round((completedFields / totalFields) * 100);
}

/**
 * Validate form data for submission
 */
export function validateFormData(formData: FollowUpAnswers): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!formData.vin) {
    errors.push('VIN is required');
  }

  if (!formData.condition) {
    errors.push('Vehicle condition is required');
  }

  if (!formData.title_status) {
    errors.push('Title status is required');
  }

  // Add more validation rules as needed

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Transform form data for valuation calculation
 */
export function transformForValuation(formData: FollowUpAnswers) {
  return {
    vin: formData.vin,
    condition: formData.condition,
    titleStatus: formData.title_status,
    previousUse: formData.previous_use,
    serviceHistory: formData.service_history,
    maintenanceStatus: formData.maintenance_status,
    tireCondition: formData.tire_condition,
    exteriorCondition: formData.exterior_condition,
    interiorCondition: formData.interior_condition,
    frameDamage: formData.frame_damage,
    dashboardLights: formData.dashboard_lights,
    accidents: {
      hasAccidents: formData.accidents?.hadAccident || false,
      accidentCount: formData.accidents?.count || 0,
      severity: formData.accidents?.severity || 'minor',
      repaired: formData.accidents?.repaired || false,
      frameDamage: formData.accidents?.frameDamage || false
    },
    modifications: {
      hasModifications: formData.modifications?.modified || false,
      types: formData.modifications?.types || [],
      reversible: formData.modifications?.reversible || true
    },
    features: formData.features || [],
    zipCode: formData.zip_code
  };
}

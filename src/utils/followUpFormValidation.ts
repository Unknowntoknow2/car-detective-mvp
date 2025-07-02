// Frontend validation utilities for follow-up forms
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

const VALID_CONDITIONS = ['excellent', 'good', 'fair', 'poor'] as const;
export type ValidCondition = typeof VALID_CONDITIONS[number];

export function validateCondition(condition: string): ValidationResult {
  if (!condition || condition.trim() === '') {
    return {
      isValid: false,
      errors: ['Vehicle condition is required'],
      warnings: []
    };
  }

  if (!VALID_CONDITIONS.includes(condition as ValidCondition)) {
    return {
      isValid: false,
      errors: [`Invalid condition "${condition}". Must be one of: ${VALID_CONDITIONS.join(', ')}`],
      warnings: []
    };
  }

  return {
    isValid: true,
    errors: [],
    warnings: []
  };
}

export function validateBasicInfo(data: {
  zip_code?: string;
  mileage?: number;
  condition?: string;
}): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // ZIP code validation
  if (!data.zip_code || data.zip_code.trim() === '') {
    errors.push('ZIP code is required');
  } else if (!/^\d{5}$/.test(data.zip_code)) {
    errors.push('ZIP code must be 5 digits');
  }

  // Mileage validation
  if (!data.mileage || data.mileage <= 0) {
    errors.push('Mileage must be greater than 0');
  } else if (data.mileage > 1000000) {
    warnings.push('Mileage seems unusually high');
  }

  // Condition validation
  const conditionResult = validateCondition(data.condition || '');
  errors.push(...conditionResult.errors);
  warnings.push(...conditionResult.warnings);

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function sanitizeCondition(condition: string): ValidCondition {
  const normalized = condition?.toLowerCase().trim();
  
  if (VALID_CONDITIONS.includes(normalized as ValidCondition)) {
    return normalized as ValidCondition;
  }
  
  // Return safe default
  return 'good';
}

export function getValidationSummary(data: any): {
  canSubmit: boolean;
  completionPercentage: number;
  issues: string[];
} {
  const basicInfo = validateBasicInfo(data);
  const issues = [...basicInfo.errors, ...basicInfo.warnings];
  
  const requiredFields = [
    data.zip_code,
    data.mileage && data.mileage > 0,
    data.condition && VALID_CONDITIONS.includes(data.condition as ValidCondition)
  ];
  
  const completedCount = requiredFields.filter(Boolean).length;
  const completionPercentage = Math.round((completedCount / requiredFields.length) * 100);
  
  return {
    canSubmit: basicInfo.isValid,
    completionPercentage,
    issues
  };
}
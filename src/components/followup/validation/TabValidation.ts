
import { FollowUpAnswers } from '@/types/follow-up-answers';

export interface TabValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class TabValidation {
  static validateBasicInfo(formData: FollowUpAnswers): TabValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!formData.zip_code || formData.zip_code.length !== 5) {
      errors.push('Valid 5-digit ZIP code is required');
    }

    if (!formData.mileage || formData.mileage <= 0) {
      errors.push('Current mileage is required');
    }

    if (!formData.condition) {
      errors.push('Overall condition rating is required');
    }

    // Warnings for suspicious data
    if (formData.mileage && formData.mileage > 300000) {
      warnings.push('Mileage seems unusually high - please verify');
    }

    if (formData.previous_owners && formData.previous_owners > 5) {
      warnings.push('High number of previous owners may affect value');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  static validateCondition(formData: FollowUpAnswers): TabValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // At least one condition field should be filled
    const conditionFields = [
      formData.tire_condition,
      formData.exterior_condition,
      formData.interior_condition,
      formData.brake_condition
    ].filter(Boolean);

    if (conditionFields.length === 0) {
      errors.push('At least one condition assessment is required');
    }

    // Warn about poor conditions
    if (formData.tire_condition === 'poor') {
      warnings.push('Poor tire condition may significantly impact value');
    }

    if (formData.brake_condition === 'poor') {
      warnings.push('Poor brake condition is a safety concern and affects value');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  static validateIssues(formData: FollowUpAnswers): TabValidationResult {
    // Issues tab is always valid - it's optional information
    const warnings: string[] = [];

    if (formData.dashboard_lights && formData.dashboard_lights.length > 3) {
      warnings.push('Multiple dashboard warning lights may indicate serious issues');
    }

    return {
      isValid: true,
      errors: [],
      warnings
    };
  }

  static validateServiceHistory(formData: FollowUpAnswers): TabValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if service history status is defined
    if (formData.serviceHistory?.hasRecords === undefined) {
      errors.push('Please indicate if service records are available');
    }

    // If they have records but frequency is unknown, warn
    if (formData.serviceHistory?.hasRecords && formData.serviceHistory?.frequency === 'unknown') {
      warnings.push('Service frequency information helps improve valuation accuracy');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  static validateAccidents(formData: FollowUpAnswers): TabValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if accident status is defined
    if (formData.accidents?.hadAccident === undefined) {
      errors.push('Please indicate if the vehicle has been in any accidents');
    }

    // If they had accidents, validate additional fields
    if (formData.accidents?.hadAccident) {
      if (!formData.accidents.count || formData.accidents.count === 0) {
        errors.push('Number of accidents is required');
      }

      if (!formData.accidents.severity) {
        errors.push('Accident severity is required');
      }

      // Warnings for serious accidents
      if (formData.accidents.frameDamage) {
        warnings.push('Frame damage significantly impacts vehicle value and safety');
      }

      if (formData.accidents.severity === 'major') {
        warnings.push('Major accidents can substantially reduce vehicle value');
      }

      if (formData.accidents.count && formData.accidents.count > 2) {
        warnings.push('Multiple accidents may significantly impact value');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  static validateModifications(formData: FollowUpAnswers): TabValidationResult {
    const warnings: string[] = [];

    // Check if modification status is defined
    if (formData.modifications?.hasModifications === undefined) {
      return {
        isValid: false,
        errors: ['Please indicate if the vehicle has any modifications'],
        warnings: []
      };
    }

    // Warnings for extensive modifications
    if (formData.modifications?.hasModifications && formData.modifications?.types) {
      const modCount = formData.modifications.types.length;
      if (modCount > 5) {
        warnings.push('Extensive modifications may significantly impact resale value');
      }
    }

    return {
      isValid: true,
      errors: [],
      warnings
    };
  }

  static validateFeatures(formData: FollowUpAnswers): TabValidationResult {
    // Features tab is always valid - it's optional enhancement information
    return {
      isValid: true,
      errors: [],
      warnings: []
    };
  }

  static validateTab(tabName: string, formData: FollowUpAnswers): TabValidationResult {
    const tabMap: Record<string, () => TabValidationResult> = {
      'vehicle': () => this.validateBasicInfo(formData),
      'basic': () => this.validateBasicInfo(formData),
      'condition': () => this.validateCondition(formData),
      'issues': () => this.validateIssues(formData),
      'service': () => this.validateServiceHistory(formData),
      'accidents': () => this.validateAccidents(formData),
      'modifications': () => this.validateModifications(formData),
      'features': () => this.validateFeatures(formData),
      'ownership': () => this.validateBasicInfo(formData),
      'final': () => this.validateBasicInfo(formData)
    };

    const validator = tabMap[tabName];
    return validator ? validator() : { isValid: true, errors: [], warnings: [] };
  }

  static validateAllTabs(formData: FollowUpAnswers): Record<string, TabValidationResult> {
    return {
      basic: this.validateBasicInfo(formData),
      condition: this.validateCondition(formData),
      issues: this.validateIssues(formData),
      service: this.validateServiceHistory(formData),
      accidents: this.validateAccidents(formData),
      modifications: this.validateModifications(formData),
      features: this.validateFeatures(formData)
    };
  }

  static getOverallCompletion(formData: FollowUpAnswers): number {
    const validations = this.validateAllTabs(formData);
    const validTabs = Object.values(validations).filter(v => v.isValid).length;
    const totalTabs = Object.keys(validations).length;
    return Math.round((validTabs / totalTabs) * 100);
  }
}

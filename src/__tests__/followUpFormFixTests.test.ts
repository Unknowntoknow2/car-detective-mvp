// Comprehensive test suite for follow-up form save failures
import { describe, it, expect } from 'vitest';
import { validateCondition, validateBasicInfo, getValidationSummary } from '@/utils/followUpFormValidation';
import { classifyError } from '@/utils/errorClassification';
import { safeVehicleData, validateRequiredVehicleData } from '@/utils/safeDataAccess';

describe('Follow-Up Form Save Failures - Comprehensive Tests', () => {
  describe('Condition Validation', () => {
    it('should validate condition values correctly', () => {
      // Valid conditions
      expect(validateCondition('excellent')).toEqual({ isValid: true, errors: [], warnings: [] });
      expect(validateCondition('good')).toEqual({ isValid: true, errors: [], warnings: [] });
      expect(validateCondition('fair')).toEqual({ isValid: true, errors: [], warnings: [] });
      expect(validateCondition('poor')).toEqual({ isValid: true, errors: [], warnings: [] });

      // Invalid conditions
      expect(validateCondition('')).toEqual({ 
        isValid: false, 
        errors: ['Vehicle condition is required'], 
        warnings: [] 
      });
      expect(validateCondition('invalid')).toEqual({ 
        isValid: false, 
        errors: ['Invalid condition "invalid". Must be one of: excellent, good, fair, poor'], 
        warnings: [] 
      });
    });

    it('should prevent database constraint violations', () => {
      const invalidConditions = ['', null, undefined, 'bad', 'terrible'];
      
      invalidConditions.forEach(condition => {
        const result = validateCondition(condition as string);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Basic Info Validation', () => {
    it('should validate complete basic info', () => {
      const validData = {
        zip_code: '90210',
        mileage: 50000,
        condition: 'good'
      };

      const result = validateBasicInfo(validData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should catch invalid data', () => {
      const invalidData = {
        zip_code: '',
        mileage: 0,
        condition: ''
      };

      const result = validateBasicInfo(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('ZIP code is required');
      expect(result.errors).toContain('Mileage must be greater than 0');
      expect(result.errors).toContain('Vehicle condition is required');
    });
  });

  describe('Error Classification', () => {
    it('should classify constraint violation errors', () => {
      const constraintError = new Error('violates check constraint "follow_up_answers_condition_check"');
      const classified = classifyError(constraintError);
      
      expect(classified.type).toBe('validation');
      expect(classified.userMessage).toBe('Please select a valid vehicle condition (excellent/good/fair/poor)');
      expect(classified.retryable).toBe(false);
    });

    it('should classify foreign key errors', () => {
      const fkError = new Error('violates foreign key constraint');
      const classified = classifyError(fkError);
      
      expect(classified.type).toBe('validation');
      expect(classified.userMessage).toBe('Data linking error - please refresh the page and try again');
      expect(classified.retryable).toBe(true);
    });

    it('should classify network errors', () => {
      const networkError = new Error('Network error: fetch failed');
      const classified = classifyError(networkError);
      
      expect(classified.type).toBe('network');
      expect(classified.userMessage).toBe('Network error - please check your connection and try again');
      expect(classified.retryable).toBe(true);
    });
  });

  describe('Safe Data Access', () => {
    it('should safely extract vehicle data with defaults', () => {
      const unsafeData = {
        make: null,
        model: undefined,
        year: 'invalid',
        vin: null
      };

      const safeData = safeVehicleData(unsafeData);
      
      expect(safeData.make).toBe('Unknown');
      expect(safeData.model).toBe('Unknown');
      expect(safeData.year).toBe(new Date().getFullYear());
      expect(safeData.vin).toBe('');
      expect(safeData.condition).toBe('good');
    });

    it('should validate required vehicle data', () => {
      const incompleteData = { make: 'Ford' }; // Missing model and year
      const validation = validateRequiredVehicleData(incompleteData);
      
      expect(validation.valid).toBe(false);
      expect(validation.missing).toContain('model');
      expect(validation.missing).toContain('year');
    });
  });

  describe('Form Validation Summary', () => {
    it('should calculate completion percentage correctly', () => {
      const completeData = {
        zip_code: '90210',
        mileage: 50000,
        condition: 'good'
      };

      const summary = getValidationSummary(completeData);
      expect(summary.canSubmit).toBe(true);
      expect(summary.completionPercentage).toBe(100);
      expect(summary.issues).toHaveLength(0);
    });

    it('should prevent submission with invalid data', () => {
      const incompleteData = {
        zip_code: '123', // Invalid
        mileage: 0, // Invalid
        condition: 'invalid' // Invalid
      };

      const summary = getValidationSummary(incompleteData);
      expect(summary.canSubmit).toBe(false);
      expect(summary.completionPercentage).toBe(0);
      expect(summary.issues.length).toBeGreaterThan(0);
    });
  });
});

// Integration test - simulate actual form submission scenarios
describe('Form Submission Integration Tests', () => {
  it('should prevent constraint violations during save', async () => {
    const invalidFormData = {
      vin: 'TEST123',
      condition: '', // This would cause constraint violation
      zip_code: '90210',
      mileage: 50000
    };

    // Simulate pre-save validation
    const validation = validateCondition(invalidFormData.condition);
    expect(validation.isValid).toBe(false);
    
    // Form should not attempt save with invalid data
    expect(validation.errors).toContain('Vehicle condition is required');
  });

  it('should handle undefined vehicle data safely', () => {
    const undefinedVehicleData = undefined;
    const safeData = safeVehicleData(undefinedVehicleData);
    
    // Should return safe defaults instead of throwing errors
    expect(safeData.make).toBe('Unknown');
    expect(safeData.model).toBe('Unknown');
    expect(safeData.condition).toBe('good');
  });
});
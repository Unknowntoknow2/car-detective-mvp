
import { useState, useCallback } from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  minValue?: number;
  maxValue?: number;
  validate?: (value: any) => boolean | string;
}

export interface FieldValidation {
  [key: string]: ValidationRule;
}

interface ValidationError {
  field: string;
  message: string;
}

export function useFieldValidation(validationRules: FieldValidation) {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validateField = useCallback((fieldName: string, value: any): string | null => {
    const rules = validationRules[fieldName];
    
    if (!rules) return null;
    
    // Required validation
    if (rules.required && (value === undefined || value === null || value === '')) {
      return `${fieldName} is required`;
    }
    
    // Skip other validations if value is empty and not required
    if (value === undefined || value === null || value === '') {
      return null;
    }
    
    // String validations
    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        return `${fieldName} must be at least ${rules.minLength} characters`;
      }
      
      if (rules.maxLength && value.length > rules.maxLength) {
        return `${fieldName} cannot exceed ${rules.maxLength} characters`;
      }
      
      if (rules.pattern && !rules.pattern.test(value)) {
        return `${fieldName} has an invalid format`;
      }
    }
    
    // Number validations
    if (typeof value === 'number') {
      if (rules.minValue !== undefined && value < rules.minValue) {
        return `${fieldName} must be at least ${rules.minValue}`;
      }
      
      if (rules.maxValue !== undefined && value > rules.maxValue) {
        return `${fieldName} cannot exceed ${rules.maxValue}`;
      }
    }
    
    // Custom validation
    if (rules.validate) {
      const result = rules.validate(value);
      if (typeof result === 'string') {
        return result;
      }
      if (result === false) {
        return `${fieldName} is invalid`;
      }
    }
    
    return null;
  }, [validationRules]);

  const validateFields = useCallback((data: Record<string, any>): boolean => {
    const newErrors: ValidationError[] = [];
    
    Object.keys(validationRules).forEach(fieldName => {
      const errorMessage = validateField(fieldName, data[fieldName]);
      if (errorMessage) {
        newErrors.push({
          field: fieldName,
          message: errorMessage
        });
      }
    });
    
    setErrors(newErrors);
    return newErrors.length === 0;
  }, [validateField, validationRules]);

  const getFieldError = useCallback((fieldName: string): string | undefined => {
    const error = errors.find(err => err.field === fieldName);
    return error?.message;
  }, [errors]);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return {
    validateField,
    validateFields,
    getFieldError,
    clearErrors,
    errors
  };
}

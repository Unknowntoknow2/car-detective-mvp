
import { useState, useCallback } from 'react';
import { ZodSchema, z } from 'zod';

interface ValidationResult {
  isValid: boolean;
  error?: string;
  details?: string;
}

export function useValidation<T>(schema: ZodSchema<T>) {
  const [errors, setErrors] = useState<Map<string, ValidationResult>>(new Map());

  const validateField = useCallback((fieldName: string, value: unknown): ValidationResult => {
    try {
      // Create a partial schema for the specific field
      // We need to use a different approach instead of accessing schema.shape
      const partialSchema = z.object({ [fieldName]: schema as any });
      partialSchema.parse({ [fieldName]: value });
      
      // Clear error for this field
      const newErrors = new Map(errors);
      newErrors.delete(fieldName);
      setErrors(newErrors);
      
      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors[0];
        const result = {
          isValid: false,
          error: fieldError.message,
          details: getErrorDetails(fieldError)
        };
        
        // Update errors map
        const newErrors = new Map(errors);
        newErrors.set(fieldName, result);
        setErrors(newErrors);
        
        return result;
      }
      return { isValid: false, error: 'Invalid value' };
    }
  }, [schema, errors]);

  const validateForm = useCallback((data: Partial<T>): boolean => {
    try {
      schema.parse(data);
      setErrors(new Map());
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = new Map();
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          newErrors.set(field, {
            isValid: false,
            error: err.message,
            details: getErrorDetails(err)
          });
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [schema]);

  const getFieldError = useCallback((fieldName: string): ValidationResult | undefined => {
    return errors.get(fieldName);
  }, [errors]);

  const clearErrors = useCallback(() => {
    setErrors(new Map());
  }, []);

  return {
    validateField,
    validateForm,
    getFieldError,
    clearErrors,
    hasErrors: errors.size > 0
  };
}

function getErrorDetails(error: z.ZodIssue): string | undefined {
  // Add specific error details based on the error code
  switch (error.code) {
    case 'too_small':
      return `Minimum length is ${(error as z.ZodIssue & { minimum?: number }).minimum} characters`;
    case 'too_big':
      return `Maximum length is ${(error as z.ZodIssue & { maximum?: number }).maximum} characters`;
    case 'invalid_string':
      return 'Invalid format';
    case 'invalid_type':
      return `Expected ${(error as z.ZodIssue & { expected?: string }).expected}, received ${(error as z.ZodIssue & { received?: string }).received}`;
    default:
      return undefined;
  }
}

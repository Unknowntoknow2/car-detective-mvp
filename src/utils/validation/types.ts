
export interface ValidationResult {
  isValid: boolean;
  message?: string;
  error?: string; // Add the error property that's being used
}

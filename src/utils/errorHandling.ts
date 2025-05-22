
/**
 * Convert any error type to a string message
 * @param error The error to convert
 * @returns A string representation of the error
 */
export const errorToString = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (error && typeof error === 'object') {
    if (error.message) {
      return error.message;
    }
    
    if (error.error) {
      return typeof error.error === 'string' 
        ? error.error 
        : errorToString(error.error);
    }
    
    // For Supabase errors
    if (error.error_description) {
      return error.error_description;
    }
    
    try {
      return JSON.stringify(error);
    } catch {
      return 'An unexpected error occurred';
    }
  }
  
  return 'An unexpected error occurred';
};

/**
 * Log an error to the console with additional context
 * @param error The error to log
 * @param context Additional context information
 */
export const logError = (error: any, context: string = ''): void => {
  const errorMessage = errorToString(error);
  if (context) {
    console.error(`Error in ${context}:`, error);
  } else {
    console.error('Error:', error);
  }
  return;
};

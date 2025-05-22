
/**
 * Converts any error object to a string message
 */
export function errorToString(error: unknown): string {
  if (error === null || error === undefined) {
    return 'Unknown error occurred';
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  
  return JSON.stringify(error);
}

/**
 * Extracts an error message from a Supabase error response
 */
export function extractSupabaseErrorMessage(error: any): string {
  if (!error) return 'An unexpected error occurred';
  
  // Handle standard error objects
  if (typeof error === 'string') return error;
  
  // Handle Supabase error format
  if (error.message) return error.message;
  if (error.error_description) return error.error_description;
  
  // Fallback
  return 'An unexpected error occurred';
}

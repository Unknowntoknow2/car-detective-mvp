
/**
 * Converts any error type to a string message
 */
export const errorToString = (error: any): string => {
  if (!error) return 'Unknown error';
  
  if (typeof error === 'string') return error;
  
  if (error instanceof Error) return error.message;
  
  if (typeof error === 'object') {
    // Check for Supabase error format
    if (error.message) return error.message;
    
    // Check for API error format
    if (error.error) return typeof error.error === 'string' ? error.error : errorToString(error.error);
    
    // Fallback to JSON string
    try {
      return JSON.stringify(error);
    } catch (e) {
      return 'Unknown error object';
    }
  }
  
  return String(error);
};

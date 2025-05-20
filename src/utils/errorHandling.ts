
import { AuthError } from '@supabase/supabase-js';

/**
 * Extracts a user-friendly error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AuthError) {
    return error.message;
  } else if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else {
    return 'An unknown error occurred';
  }
}

/**
 * Safely converts an error to a string for React state
 */
export function errorToString(error: unknown): string {
  return getErrorMessage(error);
}

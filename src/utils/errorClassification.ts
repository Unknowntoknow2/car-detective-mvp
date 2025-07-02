// Enhanced error classification for better user feedback
export interface ClassifiedError {
  type: 'validation' | 'network' | 'permission' | 'server' | 'unknown';
  userMessage: string;
  retryable: boolean;
}

export function classifyError(error: any): ClassifiedError {
  const errorMessage = error?.message || error?.toString() || 'Unknown error';
  
  // Database constraint violations
  if (errorMessage.includes('condition_check') || 
      errorMessage.includes('violates check constraint')) {
    return {
      type: 'validation',
      userMessage: 'Please select a valid vehicle condition (excellent/good/fair/poor)',
      retryable: false
    };
  }
  
  // Foreign key constraint violations
  if (errorMessage.includes('foreign key constraint') || 
      errorMessage.includes('violates foreign key')) {
    return {
      type: 'validation',
      userMessage: 'Data linking error - please refresh the page and try again',
      retryable: true
    };
  }
  
  // Row Level Security violations
  if (errorMessage.includes('row-level security') || 
      errorMessage.includes('insufficient_privilege')) {
    return {
      type: 'permission',
      userMessage: 'Permission error - please sign in and try again',
      retryable: true
    };
  }
  
  // Network-related errors
  if (errorMessage.includes('network') || 
      errorMessage.includes('fetch') || 
      errorMessage.includes('ECONNRESET') ||
      errorMessage.includes('timeout') ||
      error?.code === 'NETWORK_ERROR') {
    return {
      type: 'network',
      userMessage: 'Network error - please check your connection and try again',
      retryable: true
    };
  }
  
  // Server errors
  if (errorMessage.includes('Internal Server Error') || 
      errorMessage.includes('500') ||
      errorMessage.includes('503') ||
      errorMessage.includes('502')) {
    return {
      type: 'server',
      userMessage: 'Server error - please try again in a moment',
      retryable: true
    };
  }
  
  // Generic fallback
  return {
    type: 'unknown',
    userMessage: 'Something went wrong - please try again',
    retryable: true
  };
}

export function shouldShowRetryButton(error: ClassifiedError): boolean {
  return error.retryable && error.type !== 'permission';
}

export function getRetryDelay(attempt: number): number {
  // Exponential backoff: 1s, 2s, 4s, 8s, max 10s
  return Math.min(1000 * Math.pow(2, attempt), 10000);
}
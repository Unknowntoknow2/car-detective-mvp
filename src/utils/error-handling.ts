
import { toast } from 'sonner';

export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export interface ErrorDetails {
  message: string;
  code?: string;
  context?: string;
  severity: ErrorSeverity;
  timestamp: Date;
}

/**
 * Centralized error handling utility
 * Logs errors to console and shows toast notifications
 */
export const errorHandler = {
  /**
   * Handle an error with appropriate logging and user feedback
   */
  handle: (error: any, context: string = 'application'): ErrorDetails => {
    // Extract error details
    const message = error?.message || 'An unexpected error occurred';
    const code = error?.code || 'UNKNOWN_ERROR';
    const severity = getSeverity(error);
    
    // Create structured error object
    const errorDetails: ErrorDetails = {
      message,
      code,
      context,
      severity,
      timestamp: new Date()
    };
    
    // Log to console with context
    console.error(`[${context}] ${message}`, error);

    // Show appropriate toast based on severity
    switch (severity) {
      case ErrorSeverity.INFO:
        toast.info(message);
        break;
      case ErrorSeverity.WARNING:
        toast.warning(message);
        break;
      case ErrorSeverity.CRITICAL:
        toast.error(`Critical Error: ${message}`);
        break;
      default:
        toast.error(message);
    }

    return errorDetails;
  },
  
  /**
   * Report errors to monitoring service (placeholder for future implementation)
   */
  report: (errorDetails: ErrorDetails) => {
    // This would connect to an error monitoring service like Sentry
    console.log('Error reported to monitoring:', errorDetails);
  }
};

// Helper to determine error severity
function getSeverity(error: any): ErrorSeverity {
  // Network errors are critical as they may indicate connectivity issues
  if (error?.name === 'NetworkError' || error?.message?.includes('network')) {
    return ErrorSeverity.CRITICAL;
  }
  
  // Authentication errors are treated as warnings
  if (error?.code === 'auth/unauthorized' || error?.message?.includes('permission')) {
    return ErrorSeverity.WARNING;
  }
  
  // Validation errors are treated as info
  if (error?.code === 'validation' || error?.message?.includes('validation')) {
    return ErrorSeverity.INFO;
  }
  
  // Default to standard error
  return ErrorSeverity.ERROR;
}

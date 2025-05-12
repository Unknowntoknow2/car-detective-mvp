interface ErrorDetails {
  message: string;
  code?: string;
  context?: string;
  severity?: 'warning' | 'error' | 'critical';
  timestamp?: Date;
}

class ErrorHandler {
  handle(error: unknown, context?: string): ErrorDetails {
    // Extract message from different error types
    let message = 'An unexpected error occurred';
    let code = 'UNKNOWN_ERROR';
    
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      message = String((error as any).message);
      
      if ('code' in error) {
        code = String((error as any).code);
      }
    }
    
    // Log error for debugging
    console.error(`Error [${context || 'general'}]:`, error);
    
    return {
      message,
      code,
      context
    };
  }

  // Reporting method for centralized error tracking
  report(details: ErrorDetails): void {
    console.error('Error reported:', details);
    
    // Here you would typically send the error to a monitoring service
    // For example: Sentry, LogRocket, etc.
    
    try {
      // Save error to localStorage for debugging
      const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      errors.push({
        ...details,
        timestamp: details.timestamp || new Date()
      });
      
      // Keep only the last 20 errors
      if (errors.length > 20) {
        errors.splice(0, errors.length - 20);
      }
      
      localStorage.setItem('app_errors', JSON.stringify(errors));
    } catch (e) {
      // Ignore localStorage errors
    }
  }
}

export const errorHandler = new ErrorHandler();

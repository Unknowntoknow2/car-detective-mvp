
interface ErrorDetails {
  message: string;
  code?: string;
  context?: string;
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

  // Add report method for compatibility with EnhancedErrorBoundary
  report(error: unknown, context?: string): void {
    const details = this.handle(error, context);
    console.error('Error reported:', details);
    
    // Here you would typically send the error to a monitoring service
    // For now, we just log it to the console
  }
}

export const errorHandler = new ErrorHandler();


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
}

export const errorHandler = new ErrorHandler();

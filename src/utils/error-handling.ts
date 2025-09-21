
/**
 * Error handling utilities
 */

export interface ErrorReport {
  message: string;
  context: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  stack?: string;
}

class ErrorHandler {
  private errors: ErrorReport[] = [];

  handle(error: unknown, context: string = 'unknown'): void {
    const errorMessage = this.extractErrorMessage(error);
    const severity = this.determineSeverity(error);
    
    const report: ErrorReport = {
      message: errorMessage,
      context,
      severity,
      timestamp: new Date(),
      stack: error instanceof Error ? error.stack : undefined
    };

    this.errors.push(report);
    
    // Log to console in development
    if (import.meta.env.NODE_ENV === 'development') {
    }
  }

  report(errorReport: ErrorReport): void {
    this.errors.push(errorReport);
    
    // In a real app, this would send to monitoring service
  }

  getErrors(): ErrorReport[] {
    return [...this.errors];
  }

  clearErrors(): void {
    this.errors = [];
  }

  private extractErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    if (error && typeof error === 'object') {
      try {
        return JSON.stringify(error);
      } catch {
        return 'Unknown error object';
      }
    }
    return 'Unknown error';
  }

  private determineSeverity(error: unknown): 'low' | 'medium' | 'high' | 'critical' {
    if (error instanceof Error) {
      if (error.name === 'TypeError' || error.name === 'ReferenceError') {
        return 'critical';
      }
      if (error.name === 'NetworkError' || error.message.includes('fetch')) {
        return 'high';
      }
      return 'medium';
    }
    return 'low';
  }
}

export const errorHandler = new ErrorHandler();

// Legacy exports for compatibility
export const errorToString = (error: unknown): string => {
  return errorHandler['extractErrorMessage'](error);
};

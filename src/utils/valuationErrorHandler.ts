/**
 * PHASE 4: Comprehensive error handling for valuation pipeline
 */

export interface ValuationError {
  code: string;
  message: string;
  recoverable: boolean;
  retryable: boolean;
  userMessage: string;
}

export class ValuationErrorHandler {
  static handleVinDecodeError(error: any): ValuationError {
    if (error?.message?.includes('Invalid VIN format')) {
      return {
        code: 'INVALID_VIN',
        message: error.message,
        recoverable: true,
        retryable: false,
        userMessage: 'Please enter a valid 17-character VIN (letters and numbers only, no I, O, or Q).'
      };
    }

    if (error?.message?.includes('NHTSA API')) {
      return {
        code: 'NHTSA_API_ERROR',
        message: error.message,
        recoverable: true,
        retryable: true,
        userMessage: 'VIN decode service is temporarily unavailable. Please try again in a moment.'
      };
    }

    if (error?.message?.includes('network') || error?.code === 'ECONNRESET') {
      return {
        code: 'NETWORK_ERROR',
        message: error.message,
        recoverable: true,
        retryable: true,
        userMessage: 'Network connection issue. Please check your internet and try again.'
      };
    }

    return {
      code: 'DECODE_ERROR',
      message: error?.message || 'Unknown decode error',
      recoverable: true,
      retryable: true,
      userMessage: 'Failed to decode VIN. Please try again or use manual entry.'
    };
  }

  static handleValuationError(error: any): ValuationError {
    if (error?.message?.includes('incomplete data')) {
      return {
        code: 'INCOMPLETE_DATA',
        message: error.message,
        recoverable: true,
        retryable: false,
        userMessage: 'Please complete all required fields (location, mileage, and condition).'
      };
    }

    if (error?.message?.includes('market data')) {
      return {
        code: 'MARKET_DATA_ERROR',
        message: error.message,
        recoverable: true,
        retryable: true,
        userMessage: 'Market data is temporarily unavailable. We\'ll use our pricing model instead.'
      };
    }

    if (error?.message?.includes('database')) {
      return {
        code: 'DATABASE_ERROR',
        message: error.message,
        recoverable: true,
        retryable: true,
        userMessage: 'Data saving issue. Please try again in a moment.'
      };
    }

    return {
      code: 'VALUATION_ERROR',
      message: error?.message || 'Unknown valuation error',
      recoverable: true,
      retryable: true,
      userMessage: 'Valuation process failed. Please try again or contact support.'
    };
  }

  static shouldRetry(error: ValuationError, attemptCount: number): boolean {
    const maxRetries = 3;
    return error.retryable && attemptCount < maxRetries;
  }

  static getRetryDelay(attemptCount: number): number {
    // Exponential backoff: 1s, 2s, 4s
    return Math.pow(2, attemptCount) * 1000;
  }
}

/**
 * Retry wrapper for valuation operations
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  operationType: 'decode' | 'valuation',
  maxRetries: number = 3
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      const valuationError = operationType === 'decode' 
        ? ValuationErrorHandler.handleVinDecodeError(error)
        : ValuationErrorHandler.handleValuationError(error);
      
      if (!ValuationErrorHandler.shouldRetry(valuationError, attempt)) {
        throw valuationError;
      }
      
      if (attempt < maxRetries) {
        const delay = ValuationErrorHandler.getRetryDelay(attempt);
        console.log(`⏱️ Retrying ${operationType} operation in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}
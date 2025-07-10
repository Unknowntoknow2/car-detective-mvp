// Enhanced Error Handler for Valuation System
import { logValuationAuditFallback } from "@/services/valuationAuditLogger";

export interface ValuationError {
  code: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recoverable: boolean;
  fallbackStrategy?: string;
  context?: any;
}

export class ResilientValuationError extends Error {
  public readonly code: string;
  public readonly severity: string;
  public readonly recoverable: boolean;
  public readonly context: any;

  constructor(error: ValuationError) {
    super(error.message);
    this.code = error.code;
    this.severity = error.severity;
    this.recoverable = error.recoverable;
    this.context = error.context;
    this.name = 'ResilientValuationError';
  }
}

/**
 * Handle valuation errors with fallback strategies
 */
export async function handleValuationError(
  error: any, 
  context: any, 
  fallbackStrategy?: () => Promise<any>
): Promise<any> {
  const classifiedError = classifyValuationError(error);
  
  console.error(`❌ [ErrorHandler] ${classifiedError.severity.toUpperCase()} error:`, {
    code: classifiedError.code,
    message: classifiedError.message,
    context: context,
    recoverable: classifiedError.recoverable
  });

  // Log error to audit trail
  try {
    await logValuationAuditFallback({
      source: 'error_handler',
      input: context,
      baseValue: 0,
      adjustments: { error: -1 },
      confidence: 0,
      listings_count: 0,
      prices: [],
      timestamp: new Date().toISOString()
    });
  } catch (logError) {
    console.error('❌ Error logging failed:', logError);
  }

  // Apply fallback strategy if available and error is recoverable
  if (classifiedError.recoverable && fallbackStrategy) {
    try {
      console.log(`🔄 [ErrorHandler] Applying fallback strategy: ${classifiedError.fallbackStrategy}`);
      return await fallbackStrategy();
    } catch (fallbackError) {
      console.error('❌ [ErrorHandler] Fallback strategy failed:', fallbackError);
      throw new ResilientValuationError({
        code: 'FALLBACK_FAILED',
        message: 'Primary operation and fallback both failed',
        severity: 'critical',
        recoverable: false,
        context: { originalError: error, fallbackError }
      });
    }
  }

  throw new ResilientValuationError(classifiedError);
}

/**
 * Classify errors by type and severity
 */
function classifyValuationError(error: any): ValuationError {
  const errorMessage = error?.message || error?.toString() || 'Unknown error';
  const errorCode = error?.code || 'UNKNOWN';

  // Network/API errors
  if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('timeout')) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Network connectivity issue - using fallback data',
      severity: 'medium',
      recoverable: true,
      fallbackStrategy: 'cached_or_estimated_data'
    };
  }

  // OpenAI API errors
  if (errorMessage.includes('OpenAI') || errorMessage.includes('rate limit') || errorCode === 'rate_limit_exceeded') {
    return {
      code: 'AI_SERVICE_ERROR',
      message: 'AI service temporarily unavailable - using alternative methods',
      severity: 'medium',
      recoverable: true,
      fallbackStrategy: 'market_data_or_estimation'
    };
  }

  // Database errors
  if (errorMessage.includes('supabase') || errorMessage.includes('database') || errorMessage.includes('relation')) {
    return {
      code: 'DATABASE_ERROR',
      message: 'Database connection issue - using local fallback',
      severity: 'high',
      recoverable: true,
      fallbackStrategy: 'local_storage_or_estimation'
    };
  }

  // Authentication errors
  if (errorMessage.includes('authentication') || errorMessage.includes('unauthorized') || errorCode === 'PGRST301') {
    return {
      code: 'AUTH_ERROR',
      message: 'Authentication issue - limited functionality available',
      severity: 'medium',
      recoverable: true,
      fallbackStrategy: 'anonymous_estimation'
    };
  }

  // VIN decoding errors
  if (errorMessage.includes('vin') || errorMessage.includes('decode')) {
    return {
      code: 'VIN_DECODE_ERROR',
      message: 'VIN decoding failed - using manual vehicle data',
      severity: 'low',
      recoverable: true,
      fallbackStrategy: 'manual_vehicle_data'
    };
  }

  // Market data errors
  if (errorMessage.includes('market') || errorMessage.includes('listings')) {
    return {
      code: 'MARKET_DATA_ERROR', 
      message: 'Market data unavailable - using estimated pricing',
      severity: 'medium',
      recoverable: true,
      fallbackStrategy: 'estimated_market_pricing'
    };
  }

  // Default classification
  return {
    code: 'UNKNOWN_ERROR',
    message: 'Unexpected error occurred - using emergency fallback',
    severity: 'high',
    recoverable: true,
    fallbackStrategy: 'emergency_estimation'
  };
}

/**
 * Generate emergency fallback valuation
 */
export async function generateEmergencyFallback(input: any): Promise<any> {
  console.log('🚨 [ErrorHandler] Generating emergency fallback valuation');
  
  const currentYear = new Date().getFullYear();
  const estimatedYear = input.year || (currentYear - 5);
  const baseValue = 25000; // Conservative base estimate
  
  // Simple depreciation calculation
  const depreciation = (currentYear - estimatedYear) * 2000;
  const finalValue = Math.max(5000, baseValue - depreciation);
  
  return {
    estimated_value: finalValue,
    base_value_source: 'emergency_fallback',
    confidence_score: 15,
    valuation_explanation: `Emergency valuation estimate for ${input.year || 'unknown year'} vehicle. This is a basic calculation due to service limitations. For accurate pricing, please try again later when all services are available.`,
    sources: ['emergency_fallback'],
    marketSearchStatus: 'error',
    fallbackReason: 'Critical system error - emergency estimate provided',
    timestamp: Date.now(),
    listings: [],
    listingCount: 0
  };
}
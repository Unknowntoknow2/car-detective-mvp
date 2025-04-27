
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  status: number;
};

// Enhanced API error categories
export enum ApiErrorType {
  NETWORK = 'network',
  AUTH = 'auth',
  VALIDATION = 'validation',
  NOT_FOUND = 'not_found',
  RATE_LIMIT = 'rate_limit',
  SERVER = 'server',
  UNKNOWN = 'unknown'
}

export type EnhancedApiError = {
  message: string;
  type: ApiErrorType;
  details?: string;
  originalError?: any;
};

/**
 * Handles API errors in a consistent way
 */
export function handleApiError(error: any): EnhancedApiError {
  console.error('API Error:', error);
  
  // Network error
  if (error instanceof TypeError && error.message.includes('network')) {
    return {
      message: 'Network connection error. Please check your internet connection.',
      type: ApiErrorType.NETWORK,
      originalError: error
    };
  }

  // Supabase specific error
  if (error?.message) {
    // Authentication
    if (error.message.includes('auth') || error.message.includes('JWT')) {
      return {
        message: 'Authentication error. Please sign in again.',
        type: ApiErrorType.AUTH,
        originalError: error
      };
    }
    
    // Not found
    if (error.message.includes('not found') || error.message.includes('404')) {
      return {
        message: 'Resource not found. The requested data doesn\'t exist.',
        type: ApiErrorType.NOT_FOUND,
        originalError: error
      };
    }
    
    // Rate limit
    if (error.message.includes('rate limit') || error.message.includes('429')) {
      return {
        message: 'Rate limit exceeded. Please try again later.',
        type: ApiErrorType.RATE_LIMIT,
        originalError: error
      };
    }
    
    // Server error
    if (error.message.includes('server error') || error.message.includes('500')) {
      return {
        message: 'Server error. Our team has been notified.',
        type: ApiErrorType.SERVER,
        originalError: error
      };
    }
  }
  
  // Generic fallback
  return {
    message: error?.message || 'An unexpected error occurred',
    type: ApiErrorType.UNKNOWN,
    originalError: error
  };
}

/**
 * Unified API function for consistent error handling
 */
export async function apiRequest<T = any>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  body?: any,
  options: { showToast?: boolean, toastMessage?: string } = {}
): Promise<ApiResponse<T>> {
  const { showToast = true, toastMessage } = options;
  
  try {
    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw {
        message: result.error || `Error: ${response.status}`,
        status: response.status
      };
    }
    
    if (showToast && toastMessage) {
      toast.success(toastMessage);
    }
    
    return {
      data: result,
      error: null,
      status: response.status
    };
  } catch (error) {
    const enhancedError = handleApiError(error);
    
    if (showToast) {
      toast.error(enhancedError.message);
    }
    
    return {
      data: null,
      error: enhancedError.message,
      status: (error as any)?.status || 500
    };
  }
}

/**
 * Wrapper for Supabase functions with improved error handling
 */
export async function invokeFunction<T = any>(
  functionName: string,
  body?: any,
  options: { showToast?: boolean, toastMessage?: string } = {}
): Promise<ApiResponse<T>> {
  const { showToast = true, toastMessage } = options;
  const loadingToast = showToast ? toast.loading(`Processing ${functionName.replace(/-/g, ' ')}...`) : null;
  
  try {
    const { data, error } = await supabase.functions.invoke(functionName, {
      body
    });
    
    if (loadingToast) {
      toast.dismiss(loadingToast);
    }
    
    if (error) {
      throw error;
    }
    
    if (showToast && toastMessage) {
      toast.success(toastMessage);
    }
    
    return {
      data,
      error: null,
      status: 200
    };
  } catch (error) {
    if (loadingToast) {
      toast.dismiss(loadingToast);
    }
    
    const enhancedError = handleApiError(error);
    
    if (showToast) {
      toast.error(enhancedError.message);
    }
    
    return {
      data: null,
      error: enhancedError.message,
      status: 500
    };
  }
}


import { toast } from 'sonner';
import { ApiErrorType } from '@/utils/api-utils';

export function handleApiError(error: unknown, context: string) {
  console.error(`API Error in ${context}:`, error);
  
  const message = error instanceof Error ? error.message : "An unexpected error occurred";
  const type = (error as any)?.type || ApiErrorType.UNKNOWN;
  
  switch (type) {
    case ApiErrorType.NETWORK:
      toast.error("Network connection error. Please check your connection.");
      break;
    case ApiErrorType.AUTH:
      toast.error("Authentication error. Please sign in again.");
      break;
    case ApiErrorType.NOT_FOUND:
      toast.error("Resource not found. Please try again.");
      break;
    case ApiErrorType.RATE_LIMIT:
      toast.error("Too many requests. Please wait a moment and try again.");
      break;
    case ApiErrorType.SERVER:
      toast.error("Server error. Our team has been notified.");
      break;
    default:
      toast.error(message);
  }
  
  return {
    error: message,
    type,
    handled: true
  };
}

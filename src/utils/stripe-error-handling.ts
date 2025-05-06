
/**
 * Utility for handling Stripe-related errors with better error messages
 */

type StripeErrorType = 
  | 'authentication_error'
  | 'api_connection_error'
  | 'api_error'
  | 'card_error'
  | 'invalid_request_error'
  | 'rate_limit_error'
  | 'validation_error'
  | 'session_creation_error'
  | 'webhook_error'
  | 'unknown_error';

interface StripeErrorDetails {
  message: string;
  actionable?: string;
  recoverable: boolean;
}

const errorMessages: Record<StripeErrorType, StripeErrorDetails> = {
  authentication_error: {
    message: "Authentication with Stripe failed",
    actionable: "Please try again later or contact support",
    recoverable: false
  },
  api_connection_error: {
    message: "Could not connect to Stripe",
    actionable: "Please check your internet connection and try again",
    recoverable: true
  },
  api_error: {
    message: "Stripe service error",
    actionable: "Please try again later",
    recoverable: true
  },
  card_error: {
    message: "Your card was declined",
    actionable: "Please try a different payment method",
    recoverable: true
  },
  invalid_request_error: {
    message: "Invalid payment request",
    actionable: "Please try again with correct information",
    recoverable: true
  },
  rate_limit_error: {
    message: "Too many requests to payment service",
    actionable: "Please wait a moment and try again",
    recoverable: true
  },
  validation_error: {
    message: "Invalid payment information",
    actionable: "Please check your payment details and try again",
    recoverable: true
  },
  session_creation_error: {
    message: "Could not create checkout session",
    actionable: "Please try again later",
    recoverable: true
  },
  webhook_error: {
    message: "Payment confirmation error",
    actionable: "Your payment may still be processing",
    recoverable: false
  },
  unknown_error: {
    message: "An unexpected error occurred",
    actionable: "Please try again later",
    recoverable: true
  }
};

export function getStripeErrorDetails(error: any): StripeErrorDetails {
  if (!error) {
    return errorMessages.unknown_error;
  }

  const errorMessage = error.message?.toLowerCase() || '';
  
  // Map error message patterns to error types
  if (errorMessage.includes('authentication') || errorMessage.includes('api key')) {
    return errorMessages.authentication_error;
  } else if (errorMessage.includes('connection') || errorMessage.includes('network')) {
    return errorMessages.api_connection_error;
  } else if (errorMessage.includes('card') || errorMessage.includes('payment method')) {
    return errorMessages.card_error;
  } else if (errorMessage.includes('invalid') || errorMessage.includes('parameter')) {
    return errorMessages.invalid_request_error;
  } else if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
    return errorMessages.rate_limit_error;
  } else if (errorMessage.includes('validate') || errorMessage.includes('validation')) {
    return errorMessages.validation_error;
  } else if (errorMessage.includes('session') && errorMessage.includes('create')) {
    return errorMessages.session_creation_error;
  } else if (errorMessage.includes('webhook')) {
    return errorMessages.webhook_error;
  } else if (errorMessage.includes('stripe')) {
    return errorMessages.api_error;
  }
  
  return errorMessages.unknown_error;
}

export function formatStripeError(error: any): string {
  const details = getStripeErrorDetails(error);
  return details.actionable 
    ? `${details.message}. ${details.actionable}.` 
    : details.message;
}

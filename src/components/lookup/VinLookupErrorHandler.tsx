
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Edit3, Wifi, Database } from 'lucide-react';

interface VinLookupErrorHandlerProps {
  error: string;
  errorType?: 'invalid_vin' | 'api_error' | 'not_found' | 'network_error';
  onRetry?: () => void;
  onManualEntry?: () => void;
  isRetrying?: boolean;
}

export function VinLookupErrorHandler({
  error,
  errorType,
  onRetry,
  onManualEntry,
  isRetrying = false
}: VinLookupErrorHandlerProps) {
  const getErrorIcon = () => {
    switch (errorType) {
      case 'network_error':
        return <Wifi className="h-4 w-4" />;
      case 'not_found':
        return <Database className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getErrorTitle = () => {
    switch (errorType) {
      case 'invalid_vin':
        return 'Invalid VIN Format';
      case 'not_found':
        return 'VIN Not Found';
      case 'network_error':
        return 'Connection Error';
      case 'api_error':
        return 'Service Unavailable';
      default:
        return 'Lookup Error';
    }
  };

  const getErrorActions = () => {
    switch (errorType) {
      case 'invalid_vin':
        return (
          <p className="text-sm text-muted-foreground mt-2">
            Please check that the VIN is exactly 17 characters and contains no I, O, or Q.
          </p>
        );
      case 'not_found':
        return (
          <div className="mt-3 space-y-2">
            <p className="text-sm text-muted-foreground">
              This VIN is not in our database. You can enter vehicle details manually for valuation.
            </p>
            {onManualEntry && (
              <Button variant="outline" size="sm" onClick={onManualEntry}>
                <Edit3 className="h-3 w-3 mr-2" />
                Enter Details Manually
              </Button>
            )}
          </div>
        );
      case 'network_error':
        return (
          <div className="mt-3 space-y-2">
            <p className="text-sm text-muted-foreground">
              Please check your internet connection and try again.
            </p>
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry} disabled={isRetrying}>
                {isRetrying ? (
                  <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3 mr-2" />
                )}
                Try Again
              </Button>
            )}
          </div>
        );
      default:
        return (
          <div className="mt-3 flex gap-2">
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry} disabled={isRetrying}>
                {isRetrying ? (
                  <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3 mr-2" />
                )}
                Try Again
              </Button>
            )}
            {onManualEntry && (
              <Button variant="outline" size="sm" onClick={onManualEntry}>
                <Edit3 className="h-3 w-3 mr-2" />
                Manual Entry
              </Button>
            )}
          </div>
        );
    }
  };

  return (
    <Alert className="border-red-200 bg-red-50">
      <div className="flex items-start gap-2">
        <div className="text-red-600 mt-0.5">
          {getErrorIcon()}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-red-800">{getErrorTitle()}</h4>
          <AlertDescription className="text-red-700 mt-1">
            {error}
          </AlertDescription>
          {getErrorActions()}
        </div>
      </div>
    </Alert>
  );
}

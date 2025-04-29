
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { errorHandler } from '@/utils/error-handling';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  context?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Enhanced error boundary with more detailed error reporting and reset options
 */
export class EnhancedErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Handle the error using our centralized error handler
    const context = this.props.context || 'ErrorBoundary';
    errorHandler.handle(error, context);
    
    this.setState({ errorInfo });
    
    // Report to error monitoring service
    errorHandler.report({
      message: error.message,
      context,
      severity: error.name === 'SyntaxError' 
        ? 'critical' as any 
        : 'error' as any,
      timestamp: new Date()
    });
  }

  private resetError = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null 
    });
    
    if (this.props.onReset) {
      this.props.onReset();
    }
  }

  private goHome = () => {
    window.location.href = '/';
  }

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="p-6 border border-red-200 rounded-lg bg-red-50 shadow-sm">
          <div className="flex flex-col items-center sm:items-start sm:flex-row gap-4">
            <AlertTriangle className="h-10 w-10 text-red-600 flex-shrink-0" />
            
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-semibold text-red-800 mb-2">
                Something went wrong
              </h2>
              
              <div className="mb-4 space-y-2">
                <p className="text-red-700">
                  We encountered an unexpected error while rendering this component.
                </p>
                {process.env.NODE_ENV !== 'production' && this.state.error && (
                  <details className="mt-2 text-sm">
                    <summary className="text-red-700 cursor-pointer font-medium">
                      Error Details
                    </summary>
                    <pre className="mt-2 max-w-full overflow-auto p-2 rounded bg-red-100 text-red-900 text-xs">
                      {this.state.error.toString()}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                )}
              </div>
              
              <div className="flex gap-3 justify-center sm:justify-start">
                <Button 
                  onClick={this.resetError}
                  variant="outline"
                  className="border-red-300 hover:bg-red-100 inline-flex items-center"
                  size="sm"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                
                <Button 
                  onClick={this.goHome}
                  variant="outline"
                  className="border-red-300 hover:bg-red-100 inline-flex items-center"
                  size="sm"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go to Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default EnhancedErrorBoundary;

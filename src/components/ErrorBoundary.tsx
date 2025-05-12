
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state = { 
    hasError: false, 
    error: null 
  };

  static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error 
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error);
    console.error("Component stack trace:", errorInfo.componentStack);
    
    // Here you could add error reporting to a service like Sentry
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI if provided, otherwise show default error message
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="p-6 rounded-lg bg-red-50 border border-red-200">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Something went wrong</h2>
          <p className="text-red-600 mb-4">
            There was an error loading this component.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

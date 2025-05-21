
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  context?: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-800">
          <h3 className="font-medium mb-2">Something went wrong</h3>
          <p className="text-sm text-red-600">
            {this.props.context ? `Error in ${this.props.context}: ` : ''}
            {this.state.error?.message || 'An unknown error occurred'}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

<<<<<<< HEAD

import React, { Component, ErrorInfo, ReactNode } from 'react';
=======
import React from "react";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

<<<<<<< HEAD
interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

=======
export class ErrorBoundary extends React.Component<Props, State> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Component Error:", error);
    console.error("Error Stack:", errorInfo.componentStack);
  }

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
<<<<<<< HEAD
        <div className="p-4 border border-red-200 bg-red-50 rounded-md">
          <h2 className="text-sm font-medium text-red-700">Something went wrong</h2>
          <p className="text-xs text-red-600 mt-1">
            {this.state.error?.message || 'An error occurred in this component'}
          </p>
=======
        <div style={{ padding: 20, background: "#fee", color: "#900" }}>
          <h2>Component Error:</h2>
          <pre>{this.state.error.message}</pre>
          <pre>{this.state.error.stack}</pre>
          <button
            onClick={() => this.setState({ error: null })}
            className="bg-primary text-white px-4 py-2 mt-4 rounded"
          >
            Try Again
          </button>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

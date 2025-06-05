
import React from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Component Error:", error);
    console.error("Error Stack:", errorInfo.componentStack);
  }

  render() {
    if (this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
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
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

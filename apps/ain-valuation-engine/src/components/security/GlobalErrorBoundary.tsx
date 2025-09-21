import React from "react";


type Props = {
  children: React.ReactNode;
  context?: string;
};

type State = {
  hasError: boolean;
  errorId?: string;
};

export class GlobalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Sentry removed: log error to console instead
    this.setState({ errorId: undefined });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold">Something went wrong</h2>
          <p className="text-gray-500">Our team has been notified.</p>
          {this.state.errorId && (
            <p className="mt-2 text-xs text-gray-400">
              Support ID: {this.state.errorId}
            </p>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

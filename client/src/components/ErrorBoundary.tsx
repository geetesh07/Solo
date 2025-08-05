import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h1 className="text-xl font-bold text-white font-['Orbitron'] mb-4">
              Application Error
            </h1>
            <p className="text-gray-300 mb-6">
              Something went wrong. This might be a Firebase configuration issue in deployment.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Reload Application
            </button>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-gray-400 text-sm cursor-pointer">Technical Details</summary>
                <pre className="text-red-300 text-xs mt-2 overflow-auto max-h-32">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
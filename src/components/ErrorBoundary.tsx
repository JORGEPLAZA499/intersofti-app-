import React, { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="p-6 text-center text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-2">Something went wrong</p>
          <p>Please disable browser extensions (e.g. MetaMask) and reload the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 underline text-primary"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

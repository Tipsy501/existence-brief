import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Global error boundary to prevent UI crashes.
 * Log errors silently and show a friendly loading/fallback state.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console only, avoid alerting the user with raw technical data
    console.log('[ErrorBoundary] Unhandled exception caught:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Platform Synchronizing</h2>
          <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
            The strategic engine is recalibrating your roadmap. This temporary alignment usually resolves within seconds.
          </p>
          <button 
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 text-xs font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors"
          >
            Refresh Interface
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

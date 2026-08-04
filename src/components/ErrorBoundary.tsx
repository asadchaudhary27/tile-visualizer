import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught rendering error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#050505] text-white/80 p-8 text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-2">
            <AlertTriangle className="text-red-400" size={32} />
          </div>
          <h2 className="text-lg font-bold uppercase tracking-widest text-white">Render Error</h2>
          <p className="text-sm text-white/50 max-w-md">
            {this.props.fallbackMessage || "An error occurred while rendering the scene. This might be due to a missing asset or WebGL context loss."}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest transition-colors"
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

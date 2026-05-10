import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = "An unexpected error occurred in the linguistic matrix.";
      
      try {
        if (this.state.error?.message) {
          try {
            const parsed = JSON.parse(this.state.error.message);
            if (parsed.error) {
              errorMessage = `Protocol Error: ${parsed.error}`;
            } else {
              errorMessage = this.state.error.message;
            }
          } catch (e) {
            // Not JSON, use raw message
            errorMessage = this.state.error.message;
          }
        }
      } catch (e) {
        errorMessage = "A critical failure occurred in the linguistic matrix.";
      }

      return (
        <div className="min-h-screen bg-obsidian flex items-center justify-center p-6">
          <div className="glass-panel p-12 rounded-[40px] border border-cyber-pink/20 max-w-lg w-full text-center">
            <div className="w-20 h-20 bg-cyber-pink/10 rounded-full flex items-center justify-center text-cyber-pink mx-auto mb-8 border border-cyber-pink/20">
              <AlertTriangle size={40} />
            </div>
            <h2 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase">System Breach</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              {errorMessage}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center space-x-3 w-full bg-white text-obsidian py-5 rounded-2xl font-black shadow-2xl hover:scale-[1.02] transition-all uppercase tracking-widest text-sm"
            >
              <RefreshCw size={18} />
              <span>Reboot System</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

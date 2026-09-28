import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  /**
   * Rendered instead of the full-page error state. Used to scope a failure to
   * one WebGL canvas so a driver or model problem degrades that section
   * instead of blanking the whole site.
   */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) return this.props.fallback;
      return (
        <div style={{ 
          background: '#0a0b14', 
          color: '#3b82f6', 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          fontFamily: 'monospace',
          textAlign: 'center',
          padding: '20px'
        }}>
          <h1 style={{ color: '#f97316' }}>JUTSU FAILED</h1>
          <p>The application encountered a critical error.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Restart Chakra
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

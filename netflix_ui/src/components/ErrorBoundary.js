import React from "react";
import "./ErrorBoundary.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console (in production, send to monitoring service)
    console.error("ErrorBoundary caught an error:", error);
    console.error("Error info:", errorInfo);

    this.setState({ errorInfo });

    // TODO: Send to error monitoring service like Sentry
    // Sentry.captureException(error, { extra: errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <div className="error-boundary__content">
            <div className="error-boundary__icon">⚠️</div>
            <h1 className="error-boundary__title">
              Oops! Something went wrong
            </h1>
            <p className="error-boundary__message">
              We're having trouble loading this content. Please try again.
            </p>

            <div className="error-boundary__actions">
              <button
                className="error-boundary__btn primary"
                onClick={this.handleRetry}
              >
                Try Again
              </button>
              <button
                className="error-boundary__btn secondary"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </button>
            </div>

            {/* Show error details in development */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="error-boundary__details">
                <summary>Error Details (Development Only)</summary>
                <pre>{this.state.error.toString()}</pre>
                <pre>{this.state.errorInfo?.componentStack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

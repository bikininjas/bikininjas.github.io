import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" aria-live="assertive">
          <h2>{this.props.errorMessage || 'Something went wrong.'}</h2>
          {process.env.NODE_ENV === 'development' && (
            <details>
              <summary>Error details</summary>
              <pre>{this.state.error?.toString()}</pre>
              <pre>{this.state.errorInfo?.componentStack}</pre>
            </details>
          )}
          <button onClick={() => window.location.reload()}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
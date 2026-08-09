import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // In a real deployment this is where you'd send the error to a logging
    // service (Sentry, LogRocket, etc.) - console.error is enough for a portfolio project.
    console.error("Uncaught error in component tree:", error, errorInfo);
  }

  handleReload = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-cine-bg px-6">
          <div className="text-center">
            <h1 className="font-display text-2xl tracking-wide text-cine-text">
              Something went wrong
            </h1>
            <p className="mt-2 text-cine-muted max-w-sm mx-auto">
              An unexpected error interrupted the screening. Try reloading the page.
            </p>
            <button
              onClick={this.handleReload}
              className="inline-block mt-6 text-sm font-medium bg-cine-gold hover:bg-cine-goldSoft text-cine-bg px-5 py-2.5 rounded-md transition-colors"
            >
              Reload MovieSphere
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

import * as React from 'react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode; // Optional custom fallback UI
    showDetails?: boolean; // Option to show technical details
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    errorInfo?: React.ErrorInfo;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error("ErrorBoundary caught an error", error, errorInfo);
        this.setState({ error, errorInfo });

        // You could also log errors to an error tracking service here
        // logErrorToService(error, errorInfo);
    }

    render(): React.ReactNode {
        if (!this.state.hasError) {
            return this.props.children;
        }

        // Return custom fallback if provided
        if (this.props.fallback) {
            return this.props.fallback;
        }

        // Default enhanced error UI
        return (
            <div className="w-full mx-auto p-4 bg-red-50 border border-red-200 rounded-lg flex justify-center items-center flex-col">
                <div className="text-center mb-4">
                    <h2 className="text-xl font-bold text-red-600">Oops! Something went wrong</h2>
                    <p className="text-red-500 mt-2">
                        We're sorry for the inconvenience. Our team has been notified.
                    </p>
                </div>

                {this.props.showDetails && this.state.error && (
                    <div className="mt-4 p-3 bg-white border border-red-100 rounded text-sm">
                        <h3 className="font-semibold text-red-700">Error Details:</h3>
                        <p className="mt-1 text-red-600">{this.state.error.message}</p>

                        {this.state.errorInfo?.componentStack && (
                            <details className="mt-2">
                                <summary className="text-red-600 cursor-pointer">
                                    Component Stack
                                </summary>
                                <pre className="mt-1 p-2 bg-gray-50 overflow-auto text-xs">
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}
                    </div>
                )}

                <div className="mt-4 text-center">
                    <button
                        onClick={() => {
                            // Optionally reload the app or reset state
                            window.location.reload();
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }
}

export default ErrorBoundary;
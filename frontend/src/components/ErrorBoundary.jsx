import { Component } from "react";
import { AlertTriangleIcon } from "lucide-react";

// catches render errors so a crash in one page shows a message instead of a blank screen
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, info) {
        console.error("Unhandled UI error:", error, info.componentStack);
    }

    render() {
        if (!this.state.error) return this.props.children;

        return (
            <div className="min-h-screen bg-base-300 flex items-center justify-center p-4">
                <div className="card bg-base-100 shadow-xl max-w-md w-full">
                    <div className="card-body items-center text-center">
                        <AlertTriangleIcon className="size-12 text-error mb-2" />
                        <h2 className="card-title text-2xl">Something went wrong</h2>
                        <p className="text-base-content/70 break-words">{this.state.error.message}</p>
                        <div className="card-actions mt-4">
                            <button className="btn btn-primary" onClick={() => window.location.assign("/dashboard")}>
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ErrorBoundary;

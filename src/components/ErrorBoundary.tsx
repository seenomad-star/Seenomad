import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-10 font-sans min-h-screen bg-background flex flex-col items-center justify-center text-center">
                    <div className="max-w-2xl w-full bg-card border border-border rounded-3xl p-8 shadow-2xl">
                        <h1 className="text-3xl font-black mb-4 bg-gradient-to-r from-destructive to-orange-600 bg-clip-text text-transparent uppercase tracking-tight">
                            Critical OS Error Detected
                        </h1>
                        <p className="text-muted-foreground mb-6">
                            A core module has encountered an unrecoverable state. Please diagnostic data below:
                        </p>
                        <pre className="bg-muted/50 p-6 rounded-2xl overflow-auto text-left text-xs font-mono text-destructive border border-destructive/20 whitespace-pre-wrap">
                            {this.state.error && this.state.error.toString()}
                            {"\n\nSTACK TRACE:\n"}
                            {this.state.error && this.state.error.stack}
                        </pre>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-8 px-6 py-2 bg-primary text-primary-foreground rounded-xl font-bold hover:scale-105 transition-transform"
                        >
                            Reboot Typing OS
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

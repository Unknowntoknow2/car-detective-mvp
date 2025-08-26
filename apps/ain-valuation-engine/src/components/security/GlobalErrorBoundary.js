import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
export class GlobalErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(_) {
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        // Sentry removed: log error to console instead
        console.error("GlobalErrorBoundary caught error:", error, errorInfo);
        this.setState({ errorId: undefined });
    }
    render() {
        if (this.state.hasError) {
            return (_jsxs("div", { className: "p-6 text-center", children: [_jsx("h2", { className: "text-xl font-bold", children: "Something went wrong" }), _jsx("p", { className: "text-gray-500", children: "Our team has been notified." }), this.state.errorId && (_jsxs("p", { className: "mt-2 text-xs text-gray-400", children: ["Support ID: ", this.state.errorId] }))] }));
        }
        return this.props.children;
    }
}

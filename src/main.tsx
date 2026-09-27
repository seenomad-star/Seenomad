import { createRoot } from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async';
import App from "./App.tsx";
import "./styles/index.css";
import "./i18n";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { initSentry } from "./lib/sentry";

// Initialize observability for production
initSentry();

const root = document.getElementById("root");
if (!root) {
    throw new Error("Root element not found");
}

createRoot(root).render(
    <ErrorBoundary>
        <HelmetProvider>
            <App />
        </HelmetProvider>
    </ErrorBoundary>
);

<<<<<<< HEAD

import React from 'react';
import ReactDOM from 'react-dom/client';
import { initSentry } from './lib/sentry';
import App from './App';
import './index.css';
import { AppProviders } from './providers/AppProviders';
import { loadFonts } from './lib/fonts';
import { setupTrackingErrorHandler } from './utils/errorHandling';

// Initialize Sentry with proper error handling
initSentry();

// Load the Inter font from CDN
loadFonts();

// Set up error handling for third-party scripts
if (typeof window !== 'undefined') {
  setupTrackingErrorHandler();
}

// Suppress React Router future flags warnings if enabled in env
if (import.meta.env.VITE_ROUTER_FUTURE_FLAGS) {
  (window as any).__reactRouterFutureFlags = {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  };
}

// Create a robust error boundary for the root
const renderApp = () => {
  try {
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <AppProviders>
          <App />
        </AppProviders>
      </React.StrictMode>,
    );
  } catch (error) {
    console.error('Failed to render application:', error);
    
    // Fallback render in case of critical error
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <h2>Application Error</h2>
          <p>We're sorry, but the application failed to load properly.</p>
          <p>Please try refreshing the page.</p>
        </div>
      `;
    }
  }
};

renderApp();
=======
// ✅ src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

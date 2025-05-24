
import React from 'react';
import ReactDOM from 'react-dom/client';
import { initSentry } from './lib/sentry';
import App from './App';
import './index.css';
import { AppProviders } from './providers/AppProviders';
import { setupTrackingErrorHandler, enableReactDevMode } from './utils/errorHandling';

// Initialize the Sentry with proper error handling
initSentry();

// Setup error handling for third-party scripts
setupTrackingErrorHandler();

// Enable React dev mode for detailed errors in development
if (process.env.NODE_ENV === 'development') {
  enableReactDevMode();
}

// Suppress React Router future flags warnings if enabled in env
if (import.meta.env.VITE_ROUTER_FUTURE_FLAGS) {
  window.__reactRouterFutureFlags = {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  };
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
);

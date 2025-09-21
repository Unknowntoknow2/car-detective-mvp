
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProviders } from './providers/AppProviders';
import './styles/index.css';
import { validateAINConfiguration } from './utils/buildTimeChecks';
import './utils/startupValidation'; // Enforce AIN in production
import './utils/console-cleanup'; // Initialize comprehensive console cleanup

const renderApp = () => {
  try {
    // Validate AIN configuration at app startup
    validateAINConfiguration();
    
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('Root element not found');
    }

    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <AppProviders>
          <App />
        </AppProviders>
      </React.StrictMode>
    );

    // Notify parent preview that app connected
    try {
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'PREVIEW_CONNECTED', timestamp: Date.now() }, '*');
      }
    } catch (e) {
      console.warn('Preview connected signal failed:', e);
    }
  } catch (error) {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center; font-family: system-ui;">
          <h2>Application Error</h2>
          <p>We're sorry, but the application failed to load properly.</p>
          <p>Please try refreshing the page.</p>
        </div>
      `;
    }
  }
};

renderApp();

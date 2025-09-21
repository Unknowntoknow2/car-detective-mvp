
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProviders } from './providers/AppProviders';
import './styles/index.css';
import { validateAINConfiguration } from './utils/buildTimeChecks';
import './utils/startupValidation'; // Enforce AIN in production
import { setupPreviewErrorHandling } from './utils/preview-diagnostics';

// Setup preview environment error handling
setupPreviewErrorHandling();

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

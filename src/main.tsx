
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
    console.log('🚀 Car Detective starting...');
    
    // Validate AIN configuration at app startup (non-blocking)
    try {
      validateAINConfiguration();
    } catch (validationError) {
      console.warn('⚠️ AIN validation warning (non-critical):', validationError);
      // Continue loading the app anyway
    }
    
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('Root element not found');
    }

    console.log('✅ Rendering app...');
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <AppProviders>
          <App />
        </AppProviders>
      </React.StrictMode>
    );

    console.log('✅ App rendered successfully');

    // Notify parent preview that app connected
    try {
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'PREVIEW_CONNECTED', timestamp: Date.now() }, '*');
      }
    } catch (e) {
      console.warn('Preview connected signal failed:', e);
    }
  } catch (error) {
    console.error('❌ Application failed to load:', error);
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center; font-family: system-ui;">
          <h2>Application Error</h2>
          <p>We're sorry, but the application failed to load properly.</p>
          <p style="color: #666; font-size: 14px;">Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
          <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; cursor: pointer;">
            Refresh Page
          </button>
        </div>
      `;
    }
  }
};

renderApp();

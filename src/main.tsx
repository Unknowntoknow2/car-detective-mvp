
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProviders } from './providers/AppProviders';
import { ThemeProvider } from '@/components/theme/ThemeProvider'; // ✅ Use the correct theme provider
import './styles/index.css';

const renderApp = () => {
  try {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('Root element not found');
    }

    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <ThemeProvider> {/* ✅ Wrap the entire app */}
          <AppProviders>
            <App />
          </AppProviders>
        </ThemeProvider>
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to render application:', error);
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

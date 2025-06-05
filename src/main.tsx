// ✅ src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AppProviders } from './providers/AppProviders';
import { AuthProvider } from '@/components/auth/AuthContext';
import { initSentry } from './lib/sentry';
import { loadFonts } from './lib/fonts';
import { setupTrackingErrorHandler } from './utils/errorHandling';
import './index.css';

// ✅ Initialize third-party tools
initSentry();
loadFonts();

if (typeof window !== 'undefined') {
  setupTrackingErrorHandler();
}

// ✅ Enable React Router future flags
if (import.meta.env.VITE_ROUTER_FUTURE_FLAGS) {
  (window as any).__reactRouterFutureFlags = {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  };
}

// ✅ Render the app
const renderApp = () => {
  try {
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <BrowserRouter>
          <AuthProvider>
            <AppProviders>
              <App />
            </AppProviders>
          </AuthProvider>
        </BrowserRouter>
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to render application:', error);
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

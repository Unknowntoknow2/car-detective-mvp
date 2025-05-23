
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AppProviders } from './providers/AppProviders';
import { setupTrackingErrorHandler, enableReactDevMode } from './utils/errorHandling';

// Setup error handling for third-party scripts
setupTrackingErrorHandler();

// Enable React dev mode for detailed errors
if (process.env.NODE_ENV === 'development') {
  enableReactDevMode();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProviders>
        <App />
      </AppProviders>
    </BrowserRouter>
  </React.StrictMode>,
);

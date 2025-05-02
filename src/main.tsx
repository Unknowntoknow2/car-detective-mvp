
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Import global styles
import '@/styles/globals.css';
import '@/styles/components/forms.css';
import '@/styles/components/cards.css';
import '@/styles/mobile-optimizations.css'; // Add our mobile optimizations

// Add viewport meta tag programmatically to ensure proper mobile rendering
const metaViewport = document.createElement('meta');
metaViewport.name = 'viewport';
metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
document.head.appendChild(metaViewport);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

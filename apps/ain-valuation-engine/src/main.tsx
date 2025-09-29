import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom';

// Startup health check
try {
  console.log('🚀 App starting...');
  
  // Optional: Check AIN configuration (non-blocking)
  if (import.meta.env.USE_AIN_VALUATION === 'true') {
    console.log('✅ AIN integration enabled');
  } else {
    console.log('ℹ️ AIN integration disabled - using fallback valuation');
  }
} catch (error) {
  console.warn('⚠️ Startup check failed:', error);
  // Continue anyway - don't block app startup
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

console.log('✅ App rendered successfully');

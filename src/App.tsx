
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { ReferralProvider } from './contexts/ReferralContext';
import router from './router';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ReferralProvider>
          <RouterProvider router={router} />
        </ReferralProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;

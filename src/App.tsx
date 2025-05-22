
import React from 'react';
import { Route, Routes, useRoutes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import RegisterPage from './pages/auth/RegisterPage';
import DealerSignupPage from './pages/auth/DealerSignupPage';
import UserDashboardPage from './pages/UserDashboardPage';
import ValuationPage from './pages/ValuationPage';
import ValuationResultPage from './pages/ValuationResultPage';
import PremiumValuationPage from './pages/PremiumValuationPage';
import MyValuationsPage from './pages/MyValuationsPage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import PremiumSuccessPage from './pages/PremiumSuccessPage';
import LoginUserPage from './pages/auth/LoginUserPage';
import LoginDealerPage from './pages/auth/LoginDealerPage';
import routes from './router'; // Import routes from router.tsx

function App() {
  // Use the routes defined in router.tsx
  const appRoutes = useRoutes(routes);

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          {appRoutes}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;


import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import DealerLayout from './layouts/DealerLayout';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import VinLookupPage from './pages/VinLookupPage';
import PlateLookupPage from './pages/PlateLookupPage';
import LookupPage from './pages/LookupPage';
import SignInPage from './pages/auth/SignInPage';
import SignUpPage from './pages/auth/SignUpPage';
import DealerDashboardPage from './pages/dealer/DealerDashboardPage';
import AccessDeniedPage from './pages/AccessDeniedPage';
import PremiumSuccessPage from './pages/PremiumSuccessPage';

// Guards
import DealerGuard from './guards/DealerGuard';
import RoleGuard from './guards/RoleGuard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/valuation/vin" element={<VinLookupPage />} />
        <Route path="/valuation/plate" element={<PlateLookupPage />} />
        <Route path="/lookup" element={<LookupPage />} />
        
        {/* Auth routes */}
        <Route path="/auth/signin" element={<SignInPage />} />
        <Route path="/auth/signup" element={<SignUpPage />} />
        
        {/* Protected routes */}
        <Route path="/premium-success" element={<PremiumSuccessPage />} />
        <Route path="/access-denied" element={<AccessDeniedPage />} />
      </Route>
      
      {/* Dealer routes */}
      <Route 
        path="/dealer/*" 
        element={
          <RoleGuard allowedRoles={['dealer', 'admin']}>
            <DealerLayout>
              <DealerDashboardPage />
            </DealerLayout>
          </RoleGuard>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;


import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Suspense } from 'react';

// NOTE: This file is currently disabled as we're using router.tsx instead
// We're keeping this file as a reference for future development
/* 
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Suspense } from 'react';

// Core pages - commented out as these files don't exist yet
// const HomePage = React.lazy(() => import('./pages/HomePage'));
// const LoginPage = React.lazy(() => import('./pages/LoginPage'));
// const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
// const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
// const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// Valuation pages - commented out as these files don't exist yet
// const VINLookupPage = React.lazy(() => import('./pages/lookup/VINLookupPage'));
// const PlateLookupPage = React.lazy(() => import('./pages/lookup/PlateLookupPage'));
// const ManualLookupPage = React.lazy(() => import('./pages/lookup/ManualLookupPage'));
// const ValuationResultPage = React.lazy(() => import('./pages/ValuationResultPage'));
// const PremiumValuationPage = React.lazy(() => import('./pages/PremiumValuationPage'));
// const CheckoutSuccessPage = React.lazy(() => import('./pages/CheckoutSuccessPage'));

// Dashboard pages - commented out as these files don't exist yet
// const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
// const MyValuationsPage = React.lazy(() => import('./pages/MyValuationsPage'));

// Admin pages - commented out as these files don't exist yet
// const AdminPage = React.lazy(() => import('./pages/AdminPage'));

// QA Dashboard 
const QADashboardPage = React.lazy(() => import('./modules/qa-dashboard/page'));

// Layouts - commented out as these files don't exist yet
// const DefaultLayout = React.lazy(() => import('./layouts/DefaultLayout'));
// const AuthLayout = React.lazy(() => import('./layouts/AuthLayout'));
// const DashboardLayout = React.lazy(() => import('./layouts/DashboardLayout'));
// const AdminLayout = React.lazy(() => import('./layouts/AdminLayout'));
*/

const AppRoutes = () => {
  return null; // Disabled for now
  /* 
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        // Routes removed as they reference non-existent files
      </Routes>
    </Suspense>
  );
  */
};

export default AppRoutes;

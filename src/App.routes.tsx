
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Suspense } from 'react';

// Core pages
const HomePage = React.lazy(() => import('./pages/HomePage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// Valuation pages
const VINLookupPage = React.lazy(() => import('./pages/lookup/VINLookupPage'));
const PlateLookupPage = React.lazy(() => import('./pages/lookup/PlateLookupPage'));
const ManualLookupPage = React.lazy(() => import('./pages/lookup/ManualLookupPage'));
const ValuationResultPage = React.lazy(() => import('./pages/ValuationResultPage'));
const PremiumValuationPage = React.lazy(() => import('./pages/PremiumValuationPage'));
const CheckoutSuccessPage = React.lazy(() => import('./pages/CheckoutSuccessPage'));

// Dashboard pages
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const MyValuationsPage = React.lazy(() => import('./pages/MyValuationsPage'));

// Admin pages
const AdminPage = React.lazy(() => import('./pages/AdminPage'));

// QA Dashboard 
const QADashboardPage = React.lazy(() => import('./modules/qa-dashboard/page'));

// Layouts
const DefaultLayout = React.lazy(() => import('./layouts/DefaultLayout'));
const AuthLayout = React.lazy(() => import('./layouts/AuthLayout'));
const DashboardLayout = React.lazy(() => import('./layouts/DashboardLayout'));
const AdminLayout = React.lazy(() => import('./layouts/AdminLayout'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Public routes */}
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/lookup/vin" element={<VINLookupPage />} />
          <Route path="/lookup/plate" element={<PlateLookupPage />} />
          <Route path="/lookup/manual" element={<ManualLookupPage />} />
          <Route path="/valuation-result/:valuationId" element={<ValuationResultPage />} />
          <Route path="/premium/:valuationId" element={<PremiumValuationPage />} />
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          
          {/* QA Dashboard */}
          <Route path="/qa" element={<QADashboardPage />} />
        </Route>

        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Dashboard routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/valuations" element={<MyValuationsPage />} />
          <Route path="/dashboard/profile" element={<ProfilePage />} />
        </Route>

        {/* Admin routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        {/* Redirects */}
        <Route path="/valuation" element={<Navigate to="/lookup/vin" replace />} />
        <Route path="/valuation/start" element={<Navigate to="/lookup/vin" replace />} />
        
        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

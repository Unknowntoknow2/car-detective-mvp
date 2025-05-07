
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AuthGuard from './guards/AuthGuard';
import GuestGuard from './guards/GuestGuard';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LookupPage from './pages/LookupPage';
import ValuationDetailPage from './pages/ValuationDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import SettingsPage from './pages/SettingsPage';
import { AdminAnalyticsDashboard } from './components/admin/dashboard/AdminAnalyticsDashboard';

// ... additional imports and router configuration

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Public routes
      {
        index: true,
        element: <HomePage />,
      },
      // Auth routes
      {
        path: 'login',
        element: (
          <GuestGuard>
            <LoginPage />
          </GuestGuard>
        ),
      },
      // Dashboard routes
      {
        path: 'dashboard',
        element: (
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        ),
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: 'valuations/:id',
            element: <ValuationDetailPage />,
          },
          {
            path: 'settings',
            element: <SettingsPage />,
          },
          {
            path: 'admin/analytics',
            element: <AdminAnalyticsDashboard />,
          },
        ],
      },
      // 404 fallback
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

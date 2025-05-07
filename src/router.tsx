
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import AuthGuard from '@/guards/AuthGuard';
import GuestGuard from '@/guards/GuestGuard';
import VinLookupPage from '@/pages/VinLookupPage';
import LookupPage from '@/pages/LookupPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import { AdminAnalyticsDashboard } from '@/components/admin/dashboard/AdminAnalyticsDashboard';
import SettingsPage from '@/pages/SettingsPage';

const router = createBrowserRouter([
  // Auth routes
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: (
          <GuestGuard>
            <LoginPage />
          </GuestGuard>
        ),
      },
      {
        path: 'register',
        element: (
          <GuestGuard>
            <RegisterPage />
          </GuestGuard>
        ),
      },
      {
        path: '',
        element: <VinLookupPage />,
      },
      {
        path: 'lookup',
        element: <LookupPage />,
      },
      {
        path: 'lookup/:tab',
        element: <LookupPage />,
      },
    ],
  },
  // Dashboard routes
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        path: 'dashboard',
        element: (
          <AuthGuard>
            <AdminAnalyticsDashboard />
          </AuthGuard>
        ),
      },
      {
        path: 'settings',
        element: (
          <AuthGuard>
            <SettingsPage />
          </AuthGuard>
        ),
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}

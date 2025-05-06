
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useAdminRole } from '@/hooks/useAdminRole';
import { AdminAnalyticsDashboard } from '@/components/admin/dashboard/AdminAnalyticsDashboard';

export default function AdminDashboardPage() {
  const { user, isLoading } = useAuth();
  const { isAdmin, isCheckingRole } = useAdminRole();

  // If the authentication is still loading, show a loading state
  if (isLoading || isCheckingRole) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Loading admin dashboard...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If not an admin, show unauthorized message
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
            <p>You don't have permission to access this page.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <AdminAnalyticsDashboard />
      </main>
      <Footer />
    </div>
  );
}

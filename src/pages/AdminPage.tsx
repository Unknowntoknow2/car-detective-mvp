
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { FeatureValueEditor } from '@/components/admin/FeatureValueEditor';
import { AdminAnalytics } from '@/components/admin/AdminAnalytics';
import { UserManagement } from '@/components/admin/UserManagement';
import { CalibrationWeights } from '@/components/admin/CalibrationWeights';
import { useAdminRole } from '@/hooks/useAdminRole';
import { Button } from '@/components/ui/button';
import { AuthTestPanel } from '@/components/testing/AuthTestPanel';

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const { isAdmin, isCheckingRole } = useAdminRole();

  // If the authentication is still loading, show a loading state
  if (isLoading || isCheckingRole) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg font-medium">Loading admin panel...</p>
          </div>
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
          <div className="max-w-md text-center p-6 bg-red-50 rounded-lg">
            <h1 className="text-2xl font-bold text-red-700 mb-4">Unauthorized Access</h1>
            <p className="mb-6">You don't have permission to access the admin panel.</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-grow container py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Control Panel</h1>
        
        <Tabs defaultValue="features" className="mb-8">
          <TabsList className="grid grid-cols-4 w-full max-w-3xl">
            <TabsTrigger value="features">Feature Calibration</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="calibration">System Calibration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="features" className="p-4 mt-4 bg-white rounded-lg shadow">
            <FeatureValueEditor />
          </TabsContent>
          
          <TabsContent value="analytics" className="p-4 mt-4 bg-white rounded-lg shadow">
            <AdminAnalytics />
          </TabsContent>
          
          <TabsContent value="users" className="p-4 mt-4 bg-white rounded-lg shadow">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="calibration" className="p-4 mt-4 bg-white rounded-lg shadow">
            <CalibrationWeights />
          </TabsContent>
        </Tabs>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Developer Testing</h2>
            <AuthTestPanel />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

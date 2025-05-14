
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import DealerSubscription from '@/components/dealer/DealerSubscription';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const DealerSubscriptionPage = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-60">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/auth?redirect=/dealer-subscription" />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full bg-white border-b py-4">
        <div className="container">
          <Alert variant="default" className="mb-4 bg-blue-50 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Subscription Management</AlertTitle>
            <AlertDescription className="text-blue-700">
              Manage your dealer subscription plans. Subscribe to premium features to boost your business.
            </AlertDescription>
          </Alert>
        </div>
      </div>
      
      <DealerSubscription />
    </div>
  );
};

export default DealerSubscriptionPage;

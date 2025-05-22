
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/layout/MainLayout';
import { ShieldX } from 'lucide-react';

const AccessDeniedPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="container max-w-md mx-auto py-16 text-center">
        <div className="bg-white p-8 rounded-lg shadow-md dark:bg-gray-800">
          <div className="mb-6 flex justify-center">
            <div className="bg-red-100 p-3 rounded-full">
              <ShieldX className="h-10 w-10 text-red-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access this page. This area may require specific access rights or a premium account.
          </p>
          
          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/">Return to Home</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AccessDeniedPage;

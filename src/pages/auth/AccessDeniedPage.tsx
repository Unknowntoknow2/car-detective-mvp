
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldX } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

const AccessDeniedPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="container max-w-md mx-auto py-12">
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <ShieldX className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h1>
          
          <p className="text-muted-foreground">
            You don't have permission to access this page. Please contact an administrator
            if you believe this is an error.
          </p>
          
          <div className="pt-4">
            <Button asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AccessDeniedPage;

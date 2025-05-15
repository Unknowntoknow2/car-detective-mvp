
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Home } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const AccessDeniedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userRole } = useAuth();
  
  const requiredRole = location.state?.requiredRole || 'appropriate permissions';
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-3 rounded-full">
            <Shield className="h-12 w-12 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. This area requires {requiredRole} access.
          {userRole && (
            <span className="block mt-2">
              Your current role: <span className="font-medium">{userRole}</span>
            </span>
          )}
        </p>
        
        <div className="space-y-3">
          <Button
            onClick={() => navigate('/')}
            className="w-full"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Home Page
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedPage;

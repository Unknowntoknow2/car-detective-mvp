
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, Home, LogOut, ArrowLeft } from 'lucide-react';

interface LocationState {
  message?: string;
  requiredRole?: string;
}

const AccessDeniedPage = () => {
  const { signOut, userDetails, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState || {};
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleGoHome = () => {
    navigate('/');
  };
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };
  
  const message = state.message || 
    (state.requiredRole 
      ? `You need ${state.requiredRole} permissions to access this page` 
      : "You don't have permission to access this page");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center text-center">
          <div className="bg-red-100 p-3 rounded-full">
            <ShieldAlert className="h-12 w-12 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold mt-6 mb-2">Access Denied</h1>
          
          <p className="text-gray-600 mb-6">{message}</p>
          
          <div className="grid grid-cols-1 gap-4 w-full mt-4">
            <Button 
              variant="outline" 
              className="flex items-center justify-center"
              onClick={handleGoBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            
            <Button 
              variant="default" 
              className="flex items-center justify-center"
              onClick={handleGoHome}
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Button>
            
            {user && (
              <Button 
                variant="ghost" 
                className="flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            )}
          </div>
          
          {userDetails?.role && (
            <p className="text-sm text-muted-foreground mt-6">
              You are currently signed in as: <span className="font-medium">{userDetails.role}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedPage;

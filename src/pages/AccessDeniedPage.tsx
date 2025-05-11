
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldX, Home, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const AccessDeniedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get any message passed through navigation state
  const message = location.state?.message || "You don't have permission to access this page";

  return (
    <div className="container max-w-lg mx-auto px-4 py-16 flex flex-col items-center text-center">
      <div className="bg-red-50 p-3 rounded-full mb-6">
        <ShieldX className="h-12 w-12 text-red-500" />
      </div>
      
      <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
      <p className="text-muted-foreground mb-8">{message}</p>
      
      <div className="space-y-4">
        {user ? (
          <Button 
            className="w-full flex items-center justify-center gap-2"
            onClick={() => navigate('/dashboard')}
          >
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Button>
        ) : (
          <Button 
            className="w-full flex items-center justify-center gap-2"
            onClick={() => navigate('/login')}
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </Button>
        )}
        
        <Button 
          variant="outline"
          className="w-full"
          onClick={() => navigate('/')}
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default AccessDeniedPage;


import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface DealerGuardProps {
  children: React.ReactNode;
}

const DealerGuard: React.FC<DealerGuardProps> = ({ children }) => {
  const { user, userRole, isLoading } = useAuth();
  const [isCheckingRole, setIsCheckingRole] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    const checkDealerRole = async () => {
      if (!user) {
        setIsCheckingRole(false);
        return;
      }
      
      // Use the userRole directly from context
      setIsCheckingRole(false);
    };
    
    if (!isLoading) {
      checkDealerRole();
    }
  }, [user, userRole, isLoading]);
  
  if (isLoading || isCheckingRole) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Verifying dealer access...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login-dealer" state={{ from: location.pathname }} replace />;
  }
  
  if (userRole !== 'dealer') {
    // Redirect to access denied page with explanatory message
    toast.error('You need dealer access for this page');
    return <Navigate to="/access-denied" state={{ message: "You need dealer access for this page" }} replace />;
  }
  
  return <>{children}</>;
};

export default DealerGuard;

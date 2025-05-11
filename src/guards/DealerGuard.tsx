
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface DealerGuardProps {
  children: React.ReactNode;
}

const DealerGuard: React.FC<DealerGuardProps> = ({ children }) => {
  const { user } = useAuth();
  const [isDealer, setIsDealer] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    const checkDealerRole = async () => {
      if (!user) {
        setIsDealer(false);
        setIsLoading(false);
        return;
      }
      
      try {
        // Query the user_roles table to check for dealer role
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'dealer')
          .single();
          
        if (error) {
          console.error('Error checking dealer role:', error);
          toast.error('Failed to verify your access permissions');
          setIsDealer(false);
        } else {
          setIsDealer(!!data);
          if (!data) {
            console.warn(`User ${user.id} attempted to access dealer area without proper permissions`);
          }
        }
      } catch (err) {
        console.error('Error checking dealer status:', err);
        toast.error('An unexpected error occurred while checking your access permissions');
        setIsDealer(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkDealerRole();
  }, [user]);
  
  if (isLoading) {
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
    // Redirect to dealer login if not authenticated
    return <Navigate to="/login-dealer" state={{ from: location.pathname }} replace />;
  }
  
  if (!isDealer) {
    // Redirect to access denied page with explanatory message
    return <Navigate to="/access-denied" state={{ message: "You need dealer access for this page" }} replace />;
  }
  
  return <>{children}</>;
};

export default DealerGuard;

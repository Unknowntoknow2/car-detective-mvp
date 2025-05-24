
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const DashboardRouter: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { userDetails } = useAuth();

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        // Check if the user is authenticated
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          console.error('Authentication error:', error);
          navigate('/auth');
          return;
        }

        // Get the user's role from context or metadata
        const role = userDetails?.role || user.user_metadata?.role;
        
        console.log('User role detected:', role);

        // Route based on role
        switch (role) {
          case 'dealer':
            navigate('/dealer/dashboard');
            break;
          case 'admin':
            navigate('/admin/dashboard');
            break;
          default:
            // For individual users, show the individual dashboard
            // Use the same URL to avoid unnecessary redirects
            setIsLoading(false);
            break;
        }
      } catch (err) {
        console.error('Error checking user role:', err);
        toast.error("Failed to load dashboard. Please try again.");
        navigate('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, [navigate, userDetails]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <h2 className="text-xl font-semibold mt-4">Loading dashboard</h2>
          <p className="text-muted-foreground mt-1">Please wait...</p>
        </div>
      </div>
    );
  }

  // If we got here and not redirected, we should show the individual dashboard
  return <div>Individual Dashboard Content</div>;
};

export default DashboardRouter;

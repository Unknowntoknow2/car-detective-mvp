
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const DashboardRouter: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        // Check if the user is authenticated
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          console.error('Authentication error:', error);
          navigate('/auth/login');
          return;
        }

        // Get the user's role from metadata
        const role = user.user_metadata?.role;

        // Route based on role
        switch (role) {
          case 'dealer':
            navigate('/dashboard/dealer');
            break;
          case 'admin':
            navigate('/dashboard/admin');
            break;
          default:
            navigate('/dashboard/individual');
            break;
        }
      } catch (err) {
        console.error('Error checking user role:', err);
        toast.error('Failed to load dashboard. Please try again.');
        navigate('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, [navigate]);

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

  return null;
};

export default DashboardRouter;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import DealerDashboard from '@/pages/DealerDashboard';
import UserDashboardPage from '@/pages/UserDashboardPage';

const DashboardRouter: React.FC = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('user_role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          setIsLoading(false);
          return;
        }

        setUserRole(data?.user_role || 'individual');
      } catch (err) {
        console.error('Error in fetchUserRole:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [user, navigate]);

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

  // Route to appropriate dashboard based on role
  if (userRole === 'dealer') {
    return <DealerDashboard />;
  }

  return <UserDashboardPage />;
};

export default DashboardRouter;

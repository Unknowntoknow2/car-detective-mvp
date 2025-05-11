
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    async function checkUserRole() {
      if (!user) {
        navigate('/login');
        return;
      }

      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('user_role, dealership_name')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching user profile:', error);
          toast.error('Could not load user profile');
          setIsLoading(false);
          return;
        }
        
        // Redirect based on user role
        if (data?.user_role === 'dealer') {
          navigate('/dealer-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      } catch (err) {
        console.error('Error checking user role:', err);
        setIsLoading(false);
      }
    }
    
    checkUserRole();
  }, [user, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <h2 className="text-xl font-semibold mt-4">Loading your dashboard</h2>
          <p className="text-muted-foreground mt-1">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Redirecting to dashboard...</h1>
    </div>
  );
};

export default DashboardPage;

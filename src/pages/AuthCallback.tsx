import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          toast.error('Authentication failed');
          navigate('/');
          return;
        }

        if (data.session) {
          toast.success('Successfully signed in!');
          
          // Redirect to home page or the page they were trying to access
          const redirectTo = new URLSearchParams(window.location.search).get('redirectTo') || '/';
          navigate(redirectTo);
        } else {
          navigate('/');
        }
      } catch (error) {
        toast.error('An unexpected error occurred');
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}
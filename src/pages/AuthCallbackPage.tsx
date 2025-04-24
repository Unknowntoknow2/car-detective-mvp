
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function AuthCallbackPage() {
  const [message, setMessage] = useState('Completing authentication...');
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth or email confirmation callback
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          setMessage('Authentication failed. Please try again.');
          toast.error('Authentication failed: ' + error.message);
          setTimeout(() => navigate('/auth'), 3000);
          return;
        }
        
        setMessage('Authentication successful! Redirecting...');
        toast.success('Authentication successful!');
        setTimeout(() => navigate('/'), 1500);
      } catch (err) {
        console.error('Auth callback error:', err);
        setMessage('Something went wrong. Redirecting to login...');
        toast.error('Authentication process failed');
        setTimeout(() => navigate('/auth'), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold">{message}</h1>
        <div className="animate-pulse text-primary">Please wait...</div>
      </div>
    </div>
  );
}

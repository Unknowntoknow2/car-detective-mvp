
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AuthLayout } from './AuthLayout';

const AuthCallbackPage: React.FC = () => {
  const [message, setMessage] = useState('Completing authentication...');
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Parse the hash fragment from the URL
        const hash = window.location.hash;
        
        if (hash && hash.includes('access_token')) {
          // Set loading message
          setMessage('Authenticating...');
          
          // Get the session from the URL hash
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            setMessage('Authentication failed. Please try again.');
            toast.error('Authentication failed: ' + error.message);
            setTimeout(() => navigate('/auth/signin'), 2000);
            return;
          }
          
          if (data?.session) {
            setMessage('Authentication successful! Redirecting...');
            toast.success('Authentication successful!');
            
            // Fetch user role before redirecting
            const { data: roleData } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', data.session.user.id)
              .single();
            
            // Redirect based on role
            setTimeout(() => {
              if (roleData?.role === 'admin') {
                navigate('/qa');
              } else if (roleData?.role === 'dealer') {
                navigate('/dealer');
              } else {
                navigate('/my-valuations');
              }
            }, 1000);
          } else {
            setMessage('No session found. Redirecting to login...');
            setTimeout(() => navigate('/auth/signin'), 2000);
          }
        } else {
          // No hash fragment, redirect to login
          setMessage('Invalid authentication callback. Redirecting to login...');
          setTimeout(() => navigate('/auth/signin'), 2000);
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setMessage('Something went wrong. Redirecting to login...');
        setTimeout(() => navigate('/auth/signin'), 2000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <AuthLayout
      title="Authentication"
      subtitle={message}
      quote="Security in motion, trust in action."
    >
      <motion.div
        className="flex flex-col items-center justify-center h-40 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="h-12 w-12 text-primary" />
        </motion.div>
        <p className="text-center text-muted-foreground">{message}</p>
      </motion.div>
    </AuthLayout>
  );
};

export default AuthCallbackPage;

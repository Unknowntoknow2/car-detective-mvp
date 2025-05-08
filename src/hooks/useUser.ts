
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email?: string;
  userMetadata?: any;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getUser() {
      try {
        setIsLoading(true);
        setError(null);
        
        // For now, return a mock user since auth isn't set up
        setUser({
          id: '00000000-0000-0000-0000-000000000000',
          email: 'demo@example.com'
        });
      } catch (err) {
        console.error('Error getting user:', err);
        setError('Failed to get user');
      } finally {
        setIsLoading(false);
      }
    }

    getUser();
  }, []);

  return { user, isLoading, error };
}

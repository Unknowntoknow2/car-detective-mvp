
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export const useSavedValuations = () => {
  const { user } = useAuth();
  const [valuations, setValuations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Mock saved valuations
      setValuations([]);
    }
  }, [user]);

  return { valuations, loading };
};

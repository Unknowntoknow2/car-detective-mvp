
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export const useDealerOffers = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Mock offers data
      setOffers([]);
    }
  }, [user]);

  return { offers, loading };
};

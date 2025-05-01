
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthContext';
import { toast } from 'sonner';

export interface SavedValuation {
  id: string;
  user_id: string;
  valuation: any;
  saved_at: string;
}

export function useSavedValuations() {
  const [valuations, setValuations] = useState<SavedValuation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setValuations([]);
      setIsLoading(false);
      return;
    }

    const fetchSavedValuations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('saved_valuations')
          .select('*')
          .eq('user_id', user.id)
          .order('saved_at', { ascending: false });
          
        if (error) throw error;
        
        setValuations(data || []);
      } catch (err) {
        console.error('Error fetching saved valuations:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch saved valuations');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSavedValuations();
  }, [user]);

  const saveValuation = async (valuationData: any) => {
    if (!user) {
      toast.error('You must be logged in to save valuations');
      return false;
    }

    try {
      const { error } = await supabase
        .from('saved_valuations')
        .insert({
          user_id: user.id,
          valuation: valuationData
        });

      if (error) throw error;
      
      toast.success('Valuation saved successfully!');
      
      // Refresh the list
      const { data, error: fetchError } = await supabase
        .from('saved_valuations')
        .select('*')
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false });
        
      if (fetchError) throw fetchError;
      
      setValuations(data || []);
      
      return true;
    } catch (err) {
      console.error('Error saving valuation:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to save valuation');
      return false;
    }
  };

  const deleteValuation = async (id: string) => {
    if (!user) {
      toast.error('You must be logged in to delete valuations');
      return false;
    }

    try {
      const { error } = await supabase
        .from('saved_valuations')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast.success('Valuation deleted successfully!');
      
      // Update local state
      setValuations(prevValuations => 
        prevValuations.filter(valuation => valuation.id !== id)
      );
      
      return true;
    } catch (err) {
      console.error('Error deleting valuation:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to delete valuation');
      return false;
    }
  };

  return {
    valuations,
    isLoading,
    error,
    saveValuation,
    deleteValuation
  };
}

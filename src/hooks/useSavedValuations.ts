
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { SavedValuation } from './types/savedValuation';

export function useSavedValuations() {
  const [valuations, setValuations] = useState<SavedValuation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load saved valuations when user changes
  useEffect(() => {
    const loadSavedValuations = async () => {
      if (!user) {
        setValuations([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('saved_valuations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform data to match SavedValuation interface with valuationDetails property
        const transformedData: SavedValuation[] = (data || []).map(item => ({
          ...item,
          saved_at: item.created_at, // Map created_at to saved_at to satisfy the interface
          valuationDetails: {
            year: item.year,
            make: item.make,
            model: item.model,
            estimatedValue: item.valuation,
            confidenceScore: item.confidence_score
          }
        }));

        setValuations(transformedData);
      } catch (err) {
        console.error('Error loading saved valuations:', err);
        setError('Failed to load your saved valuations');
        toast.error('Failed to load your saved valuations');
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedValuations();
  }, [user]);

  // Function to delete a saved valuation
  const deleteValuation = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('saved_valuations')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update state to remove the deleted valuation
      setValuations(valuations.filter(v => v.id !== id));
      toast.success('Valuation removed successfully');
    } catch (err) {
      console.error('Error deleting valuation:', err);
      toast.error('Failed to remove valuation');
    }
  };

  // Function to refresh data
  const refreshValuations = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('saved_valuations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match SavedValuation interface with valuationDetails property
      const transformedData: SavedValuation[] = (data || []).map(item => ({
        ...item,
        saved_at: item.created_at, // Map created_at to saved_at to satisfy the interface
        valuationDetails: {
          year: item.year,
          make: item.make,
          model: item.model,
          estimatedValue: item.valuation,
          confidenceScore: item.confidence_score
        }
      }));

      setValuations(transformedData);
      return true;
    } catch (err) {
      console.error('Error refreshing valuations:', err);
      setError('Failed to refresh valuations');
      toast.error('Failed to refresh valuations');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    valuations,
    isLoading,
    error,
    deleteValuation,
    refreshValuations
  };
}

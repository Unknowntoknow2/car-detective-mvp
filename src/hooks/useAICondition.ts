
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AICondition } from '@/types/photo';

export function useAICondition(valuationId?: string) {
  const [conditionData, setConditionData] = useState<AICondition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!valuationId) {
      setIsLoading(false);
      return;
    }

    async function fetchAICondition() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get the latest photo score entry for this valuation
        const { data, error } = await supabase
          .from('photo_scores')
          .select('metadata')
          .eq('valuation_id', valuationId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        if (error) throw new Error(error.message);
        
        // If we found metadata and it contains condition information
        if (data?.metadata) {
          const metadata = data.metadata as any;
          
          if (metadata.condition) {
            setConditionData({
              condition: metadata.condition,
              confidenceScore: metadata.confidenceScore || 0,
              issuesDetected: metadata.issuesDetected || [],
              aiSummary: metadata.aiSummary
            });
          }
        }
      } catch (err) {
        console.error('Error fetching AI condition:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch AI condition data'));
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchAICondition();
  }, [valuationId]);

  return { conditionData, isLoading, error };
}

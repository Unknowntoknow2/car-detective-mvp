
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AICondition } from '@/types/photo';

interface UseAIConditionResult {
  conditionData: AICondition | null;
  isLoading: boolean;
  error: string;
}

export function useAICondition(valuationId: string): UseAIConditionResult {
  const [conditionData, setConditionData] = useState<AICondition | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchConditionData() {
      if (!valuationId) return;
      
      setIsLoading(true);
      setError('');
      
      try {
        // First try to fetch from photo_condition table
        const { data, error } = await supabase
          .from('photo_condition')
          .select('*')
          .eq('valuation_id', valuationId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (error) {
          if (error.code === 'PGRST116') {
            // No data found, this is not an error case
            setConditionData(null);
          } else {
            throw error;
          }
        } else if (data) {
          // Normalize the condition to ensure it's one of the allowed values
          let normalizedCondition: "Excellent" | "Good" | "Fair" | "Poor" = "Good";
          
          if (data.condition === "Excellent" || 
              data.condition === "Good" || 
              data.condition === "Fair" || 
              data.condition === "Poor") {
            normalizedCondition = data.condition;
          } else if (data.condition?.toLowerCase().includes('excellent')) {
            normalizedCondition = "Excellent";
          } else if (data.condition?.toLowerCase().includes('good')) {
            normalizedCondition = "Good";
          } else if (data.condition?.toLowerCase().includes('fair')) {
            normalizedCondition = "Fair";
          } else if (data.condition?.toLowerCase().includes('poor')) {
            normalizedCondition = "Poor";
          }
          
          setConditionData({
            condition: normalizedCondition,
            confidenceScore: data.confidence_score || 75,
            aiSummary: data.ai_summary || '',
            issuesDetected: data.issues_detected || [],
            photoUrl: data.photo_url,
            bestPhotoUrl: data.best_photo_url
          });
        }
      } catch (err: any) {
        console.error('Error fetching AI condition data:', err);
        setError(err.message || 'Failed to fetch condition data');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchConditionData();
  }, [valuationId]);
  
  return { conditionData, isLoading, error };
}

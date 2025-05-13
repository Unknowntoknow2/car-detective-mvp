
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';

export interface GeneratedCondition {
  condition: string;
  confidenceScore: number;
  issuesDetected?: string[];
  summary?: string;
  photoUrl?: string;
}

export function useAICondition(valuationId: string) {
  const [generatedCondition, setGeneratedCondition] = useState<GeneratedCondition | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  useEffect(() => {
    async function fetchConditionData() {
      if (!valuationId) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        // Fetch from photo_condition_scores table
        const { data, error: fetchError } = await supabase
          .from('photo_condition_scores')
          .select('*')
          .eq('valuation_id', valuationId)
          .single();
        
        if (fetchError) {
          console.error('Error fetching condition data:', fetchError);
          setError(fetchError.message);
          return;
        }
        
        if (data) {
          // Fetch best photo URL as well
          const { data: photoData } = await supabase
            .from('valuation_photos')
            .select('photo_url, score')
            .eq('valuation_id', valuationId)
            .order('score', { ascending: false })
            .limit(1)
            .single();
          
          setGeneratedCondition({
            condition: mapScoreToCondition(data.condition_score),
            confidenceScore: data.confidence_score,
            issuesDetected: data.issues || [],
            summary: data.summary,
            photoUrl: photoData?.photo_url
          });
        } else {
          // If no data in database, try localStorage
          const tempData = localStorage.getItem('temp_ai_condition');
          if (tempData) {
            setGeneratedCondition(JSON.parse(tempData));
          }
        }
      } catch (err: any) {
        console.error('Error in useAICondition:', err);
        setError(err.message || 'Failed to fetch condition data');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchConditionData();
  }, [valuationId]);
  
  // Map numeric score to condition string
  function mapScoreToCondition(score: number): string {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  }
  
  return { 
    generatedCondition, 
    isLoading, 
    error,
    conditionData: generatedCondition  // Add this to make it compatible with existing code
  };
}

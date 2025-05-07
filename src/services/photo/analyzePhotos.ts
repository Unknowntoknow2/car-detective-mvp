
import { supabase } from '@/integrations/supabase/client';
import { PhotoScoringResult, AICondition } from '@/types/photo';

export async function analyzePhotos(photoUrls: string[], valuationId: string): Promise<PhotoScoringResult> {
  try {
    // Call the Supabase Edge Function for image analysis
    const { data, error } = await supabase.functions.invoke('score-image', {
      body: { photoUrls, valuationId }
    });
    
    if (error) {
      throw new Error(`Failed to analyze photos: ${error.message}`);
    }
    
    if (!data || !data.scores) {
      throw new Error('Invalid response from photo analysis service');
    }
    
    return {
      overallScore: data.overallScore || 
        (data.scores.reduce((sum: number, item: any) => sum + (item.score || 0), 0) / data.scores.length),
      individualScores: data.scores.map((score: any) => ({
        url: score.url,
        score: score.score,
        isPrimary: score.isPrimary || false,
        explanation: score.explanation
      })),
      aiCondition: data.aiCondition as AICondition
    };
  } catch (error) {
    console.error('Error analyzing photos:', error);
    throw error;
  }
}

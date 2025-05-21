
import { AICondition, PhotoScore } from '@/types/photo';
import { supabase } from '@/integrations/supabase/client';

interface PhotoAnalysisResult {
  overallScore: number;
  individualScores: PhotoScore[];
  aiCondition?: AICondition;
}

export async function analyzePhotos(photoUrls: string[], valuationId: string): Promise<PhotoAnalysisResult> {
  if (!photoUrls || photoUrls.length === 0) {
    throw new Error('No photos provided for analysis');
  }

  try {
    const { data, error } = await supabase.functions.invoke('score-image', {
      body: { photoUrls, valuationId }
    });

    if (error) {
      throw new Error(`Failed to analyze photos: ${error.message}`);
    }

    if (!data || !data.scores || !Array.isArray(data.scores)) {
      throw new Error('Invalid response from photo analysis service');
    }

    // Calculate overall score based on individual scores
    const scores = data.scores as { url: string; score: number }[];
    const overallScore = scores.length > 0 
      ? scores.reduce((sum, item) => sum + item.score, 0) / scores.length
      : 0;

    // Map to our PhotoScore type
    const individualScores: PhotoScore[] = scores.map(score => ({
      url: score.url,
      score: score.score,
      isPrimary: false,
      explanation: undefined
    }));

    return {
      overallScore,
      individualScores,
      aiCondition: data.aiCondition
    };
  } catch (err) {
    console.error('Error analyzing photos:', err);
    throw err;
  }
}

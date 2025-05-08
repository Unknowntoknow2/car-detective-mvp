
import { supabase } from '@/integrations/supabase/client';
import { PhotoScoringResult, AICondition, PhotoScore } from '@/types/photo';

/**
 * Analyzes photos using the photo analysis edge function
 */
export async function analyzePhotos(photoUrls: string[], valuationId: string): Promise<PhotoScoringResult> {
  try {
    if (!photoUrls.length) {
      return {
        score: 0,
        photoUrl: '',
        condition: 'Fair',
        confidenceScore: 0,
        overallScore: 0,
        individualScores: [],
        error: 'No photos provided'
      };
    }

    // Call the photo analysis edge function
    const { data, error } = await supabase.functions.invoke('score-image', {
      body: {
        photoUrls,
        valuationId
      }
    });

    if (error) {
      console.error('Error analyzing photos:', error);
      return {
        score: 0,
        photoUrl: '',
        condition: 'Fair',
        confidenceScore: 0,
        overallScore: 0,
        individualScores: [],
        error: error.message || 'Failed to analyze photos'
      };
    }

    if (!data || !Array.isArray(data.scores)) {
      throw new Error('Invalid response from photo analysis service');
    }

    // Process the response data
    const result: PhotoScoringResult = {
      score: data.score || 0,
      photoUrl: data.bestPhotoUrl || data.scores[0]?.url || '',
      condition: (data.aiCondition?.condition || 'Fair') as any,
      confidenceScore: data.aiCondition?.confidenceScore || 0,
      overallScore: data.score || 0,
      individualScores: data.scores.map((score: any) => ({
        url: score.url,
        score: score.score,
        isPrimary: score.isPrimary || false
      })) || [],
      aiCondition: data.aiCondition as AICondition
    };

    return result;
  } catch (error: any) {
    console.error('Error in analyzePhotos:', error);
    return {
      score: 0,
      photoUrl: '',
      condition: 'Fair',
      confidenceScore: 0,
      overallScore: 0,
      individualScores: [],
      error: error.message || 'Failed to analyze photos'
    };
  }
}

export const uploadAndAnalyzePhotos = async (files: File[], valuationId: string): Promise<PhotoScoringResult> => {
  try {
    // Upload files to storage
    const uploadPromises = files.map(async (file) => {
      const filename = `${valuationId}/${Math.random().toString(36).substring(2)}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('vehicle-photos')
        .upload(filename, file);
        
      if (error) throw error;
      
      const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/vehicle-photos/${data?.path}`;
      return url;
    });
    
    const photoUrls = await Promise.all(uploadPromises);
    
    // Analyze the photos
    return await analyzePhotos(photoUrls, valuationId);
  } catch (error: any) {
    console.error('Error in uploadAndAnalyzePhotos:', error);
    return {
      score: 0,
      photoUrl: '',
      condition: 'Fair',
      confidenceScore: 0,
      overallScore: 0,
      individualScores: [],
      error: error.message || 'Failed to upload and analyze photos'
    };
  }
};

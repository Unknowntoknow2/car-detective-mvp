
import { supabase } from '@/integrations/supabase/client';
import { AICondition, PhotoScore } from '@/types/photo';
import { PhotoUploadResponse, PhotoAnalysisResult } from './types';

/**
 * Uploads and analyzes multiple photos
 */
export async function uploadAndAnalyzePhotos(
  valuationId: string, 
  files: File[]
): Promise<PhotoAnalysisResult | null> {
  try {
    if (!valuationId || !files.length) {
      throw new Error("Missing valuation ID or files");
    }
    
    // Create form data to send to the edge function
    const formData = new FormData();
    formData.append('valuationId', valuationId);
    
    // Add files to formData
    files.forEach((file, index) => {
      formData.append(`photos[${index}]`, file);
    });
    
    // Call the analyze-photos edge function with FormData
    const { data, error } = await supabase.functions
      .invoke('analyze-photos', {
        body: formData,
      });
    
    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }
    
    if (!data) {
      throw new Error("No data returned from photo analysis");
    }
    
    // Use type assertion for the response data
    const responseData = data as PhotoUploadResponse;
    
    return {
      photoUrls: responseData.photoUrls || [],
      score: (responseData.confidenceScore || 0) / 100, // Convert to 0-1 range
      aiCondition: responseData.condition ? {
        condition: responseData.condition as 'Excellent' | 'Good' | 'Fair' | 'Poor',
        confidenceScore: responseData.confidenceScore || 0,
        issuesDetected: responseData.issuesDetected || [],
        aiSummary: responseData.aiSummary
      } : undefined,
      individualScores: responseData.individualScores?.map(score => ({
        url: score.url,
        score: score.score
      })) || []
    };
  } catch (err) {
    console.error('Photo upload and analysis error:', err);
    throw err;
  }
}

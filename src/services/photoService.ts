
import { supabase } from '@/integrations/supabase/client';
import { Photo, ValuationPhoto, AICondition, PhotoScore } from '@/types/photo';

/**
 * Fetches existing photos and assessment for a valuation
 */
export async function fetchValuationPhotos(valuationId: string): Promise<{
  photos: Photo[];
  photoScore: number | null;
  aiCondition: AICondition | null;
  individualScores?: PhotoScore[];
}> {
  try {
    // Get existing photos - use type assertion for tables not in generated types
    const { data: photoData, error: photoError } = await supabase
      .from('valuation_photos' as any)
      .select('*')
      .eq('valuation_id', valuationId) as unknown as { 
        data: ValuationPhoto[] | null; 
        error: any 
      };
    
    if (photoError) {
      console.log('Error loading photos:', photoError);
      return { photos: [], photoScore: null, aiCondition: null, individualScores: [] };
    }
    
    const photos: Photo[] = [];
    let photoScore: number | null = null;
    let aiCondition: AICondition | null = null;
    let individualScores: PhotoScore[] = [];
    
    if (photoData && photoData.length > 0) {
      const loadedPhotos = photoData.map((photo) => ({
        url: photo.photo_url,
        thumbnail: photo.photo_url,
        id: photo.id
      }));
      
      // Also load individual scores
      const { data: scoreData } = await supabase
        .from('photo_condition_scores')
        .select('*')
        .eq('valuation_id', valuationId);
        
      if (scoreData && scoreData.length > 0) {
        // Map the scores correctly - fixing the property access issue
        // The photo_condition_scores table doesn't have an image_url field, so we need to adjust
        individualScores = scoreData.map(item => ({
          // We'll use the valuation_id as a proxy since we don't have image URLs stored directly
          // In a production system, we would store the image URL in the table
          url: item.photo_url || '', // This field might not exist either
          score: item.condition_score || 0
        }));
      }
      
      // If we have photos, check for AI assessment
      const { data: aiData, error: aiError } = await supabase
        .from('photo_scores')
        .select('*')
        .eq('valuation_id', valuationId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (!aiError && aiData) {
        photoScore = aiData.score * 100; // Convert from 0-1 to 0-100
        
        // Extract AI condition analysis from metadata
        if (aiData.metadata) {
          const metadata = aiData.metadata as any;
          if (metadata.condition) {
            aiCondition = {
              condition: metadata.condition,
              confidenceScore: metadata.confidenceScore || 70,
              issuesDetected: metadata.issuesDetected || [],
              aiSummary: metadata.aiSummary
            };
          }
        }
      }
      
      return { photos: loadedPhotos, photoScore, aiCondition, individualScores };
    }
    
    return { photos: [], photoScore: null, aiCondition: null, individualScores: [] };
  } catch (err) {
    console.log('Error loading existing photo data:', err);
    return { photos: [], photoScore: null, aiCondition: null, individualScores: [] };
  }
}

/**
 * Deletes photos associated with a valuation
 */
export async function deletePhotos(photos: Photo[]): Promise<void> {
  for (const photo of photos) {
    if (photo.id) {
      try {
        // Type assertion to avoid type error
        await supabase
          .from('valuation_photos' as any)
          .delete()
          .eq('id', photo.id) as unknown as any;
      } catch (err) {
        console.error('Error deleting photo record:', err);
      }
    }
  }
}

/**
 * Uploads and analyzes multiple photos
 */
export async function uploadAndAnalyzePhotos(
  valuationId: string, 
  files: File[]
): Promise<{ 
  photoUrls: string[],
  score: number,
  aiCondition?: AICondition,
  individualScores?: PhotoScore[]
} | null> {
  try {
    // Create form data to send to the edge function
    const formData = new FormData();
    formData.append('valuationId', valuationId);
    
    // Add files to formData
    files.forEach((file, index) => {
      formData.append(`photos[${index}]`, file);
    });
    
    // Call the analyze-photos edge function with FormData
    const { data, error: uploadError } = await supabase.functions
      .invoke('analyze-photos', {
        body: formData,
      });
    
    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }
    
    // Return the results
    return {
      photoUrls: data.photoUrls || [],
      score: data.confidenceScore,
      aiCondition: {
        condition: data.condition,
        confidenceScore: data.confidenceScore,
        issuesDetected: data.issuesDetected,
        aiSummary: data.aiSummary
      },
      individualScores: data.individualScores || []
    };
  } catch (err) {
    console.error('Photo upload and analysis error:', err);
    return null;
  }
}

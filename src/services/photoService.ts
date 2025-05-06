
import { supabase } from '@/integrations/supabase/client';
import { Photo, ValuationPhoto, AICondition, PhotoScore } from '@/types/photo';

/**
 * Fetches existing photos and assessment for a valuation
 */
export async function fetchValuationPhotos(valuationId: string): Promise<{
  photos: Photo[];
  photoScore: number | null;
  aiCondition: AICondition | null;
  individualScores: PhotoScore[];
}> {
  try {
    if (!valuationId) {
      return { photos: [], photoScore: null, aiCondition: null, individualScores: [] };
    }
    
    // Get existing photos - use type assertion for tables not in generated types
    const { data: photoData, error: photoError } = await supabase
      .from('valuation_photos' as any)
      .select('*')
      .eq('valuation_id', valuationId) as unknown as { 
        data: ValuationPhoto[] | null; 
        error: any 
      };
    
    if (photoError) {
      console.error('Error loading photos:', photoError);
      return { photos: [], photoScore: null, aiCondition: null, individualScores: [] };
    }
    
    const photos: Photo[] = [];
    let photoScore: number | null = null;
    let aiCondition: AICondition | null = null;
    const individualScores: PhotoScore[] = [];
    
    if (photoData && photoData.length > 0) {
      const loadedPhotos = photoData.map((photo) => ({
        url: photo.photo_url,
        thumbnail: photo.photo_url,
        id: photo.id
      }));
      
      photos.push(...loadedPhotos);
      
      // Get individual photo scores
      const { data: scoreData, error: scoreError } = await supabase
        .from('photo_condition_scores')
        .select('*')
        .eq('valuation_id', valuationId)
        .order('confidence_score', { ascending: false });
        
      if (!scoreError && scoreData && scoreData.length > 0) {
        // Get highest confidence score 
        const bestScore = scoreData.find(score => score.confidence_score >= 0.7);
        
        // Map all scores to the expected format
        scoreData.forEach(score => {
          // Use the appropriate field name based on the database schema
          const imageUrl = 'photo_url' in score ? score.photo_url : 
                           'image_url' in score ? score.image_url : '';
          
          if (imageUrl) {
            individualScores.push({
              url: imageUrl,
              score: score.condition_score || 0
            });
          }
        });
        
        // If we have a best score, create the AI condition
        if (bestScore) {
          // Set overall photo score from the best score
          photoScore = bestScore.condition_score * 100;
          
          // Create AI condition from best score
          aiCondition = {
            condition: bestScore.condition_score >= 0.8 ? 'Excellent' : 
                      bestScore.condition_score >= 0.6 ? 'Good' : 
                      bestScore.condition_score >= 0.4 ? 'Fair' : 'Poor',
            confidenceScore: Math.round(bestScore.confidence_score * 100),
            issuesDetected: Array.isArray(bestScore.issues) ? bestScore.issues : [],
            aiSummary: bestScore.summary || undefined
          };
        }
      } else if (scoreError) {
        console.error('Error loading photo scores:', scoreError);
      }
      
      return { 
        photos, 
        photoScore, 
        aiCondition, 
        individualScores 
      };
    }
    
    return { photos: [], photoScore: null, aiCondition: null, individualScores: [] };
  } catch (err) {
    console.error('Error loading existing photo data:', err);
    return { photos: [], photoScore: null, aiCondition: null, individualScores: [] };
  }
}

/**
 * Deletes photos associated with a valuation
 */
export async function deletePhotos(photos: Photo[]): Promise<void> {
  if (!photos.length) return;
  
  for (const photo of photos) {
    if (photo.id) {
      try {
        // Delete from valuation_photos table
        await supabase
          .from('valuation_photos' as any)
          .delete()
          .eq('id', photo.id) as unknown as any;
          
        // Extract file path from URL to delete from storage
        const url = new URL(photo.url);
        const filePath = url.pathname.split('/').slice(2).join('/');
        
        if (filePath) {
          // Also try to remove from storage
          await supabase.storage
            .from('vehicle-photos')
            .remove([filePath]);
        }
      } catch (err) {
        console.error('Error deleting photo:', err);
      }
    }
  }
  
  // Also clean up any condition scores
  try {
    const fileUrls = photos.map(p => p.url);
    if (fileUrls.length > 0) {
      // Delete corresponding scores
      await supabase
        .from('photo_condition_scores')
        .delete()
        .in('image_url', fileUrls);
    }
  } catch (error) {
    console.error('Error cleaning up condition scores:', error);
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
    
    // Return the results with proper typing
    return {
      photoUrls: data.photoUrls || [],
      score: data.confidenceScore / 100, // Convert to 0-1 range
      aiCondition: data.condition ? {
        condition: data.condition as 'Excellent' | 'Good' | 'Fair' | 'Poor',
        confidenceScore: data.confidenceScore,
        issuesDetected: Array.isArray(data.issuesDetected) ? data.issuesDetected : [],
        aiSummary: data.aiSummary
      } : undefined,
      individualScores: data.individualScores?.map((score: any) => ({
        url: score.url,
        score: score.score
      })) || []
    };
  } catch (err) {
    console.error('Photo upload and analysis error:', err);
    throw err;
  }
}

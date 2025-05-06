
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
          // Safely handle the image URL field which might be in different properties
          let imageUrl = '';
          
          // Check both possible URL properties and handle them safely
          if ('photo_url' in score) {
            imageUrl = (score as any).photo_url || '';
          } else if ('image_url' in score) {
            imageUrl = (score as any).image_url || '';
          }
          
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
            // Properly handle issues array with type casting
            issuesDetected: Array.isArray(bestScore.issues) ? 
              bestScore.issues.map((issue: any) => String(issue)) : [], 
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

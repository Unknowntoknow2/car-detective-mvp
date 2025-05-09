
import { supabase } from '@/integrations/supabase/client';
import { Photo, PhotoScore, PhotoScoringResult, AICondition } from '@/types/photo';
import { analyzePhotos } from './photo/analyzePhotos';

export async function scorePhotos(photoUrls: string[], valuationId: string): Promise<PhotoScoringResult> {
  try {
    const result = await analyzePhotos(photoUrls, valuationId);
    return result;
  } catch (error: any) {
    console.error('Error scoring photos:', error);
    return {
      photoScore: 0,
      individualScores: [],
      score: 0,
      photoUrls: photoUrls,
      bestPhotoUrl: '',
      aiCondition: {
        condition: 'Fair',
        confidenceScore: 0
      }
    };
  }
}

export async function uploadAndAnalyzePhotos(files: File[], valuationId: string): Promise<PhotoScoringResult> {
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
    
    const uploadedUrls = await Promise.all(uploadPromises);
    
    // Analyze the photos
    const result = await scorePhotos(uploadedUrls, valuationId);
    return {
      ...result,
      photoUrls: uploadedUrls // Ensure photoUrls is included in the result
    };
  } catch (error: any) {
    console.error('Error in uploadAndAnalyzePhotos:', error);
    return {
      photoScore: 0,
      individualScores: [],
      score: 0,
      photoUrls: [], // Fix: empty array instead of undefined photoUrls
      bestPhotoUrl: '',
      aiCondition: {
        condition: 'Fair',
        confidenceScore: 0
      }
    };
  }
}

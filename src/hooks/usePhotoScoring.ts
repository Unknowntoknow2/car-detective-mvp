import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Photo, PhotoScore, PhotoScoringResult, AICondition, PhotoAnalysisResult } from '@/types/photo';
import { scorePhotos } from '@/services/photoService';

interface UsePhotoScoringOptions {
  valuationId: string;
}

export function usePhotoScoring({ valuationId }: UsePhotoScoringOptions) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PhotoAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const uploadPhoto = useCallback(async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const filename = `${valuationId}/${Math.random().toString(36).substring(2)}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('vehicle-photos')
        .upload(filename, file);
        
      if (error) throw error;
      
      const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/vehicle-photos/${data?.path}`;
      
      const newPhoto: Photo = {
        id: filename,
        file: file,
        name: file.name,
        url: url,
        uploading: false,
        uploaded: true
      };
      
      setPhotos(prevPhotos => [...prevPhotos, newPhoto]);
      return newPhoto;
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to upload photo';
      setError(errorMsg);
      console.error('Photo upload error:', error);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [valuationId]);
  
  const analyzePhotos = useCallback(async () => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Get all photos that have been uploaded
      const uploadedPhotos = photos.filter(photo => photo.uploaded && photo.file);
      
      if (uploadedPhotos.length === 0) {
        throw new Error('No uploaded photos to analyze');
      }
      
      // Extract URLs from photos
      const photoUrls = uploadedPhotos.map(photo => photo.url as string);
      
      // Call API to score photos
      const result = await scorePhotos(photoUrls, valuationId);
      
      const analysisData: PhotoAnalysisResult = {
        photoUrls: photoUrls,
        score: result.photoScore || result.score || 0,
        aiCondition: result.aiCondition,
        individualScores: result.individualScores
      };
      
      setAnalysisResult(analysisData);
      
      // Update photos with scores if individual scores are available
      if (result.individualScores && result.individualScores.length > 0) {
        const updatedPhotos = [...photos];
        
        result.individualScores.forEach(scoreData => {
          const photoIndex = updatedPhotos.findIndex(p => p.url === scoreData.url);
          if (photoIndex >= 0) {
            updatedPhotos[photoIndex] = {
              ...updatedPhotos[photoIndex],
              score: scoreData.score,
              isPrimary: scoreData.isPrimary
            };
          }
        });
        
        setPhotos(updatedPhotos);
      }
      
      return result;
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to analyze photos';
      setError(errorMsg);
      console.error('Photo analysis error:', error);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [photos, valuationId]);
  
  const removePhoto = useCallback((photoId: string) => {
    setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== photoId));
  }, []);
  
  // Mark a photo as uploading
  const markPhotoAsUploading = useCallback((photoId: string) => {
    setPhotos(prevPhotos => 
      prevPhotos.map(photo => 
        photo.id === photoId ? { ...photo, uploading: true } : photo
      )
    );
  }, []);
  
  // Mark a photo as uploaded
  const markPhotoAsUploaded = useCallback((photoId: string) => {
    setPhotos(prevPhotos => 
      prevPhotos.map(photo => 
        photo.id === photoId ? { ...photo, uploading: false, uploaded: true } : photo
      )
    );
  }, []);
  
  return {
    photos,
    isAnalyzing,
    analysisResult,
    error,
    uploadPhoto: () => {}, // implement or remove if not needed
    analyzePhotos,
    removePhoto,
    markPhotoAsUploading,
    markPhotoAsUploaded
  };
}

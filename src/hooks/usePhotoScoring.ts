
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { analyzePhotos } from '@/services/photo/analyzePhotos';
import { uploadPhotos as uploadPhotoService } from '@/services/photo/uploadPhotoService';
import { Photo, PhotoScore, PhotoScoringResult, AICondition } from '@/types/photo';

// Interface used for internal implementation
interface ScoringResult {
  score: number;
  aiCondition: AICondition;
  individualScores: PhotoScore[];
  photos?: Photo[];
}

export function usePhotoScoring(valuationId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoScores, setPhotoScores] = useState<PhotoScore[]>([]);
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const [aiCondition, setAiCondition] = useState<AICondition | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);

  // Function to convert uploaded photos to Photo objects
  const processUploadedPhotos = useCallback((files: File[]): Promise<Photo[]> => {
    return Promise.all(
      files.map((file) => {
        const id = Math.random().toString(36).substring(2, 11);
        return {
          id,
          url: URL.createObjectURL(file),
          metadata: {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
          },
          uploading: true
        };
      })
    );
  }, []);

  // Function to upload photos and get scores
  const uploadPhotos = useCallback(async (files: File[]): Promise<Photo[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Process files to Photo objects for UI display
      const processedPhotos = await processUploadedPhotos(files);
      setPhotos(processedPhotos);
      
      // Upload photos to storage
      const uploadedPhotos = await uploadPhotoService(files, valuationId);
      
      // Analyze photos
      const result = await analyzePhotos(uploadedPhotos.map(p => p.url), valuationId);
      
      // Update state with scores
      setPhotoScores(result.individualScores);
      setOverallScore(result.score);
      setAiCondition(result.aiCondition);
      
      // Update photos with scores
      const updatedPhotos = uploadedPhotos.map((photo) => {
        const matchingScore = result.individualScores.find(
          (score) => score.url === photo.url
        );
        
        return {
          ...photo,
          score: matchingScore?.score || 0,
          isPrimary: matchingScore?.isPrimary || false,
        };
      });
      
      setPhotos(updatedPhotos);
      return updatedPhotos;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process photos';
      setError(errorMessage);
      console.error('Photo scoring error:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [valuationId, processUploadedPhotos]);

  // Function to score previously uploaded photos
  const scoreExistingPhotos = useCallback(async (photoUrls: string[]): Promise<ScoringResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await analyzePhotos(photoUrls, valuationId);
      setPhotoScores(result.individualScores);
      setOverallScore(result.score);
      setAiCondition(result.aiCondition);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to score photos';
      setError(errorMessage);
      console.error('Photo scoring error:', err);
      return {
        score: 0,
        aiCondition: {
          condition: null,
          confidenceScore: 0,
          issuesDetected: ['Failed to process photos']
        },
        individualScores: []
      };
    } finally {
      setIsLoading(false);
    }
  }, [valuationId]);

  // Prepare and return the result object conforming to PhotoScoringResult interface
  const result: PhotoScoringResult = {
    overallScore: overallScore || 0,
    individualScores: photoScores,
    aiCondition: aiCondition,
    photos: photos,
    photoScore: overallScore,
    error: error,
    uploadPhotos: uploadPhotos as unknown as (files: File[]) => Promise<Photo[]>
  };

  return { ...result, isLoading, scoreExistingPhotos };
}
